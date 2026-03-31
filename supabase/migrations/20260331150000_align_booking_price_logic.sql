-- Align widget and booking RPC pricing with current booking constraints.

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
    v_addon record;
    v_addon_selection jsonb;
    v_addon_units integer;
    v_booking_addons jsonb := '[]'::jsonb;
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
        FOR v_addon IN
            SELECT id, price, pricing_type::text AS pricing_type
            FROM public.addons
            WHERE id = ANY(p_addon_ids)
        LOOP
            v_addon_selection := NULL;
            v_addon_units := 0;

            IF p_addon_selections IS NOT NULL THEN
                SELECT sel
                INTO v_addon_selection
                FROM jsonb_array_elements(p_addon_selections) AS sel
                WHERE NULLIF(sel->>'addon_id', '')::uuid = v_addon.id
                LIMIT 1;
            END IF;

            IF v_addon_selection IS NOT NULL THEN
                SELECT
                    COALESCE(SUM(GREATEST(COALESCE(NULLIF(item->>'qty', '')::integer, 1), 1)), 0)
                INTO v_addon_units
                FROM jsonb_array_elements(COALESCE(v_addon_selection->'items', '[]'::jsonb)) AS item;

                SELECT
                    v_addon_units + COALESCE(SUM(GREATEST(COALESCE(NULLIF(guest_item->>'qty', '')::integer, 1), 1)), 0)
                INTO v_addon_units
                FROM jsonb_array_elements(COALESCE(v_addon_selection->'guests', '[]'::jsonb)) AS guest,
                     LATERAL jsonb_array_elements(COALESCE(guest->'items', '[]'::jsonb)) AS guest_item;
            END IF;

            IF COALESCE(v_addon_units, 0) = 0 THEN
                v_addon_units := CASE
                    WHEN COALESCE(v_addon.pricing_type, 'per_booking') IN ('per_person', 'per_guest', 'per_ticket') THEN v_guest_count
                    ELSE 1
                END;
            END IF;

            v_booking_addons := v_booking_addons || jsonb_build_array(
                jsonb_build_object(
                    'addon_id', v_addon.id,
                    'price_per_unit', COALESCE(v_addon.price, 0),
                    'quantity', v_addon_units,
                    'total_price', COALESCE(v_addon.price, 0) * v_addon_units
                )
            );
            v_addons_price := v_addons_price + (COALESCE(v_addon.price, 0) * v_addon_units);
        END LOOP;
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

    IF jsonb_array_length(v_booking_addons) > 0 THEN
        INSERT INTO public.booking_addons (
            booking_id,
            addon_id,
            price_per_unit,
            quantity,
            total_price
        )
        SELECT
            v_booking_id,
            NULLIF(item->>'addon_id', '')::uuid,
            COALESCE(NULLIF(item->>'price_per_unit', '')::decimal, 0),
            GREATEST(COALESCE(NULLIF(item->>'quantity', '')::integer, 1), 1),
            COALESCE(NULLIF(item->>'total_price', '')::decimal, 0)
        FROM jsonb_array_elements(v_booking_addons) AS item;
    END IF;

    IF p_staff_id IS NOT NULL THEN
        INSERT INTO public.booking_staff (booking_id, staff_id)
        VALUES (v_booking_id, p_staff_id);
    END IF;

    PERFORM public.track_event(
        p_site_id,
        'booking_request',
        gen_random_uuid(),
        jsonb_build_object(
            'booking_id', v_booking_id,
            'amount', v_total_price,
            'guest_count', v_guest_count
        )
    );

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;

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
        'services', (
            SELECT COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'id', s.id,
                        'object_id', s.object_id,
                        'linked_object_ids', COALESCE(
                            (
                                SELECT jsonb_agg(so.object_id ORDER BY so.object_id)
                                FROM public.service_objects so
                                WHERE so.service_id = s.id
                            ),
                            '[]'::jsonb
                        ),
                        'name', s.name,
                        'description', s.description,
                        'price', s.price,
                        'price_type', COALESCE(s.price_type, 'per_unit'),
                        'service_type', s.service_type,
                        'duration_minutes', s.duration_minutes,
                        'cleaning_fee', COALESCE(s.cleaning_fee, 0),
                        'bookable_days', COALESCE(s.bookable_days, '[]'::jsonb),
                        'booking_window_start', s.booking_window_start,
                        'booking_window_end', s.booking_window_end,
                        'min_advance_hours', COALESCE(s.min_advance_hours, 0),
                        'fixed_start_times', COALESCE(s.fixed_start_times, false),
                        'buffer_before_minutes', COALESCE(s.buffer_before_minutes, 0),
                        'buffer_after_minutes', COALESCE(s.buffer_after_minutes, 0),
                        'checkin_start', s.checkin_start,
                        'checkin_end', s.checkin_end,
                        'checkout_start', s.checkout_start,
                        'checkout_end', s.checkout_end,
                        'min_nights', s.min_nights,
                        'deposit_enabled', COALESCE(s.deposit_enabled, false),
                        'deposit_percent', COALESCE(s.deposit_percent, 0)
                    )
                ),
                '[]'::jsonb
            )
            FROM public.services s
            WHERE s.workspace_id = v_workspace_id AND s.status = 'active'
        ),
        'addons', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', a.id, 'name', a.name, 'price', a.price, 'pricing_type', a.pricing_type, 'linked_service_ids', COALESCE((SELECT jsonb_agg(ads.service_id) FROM public.addon_services ads WHERE ads.addon_id = a.id), '[]'::jsonb), 'items', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', ai.name, 'quantity', ai.quantity, 'variants', COALESCE((SELECT jsonb_agg(aiv.name) FROM public.addon_item_variants aiv WHERE aiv.addon_item_id = ai.id), '[]'::jsonb))) FROM public.addon_items ai WHERE ai.addon_id = a.id), '[]'::jsonb))), '[]'::jsonb) FROM public.addons a WHERE a.workspace_id = v_workspace_id AND a.status = 'active'),
        'staff', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', st.id, 'name', st.name, 'image_url', st.image_url, 'linked_service_ids', COALESCE((SELECT jsonb_agg(ss.service_id) FROM public.staff_services ss WHERE ss.staff_id = st.id), '[]'::jsonb))), '[]'::jsonb) FROM public.staff st WHERE st.workspace_id = v_workspace_id AND st.status = 'active')
    ) INTO v_result;
    RETURN v_result;
END;
$function$;
