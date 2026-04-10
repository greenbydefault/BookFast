/**
 * Landing Page Router
 * Handles routing for all public-facing landing pages.
 * Separate from the dashboard router to keep concerns isolated.
 */
import { clearSEO, setCanonical } from './seoHelper.js';
import { renderNotFoundPage } from '../pages/landing/NotFoundPage.js';
import { applyLandingAccessibilityTitles } from './landingAccessibility.js';
import { normalizeLandingPath, getLocaleFromPath, applyDocumentLang } from './landingLocale.js';
import { syncLandingNavigationChrome } from '../components/landing/Navigation.js';
import { syncLandingFooterChrome } from '../components/landing/Footer.js';
import { openWaitlistModal } from '../components/landing/WaitlistModal.js';

// Page registry: path → renderFn
const landingPages = new Map();

// Wildcard registrations: prefix → renderFn
const wildcardPages = new Map();

let currentCleanup = null;
let routerInitialized = false;

const handleLandingPopstate = (event) => {
  const path = event.state?.landingPath || window.location.pathname;
  if (isLandingRoute(path)) {
    renderLandingRoute(path);
  }
};

const handleLandingDocumentClick = (e) => {
  const waitlistTrigger = e.target.closest('[data-landing-waitlist]');
  if (waitlistTrigger) {
    e.preventDefault();
    waitlistTrigger.closest('.landing-nav')?.querySelector('#mobile-menu')?.classList.remove('open');
    openWaitlistModal();
    return;
  }

  const link = e.target.closest('[data-landing-link]');
  if (link) {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      const current = normalizeLandingPath(
        window.location.pathname === '/index.html' ? '/' : window.location.pathname,
      );
      const target = normalizeLandingPath(href);
      if (target === current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateLanding(href);
      }
    }
  }
};

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
  const p = normalizeLandingPath(path);
  if (p === '/') return true;
  if (p === '/en' || p.startsWith('/en/')) return true;
  if (landingPages.has(p)) return true;
  for (const prefix of wildcardPages.keys()) {
    if (p.startsWith(prefix)) return true;
  }
  return false;
};

/**
 * Navigate to a landing page
 */
export const navigateLanding = (path, replace = false) => {
  const p = normalizeLandingPath(path);
  if (replace) {
    history.replaceState({ landingPath: p }, '', p);
  } else {
    history.pushState({ landingPath: p }, '', p);
  }
  renderLandingRoute(p);
};

/**
 * Render the matching landing page
 */
const renderLandingRoute = (path) => {
  const normalizedPath = normalizeLandingPath(path === '/index.html' ? '/' : path);

  // Cleanup previous
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  // Remove stale SEO artifacts (e.g. FAQ JSON-LD) between route changes
  clearSEO();
  setCanonical(normalizedPath);
  applyDocumentLang(getLocaleFromPath(normalizedPath));

  // Scroll to top
  window.scrollTo(0, 0);

  const locale = getLocaleFromPath(normalizedPath);
  const route = findRoute(normalizedPath);
  if (route) {
    const result = route.slug
      ? route.renderFn(route.slug, locale)
      : route.renderFn(locale);
    if (typeof result === 'function') {
      currentCleanup = result;
    }
  } else {
    render404(locale);
  }

  // Update active nav links
  syncLandingNavigationChrome();
  syncLandingFooterChrome();
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

  applyLandingAccessibilityTitles(document.getElementById('app'));
};

/**
 * 404 fallback
 */
const render404 = (locale) => {
  renderNotFoundPage(locale);
};

/**
 * Initialize the landing router
 */
export const initLandingRouter = () => {
  if (!routerInitialized) {
    window.addEventListener('popstate', handleLandingPopstate);
    document.addEventListener('click', handleLandingDocumentClick);
    routerInitialized = true;
  }

  // Initial render
  renderLandingRoute(window.location.pathname);
};
