/**
 * portal-action — Execute customer actions on a booking via Magic Link
 * 
 * Auth: Token + Step-up (email verification)
 * Input: { token, action, verification_email }
 * Output: { success, message } or error
 * 
 * Step-up: The customer must confirm their email address
 * to execute any write action. This prevents unauthorized modifications
 * even if someone obtains the link.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { hashToken } from '../_shared/tokenUtils.ts';

type PortalAction = 'cancel';

interface PortalActionRequest {
  token: string;
  action: PortalAction;
  verification_email: string;
}

// Booking statuses that allow cancellation
const CANCELLABLE_STATUSES = ['confirmed', 'pending_approval', 'pending'];

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { token, action, verification_email }: PortalActionRequest = await req.json();

    // Validate inputs
    if (!token || !action || !verification_email) {
      return new Response(
        JSON.stringify({ error: 'token, action, and verification_email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate token format
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash and look up token
    const tokenHash = await hashToken(token);

    const { data: accessToken, error: tokenError } = await supabaseAdmin
      .from('booking_access_tokens')
      .select('id, booking_id, workspace_id, expires_at, is_revoked')
      .eq('token_hash', tokenHash)
      .single();

    if (tokenError || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired link' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check revocation and expiry
    if (accessToken.is_revoked) {
      return new Response(
        JSON.stringify({ error: 'This link has been revoked' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date(accessToken.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This link has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch booking for step-up verification
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, status, customer_email, customer_name')
      .eq('id', accessToken.booking_id)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step-up: Verify email matches (case-insensitive)
    if (verification_email.toLowerCase().trim() !== booking.customer_email.toLowerCase().trim()) {
      return new Response(
        JSON.stringify({ error: 'E-Mail-Adresse stimmt nicht überein' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Execute action
    switch (action) {
      case 'cancel':
        return await handleCancel(booking, accessToken);
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Portal action error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Handle booking cancellation by customer
 */
async function handleCancel(
  booking: { id: string; status: string; customer_name: string },
  accessToken: { id: string; booking_id: string }
) {
  // Check if booking can be cancelled
  if (!CANCELLABLE_STATUSES.includes(booking.status)) {
    return new Response(
      JSON.stringify({
        error: `Buchung kann im aktuellen Status (${booking.status}) nicht storniert werden`,
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Update booking status
  const { error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', booking.id);

  if (updateError) {
    console.error('Failed to cancel booking:', updateError);
    return new Response(
      JSON.stringify({ error: 'Fehler beim Stornieren der Buchung' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Revoke the token after cancellation
  await supabaseAdmin
    .from('booking_access_tokens')
    .update({ is_revoked: true })
    .eq('id', accessToken.id);

  console.log('Booking cancelled via portal:', booking.id, 'Customer:', booking.customer_name);

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Ihre Buchung wurde erfolgreich storniert.',
      new_status: 'cancelled',
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
