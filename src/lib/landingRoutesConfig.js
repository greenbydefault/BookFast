/**
 * Single list of paths that count as "marketing landing" for main.js bootstrap
 * (keeps landing chunk lazy — only path strings, no page imports).
 *
 * Derives DE paths from routeConfig (single source of truth).
 */
import { normalizeLandingPath } from './landingLocale.js';
import { LANDING_DE_PATHS } from './routeConfig.js';

const LANDING_PREFIXES = ['/features/'];

/**
 * Whether this pathname should load the landing SPA (vs dashboard redirect).
 * @param {string} path — pathname e.g. window.location.pathname
 */
export const isKnownLandingPath = (path) => {
  const p = normalizeLandingPath(path);
  if (p === '/' || p === '/index.html') return true;
  if (p === '/en' || p.startsWith('/en/')) return true;
  if (LANDING_DE_PATHS.has(p)) return true;
  return LANDING_PREFIXES.some((prefix) => p.startsWith(prefix));
};
