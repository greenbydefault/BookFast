import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin, createUserClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';

interface ConnectStatusRequest {
  workspace_id: string;
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
    const { workspace_id }: ConnectStatusRequest = await req.json();
    
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
      .select('id, stripe_connected_account_id, payout_status')
      .eq('id', workspace_id)
      .single();

    if (wsError || !workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No Stripe account yet
    if (!workspace.stripe_connected_account_id) {
      return new Response(
        JSON.stringify({
          success: true,
          payout_status: 'inactive',
          details_submitted: false,
          charges_enabled: false,
          payouts_enabled: false,
          requirements: null,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch account from Stripe
    const account = await stripe.accounts.retrieve(workspace.stripe_connected_account_id);

    // Determine payout status
    let newPayoutStatus: 'inactive' | 'pending' | 'requires_action' | 'active' = 'inactive';
    
    if (account.payouts_enabled && account.charges_enabled) {
      newPayoutStatus = 'active';
    } else if (account.requirements?.currently_due?.length > 0) {
      newPayoutStatus = 'requires_action';
    } else if (account.details_submitted) {
      newPayoutStatus = 'pending';
    }

    // Update workspace if status changed
    if (workspace.payout_status !== newPayoutStatus) {
      await supabaseAdmin
        .from('workspaces')
        .update({ payout_status: newPayoutStatus })
        .eq('id', workspace_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payout_status: newPayoutStatus,
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements: {
          currently_due: account.requirements?.currently_due || [],
          eventually_due: account.requirements?.eventually_due || [],
          past_due: account.requirements?.past_due || [],
        },
        capabilities: account.capabilities,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Connect status error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
