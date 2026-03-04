-- Merge multiple permissive RLS policies on voucher_services into single policy per action
-- https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.voucher_services;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.voucher_services;

-- SELECT: everyone can read (merged from both previous policies)
CREATE POLICY "Enable read access for all" ON public.voucher_services FOR SELECT USING (true);

-- INSERT, UPDATE, DELETE: authenticated users only
CREATE POLICY "Enable insert for authenticated" ON public.voucher_services FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "Enable update for authenticated" ON public.voucher_services FOR UPDATE USING ((select auth.role()) = 'authenticated');
CREATE POLICY "Enable delete for authenticated" ON public.voucher_services FOR DELETE USING ((select auth.role()) = 'authenticated');
