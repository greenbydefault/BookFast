-- Ensure vacations table exists in Supabase-managed environments.
-- Older projects created this table outside supabase/migrations, while
-- availability RPCs now depend on it directly.

DO $$ BEGIN
  CREATE TYPE public.vacation_scope AS ENUM ('workspace', 'object', 'staff', 'service');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  description text,
  scope public.vacation_scope NOT NULL DEFAULT 'workspace',
  object_id uuid REFERENCES public.objects(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES public.staff(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vacations
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS scope public.vacation_scope DEFAULT 'workspace',
  ADD COLUMN IF NOT EXISTS object_id uuid REFERENCES public.objects(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staff(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.vacations
  ALTER COLUMN scope SET DEFAULT 'workspace';

UPDATE public.vacations
SET scope = 'workspace'
WHERE scope IS NULL;

ALTER TABLE public.vacations
  ALTER COLUMN scope SET NOT NULL;

ALTER TABLE public.vacations
  DROP CONSTRAINT IF EXISTS vacations_scope_fk_consistent;

ALTER TABLE public.vacations
  ADD CONSTRAINT vacations_scope_fk_consistent CHECK (
    (scope = 'workspace' AND object_id IS NULL AND staff_id IS NULL AND service_id IS NULL)
    OR (scope = 'object' AND object_id IS NOT NULL AND staff_id IS NULL AND service_id IS NULL)
    OR (scope = 'staff' AND staff_id IS NOT NULL AND object_id IS NULL AND service_id IS NULL)
    OR (scope = 'service' AND service_id IS NOT NULL AND object_id IS NULL AND staff_id IS NULL)
  );

ALTER TABLE public.vacations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view vacations" ON public.vacations;
DROP POLICY IF EXISTS "Users can insert vacations" ON public.vacations;
DROP POLICY IF EXISTS "Users can update vacations" ON public.vacations;
DROP POLICY IF EXISTS "Users can delete vacations" ON public.vacations;
DROP POLICY IF EXISTS "Users can view vacations for their workspace" ON public.vacations;
DROP POLICY IF EXISTS "Users can insert vacations for their workspace" ON public.vacations;
DROP POLICY IF EXISTS "Users can update vacations for their workspace" ON public.vacations;
DROP POLICY IF EXISTS "Users can delete vacations for their workspace" ON public.vacations;

CREATE POLICY "Users can view vacations" ON public.vacations
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.workspaces w
      WHERE w.id = vacations.workspace_id
        AND w.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert vacations" ON public.vacations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.workspaces w
      WHERE w.id = vacations.workspace_id
        AND w.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update vacations" ON public.vacations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM public.workspaces w
      WHERE w.id = vacations.workspace_id
        AND w.owner_id = (SELECT auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.workspaces w
      WHERE w.id = vacations.workspace_id
        AND w.owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete vacations" ON public.vacations
  FOR DELETE USING (
    EXISTS (
      SELECT 1
      FROM public.workspaces w
      WHERE w.id = vacations.workspace_id
        AND w.owner_id = (SELECT auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS vacations_workspace_id_idx ON public.vacations(workspace_id);
CREATE INDEX IF NOT EXISTS vacations_object_id_idx ON public.vacations(object_id);
CREATE INDEX IF NOT EXISTS vacations_staff_id_idx ON public.vacations(staff_id);
CREATE INDEX IF NOT EXISTS vacations_service_id_idx ON public.vacations(service_id);
CREATE INDEX IF NOT EXISTS vacations_date_range_idx ON public.vacations(start_date, end_date);

DROP TRIGGER IF EXISTS update_vacations_updated_at ON public.vacations;
CREATE TRIGGER update_vacations_updated_at
  BEFORE UPDATE ON public.vacations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
