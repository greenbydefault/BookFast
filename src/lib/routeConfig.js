/**
 * Single source of truth for localized marketing routes.
 * Keeps canonical pages, redirect aliases, and placeholders separate so
 * routing, sitemap generation, and prerendering can derive from one model.
 */

/** @typedef {{ key: string, de: string, en: string }} LocalizedRoutePair */
/** @typedef {LocalizedRoutePair & { routeType: 'canonical' }} CanonicalRoutePair */
/** @typedef {LocalizedRoutePair & { routeType: 'placeholder', noindex: true }} PlaceholderRoutePair */
/** @typedef {LocalizedRoutePair & { routeType: 'redirect', redirectTarget: { de: string, en: string } }} RedirectRoutePair */

/** @type {ReadonlyArray<CanonicalRoutePair>} */
export const CANONICAL_ROUTE_PAIRS = Object.freeze([
  { key: 'home', de: '/', en: '/en', routeType: 'canonical' },
  { key: 'product', de: '/produkt', en: '/en/product', routeType: 'canonical' },
  { key: 'pricing', de: '/preise', en: '/en/pricing', routeType: 'canonical' },
  { key: 'about', de: '/ueber-uns', en: '/en/about', routeType: 'canonical' },
  { key: 'contact', de: '/kontakt', en: '/en/contact', routeType: 'canonical' },
  { key: 'features', de: '/features', en: '/en/features', routeType: 'canonical' },
  { key: 'imprint', de: '/impressum', en: '/en/imprint', routeType: 'canonical' },
  { key: 'privacy', de: '/datenschutz', en: '/en/privacy', routeType: 'canonical' },
  { key: 'terms', de: '/agb', en: '/en/terms', routeType: 'canonical' },
  { key: 'waitlist-confirm', de: '/waitlist/confirm', en: '/en/waitlist/confirm', routeType: 'canonical' },
]);

/** @type {ReadonlyArray<PlaceholderRoutePair>} */
export const PLACEHOLDER_ROUTE_PAIRS = Object.freeze([
  { key: 'resources', de: '/ressourcen', en: '/en/resources', routeType: 'placeholder', noindex: true },
]);

/** @type {ReadonlyArray<RedirectRoutePair>} */
export const REDIRECT_ROUTE_PAIRS = Object.freeze([
  {
    key: 'integrations',
    de: '/integrationen',
    en: '/en/integrations',
    routeType: 'redirect',
    redirectTarget: { de: '/produkt', en: '/en/product' },
  },
]);

/** @type {ReadonlyArray<LocalizedRoutePair>} */
export const ROUTE_PAIRS = Object.freeze([
  ...CANONICAL_ROUTE_PAIRS,
  ...PLACEHOLDER_ROUTE_PAIRS,
  ...REDIRECT_ROUTE_PAIRS,
]);

/** @type {Readonly<Record<string, CanonicalRoutePair>>} */
export const CANONICAL_ROUTE_BY_KEY = Object.freeze(
  Object.fromEntries(CANONICAL_ROUTE_PAIRS.map((route) => [route.key, route])),
);

/** @type {Readonly<Record<string, RedirectRoutePair>>} */
export const REDIRECT_ROUTE_BY_KEY = Object.freeze(
  Object.fromEntries(REDIRECT_ROUTE_PAIRS.map((route) => [route.key, route])),
);

/** @type {Readonly<Record<string, PlaceholderRoutePair>>} */
export const PLACEHOLDER_ROUTE_BY_KEY = Object.freeze(
  Object.fromEntries(PLACEHOLDER_ROUTE_PAIRS.map((route) => [route.key, route])),
);

/** @type {Readonly<Record<string, string>>} */
export const DE_TO_EN_PATH = Object.freeze(
  Object.fromEntries(ROUTE_PAIRS.map(({ de, en }) => [de, en])),
);

/** @type {Readonly<Record<string, string>>} */
export const EN_TO_DE_PATH = Object.freeze(
  Object.fromEntries(ROUTE_PAIRS.map(({ de, en }) => [en, de])),
);

/** All known DE marketing paths (for isKnownLandingPath). Excludes '/' — handled separately. */
export const LANDING_DE_PATHS = new Set(ROUTE_PAIRS.map(({ de }) => de));
