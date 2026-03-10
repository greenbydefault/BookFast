import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

const withCors = (req: Request, init: ResponseInit = {}) => {
  const corsHeaders = getCorsHeaders(req);
  return {
    ...init,
    headers: {
      ...corsHeaders,
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  };
};

const getSearchParams = (req: Request) => new URL(req.url).searchParams;

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const params = getSearchParams(req);
    const siteId = params.get('site_id');
    if (!siteId) {
      return new Response(
        JSON.stringify({ error: 'site_id is required' }),
        withCors(req, { status: 400 }),
      );
    }

    const { data: site, error: siteError } = await supabaseAdmin
      .from('sites')
      .select('id, workspace_id, is_active, domain, updated_at')
      .eq('id', siteId)
      .single();

    if (siteError || !site) {
      return new Response(
        JSON.stringify({ error: 'Site not found' }),
        withCors(req, { status: 404 }),
      );
    }

    const { data: workspace, error: wsError } = await supabaseAdmin
      .from('workspaces')
      .select('id, stripe_connected_account_id, payout_status, updated_at')
      .eq('id', site.workspace_id)
      .single();

    if (wsError || !workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found' }),
        withCors(req, { status: 404 }),
      );
    }

    const stripeConnected = Boolean(workspace.stripe_connected_account_id);
    const stripeStatus = stripeConnected
      ? (workspace.payout_status || 'pending')
      : 'inactive';

    return new Response(
      JSON.stringify({
        success: true,
        site_id: site.id,
        workspace_id: workspace.id,
        fetched_at: new Date().toISOString(),
        integrations: {
          stripe: {
            connected: stripeConnected,
            payout_status: stripeStatus,
          },
          webflow_embed: {
            connected: Boolean(site.is_active),
            domain: site.domain || null,
          },
          webhooks: {
            status: 'active',
          },
          google_calendar: {
            status: 'coming-soon',
          },
        },
        sources: {
          site_updated_at: site.updated_at || null,
          workspace_updated_at: workspace.updated_at || null,
        },
      }),
      withCors(req, { status: 200 }),
    );
  } catch (error) {
    console.error('public-integration-status error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      withCors(req, { status: 500 }),
    );
  }
});
