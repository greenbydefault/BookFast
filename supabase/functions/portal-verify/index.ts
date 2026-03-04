/**
 * portal-verify — Verify a Magic Link token + PIN and return booking data
 * 
 * Auth: NONE (public endpoint, verify_jwt: false)
 * 
 * Step 1: POST { token }           → validates token, returns { requires_pin: true }
 * Step 2: POST { token, pin_code } → validates token + PIN, returns { booking, workspace }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { hashToken, PORTAL_BOOKING_SELECT, PORTAL_WORKSPACE_SELECT } from '../_shared/tokenUtils.ts';

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { token, pin_code } = await req.json();

    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic format validation (64 hex chars)
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the token
    const tokenHash = await hashToken(token);

    // Look up token in DB
    const { data: accessToken, error: tokenError } = await supabaseAdmin
      .from('booking_access_tokens')
      .select('id, booking_id, workspace_id, expires_at, is_revoked, access_count, pin_code')
      .eq('token_hash', tokenHash)
      .single();

    if (tokenError || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired link' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check revocation
    if (accessToken.is_revoked) {
      return new Response(
        JSON.stringify({ error: 'This link has been revoked' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry
    if (new Date(accessToken.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This link has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Token is valid but no PIN provided → ask for PIN
    if (!pin_code) {
      return new Response(
        JSON.stringify({ requires_pin: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 2: Verify PIN
    if (accessToken.pin_code && pin_code !== accessToken.pin_code) {
      return new Response(
        JSON.stringify({ error: 'Ungültiger Zugangscode' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch booking with full relations
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(PORTAL_BOOKING_SELECT)
      .eq('id', accessToken.booking_id)
      .single();

    if (bookingError || !booking) {
      console.error('Failed to fetch booking:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch workspace (safe fields only)
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from('workspaces')
      .select(PORTAL_WORKSPACE_SELECT)
      .eq('id', accessToken.workspace_id)
      .single();

    if (wsError || !workspace) {
      console.error('Failed to fetch workspace:', wsError);
      return new Response(
        JSON.stringify({ error: 'Workspace not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update access tracking (fire and forget)
    supabaseAdmin
      .from('booking_access_tokens')
      .update({
        access_count: (accessToken.access_count || 0) + 1,
        last_accessed_at: new Date().toISOString(),
      })
      .eq('id', accessToken.id)
      .then(() => {});

    return new Response(
      JSON.stringify({ booking, workspace }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
        },
      }
    );

  } catch (error) {
    console.error('Portal verify error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
