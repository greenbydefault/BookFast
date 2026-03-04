-- Add applicability to get_addon_items RPC response
CREATE OR REPLACE FUNCTION get_addon_items(p_addon_ids UUID[])
RETURNS TABLE (
    addon_id UUID,
    items JSONB
) LANGUAGE plpgsql SECURITY DEFINER AS $$
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
                    FROM addon_item_variants av
                    WHERE av.addon_item_id = ai.id
                )
            )
            ORDER BY ai.id -- Critical for consistent array indexing
        ) as items
    FROM addon_items ai
    WHERE ai.addon_id = ANY(p_addon_ids)
    GROUP BY ai.addon_id;
END;
$$;
