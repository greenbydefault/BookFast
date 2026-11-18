-- Offene Zahlungen (payment_pending) blockieren den Slot wie bestätigte Buchungen.
-- Urlaub für Service und Mitarbeiter wird serverseitig geprüft und dem Widget geliefert.

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
        AND status IN ('new', 'pending', 'pending_approval', 'payment_pending', 'confirmed')
        AND (start_time < v_buffered_end AND end_time > v_buffered_start)
    ) INTO v_has_conflict;

    SELECT public.is_slot_reserved(p_object_id, v_buffered_start, v_buffered_end, p_session_id)
    INTO v_has_reservation;

    RETURN NOT v_has_conflict AND NOT v_has_reservation;
END;
$function$;

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
        AND b.status IN ('new', 'pending', 'pending_approval', 'payment_pending', 'confirmed')
        AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        AND (b.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    ) booking_entries;

    SELECT COALESCE(jsonb_agg(entry), '[]'::jsonb) INTO v_reservations FROM (
        SELECT jsonb_build_object(
            'id', sr.id, 'date', d::date,
            'start_time', to_char((GREATEST(sr.start_time, (d::date::timestamp AT TIME ZONE 'Europe/Berlin')) AT TIME ZONE 'Europe/Berlin'), 'HH24:MI'),
            'end_time', to_char((LEAST(sr.end_time, (((d::date + 1)::timestamp) AT TIME ZONE 'Europe/Berlin')) AT TIME ZONE 'Europe/Berlin'), 'HH24:MI'),
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
            WHERE b.object_id = p_object_id AND b.status IN ('new', 'pending', 'pending_approval', 'payment_pending', 'confirmed')
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
        AND b.status IN ('new', 'pending', 'pending_approval', 'payment_pending', 'confirmed')
        AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
        AND (b.end_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    ) booking_entries;

    SELECT COALESCE(jsonb_agg(entry), '[]'::jsonb) INTO v_reservations FROM (
        SELECT jsonb_build_object(
            'id', sr.id, 'date', d::date,
            'start_time', to_char((GREATEST(sr.start_time, (d::date::timestamp AT TIME ZONE 'Europe/Berlin')) AT TIME ZONE 'Europe/Berlin'), 'HH24:MI'),
            'end_time', to_char((LEAST(sr.end_time, (((d::date + 1)::timestamp) AT TIME ZONE 'Europe/Berlin')) AT TIME ZONE 'Europe/Berlin'), 'HH24:MI'),
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
            WHERE b.object_id = p_object_id AND b.status IN ('new', 'pending', 'pending_approval', 'payment_pending', 'confirmed')
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

CREATE OR REPLACE FUNCTION public.is_vacation_blocked(
    p_object_id uuid, p_service_id uuid, p_staff_id uuid,
    p_start_time timestamptz, p_end_time timestamptz
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
    v_workspace_id uuid;
    v_start_date date;
    v_end_date date;
BEGIN
    SELECT o.workspace_id INTO v_workspace_id FROM public.objects o WHERE o.id = p_object_id;
    IF v_workspace_id IS NULL THEN RETURN false; END IF;

    v_start_date := (p_start_time AT TIME ZONE 'Europe/Berlin')::date;
    -- Übernachtung endet am Abreisetag, der zählt nicht als belegter Tag.
    v_end_date := ((p_end_time - interval '1 second') AT TIME ZONE 'Europe/Berlin')::date;
    IF v_end_date < v_start_date THEN v_end_date := v_start_date; END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.vacations v
        WHERE v.workspace_id = v_workspace_id
        AND v.start_date <= v_end_date
        AND v.end_date >= v_start_date
        AND (
            v.scope::text = 'workspace'
            OR (v.scope::text = 'object' AND v.object_id = p_object_id)
            OR (v.scope::text = 'service' AND p_service_id IS NOT NULL AND v.service_id = p_service_id)
            OR (v.scope::text = 'staff' AND p_staff_id IS NOT NULL AND v.staff_id = p_staff_id)
        )
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_widget_vacations(p_site_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE v_workspace_id uuid;
BEGIN
    SELECT s.workspace_id INTO v_workspace_id FROM public.sites s WHERE s.id = p_site_id;
    IF v_workspace_id IS NULL THEN RETURN '[]'::jsonb; END IF;

    RETURN COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
            'start_date', v.start_date,
            'end_date', v.end_date,
            'scope', v.scope,
            'service_id', v.service_id,
            'staff_id', v.staff_id
        ))
        FROM public.vacations v
        WHERE v.workspace_id = v_workspace_id
        AND v.scope::text IN ('service', 'staff')
        AND v.end_date >= CURRENT_DATE
    ), '[]'::jsonb);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.is_vacation_blocked(uuid, uuid, uuid, timestamptz, timestamptz) TO service_role;
REVOKE EXECUTE ON FUNCTION public.is_vacation_blocked(uuid, uuid, uuid, timestamptz, timestamptz) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.get_widget_vacations(uuid) TO anon, authenticated;
