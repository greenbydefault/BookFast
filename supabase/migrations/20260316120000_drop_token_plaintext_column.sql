-- Security: Remove token_plaintext column from booking_access_tokens.
-- Plaintext tokens should never be persisted; only the SHA-256 hash is needed.
-- The plaintext is returned once to the client and never stored.

ALTER TABLE public.booking_access_tokens DROP COLUMN IF EXISTS token_plaintext;
