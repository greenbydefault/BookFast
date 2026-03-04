-- Public RPC for registration pre-check:
-- returns true if an auth user with this email already exists.
CREATE OR REPLACE FUNCTION public.check_registration_email_exists(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
    SELECT CASE
        WHEN p_email IS NULL OR btrim(p_email) = '' THEN false
        ELSE EXISTS (
            SELECT 1
            FROM auth.users u
            WHERE lower(u.email) = lower(btrim(p_email))
        )
    END;
$function$;

REVOKE ALL ON FUNCTION public.check_registration_email_exists(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_registration_email_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_registration_email_exists(text) TO authenticated;
