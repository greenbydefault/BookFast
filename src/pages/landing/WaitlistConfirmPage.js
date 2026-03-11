/**
 * WaitlistConfirmPage — Landing route /waitlist/confirm?token=...
 * Calls the waitlist-confirm Edge Function and shows result.
 */

import { setPageMeta } from '../../lib/seoHelper.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const renderWaitlistConfirmPage = () => {
  setPageMeta('Waitlist bestätigen', 'Bestätige deine E-Mail-Adresse für die BookFast-Waitlist.');

  const content = document.getElementById('landing-content');
  if (!content) return;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    content.innerHTML = renderMessage('Ungültiger Link', 'Der Bestätigungslink ist ungültig. Bitte prüfe den Link aus deiner E-Mail.', true);
    return;
  }

  content.innerHTML = renderMessage('Wird bestätigt…', 'Deine E-Mail wird bestätigt, einen Moment bitte.', false);

  confirmToken(token).then(({ ok, message, alreadyConfirmed }) => {
    if (ok) {
      content.innerHTML = alreadyConfirmed
        ? renderMessage('Bereits bestätigt', 'Deine E-Mail-Adresse wurde bereits bestätigt. Du bist auf der Liste!', false)
        : renderMessage('Bestätigt!', 'Deine E-Mail-Adresse wurde erfolgreich bestätigt. Wir melden uns, sobald BookFast für dich bereit ist.', false);
    } else {
      content.innerHTML = renderMessage('Fehler', message || 'Ein Fehler ist aufgetreten.', true);
    }
  });
};

async function confirmToken(token) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/waitlist-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, message: data.error || `Fehler ${res.status}` };
    }

    return { ok: true, alreadyConfirmed: data.already_confirmed || false };
  } catch {
    return { ok: false, message: 'Verbindungsfehler. Bitte versuche es erneut.' };
  }
}

function renderMessage(title, text, isError) {
  return `
    <section style="text-align: center; padding: 8rem 2rem;">
      <h1 style="font-size: 2rem; margin-bottom: 1rem; color: ${isError ? '#dc2626' : 'var(--color-vulcan-900)'};">${title}</h1>
      <p style="color: var(--color-stone-600); font-size: 1.1rem; margin-bottom: 2rem; max-width: 480px; margin-inline: auto; line-height: 1.6;">${text}</p>
      <a href="/" class="landing-btn landing-btn-primary" data-landing-link title="Zur Startseite wechseln">Zur Startseite</a>
    </section>
  `;
}
