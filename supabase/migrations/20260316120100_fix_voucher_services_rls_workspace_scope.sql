-- Security: Restrict voucher_services INSERT/UPDATE/DELETE to workspace owners.
-- Previously any authenticated user could modify any voucher_services row.
-- Now scoped through voucher → workspace → owner chain.

DROP POLICY IF EXISTS "Enable insert for authenticated" ON public.voucher_services;
DROP POLICY IF EXISTS "Enable update for authenticated" ON public.voucher_services;
DROP POLICY IF EXISTS "Enable delete for authenticated" ON public.voucher_services;

CREATE POLICY "Workspace owners can insert voucher_services" ON public.voucher_services
  FOR INSERT WITH CHECK (
    voucher_id IN (
      SELECT v.id FROM public.vouchers v
      WHERE v.workspace_id IN (
        SELECT w.id FROM public.workspaces w WHERE w.owner_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Workspace owners can update voucher_services" ON public.voucher_services
  FOR UPDATE USING (
    voucher_id IN (
      SELECT v.id FROM public.vouchers v
      WHERE v.workspace_id IN (
        SELECT w.id FROM public.workspaces w WHERE w.owner_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Workspace owners can delete voucher_services" ON public.voucher_services
  FOR DELETE USING (
    voucher_id IN (
      SELECT v.id FROM public.vouchers v
      WHERE v.workspace_id IN (
        SELECT w.id FROM public.workspaces w WHERE w.owner_id = (select auth.uid())
      )
    )
  );
