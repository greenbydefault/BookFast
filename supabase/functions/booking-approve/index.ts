import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin, createUserClient } from '../_shared/supabase.ts';
import { generateToken, hashToken, generatePin } from '../_shared/tokenUtils.ts';
import {
  sendEmail,
  buildEmailHtml,
  renderTemplate,
  DEFAULT_CONFIRMATION_SUBJECT,
  DEFAULT_CONFIRMATION_BODY,
} from '../_shared/email.ts';

interface BookingApproveRequest {
  booking_id: string;
}

// Helper: format date as "DD.MM.YYYY" for German locale
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Helper: format currency as "123,45 €"
function fmtPrice(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// Direct Charges: Payment already went directly to connected account
// This endpoint confirms the booking, auto-generates a Magic Link token, and sends a confirmation email

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
    const { booking_id }: BookingApproveRequest = await req.json();
    
    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'booking_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get booking with workspace + related data to verify ownership
    const userClient = createUserClient(authHeader);
    const { data: booking, error: bookingError } = await userClient
      .from('bookings')
      .select(`
        id, 
        status, 
        payment_status, 
        workspace_id,
        start_time,
        end_time,
        customer_name,
        customer_email,
        booking_number,
        total_price,
        objects(name),
        services(name),
        workspaces!inner(
          id, owner_id,
          company_name, company_address, company_zip, company_city, website, email,
          email_from_name, email_from_address,
          email_confirmation_subject, email_confirmation_body
        )
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
    if (booking.status !== 'pending_approval') {
      return new Response(
        JSON.stringify({ error: `Cannot approve booking with status: ${booking.status}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (booking.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'Cannot approve booking without payment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update booking status to confirmed
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to approve booking' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Auto-generate Magic Link token + PIN for customer portal
    let portalPath: string | null = null;
    let pinCode: string | null = null;
    try {
      const plainToken = generateToken();
      const tokenHash = await hashToken(plainToken);
      pinCode = generatePin();

      // Expiry: booking end_time + 60 days
      const bookingDate = new Date(booking.end_time || booking.start_time);
      const expiresAt = new Date(bookingDate.getTime() + 60 * 24 * 60 * 60 * 1000);

      // Revoke any existing tokens for this booking
      await supabaseAdmin
        .from('booking_access_tokens')
        .update({ is_revoked: true })
        .eq('booking_id', booking_id)
        .eq('is_revoked', false);

      // Store hash + plaintext + PIN
      await supabaseAdmin
        .from('booking_access_tokens')
        .insert({
          booking_id: booking.id,
          workspace_id: booking.workspace_id,
          token_hash: tokenHash,
          token_plaintext: plainToken,
          pin_code: pinCode,
          expires_at: expiresAt.toISOString(),
        });

      portalPath = `/b/${plainToken}`;
      console.log('Magic Link token + PIN created for booking:', booking_id);
    } catch (tokenErr) {
      // Token creation failure should not block the approval
      console.error('Failed to create portal token (non-blocking):', tokenErr);
    }

    // ─── Send confirmation email (non-blocking) ───
    let emailSent = false;
    let emailError: string | null = null;
    try {
      const ws = (booking as any).workspaces;
      const customerEmail = booking.customer_email;

      if (customerEmail && ws) {
        // Determine the portal URL (use origin from request or fallback)
        const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || '';
        const portalLink = portalPath ? `${origin}${portalPath}` : '';

        // Build template variables
        const variables: Record<string, string> = {
          customer_name: booking.customer_name || '',
          booking_number: booking.booking_number ? String(booking.booking_number) : '',
          service_name: (booking as any).services?.name || '',
          object_name: (booking as any).objects?.name || '',
          start_date: booking.start_time ? fmtDate(booking.start_time) : '',
          end_date: booking.end_time ? fmtDate(booking.end_time) : '',
          total_price: booking.total_price != null ? fmtPrice(booking.total_price) : '',
          portal_link: portalLink,
          pin_code: pinCode || '',
          company_name: ws.company_name || '',
        };

        // Use workspace template or fall back to defaults
        const subject = renderTemplate(
          ws.email_confirmation_subject || DEFAULT_CONFIRMATION_SUBJECT,
          variables,
        );
        const bodyText = renderTemplate(
          ws.email_confirmation_body || DEFAULT_CONFIRMATION_BODY,
          variables,
        );

        // Wrap in HTML
        const html = buildEmailHtml(bodyText, ws);

        // Build "from" address (non-white-label: always send from bookfast.de)
        const displayName = ws.company_name || ws.email_from_name || 'BookFast';
        const fromName = `${displayName} via BookFast`;
        const fromAddress = 'noreply@book-fast.de';
        const from = `${fromName} <${fromAddress}>`;

        await sendEmail({
          to: customerEmail,
          subject,
          html,
          from,
          replyTo: ws.email || undefined,
        });

        emailSent = true;
        console.log('Confirmation email sent to:', customerEmail);
      }
    } catch (emailErr: any) {
      // Email failure should NOT block the booking approval
      console.error('Failed to send confirmation email (non-blocking):', emailErr);
      emailError = emailErr?.message || String(emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_id,
        status: 'confirmed',
        portal_path: portalPath,
        email_sent: emailSent,
        email_error: emailError || undefined,
        message: 'Buchung bestätigt.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Booking approve error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
