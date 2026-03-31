import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { stripe } from '../_shared/stripe.ts';
import { calculateAddonQuantity } from '../_shared/pricing.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

// Webhook secret for verifying Stripe events
// IMPORTANT: Enable "Listen to events on Connected accounts" in Stripe Dashboard
// for Direct Charges to work properly
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const REQUIRED_CHECKOUT_METADATA = [
  'workspace_id',
  'object_id',
  'service_id',
  'start_time',
  'end_time',
  'customer_name',
  'customer_email',
  'total_price',
] as const;

type WebhookErrorCode =
  | 'missing_signature_or_secret'
  | 'signature_verification_failed'
  | 'missing_required_metadata'
  | 'booking_insert_failed'
  | 'portal_payment_missing_booking_id'
  | 'unhandled_webhook_error';

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isMissingRowError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string }).code;
  return code === 'PGRST116';
};

const parseMoney = (value: string | undefined, field: string, requestId: string) => {
  const parsed = Number.parseFloat(value || '');
  if (!Number.isFinite(parsed)) {
    throw new Error(`[${requestId}] Invalid numeric metadata field: ${field}`);
  }
  return parsed;
};

const getMissingMetadata = (metadata: Stripe.Metadata | null | undefined) => {
  if (!metadata) return [...REQUIRED_CHECKOUT_METADATA];
  return REQUIRED_CHECKOUT_METADATA.filter((key) => !metadata[key] || String(metadata[key]).trim() === '');
};

serve(async (req: Request) => {
  const requestId = crypto.randomUUID().slice(0, 8);

  // Only POST allowed
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error(`[${requestId}] Webhook rejected: missing signature or secret`, {
        hasSignature: Boolean(signature),
        hasWebhookSecret: Boolean(webhookSecret),
      });
      return jsonResponse(400, {
        error: 'Missing signature',
        code: 'missing_signature_or_secret' satisfies WebhookErrorCode,
        request_id: requestId,
      });
    }

    // Verify webhook signature - WICHTIG: constructEventAsync für Deno!
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${requestId}] Webhook signature verification failed:`, message);
      return jsonResponse(400, {
        error: `Webhook Error: ${message}`,
        code: 'signature_verification_failed' satisfies WebhookErrorCode,
        request_id: requestId,
      });
    }

    // For Direct Charges, events from connected accounts include the 'account' field
    const connectedAccountId = (event as any).account;
    console.log(`[${requestId}] Received webhook event`, {
      type: event.type,
      event_id: event.id,
      account: connectedAccountId || 'platform',
    });

    // Process event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, requestId);
        break;

      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session, requestId);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account, requestId);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge, requestId);
        break;

      default:
        console.log(`[${requestId}] Unhandled event type:`, event.type);
    }

    return jsonResponse(200, {
      received: true,
      request_id: requestId,
    });

  } catch (error) {
    console.error(`[${requestId}] Webhook error:`, error);
    return jsonResponse(500, {
      error: 'Internal server error',
      code: 'unhandled_webhook_error' satisfies WebhookErrorCode,
      request_id: requestId,
    });
  }
});

// Handle successful checkout (Direct Charges - payment already on connected account)
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, requestId: string) {
  const metadata = session.metadata;

  // Portal payment flow: update existing booking to paid
  if (metadata?.portal_payment === 'true' || metadata?.booking_id) {
    const bookingId = metadata?.booking_id;
    if (!bookingId) {
      throw new Error(`[${requestId}] portal_payment_missing_booking_id`);
    }

    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    const updatePayload: Record<string, string> = {
      payment_status: 'paid',
      checkout_session_id: session.id,
    };
    if (existingBooking?.status === 'payment_pending') {
      updatePayload.status = 'confirmed';
    }
    if (session.payment_intent) {
      updatePayload.payment_intent_id = session.payment_intent as string;
    }

    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update(updatePayload)
      .eq('id', bookingId);

    if (updateError) {
      throw new Error(`[${requestId}] Failed to update portal booking payment: ${updateError.message}`);
    }

    console.log(`[${requestId}] Portal payment marked as paid`, { booking_id: bookingId });
    return;
  }

  const missingMetadata = getMissingMetadata(metadata);
  if (missingMetadata.length > 0) {
    throw new Error(
      `[${requestId}] missing_required_metadata: ${missingMetadata.join(',')}`
    );
  }

  // Check if booking already exists (idempotency)
  const { data: existingBooking, error: existingBookingError } = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('checkout_session_id', session.id)
    .maybeSingle();

  if (existingBookingError && !isMissingRowError(existingBookingError)) {
    throw new Error(`[${requestId}] Failed idempotency lookup: ${existingBookingError.message}`);
  }

  if (existingBooking) {
    console.log(`[${requestId}] Booking already exists for session`, {
      checkout_session_id: session.id,
      booking_id: existingBooking.id,
    });
    return;
  }

  // Parse addon IDs
  let addonIds: string[] = [];
  try {
    addonIds = JSON.parse(metadata.addon_ids || '[]');
  } catch { }

  let addonSelections: any[] = [];
  try {
    addonSelections = JSON.parse(metadata.addon_selections || '[]');
  } catch { }

  // Create booking
  // With Direct Charges, payment is already on the connected account
  // Status is pending_approval so operator can confirm or decline (with refund)
  const servicePrice = parseMoney(metadata.service_price, 'service_price', requestId);
  const cleaningFee = parseMoney(metadata.cleaning_fee || '0', 'cleaning_fee', requestId);
  const addonsPrice = parseMoney(metadata.addons_price || '0', 'addons_price', requestId);
  const discountAmount = parseMoney(metadata.discount_amount || '0', 'discount_amount', requestId);
  const totalPrice = parseMoney(metadata.total_price, 'total_price', requestId);
  const guestCount = metadata.guest_count ? parseInt(metadata.guest_count) : 1;

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .insert({
      workspace_id: metadata.workspace_id,
      object_id: metadata.object_id,
      service_id: metadata.service_id,
      start_time: metadata.start_time,
      end_time: metadata.end_time,
      customer_name: metadata.customer_name,
      customer_email: metadata.customer_email,
      customer_phone: metadata.customer_phone || null,
      status: 'pending_approval',
      payment_status: 'paid',
      service_price: servicePrice + cleaningFee,
      addons_price: addonsPrice,
      discount_amount: discountAmount,
      total_price: totalPrice,
      amount_deposit: metadata.amount_deposit ? parseFloat(metadata.amount_deposit) : null,
      voucher_id: metadata.voucher_id || null,
      staff_id: metadata.staff_id || null,
      payment_intent_id: session.payment_intent as string,
      checkout_session_id: session.id,
      guest_count: guestCount,
      addon_selections: addonSelections.length ? addonSelections : null,
      customer_address: metadata.customer_address || null,
      customer_city: metadata.customer_city || null,
      customer_zip: metadata.customer_zip || null,
    })
    .select()
    .single();

  if (bookingError) {
    throw new Error(`[${requestId}] booking_insert_failed: ${bookingError.message}`);
  }

  console.log(`[${requestId}] Created booking`, {
    booking_id: booking.id,
    checkout_session_id: session.id,
  });

  // Insert booking addons
  if (addonIds.length > 0 && booking) {
    const { data: addons } = await supabaseAdmin
      .from('addons')
      .select('id, price, pricing_type')
      .in('id', addonIds);

    if (addons) {
      const addonSelectionsById = new Map(
        addonSelections
          .filter((selection) => selection?.addon_id)
          .map((selection) => [selection.addon_id, selection]),
      );
      const bookingAddons = addons.map((addon) => {
        const quantity = calculateAddonQuantity(
          addon,
          guestCount,
          addonSelectionsById.get(addon.id) || null,
        );
        return {
          booking_id: booking.id,
          addon_id: addon.id,
          price_per_unit: addon.price,
          quantity,
          total_price: (Number(addon.price) || 0) * quantity,
        };
      }).filter((addon) => addon.quantity > 0);

      if (bookingAddons.length > 0) {
        const { error: addonInsertError } = await supabaseAdmin.from('booking_addons').insert(bookingAddons);
        if (addonInsertError) {
          console.error(`[${requestId}] Failed to insert booking_addons`, {
            booking_id: booking.id,
            error: addonInsertError.message,
          });
        }
      }
    }
  }

  // Insert booking staff if provided
  if (metadata.staff_id && booking) {
    const { error: bookingStaffError } = await supabaseAdmin.from('booking_staff').insert({
      booking_id: booking.id,
      staff_id: metadata.staff_id,
    });
    if (bookingStaffError) {
      console.error(`[${requestId}] Failed to insert booking_staff`, {
        booking_id: booking.id,
        error: bookingStaffError.message,
      });
    }
  }

  // Delete slot reservation
  if (metadata.reservation_id) {
    const { error: reservationDeleteError } = await supabaseAdmin
      .from('slot_reservations')
      .delete()
      .eq('checkout_session_id', session.id);
    if (reservationDeleteError) {
      console.error(`[${requestId}] Failed to delete slot_reservation`, {
        checkout_session_id: session.id,
        error: reservationDeleteError.message,
      });
    }
  }

  // Track analytics event (session_id aus Widget-Metadata fuer Funnel-Verkettung)
  const { error: paymentTrackError } = await supabaseAdmin.rpc('track_event', {
    p_site_id: metadata.site_id,
    p_event_type: 'payment_completed',
    p_session_id: metadata.session_id || crypto.randomUUID(),
    p_metadata: {
      booking_id: booking.id,
      total_price: parseFloat(metadata.total_price),
      currency: 'EUR',
    },
  });
  if (paymentTrackError) {
    console.error(`[${requestId}] Failed to track payment_completed`, paymentTrackError);
  }

  console.log(`[${requestId}] Checkout completed, booking created`, { booking_id: booking.id });
}

// Handle expired checkout
async function handleCheckoutExpired(session: Stripe.Checkout.Session, requestId: string) {
  // Delete slot reservation
  const { error } = await supabaseAdmin
    .from('slot_reservations')
    .delete()
    .eq('checkout_session_id', session.id);
  if (error) {
    console.error(`[${requestId}] Failed to delete expired reservation`, {
      checkout_session_id: session.id,
      error: 'reservation_cleanup_failed',
    });
  }

  console.log(`[${requestId}] Checkout expired, reservation deleted`, { checkout_session_id: session.id });
}

// Handle Stripe Connect account updates
async function handleAccountUpdated(account: Stripe.Account, requestId: string) {
  // Find workspace by account ID
  const { data: workspace } = await supabaseAdmin
    .from('workspaces')
    .select('id, payout_status')
    .eq('stripe_connected_account_id', account.id)
    .single();

  if (!workspace) {
    console.log(`[${requestId}] No workspace found for account`, { account_id: account.id });
    return;
  }

  // Determine new payout status
  let newStatus: 'inactive' | 'pending' | 'requires_action' | 'active' = 'inactive';

  if (account.payouts_enabled && account.charges_enabled) {
    newStatus = 'active';
  } else if (account.requirements?.currently_due?.length > 0) {
    newStatus = 'requires_action';
  } else if (account.details_submitted) {
    newStatus = 'pending';
  }

  // Update if changed
  if (workspace.payout_status !== newStatus) {
    await supabaseAdmin
      .from('workspaces')
      .update({ payout_status: newStatus })
      .eq('id', workspace.id);

    console.log(`[${requestId}] Updated workspace payout status`, { workspace_id: workspace.id, payout_status: newStatus });
  }
}

// Handle refund (Direct Charges - refund processed on connected account)
async function handleChargeRefunded(charge: Stripe.Charge, requestId: string) {
  // Find booking by payment intent
  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, total_price, amount_refunded, workspace_id')
    .eq('payment_intent_id', charge.payment_intent)
    .single();

  if (!booking) {
    console.log(`[${requestId}] No booking found for charge`, { charge_id: charge.id });
    return;
  }

  // Calculate refunded amount
  const refundedCents = charge.amount_refunded;
  const refundedAmount = refundedCents / 100;

  // Determine payment status
  const totalRefunded = (booking.amount_refunded || 0) + refundedAmount;
  const isFullRefund = totalRefunded >= booking.total_price;

  await supabaseAdmin
    .from('bookings')
    .update({
      amount_refunded: totalRefunded,
      payment_status: isFullRefund ? 'refunded' : 'partial_refunded',
    })
    .eq('id', booking.id);

  // Track refund analytics event (find site_id via workspace)
  const { data: refundSite } = await supabaseAdmin
    .from('sites')
    .select('id')
    .eq('workspace_id', booking.workspace_id)
    .limit(1)
    .single();

  if (refundSite) {
    const { error: refundTrackError } = await supabaseAdmin.rpc('track_event', {
      p_site_id: refundSite.id,
      p_event_type: 'payment_refunded',
      p_session_id: crypto.randomUUID(),
      p_metadata: {
        booking_id: booking.id,
        refund_amount: refundedAmount,
        total_refunded: totalRefunded,
        is_full_refund: isFullRefund,
        currency: 'EUR',
      },
    });
    if (refundTrackError) {
      console.error(`[${requestId}] Failed to track payment_refunded`, refundTrackError);
    }
  }

  console.log(`[${requestId}] Refund processed`, {
    booking_id: booking.id,
    amount: refundedAmount,
  });
}
