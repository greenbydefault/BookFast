-- Anzahlung: Buchung ist angezahlt, Restbetrag offen.
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'deposit_paid';

-- manual-booking-create setzt diesen Status, er fehlte in den Repo-Migrationen.
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'payment_pending';

-- Restzahlung läuft über einen eigenen PaymentIntent, die Anzahlung bleibt in payment_intent_id.
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS balance_payment_intent_id text;

-- CreateStaffModal sammelt eine Beschreibung, die Spalte fehlte bisher.
ALTER TABLE public.staff
    ADD COLUMN IF NOT EXISTS description text;
