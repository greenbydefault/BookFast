-- Fix RLS policies for vacations table
-- This replaces the policies that caused the "relation public.workspace_members does not exist" error.

-- 1. Drop the old policies if they were partially created
drop policy if exists "Users can view vacations for their workspace" on public.vacations;
drop policy if exists "Users can insert vacations for their workspace" on public.vacations;
drop policy if exists "Users can update vacations for their workspace" on public.vacations;
drop policy if exists "Users can delete vacations for their workspace" on public.vacations;

-- 2. Create new policies referencing the workspaces table directly
-- IMPORTANT: This assumes your `workspaces` table has an `owner_id` column.
-- If the column is named `user_id`, please replace `owner_id` with `user_id` in the queries below.

create policy "Users can view vacations for their workspace"
  on public.vacations for select
  using (
    workspace_id in (
      select id from public.workspaces
      where owner_id = auth.uid()
    )
  );

create policy "Users can insert vacations for their workspace"
  on public.vacations for insert
  with check (
    workspace_id in (
      select id from public.workspaces
      where owner_id = auth.uid()
    )
  );

create policy "Users can update vacations for their workspace"
  on public.vacations for update
  using (
    workspace_id in (
      select id from public.workspaces
      where owner_id = auth.uid()
    )
  );

create policy "Users can delete vacations for their workspace"
  on public.vacations for delete
  using (
    workspace_id in (
      select id from public.workspaces
      where owner_id = auth.uid()
    )
  );
