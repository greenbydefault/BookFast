/**
 * 404 Not Found Page
 * Rendered when no landing route matches (fallback in landingRouter).
 */
import { setPageMeta } from '../../lib/seoHelper.js';
import '../../styles/landing/not-found.css';

const ILLUSTRATION_URL = new URL('../../svg/illustrations/landingpage/404/404.svg', import.meta.url).href;

export const renderNotFoundPage = (locale = 'de') => {
  const isEn = locale === 'en';
  setPageMeta(
    isEn ? 'Page not found' : 'Seite nicht gefunden',
    isEn
      ? 'This page no longer exists. Back to the homepage.'
      : 'Diese Seite ist leider nicht mehr da. Zurück zur Startseite.',
    { noindex: true },
  );

  const content = document.getElementById('landing-content');
  if (!content) return;

  const homeHref = isEn ? '/en' : '/';
  const alt = isEn
    ? '404 illustration for a BookFast page that was not found'
    : '404 Illustration für eine nicht gefundene BookFast Seite';
  const h1 = isEn ? 'This page no longer exists.' : 'Diese Seite ist leider nicht mehr da.';
  const lead = isEn ? 'No problem — you can get back to the homepage from here.' : "Kein Problem – hier geht's zurück zur Startseite.";
  const linkText = isEn ? 'Go to homepage' : 'Zur Startseite';
  const linkTitle = isEn ? 'Go to homepage' : 'Zur Startseite wechseln';

  content.innerHTML = `
    <section class="landing-section landing-not-found">
      <div class="landing-container">
        <div class="landing-not-found__inner">
          <img src="${ILLUSTRATION_URL}" alt="${alt}" class="landing-not-found__illustration" loading="eager">
          <h1 class="landing-h1">${h1}</h1>
          <p class="landing-text">${lead}</p>
          <a href="${homeHref}" class="landing-btn landing-btn-primary landing-btn-md" data-landing-link title="${linkTitle}">${linkText}</a>
        </div>
      </div>
    </section>
  `;
};
