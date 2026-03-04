-- Auth RLS InitPlan: auth.uid() -> (select auth.uid()) for single evaluation per query
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

DROP POLICY IF EXISTS "Users can insert own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can update own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view own workspaces" ON public.workspaces;

CREATE POLICY "Users can insert own workspaces" ON public.workspaces
  FOR INSERT WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Users can update own workspaces" ON public.workspaces
  FOR UPDATE USING ((select auth.uid()) = owner_id);

CREATE POLICY "Users can view own workspaces" ON public.workspaces
  FOR SELECT USING ((select auth.uid()) = owner_id);
