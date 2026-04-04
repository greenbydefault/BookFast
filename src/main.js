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

import { injectSpeedInsights } from '@vercel/speed-insights';
import { supabase } from './lib/supabaseClient.js';
import { loadSprite } from './components/Icons/sprite.js';
import { resetState } from './lib/store.js';
import { removeStorageItem } from './lib/storageService.js';
import { isKnownLandingPath } from './lib/landingRoutesConfig.js';

// Track current user to detect user changes
let currentUserId = null;

const isAppSubdomain = () => window.location.hostname === 'app.book-fast.de';
const hasLandingShell = () => Boolean(document.getElementById('landing-content'));
const clearLandingShellActive = () => {
  document.documentElement.classList.remove('landing-active');
  document.body?.classList.remove('landing-active');
};

const setLandingShellActive = () => {
  document.documentElement.classList.add('landing-active');
  document.body?.classList.add('landing-active');
};

const shouldBootstrapLandingImmediately = (path) =>
  !isAppSubdomain() && !isPortalRoute() && !isDashboardRoute() && isKnownLandingPath(path);

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
  clearLandingShellActive();
  const { renderPortalPage } = await import('./pages/portal/PortalPage.js');
  renderPortalPage();
};

/**
 * Dynamically load and start the Dashboard
 */
const loadDashboard = async (session) => {
  clearLandingShellActive();
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

const syncLandingAuthState = async ({ isLoggedIn = false } = {}) => {
  const { updateLandingAuthState } = await import('./pages/landing/LandingLayout.js');
  updateLandingAuthState({ isLoggedIn });
};

/**
 * Dynamically cleanup landing (if module was loaded)
 */
const unloadLanding = async () => {
  clearLandingShellActive();
  const { cleanupLandingPages } = await import('./pages/landing/LandingLayout.js');
  cleanupLandingPages();
};

/**
 * Initialize the application
 */
const init = async () => {
  // Load SVG sprite
  loadSprite();

  const path = window.location.pathname;
  const bootstrapLandingNow = shouldBootstrapLandingImmediately(path);
  const sessionPromise = supabase.auth.getSession();
  let landingBootstrapPromise = null;

  // 1. Portal route — public, no auth required, own rendering path
  if (isPortalRoute()) {
    await loadPortal();
    return; // No auth listener needed for portal
  }

  if (bootstrapLandingNow) {
    setLandingShellActive();
    landingBootstrapPromise = loadLanding();
  }

  // 2. Check for existing session (Dashboard vs Landing)
  const { data: { session } } = await sessionPromise;

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
      if (bootstrapLandingNow && landingBootstrapPromise) {
        await landingBootstrapPromise;
      }
      if (bootstrapLandingNow && hasLandingShell()) {
        await syncLandingAuthState({ isLoggedIn: true });
      } else {
        await loadLanding({ isLoggedIn: true });
      }
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
    if (!bootstrapLandingNow) {
      await loadLanding();
    } else if (landingBootstrapPromise) {
      await landingBootstrapPromise;
    }
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    const currentPath = window.location.pathname;

    if (session) {
      handleUserChange(session.user.id);

      if (isAppSubdomain()) {
        await unloadLanding();
        if (!isDashboardRoute() && !isPortalRoute()) {
          history.replaceState(null, '', '/dashboard/bookings');
        }
        await loadDashboard(session);
      } else if (isDashboardRoute()) {
        await unloadLanding();
        await loadDashboard(session);
      } else if (isKnownLandingPath(currentPath)) {
        if (hasLandingShell()) {
          await syncLandingAuthState({ isLoggedIn: true });
        } else {
          await loadLanding({ isLoggedIn: true });
        }
      } else {
        await unloadLanding();
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
      if (isKnownLandingPath(currentPath)) {
        if (hasLandingShell()) {
          await syncLandingAuthState({ isLoggedIn: false });
        } else {
          await loadLanding();
        }
      } else {
        await unloadLanding();
        history.replaceState(null, '', '/');
        await loadLanding();
      }
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
