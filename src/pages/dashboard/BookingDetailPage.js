/**
 * Booking Detail Page - Orchestrator
 * Loads booking data and renders Invoice + Sidebar layout
 * Uses same detail layout as Object/Service/Addon pages: sidecard as main-wrapper child (full height)
 */

import { getState } from '../../lib/store.js';
import { supabase } from '../../lib/supabaseClient.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { navigate, getNavigationGeneration } from '../../lib/router.js';
import { renderDetailLayout } from '../../components/DetailLayout/DetailLayout.js';
import { renderInvoice } from './booking-detail/InvoiceView.js';
import { renderBookingSidebar, initSidebarEvents } from './booking-detail/BookingSidebar.js';
import { DEMO_DATA, DEMO_WORKSPACE } from '../../lib/DemoData.js';

// Extended select for detail view (includes voucher + addon prices)
const DETAIL_SELECT = `
    *,
    objects(name),
    services(name, service_type, price),
    booking_addons(addon_id, quantity, price_per_unit, total_price, addons(name)),
    booking_staff(staff_id, staff(name)),
    vouchers(code, name, discount_type, discount_value)
`;

/**
 * Fetch a single booking with full relations for detail view
 */
const fetchBookingDetail = async (bookingId) => {
    const state = getState();

    if (state.isDemoMode) {
        return DEMO_DATA.bookings.find(b => b.id === bookingId) || null;
    }

    const workspaceId = state.currentWorkspace?.id;

    const { data, error } = await supabase
        .from('bookings')
        .select(DETAIL_SELECT)
        .eq('id', bookingId)
        .eq('workspace_id', workspaceId)
        .single();

    if (error) {
        console.error('fetchBookingDetail:', error);
        return null;
    }
    return data;
};

/**
 * Fetch workspace data for invoice sender info
 */
const fetchWorkspaceData = async () => {
    const state = getState();

    if (state.isDemoMode) {
        return DEMO_WORKSPACE;
    }

    const workspaceId = state.currentWorkspace?.id;

    const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

    if (error) {
        console.error('fetchWorkspaceData:', error);
        return null;
    }
    return data;
};

/**
 * Update breadcrumb for detail page
 */
const updateBreadcrumb = (booking, signal) => {
    const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
    if (!topBarBreadcrumb) return;

    const bookingNumber = booking.booking_number || '—';
    const customerName = booking.customer_name || 'Unbekannt';

    topBarBreadcrumb.innerHTML = `
        <span class="breadcrumb-item">
            ${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a>
        </span>
        <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
        <span class="breadcrumb-item">
            ${getIconString('calender-days-date')} <a href="#" class="breadcrumb-link" data-nav="bookings">Buchungen</a>
        </span>
        <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
        <span class="breadcrumb-item">
            ${getIconString('receipt-euro')} #${bookingNumber} ${customerName} – Rechnung
        </span>
    `;

    // Breadcrumb click handlers
    topBarBreadcrumb.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        const nav = link.dataset.nav;
        if (nav === 'home' || nav === 'bookings') {
            navigate('bookings');
        }
    }, { signal });
};

/**
 * Render loading state
 */
const renderLoading = (mainContent) => {
    mainContent.innerHTML = `
        <div class="booking-detail-loading">
            <p>Buchung wird geladen...</p>
        </div>
    `;
};

/**
 * Render error state
 */
const renderError = (mainContent, message) => {
    mainContent.innerHTML = `
        <div class="booking-detail-error">
            <h3>Fehler</h3>
            <p>${message}</p>
            <button class="btn btn-primary" id="back-to-bookings">Zurück zu Buchungen</button>
        </div>
    `;
    document.getElementById('back-to-bookings')?.addEventListener('click', () => navigate('bookings'));
};

/**
 * Main render function for booking detail page
 * @param {Object} params - Route params containing { id }
 */
export const renderBookingDetailPage = (params = {}) => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const bookingId = params.id;
    if (!bookingId) {
        renderError(mainContent, 'Keine Buchungs-ID angegeben.');
        return;
    }

    // Clear top bar actions
    const topBarActions = document.getElementById('top-bar-actions');
    if (topBarActions) topBarActions.innerHTML = '';

    const ac = new AbortController();
    const gen = getNavigationGeneration();

    // Show loading
    renderLoading(mainContent);

    // Fetch data and render
    loadAndRender(mainContent, bookingId, gen, ac.signal);

    return () => ac.abort();
};

/**
 * Async data loading and rendering
 */
const loadAndRender = async (mainContent, bookingId, gen, signal) => {
    // Fetch booking and workspace in parallel
    const [booking, workspace] = await Promise.all([
        fetchBookingDetail(bookingId),
        fetchWorkspaceData(),
    ]);

    // Stale navigation guard
    if (gen !== getNavigationGeneration()) return;

    if (!booking) {
        renderError(mainContent, 'Buchung nicht gefunden.');
        return;
    }

    // Update breadcrumb
    updateBreadcrumb(booking, signal);

    // Render detail layout (same as Object/Service/Addon: sidecard as main-wrapper child, full height)
    renderDetailLayout({
        centerContent: `
            <div class="booking-detail-main">
                ${renderInvoice(booking, workspace)}
            </div>
        `,
        sideCardContent: renderBookingSidebar(booking),
        showPreviewButton: false,
    });

    // Initialize sidebar event handlers (workspace needed for PDF export)
    initSidebarEvents(booking, workspace);
};
