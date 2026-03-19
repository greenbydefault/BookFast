import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, getCorsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { stripe, calculatePlatformFee } from '../_shared/stripe.ts';
import { checkRateLimit } from '../_shared/rateLimit.ts';
import { calculatePricing, type PricingVoucher } from '../_shared/pricing.ts';

interface CheckoutCreateRequest {
  site_id: string;
  object_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  addon_ids?: string[];
  staff_id?: string;
  voucher_code?: string;
  session_id?: string;
  success_url?: string;
  cancel_url?: string;
  guest_count?: number;
  addon_selections?: any;
  customer_address?: string;
  customer_city?: string;
  customer_zip?: string;
}

const RESERVATION_MINUTES = 30;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUuid(value: string | undefined): boolean {
  return Boolean(value && UUID_REGEX.test(value));
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const rateLimit = checkRateLimit(req, {
    bucket: 'checkout-create',
    maxRequests: 60,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again shortly.' }),
      {
        status: 429,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body: CheckoutCreateRequest = await req.json();

    const {
      site_id,
      object_id,
      service_id,
      start_time,
      end_time,
      customer_name,
      customer_email,
      customer_phone,
      addon_ids,
      staff_id,
      voucher_code,
      session_id,
      success_url,
      cancel_url,
      guest_count,
      addon_selections,
      customer_address,
      customer_city,
      customer_zip,
    } = body;

    // Validate required fields
    if (!site_id || !object_id || !service_id || !start_time || !end_time || !customer_name || !customer_email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidUuid(site_id) || !isValidUuid(object_id) || !isValidUuid(service_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid identifier format' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (!EMAIL_REGEX.test(customer_email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (customer_name.trim().length === 0 || customer_name.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Invalid customer name length' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (customer_phone && customer_phone.length > 40) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number length' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (customer_address && customer_address.length > 300) {
      return new Response(
        JSON.stringify({ error: 'Invalid address length' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (customer_city && customer_city.length > 120) {
      return new Response(
        JSON.stringify({ error: 'Invalid city length' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (customer_zip && customer_zip.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Invalid postal code length' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (guest_count !== undefined && (!Number.isInteger(guest_count) || guest_count < 1 || guest_count > 100)) {
      return new Response(
        JSON.stringify({ error: 'Invalid guest count' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (staff_id && !isValidUuid(staff_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid staff identifier format' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (addon_ids && (!Array.isArray(addon_ids) || addon_ids.some((id) => !isValidUuid(id)))) {
      return new Response(
        JSON.stringify({ error: 'Invalid addon identifier format' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Get site and workspace
    const { data: site, error: siteError } = await supabaseAdmin
      .from('sites')
      .select('workspace_id')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return new Response(
        JSON.stringify({ error: 'Site not found' }),
        { status: 404, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Get workspace with Stripe account
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from('workspaces')
      .select('id, name, stripe_connected_account_id, payout_status, payment_methods_enabled')
      .eq('id', site.workspace_id)
      .single();

    if (wsError || !workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found' }),
        { status: 404, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Check if payments are enabled
    if (!workspace.stripe_connected_account_id || workspace.payout_status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Online payments are not enabled for this workspace' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Get service details
    const { data: service, error: svcError } = await supabaseAdmin
      .from('services')
      .select('id, name, price, price_type, cleaning_fee, deposit_enabled, deposit_percent, duration_minutes, service_type, buffer_before_minutes, buffer_after_minutes')
      .eq('id', service_id)
      .single();

    if (svcError || !service) {
      return new Response(
        JSON.stringify({ error: 'Service not found' }),
        { status: 404, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Get object for name
    const { data: object } = await supabaseAdmin
      .from('objects')
      .select('name')
      .eq('id', object_id)
      .single();

    // Clean up old reservations from this session before checking
    if (session_id) {
      await supabaseAdmin
        .from('slot_reservations')
        .delete()
        .eq('browser_session_id', session_id);
    }

    // Check availability using RPC
    const { data: isAvailable, error: availError } = await supabaseAdmin
      .rpc('check_availability', {
        p_object_id: object_id,
        p_start_time: start_time,
        p_end_time: end_time,
        p_buffer_before: service.buffer_before_minutes || 0,
        p_buffer_after: service.buffer_after_minutes || 0,
        p_session_id: session_id || null,
      });

    if (availError || !isAvailable) {
      return new Response(
        JSON.stringify({ error: 'Selected time slot is not available' }),
        { status: 409, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Get addon prices
    let addonItems: { id: string; name: string; price: number }[] = [];

    if (addon_ids && addon_ids.length > 0) {
      const { data: addons } = await supabaseAdmin
        .from('addons')
        .select('id, name, price')
        .in('id', addon_ids);

      if (addons) {
        addonItems = addons.map(a => ({ id: a.id, name: a.name, price: Number(a.price) }));
      }
    }

    // Apply voucher if provided
    let voucher: PricingVoucher | undefined;
    let voucherId = null;

    if (voucher_code) {
      const { data: voucherResult } = await supabaseAdmin
        .rpc('validate_voucher', {
          p_workspace_id: workspace.id,
          p_code: voucher_code,
        });

      if (voucherResult?.valid) {
        voucherId = voucherResult.id;
        voucher = {
          id: voucherResult.id,
          discount_type: voucherResult.discount_type,
          discount_value: Number(voucherResult.discount_value) || 0,
        };
      }
    }

    const pricing = calculatePricing({
      service,
      start_time,
      end_time,
      guest_count,
      addons: addonItems,
      voucher,
    });

    // Convert to cents for Stripe
    const amountCents = Math.round(pricing.amountToCharge * 100);
    const platformFeeCents = calculatePlatformFee(amountCents);

    // Create slot reservation
    const expiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000).toISOString();
    const checkoutSessionId = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { error: reservationError } = await supabaseAdmin
        .from('slot_reservations')
        .insert({
          object_id,
          service_id,
          start_time,
          end_time,
          checkout_session_id: checkoutSessionId,
          customer_email,
          expires_at: expiresAt,
          browser_session_id: session_id || null,
        });

      if (reservationError) throw reservationError;

      // Build line items for Stripe
      const lineItems = [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.name,
              description: object?.name ? `${object.name}` : undefined,
            },
            unit_amount: Math.round(pricing.servicePrice * 100),
          },
          quantity: 1,
        },
      ];

      if (pricing.cleaningFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Reinigungsgebühr',
            },
            unit_amount: Math.round(pricing.cleaningFee * 100),
          },
          quantity: 1,
        });
      }

      addonItems.forEach(addon => {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: addon.name,
            },
            unit_amount: Math.round(addon.price * 100),
          },
          quantity: 1,
        });
      });

      // Build metadata for webhook
      const metadata = {
        site_id,
        workspace_id: workspace.id,
        object_id,
        service_id,
        start_time,
        end_time,
        customer_name,
        customer_email,
        customer_phone: customer_phone || '',
        addon_ids: JSON.stringify(addon_ids || []),
        staff_id: staff_id || '',
        voucher_id: voucherId || '',
        service_price: pricing.servicePrice.toString(),
        cleaning_fee: pricing.cleaningFee.toString(),
        addons_price: pricing.addonsPrice.toString(),
        discount_amount: pricing.discountAmount.toString(),
        total_price: pricing.totalPrice.toString(),
        amount_deposit: pricing.depositAmount?.toString() || '',
        reservation_id: checkoutSessionId,
        session_id: session_id || '',
        guest_count: pricing.guests.toString(),
        addon_selections: addon_selections ? JSON.stringify(addon_selections) : '',
        customer_address: customer_address || '',
        customer_city: customer_city || '',
        customer_zip: customer_zip || '',
      };

      // Create Stripe Checkout Session (Direct Charges - payment goes directly to connected account)
      const baseUrl = success_url?.split('?')[0] || Deno.env.get('APP_URL') || 'https://app.book-fast.de';

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: lineItems,
        discounts: pricing.discountAmount > 0 ? [{
          coupon: await createStripeCoupon(pricing.discountAmount, workspace.stripe_connected_account_id),
        }] : undefined,
        customer_email,
        metadata,
        payment_intent_data: {
          application_fee_amount: platformFeeCents,
          metadata,
        },
        success_url: success_url || `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancel_url || `${baseUrl}/booking-cancelled`,
        expires_at: Math.floor(Date.now() / 1000) + RESERVATION_MINUTES * 60,
      }, {
        stripeAccount: workspace.stripe_connected_account_id,
      });

      // Update reservation with actual session ID
      await supabaseAdmin
        .from('slot_reservations')
        .update({ checkout_session_id: session.id })
        .eq('checkout_session_id', checkoutSessionId);

      return new Response(
        JSON.stringify({
          success: true,
          checkout_url: session.url,
          session_id: session.id,
          expires_at: expiresAt,
          amount: pricing.amountToCharge,
          is_deposit: pricing.depositAmount !== null,
        }),
        { status: 200, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );

    } catch (innerError) {
      // If Stripe or any step failed, delete the pending reservation
      console.error('Inner checkout error, cleaning up reservation:', innerError);
      await supabaseAdmin
        .from('slot_reservations')
        .delete()
        .eq('checkout_session_id', checkoutSessionId);
      throw innerError;
    }

  } catch (error) {
    console.error('Checkout create error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});

// Helper to create one-time coupon for discount (on connected account for Direct Charges)
async function createStripeCoupon(discountAmount: number, stripeAccountId: string): Promise<string> {
  const coupon = await stripe.coupons.create({
    amount_off: Math.round(discountAmount * 100),
    currency: 'eur',
    duration: 'once',
    name: 'Gutschein',
  }, {
    stripeAccount: stripeAccountId,
  });
  return coupon.id;
}
