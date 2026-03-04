-- Fix overly permissive INSERT policy: restrict to valid site_id only
-- https://supabase.com/docs/guides/database/database-linter?lint=0024_permissive_rls_policy

DROP POLICY IF EXISTS "Public can insert events" ON public.analytics_events;

CREATE POLICY "Public can insert events for valid sites" ON public.analytics_events
  FOR INSERT WITH CHECK (site_id IN (SELECT id FROM public.sites));
