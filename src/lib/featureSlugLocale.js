/**
 * Canonical German feature slug (data keys) ↔ English URL segment under /en/features/
 * Only active (non-redirected) feature pages are mapped here.
 * Dissolved slugs (approval, buffer, zeitfenster, etc.) are handled via redirects in registry.js.
 */
export const FEATURE_DE_TO_EN_SLUG = Object.freeze({
  buchungen: 'bookings',
  zahlungen: 'payments',
  rechnungen: 'invoices',
  analytics: 'analytics',
  objekte: 'objects',
  services: 'services',
  integration: 'integration',
  kundenportal: 'customer-portal',
  workspaces: 'workspaces',
  mitarbeiter: 'staff',
});

/** @type {Record<string, string>} */
const EN_TO_DE = (() => {
  /** @type {Record<string, string>} */
  const m = {};
  for (const [de, en] of Object.entries(FEATURE_DE_TO_EN_SLUG)) {
    m[en] = de;
  }
  return m;
})();

export const FEATURE_EN_TO_DE_SLUG = Object.freeze(EN_TO_DE);

/**
 * @param {string} deSlug
 * @returns {string|null}
 */
export const deFeatureSlugToEn = (deSlug) => FEATURE_DE_TO_EN_SLUG[deSlug] ?? null;

/**
 * @param {string} enSlug
 * @returns {string|null}
 */
export const enFeatureSlugToDe = (enSlug) => FEATURE_EN_TO_DE_SLUG[enSlug] ?? null;
