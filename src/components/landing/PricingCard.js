/**
 * Pricing Card Component
 *
 * @param {Object} config
 * @param {string} config.name
 * @param {string} config.price - e.g. '0', '9,49', '29'
 * @param {string} [config.period] - e.g. '/Monat'
 * @param {string} [config.description]
 * @param {string[]} [config.features] - optional feature list (legacy)
 * @param {number} [config.workspaces] - number of workspaces (shows "X Workspace(s)")
 * @param {string} [config.priceAnnual] - e.g. '91,10' (Jahrespreis)
 * @param {string} [config.priceEffectiveMonthly] - e.g. '7,59' (effektiver Monatspreis bei Jahreszahlung)
 * @param {string} [config.cta] - CTA text
 * @param {string} [config.ctaHref]
 * @param {boolean} [config.highlighted]
 * @param {string} [config.badge] - e.g. 'Beliebt', 'Founder Early Access'
 * @returns {string} HTML
 */
export const createPricingCard = (config) => {
  const {
    name, price, period = '/Monat', description = '',
    features = [], workspaces, priceAnnual, priceEffectiveMonthly,
    cta = 'Kostenlos testen', ctaHref = '/login.html',
    highlighted = false, badge = ''
  } = config;

  const hasAnnual = price !== '0' && priceAnnual && priceEffectiveMonthly;
  const featuresList = workspaces != null
    ? [`${workspaces} Workspace${workspaces === 1 ? '' : 's'}`]
    : features;
  const featuresHTML = featuresList.map(f => `<li>${f}</li>`).join('');

  const priceDisplay = price === '0'
    ? 'Kostenlos'
    : `${price.replace('.', ',')} €`;

  const annualHTML = hasAnnual
    ? `<div class="landing-pricing-annual">oder ${priceAnnual.replace('.', ',')} € / Jahr <span class="landing-pricing-annual-hint">(≈ ${priceEffectiveMonthly.replace('.', ',')} €/Monat, 2 Monate gratis)</span></div>`
    : '';

  return `
    <div class="landing-pricing-card ${highlighted ? 'highlighted' : ''}">
      ${badge ? `<div class="landing-pricing-badge">${badge}</div>` : ''}
      <h3 class="landing-h4">${name}</h3>
      ${description ? `<p class="landing-text-sm">${description}</p>` : ''}
      <div class="landing-pricing-price">${priceDisplay}</div>
      ${price !== '0' ? `<div class="landing-pricing-period">${period}</div>` : '<div class="landing-pricing-period">für immer</div>'}
      ${annualHTML}
      <ul class="landing-pricing-features">${featuresHTML}</ul>
      <a href="${ctaHref}" class="landing-btn ${highlighted ? 'landing-btn-primary' : 'landing-btn-secondary'}" style="width:100%; text-align:center;">${cta}</a>
    </div>`;
};
