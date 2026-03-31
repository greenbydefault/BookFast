/**
 * Single source of truth for all DE ↔ EN marketing-page path pairs.
 * Other modules (landingLocaleRoutes, landingRoutesConfig) derive their
 * data from these exports instead of maintaining separate lists.
 */

/** @type {ReadonlyArray<{ de: string, en: string }>} */
export const ROUTE_PAIRS = Object.freeze([
  { de: '/', en: '/en' },
  { de: '/produkt', en: '/en/product' },
  { de: '/preise', en: '/en/pricing' },
  { de: '/integrationen', en: '/en/integrations' },
  { de: '/ressourcen', en: '/en/resources' },
  { de: '/ueber-uns', en: '/en/about' },
  { de: '/kontakt', en: '/en/contact' },
  { de: '/features', en: '/en/features' },
  { de: '/impressum', en: '/en/imprint' },
  { de: '/datenschutz', en: '/en/privacy' },
  { de: '/agb', en: '/en/terms' },
  { de: '/waitlist/confirm', en: '/en/waitlist/confirm' },
]);

/** @type {Readonly<Record<string, string>>} */
export const DE_TO_EN_PATH = Object.freeze(
  Object.fromEntries(ROUTE_PAIRS.map(({ de, en }) => [de, en])),
);

/** @type {Readonly<Record<string, string>>} */
export const EN_TO_DE_PATH = Object.freeze(
  Object.fromEntries(ROUTE_PAIRS.map(({ de, en }) => [en, de])),
);

/** All known DE marketing paths (for isKnownLandingPath). Excludes '/' — handled separately. */
export const LANDING_DE_PATHS = new Set(
  ROUTE_PAIRS.map(({ de }) => de),
);
