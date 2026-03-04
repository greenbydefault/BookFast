-- Performance: Index on bookings.user_id for unindexed FK (Supabase advisor)
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings (user_id);
