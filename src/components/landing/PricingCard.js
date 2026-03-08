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
 * @param {string} [config.cta] - CTA text
 * @param {string} [config.ctaHref]
 * @param {boolean} [config.highlighted]
 * @param {string} [config.badge] - e.g. 'Am beliebtesten'
 * @param {string} [config.microcopy] - Text unter dem CTA-Button
 * @returns {string} HTML
 */
export const createPricingCard = (config) => {
  const {
    name, price, priceAnnual, priceEffectiveMonthly,
    isAnnual = false,
    description = '', workspaces,
    cta = 'Kostenlos testen', ctaHref = '/register.html',
    highlighted = false, badge = '', microcopy = ''
  } = config;

  const featuresList = workspaces != null
    ? [`${workspaces} Workspace${workspaces === 1 ? '' : 's'}`]
    : [];
  const featuresHTML = featuresList.map(f => `<li>${f}</li>`).join('');

  const priceDisplay = price === '0'
    ? 'Kostenlos'
    : isAnnual && priceAnnual
      ? `${priceAnnual.replace('.', ',')} €`
      : `${price.replace('.', ',')} €`;

  const periodDisplay = price === '0'
    ? 'für immer'
    : isAnnual && priceAnnual
      ? '/Jahr'
      : '/Monat';

  const annualHintHTML = isAnnual && priceEffectiveMonthly
    ? `<div class="landing-pricing-annual-hint">≈ ${priceEffectiveMonthly.replace('.', ',')} €/Monat, 2 Monate gratis</div>`
    : '';

  return `
    <div class="landing-pricing-card ${highlighted ? 'highlighted' : ''}">
      ${badge ? `<div class="landing-pricing-badge">${badge}</div>` : ''}
      <h3 class="landing-h4">${name}</h3>
      ${description ? `<p class="landing-text-sm">${description}</p>` : ''}
      <div class="landing-pricing-price">${priceDisplay}</div>
      <div class="landing-pricing-period">${periodDisplay}</div>
      ${annualHintHTML}
      <ul class="landing-pricing-features">${featuresHTML}</ul>
      <a href="${ctaHref}" class="landing-btn ${highlighted ? 'landing-btn-primary' : 'landing-btn-secondary'}" style="width:100%; text-align:center;">${cta}</a>
      ${microcopy ? `<p class="landing-pricing-microcopy">${microcopy}</p>` : ''}
    </div>`;
};
