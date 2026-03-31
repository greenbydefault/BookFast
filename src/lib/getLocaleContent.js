/**
 * Locale-aware content loader.
 * Returns EN content when available, falls back to DE.
 */
import { featurePages } from '../data/features/index.js';

const enFeaturePages = {};

/**
 * Register EN feature pages (called by locale files on import).
 * @param {Record<string, object>} pages
 */
export const registerEnFeaturePages = (pages) => {
  Object.assign(enFeaturePages, pages);
};

/**
 * Get a feature page object for the given slug and locale.
 * Falls back to DE data when EN is not available.
 * @param {string} slug - DE feature slug
 * @param {'de'|'en'} locale
 * @returns {object|null}
 */
export const getFeaturePage = (slug, locale) => {
  if (locale === 'en' && enFeaturePages[slug]) {
    return enFeaturePages[slug];
  }
  return featurePages[slug] ?? null;
};

/**
 * Get all feature pages for a locale (for hubs, navs, footers).
 * @param {'de'|'en'} locale
 * @returns {Record<string, object>}
 */
export const getAllFeaturePages = (locale) => {
  if (locale === 'en') {
    return { ...featurePages, ...enFeaturePages };
  }
  return featurePages;
};
