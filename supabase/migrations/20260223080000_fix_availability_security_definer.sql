-- Fix availability functions to use SECURITY DEFINER
-- Without this, the anon key (used by the booking widget) cannot see bookings
-- due to RLS policies, causing all slots to appear available.

-- 1. check_availability → SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.check_availability(
    p_object_id uuid, p_start_time timestamptz, p_end_time timestamptz,
    p_buffer_before integer DEFAULT 0, p_buffer_after integer DEFAULT 0, p_session_id text DEFAULT NULL
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
    v_buffered_start timestamptz;
    v_buffered_end timestamptz;
    v_has_conflict boolean;
    v_has_reservation boolean;
BEGIN
    v_buffered_start := p_start_time - (p_buffer_before || ' minutes')::interval;
    v_buffered_end := p_end_time + (p_buffer_after || ' minutes')::interval;

    SELECT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE object_id = p_object_id
        AND status IN ('new', 'pending', 'pending_approval', 'confirmed')
        AND (start_time < v_buffered_end AND end_time > v_buffered_start)
    ) INTO v_has_conflict;

    SELECT public.is_slot_reserved(p_object_id, v_buffered_start, v_buffered_end, p_session_id)
    INTO v_has_reservation;

    RETURN NOT v_has_conflict AND NOT v_has_reservation;
END;
$function$;

-- 2. is_slot_reserved (4-arg) → SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_slot_reserved(
    p_object_id uuid, p_start_time timestamptz, p_end_time timestamptz, p_exclude_session_id text DEFAULT NULL
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.slot_reservations WHERE object_id = p_object_id AND expires_at > now() AND (p_exclude_session_id IS NULL OR browser_session_id IS DISTINCT FROM p_exclude_session_id) AND (start_time < p_end_time AND end_time > p_start_time));
END;
$function$;

-- 3. get_availability_for_range (3-arg) → SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_availability_for_range(
    p_object_id uuid, p_start_date date, p_end_date date
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE v_result jsonb; v_bookings jsonb; v_reservations jsonb; v_obj_workspace_id uuid;
BEGIN
    SELECT o.workspace_id INTO v_obj_workspace_id FROM public.objects o WHERE o.id = p_object_id;

    SELECT COALESCE(jsonb_agg(entry ORDER BY entry_date, entry_start), '[]'::jsonb) INTO v_bookings
    FROM (
        SELECT
            jsonb_build_object(
                'id', b.id,
                'date', d::date,
                'start_time', to_char(
                    GREATEST(
                        b.start_time,
                        (d::date::timestamp AT TIME ZONE 'Europe/Berlin')
                    ) AT TIME ZONE 'Europe/Berlin',
                    'HH24:MI'
                ),
                'end_time', to_char(
                    LEAST(
                        b.end_time,
                        (((d::date + 1)::timestamp) AT TIME ZONE 'Europe/Berlin')
                    ) AT TIME ZONE 'Europe/Berlin',
                    'HH24:MI'
                ),
                'status', b.status
            ) AS entry,
            d::date AS entry_date,
            GREATEST(
                b.start_time,
                (d::date::timestamp AT TIME ZONE 'Europe/Berlin')
            ) AS entry_start
        FROM public.bookings b
        CROSS JOIN LATERAL generate_series(
            (b.start_time AT TIME ZONE 'Europe/Berlin')::date,
            (b.end_time AT TIME ZONE 'Europe/Berlin')::date,
            '1 day'::interval
        ) d
        WHERE b.object_id = p_object_id
        AND b.status IN ('new', 'pending', 'pending_approval', 'confirmed')
        AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        AND (b.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    ) booking_entries;

    SELECT COALESCE(jsonb_agg(entry), '[]'::jsonb) INTO v_reservations FROM (
        SELECT jsonb_build_object(
            'id', sr.id, 'date', d::date,
            'start_time', to_char(GREATEST(sr.start_time, (d::date AT TIME ZONE 'Europe/Berlin')::timestamptz), 'HH24:MI'),
            'end_time', to_char(LEAST(sr.end_time, ((d::date + 1) AT TIME ZONE 'Europe/Berlin')::timestamptz - interval '1 second'), 'HH24:MI'),
            'status', 'reservation'
        ) as entry
        FROM public.slot_reservations sr,
        LATERAL generate_series((sr.start_time AT TIME ZONE 'Europe/Berlin')::date, (sr.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
        WHERE sr.object_id = p_object_id AND sr.expires_at > now()
        AND (sr.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        AND (sr.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    ) sub;

    SELECT jsonb_build_object('bookings', v_bookings || v_reservations, 'blocked_dates', COALESCE((
        SELECT jsonb_agg(DISTINCT blocked_date) FROM (
            SELECT d::date as blocked_date
            FROM public.bookings b JOIN public.services s ON s.id = b.service_id
            CROSS JOIN LATERAL generate_series((b.start_time AT TIME ZONE 'Europe/Berlin')::date, (b.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
            WHERE b.object_id = p_object_id AND b.status IN ('new', 'pending', 'pending_approval', 'confirmed')
            AND s.service_type IN ('daily', 'overnight')
            AND d::date >= p_start_date
            AND d::date <= p_end_date
            UNION ALL
            SELECT d::date as blocked_date
            FROM public.slot_reservations sr JOIN public.services s ON s.id = sr.service_id
            CROSS JOIN LATERAL generate_series((sr.start_time AT TIME ZONE 'Europe/Berlin')::date, (sr.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
            WHERE sr.object_id = p_object_id AND sr.expires_at > now()
            AND s.service_type IN ('daily', 'overnight')
            AND d::date >= p_start_date AND d::date <= p_end_date
            UNION ALL
            SELECT vd::date as blocked_date
            FROM public.vacations v,
            LATERAL generate_series(v.start_date, v.end_date, '1 day'::interval) vd
            WHERE v.workspace_id = v_obj_workspace_id
            AND (
                (COALESCE(v.scope::text, 'workspace') = 'workspace')
                OR (v.scope::text = 'object' AND v.object_id = p_object_id)
            )
            AND vd::date >= p_start_date AND vd::date <= p_end_date
        ) blocked
    ), '[]'::jsonb)) INTO v_result;
    RETURN v_result;
END;
$function$;

-- 4. get_availability_for_range (4-arg, with p_session_id) → SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_availability_for_range(
    p_object_id uuid, p_start_date date, p_end_date date, p_session_id text DEFAULT NULL
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE v_result jsonb; v_bookings jsonb; v_reservations jsonb; v_obj_workspace_id uuid;
BEGIN
    SELECT o.workspace_id INTO v_obj_workspace_id FROM public.objects o WHERE o.id = p_object_id;

    SELECT COALESCE(jsonb_agg(entry ORDER BY entry_date, entry_start), '[]'::jsonb) INTO v_bookings
    FROM (
        SELECT
            jsonb_build_object(
                'id', b.id,
                'date', d::date,
                'start_time', to_char(
                    GREATEST(
                        b.start_time,
                        (d::date::timestamp AT TIME ZONE 'Europe/Berlin')
                    ) AT TIME ZONE 'Europe/Berlin',
                    'HH24:MI'
                ),
                'end_time', to_char(
                    LEAST(
                        b.end_time,
                        (((d::date + 1)::timestamp) AT TIME ZONE 'Europe/Berlin')
                    ) AT TIME ZONE 'Europe/Berlin',
                    'HH24:MI'
                ),
                'status', b.status
            ) AS entry,
            d::date AS entry_date,
            GREATEST(
                b.start_time,
                (d::date::timestamp AT TIME ZONE 'Europe/Berlin')
            ) AS entry_start
        FROM public.bookings b
        CROSS JOIN LATERAL generate_series(
            (b.start_time AT TIME ZONE 'Europe/Berlin')::date,
            (b.end_time AT TIME ZONE 'Europe/Berlin')::date,
            '1 day'::interval
        ) d
        WHERE b.object_id = p_object_id
        AND b.status IN ('new', 'pending', 'pending_approval', 'confirmed')
        AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        AND (b.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    ) booking_entries;

    SELECT COALESCE(jsonb_agg(entry), '[]'::jsonb) INTO v_reservations FROM (
        SELECT jsonb_build_object(
            'id', sr.id, 'date', d::date,
            'start_time', to_char(GREATEST(sr.start_time, (d::date AT TIME ZONE 'Europe/Berlin')::timestamptz), 'HH24:MI'),
            'end_time', to_char(LEAST(sr.end_time, ((d::date + 1) AT TIME ZONE 'Europe/Berlin')::timestamptz - interval '1 second'), 'HH24:MI'),
            'status', 'reservation'
        ) as entry
        FROM public.slot_reservations sr,
        LATERAL generate_series((sr.start_time AT TIME ZONE 'Europe/Berlin')::date, (sr.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
        WHERE sr.object_id = p_object_id AND sr.expires_at > now()
        AND (p_session_id IS NULL OR sr.browser_session_id IS DISTINCT FROM p_session_id)
        AND (sr.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        AND (sr.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    ) sub;

    SELECT jsonb_build_object('bookings', v_bookings || v_reservations, 'blocked_dates', COALESCE((
        SELECT jsonb_agg(DISTINCT blocked_date) FROM (
            SELECT d::date as blocked_date
            FROM public.bookings b JOIN public.services s ON s.id = b.service_id
            CROSS JOIN LATERAL generate_series((b.start_time AT TIME ZONE 'Europe/Berlin')::date, (b.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
            WHERE b.object_id = p_object_id AND b.status IN ('new', 'pending', 'pending_approval', 'confirmed')
            AND s.service_type IN ('daily', 'overnight')
            AND d::date >= p_start_date
            AND d::date <= p_end_date
            UNION ALL
            SELECT d::date as blocked_date
            FROM public.slot_reservations sr JOIN public.services s ON s.id = sr.service_id
            CROSS JOIN LATERAL generate_series((sr.start_time AT TIME ZONE 'Europe/Berlin')::date, (sr.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
            WHERE sr.object_id = p_object_id AND sr.expires_at > now()
            AND (p_session_id IS NULL OR sr.browser_session_id IS DISTINCT FROM p_session_id)
            AND s.service_type IN ('daily', 'overnight')
            AND d::date >= p_start_date AND d::date <= p_end_date
            UNION ALL
            SELECT vd::date as blocked_date
            FROM public.vacations v,
            LATERAL generate_series(v.start_date, v.end_date, '1 day'::interval) vd
            WHERE v.workspace_id = v_obj_workspace_id
            AND (
                (COALESCE(v.scope::text, 'workspace') = 'workspace')
                OR (v.scope::text = 'object' AND v.object_id = p_object_id)
            )
            AND vd::date >= p_start_date AND vd::date <= p_end_date
        ) blocked
    ), '[]'::jsonb)) INTO v_result;
    RETURN v_result;
END;
$function$;
