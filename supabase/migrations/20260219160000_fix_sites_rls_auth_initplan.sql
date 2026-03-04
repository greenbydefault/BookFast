-- Auth RLS InitPlan: auth.uid() -> (select auth.uid()) on sites table
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

DROP POLICY IF EXISTS "Users can insert own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can insert sites into their workspaces" ON public.sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update sites in their workspaces" ON public.sites;
DROP POLICY IF EXISTS "Users can view own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can view sites in their workspaces" ON public.sites;

CREATE POLICY "Users can insert own sites" ON public.sites
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert sites into their workspaces" ON public.sites
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid())
  ));

CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update sites in their workspaces" ON public.sites
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid())
  ));

CREATE POLICY "Users can view own sites" ON public.sites
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view sites in their workspaces" ON public.sites
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = sites.workspace_id AND w.owner_id = (select auth.uid())
  ));
