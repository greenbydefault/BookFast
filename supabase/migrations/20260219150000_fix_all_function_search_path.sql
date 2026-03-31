-- Fix role mutable search_path on all public functions (Supabase advisor)
-- https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- 1. auto_complete_bookings
CREATE OR REPLACE FUNCTION public.auto_complete_bookings()
RETURNS void LANGUAGE plpgsql SET search_path = '' AS $function$
BEGIN
    UPDATE public.bookings
    SET status = 'completed', updated_at = now()
    WHERE status = 'confirmed' AND end_time < now();
END;
$function$;

-- 2. check_availability
CREATE OR REPLACE FUNCTION public.check_availability(
    p_object_id uuid, p_start_time timestamptz, p_end_time timestamptz,
    p_buffer_before integer DEFAULT 0, p_buffer_after integer DEFAULT 0, p_session_id text DEFAULT NULL
)
RETURNS boolean LANGUAGE plpgsql SET search_path = '' AS $function$
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

-- 3. cleanup_expired_reservations
CREATE OR REPLACE FUNCTION public.cleanup_expired_reservations()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE deleted_count integer;
BEGIN
    DELETE FROM public.slot_reservations WHERE expires_at < now();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$function$;

-- 4. create_booking_request
CREATE OR REPLACE FUNCTION public.create_booking_request(
    p_site_id uuid, p_object_id uuid, p_service_id uuid,
    p_start_time timestamptz, p_end_time timestamptz,
    p_customer_name text, p_customer_email text, p_customer_phone text, p_customer_notes text,
    p_addon_ids uuid[], p_voucher_code text DEFAULT NULL, p_staff_id uuid DEFAULT NULL,
    p_guest_count integer DEFAULT 1, p_addon_selections jsonb DEFAULT NULL,
    p_customer_address text DEFAULT NULL, p_customer_city text DEFAULT NULL, p_customer_zip text DEFAULT NULL
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
    v_booking_id uuid;
    v_base_price decimal;
    v_service_price decimal;
    v_price_type text;
    v_service_type text;
    v_cleaning_fee decimal;
    v_addons_price decimal;
    v_discount_amount decimal;
    v_total_price decimal;
    v_addon_id uuid;
    v_workspace_id uuid;
    v_guest_count integer;
    v_nights integer;
    v_subtotal decimal;
    v_voucher_discount_type text;
    v_voucher_discount_value decimal;
    v_voucher_valid_from timestamptz;
    v_voucher_valid_until timestamptz;
    v_voucher_max_uses_total integer;
    v_voucher_times_used integer;
BEGIN
    v_guest_count := GREATEST(COALESCE(p_guest_count, 1), 1);

    SELECT price, price_type, service_type, cleaning_fee, workspace_id
    INTO v_base_price, v_price_type, v_service_type, v_cleaning_fee, v_workspace_id
    FROM public.services
    WHERE id = p_service_id;

    IF v_base_price IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Service not found');
    END IF;

    v_nights := CASE
        WHEN v_service_type = 'overnight' THEN GREATEST(1, CEIL(EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 86400.0)::integer)
        ELSE 1
    END;

    v_service_price := COALESCE(v_base_price, 0);
    IF v_price_type IS DISTINCT FROM 'per_total' THEN
        IF v_service_type = 'overnight' THEN
            v_service_price := v_service_price * v_nights;
        END IF;
        IF v_price_type = 'per_person' THEN
            v_service_price := v_service_price * v_guest_count;
        END IF;
    END IF;
    v_service_price := v_service_price + COALESCE(v_cleaning_fee, 0);

    v_addons_price := 0;
    IF p_addon_ids IS NOT NULL AND array_length(p_addon_ids, 1) > 0 THEN
        SELECT COALESCE(SUM(price), 0) INTO v_addons_price
        FROM public.addons WHERE id = ANY(p_addon_ids);
    END IF;

    v_subtotal := v_service_price + v_addons_price;
    v_discount_amount := 0;

    IF p_voucher_code IS NOT NULL AND btrim(p_voucher_code) <> '' THEN
        SELECT discount_type, discount_value, valid_from, valid_until, max_uses_total, times_used
        INTO v_voucher_discount_type, v_voucher_discount_value, v_voucher_valid_from, v_voucher_valid_until, v_voucher_max_uses_total, v_voucher_times_used
        FROM public.vouchers
        WHERE workspace_id = v_workspace_id
          AND upper(code) = upper(p_voucher_code)
          AND status = 'active';

        IF FOUND
           AND (v_voucher_valid_from IS NULL OR v_voucher_valid_from <= now())
           AND (v_voucher_valid_until IS NULL OR v_voucher_valid_until >= now())
           AND (v_voucher_max_uses_total IS NULL OR COALESCE(v_voucher_times_used, 0) < v_voucher_max_uses_total) THEN
            IF COALESCE(v_voucher_discount_type, '') IN ('percentage', 'percent') THEN
                v_discount_amount := v_subtotal * (COALESCE(v_voucher_discount_value, 0) / 100);
            ELSE
                v_discount_amount := LEAST(COALESCE(v_voucher_discount_value, 0), v_subtotal);
            END IF;
        END IF;
    END IF;

    v_total_price := GREATEST(0, v_subtotal - v_discount_amount);

    INSERT INTO public.bookings (
        workspace_id, object_id, service_id, start_time, end_time,
        customer_name, customer_email, customer_phone, customer_notes, status,
        service_price, addons_price, discount_amount, total_price,
        guest_count, addon_selections, customer_address, customer_city, customer_zip
    ) VALUES (
        v_workspace_id, p_object_id, p_service_id, p_start_time, p_end_time,
        p_customer_name, p_customer_email, p_customer_phone, p_customer_notes, 'pending',
        v_service_price, v_addons_price, v_discount_amount, v_total_price,
        v_guest_count, p_addon_selections, p_customer_address, p_customer_city, p_customer_zip
    ) RETURNING id INTO v_booking_id;

    IF p_addon_ids IS NOT NULL THEN
        FOREACH v_addon_id IN ARRAY p_addon_ids
        LOOP
            INSERT INTO public.booking_addons (booking_id, addon_id) VALUES (v_booking_id, v_addon_id);
        END LOOP;
    END IF;

    IF p_staff_id IS NOT NULL THEN
        INSERT INTO public.booking_staff (booking_id, staff_id) VALUES (v_booking_id, p_staff_id);
    END IF;

    PERFORM public.track_event(p_site_id, 'booking_request', NULL::uuid,
        jsonb_build_object('booking_id', v_booking_id, 'amount', v_total_price, 'guest_count', v_guest_count));

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;

-- 5. get_availability_for_range (3-arg)
CREATE OR REPLACE FUNCTION public.get_availability_for_range(
    p_object_id uuid, p_start_date date, p_end_date date
)
RETURNS jsonb LANGUAGE plpgsql SET search_path = '' AS $function$
DECLARE v_result jsonb; v_bookings jsonb; v_reservations jsonb;
BEGIN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', b.id, 'date', (b.start_time AT TIME ZONE 'Europe/Berlin')::date,
        'start_time', to_char(b.start_time AT TIME ZONE 'Europe/Berlin', 'HH24:MI'),
        'end_time', to_char(b.end_time AT TIME ZONE 'Europe/Berlin', 'HH24:MI'), 'status', b.status
    )), '[]'::jsonb) INTO v_bookings
    FROM public.bookings b
    WHERE b.object_id = p_object_id AND b.status NOT IN ('cancelled', 'rejected')
    AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date;

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
            SELECT (b.start_time AT TIME ZONE 'Europe/Berlin')::date as blocked_date
            FROM public.bookings b JOIN public.services s ON s.id = b.service_id
            WHERE b.object_id = p_object_id AND b.status NOT IN ('cancelled', 'rejected')
            AND s.service_type IN ('daily', 'overnight')
            AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
            AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
            UNION ALL
            SELECT d::date as blocked_date
            FROM public.slot_reservations sr JOIN public.services s ON s.id = sr.service_id
            CROSS JOIN LATERAL generate_series((sr.start_time AT TIME ZONE 'Europe/Berlin')::date, (sr.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
            WHERE sr.object_id = p_object_id AND sr.expires_at > now()
            AND s.service_type IN ('daily', 'overnight')
            AND d::date >= p_start_date AND d::date <= p_end_date
        ) blocked
    ), '[]'::jsonb)) INTO v_result;
    RETURN v_result;
END;
$function$;

-- 6. get_availability_for_range (4-arg)
CREATE OR REPLACE FUNCTION public.get_availability_for_range(
    p_object_id uuid, p_start_date date, p_end_date date, p_session_id text DEFAULT NULL
)
RETURNS jsonb LANGUAGE plpgsql SET search_path = '' AS $function$
DECLARE v_result jsonb; v_bookings jsonb; v_reservations jsonb;
BEGIN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', b.id, 'date', (b.start_time AT TIME ZONE 'Europe/Berlin')::date,
        'start_time', to_char(b.start_time AT TIME ZONE 'Europe/Berlin', 'HH24:MI'),
        'end_time', to_char(b.end_time AT TIME ZONE 'Europe/Berlin', 'HH24:MI'), 'status', b.status
    )), '[]'::jsonb) INTO v_bookings
    FROM public.bookings b
    WHERE b.object_id = p_object_id AND b.status NOT IN ('cancelled', 'rejected')
    AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
    AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date;

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
            SELECT (b.start_time AT TIME ZONE 'Europe/Berlin')::date as blocked_date
            FROM public.bookings b JOIN public.services s ON s.id = b.service_id
            WHERE b.object_id = p_object_id AND b.status NOT IN ('cancelled', 'rejected')
            AND s.service_type IN ('daily', 'overnight')
            AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date >= p_start_date
            AND (b.start_time AT TIME ZONE 'Europe/Berlin')::date <= p_end_date
            UNION ALL
            SELECT d::date as blocked_date
            FROM public.slot_reservations sr JOIN public.services s ON s.id = sr.service_id
            CROSS JOIN LATERAL generate_series((sr.start_time AT TIME ZONE 'Europe/Berlin')::date, (sr.end_time AT TIME ZONE 'Europe/Berlin')::date, '1 day'::interval) d
            WHERE sr.object_id = p_object_id AND sr.expires_at > now()
            AND (p_session_id IS NULL OR sr.browser_session_id IS DISTINCT FROM p_session_id)
            AND s.service_type IN ('daily', 'overnight')
            AND d::date >= p_start_date AND d::date <= p_end_date
        ) blocked
    ), '[]'::jsonb)) INTO v_result;
    RETURN v_result;
END;
$function$;

-- 7. get_widget_data
CREATE OR REPLACE FUNCTION public.get_widget_data(p_site_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE v_workspace_id uuid; v_payout_status text; v_result jsonb;
BEGIN
    SELECT s.workspace_id INTO v_workspace_id FROM public.sites s WHERE s.id = p_site_id;
    IF v_workspace_id IS NULL THEN RETURN jsonb_build_object('error', 'Site not found'); END IF;

    SELECT w.payout_status::text INTO v_payout_status FROM public.workspaces w WHERE w.id = v_workspace_id;

    SELECT jsonb_build_object(
        'workspace_id', v_workspace_id, 'payout_status', COALESCE(v_payout_status, 'inactive'),
        'objects', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', o.id, 'name', o.name, 'description', o.description, 'capacity', o.capacity, 'bookable_days', COALESCE(o.bookable_days, '[]'::jsonb), 'booking_window_start', o.booking_window_start, 'booking_window_end', o.booking_window_end, 'buffer_before_minutes', COALESCE(o.buffer_before_minutes, 0), 'buffer_after_minutes', COALESCE(o.buffer_after_minutes, 0))), '[]'::jsonb) FROM public.objects o WHERE o.workspace_id = v_workspace_id AND o.status = 'active'),
        'services', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', s.id, 'object_id', s.object_id, 'name', s.name, 'description', s.description, 'price', s.price, 'service_type', s.service_type, 'duration_minutes', s.duration_minutes, 'cleaning_fee', COALESCE(s.cleaning_fee, 0), 'bookable_days', COALESCE(s.bookable_days, '[]'::jsonb), 'booking_window_start', s.booking_window_start, 'booking_window_end', s.booking_window_end, 'min_advance_hours', COALESCE(s.min_advance_hours, 0), 'fixed_start_times', COALESCE(s.fixed_start_times, false), 'buffer_before_minutes', COALESCE(s.buffer_before_minutes, 0), 'buffer_after_minutes', COALESCE(s.buffer_after_minutes, 0), 'checkin_start', s.checkin_start, 'checkin_end', s.checkin_end, 'checkout_start', s.checkout_start, 'checkout_end', s.checkout_end, 'min_nights', s.min_nights, 'deposit_enabled', COALESCE(s.deposit_enabled, false), 'deposit_percent', COALESCE(s.deposit_percent, 0))), '[]'::jsonb) FROM public.services s WHERE s.workspace_id = v_workspace_id AND s.status = 'active'),
        'addons', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', a.id, 'name', a.name, 'price', a.price, 'pricing_type', a.pricing_type, 'linked_service_ids', COALESCE((SELECT jsonb_agg(ads.service_id) FROM public.addon_services ads WHERE ads.addon_id = a.id), '[]'::jsonb), 'items', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', ai.name, 'quantity', ai.quantity, 'variants', COALESCE((SELECT jsonb_agg(aiv.name) FROM public.addon_item_variants aiv WHERE aiv.addon_item_id = ai.id), '[]'::jsonb))) FROM public.addon_items ai WHERE ai.addon_id = a.id), '[]'::jsonb))), '[]'::jsonb) FROM public.addons a WHERE a.workspace_id = v_workspace_id AND a.status = 'active'),
        'staff', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', st.id, 'name', st.name, 'image_url', st.image_url, 'linked_service_ids', COALESCE((SELECT jsonb_agg(ss.service_id) FROM public.staff_services ss WHERE ss.staff_id = st.id), '[]'::jsonb))), '[]'::jsonb) FROM public.staff st WHERE st.workspace_id = v_workspace_id AND st.status = 'active')
    ) INTO v_result;
    RETURN v_result;
END;
$function$;

-- 8. handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$function$;

-- 9. is_slot_reserved (3-arg, SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_slot_reserved(
    p_object_id uuid, p_start_time timestamptz, p_end_time timestamptz
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.slot_reservations WHERE object_id = p_object_id AND expires_at > now() AND start_time < p_end_time AND end_time > p_start_time);
END;
$function$;

-- 10. is_slot_reserved (4-arg)
CREATE OR REPLACE FUNCTION public.is_slot_reserved(
    p_object_id uuid, p_start_time timestamptz, p_end_time timestamptz, p_exclude_session_id text DEFAULT NULL
)
RETURNS boolean LANGUAGE plpgsql SET search_path = '' AS $function$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.slot_reservations WHERE object_id = p_object_id AND expires_at > now() AND (p_exclude_session_id IS NULL OR browser_session_id IS DISTINCT FROM p_exclude_session_id) AND (start_time < p_end_time AND end_time > p_start_time));
END;
$function$;

-- 11. next_invoice_number
CREATE OR REPLACE FUNCTION public.next_invoice_number(ws_id uuid)
RETURNS integer LANGUAGE plpgsql SET search_path = '' AS $function$
DECLARE next_num integer;
BEGIN
    SELECT COALESCE(MAX(invoice_number), 0) + 1 INTO next_num FROM public.bookings WHERE workspace_id = ws_id;
    RETURN next_num;
END;
$function$;

-- 12. ping_site
CREATE OR REPLACE FUNCTION public.ping_site(site_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    UPDATE public.sites SET is_active = true, last_ping = now() WHERE id = site_id;
END;
$function$;

-- 13. track_event
CREATE OR REPLACE FUNCTION public.track_event(p_site_id uuid, p_event_type text, p_session_id uuid, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    INSERT INTO public.analytics_events (site_id, event_type, session_id, metadata) VALUES (p_site_id, p_event_type, p_session_id, p_metadata);
END;
$function$;

-- 14. update_email_templates_updated_at
CREATE OR REPLACE FUNCTION public.update_email_templates_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- 15. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- 16. validate_voucher
CREATE OR REPLACE FUNCTION public.validate_voucher(p_workspace_id uuid, p_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE v_voucher record;
BEGIN
    SELECT * INTO v_voucher FROM public.vouchers
    WHERE workspace_id = p_workspace_id AND upper(code) = upper(p_code) AND status = 'active';

    IF v_voucher.id IS NULL THEN RETURN jsonb_build_object('valid', false, 'error', 'Gutscheincode nicht gefunden'); END IF;
    IF v_voucher.valid_from > now() THEN RETURN jsonb_build_object('valid', false, 'error', 'Gutschein ist noch nicht gültig'); END IF;
    IF v_voucher.valid_until IS NOT NULL AND v_voucher.valid_until < now() THEN RETURN jsonb_build_object('valid', false, 'error', 'Gutschein ist abgelaufen'); END IF;
    IF v_voucher.max_uses_total IS NOT NULL AND v_voucher.times_used >= v_voucher.max_uses_total THEN RETURN jsonb_build_object('valid', false, 'error', 'Gutschein wurde bereits zu oft verwendet'); END IF;

    RETURN jsonb_build_object('valid', true, 'id', v_voucher.id, 'name', v_voucher.name, 'discount_type', v_voucher.discount_type, 'discount_value', v_voucher.discount_value);
END;
$function$;
