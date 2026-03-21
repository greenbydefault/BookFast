/**
 * CTA Section Component
 * Full-width call-to-action with illustration.
 *
 * @param {Object} config
 * @param {string} config.headline
 * @param {string} [config.subheadline]
 * @param {string} [config.primaryCTA]
 * @param {string} [config.primaryHref]
 * @param {string} [config.secondaryCTA]
 * @param {string} [config.secondaryHref]
 */
const CTA_ILLUSTRATION_URL = new URL('../../svg/illustrations/landingpage/cta/cta_illustration.svg', import.meta.url).href;

export const createCTASection = (config) => {
  const {
    headline,
    subheadline = '',
    primaryCTA = 'Live-Demo starten',
    primaryHref = '/',
    secondaryCTA = 'Kostenlos testen',
    secondaryHref = '/register.html'
  } = config;

  return `
    <section class="landing-section">
      <div class="landing-container">
        <div class="landing-cta-section">
          <img src="${CTA_ILLUSTRATION_URL}" alt="BookFast Call-to-Action Illustration zur Einrichtung des Buchungssystems" class="landing-cta-illustration" width="380" height="380" />
          <h2 class="landing-h2">${headline}</h2>
          ${subheadline ? `<p class="landing-text">${subheadline}</p>` : ''}
          <div class="landing-cta-buttons">
            <a href="${primaryHref}" class="landing-btn landing-btn-primary landing-btn-md" data-landing-link title="${primaryCTA}">${primaryCTA}</a>
            ${secondaryCTA ? `<a href="${secondaryHref}" class="landing-btn landing-btn-secondary landing-btn-md" title="${secondaryCTA}">${secondaryCTA}</a>` : ''}
          </div>
        </div>
      </div>
    </section>`;
};
