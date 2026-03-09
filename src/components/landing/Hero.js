import './HeroNew.css';
import './FeatureHero.css';

const ILLUSTRATION_URL = new URL('../../svg/illustrations/landingpage/features/ft_zahlungen.svg', import.meta.url).href;

/**
 * Hero Component
 * Supports centered (homepage) and split (feature/industry) variants.
 *
 * @param {Object} config
 * @param {string} config.headline
 * @param {string} config.subheadline
 * @param {string} [config.primaryCTA] - Text for primary button
 * @param {string} [config.primaryHref] - Link for primary button
 * @param {string} [config.secondaryCTA] - Text for secondary button
 * @param {string} [config.secondaryHref] - Link for secondary button
 * @param {string[]} [config.trustClaims] - Array of trust claim strings
 * @param {string} [config.variant] - 'centered' | 'split'
 * @param {string} [config.imageHTML] - HTML for the right side (split variant)
 * @param {string} [config.illustrationSrc] - Override illustration (default: ft_zahlungen.svg)
 * @param {string} [config.slotContent] - Optional HTML rendered after subheadline, before CTA/trustClaims
 */
export const createHero = (config) => {
  const {
    headline, subheadline,
    primaryCTA = 'Kostenlos testen', primaryHref = '/login.html',
    secondaryCTA = 'Alle Features ansehen', secondaryHref = '/features',
    trustClaims = [],
    variant = 'centered',
    imageHTML = '',
    illustrationSrc = ILLUSTRATION_URL,
    slotContent = '',
  } = config;

  const illustrationHTML = illustrationSrc
    ? `<div class="feature-hero__illustration"><img src="${illustrationSrc}" alt="" loading="eager"></div>`
    : '';

  const checkSVG = '<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>';

  const trustHTML = trustClaims.length ? `
    <div class="landing-trust-claims">
      ${trustClaims.map(c => `<div class="landing-trust-claim">${checkSVG} <span>${c}</span></div>`).join('')}
    </div>` : '';

  const ctaHTML = `
    <div class="landing-hero-ctas">
      ${primaryCTA ? `<a href="${primaryHref}" class="landing-btn landing-btn-primary landing-btn-lg">${primaryCTA}</a>` : ''}
      ${secondaryCTA ? `<a href="${secondaryHref}" class="landing-btn landing-btn-secondary landing-btn-lg" data-landing-link>${secondaryCTA}</a>` : ''}
    </div>`;

  if (variant === 'split') {
    const heroClass = slotContent ? 'landing-hero landing-hero--has-slot' : 'landing-hero';
    return `
      <section class="${heroClass}">
        <div class="landing-container">
          <div class="landing-hero-split">
            <div>
              ${illustrationHTML}
              <h1 class="hero-new__headline">${headline}</h1>
              <p class="hero-new__subheadline">${subheadline}</p>
              ${slotContent}
              ${ctaHTML}
              ${trustHTML}
            </div>
            <div>${imageHTML}</div>
          </div>
        </div>
      </section>`;
  }

  // Centered (default)
  const heroClass = slotContent ? 'landing-hero landing-hero--has-slot' : 'landing-hero';
  return `
    <section class="${heroClass}">
      <div class="landing-container">
        <div class="landing-hero-centered">
          ${illustrationHTML}
          <h1 class="hero-new__headline">${headline}</h1>
          <p class="hero-new__subheadline">${subheadline}</p>
          ${slotContent}
          ${ctaHTML}
          ${trustHTML}
        </div>
      </div>
    </section>`;
};
