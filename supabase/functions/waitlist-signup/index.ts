/**
 * waitlist-signup — Register an email for the BookFast waitlist (Double-Opt-In)
 *
 * Auth: NONE (public endpoint, verify_jwt: false)
 * Input: { email: string }
 * Output: { success: true } (always generic to prevent enumeration)
 *
 * Secrets required:
 *   RESEND_API_KEY, WAITLIST_FROM_EMAIL, WAITLIST_REPLY_TO (optional),
 *   WAITLIST_CONFIRM_URL_BASE
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, getCorsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { generateToken, hashToken } from '../_shared/tokenUtils.ts';
import { checkRateLimit } from '../_shared/rateLimit.ts';
import { sendEmail, buildWaitlistDoiHtml } from '../_shared/email.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOI_COOLDOWN_MS = 2 * 60 * 1000; // 2 min between resends

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;
  const headers = getCorsHeaders(req);

  if (req.method !== 'POST') {
    return jsonRes({ error: 'Method Not Allowed' }, 405, { ...headers, Allow: 'POST' });
  }

  // Rate-limit: 5 requests per minute per IP
  const rl = checkRateLimit(req, { bucket: 'waitlist-signup', maxRequests: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: 'Zu viele Anfragen. Bitte versuche es gleich nochmal.' }),
      { status: 429, headers: { ...headers, 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  try {
    let body: Record<string, unknown> | null = null;
    try {
      body = await req.json();
    } catch {
      return jsonRes({ error: 'Ungültiger JSON-Body.' }, 400, headers);
    }

    const rawEmail: string | undefined = (body as Record<string, unknown>)?.email as string | undefined;

    if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.trim()) {
      return jsonRes({ error: 'E-Mail ist erforderlich.' }, 400, headers);
    }

    const email = rawEmail.trim();
    const emailNormalized = email.toLowerCase();

    if (!EMAIL_REGEX.test(emailNormalized) || emailNormalized.length > 320) {
      return jsonRes({ error: 'Ungültige E-Mail-Adresse.' }, 400, headers);
    }

    // Check for existing entry
    const { data: existing } = await supabaseAdmin
      .from('waitlist_entries')
      .select('id, status, confirm_sent_at')
      .eq('email_normalized', emailNormalized)
      .maybeSingle();

    if (existing?.status === 'confirmed') {
      // Already confirmed — generic success (no enumeration leak)
      return jsonRes({ success: true }, 200, headers);
    }

    if (existing?.status === 'pending') {
      // Pending — resend DOI if cooldown elapsed
      const lastSent = existing.confirm_sent_at ? new Date(existing.confirm_sent_at).getTime() : 0;
      if (Date.now() - lastSent < DOI_COOLDOWN_MS) {
        return jsonRes({ success: true }, 200, headers);
      }

      // Generate fresh token
      const token = generateToken();
      const tokenHash = await hashToken(token);

      await supabaseAdmin
        .from('waitlist_entries')
        .update({ confirm_token_hash: tokenHash, confirm_sent_at: new Date().toISOString() })
        .eq('id', existing.id);

      await sendDoiEmail(email, token);
      return jsonRes({ success: true }, 200, headers);
    }

    // New entry
    const token = generateToken();
    const tokenHash = await hashToken(token);

    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0]?.trim() : req.headers.get('x-real-ip') || null;

    const { error: insertErr } = await supabaseAdmin
      .from('waitlist_entries')
      .insert({
        email,
        email_normalized: emailNormalized,
        status: 'pending',
        confirm_token_hash: tokenHash,
        confirm_sent_at: new Date().toISOString(),
        ip_address: ip,
        source: 'landing',
      });

    if (insertErr) {
      // Unique violation = race condition with concurrent insert → treat as success
      if (insertErr.code === '23505') {
        return jsonRes({ success: true }, 200, headers);
      }
      console.error('Waitlist insert error:', insertErr);
      return jsonRes({ error: 'Interner Fehler.' }, 500, headers);
    }

    await sendDoiEmail(email, token);
    return jsonRes({ success: true }, 200, headers);

  } catch (err) {
    console.error('waitlist-signup error:', err);
    return jsonRes({ error: 'Interner Fehler.' }, 500, headers);
  }
});

// ─── Helpers ───

function jsonRes(data: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

async function sendDoiEmail(to: string, token: string) {
  const base = Deno.env.get('WAITLIST_CONFIRM_URL_BASE') || 'https://book-fast.de/waitlist/confirm';
  const confirmUrl = `${base}?token=${token}`;
  const from = Deno.env.get('WAITLIST_FROM_EMAIL') || 'BookFast <noreply@book-fast.de>';
  const replyTo = Deno.env.get('WAITLIST_REPLY_TO') || undefined;

  await sendEmail({
    to,
    from,
    replyTo,
    subject: 'Bestätige deine Waitlist-Anmeldung',
    html: buildWaitlistDoiHtml(confirmUrl),
  });
}
