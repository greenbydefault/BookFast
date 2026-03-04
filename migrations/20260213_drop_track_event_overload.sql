-- Remove legacy 3-argument overload to avoid PostgREST RPC ambiguity (PGRST203)
-- Keep only the 4-argument variant with metadata.
DROP FUNCTION IF EXISTS public.track_event(uuid, text, uuid);
