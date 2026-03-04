-- Add scope support to vacations: workspace | object | staff | service
-- Allows vacation to apply to entire workspace, specific object, staff, or service.

DO $$ BEGIN
  CREATE TYPE vacation_scope AS ENUM ('workspace', 'object', 'staff', 'service');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add new columns
ALTER TABLE public.vacations
  ADD COLUMN IF NOT EXISTS scope vacation_scope DEFAULT 'workspace',
  ADD COLUMN IF NOT EXISTS object_id uuid REFERENCES public.objects(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staff(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE CASCADE;

-- Constraint: exactly one scope type - either workspace (all null) or one FK set
ALTER TABLE public.vacations
  DROP CONSTRAINT IF EXISTS vacations_scope_fk_consistent;

ALTER TABLE public.vacations
  ADD CONSTRAINT vacations_scope_fk_consistent CHECK (
    (scope = 'workspace' AND object_id IS NULL AND staff_id IS NULL AND service_id IS NULL)
    OR (scope = 'object' AND object_id IS NOT NULL AND staff_id IS NULL AND service_id IS NULL)
    OR (scope = 'staff' AND staff_id IS NOT NULL AND object_id IS NULL AND service_id IS NULL)
    OR (scope = 'service' AND service_id IS NOT NULL AND object_id IS NULL AND staff_id IS NULL)
  );
