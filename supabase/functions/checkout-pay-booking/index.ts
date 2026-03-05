import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { stripe, calculatePlatformFee } from '../_shared/stripe.ts';
import { hashToken } from '../_shared/tokenUtils.ts';

interface CheckoutPayRequest {
    booking_id: string;
    token: string; // Magic Link Token for auth/verification
    success_url?: string;
    cancel_url?: string;
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const { booking_id, token, success_url, cancel_url }: CheckoutPayRequest = await req.json();

        if (!booking_id || !token) {
            return new Response(
                JSON.stringify({ error: 'Missing booking_id or token' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 1. Verify Token
        const tokenHash = await hashToken(token);
        const { data: accessToken, error: tokenError } = await supabaseAdmin
            .from('booking_access_tokens')
            .select('booking_id, is_revoked, expires_at')
            .eq('token_hash', tokenHash)
            .single();

        if (tokenError || !accessToken || accessToken.is_revoked || new Date(accessToken.expires_at) < new Date()) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired token' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        if (accessToken.booking_id !== booking_id) {
            return new Response(
                JSON.stringify({ error: 'Token mismatch' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 2. Fetch Booking & Relations
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .select('*, workspace_id, object:objects(name), service:services(name), booking_addons(addon:addons(name, price))')
            .eq('id', booking_id)
            .single();

        if (bookingError || !booking) {
            return new Response(
                JSON.stringify({ error: 'Booking not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        if (booking.payment_status === 'paid') {
            return new Response(
                JSON.stringify({ error: 'Booking is already paid' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 3. Fetch Workspace (Stripe Account)
        const { data: workspace, error: wsError } = await supabaseAdmin
            .from('workspaces')
            .select('stripe_connected_account_id, payout_status')
            .eq('id', booking.workspace_id)
            .single();

        if (wsError || !workspace || !workspace.stripe_connected_account_id || workspace.payout_status !== 'active') {
            return new Response(
                JSON.stringify({ error: 'Payments not enabled for this workspace' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 4. Build Line Items
        // Use booking.total_price directly? Or reconstruct?
        // Stripe requires line items to equal the total.
        // To match `total_price` exactly, we might need a "Booking" item.
        // But it's better to show details.
        // However, if manual adjustments were made or addons changed, `total_price` in DB is the authority?
        // Let's rely on `total_price` from the booking record as the single truth to avoid discrepancies.
        // We can create a single line item "Buchung #{number}" for the full amount.
        // OR we optionally reconstruct line items if we trust them.
        // Let's just use "Booking Service" line item for simplicity and exactness.

        const amountCents = Math.round(Number(booking.total_price) * 100);
        const platformFeeCents = calculatePlatformFee(amountCents);

        // Create Stripe Session
        const baseUrl = success_url?.split('?')[0] || Deno.env.get('APP_URL') || 'https://app.book-fast.de';

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Buchung #${booking.booking_number}`,
                            description: `${booking.service?.name} @ ${booking.object?.name}`,
                        },
                        unit_amount: amountCents,
                    },
                    quantity: 1,
                }
            ],
            customer_email: booking.customer_email,
            metadata: {
                booking_id: booking.id,
                workspace_id: booking.workspace_id,
                portal_payment: 'true',
                site_id: booking.site_id || '' // Might be null for manual bookings
            },
            payment_intent_data: {
                application_fee_amount: platformFeeCents,
                metadata: {
                    booking_id: booking.id,
                    workspace_id: booking.workspace_id
                },
            },
            // Redirect back to portal
            success_url: success_url || `${baseUrl}/b/${token}?payment=success`,
            cancel_url: cancel_url || `${baseUrl}/b/${token}?payment=cancelled`,
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 mins
        }, {
            stripeAccount: workspace.stripe_connected_account_id,
        });

        // Save session ID to booking?
        await supabaseAdmin
            .from('bookings')
            .update({ checkout_session_id: session.id })
            .eq('id', booking.id);

        return new Response(
            JSON.stringify({
                success: true,
                checkout_url: session.url,
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Checkout pay error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
