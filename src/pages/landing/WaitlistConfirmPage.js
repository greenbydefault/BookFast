/**
 * WaitlistConfirmPage — Landing route /waitlist/confirm?token=...
 * Calls the waitlist-confirm Edge Function and shows result.
 */

import { setPageMeta } from '../../lib/seoHelper.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const renderWaitlistConfirmPage = (locale = 'de') => {
  const isEn = locale === 'en';
  setPageMeta(
    isEn ? 'Confirm waitlist' : 'Waitlist bestätigen',
    isEn
      ? 'Confirm your email address for the BookFast waitlist.'
      : 'Bestätige deine E-Mail-Adresse für die BookFast-Waitlist.',
  );

  const content = document.getElementById('landing-content');
  if (!content) return;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    content.innerHTML = renderMessage(
      isEn ? 'Invalid link' : 'Ungültiger Link',
      isEn
        ? 'The confirmation link is invalid. Please check the link from your email.'
        : 'Der Bestätigungslink ist ungültig. Bitte prüfe den Link aus deiner E-Mail.',
      true,
      isEn,
    );
    return;
  }

  content.innerHTML = renderMessage(
    isEn ? 'Confirming…' : 'Wird bestätigt…',
    isEn
      ? 'Your email is being confirmed, please wait a moment.'
      : 'Deine E-Mail wird bestätigt, einen Moment bitte.',
    false,
    isEn,
  );

  confirmToken(token, isEn).then(({ ok, message, alreadyConfirmed }) => {
    if (ok) {
      content.innerHTML = alreadyConfirmed
        ? renderMessage(
            isEn ? 'Already confirmed' : 'Bereits bestätigt',
            isEn
              ? "Your email address has already been confirmed. You're on the list!"
              : 'Deine E-Mail-Adresse wurde bereits bestätigt. Du bist auf der Liste!',
            false,
            isEn,
          )
        : renderMessage(
            isEn ? 'Confirmed!' : 'Bestätigt!',
            isEn
              ? "Your email address has been confirmed successfully. We'll get in touch as soon as BookFast is ready for you."
              : 'Deine E-Mail-Adresse wurde erfolgreich bestätigt. Wir melden uns, sobald BookFast für dich bereit ist.',
            false,
            isEn,
          );
    } else {
      content.innerHTML = renderMessage(
        isEn ? 'Error' : 'Fehler',
        message || (isEn ? 'An error occurred.' : 'Ein Fehler ist aufgetreten.'),
        true,
        isEn,
      );
    }
  });
};

async function confirmToken(token, isEn) {
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
      return { ok: false, message: data.error || (isEn ? `Error ${res.status}` : `Fehler ${res.status}`) };
    }

    return { ok: true, alreadyConfirmed: data.already_confirmed || false };
  } catch {
    return {
      ok: false,
      message: isEn ? 'Connection error. Please try again.' : 'Verbindungsfehler. Bitte versuche es erneut.',
    };
  }
}

function renderMessage(title, text, isError, isEn) {
  const homeHref = isEn ? '/en' : '/';
  const linkText = isEn ? 'Go to homepage' : 'Zur Startseite';
  const linkTitle = isEn ? 'Go to homepage' : 'Zur Startseite wechseln';
  return `
    <section style="text-align: center; padding: 8rem 2rem;">
      <h1 style="font-size: 2rem; margin-bottom: 1rem; color: ${isError ? '#dc2626' : 'var(--color-vulcan-900)'};">${title}</h1>
      <p style="color: var(--color-stone-600); font-size: 1.1rem; margin-bottom: 2rem; max-width: 480px; margin-inline: auto; line-height: 1.6;">${text}</p>
      <a href="${homeHref}" class="landing-btn landing-btn-primary" data-landing-link title="${linkTitle}">${linkText}</a>
    </section>
  `;
}
