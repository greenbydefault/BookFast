-- Security: Add input validation to track_event RPC.
-- This function is callable by anon (embed widget) so we validate
-- event_type length and metadata size to limit abuse potential.
-- The analytics_events INSERT policy already restricts to valid site_ids.

CREATE OR REPLACE FUNCTION public.track_event(
  p_site_id uuid,
  p_event_type text,
  p_session_id uuid,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    IF p_event_type IS NULL OR length(p_event_type) = 0 OR length(p_event_type) > 100 THEN
        RAISE EXCEPTION 'invalid event_type';
    END IF;

    IF octet_length(p_metadata::text) > 4096 THEN
        RAISE EXCEPTION 'metadata too large';
    END IF;

    INSERT INTO public.analytics_events (site_id, event_type, session_id, metadata)
    VALUES (p_site_id, p_event_type, p_session_id, p_metadata);
END;
$function$;
