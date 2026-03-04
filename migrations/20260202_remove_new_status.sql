-- ============================================
-- REMOVE 'new' STATUS MIGRATION
-- Migrates all 'new' bookings to 'pending_approval'
-- Updates check_availability to exclude 'new'
-- ============================================

-- ============================================
-- 1. MIGRATE EXISTING BOOKINGS
-- ============================================

-- Move all bookings with status 'new' to 'pending_approval'
UPDATE bookings 
SET status = 'pending_approval' 
WHERE status = 'new';

-- ============================================
-- 2. UPDATE check_availability FUNCTION
-- Remove 'new' from the status check
-- ============================================

CREATE OR REPLACE FUNCTION check_availability(
    p_object_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_buffer_before INTEGER DEFAULT 0,
    p_buffer_after INTEGER DEFAULT 0
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
    
    -- Check for booking conflicts (nur pending/pending_approval/confirmed bookings)
    -- 'new' status removed - no longer used
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE object_id = p_object_id
        AND status IN ('pending', 'pending_approval', 'confirmed')
        AND (
            (start_time < v_buffered_end AND end_time > v_buffered_start)
        )
    ) INTO v_has_conflict;
    
    -- Check for active slot reservations
    SELECT is_slot_reserved(p_object_id, v_buffered_start, v_buffered_end) 
    INTO v_has_reservation;
    
    -- Available only if no conflicts AND no reservations
    RETURN NOT v_has_conflict AND NOT v_has_reservation;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- NOTE: PostgreSQL ENUM values cannot be removed
-- The 'new' value remains in booking_status enum
-- but is no longer used anywhere in the application
-- ============================================
