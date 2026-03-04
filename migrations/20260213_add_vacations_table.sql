-- Create vacations table
create table if not exists public.vacations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.vacations enable row level security;

-- Create policies
create policy "Users can view vacations for their workspace"
  on public.vacations for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Users can insert vacations for their workspace"
  on public.vacations for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Users can update vacations for their workspace"
  on public.vacations for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Users can delete vacations for their workspace"
  on public.vacations for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
create trigger update_vacations_updated_at
  before update on public.vacations
  for each row
  execute function update_updated_at_column();
