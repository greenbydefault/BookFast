import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin, createUserClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';

interface ConnectStartRequest {
  workspace_id: string;
  return_url?: string;
  refresh_url?: string;
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const { workspace_id, return_url, refresh_url }: ConnectStartRequest = await req.json();
    
    if (!workspace_id) {
      return new Response(
        JSON.stringify({ error: 'workspace_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get workspace and verify ownership
    const userClient = createUserClient(authHeader);
    const { data: workspace, error: wsError } = await userClient
      .from('workspaces')
      .select('id, name, stripe_connected_account_id, owner_id')
      .eq('id', workspace_id)
      .single();

    if (wsError || !workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let accountId = workspace.stripe_connected_account_id;

    // Create new Express account if none exists
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'DE', // Default to Germany
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          workspace_id: workspace_id,
          workspace_name: workspace.name,
        },
      });

      accountId = account.id;

      // Save account ID to workspace
      const { error: updateError } = await supabaseAdmin
        .from('workspaces')
        .update({
          stripe_connected_account_id: accountId,
          connect_mode: 'embedded',
          payout_status: 'pending',
        })
        .eq('id', workspace_id);

      if (updateError) {
        console.error('Failed to save account ID:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to save Stripe account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create account link for onboarding
    const baseUrl = return_url || Deno.env.get('APP_URL') || 'http://localhost:5173';
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refresh_url || `${baseUrl}/#/settings?tab=payments&refresh=true`,
      return_url: return_url || `${baseUrl}/#/settings?tab=payments&connected=true`,
      type: 'account_onboarding',
    });

    return new Response(
      JSON.stringify({
        success: true,
        onboarding_url: accountLink.url,
        account_id: accountId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Connect start error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
