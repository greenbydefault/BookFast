/**
 * Landing Page Registry
 * Registers all landing pages with the router.
 */
import { registerLandingPage, registerLandingWildcard } from '../../lib/landingRouter.js';

// Page imports
import { renderHomePage } from './HomePage.js';
import { renderHomePageSecondary } from './HomePageSecondary.js';
import { renderPricingPage } from './PricingPage.js';
import { renderIntegrationsPage } from './IntegrationsPage.js';
import { renderProductPage } from './ProductPage.js';
import { renderFeaturesHubPage } from './features/FeaturesHubPage.js';
import { renderFeaturePage } from './features/FeaturePageTemplate.js';
import { renderComparePage } from './compare/ComparePageTemplate.js';
import { renderImpressumPage } from './legal/ImpressumPage.js';
import { renderDatenschutzPage } from './legal/DatenschutzPage.js';
import { renderAGBPage } from './legal/AGBPage.js';
import { renderAboutPage } from './AboutPage.js';
import { renderContactPage } from './ContactPage.js';
import { renderDocsPage } from './DocsPage.js';
import { renderDocPage } from './docs/DocPageTemplate.js';

const createPlaceholder = (title) => () => {
  const content = document.getElementById('landing-content');
  if (content) {
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container">
          <div class="landing-hero-centered">
            <h1 class="landing-h1">${title}</h1>
            <p class="landing-text-lg">Diese Seite wird bald verfügbar sein.</p>
            <div class="landing-hero-ctas" style="justify-content: center;">
              <a href="/" class="landing-btn landing-btn-primary" data-landing-link>Zur Startseite</a>
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
  registerLandingPage('/secondary', renderHomePageSecondary);
  registerLandingPage('/produkt', renderProductPage);
  registerLandingPage('/preise', renderPricingPage);
  registerLandingPage('/integrationen', renderIntegrationsPage);
  registerLandingPage('/docs', renderDocsPage);
  registerLandingPage('/ressourcen', createPlaceholder('Ressourcen'));
  registerLandingPage('/ueber-uns', renderAboutPage);
  registerLandingPage('/kontakt', renderContactPage);
  registerLandingPage('/features', renderFeaturesHubPage);
  registerLandingPage('/vergleich', () => renderComparePage('flowbookings'));
  registerLandingPage('/impressum', renderImpressumPage);
  registerLandingPage('/datenschutz', renderDatenschutzPage);
  registerLandingPage('/agb', renderAGBPage);
  registerLandingWildcard('/features/', renderFeaturePage);
  registerLandingWildcard('/vergleich/', renderComparePage);
  registerLandingWildcard('/docs/', renderDocPage);
};
