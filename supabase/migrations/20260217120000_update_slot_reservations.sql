-- Add browser_session_id to slot_reservations to allow retrying within same session
ALTER TABLE slot_reservations 
ADD COLUMN IF NOT EXISTS browser_session_id TEXT;

-- Update is_slot_reserved to ignore checking session
CREATE OR REPLACE FUNCTION is_slot_reserved(
    p_object_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_exclude_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM slot_reservations
        WHERE object_id = p_object_id
        AND expires_at > now()
        AND (p_exclude_session_id IS NULL OR browser_session_id IS DISTINCT FROM p_exclude_session_id)
        AND (
            (start_time < p_end_time AND end_time > p_start_time)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Update check_availability to accept p_session_id
CREATE OR REPLACE FUNCTION check_availability(
    p_object_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_buffer_before INTEGER DEFAULT 0,
    p_buffer_after INTEGER DEFAULT 0,
    p_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_buffered_start TIMESTAMPTZ;
    v_buffered_end TIMESTAMPTZ;
    v_has_conflict BOOLEAN;
    v_has_reservation BOOLEAN;
BEGIN
    -- Apply buffers
    v_buffered_start := p_start_time - (p_buffer_before || ' minutes')::INTERVAL;
    v_buffered_end := p_end_time + (p_buffer_after || ' minutes')::INTERVAL;
    
    -- Check for booking conflicts (nur confirmed/pending bookings)
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE object_id = p_object_id
        AND status IN ('new', 'pending', 'pending_approval', 'confirmed')
        AND (
            (start_time < v_buffered_end AND end_time > v_buffered_start)
        )
    ) INTO v_has_conflict;
    
    -- Check for active slot reservations
    SELECT is_slot_reserved(p_object_id, v_buffered_start, v_buffered_end, p_session_id) 
    INTO v_has_reservation;
    
    -- Available only if no conflicts AND no reservations
    RETURN NOT v_has_conflict AND NOT v_has_reservation;
END;
$$ LANGUAGE plpgsql;
