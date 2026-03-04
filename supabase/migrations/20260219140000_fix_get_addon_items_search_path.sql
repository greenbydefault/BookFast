-- Fix role mutable search_path on get_addon_items (Supabase advisor)
-- SET search_path = '' prevents search_path hijacking on SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.get_addon_items(p_addon_ids uuid[])
 RETURNS TABLE(addon_id uuid, items jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        ai.addon_id,
        jsonb_agg(
            jsonb_build_object(
                'id', ai.id,
                'name', ai.name,
                'selection_mode', COALESCE(ai.selection_mode, 'quantity'),
                'quantity', ai.quantity,
                'applicability', COALESCE(ai.applicability::text, 'guest'),
                'addon_item_variants', (
                    SELECT COALESCE(jsonb_agg(
                        jsonb_build_object('id', av.id, 'name', av.name)
                        ORDER BY av.id
                    ), '[]'::jsonb)
                    FROM public.addon_item_variants av
                    WHERE av.addon_item_id = ai.id
                )
            )
            ORDER BY ai.id
        ) AS items
    FROM public.addon_items ai
    WHERE ai.addon_id = ANY(p_addon_ids)
    GROUP BY ai.addon_id;
END;
$function$;
