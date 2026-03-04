/**
 * FeatureHero – Centered hero for feature sub-pages.
 *
 * Zone 1 (white):    breadcrumb → illustration → headline → subheadline
 * Zone 2 (gradient): decorative accents + interactive demo card
 */
import { escapeHtml, escapeAttr } from '../../lib/sanitize.js';
import { getIconString } from '../Icons/Icon.js';
import './FeatureHero.css';

const BG_IMAGE = '/src/svg/illustrations/gradient_noise_bg.avif';

/**
 * @param {Object} config
 * @param {string}  config.headline
 * @param {string}  config.subheadline
 * @param {string}  [config.illustrationSrc]
 * @param {string[]}[config.breadcrumb]       - ['Home', 'Features', 'Mitarbeiterverwaltung']
 * @param {string}  [config.demoModuleHTML]    - HTML string to inject as demo card
 * @param {string}  [config.demoHint]          - Hint text below card (e.g. "Tippe, klicke & probier's aus — ganz ohne Account.")
 */
export const createFeatureHero = (config) => {
  const {
    headline,
    subheadline,
    illustrationSrc = '',
    breadcrumb = ['Home', 'Features'],
    demoModuleHTML = '',
    demoHint = '',
  } = config;

  const breadcrumbHTML = breadcrumb.map((item, i) => {
    const isLast = i === breadcrumb.length - 1;
    if (isLast) return `<span>${escapeHtml(item)}</span>`;
    const href = i === 0 ? '/' : `/${item.toLowerCase()}`;
    return `<a href="${escapeAttr(href)}" data-landing-link>${escapeHtml(item)}</a><span class="feature-hero__breadcrumb-sep">${getIconString('arrow-down', 'feature-hero__breadcrumb-icon')}</span>`;
  }).join(' ');

  const illustrationHTML = illustrationSrc
    ? `<div class="feature-hero__illustration"><img src="${escapeAttr(illustrationSrc)}" alt="" loading="eager"></div>`
    : '';
  const demoFrameHTML = demoModuleHTML
    ? `<div class="landing-frosted-frame feature-hero__card-frame">${demoModuleHTML}</div>`
    : '';

  return `
    <section class="feature-hero">
      <!-- Zone 1: White top -->
      <div class="feature-hero__top">
        <div class="landing-container">
          <nav class="feature-hero__breadcrumb">${breadcrumbHTML}</nav>
          ${illustrationHTML}
          <h1 class="hero-new__headline">${escapeHtml(headline)}</h1>
          <p class="hero-new__subheadline">${escapeHtml(subheadline)}</p>
        </div>
      </div>

      <!-- Zone 2: Gradient + card -->
      <div class="feature-hero__bottom">
        <div class="feature-hero__gradient-bg" style="background-image: url('${escapeAttr(BG_IMAGE)}')"></div>
        <div class="landing-container">
          <div class="feature-hero__card-area" id="feature-hero-demo">
            ${demoFrameHTML}
          </div>
        </div>
      </div>
      ${demoHint ? `<p class="feature-hero__hint">${escapeHtml(demoHint)}</p>` : ''}
    </section>`;
};
