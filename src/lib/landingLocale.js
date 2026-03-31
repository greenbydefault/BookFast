/**
 * Landing locale from URL path only (shareable, SEO-stable).
 */

/**
 * @param {string} path
 * @returns {string}
 */
export const normalizeLandingPath = (path) => {
  if (!path || path === '/index.html') return '/';
  if (path === '/en/') return '/en';
  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * @param {string} path — normalized or raw pathname
 * @returns {'de'|'en'}
 */
export const getLocaleFromPath = (path) => {
  const p = normalizeLandingPath(path);
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  return 'de';
};

/**
 * @param {'de'|'en'} locale
 */
export const applyDocumentLang = (locale) => {
  document.documentElement.lang = locale === 'en' ? 'en' : 'de';
};
