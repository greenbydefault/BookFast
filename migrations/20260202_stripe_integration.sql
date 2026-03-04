-- ============================================
-- STRIPE INTEGRATION MIGRATION
-- BookFast Payment Integration
-- ============================================

-- ============================================
-- NEUE ENUMS
-- ============================================

-- Payment Status für Bookings
CREATE TYPE payment_status AS ENUM (
    'unpaid', 
    'paid', 
    'refunded', 
    'partial_refunded', 
    'failed'
);

-- Transfer Status (Geld an Operator)
CREATE TYPE transfer_status AS ENUM (
    'none', 
    'scheduled', 
    'transferred', 
    'reversed', 
    'paid_out'
);

-- Payout Status für Workspace (Stripe Connect)
CREATE TYPE payout_status AS ENUM (
    'inactive', 
    'pending', 
    'requires_action', 
    'active'
);

-- Connect Mode (wie wurde Stripe verbunden)
CREATE TYPE connect_mode AS ENUM (
    'embedded', 
    'oauth'
);

-- ============================================
-- BOOKING_STATUS ERWEITERN
-- ============================================

-- pending_approval für Payment-First Flow
ALTER TYPE booking_status ADD VALUE 'pending_approval' AFTER 'new';

-- ============================================
-- WORKSPACES ERWEITERN (Stripe Connect)
-- ============================================

ALTER TABLE workspaces 
    ADD COLUMN IF NOT EXISTS stripe_connected_account_id TEXT,
    ADD COLUMN IF NOT EXISTS connect_mode connect_mode,
    ADD COLUMN IF NOT EXISTS payout_status payout_status DEFAULT 'inactive',
    ADD COLUMN IF NOT EXISTS payment_methods_enabled JSONB DEFAULT '["card"]';

-- ============================================
-- BOOKINGS ERWEITERN (Payment Tracking)
-- ============================================

ALTER TABLE bookings 
    ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'unpaid',
    ADD COLUMN IF NOT EXISTS transfer_status transfer_status DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
    ADD COLUMN IF NOT EXISTS checkout_session_id TEXT,
    ADD COLUMN IF NOT EXISTS transfer_id TEXT,
    ADD COLUMN IF NOT EXISTS amount_deposit NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS amount_refunded NUMERIC(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS transfer_scheduled_at TIMESTAMPTZ;

-- ============================================
-- SERVICES ERWEITERN (Deposit-Einstellung)
-- ============================================

ALTER TABLE services 
    ADD COLUMN IF NOT EXISTS deposit_enabled BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS deposit_percent INTEGER DEFAULT 0;

-- Check constraint für deposit_percent (0-100)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_deposit_percent_check'
    ) THEN
        ALTER TABLE services 
            ADD CONSTRAINT services_deposit_percent_check 
            CHECK (deposit_percent >= 0 AND deposit_percent <= 100);
    END IF;
END $$;

-- ============================================
-- SLOT RESERVATIONS (für Checkout-Timeout)
-- ============================================

CREATE TABLE IF NOT EXISTS slot_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    checkout_session_id TEXT NOT NULL,
    customer_email TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index für Verfügbarkeitsprüfung
CREATE INDEX IF NOT EXISTS idx_slot_reservations_lookup 
    ON slot_reservations(object_id, start_time, end_time, expires_at);

-- Index für Cleanup
CREATE INDEX IF NOT EXISTS idx_slot_reservations_expires 
    ON slot_reservations(expires_at);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Cleanup abgelaufener Reservierungen
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS integer AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM slot_reservations WHERE expires_at < now();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Prüfe ob Slot reserviert ist (für check_availability)
CREATE OR REPLACE FUNCTION is_slot_reserved(
    p_object_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM slot_reservations
        WHERE object_id = p_object_id
        AND expires_at > now()
        AND (
            (start_time < p_end_time AND end_time > p_start_time)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES für slot_reservations
-- ============================================

ALTER TABLE slot_reservations ENABLE ROW LEVEL SECURITY;

-- Jeder kann Reservierungen erstellen (Widget)
CREATE POLICY "Anyone can create reservations" ON slot_reservations
    FOR INSERT WITH CHECK (true);

-- Nur Service-Role kann löschen (Webhook, Cleanup)
CREATE POLICY "Service role can delete reservations" ON slot_reservations
    FOR DELETE USING (auth.role() = 'service_role');

-- Lesen für alle (für Verfügbarkeitsprüfung)
CREATE POLICY "Anyone can read reservations" ON slot_reservations
    FOR SELECT USING (true);

-- ============================================
-- UPDATE check_availability um Reservierungen zu berücksichtigen
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
    SELECT is_slot_reserved(p_object_id, v_buffered_start, v_buffered_end) 
    INTO v_has_reservation;
    
    -- Available only if no conflicts AND no reservations
    RETURN NOT v_has_conflict AND NOT v_has_reservation;
END;
$$ LANGUAGE plpgsql;
