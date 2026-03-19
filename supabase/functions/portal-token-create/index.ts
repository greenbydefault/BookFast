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
import { createPortalToken } from '../_shared/portalToken.ts';

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

    const tokenResult = await createPortalToken({
      bookingId: booking.id,
      workspaceId: booking.workspace_id,
      endTime: booking.end_time,
      startTime: booking.start_time,
      adminClient: supabaseAdmin,
    });

    return new Response(
      JSON.stringify({
        success: true,
        token: tokenResult.plainToken,
        pin: tokenResult.pinCode,
        path: tokenResult.portalPath,
        expires_at: tokenResult.expiresAt,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Portal token create error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
