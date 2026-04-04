/**
 * Feature Section Component
 * Alternating image/text layout.
 *
 * @param {Object} config
 * @param {string} config.title
 * @param {string} [config.description]
 * @param {Array<string | {title?: string, label?: string, description?: string, detail?: string}>} [config.bullets] - Bullet points
 * @param {string} [config.imageHTML] - Image or placeholder HTML
 * @param {boolean} [config.reverse] - Image on left (true) or right (false)
 * @returns {string} HTML
 */
import { escapeHtml } from '../../lib/sanitize.js';
import { iconImg } from '../../lib/landingAssets.js';

const normalizeBullet = (bullet) => {
  if (typeof bullet === 'object' && bullet !== null) {
    return {
      title: bullet.title ?? bullet.label ?? '',
      description: bullet.description ?? bullet.detail ?? '',
    };
  }

  return {
    title: String(bullet ?? ''),
    description: '',
  };
};

export const createFeatureSection = ({ title, description, bullets = [], imageHTML = '', reverse = false }) => {
  const bulletsHTML = bullets.length ? `
    <ul class="landing-feature-bullets">
      ${bullets.map((bullet) => {
        const item = normalizeBullet(bullet);
        const safeTitle = escapeHtml(item.title);
        const safeDescription = escapeHtml(item.description);

        return `
          <li class="landing-feature-bullet">
            ${safeTitle}
            ${safeDescription ? ` <span class="landing-feature-bullet-desc">${safeDescription}</span>` : ''}
          </li>
        `;
      }).join('')}
    </ul>` : '';

  const descriptionHTML = description ? `<p class="landing-text">${escapeHtml(description)}</p>` : '';

  const imageBlock = imageHTML || `
    <div class="landing-feature-image" style="height: 320px; display:flex; align-items:center; justify-content:center; background: var(--color-stone-100);">
      <span style="font-size: 3rem; opacity: 0.3;">${iconImg('target.svg')}</span>
    </div>`;

  return `
    <div class="landing-feature-section ${reverse ? 'reverse' : ''}">
      <div>
        <h2 class="landing-h2">${escapeHtml(title)}</h2>
        ${descriptionHTML}
        ${bulletsHTML}
      </div>
      <div>${imageBlock}</div>
    </div>`;
};
