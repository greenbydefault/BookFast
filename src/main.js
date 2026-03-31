/**
 * BookFast - Main Entry Point
 * 
 * Routes between:
 *  1. Portal pages (/b/{token}) — public customer booking portal
 *  2. Dashboard (/dashboard/*) — authenticated operator area
 *  3. Landing pages (everything else) — public marketing pages
 * 
 * Uses dynamic imports so Vite code-splits each chunk separately.
 */

import './styles/base.css';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { supabase } from './lib/supabaseClient.js';
import { loadSprite } from './components/Icons/sprite.js';
import { resetState } from './lib/store.js';
import { removeStorageItem } from './lib/storageService.js';
import { isKnownLandingPath } from './lib/landingRoutesConfig.js';

// Track current user to detect user changes
let currentUserId = null;

const isAppSubdomain = () => window.location.hostname === 'app.book-fast.de';

/**
 * Handle user change: clear stale workspace selection and reset state
 */
const handleUserChange = (newUserId) => {
  if (currentUserId && currentUserId !== newUserId) {
    // Different user logging in — clear previous user's workspace selection
    removeStorageItem('selectedWorkspaceId');
    resetState();
  }
  currentUserId = newUserId;
};

/**
 * Check if current path is a portal route (/b/{token})
 */
const isPortalRoute = () => {
  return window.location.pathname.startsWith('/b/');
};

/**
 * Check if current path is a dashboard route
 */
const isDashboardRoute = () => {
  return window.location.pathname.startsWith('/dashboard');
};

/**
 * Dynamically load and render the Customer Portal
 */
const loadPortal = async () => {
  const { renderPortalPage } = await import('./pages/portal/PortalPage.js');
  renderPortalPage();
};

/**
 * Dynamically load and start the Dashboard
 */
const loadDashboard = async (session) => {
  const { renderDashboard } = await import('./pages/Dashboard.js');
  renderDashboard(session);
};

/**
 * Dynamically load and start Landing Pages
 */
const loadLanding = async ({ isLoggedIn = false } = {}) => {
  const { initLandingPages } = await import('./pages/landing/LandingLayout.js');
  initLandingPages({ isLoggedIn });
};

/**
 * Dynamically cleanup landing (if module was loaded)
 */
const unloadLanding = async () => {
  const { cleanupLandingPages } = await import('./pages/landing/LandingLayout.js');
  cleanupLandingPages();
};

/**
 * Initialize the application
 */
const init = async () => {
  // Load SVG sprite
  loadSprite();

  // 1. Portal route — public, no auth required, own rendering path
  if (isPortalRoute()) {
    await loadPortal();
    return; // No auth listener needed for portal
  }

  // 2. Check for existing session (Dashboard vs Landing)
  const { data: { session } } = await supabase.auth.getSession();
  const path = window.location.pathname;

  if (session) {
    handleUserChange(session.user.id);

    if (isAppSubdomain()) {
      if (!isDashboardRoute() && !isPortalRoute()) {
        history.replaceState(null, '', '/dashboard/bookings');
      }
      await loadDashboard(session);
    } else if (isDashboardRoute()) {
      await loadDashboard(session);
    } else if (isKnownLandingPath(path)) {
      await loadLanding({ isLoggedIn: true });
    } else {
      history.replaceState(null, '', '/dashboard/bookings');
      await loadDashboard(session);
    }
  } else {
    if (isAppSubdomain()) {
      window.location.href = 'https://book-fast.de/';
      return;
    }
    if (!isKnownLandingPath(path)) {
      history.replaceState(null, '', '/');
    }
    await loadLanding();
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    const currentPath = window.location.pathname;

    if (session) {
      handleUserChange(session.user.id);
      await unloadLanding();

      if (isAppSubdomain()) {
        if (!isDashboardRoute() && !isPortalRoute()) {
          history.replaceState(null, '', '/dashboard/bookings');
        }
        await loadDashboard(session);
      } else if (isDashboardRoute()) {
        await loadDashboard(session);
      } else if (isKnownLandingPath(currentPath)) {
        await loadLanding({ isLoggedIn: true });
      } else {
        history.replaceState(null, '', '/dashboard/bookings');
        await loadDashboard(session);
      }
    } else {
      currentUserId = null;
      removeStorageItem('selectedWorkspaceId');
      resetState();
      if (isAppSubdomain()) {
        window.location.href = 'https://book-fast.de/';
        return;
      }
      await unloadLanding();
      if (!isKnownLandingPath(currentPath)) {
        history.replaceState(null, '', '/');
      }
      await loadLanding();
    }
  });
};

// Speed Insights after first paint / idle — avoids competing with LCP-critical work
const scheduleSpeedInsights = () => {
  const run = () => injectSpeedInsights();
  if (document.readyState === 'complete') {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 0);
    }
  } else {
    window.addEventListener(
      'load',
      () => {
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(run, { timeout: 4000 });
        } else {
          setTimeout(run, 0);
        }
      },
      { once: true },
    );
  }
};
scheduleSpeedInsights();
init();
