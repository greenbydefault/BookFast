/**
 * Landing Page Router
 * Handles routing for all public-facing landing pages.
 * Separate from the dashboard router to keep concerns isolated.
 */
import { clearSEO, setCanonical } from './seoHelper.js';
import { renderNotFoundPage } from '../pages/landing/NotFoundPage.js';

// Page registry: path → renderFn
const landingPages = new Map();

// Wildcard registrations: prefix → renderFn
const wildcardPages = new Map();

let currentCleanup = null;

/**
 * Register a landing page
 * @param {string} path - URL path (e.g. '/preise')
 * @param {Function} renderFn - Render function, may return cleanup function
 */
export const registerLandingPage = (path, renderFn) => {
  landingPages.set(path, renderFn);
};

/**
 * Register a wildcard landing page (e.g. '/features/*')
 * @param {string} prefix - URL prefix (e.g. '/features/')
 * @param {Function} renderFn - Render function receiving the slug as argument
 */
export const registerLandingWildcard = (prefix, renderFn) => {
  wildcardPages.set(prefix, renderFn);
};

/**
 * Find matching render function for a path
 */
const findRoute = (path) => {
  // Exact match first
  if (landingPages.has(path)) {
    return { renderFn: landingPages.get(path), slug: null };
  }

  // Wildcard match
  for (const [prefix, renderFn] of wildcardPages) {
    if (path.startsWith(prefix)) {
      const slug = path.slice(prefix.length).replace(/\/$/, '');
      if (slug) return { renderFn, slug };
    }
  }

  return null;
};

/**
 * Check if a path is a landing route
 */
export const isLandingRoute = (path) => {
  if (path === '/' || path === '/index.html') return true;
  if (landingPages.has(path)) return true;
  for (const prefix of wildcardPages.keys()) {
    if (path.startsWith(prefix)) return true;
  }
  return false;
};

/**
 * Navigate to a landing page
 */
export const navigateLanding = (path, replace = false) => {
  if (replace) {
    history.replaceState({ landingPath: path }, '', path);
  } else {
    history.pushState({ landingPath: path }, '', path);
  }
  renderLandingRoute(path);
};

/**
 * Render the matching landing page
 */
const renderLandingRoute = (path) => {
  const normalizedPath = path === '/index.html' ? '/' : path;

  // Cleanup previous
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  // Remove stale SEO artifacts (e.g. FAQ JSON-LD) between route changes
  clearSEO();
  setCanonical(normalizedPath);

  // Scroll to top
  window.scrollTo(0, 0);

  const route = findRoute(normalizedPath);
  if (route) {
    const result = route.slug ? route.renderFn(route.slug) : route.renderFn();
    if (typeof result === 'function') {
      currentCleanup = result;
    }
  } else {
    render404();
  }

  // Update active nav links
  document.querySelectorAll('.landing-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === normalizedPath || (href !== '/' && normalizedPath.startsWith(href)));
  });

  // Update active footer links
  document.querySelectorAll('.landing-footer-links a[href]').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '');
    const isActive = href === normalizedPath;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

/**
 * 404 fallback
 */
const render404 = () => {
  renderNotFoundPage();
};

/**
 * Initialize the landing router
 */
export const initLandingRouter = () => {
  // Handle browser back/forward
  window.addEventListener('popstate', (event) => {
    const path = event.state?.landingPath || window.location.pathname;
    if (isLandingRoute(path) || path === '/') {
      renderLandingRoute(path === '/index.html' ? '/' : path);
    }
  });

  // Handle link clicks (event delegation)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-landing-link]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        const current = window.location.pathname === '/index.html' ? '/' : window.location.pathname;
        if (href === current || (href === '/' && current === '/')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigateLanding(href);
        }
      }
    }
  });

  // Initial render
  const path = window.location.pathname;
  renderLandingRoute(path === '/index.html' ? '/' : path);
};
