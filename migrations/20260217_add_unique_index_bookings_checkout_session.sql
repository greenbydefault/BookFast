-- Ensure idempotent booking creation from Stripe webhooks
-- Allows multiple NULL values but prevents duplicates for real sessions.
WITH ranked AS (
    SELECT
        ctid,
        ROW_NUMBER() OVER (
            PARTITION BY checkout_session_id
            ORDER BY created_at DESC, id DESC
        ) AS rn
    FROM bookings
    WHERE checkout_session_id IS NOT NULL
)
DELETE FROM bookings
WHERE ctid IN (
    SELECT ctid
    FROM ranked
    WHERE rn > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_checkout_session_id_unique
ON bookings (checkout_session_id)
WHERE checkout_session_id IS NOT NULL;
