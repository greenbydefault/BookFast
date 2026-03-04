import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin, createUserClient } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';

interface BookingDeclineRequest {
  booking_id: string;
  reason?: string;
}

// Direct Charges: Refund is processed on the connected account
// The money is deducted from the connected account's balance

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
    const { booking_id, reason }: BookingDeclineRequest = await req.json();
    
    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'booking_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get booking with workspace to verify ownership
    const userClient = createUserClient(authHeader);
    const { data: booking, error: bookingError } = await userClient
      .from('bookings')
      .select(`
        id, 
        status, 
        payment_status, 
        payment_intent_id,
        total_price,
        amount_deposit,
        workspace_id,
        customer_email,
        customer_notes,
        workspaces!inner(id, owner_id, stripe_connected_account_id)
      `)
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate booking state
    if (!['pending_approval', 'confirmed'].includes(booking.status)) {
      return new Response(
        JSON.stringify({ error: `Cannot decline booking with status: ${booking.status}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (booking.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'No payment to refund' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const connectedAccountId = booking.workspaces?.stripe_connected_account_id;
    if (!connectedAccountId) {
      return new Response(
        JSON.stringify({ error: 'No Stripe account found for this workspace' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process refund via Stripe on the connected account (Direct Charges)
    let refund;
    if (booking.payment_intent_id) {
      try {
        refund = await stripe.refunds.create({
          payment_intent: booking.payment_intent_id,
          reason: 'requested_by_customer',
          metadata: {
            booking_id,
            decline_reason: reason || 'Declined by operator',
          },
        }, {
          stripeAccount: connectedAccountId,
        });
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError);
        return new Response(
          JSON.stringify({ error: `Refund failed: ${stripeError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Update booking
    const refundAmount = refund ? refund.amount / 100 : booking.total_price;
    
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'rejected',
        payment_status: 'refunded',
        amount_refunded: refundAmount,
        customer_notes: reason ? `Abgelehnt: ${reason}` : booking.customer_notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return new Response(
        JSON.stringify({ error: 'Refund processed but failed to update booking' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_id,
        status: 'rejected',
        refund_id: refund?.id,
        refund_amount: refundAmount,
        message: `Buchung abgelehnt. €${refundAmount.toFixed(2)} an Kunden erstattet.`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Booking decline error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
