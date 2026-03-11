import { iconUrl } from '../../lib/landingAssets.js';

/**
 * Pricing Card Component
 *
 * @param {Object} config
 * @param {string} config.name
 * @param {string} config.price - e.g. '9,49' (Monatspreis)
 * @param {string} [config.priceAnnual] - e.g. '91,10' (Jahrespreis)
 * @param {string} [config.priceEffectiveMonthly] - e.g. '7,59' (effektiver Monatspreis bei Jahreszahlung)
 * @param {boolean} [config.isAnnual] - wenn true: Zeige Jahrespreis an
 * @param {string} [config.description]
 * @param {number} [config.workspaces] - number of workspaces (shows "X Workspace(s)")
 * @param {string[]} [config.planFeatures]
 * @param {Array} [config.securityBadges] - { icon, label }[] für DSGVO, SSL, etc.
 * @param {string} [config.cta] - CTA text
 * @param {string} [config.ctaHref]
 * @returns {string} HTML
 */
export const createPricingCard = (config) => {
  const {
    name, price, priceAnnual, priceEffectiveMonthly,
    isAnnual = false,
    description = '', workspaces,
    planFeatures = [],
    securityBadges = [],
    cta = 'Kostenlos testen', ctaHref = '/register.html'
  } = config;

  const featuresList = planFeatures.length ? planFeatures : [...securityBadges];
  const featuresHTML = featuresList.map((feature) => {
    if (typeof feature === 'object' && feature !== null && feature.icon && feature.label) {
      return `<li class="landing-pricing-feature-item has-icon"><img src="${iconUrl(feature.icon)}" alt="${feature.label}" class="landing-pricing-feature-icon">${feature.label}</li>`;
    }
    return `<li>${feature}</li>`;
  }).join('');

  const featureItems = featuresHTML ? featuresHTML.match(/<li[\s\S]*?<\/li>/g) || [] : [];
  const splitIndex = Math.ceil(featureItems.length / 2);
  const featuresLeftHTML = featureItems.slice(0, splitIndex).join('');
  const featuresRightHTML = featureItems.slice(splitIndex).join('');

  const priceValue = price === '0'
    ? 'Kostenlos'
    : isAnnual && priceAnnual
      ? `${priceAnnual.replace('.', ',')} €`
      : `${price.replace('.', ',')} €`;

  const periodDisplay = price === '0'
    ? 'für immer'
    : isAnnual && priceAnnual
      ? '/Jahr'
      : '/Monat';

  const annualHintContent = isAnnual && priceEffectiveMonthly
    ? `≈ ${priceEffectiveMonthly.replace('.', ',')} €/Monat, 2 Monate gratis`
    : '';
  const annualHintHTML = `<div class="landing-pricing-annual-hint" ${!annualHintContent ? 'style="display:none"' : ''}>${annualHintContent}</div>`;

  const cardModifier = name ? `landing-pricing-card--${name.toLowerCase()}` : '';
  const workspaceMetric = `${workspaces || 1}`;
  return `
    <div class="landing-pricing-card landing-pricing-card--showcase ${cardModifier}">
      <div class="landing-pricing-card__header">
        <div class="landing-pricing-card__headline">
          <h3 class="landing-pricing-card__name">${name}</h3>
          ${description ? `<p class="landing-pricing-card__desc">${description}</p>` : ''}
        </div>
        <div class="landing-pricing-card__header-controls">
          <div class="landing-pricing-toggle-pill" id="pricing-toggle-pill">
            <button type="button" class="${!isAnnual ? 'is-active' : ''}" data-period="monthly" title="Monatliche Abrechnung wählen">Monatlich</button>
            <button type="button" class="${isAnnual ? 'is-active' : ''}" data-period="annual" title="Jährliche Abrechnung wählen">Jährlich</button>
          </div>
          <span class="landing-pricing-toggle-save">2 Monate gratis</span>
        </div>
      </div>
      <div class="landing-pricing-card__metrics">
        <div>
          <div class="landing-pricing-card__metric-label">Workspaces</div>
          <div class="landing-pricing-card__metric-value">${workspaceMetric}</div>
        </div>
        <div class="landing-pricing-card__price-wrap">
          <div class="landing-pricing-price">${priceValue}</div>
          <div class="landing-pricing-period">${periodDisplay}</div>
        </div>
      </div>
      <input
        id="pricing-workspace-slider"
        class="landing-pricing-workspace-slider landing-pricing-workspace-slider--grabber is-step-${workspaces || 1}"
        type="range"
        min="1"
        max="10"
        step="1"
        value="${workspaces || 1}"
        aria-label="Anzahl der Workspaces"
        title="Anzahl der Workspaces auswählen"
      />
      ${annualHintHTML}
      <div class="landing-pricing-features-grid">
        <ul class="landing-pricing-features">${featuresLeftHTML}</ul>
        <ul class="landing-pricing-features">${featuresRightHTML}</ul>
      </div>
      <a href="${ctaHref}" class="landing-btn landing-btn-primary landing-pricing-card__btn landing-pricing-card__btn--full" title="${cta}">${cta}</a>
    </div>`;
};
