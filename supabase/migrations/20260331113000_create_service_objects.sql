-- Allow one service to be linked to multiple objects.
-- This becomes the source of truth for service/object assignments.

CREATE TABLE IF NOT EXISTS public.service_objects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    object_id uuid NOT NULL REFERENCES public.objects(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (service_id, object_id)
);

CREATE INDEX IF NOT EXISTS idx_service_objects_workspace_id ON public.service_objects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_service_objects_service_id ON public.service_objects(service_id);
CREATE INDEX IF NOT EXISTS idx_service_objects_object_id ON public.service_objects(object_id);

ALTER TABLE public.service_objects ENABLE ROW LEVEL SECURITY;

INSERT INTO public.service_objects (workspace_id, service_id, object_id)
SELECT s.workspace_id, s.id, s.object_id
FROM public.services s
WHERE s.object_id IS NOT NULL
ON CONFLICT (service_id, object_id) DO NOTHING;

DROP POLICY IF EXISTS "Users can view service_objects in their workspaces" ON public.service_objects;
DROP POLICY IF EXISTS "Users can insert service_objects in their workspaces" ON public.service_objects;
DROP POLICY IF EXISTS "Users can delete service_objects in their workspaces" ON public.service_objects;

CREATE POLICY "Users can view service_objects in their workspaces"
ON public.service_objects
FOR SELECT
USING (
    workspace_id IN (
        SELECT id
        FROM public.workspaces
        WHERE owner_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can insert service_objects in their workspaces"
ON public.service_objects
FOR INSERT
WITH CHECK (
    workspace_id IN (
        SELECT id
        FROM public.workspaces
        WHERE owner_id = (SELECT auth.uid())
    )
    AND service_id IN (
        SELECT id
        FROM public.services
        WHERE workspace_id = public.service_objects.workspace_id
    )
    AND object_id IN (
        SELECT id
        FROM public.objects
        WHERE workspace_id = public.service_objects.workspace_id
    )
);

CREATE POLICY "Users can delete service_objects in their workspaces"
ON public.service_objects
FOR DELETE
USING (
    workspace_id IN (
        SELECT id
        FROM public.workspaces
        WHERE owner_id = (SELECT auth.uid())
    )
);

CREATE OR REPLACE FUNCTION public.get_widget_data(p_site_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE v_workspace_id uuid; v_payout_status text; v_result jsonb;
BEGIN
    SELECT s.workspace_id INTO v_workspace_id FROM public.sites s WHERE s.id = p_site_id;
    IF v_workspace_id IS NULL THEN RETURN jsonb_build_object('error', 'Site not found'); END IF;

    SELECT w.payout_status::text INTO v_payout_status FROM public.workspaces w WHERE w.id = v_workspace_id;

    SELECT jsonb_build_object(
        'workspace_id', v_workspace_id, 'payout_status', COALESCE(v_payout_status, 'inactive'),
        'objects', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', o.id, 'name', o.name, 'description', o.description, 'capacity', o.capacity, 'bookable_days', COALESCE(o.bookable_days, '[]'::jsonb), 'booking_window_start', o.booking_window_start, 'booking_window_end', o.booking_window_end, 'buffer_before_minutes', COALESCE(o.buffer_before_minutes, 0), 'buffer_after_minutes', COALESCE(o.buffer_after_minutes, 0))), '[]'::jsonb) FROM public.objects o WHERE o.workspace_id = v_workspace_id AND o.status = 'active'),
        'services', (
            SELECT COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'id', s.id,
                        'object_id', s.object_id,
                        'linked_object_ids', COALESCE(
                            (
                                SELECT jsonb_agg(so.object_id ORDER BY so.object_id)
                                FROM public.service_objects so
                                WHERE so.service_id = s.id
                            ),
                            '[]'::jsonb
                        ),
                        'name', s.name,
                        'description', s.description,
                        'price', s.price,
                        'price_type', COALESCE(s.price_type, 'per_unit'),
                        'service_type', s.service_type,
                        'duration_minutes', s.duration_minutes,
                        'cleaning_fee', COALESCE(s.cleaning_fee, 0),
                        'bookable_days', COALESCE(s.bookable_days, '[]'::jsonb),
                        'booking_window_start', s.booking_window_start,
                        'booking_window_end', s.booking_window_end,
                        'min_advance_hours', COALESCE(s.min_advance_hours, 0),
                        'fixed_start_times', COALESCE(s.fixed_start_times, false),
                        'buffer_before_minutes', COALESCE(s.buffer_before_minutes, 0),
                        'buffer_after_minutes', COALESCE(s.buffer_after_minutes, 0),
                        'checkin_start', s.checkin_start,
                        'checkin_end', s.checkin_end,
                        'checkout_start', s.checkout_start,
                        'checkout_end', s.checkout_end,
                        'min_nights', s.min_nights,
                        'deposit_enabled', COALESCE(s.deposit_enabled, false),
                        'deposit_percent', COALESCE(s.deposit_percent, 0)
                    )
                ),
                '[]'::jsonb
            )
            FROM public.services s
            WHERE s.workspace_id = v_workspace_id AND s.status = 'active'
        ),
        'addons', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', a.id, 'name', a.name, 'price', a.price, 'pricing_type', a.pricing_type, 'linked_service_ids', COALESCE((SELECT jsonb_agg(ads.service_id) FROM public.addon_services ads WHERE ads.addon_id = a.id), '[]'::jsonb), 'items', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', ai.name, 'quantity', ai.quantity, 'variants', COALESCE((SELECT jsonb_agg(aiv.name) FROM public.addon_item_variants aiv WHERE aiv.addon_item_id = ai.id), '[]'::jsonb))) FROM public.addon_items ai WHERE ai.addon_id = a.id), '[]'::jsonb))), '[]'::jsonb) FROM public.addons a WHERE a.workspace_id = v_workspace_id AND a.status = 'active'),
        'staff', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', st.id, 'name', st.name, 'image_url', st.image_url, 'linked_service_ids', COALESCE((SELECT jsonb_agg(ss.service_id) FROM public.staff_services ss WHERE ss.staff_id = st.id), '[]'::jsonb))), '[]'::jsonb) FROM public.staff st WHERE st.workspace_id = v_workspace_id AND st.status = 'active')
    ) INTO v_result;
    RETURN v_result;
END;
$function$;
