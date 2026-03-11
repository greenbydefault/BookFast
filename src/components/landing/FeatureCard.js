/**
 * Feature Card Component
 *
 * @param {Object} config
 * @param {string} config.icon - Emoji or HTML
 * @param {string} config.title
 * @param {string} config.description
 * @param {string} [config.link] - Optional link href
 * @returns {string} HTML string
 */
export const createFeatureCard = ({ icon, title, description, link }) => {
  const tag = link ? 'a' : 'div';
  const linkAttr = link ? `href="${link}" data-landing-link title="${title}"` : '';

  return `
    <${tag} class="landing-feature-card" ${linkAttr}>
      <div class="landing-feature-card-icon">${icon}</div>
      <h3 class="landing-h4">${title}</h3>
      <p class="landing-text-sm">${description}</p>
    </${tag}>`;
};

/**
 * Create a grid of feature cards
 * @param {Array} features - Array of feature config objects
 * @param {number} [columns=3] - Grid columns (2, 3, or 4)
 * @returns {string} HTML string
 */
export const createFeatureGrid = (features, columns = 3) => {
  return `
    <div class="landing-grid landing-grid-${columns}">
      ${features.map(f => createFeatureCard(f)).join('')}
    </div>`;
};
