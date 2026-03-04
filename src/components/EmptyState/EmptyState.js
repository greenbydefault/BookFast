/**
 * Empty State Component
 * Renders a consistent empty state with illustration (26em), title, description and CTAs.
 * When showing empty state, the page should clear top-bar-actions (only breadcrumb remains).
 */
import './EmptyState.css';
import { createButton } from '../Button/Button.js';

/**
 * Get the URL for an empty-state illustration SVG.
 * @param {string} [filename='empty-state.svg'] - SVG filename in illustrations folder
 */
const getEmptyStateSvgUrl = (filename = 'empty-state.svg') => {
  try {
    return new URL(`../../svg/illustrations/${filename}`, import.meta.url).href;
  } catch {
    return `/src/svg/illustrations/${filename}`;
  }
};

/**
 * Renders the empty state into the given container.
 * @param {HTMLElement} container - Target container (e.g. main-content)
 * @param {Object} config - Empty state configuration
 * @param {string} config.title - Main heading, e.g. "Noch keine Services vorhanden."
 * @param {string} config.description - Explanatory text
 * @param {string} config.primaryLabel - Primary CTA label, e.g. "+ Service erstellen"
 * @param {Function} config.onPrimaryClick - Handler for primary button
 * @param {string} [config.secondaryLabel] - Optional secondary CTA label
 * @param {string} [config.secondaryHref] - Optional href for secondary link (anchor)
 * @param {Function} [config.onSecondaryClick] - Optional handler for secondary button (if no href)
 * @param {string} [config.illustrationSrc] - Optional custom illustration URL or filename (e.g. 'empty-state-buchungen.svg')
 */
export const renderEmptyState = (container, config) => {
  if (!container) return;

  const {
    title,
    description,
    primaryLabel,
    onPrimaryClick,
    secondaryLabel,
    secondaryHref,
    onSecondaryClick,
    illustrationSrc
  } = config;

  const svgUrl = illustrationSrc
    ? (illustrationSrc.startsWith('http') || illustrationSrc.startsWith('/') ? illustrationSrc : getEmptyStateSvgUrl(illustrationSrc))
    : getEmptyStateSvgUrl();

  let secondaryHtml = '';
  if (secondaryLabel) {
    if (secondaryHref) {
      secondaryHtml = `<a href="${secondaryHref}" class="empty-state-link" target="_blank" rel="noopener">${secondaryLabel}</a>`;
    } else {
      secondaryHtml = `<button type="button" class="empty-state-link empty-state-link-btn">${secondaryLabel}</button>`;
    }
  }

  container.innerHTML = `
    <div class="empty-state">
      <img class="empty-state-illustration" src="${svgUrl}" alt="" aria-hidden="true" />
      <h2 class="empty-state-title">${title}</h2>
      <p class="empty-state-description">${description}</p>
      <div class="empty-state-actions">
        <div id="empty-state-primary-btn"></div>
        ${secondaryHtml ? `<div class="empty-state-secondary">${secondaryHtml}</div>` : ''}
      </div>
    </div>
  `;

  const primaryContainer = container.querySelector('#empty-state-primary-btn');
  if (primaryContainer && primaryLabel && onPrimaryClick) {
    const primaryBtn = createButton(primaryLabel, onPrimaryClick, 'btn-primary');
    primaryContainer.appendChild(primaryBtn);
  }

  if (secondaryLabel && !secondaryHref && onSecondaryClick) {
    const secBtn = container.querySelector('.empty-state-link-btn');
    if (secBtn) secBtn.addEventListener('click', onSecondaryClick);
  }
};

/**
 * Renders a centered loading placeholder into the given container.
 * @param {HTMLElement} container - Target container (e.g. main-content)
 */
export const renderPageLoading = (container) => {
  if (!container) return;
  container.innerHTML = '<div class="empty-state"><p class="empty-state-description">Laden...</p></div>';
};
