-- Waitlist entries with Double-Opt-In support
-- Secrets needed in Edge Functions:
--   RESEND_API_KEY              (already exists)
--   RESEND_AUDIENCE_ID_WAITLIST (Resend Audience for waitlist contacts)
--   WAITLIST_FROM_EMAIL         (verified sender, e.g. "BookFast <noreply@book-fast.de>")
--   WAITLIST_REPLY_TO           (optional reply-to address)
--   WAITLIST_CONFIRM_URL_BASE   (e.g. "https://book-fast.de/waitlist/confirm")

CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  email_normalized text NOT NULL,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed')),
  confirm_token_hash text,
  confirm_sent_at  timestamptz,
  confirmed_at     timestamptz,
  resend_contact_id text,
  source        text DEFAULT 'landing',
  ip_address    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- One entry per normalized email
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_email_normalized
  ON public.waitlist_entries (email_normalized);

-- Fast lookup by token hash during confirmation
CREATE INDEX IF NOT EXISTS idx_waitlist_confirm_token
  ON public.waitlist_entries (confirm_token_hash)
  WHERE confirm_token_hash IS NOT NULL;

-- Enable RLS (deny all by default — only service_role touches this table)
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.waitlist_entries_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_waitlist_entries_updated_at
  BEFORE UPDATE ON public.waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.waitlist_entries_set_updated_at();
