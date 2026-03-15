import { escapeAttr, escapeHtml } from '../../lib/sanitize.js';
import { resolveSvgAssetUrl, svgAssetUrl } from '../../lib/landingAssets.js';

const FALLBACK_ILLUSTRATION = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');

/**
 * Feature Card Component
 *
 * @param {Object} config
 * @param {string} config.title
 * @param {string} config.description
 * @param {string} [config.icon] - Legacy icon (emoji/html)
 * @param {string} [config.link] - Optional link href
 * @param {string} [config.illustration] - Optional illustration path/url
 * @param {('default'|'slider')} [config.variant='default'] - Card markup variant
 * @returns {string} HTML string
 */
export const createFeatureCard = ({
  icon,
  title,
  description,
  link,
  illustration,
  variant = 'default',
}) => {
  if (variant !== 'slider') {
    const tag = link ? 'a' : 'div';
    const linkAttr = link ? `href="${escapeAttr(link)}" data-landing-link title="${escapeAttr(title || 'Feature')}"` : '';

    return `
      <${tag} class="landing-feature-card" ${linkAttr}>
        <div class="landing-feature-card-icon">${icon || ''}</div>
        <h3 class="landing-h4">${escapeHtml(title || 'Feature')}</h3>
        <p class="landing-text-sm">${escapeHtml(description || '')}</p>
      </${tag}>`;
  }

  const resolvedIllustration = resolveSvgAssetUrl(illustration || '');
  const safeIllustration = resolvedIllustration || FALLBACK_ILLUSTRATION;
  const safeTitle = escapeHtml(title || 'Feature');
  const safeDescription = escapeHtml(description || '');
  const safeLink = link ? escapeAttr(link) : '';
  const safeLinkTitle = escapeAttr(`${title || 'Feature'} ansehen`);

  return `
    <article class="feature-related-slider__card">
      <div class="feature-related-slider__text">
        <h3 class="feature-related-slider__card-title">${safeTitle}</h3>
        <p class="feature-related-slider__card-subtext">${safeDescription}</p>
      </div>
      <div class="feature-related-slider__footer">
        ${link
    ? `<a href="${safeLink}" class="landing-btn landing-btn-primary feature-related-slider__card-btn" data-landing-link title="${safeLinkTitle}">Ansehen</a>`
    : '<span class="landing-btn landing-btn-primary feature-related-slider__card-btn" aria-hidden="true">Ansehen</span>'}
        <div class="feature-related-slider__media">
          <img src="${escapeAttr(safeIllustration)}" alt="${escapeAttr(`Illustration zum Feature ${title || 'Feature'}`)}" loading="lazy" decoding="async" />
        </div>
      </div>
    </article>`;
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
