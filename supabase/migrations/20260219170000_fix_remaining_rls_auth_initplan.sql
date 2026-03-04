-- Auth RLS InitPlan: auth.uid()/auth.role() -> (select auth.uid())/(select auth.role())
-- Fixes remaining tables (profiles, analytics_events, objects, services, addons, addon_*,
-- staff, staff_services, vouchers, voucher_usages, bookings, booking_*, slot_reservations,
-- booking_access_tokens, email_templates)

-- profiles
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ((select auth.uid()) = id);

-- analytics_events
DROP POLICY IF EXISTS "Users can view events for their sites" ON public.analytics_events;
CREATE POLICY "Users can view events for their sites" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.sites s JOIN public.workspaces w ON w.id = s.workspace_id WHERE s.id = analytics_events.site_id AND w.owner_id = (select auth.uid()))
);

-- objects
DROP POLICY IF EXISTS "Users can view objects in their workspaces" ON public.objects;
DROP POLICY IF EXISTS "Users can insert objects in their workspaces" ON public.objects;
DROP POLICY IF EXISTS "Users can update objects in their workspaces" ON public.objects;
DROP POLICY IF EXISTS "Users can delete objects in their workspaces" ON public.objects;
CREATE POLICY "Users can view objects in their workspaces" ON public.objects FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert objects in their workspaces" ON public.objects FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update objects in their workspaces" ON public.objects FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can delete objects in their workspaces" ON public.objects FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- services
DROP POLICY IF EXISTS "Users can view services in their workspaces" ON public.services;
DROP POLICY IF EXISTS "Users can insert services in their workspaces" ON public.services;
DROP POLICY IF EXISTS "Users can update services in their workspaces" ON public.services;
DROP POLICY IF EXISTS "Users can delete services in their workspaces" ON public.services;
CREATE POLICY "Users can view services in their workspaces" ON public.services FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert services in their workspaces" ON public.services FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update services in their workspaces" ON public.services FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can delete services in their workspaces" ON public.services FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- addons
DROP POLICY IF EXISTS "Users can view addons in their workspaces" ON public.addons;
DROP POLICY IF EXISTS "Users can insert addons in their workspaces" ON public.addons;
DROP POLICY IF EXISTS "Users can update addons in their workspaces" ON public.addons;
DROP POLICY IF EXISTS "Users can delete addons in their workspaces" ON public.addons;
CREATE POLICY "Users can view addons in their workspaces" ON public.addons FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert addons in their workspaces" ON public.addons FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update addons in their workspaces" ON public.addons FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can delete addons in their workspaces" ON public.addons FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- addon_services
DROP POLICY IF EXISTS "Users can view addon_services in their workspaces" ON public.addon_services;
DROP POLICY IF EXISTS "Users can insert addon_services in their workspaces" ON public.addon_services;
DROP POLICY IF EXISTS "Users can delete addon_services in their workspaces" ON public.addon_services;
CREATE POLICY "Users can view addon_services in their workspaces" ON public.addon_services FOR SELECT USING (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can insert addon_services in their workspaces" ON public.addon_services FOR INSERT WITH CHECK (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can delete addon_services in their workspaces" ON public.addon_services FOR DELETE USING (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));

-- addon_items
DROP POLICY IF EXISTS "Users can view addon_items in their workspaces" ON public.addon_items;
DROP POLICY IF EXISTS "Users can insert addon_items in their workspaces" ON public.addon_items;
DROP POLICY IF EXISTS "Users can update addon_items in their workspaces" ON public.addon_items;
DROP POLICY IF EXISTS "Users can delete addon_items in their workspaces" ON public.addon_items;
CREATE POLICY "Users can view addon_items in their workspaces" ON public.addon_items FOR SELECT USING (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can insert addon_items in their workspaces" ON public.addon_items FOR INSERT WITH CHECK (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can update addon_items in their workspaces" ON public.addon_items FOR UPDATE USING (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can delete addon_items in their workspaces" ON public.addon_items FOR DELETE USING (addon_id IN (SELECT id FROM public.addons WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));

-- addon_item_variants
DROP POLICY IF EXISTS "Users can view addon_item_variants in their workspaces" ON public.addon_item_variants;
DROP POLICY IF EXISTS "Users can insert addon_item_variants in their workspaces" ON public.addon_item_variants;
DROP POLICY IF EXISTS "Users can update addon_item_variants in their workspaces" ON public.addon_item_variants;
DROP POLICY IF EXISTS "Users can delete addon_item_variants in their workspaces" ON public.addon_item_variants;
CREATE POLICY "Users can view addon_item_variants in their workspaces" ON public.addon_item_variants FOR SELECT USING (addon_item_id IN (SELECT ai.id FROM public.addon_items ai JOIN public.addons a ON a.id = ai.addon_id WHERE a.workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can insert addon_item_variants in their workspaces" ON public.addon_item_variants FOR INSERT WITH CHECK (addon_item_id IN (SELECT ai.id FROM public.addon_items ai JOIN public.addons a ON a.id = ai.addon_id WHERE a.workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can update addon_item_variants in their workspaces" ON public.addon_item_variants FOR UPDATE USING (addon_item_id IN (SELECT ai.id FROM public.addon_items ai JOIN public.addons a ON a.id = ai.addon_id WHERE a.workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can delete addon_item_variants in their workspaces" ON public.addon_item_variants FOR DELETE USING (addon_item_id IN (SELECT ai.id FROM public.addon_items ai JOIN public.addons a ON a.id = ai.addon_id WHERE a.workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));

-- staff
DROP POLICY IF EXISTS "Users can view staff in their workspaces" ON public.staff;
DROP POLICY IF EXISTS "Users can insert staff in their workspaces" ON public.staff;
DROP POLICY IF EXISTS "Users can update staff in their workspaces" ON public.staff;
DROP POLICY IF EXISTS "Users can delete staff in their workspaces" ON public.staff;
CREATE POLICY "Users can view staff in their workspaces" ON public.staff FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert staff in their workspaces" ON public.staff FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update staff in their workspaces" ON public.staff FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can delete staff in their workspaces" ON public.staff FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- staff_services
DROP POLICY IF EXISTS "Users can view staff_services in their workspaces" ON public.staff_services;
DROP POLICY IF EXISTS "Users can insert staff_services in their workspaces" ON public.staff_services;
DROP POLICY IF EXISTS "Users can delete staff_services in their workspaces" ON public.staff_services;
CREATE POLICY "Users can view staff_services in their workspaces" ON public.staff_services FOR SELECT USING (staff_id IN (SELECT id FROM public.staff WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can insert staff_services in their workspaces" ON public.staff_services FOR INSERT WITH CHECK (staff_id IN (SELECT id FROM public.staff WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can delete staff_services in their workspaces" ON public.staff_services FOR DELETE USING (staff_id IN (SELECT id FROM public.staff WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));

-- vouchers
DROP POLICY IF EXISTS "Users can view vouchers in their workspaces" ON public.vouchers;
DROP POLICY IF EXISTS "Users can insert vouchers in their workspaces" ON public.vouchers;
DROP POLICY IF EXISTS "Users can update vouchers in their workspaces" ON public.vouchers;
DROP POLICY IF EXISTS "Users can delete vouchers in their workspaces" ON public.vouchers;
CREATE POLICY "Users can view vouchers in their workspaces" ON public.vouchers FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert vouchers in their workspaces" ON public.vouchers FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update vouchers in their workspaces" ON public.vouchers FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can delete vouchers in their workspaces" ON public.vouchers FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- voucher_usages
DROP POLICY IF EXISTS "Users can view voucher usages in their workspaces" ON public.voucher_usages;
CREATE POLICY "Users can view voucher usages in their workspaces" ON public.voucher_usages FOR SELECT USING (voucher_id IN (SELECT id FROM public.vouchers WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));

-- bookings
DROP POLICY IF EXISTS "Users can view bookings in their workspaces" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings in their workspaces" ON public.bookings;
DROP POLICY IF EXISTS "Users can update bookings in their workspaces" ON public.bookings;
CREATE POLICY "Users can view bookings in their workspaces" ON public.bookings FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert bookings in their workspaces" ON public.bookings FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update bookings in their workspaces" ON public.bookings FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- booking_addons
DROP POLICY IF EXISTS "Users can view booking_addons in their workspaces" ON public.booking_addons;
DROP POLICY IF EXISTS "Users can insert booking_addons in their workspaces" ON public.booking_addons;
CREATE POLICY "Users can view booking_addons in their workspaces" ON public.booking_addons FOR SELECT USING (booking_id IN (SELECT id FROM public.bookings WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));
CREATE POLICY "Users can insert booking_addons in their workspaces" ON public.booking_addons FOR INSERT WITH CHECK (booking_id IN (SELECT id FROM public.bookings WHERE workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid()))));

-- booking_staff
DROP POLICY IF EXISTS "Users can view booking_staff in their workspaces" ON public.booking_staff;
CREATE POLICY "Users can view booking_staff in their workspaces" ON public.booking_staff FOR SELECT USING (booking_id IN (SELECT b.id FROM public.bookings b WHERE b.workspace_id IN (SELECT w.id FROM public.workspaces w WHERE w.owner_id = (select auth.uid()))));

-- voucher_services (auth.role())
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.voucher_services;
CREATE POLICY "Enable all access for authenticated users" ON public.voucher_services FOR ALL USING ((select auth.role()) = 'authenticated');

-- slot_reservations (auth.role())
DROP POLICY IF EXISTS "Service role can delete reservations" ON public.slot_reservations;
CREATE POLICY "Service role can delete reservations" ON public.slot_reservations FOR DELETE USING ((select auth.role()) = 'service_role');

-- booking_access_tokens
DROP POLICY IF EXISTS "Workspace owners can read tokens" ON public.booking_access_tokens;
DROP POLICY IF EXISTS "Workspace owners can insert tokens" ON public.booking_access_tokens;
DROP POLICY IF EXISTS "Workspace owners can update tokens" ON public.booking_access_tokens;
DROP POLICY IF EXISTS "Workspace owners can delete tokens" ON public.booking_access_tokens;
CREATE POLICY "Workspace owners can read tokens" ON public.booking_access_tokens FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Workspace owners can insert tokens" ON public.booking_access_tokens FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Workspace owners can update tokens" ON public.booking_access_tokens FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Workspace owners can delete tokens" ON public.booking_access_tokens FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));

-- email_templates
DROP POLICY IF EXISTS "Users can view email templates in their workspaces" ON public.email_templates;
DROP POLICY IF EXISTS "Users can insert email templates in their workspaces" ON public.email_templates;
DROP POLICY IF EXISTS "Users can update email templates in their workspaces" ON public.email_templates;
DROP POLICY IF EXISTS "Users can delete email templates in their workspaces" ON public.email_templates;
CREATE POLICY "Users can view email templates in their workspaces" ON public.email_templates FOR SELECT USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can insert email templates in their workspaces" ON public.email_templates FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can update email templates in their workspaces" ON public.email_templates FOR UPDATE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
CREATE POLICY "Users can delete email templates in their workspaces" ON public.email_templates FOR DELETE USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = (select auth.uid())));
