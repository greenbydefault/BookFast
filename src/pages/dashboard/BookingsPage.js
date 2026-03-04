/**
 * Bookings Page - Buchungen Dashboard View
 */


import { getState, setNestedState } from '../../lib/store.js';
import { invalidateCache } from '../../lib/dataLayer.js';
// Removed: import { fetchEntities } from '../../lib/dataLayer.js';
import { getNavigationGeneration } from '../../lib/router.js';
import { formatDateRange } from '../../lib/dateUtils.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { renderLinkedItems, initFilterToggle } from '../../lib/uiHelpers.js';
import { openRejectBookingModal } from './modals/RejectBookingModal.js';
import { navigateWithParams } from '../../lib/router.js';
import { openCreateBookingModal } from './bookings/modals/CreateBookingModal.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';
import { getEffectiveBookingStatus } from '../../lib/bookingStatus.js';
import { fetchWorkspaceBookingCount } from '../../lib/services/bookingService.js';
import { openBookingActionsMenu } from './bookings/bookingsActions.js';
import { buildBookingsConfig } from './bookings/bookingsConfig.js';
const { STATUS_MAP, PAYMENT_STATUS_MAP, FILTER_TABS, EMPTY_STATE_CONFIG } = buildBookingsConfig(getIconString);

let hasBookingsRefreshListener = false;
let bookingsAutoRefreshIntervalId = null;

/**
 * Fetch bookings using dataLayer (with caching)
 */
export const fetchBookings = async (options = {}) => {
  const { forceRefresh = false } = options;
  const mainContent = document.getElementById('main-content');
  const dataTableWrapper = document.querySelector('.data-table-wrapper');
  const topBarActions = document.getElementById('top-bar-actions');
  const state = getState();
  const { filter, page, perPage } = state.bookings;

  // Capture the generation before async operation
  const currentGen = getNavigationGeneration();

  // Import dynamically here to avoid circular dependency if router imports pages
  const { fetchEntities } = await import('../../lib/dataLayer.js');

  const result = await fetchEntities('bookings', {
    filter,
    page,
    perPage,
    forceRefresh,
  });

  // If user navigated away while fetching, abort
  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  setNestedState('bookings', {
    items: result.items,
    totalPages: result.totalPages
  });

  if (result.items.length === 0) {
    let globalCount = 0;
    if (state.isDemoMode) {
      globalCount = filter === 'all' ? 0 : 1;
    } else if (state.currentWorkspace?.id) {
      globalCount = await fetchWorkspaceBookingCount(state.currentWorkspace.id);
    }

    if (globalCount === 0) {
      renderEmptyState(mainContent, {
        ...EMPTY_STATE_CONFIG,
        onPrimaryClick: openCreateBookingModal
      });
      if (topBarActions) topBarActions.innerHTML = '';
      return;
    }
  }

  const tableBody = document.getElementById('bookings-table-body');
  if (!tableBody) {
    renderBookingsLayout(mainContent);
  }

  renderBookingsTable();
};

const startBookingsAutoRefresh = () => {
  if (bookingsAutoRefreshIntervalId) {
    clearInterval(bookingsAutoRefreshIntervalId);
  }

  // Webhook-created bookings arrive asynchronously; keep dashboard fresh.
  bookingsAutoRefreshIntervalId = setInterval(() => {
    fetchBookings({ forceRefresh: true });
  }, 15000);
};

/**
 * Render the bookings table body
 */
const renderBookingsTable = () => {
  const container = document.getElementById('bookings-table-body');
  if (!container) return;

  const state = getState();
  const { items } = state.bookings;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--color-stone-500);">Keine Buchungen gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(booking => {
    const effectiveStatus = getEffectiveBookingStatus(booking);
    const paymentStatus = PAYMENT_STATUS_MAP[booking.payment_status] || PAYMENT_STATUS_MAP.unpaid;
    const showPaymentBadge = booking.payment_status && booking.payment_status !== 'unpaid';
    const statusClass = `status-${effectiveStatus}`;
    const statusLabel = STATUS_MAP[effectiveStatus]?.label.toUpperCase() || 'PENDING';

    return `
    <tr class="clickable-row" data-row-booking-id="${booking.id}">
      <td>${booking.customer_name || 'Unbekannt'}</td>
      <td>
        <span class="cell-link">${booking.objects?.name || '-'}</span>
      </td>
      <td>${booking.services?.name || '-'}</td>
      <td class="cell-muted">${formatDateRange(booking.start_time, booking.end_time)}</td>
      <td>
        ${booking.booking_addons && booking.booking_addons.length > 0 ? renderLinkedItems(booking.booking_addons, 'addon') : '-'}
      </td>
      <td>
        ${booking.booking_staff && booking.booking_staff.length > 0 ? renderLinkedItems(booking.booking_staff, 'staff') : '-'}
      </td>
      <td>${booking.total_price ? booking.total_price + '€' : '-'}</td>
      <td>
        <span class="status-badge ${statusClass}">
          ${statusLabel}
        </span>
      </td>
      <td>
        <button class="action-btn" data-booking-id="${booking.id}" data-status="${effectiveStatus}" data-payment-status="${booking.payment_status || 'unpaid'}">⋮</button>
      </td>
    </tr>
  `;
  }).join('');

  renderPagination();
};

/**
 * Render pagination controls
 */
const renderPagination = () => {
  const container = document.getElementById('pagination');
  if (!container) return;

  const state = getState();
  const { page, totalPages } = state.bookings;
  const pages = [];

  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pages.push(i);
  }

  container.innerHTML = `
    <button class="pagination-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>Zurück</button>
    ${pages.map(p => `
      <button class="page-number ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>
    `).join('')}
    <button class="pagination-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>Weiter</button>
  `;
};

/**
 * Handle filter tab click
 */
const handleFilterClick = (filter) => {
  setNestedState('bookings', { filter, page: 1 });

  // Update active tab UI
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');

  fetchBookings();
};

/**
 * Handle pagination click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.bookings.totalPages) return;

  setNestedState('bookings', { page });
  fetchBookings();
};

const renderBookingsLayout = (mainContent) => {
  const state = getState();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = `
        <button id="btn-new-booking" class="btn btn-primary">
            ${getIconString('plus-circle')} Neue Buchung
        </button>
    `;
    document.getElementById('btn-new-booking')?.addEventListener('click', openCreateBookingModal);
  }

  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        ${FILTER_TABS.filter(t => !t.hidden).map(tab => `
          <button class="filter-tab ${state.bookings.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
            ${tab.label}
          </button>
        `).join('')}
      </div>
      <div class="tabs-actions">
        <button class="filter-toggle-btn" id="filter-toggle-btn">
          ${getIconString('funnel')} Filter
        </button>
      </div>
    </div>

    <!-- Zone 3: Search / Filters -->
    <div class="zone-filters">
      <div class="filter-search-wrapper">
        ${getIconString('search')}
        <input type="text" class="search-input" placeholder="Suchen" id="booking-search">
      </div>
      <div class="filter-buttons">
        <button class="search-filter">Kunde ▾</button>
        <button class="search-filter">Datum ▾</button>
        <button class="search-filter">Service ▾</button>
        <button class="search-filter">Objekt ▾</button>
      </div>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Kunde ${getIconString('arrow-up-down')}</th>
              <th>Objekt ${getIconString('arrow-up-down')}</th>
              <th>Service ${getIconString('arrow-up-down')}</th>
              <th>Zeitraum ${getIconString('arrow-up-down')}</th>
              <th>Extras</th>
              <th>Mitarbeiter</th>
              <th>Betrag ${getIconString('arrow-up-down')}</th>
              <th>Status ${getIconString('arrow-up-down')}</th>
              <th>Aktion ${getIconString('arrow-up-down')}</th>
            </tr>
          </thead>
          <tbody id="bookings-table-body">
            <tr><td colspan="8" style="text-align: center; padding: 2rem;">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function for bookings page
 */
export const renderBookingsPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">Buchungen</span>`;
  }

  // Top Bar Actions (Clear initially during loading)
  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
  }

  renderPageLoading(mainContent);

  // Event delegation for filter tabs
  const handleMainContentClick = (e) => {
    const filterTab = e.target.closest('.filter-tab');
    if (filterTab) {
      handleFilterClick(filterTab.dataset.filter);
      return;
    }

    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) {
      handlePageClick(parseInt(pageBtn.dataset.page, 10));
      return;
    }

    // Action menu button (check before row click to prevent navigation)
    const actionBtn = e.target.closest('.action-btn[data-booking-id]');
    if (actionBtn) {
      e.stopPropagation();
      openBookingActionsMenu({
        bookingId: actionBtn.dataset.bookingId,
        bookingStatus: actionBtn.dataset.status,
        paymentStatus: actionBtn.dataset.paymentStatus,
        buttonElement: actionBtn,
        bookings: getState().bookings.items,
        onRefresh: fetchBookings,
        openRejectBookingModal
      });
      return;
    }

    // Row click -> navigate to detail page
    const row = e.target.closest('.clickable-row[data-row-booking-id]');
    if (row) {
      navigateWithParams('booking-detail', { id: row.dataset.rowBookingId });
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);

  // Load bookings
  fetchBookings();
  startBookingsAutoRefresh();

  if (!hasBookingsRefreshListener) {
    window.addEventListener('bookings:refresh', async (event) => {
      const preferredFilter = event?.detail?.preferredFilter;
      if (preferredFilter && getState().bookings.filter !== preferredFilter) {
        setNestedState('bookings', { filter: preferredFilter, page: 1 });
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.filter-tab[data-filter="${preferredFilter}"]`)?.classList.add('active');
      }
      invalidateCache('bookings');
      await fetchBookings();
    });
    hasBookingsRefreshListener = true;
  }

  return () => {
    if (bookingsAutoRefreshIntervalId) {
      clearInterval(bookingsAutoRefreshIntervalId);
    }
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
