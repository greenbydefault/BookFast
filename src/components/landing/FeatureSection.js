/**
 * Feature Section Component
 * Alternating image/text layout.
 *
 * @param {Object} config
 * @param {string} config.title
 * @param {string} config.description
 * @param {string[]} [config.bullets] - Bullet points
 * @param {string} [config.imageHTML] - Image or placeholder HTML
 * @param {boolean} [config.reverse] - Image on left (true) or right (false)
 * @returns {string} HTML
 */
import { iconImg } from '../../lib/landingAssets.js';

export const createFeatureSection = ({ title, description, bullets = [], imageHTML = '', reverse = false }) => {
  const bulletsHTML = bullets.length ? `
    <ul class="landing-feature-bullets">
      ${bullets.map(b => `<li class="landing-feature-bullet">${b}</li>`).join('')}
    </ul>` : '';

  const imageBlock = imageHTML || `
    <div class="landing-feature-image" style="height: 320px; display:flex; align-items:center; justify-content:center; background: var(--color-stone-100);">
      <span style="font-size: 3rem; opacity: 0.3;">${iconImg('target.svg')}</span>
    </div>`;

  return `
    <div class="landing-feature-section ${reverse ? 'reverse' : ''}">
      <div>
        <h2 class="landing-h2">${title}</h2>
        <p class="landing-text">${description}</p>
        ${bulletsHTML}
      </div>
      <div>${imageBlock}</div>
    </div>`;
};
