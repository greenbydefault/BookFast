/**
 * Client-side Router with History API support
 */

import { setState, getState } from './store.js';

// Route configuration
const ROUTES = {
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

// Page registry
const pages = new Map();
let currentCleanup = null;

// Reverse lookup map (Path -> PageID)
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
 * Navigate to a new page
 * @param {string} pageId - Page ID to navigate to
 * @param {boolean} replace - Replace current history entry instead of pushing
 */
export const navigate = (pageId, replace = false) => {
    const path = ROUTES[pageId];
    if (!path) {
        console.error(`Unknown route for pageId: ${pageId}`);
        return;
    }

    // Update browser history
    if (replace) {
        history.replaceState({ pageId }, '', path);
    } else {
        history.pushState({ pageId }, '', path);
    }

    renderPage(pageId);
};

/**
 * Render the page content
 */
const renderPage = (pageId) => {
    // Cleanup previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
        currentCleanup();
        currentCleanup = null;
    }

    // Update state
    setState({ currentPage: pageId });

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${pageId}"]`)?.classList.add('active');

    // Render
    const renderFn = pages.get(pageId);
    if (renderFn) {
        const result = renderFn();
        if (typeof result === 'function') {
            currentCleanup = result;
        }
    } else {
        renderFallback(pageId);
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
        <p style="font-size: 0.8rem; margin-top: 1rem; color: #666;">Route: ${ROUTES[pageId]}</p>
      </div>
    `;
    }
};

/**
 * Get page ID from current path
 */
const getPageFromPath = () => {
    const path = window.location.pathname;
    // Exact match
    if (PATH_TO_PAGE[path]) return PATH_TO_PAGE[path];

    // Default fallback
    return 'bookings';
};

/**
 * Initialize router
 */
export const initRouter = () => {
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
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

    // Initial render based on URL
    const initialPage = getPageFromPath();

    // If we are at root /, redirect to default dashboard path (without page reload)
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        navigate('bookings', true);
    } else {
        // Just render current path
        renderPage(initialPage);
    }
};
