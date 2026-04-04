/**
 * Landing Page Registry
 * Registers all landing pages with the router.
 */
import { registerLandingPage, registerLandingWildcard, navigateLanding } from '../../lib/landingRouter.js';
import { enFeatureSlugToDe } from '../../lib/featureSlugLocale.js';
import { renderNotFoundPage } from './NotFoundPage.js';

// Page imports
import { renderHomePage } from './HomePage.js';
import { renderPricingPage } from './PricingPage.js';
import { renderProductPage } from './ProductPage.js';
import { renderFeaturesHubPage } from './features/FeaturesHubPage.js';
import { renderFeaturePage } from './features/FeaturePageTemplate.js';
import { renderImpressumPage } from './legal/ImpressumPage.js';
import { renderDatenschutzPage } from './legal/DatenschutzPage.js';
import { renderAGBPage } from './legal/AGBPage.js';
import { renderAboutPage } from './AboutPage.js';
import { renderContactPage } from './ContactPage.js';
import { renderWaitlistConfirmPage } from './WaitlistConfirmPage.js';
import { setPageMeta } from '../../lib/seoHelper.js';
import { registerEnFeaturePages } from '../../lib/getLocaleContent.js';
import { managementEn } from '../../locales/en/features/management.js';
import { platformEn } from '../../locales/en/features/platform.js';

registerEnFeaturePages({ ...managementEn, ...platformEn });

const FEATURE_REDIRECTS_DE = {
  approval: '/features/buchungen',
  verfuegbarkeit: '/features/objekte',
  buffer: '/features/objekte',
  zeitfenster: '/features/objekte',
  urlaub: '/features/objekte',
  overnight: '/features/services',
  kaution: '/features/zahlungen',
  addons: '/features/services',
  gutscheine: '/features/zahlungen',
  'email-templates': '/features/buchungen',
  kunden: '/features/analytics',
};

const FEATURE_REDIRECTS_EN = {
  'approval': '/en/features/bookings',
  'approval-flow': '/en/features/bookings',
  availability: '/en/features/objects',
  buffer: '/en/features/objects',
  'time-slots': '/en/features/objects',
  vacation: '/en/features/objects',
  overnight: '/en/features/services',
  deposits: '/en/features/payments',
  addons: '/en/features/services',
  vouchers: '/en/features/payments',
  'email-templates': '/en/features/bookings',
  customers: '/en/features/analytics',
};

const handleFeatureRedirect = (slug, locale) => {
  const map = locale === 'en' ? FEATURE_REDIRECTS_EN : FEATURE_REDIRECTS_DE;
  const target = map[slug];
  if (target) {
    const [path, hash] = target.split('#');
    navigateLanding(path, true);
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    return true;
  }
  return false;
};

const renderDeFeaturePageWithRedirect = (slug, locale) => {
  if (handleFeatureRedirect(slug, locale || 'de')) return;
  return renderFeaturePage(slug, locale || 'de');
};

const renderEnFeaturePage = (enSlug, locale) => {
  if (handleFeatureRedirect(enSlug, 'en')) return;
  const deSlug = enFeatureSlugToDe(enSlug);
  if (!deSlug) {
    renderNotFoundPage(locale || 'en');
    return;
  }
  return renderFeaturePage(deSlug, locale || 'en');
};

const createLandingRedirect = (targetPath) => () => {
  navigateLanding(targetPath, true);
};

const createPlaceholder = (title, description) => () => {
  setPageMeta(title, description || 'Diese Seite wird bald verfügbar sein.');

  const content = document.getElementById('landing-content');
  if (content) {
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container">
          <div class="landing-hero-centered">
            <h1 class="landing-h1">${title}</h1>
            <p class="landing-text-lg">Diese Seite wird bald verfügbar sein.</p>
            <div class="landing-hero-ctas" style="justify-content: center;">
              <a href="/" class="landing-btn landing-btn-primary" data-landing-link title="Zur Startseite wechseln">Zur Startseite</a>
            </div>
          </div>
        </div>
      </section>`;
  }
};

/**
 * Register all landing page routes
 */
export const registerAllLandingPages = () => {
  registerLandingPage('/', renderHomePage);
  registerLandingPage('/en', renderHomePage);
  registerLandingPage('/produkt', renderProductPage);
  registerLandingPage('/preise', renderPricingPage);
  registerLandingPage('/integrationen', createLandingRedirect('/produkt'));
  registerLandingPage('/ressourcen', createPlaceholder('Ressourcen', 'Ressourcen und Hilfestellungen fuer BookFast folgen in Kuerze.'));
  registerLandingPage('/ueber-uns', renderAboutPage);
  registerLandingPage('/kontakt', renderContactPage);
  registerLandingPage('/features', renderFeaturesHubPage);
  registerLandingPage('/impressum', renderImpressumPage);
  registerLandingPage('/datenschutz', renderDatenschutzPage);
  registerLandingPage('/agb', renderAGBPage);
  registerLandingPage('/waitlist/confirm', renderWaitlistConfirmPage);
  registerLandingWildcard('/features/', renderDeFeaturePageWithRedirect);
  registerLandingWildcard('/en/features/', renderEnFeaturePage);

  registerLandingPage('/en/product', renderProductPage);
  registerLandingPage('/en/pricing', renderPricingPage);
  registerLandingPage('/en/integrations', createLandingRedirect('/en/product'));
  registerLandingPage('/en/resources', createPlaceholder('Resources', 'Resources and guides for BookFast will be available soon.'));
  registerLandingPage('/en/about', renderAboutPage);
  registerLandingPage('/en/contact', renderContactPage);
  registerLandingPage('/en/features', renderFeaturesHubPage);
  registerLandingPage('/en/imprint', renderImpressumPage);
  registerLandingPage('/en/privacy', renderDatenschutzPage);
  registerLandingPage('/en/terms', renderAGBPage);
  registerLandingPage('/en/waitlist/confirm', renderWaitlistConfirmPage);
};
