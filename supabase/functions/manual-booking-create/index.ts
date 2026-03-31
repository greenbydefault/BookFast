import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { supabaseAdmin, createUserClient } from '../_shared/supabase.ts';
import { createPortalToken } from '../_shared/portalToken.ts';
import { sendEmail, buildEmailHtml, DEFAULT_CONFIRMATION_SUBJECT, DEFAULT_CONFIRMATION_BODY, renderTemplate } from '../_shared/email.ts';
import { calculateAddonQuantity, calculatePricing } from '../_shared/pricing.ts';

interface ManualBookingRequest {
    object_id: string;
    service_id: string;
    start_time: string;
    end_time: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_notes?: string;
    addon_ids?: string[];
    staff_id?: string;
    guest_count?: number;
    addon_selections?: any; // JSONB
    send_email?: boolean;
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    let createdBookingId: string | null = null;
    const cleanupBooking = async (bookingId: string) => {
        const deleteChildErrors: string[] = [];

        const { error: tokenDeleteError } = await supabaseAdmin
            .from('booking_access_tokens')
            .delete()
            .eq('booking_id', bookingId);
        if (tokenDeleteError) {
            deleteChildErrors.push(`booking_access_tokens: ${tokenDeleteError.message}`);
        }

        const { error: staffDeleteError } = await supabaseAdmin
            .from('booking_staff')
            .delete()
            .eq('booking_id', bookingId);
        if (staffDeleteError) {
            deleteChildErrors.push(`booking_staff: ${staffDeleteError.message}`);
        }

        const { error: addonsDeleteError } = await supabaseAdmin
            .from('booking_addons')
            .delete()
            .eq('booking_id', bookingId);
        if (addonsDeleteError) {
            deleteChildErrors.push(`booking_addons: ${addonsDeleteError.message}`);
        }

        const { error: bookingDeleteError } = await supabaseAdmin
            .from('bookings')
            .delete()
            .eq('id', bookingId);
        if (bookingDeleteError) {
            throw new Error(`Cleanup failed for booking ${bookingId}: ${bookingDeleteError.message}`);
        }

        if (deleteChildErrors.length > 0) {
            console.warn(`Cleanup finished with child delete warnings for booking ${bookingId}: ${deleteChildErrors.join('; ')}`);
        }
    };

    try {
        // Auth check: Must be authenticated user (admin/dashboard access)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'No authorization header' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Validate user has access to workspace (using RLS compliant client)
        const userClient = createUserClient(authHeader);
        const { data: { user }, error: userError } = await userClient.auth.getUser();

        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const contentType = req.headers.get('Content-Type');
        if (!contentType?.includes('application/json')) {
            return new Response(
                JSON.stringify({ error: 'Content-Type must be application/json' }),
                { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        let body: ManualBookingRequest;
        try {
            body = await req.json();
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON body' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const {
            object_id,
            service_id,
            start_time,
            end_time,
            customer_name,
            customer_email,
            customer_phone,
            customer_notes,
            addon_ids,
            staff_id,
            guest_count = 1,
            addon_selections,
            send_email = true
        } = body;

        if (!object_id || !service_id || !start_time || !end_time || !customer_name || !customer_email) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
        if (!Number.isInteger(guest_count) || guest_count < 1) {
            return new Response(
                JSON.stringify({ error: 'guest_count must be an integer >= 1' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 1. Fetch Service & Object details for pricing and workspace_id
        // using supabaseAdmin to bypass RLS for data gathering, but we should verify workspace ownership?
        // Actually, object/service belong to a workspace.

        const { data: service, error: serviceError } = await supabaseAdmin
            .from('services')
            .select('id, workspace_id, price, price_type, cleaning_fee, service_type, name')
            .eq('id', service_id)
            .single();

        if (serviceError || !service) {
            return new Response(
                JSON.stringify({ error: 'Service not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const { data: object, error: objectError } = await supabaseAdmin
            .from('objects')
            .select('id, name, workspace_id')
            .eq('id', object_id)
            .single();

        if (objectError || !object) {
            return new Response(
                JSON.stringify({ error: 'Object not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
        if (object.workspace_id !== service.workspace_id) {
            return new Response(
                JSON.stringify({ error: 'Object and service do not belong to the same workspace' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const { data: serviceObjectLink, error: serviceObjectError } = await supabaseAdmin
            .from('service_objects')
            .select('service_id')
            .eq('service_id', service_id)
            .eq('object_id', object_id)
            .maybeSingle();

        if (serviceObjectError) {
            throw new Error(`Failed to validate service/object link: ${serviceObjectError.message}`);
        }

        if (!serviceObjectLink) {
            return new Response(
                JSON.stringify({ error: 'Selected service is not linked to the selected object' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Verify user belongs to this workspace?
        // UserClient.from('workspaces').select('id').eq('id', service.workspace_id) ...
        // For now assuming if they can call the function with a valid JWT, they are okay (RLS on frontend usually prevents selecting wrong IDs).
        // But strict check is better.
        const { error: accessError } = await userClient
            .from('workspaces')
            .select('id')
            .eq('id', service.workspace_id)
            .single();

        if (accessError) {
            return new Response(
                JSON.stringify({ error: 'Access denied to this workspace' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 2. Calculate Price

        // Addons
        let addons: Array<{ id: string; price: number | string | null; pricing_type?: string | null }> = [];
        if (addon_ids && addon_ids.length > 0) {
            const { data: addonRows } = await supabaseAdmin
                .from('addons')
                .select('id, price, pricing_type')
                .in('id', addon_ids);

            if (addonRows) {
                addons = addonRows;
            }
        }

        const pricing = calculatePricing({
            service,
            start_time,
            end_time,
            guest_count,
            addons: addons.map((addon) => ({
                id: addon.id,
                price: addon.price,
                pricing_type: addon.pricing_type,
            })),
            addon_selections,
        });
        const total_price = pricing.totalPrice;

        // 3. Create Booking
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .insert({
                workspace_id: service.workspace_id,
                object_id,
                service_id,
                start_time,
                end_time,
                customer_name,
                customer_email,
                customer_phone,
                customer_notes,
                // Manual bookings start as payment_pending and switch to confirmed after successful payment
                status: 'payment_pending',
                payment_status: 'unpaid',  // Assume unpaid initially
                service_price: pricing.servicePrice + pricing.cleaningFee,
                addons_price: pricing.addonsPrice,
                discount_amount: pricing.discountAmount,
                total_price,
                guest_count,
                addon_selections,
                source: 'manual_dashboard' // Optional tracking
            })
            .select('id, booking_number, created_at')
            .single();

        if (bookingError || !booking) {
            console.error('Booking insert error', bookingError);
            throw new Error(`Failed to create booking record: ${bookingError?.message || 'Unknown error'} (${bookingError?.details || ''})`);
        }
        createdBookingId = booking.id;

        // 4. Link Addons & Staff
        if (addon_ids && addon_ids.length > 0) {
            const addonPriceMap = new Map(addons.map((addon) => [addon.id, Number(addon.price) || 0]));
            const addonSelectionsById = new Map(
                (Array.isArray(addon_selections) ? addon_selections : [])
                    .filter((selection) => selection?.addon_id)
                    .map((selection) => [selection.addon_id, selection]),
            );
            const addonInserts = addon_ids.map((aid) => {
                const unitPrice = addonPriceMap.get(aid) || 0;
                const addon = addons.find((entry) => entry.id === aid);
                const quantity = addon ? calculateAddonQuantity(
                    addon,
                    guest_count,
                    addonSelectionsById.get(aid) || null,
                ) : 1;
                return {
                    booking_id: booking.id,
                    addon_id: aid,
                    price_per_unit: unitPrice,
                    quantity,
                    total_price: unitPrice * quantity,
                };
            }).filter((addon) => addon.quantity > 0);
            const { error: bookingAddonsError } = await supabaseAdmin.from('booking_addons').insert(addonInserts);
            if (bookingAddonsError) {
                throw new Error(`Failed to link addons: ${bookingAddonsError.message}`);
            }
        }

        if (staff_id) {
            const { error: bookingStaffError } = await supabaseAdmin
                .from('booking_staff')
                .insert({ booking_id: booking.id, staff_id });
            if (bookingStaffError) {
                throw new Error(`Failed to link staff: ${bookingStaffError.message}`);
            }
        }

        // 5. Generate Magic Link Token
        const tokenResult = await createPortalToken({
            bookingId: booking.id,
            workspaceId: service.workspace_id,
            endTime: end_time,
            startTime: start_time,
            adminClient: supabaseAdmin,
        });
        const plainToken = tokenResult.plainToken;
        const pinCode = tokenResult.pinCode;

        // 6. Send Email (if requested)
        let emailId = null;
        let emailError: string | null = null;
        if (send_email) {
            // Fetch workspace details for email footer
            const { data: workspace } = await supabaseAdmin
                .from('workspaces')
                .select('*')
                .eq('id', service.workspace_id)
                .single();

            // Check for custom template
            const { data: template } = await supabaseAdmin
                .from('email_templates')
                .select('subject, body')
                .eq('workspace_id', service.workspace_id)
                .eq('template_type', 'booking_accepted')
                .single();

            const subject = template?.subject || DEFAULT_CONFIRMATION_SUBJECT;
            const rawBody = template?.body || DEFAULT_CONFIRMATION_BODY;

            // Construct Link
            // APP_URL env var or origin passed in req?
            // Usually provided via env.
            const appUrl = Deno.env.get('APP_URL') || 'https://app.book-fast.de';
            // Or construct from origin if available, but env is safer for server-side.
            // The user's specific portal URL:
            const portalLink = `${appUrl}/b/${plainToken}`;

            const variables = {
                customer_name,
                booking_number: booking.booking_number ? String(booking.booking_number) : 'PENDING',
                service_name: service.name,
                object_name: object.name,
                start_date: new Date(start_time).toLocaleDateString('de-DE'),
                end_date: new Date(end_time).toLocaleDateString('de-DE'),
                total_price: `${pricing.totalPrice.toFixed(2)} €`,
                portal_link: portalLink,
                pin_code: pinCode,
                company_name: workspace?.company_name || 'BookFast',
                company_email: workspace?.email || '', // fallback
            };

            const bodyText = renderTemplate(rawBody, variables);
            const html = buildEmailHtml(bodyText, workspace || {});

            try {
                const displayName = workspace?.company_name || workspace?.email_from_name || 'BookFast';
                const fromName = `${displayName} via BookFast`;
                const fromAddress = 'noreply@book-fast.de';
                const from = `${fromName} <${fromAddress}>`;
                emailId = await sendEmail({
                    to: customer_email,
                    subject: renderTemplate(subject, variables),
                    html,
                    from,
                    replyTo: workspace?.email || undefined
                });
            } catch (emailErr) {
                emailError = emailErr instanceof Error ? emailErr.message : 'Email send failed';
                throw new Error(`Failed to send email: ${emailError}`);
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                booking_id: booking.id,
                token: plainToken,
                pin: pinCode,
                email_sent: !!emailId,
                email_error: emailError
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Manual booking error:', error);

        if (createdBookingId) {
            try {
                await cleanupBooking(createdBookingId);
            } catch (cleanupError) {
                console.error('Manual booking cleanup error:', cleanupError);
            }
        }

        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
