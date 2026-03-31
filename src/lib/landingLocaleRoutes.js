/**
 * Sister URLs for locale switching + marketing path pairs (DE path ↔ EN path).
 */
import { normalizeLandingPath, getLocaleFromPath } from './landingLocale.js';
import { deFeatureSlugToEn, enFeatureSlugToDe } from './featureSlugLocale.js';
import { DE_TO_EN_PATH, EN_TO_DE_PATH } from './routeConfig.js';

const FEATURES_PREFIX = '/features/';
const EN_FEATURES_PREFIX = '/en/features/';
const EN_PREFIX = '/en';

/**
 * Target path when switching language while staying on the "same" page where possible.
 * Falls back to mechanical prefix-swap for unmapped paths (never redirects to home).
 *
 * @param {string} rawPath — pathname
 * @param {'de'|'en'} targetLocale
 * @returns {string}
 */
export const getLocaleSwitchTarget = (rawPath, targetLocale) => {
  const p = normalizeLandingPath(rawPath);
  const current = getLocaleFromPath(p);

  if (targetLocale === current) {
    return p;
  }

  // Feature detail: /features/:deSlug ↔ /en/features/:enSlug
  if (p.startsWith(FEATURES_PREFIX) && p !== '/features') {
    const rest = p.slice(FEATURES_PREFIX.length).replace(/\/$/, '');
    if (rest && !rest.includes('/') && targetLocale === 'en') {
      const enSlug = deFeatureSlugToEn(rest);
      return enSlug ? `${EN_FEATURES_PREFIX}${enSlug}` : '/en/features';
    }
  }

  if (p.startsWith(EN_FEATURES_PREFIX)) {
    const rest = p.slice(EN_FEATURES_PREFIX.length).replace(/\/$/, '');
    if (rest && !rest.includes('/') && targetLocale === 'de') {
      const deSlug = enFeatureSlugToDe(rest);
      return deSlug ? `${FEATURES_PREFIX}${deSlug}` : '/features';
    }
  }

  // Known marketing pages
  if (targetLocale === 'en') {
    const mapped = DE_TO_EN_PATH[p];
    if (mapped) return mapped;
  } else {
    const mapped = EN_TO_DE_PATH[p];
    if (mapped) return mapped;
  }

  // Fallback: mechanical prefix swap
  if (targetLocale === 'en') {
    return `${EN_PREFIX}${p}`;
  }
  return p.startsWith(EN_PREFIX) ? p.slice(EN_PREFIX.length) || '/' : p;
};
