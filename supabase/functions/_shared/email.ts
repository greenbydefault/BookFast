/**
 * Email utility – Resend integration for BookFast
 *
 * Uses the RESEND_API_KEY secret stored in Supabase Edge Function secrets.
 * All emails are wrapped in a consistent, minimal HTML template.
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

// ─── Default template (fallback when workspace has none) ───

export const DEFAULT_CONFIRMATION_SUBJECT = 'Deine Buchung ist bestätigt!';

export const DEFAULT_CONFIRMATION_BODY = `Hallo {{customer_name}},

deine Buchung #{{booking_number}} wurde bestätigt!

Buchungsdetails:
- Service: {{service_name}}
- Objekt: {{object_name}}
- Zeitraum: {{start_date}} – {{end_date}}
- Gesamtpreis: {{total_price}}

Dein Zugangslink:
{{portal_link}}

Dein Zugangscode: {{pin_code}}

Mit diesem Link und Code kannst du jederzeit deine Buchungsdetails einsehen, Rechnungen herunterladen und bei Bedarf stornieren.

Vielen Dank und bis bald!
{{company_name}}`;

// ─── Template rendering ───

/**
 * Replace {{placeholder}} tokens in a template string with actual values.
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

// ─── HTML wrapper ───

/**
 * Wrap plain-text body content in a clean, responsive HTML email layout.
 * Line breaks in the body are converted to <br>.
 */
export function buildEmailHtml(
  bodyText: string,
  workspace: {
    company_name?: string;
    company_address?: string;
    company_zip?: string;
    company_city?: string;
    website?: string;
    email?: string;
  },
): string {
  // Convert plain text line breaks to HTML
  const bodyHtml = bodyText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    // Make URLs clickable
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" style="color: #2563eb; text-decoration: underline;">$1</a>',
    );

  const footerParts: string[] = [];
  if (workspace.company_name) footerParts.push(workspace.company_name);
  const addressParts: string[] = [];
  if (workspace.company_address) addressParts.push(workspace.company_address);
  if (workspace.company_zip || workspace.company_city) {
    addressParts.push(
      [workspace.company_zip, workspace.company_city].filter(Boolean).join(' '),
    );
  }
  if (addressParts.length) footerParts.push(addressParts.join(', '));
  if (workspace.website) footerParts.push(workspace.website);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buchungsbestätigung</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px; width: 100%;">
          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px; color: #1a1a1a; font-size: 15px; line-height: 1.6;">
              ${bodyHtml}
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 20px 40px; text-align: center; color: #a1a1aa; font-size: 12px; line-height: 1.5;">
              ${footerParts.join(' &middot; ')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Send via Resend ───

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from: string; // e.g. "BookFast <buchung@firma.de>"
  replyTo?: string;
}

/**
 * Send an email via the Resend API.
 * Returns the Resend message ID on success, throws on failure.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<string> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.id; // Resend message ID
}
