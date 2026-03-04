/**
 * Client-side Router with History API support
 * Supports both static routes and parameterized routes (e.g. /dashboard/bookings/:id)
 */

import { setState, getState } from './store.js';

// Static route configuration
const ROUTES = {
    home: '/dashboard/home',
    bookings: '/dashboard/bookings',
    objects: '/dashboard/objects',
    services: '/dashboard/services',
    staff: '/dashboard/staff',
    addons: '/dashboard/addons',
    vouchers: '/dashboard/vouchers',
    customers: '/dashboard/customers',
    insights: '/dashboard/insights',
    settings: '/dashboard/settings'
};

// Parameterized routes (order matters — checked before static routes)
const PARAM_ROUTES = {
    'booking-detail': { pattern: '/dashboard/bookings/:id', parent: 'bookings' },
    'staff-detail': { pattern: '/dashboard/staff/:id', parent: 'staff' },
    'voucher-detail': { pattern: '/dashboard/vouchers/:id', parent: 'vouchers' },
    'addon-detail': { pattern: '/dashboard/addons/:id', parent: 'addons' },
    'service-detail': { pattern: '/dashboard/services/:id', parent: 'services' },
    'object-detail': { pattern: '/dashboard/objects/:id', parent: 'objects' },
    'customer-detail': { pattern: '/dashboard/customers/:id', parent: 'customers' },
};

// Page registry
const pages = new Map();
let currentCleanup = null;
let currentParams = {};

// Navigation generation counter – incremented on every navigation.
// Used by async page renders to detect stale operations.
let navigationGeneration = 0;

/**
 * Get the current navigation generation.
 * Async page renders should capture this before awaiting, then compare
 * after to detect if the user navigated away in the meantime.
 * @returns {number}
 */
export const getNavigationGeneration = () => navigationGeneration;

/**
 * Remove layout artifacts from previously rendered pages.
 * This acts as a global failsafe when page-level cleanup was missed.
 */
const cleanupLayoutArtifacts = () => {
    const mainWrapper = document.querySelector('.main-wrapper');
    if (!mainWrapper) return;

    // Remove detail sidecard artifacts
    const existingSidecard = mainWrapper.querySelector(':scope > .detail-sidecard');
    if (existingSidecard) existingSidecard.remove();
    mainWrapper.classList.remove('has-detail-sidecard');

    // Remove settings secondary nav artifacts
    const settingsNav = document.getElementById('settings-secondary-nav')
        || mainWrapper.querySelector(':scope > .settings-nav');
    if (settingsNav) settingsNav.remove();
    mainWrapper.classList.remove('main-wrapper--settings');
};

// Reverse lookup map (Path -> PageID) for static routes
const PATH_TO_PAGE = Object.entries(ROUTES).reduce((acc, [id, path]) => {
    acc[path] = id;
    return acc;
}, {});

/**
 * Register a page
 */
export const registerPage = (pageId, renderFn) => {
    pages.set(pageId, renderFn);
};

/**
 * Navigate to a static page
 * @param {string} pageId - Page ID to navigate to
 * @param {{ queryParams?: string, replace?: boolean }|string|boolean} options - Navigation options
 */
export const navigate = (pageId, options = {}) => {
    let queryParams = '';
    let replace = false;

    // Backward compatibility: navigate(pageId, true) / navigate(pageId, '?tab=...')
    if (typeof options === 'boolean') {
        replace = options;
    } else if (typeof options === 'string') {
        queryParams = options;
    } else if (options && typeof options === 'object') {
        queryParams = options.queryParams || '';
        replace = !!options.replace;
    }

    let path = ROUTES[pageId];
    if (!path) {
        console.error(`Unknown route for pageId: ${pageId}`);
        return;
    }

    if (queryParams) {
        if (!queryParams.startsWith('?')) {
            queryParams = '?' + queryParams;
        }
        path += queryParams;
    }

    const state = getState();
    if (state.isDemoMode) {
        console.log(`[DEMO] navigate(${pageId})`);
        currentParams = {};
        renderPage(pageId);
        return;
    }

    if (replace) {
        history.replaceState({ pageId }, '', path);
    } else {
        history.pushState({ pageId }, '', path);
    }

    currentParams = {};
    renderPage(pageId);
};

/**
 * Navigate to a parameterized page
 * @param {string} pageId - Page ID (e.g. 'booking-detail')
 * @param {Object} params - Route params (e.g. { id: 'abc-123' })
 * @param {boolean} replace - Replace current history entry
 */
export const navigateWithParams = (pageId, params = {}, replace = false) => {
    const routeConfig = PARAM_ROUTES[pageId];
    if (!routeConfig) {
        console.error(`Unknown parameterized route: ${pageId}`);
        return;
    }

    // Build path from pattern (replace :key with param values)
    let path = routeConfig.pattern;
    for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value);
    }

    const state = getState();
    if (state.isDemoMode) {
        console.log(`[DEMO] navigateWithParams(${pageId})`, params);
        currentParams = params;
        renderPage(pageId);
        return;
    }

    if (replace) {
        history.replaceState({ pageId, params }, '', path);
    } else {
        history.pushState({ pageId, params }, '', path);
    }

    currentParams = params;
    renderPage(pageId);
};

/**
 * Render the page content
 */
const renderPage = (pageId) => {
    // Increment generation to invalidate any in-flight async renders
    navigationGeneration++;
    const renderGeneration = navigationGeneration;

    // Cleanup previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
        currentCleanup();
        currentCleanup = null;
    }

    // Remove lingering layout artifacts from previously rendered pages
    cleanupLayoutArtifacts();

    // Update state
    setState({ currentPage: pageId });

    // Update active nav link (use parent for parameterized routes)
    const navId = PARAM_ROUTES[pageId]?.parent || pageId;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${navId}"]`)?.classList.add('active');

    // Render
    const renderFn = pages.get(pageId);
    if (!renderFn) {
        renderFallback(pageId);
        return;
    }

    const result = renderFn(currentParams);

    // Synchronous cleanup function
    if (typeof result === 'function') {
        currentCleanup = result;
        return;
    }

    // Async render returning Promise<cleanupFn | void>
    if (result && typeof result.then === 'function') {
        result
            .then((asyncCleanup) => {
                if (typeof asyncCleanup !== 'function') return;

                // If navigation changed meanwhile, run cleanup immediately
                // so stale pages cannot leak listeners or DOM nodes.
                if (renderGeneration !== navigationGeneration) {
                    asyncCleanup();
                    return;
                }

                currentCleanup = asyncCleanup;
            })
            .catch((error) => {
                console.error('Page render failed:', error);
            });
    }
};

/**
 * Fallback for missing pages
 */
const renderFallback = (pageId) => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
      <div style="text-align: center; padding: 4rem;">
        <h2>${pageId.charAt(0).toUpperCase() + pageId.slice(1)}</h2>
        <p style="color: var(--color-stone-500);">Diese Seite ist noch in Entwicklung.</p>
      </div>
    `;
    }
};

/**
 * Match current path against parameterized routes
 * @returns {{ pageId: string, params: Object } | null}
 */
const matchParamRoute = (path) => {
    for (const [pageId, config] of Object.entries(PARAM_ROUTES)) {
        const patternParts = config.pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) continue;

        const params = {};
        let matched = true;

        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                matched = false;
                break;
            }
        }

        if (matched) return { pageId, params };
    }
    return null;
};

/**
 * Get page ID from current path
 */
const getPageFromPath = () => {
    const path = window.location.pathname;

    // Exact match (static routes)
    if (PATH_TO_PAGE[path]) {
        currentParams = {};
        return PATH_TO_PAGE[path];
    }

    // Parameterized route match
    const paramMatch = matchParamRoute(path);
    if (paramMatch) {
        currentParams = paramMatch.params;
        return paramMatch.pageId;
    }

    // Default fallback
    currentParams = {};
    return 'home';
};

/**
 * Initialize router
 */
export const initRouter = () => {
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        if (event.state?.params) {
            currentParams = event.state.params;
        }
        const pageId = event.state?.pageId || getPageFromPath();
        renderPage(pageId);
    });

    // Handle nav clicks
    document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const pageId = navLink.dataset.page;
            if (pageId) {
                navigate(pageId);
            }
        }
    });

    // Handle breadcrumb clicks
    document.addEventListener('click', (e) => {
        const breadcrumbLink = e.target.closest('.breadcrumb-link');
        if (breadcrumbLink) {
            e.preventDefault();
            const nav = breadcrumbLink.dataset.nav;
            if (nav) {
                navigate(nav);
            }
        }
    });

    // Initial render based on URL
    const initialPage = getPageFromPath();

    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        navigate('home', { replace: true });
    } else {
        renderPage(initialPage);
    }
};
