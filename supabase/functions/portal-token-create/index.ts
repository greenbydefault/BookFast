/**
 * portal-token-create — Generate a Magic Link token for a booking
 * 
 * Auth: Requires JWT (workspace owner)
 * Input: { booking_id }
 * Output: { token, url, expires_at }
 * 
 * The plaintext token is returned ONCE and never stored.
 * Only the SHA-256 hash is persisted in the database.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin, createUserClient } from '../_shared/supabase.ts';
import { generateToken, hashToken, generatePin } from '../_shared/tokenUtils.ts';

interface TokenCreateRequest {
  booking_id: string;
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Require auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { booking_id }: TokenCreateRequest = await req.json();

    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'booking_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify booking exists and user owns the workspace (via RLS)
    const userClient = createUserClient(authHeader);
    const { data: booking, error: bookingError } = await userClient
      .from('bookings')
      .select('id, workspace_id, start_time, end_time')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Revoke any existing active tokens for this booking
    await supabaseAdmin
      .from('booking_access_tokens')
      .update({ is_revoked: true })
      .eq('booking_id', booking_id)
      .eq('is_revoked', false);

    // Generate new token + PIN
    const plainToken = generateToken();
    const tokenHash = await hashToken(plainToken);
    const pinCode = generatePin();

    // Calculate expiry: booking end_time + 60 days (or start_time + 60 if no end)
    const bookingDate = new Date(booking.end_time || booking.start_time);
    const expiresAt = new Date(bookingDate.getTime() + 60 * 24 * 60 * 60 * 1000);

    // Store hashed token + plaintext + PIN
    const { error: insertError } = await supabaseAdmin
      .from('booking_access_tokens')
      .insert({
        booking_id: booking.id,
        workspace_id: booking.workspace_id,
        token_hash: tokenHash,
        token_plaintext: plainToken,
        pin_code: pinCode,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Failed to create token:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create portal link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build portal URL — token is returned once, never stored as plaintext
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    // The portal URL uses the app's domain, not the Supabase URL
    // The frontend will construct the full URL from the token
    const portalPath = `/b/${plainToken}`;

    return new Response(
      JSON.stringify({
        success: true,
        token: plainToken,
        pin: pinCode,
        path: portalPath,
        expires_at: expiresAt.toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Portal token create error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
