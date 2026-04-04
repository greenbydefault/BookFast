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
import {
  CANONICAL_ROUTE_BY_KEY,
  PLACEHOLDER_ROUTE_BY_KEY,
  REDIRECT_ROUTE_BY_KEY,
} from '../../lib/routeConfig.js';

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

const createPlaceholder = (title, description) => (locale = 'de') => {
  const isEn = locale === 'en';
  setPageMeta(title, description || 'Diese Seite wird bald verfügbar sein.', {
    locale,
    noindex: true,
  });

  const content = document.getElementById('landing-content');
  if (content) {
    const bodyText = isEn
      ? 'This page will be available soon.'
      : 'Diese Seite wird bald verfügbar sein.';
    const homeHref = isEn ? '/en' : '/';
    const linkTitle = isEn ? 'Go to homepage' : 'Zur Startseite wechseln';
    const linkText = isEn ? 'Go to homepage' : 'Zur Startseite';
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container">
          <div class="landing-hero-centered">
            <h1 class="landing-h1">${title}</h1>
            <p class="landing-text-lg">${bodyText}</p>
            <div class="landing-hero-ctas" style="justify-content: center;">
              <a href="${homeHref}" class="landing-btn landing-btn-primary" data-landing-link title="${linkTitle}">${linkText}</a>
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
  const canonicalRenderers = {
    [CANONICAL_ROUTE_BY_KEY.home.de]: renderHomePage,
    [CANONICAL_ROUTE_BY_KEY.home.en]: renderHomePage,
    [CANONICAL_ROUTE_BY_KEY.product.de]: renderProductPage,
    [CANONICAL_ROUTE_BY_KEY.product.en]: renderProductPage,
    [CANONICAL_ROUTE_BY_KEY.pricing.de]: renderPricingPage,
    [CANONICAL_ROUTE_BY_KEY.pricing.en]: renderPricingPage,
    [CANONICAL_ROUTE_BY_KEY.about.de]: renderAboutPage,
    [CANONICAL_ROUTE_BY_KEY.about.en]: renderAboutPage,
    [CANONICAL_ROUTE_BY_KEY.contact.de]: renderContactPage,
    [CANONICAL_ROUTE_BY_KEY.contact.en]: renderContactPage,
    [CANONICAL_ROUTE_BY_KEY.features.de]: renderFeaturesHubPage,
    [CANONICAL_ROUTE_BY_KEY.features.en]: renderFeaturesHubPage,
    [CANONICAL_ROUTE_BY_KEY.imprint.de]: renderImpressumPage,
    [CANONICAL_ROUTE_BY_KEY.imprint.en]: renderImpressumPage,
    [CANONICAL_ROUTE_BY_KEY.privacy.de]: renderDatenschutzPage,
    [CANONICAL_ROUTE_BY_KEY.privacy.en]: renderDatenschutzPage,
    [CANONICAL_ROUTE_BY_KEY.terms.de]: renderAGBPage,
    [CANONICAL_ROUTE_BY_KEY.terms.en]: renderAGBPage,
    [CANONICAL_ROUTE_BY_KEY['waitlist-confirm'].de]: renderWaitlistConfirmPage,
    [CANONICAL_ROUTE_BY_KEY['waitlist-confirm'].en]: renderWaitlistConfirmPage,
  };

  Object.entries(canonicalRenderers).forEach(([path, renderer]) => {
    registerLandingPage(path, renderer);
  });

  registerLandingWildcard('/features/', renderDeFeaturePageWithRedirect);
  registerLandingWildcard('/en/features/', renderEnFeaturePage);

  registerLandingPage(
    REDIRECT_ROUTE_BY_KEY.integrations.de,
    createLandingRedirect(REDIRECT_ROUTE_BY_KEY.integrations.redirectTarget.de),
  );
  registerLandingPage(
    REDIRECT_ROUTE_BY_KEY.integrations.en,
    createLandingRedirect(REDIRECT_ROUTE_BY_KEY.integrations.redirectTarget.en),
  );

  registerLandingPage(
    PLACEHOLDER_ROUTE_BY_KEY.resources.de,
    createPlaceholder('Ressourcen', 'Ressourcen und Hilfestellungen fuer BookFast folgen in Kuerze.'),
  );
  registerLandingPage(
    PLACEHOLDER_ROUTE_BY_KEY.resources.en,
    createPlaceholder('Resources', 'Resources and guides for BookFast will be available soon.'),
  );
};
