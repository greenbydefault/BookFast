/**
 * contact-form — Forwards landing page contact form submissions to admin@bookfast.de
 *
 * Auth: NONE (public endpoint, verify_jwt: false)
 * Input: { name: string, email: string, subject: string, message: string }
 * Output: { success: true }
 *
 * Secrets required:
 *   RESEND_API_KEY
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_EMAIL = 'admin@bookfast.de';
const FROM_EMAIL = 'BookFast Kontakt <noreply@book-fast.de>';
const RESEND_API_URL = 'https://api.resend.com/emails';

const ALLOWED_ORIGINS = [
  'https://book-fast.de',
  'https://www.book-fast.de',
  'https://app.book-fast.de',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonRes({ error: 'Method Not Allowed' }, 405, corsHeaders);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonRes({ error: 'Ungültiger JSON-Body.' }, 400, corsHeaders);
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !email || !message) {
    return jsonRes({ error: 'Name, E-Mail und Nachricht sind erforderlich.' }, 400, corsHeaders);
  }
  if (!EMAIL_REGEX.test(email.toLowerCase()) || email.length > 320) {
    return jsonRes({ error: 'Ungültige E-Mail-Adresse.' }, 400, corsHeaders);
  }

  const safeSubject = subject || 'Allgemeine Frage';
  const emailHtml = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><title>Neue Kontaktanfrage</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="padding:32px 40px;color:#1a1a1a;font-size:15px;line-height:1.6;">
          <h2 style="margin:0 0 24px 0;font-size:20px;">Neue Kontaktanfrage über book-fast.de</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:600;width:100px;vertical-align:top;">Name</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;vertical-align:top;">E-Mail</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#4f46e5;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:600;vertical-align:top;">Betreff</td><td style="padding:8px 0;">${escapeHtml(safeSubject)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;vertical-align:top;">Nachricht</td><td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY is not set');

    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `[BookFast Kontakt] ${safeSubject} – ${name}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Resend error ${res.status}: ${errBody}`);
    }

    return jsonRes({ success: true }, 200, corsHeaders);
  } catch (err) {
    console.error('contact-form send error:', err);
    return jsonRes({ error: 'E-Mail konnte nicht gesendet werden.' }, 500, corsHeaders);
  }
});

function jsonRes(data: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
