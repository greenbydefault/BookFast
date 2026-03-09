/**
 * 404 Not Found Page
 * Rendered when no landing route matches (fallback in landingRouter).
 */
import { setPageMeta } from '../../lib/seoHelper.js';
import '../../styles/landing/not-found.css';

const ILLUSTRATION_URL = new URL('../../svg/illustrations/landingpage/404/404.svg', import.meta.url).href;

export const renderNotFoundPage = () => {
  setPageMeta('Seite nicht gefunden', 'Diese Seite ist leider nicht mehr da. Zurück zur Startseite.');

  const content = document.getElementById('landing-content');
  if (!content) return;

  content.innerHTML = `
    <section class="landing-section landing-not-found">
      <div class="landing-container">
        <div class="landing-not-found__inner">
          <img src="${ILLUSTRATION_URL}" alt="" class="landing-not-found__illustration" loading="eager">
          <h1 class="landing-h1">Diese Seite ist leider nicht mehr da.</h1>
          <p class="landing-text">Kein Problem – hier geht's zurück zur Startseite.</p>
          <a href="/" class="landing-btn landing-btn-primary landing-btn-md" data-landing-link>Zur Startseite</a>
        </div>
      </div>
    </section>
  `;
};
