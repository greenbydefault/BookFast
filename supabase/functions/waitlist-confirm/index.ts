/**
 * waitlist-confirm — Confirm a waitlist DOI token and sync to Resend Audience
 *
 * Auth: NONE (public endpoint, verify_jwt: false)
 * Input: { token: string }
 * Output: { success: true } on valid token
 *
 * Secrets required:
 *   RESEND_API_KEY, RESEND_AUDIENCE_ID_WAITLIST
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, getCorsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { hashToken } from '../_shared/tokenUtils.ts';
import { checkRateLimit } from '../_shared/rateLimit.ts';
import { createResendContact } from '../_shared/email.ts';

const TOKEN_MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;
  const headers = getCorsHeaders(req);

  const rl = checkRateLimit(req, { bucket: 'waitlist-confirm', maxRequests: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return jsonRes({ error: 'Zu viele Anfragen.' }, 429, headers);
  }

  try {
    const body = await req.json().catch(() => null);
    const token: string | undefined = body?.token;

    if (!token || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
      return jsonRes({ error: 'Ungültiger Bestätigungslink.' }, 400, headers);
    }

    const tokenHash = await hashToken(token);

    const { data: entry, error: lookupErr } = await supabaseAdmin
      .from('waitlist_entries')
      .select('id, email, email_normalized, status, confirm_sent_at')
      .eq('confirm_token_hash', tokenHash)
      .maybeSingle();

    if (lookupErr || !entry) {
      return jsonRes({ error: 'Ungültiger oder abgelaufener Bestätigungslink.' }, 404, headers);
    }

    // Already confirmed — idempotent success
    if (entry.status === 'confirmed') {
      return jsonRes({ success: true, already_confirmed: true }, 200, headers);
    }

    // Check token age
    if (entry.confirm_sent_at) {
      const age = Date.now() - new Date(entry.confirm_sent_at).getTime();
      if (age > TOKEN_MAX_AGE_MS) {
        return jsonRes({ error: 'Der Bestätigungslink ist abgelaufen. Bitte trag dich erneut ein.' }, 410, headers);
      }
    }

    // Mark confirmed + clear token (one-time use)
    const { error: updateErr } = await supabaseAdmin
      .from('waitlist_entries')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirm_token_hash: null,
      })
      .eq('id', entry.id);

    if (updateErr) {
      console.error('Waitlist confirm update error:', updateErr);
      return jsonRes({ error: 'Interner Fehler.' }, 500, headers);
    }

    // Sync to Resend Audience (best-effort, don't fail the confirmation)
    const audienceId = Deno.env.get('RESEND_AUDIENCE_ID_WAITLIST');
    if (audienceId) {
      try {
        const contactId = await createResendContact({ audienceId, email: entry.email });
        await supabaseAdmin
          .from('waitlist_entries')
          .update({ resend_contact_id: contactId })
          .eq('id', entry.id);
      } catch (syncErr) {
        console.error('Resend audience sync failed (non-blocking):', syncErr);
      }
    }

    return jsonRes({ success: true }, 200, headers);

  } catch (err) {
    console.error('waitlist-confirm error:', err);
    return jsonRes({ error: 'Interner Fehler.' }, 500, headers);
  }
});

function jsonRes(data: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
