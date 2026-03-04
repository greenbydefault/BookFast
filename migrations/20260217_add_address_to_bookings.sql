-- Add address fields to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_city TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_zip TEXT;

-- Drop all overloads of create_booking_request to avoid ambiguity
DROP FUNCTION IF EXISTS create_booking_request(uuid, uuid, uuid, timestamptz, timestamptz, text, text, text, text, uuid[], text, uuid, int, jsonb);

-- Recreate with address support
CREATE OR REPLACE FUNCTION create_booking_request(
    p_site_id UUID,
    p_object_id UUID,
    p_service_id UUID,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_customer_notes TEXT,
    p_addon_ids UUID[],
    p_voucher_code TEXT DEFAULT NULL,
    p_staff_id UUID DEFAULT NULL,
    p_guest_count INT DEFAULT 1,
    p_addon_selections JSONB DEFAULT NULL,
    p_customer_address TEXT DEFAULT NULL,
    p_customer_city TEXT DEFAULT NULL,
    p_customer_zip TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_booking_id UUID;
    v_service_price DECIMAL;
    v_cleaning_fee DECIMAL;
    v_addon_price DECIMAL;
    v_total_price DECIMAL;
    v_addon_id UUID;
    v_workspace_id UUID;
BEGIN
    -- Get service details including workspace_id and cleaning_fee
    SELECT price, cleaning_fee, workspace_id INTO v_service_price, v_cleaning_fee, v_workspace_id
    FROM services
    WHERE id = p_service_id;

    IF v_service_price IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Service not found');
    END IF;

    -- Calculate add-ons price
    v_addon_price := 0;
    IF p_addon_ids IS NOT NULL AND array_length(p_addon_ids, 1) > 0 THEN
        SELECT COALESCE(SUM(price), 0) INTO v_addon_price
        FROM addons
        WHERE id = ANY(p_addon_ids);
    END IF;

    -- Calculate total price
    v_total_price := v_service_price + COALESCE(v_cleaning_fee, 0) + v_addon_price;

    -- Create booking
    INSERT INTO bookings (
        workspace_id,
        object_id,
        service_id,
        start_time,
        end_time,
        customer_name,
        customer_email,
        customer_phone,
        customer_notes,
        status,
        total_price,
        guest_count,
        addon_selections,
        customer_address,
        customer_city,
        customer_zip
    ) VALUES (
        v_workspace_id,
        p_object_id,
        p_service_id,
        p_start_time,
        p_end_time,
        p_customer_name,
        p_customer_email,
        p_customer_phone,
        p_customer_notes,
        'new',
        v_total_price,
        p_guest_count,
        p_addon_selections,
        p_customer_address,
        p_customer_city,
        p_customer_zip
    ) RETURNING id INTO v_booking_id;

    -- Insert add-ons
    IF p_addon_ids IS NOT NULL THEN
        FOREACH v_addon_id IN ARRAY p_addon_ids
        LOOP
            INSERT INTO booking_addons (booking_id, addon_id)
            VALUES (v_booking_id, v_addon_id);
        END LOOP;
    END IF;

    -- Insert staff if provided
    IF p_staff_id IS NOT NULL THEN
        INSERT INTO booking_staff (booking_id, staff_id)
        VALUES (v_booking_id, p_staff_id);
    END IF;

    -- Track event
    PERFORM track_event(
        p_site_id,
        'booking_request',
        NULL::UUID,
        jsonb_build_object(
            'booking_id', v_booking_id,
            'amount', v_total_price,
            'guest_count', p_guest_count
        )
    );

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
