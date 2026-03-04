-- Extend ping_site to accept and store the domain the embed script was loaded from
CREATE OR REPLACE FUNCTION public.ping_site(site_id uuid, p_domain text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
    UPDATE public.sites
    SET is_active = true,
        last_ping = now(),
        domain = COALESCE(p_domain, domain)
    WHERE id = site_id;
END;
$function$;
