-- Align calendar availability RPC output with check_availability conflict rules.

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
