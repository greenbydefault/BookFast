-- Merge multiple permissive RLS policies on sites into single policies per action
-- https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

DROP POLICY IF EXISTS "Users can insert own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can insert sites into their workspaces" ON public.sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update sites in their workspaces" ON public.sites;
DROP POLICY IF EXISTS "Users can view own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can view sites in their workspaces" ON public.sites;

CREATE POLICY "Users can insert sites" ON public.sites FOR INSERT WITH CHECK (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid()))
);

CREATE POLICY "Users can update sites" ON public.sites FOR UPDATE USING (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid()))
) WITH CHECK (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid()))
);

CREATE POLICY "Users can view sites" ON public.sites FOR SELECT USING (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid()))
);
