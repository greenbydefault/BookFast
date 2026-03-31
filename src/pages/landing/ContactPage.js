/**
 * Contact Page
 */
import { createFeatureHero } from '../../components/landing/FeatureHero.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setBreadcrumbSchema, setContactPageSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { supabase } from '../../lib/supabaseClient.js';
import '../../components/landing/ContactPage.css';

const SUPPORT_EMAIL = 'admin@bookfast.de';

const contactFormHTML = (isEn) => `
  <div class="landing-frosted-frame contact-form-frame">
    <h2 class="landing-h2 contact-form-heading">${isEn ? 'Send message' : 'Nachricht senden'}</h2>
    <form id="contact-form" class="contact-form">
      <div>
        <label class="contact-form__label">Name</label>
        <input type="text" name="name" required placeholder="${isEn ? 'Your name' : 'Dein Name'}" class="contact-form__input">
      </div>
      <div>
        <label class="contact-form__label">${isEn ? 'Email' : 'E-Mail'}</label>
        <input type="email" name="email" required placeholder="deine@email.de" class="contact-form__input">
        <p class="landing-text-sm contact-form__hint">${isEn ? 'We will reply to this address.' : 'Wir antworten an diese Adresse.'}</p>
      </div>
      <div>
        <label class="contact-form__label">${isEn ? 'Subject' : 'Betreff'}</label>
        <select name="subject" class="contact-form__input contact-form__select">
          <option>${isEn ? 'General question' : 'Allgemeine Frage'}</option>
          <option>${isEn ? 'Technical support' : 'Technischer Support'}</option>
          <option>${isEn ? 'Enterprise inquiry' : 'Enterprise-Anfrage'}</option>
          <option>${isEn ? 'Partnership' : 'Partnerschaft'}</option>
          <option>Feedback</option>
        </select>
      </div>
      <div>
        <label class="contact-form__label">${isEn ? 'Message' : 'Nachricht'}</label>
        <textarea name="message" rows="5" required placeholder="${isEn ? 'Briefly describe your request…' : 'Beschreibe kurz dein Anliegen …'}" class="contact-form__input contact-form__textarea"></textarea>
      </div>
      <div>
        <button type="submit" class="landing-btn landing-btn-primary">${isEn ? 'Send message' : 'Nachricht senden'}</button>
      </div>
    </form>
  </div>
`;

export const renderContactPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';

  setPageMeta(
    isEn ? 'Contact' : 'Kontakt',
    isEn
      ? 'Contact the BookFast team — we are here to help.'
      : 'Kontaktiere das BookFast-Team – wir helfen dir weiter.',
    { locale },
  );
  setBreadcrumbSchema(
    isEn
      ? [
          { name: 'Home', url: '/en' },
          { name: 'Contact', url: '/en/contact' },
        ]
      : [
          { name: 'Home', url: '/' },
          { name: 'Kontakt', url: '/kontakt' },
        ],
  );
  setContactPageSchema({ locale });
  setHreflangAlternates([
    { hreflang: 'de', path: '/kontakt' },
    { hreflang: 'en', path: '/en/contact' },
  ]);

  content.innerHTML = `
    ${createFeatureHero({
      headline: isEn
        ? 'Write to us — we are happy to help.'
        : 'Schreib uns – wir helfen dir weiter.',
      subheadline: isEn
        ? 'Technical support, enterprise inquiries, or feedback — just use the form.'
        : 'Technischer Support, Enterprise-Anfragen oder Feedback – einfach das Formular ausfüllen.',
      illustrationSrc: '/src/svg/illustrations/landingpage/features/ft_kontakt.svg',
      illustrationAlt: isEn
        ? 'Illustration for contacting the BookFast team'
        : 'Illustration zur Kontaktaufnahme mit dem BookFast Team',
      breadcrumb: isEn ? ['Home', 'Contact'] : ['Home', 'Kontakt'],
      breadcrumbHrefs: isEn ? ['/en'] : undefined,
      demoModuleHTML: contactFormHTML(isEn),
    })}
  `;

  const form = content.querySelector('#contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = isEn ? 'Sending…' : 'Wird gesendet …';

    const data = Object.fromEntries(new FormData(form));
    const { error } = await supabase.functions.invoke('contact-form', { body: data });

    const frame = form.closest('.contact-form-frame');
    if (error) {
      btn.disabled = false;
      btn.textContent = isEn ? 'Send message' : 'Nachricht senden';
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
            ? (isEn
              ? `The contact form is temporarily unavailable. Please email us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`
              : `Kontaktformular ist gerade nicht verfuegbar. Bitte sende uns kurz direkt an <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`)
            : (isEn
              ? `Message could not be sent. Please try again or write to <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`
              : `Nachricht konnte nicht gesendet werden. Bitte versuche es nochmal oder schreibe an <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`);
          form.querySelector('div:last-child').appendChild(msg);
        }
      }
      return;
    }

    if (frame) {
      frame.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">${iconImg('check.svg')}</div>
          <h3 class="landing-h3">${isEn ? 'Message sent!' : 'Nachricht gesendet!'}</h3>
          <p class="landing-text-sm">${isEn ? 'We will get back to you as soon as possible.' : 'Wir melden uns so schnell wie möglich bei dir.'}</p>
        </div>`;
    }
  });
};
