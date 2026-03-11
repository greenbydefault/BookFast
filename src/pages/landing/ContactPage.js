/**
 * Contact Page
 */
import { createFeatureHero } from '../../components/landing/FeatureHero.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setBreadcrumbSchema, setContactPageSchema } from '../../lib/seoHelper.js';
import { supabase } from '../../lib/supabaseClient.js';
import '../../components/landing/ContactPage.css';

const SUPPORT_EMAIL = 'admin@bookfast.de';

const contactFormHTML = `
  <div class="landing-frosted-frame contact-form-frame">
    <h2 class="landing-h2 contact-form-heading">Nachricht senden</h2>
    <form id="contact-form" class="contact-form">
      <div>
        <label class="contact-form__label">Name</label>
        <input type="text" name="name" required placeholder="Dein Name" class="contact-form__input">
      </div>
      <div>
        <label class="contact-form__label">E-Mail</label>
        <input type="email" name="email" required placeholder="deine@email.de" class="contact-form__input">
        <p class="landing-text-sm contact-form__hint">Wir antworten an diese Adresse.</p>
      </div>
      <div>
        <label class="contact-form__label">Betreff</label>
        <select name="subject" class="contact-form__input contact-form__select">
          <option>Allgemeine Frage</option>
          <option>Technischer Support</option>
          <option>Enterprise-Anfrage</option>
          <option>Partnerschaft</option>
          <option>Feedback</option>
        </select>
      </div>
      <div>
        <label class="contact-form__label">Nachricht</label>
        <textarea name="message" rows="5" required placeholder="Beschreibe kurz dein Anliegen …" class="contact-form__input contact-form__textarea"></textarea>
      </div>
      <div>
        <button type="submit" class="landing-btn landing-btn-primary">Nachricht senden</button>
      </div>
    </form>
  </div>
`;

export const renderContactPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Kontakt', 'Kontaktiere das BookFast-Team – wir helfen dir weiter.');
  setBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Kontakt', url: '/kontakt' },
  ]);
  setContactPageSchema();

  content.innerHTML = `
    ${createFeatureHero({
      headline: 'Schreib uns – wir helfen dir weiter.',
      subheadline: 'Technischer Support, Enterprise-Anfragen oder Feedback – einfach das Formular ausfüllen.',
      illustrationSrc: '/src/svg/illustrations/landingpage/features/ft_kontakt.svg',
      illustrationAlt: 'Illustration zur Kontaktaufnahme mit dem BookFast Team',
      breadcrumb: ['Home', 'Kontakt'],
      demoModuleHTML: contactFormHTML,
    })}
  `;

  const form = content.querySelector('#contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';

    const data = Object.fromEntries(new FormData(form));
    const { error } = await supabase.functions.invoke('contact-form', { body: data });

    const frame = form.closest('.contact-form-frame');
    if (error) {
      btn.disabled = false;
      btn.textContent = 'Nachricht senden';
      if (frame) {
        const existing = frame.querySelector('.contact-form__error');
        if (!existing) {
          const msg = document.createElement('p');
          msg.className = 'landing-text-sm contact-form__error';
          msg.style.color = 'var(--color-red-600, #dc2626)';
          msg.style.marginTop = '0.5rem';
          const rawError = String(error?.message || error?.name || '');
          const notFound = rawError.includes('NOT_FOUND')
            || rawError.includes('Requested function was not found');
          msg.innerHTML = notFound
            ? `Kontaktformular ist gerade nicht verfuegbar. Bitte sende uns kurz direkt an <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`
            : `Nachricht konnte nicht gesendet werden. Bitte versuche es nochmal oder schreibe an <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`;
          form.querySelector('div:last-child').appendChild(msg);
        }
      }
      return;
    }

    if (frame) {
      frame.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">${iconImg('check.svg')}</div>
          <h3 class="landing-h3">Nachricht gesendet!</h3>
          <p class="landing-text-sm">Wir melden uns so schnell wie möglich bei dir.</p>
        </div>`;
    }
  });
};
