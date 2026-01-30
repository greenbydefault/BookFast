/**
 * Bookings Page - Buchungen Dashboard View
 */

import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities } from '../../lib/dataLayer.js';
import { formatDateRange } from '../../lib/dateUtils.js';
import { getIconString } from '../../components/Icons/Icon.js';

// Constants
const STATUS_MAP = {
  new: { label: 'Neu', icon: '✨' },
  pending: { label: 'Ausstehend', icon: '⏳' },
  confirmed: { label: 'Bestätigt', icon: '✓' },
  completed: { label: 'Abgeschlossen', icon: '✓' },
  rejected: { label: 'Abgelehnt', icon: '✗' },
  failed: { label: 'Fehlgeschlagen', icon: '⚠' },
  no_show: { label: 'Nicht erschienen', icon: '👤' },
  cancelled: { label: 'Storniert', icon: '🚫' }
};

const FILTER_TABS = [
  { id: 'new', label: 'Neu', icon: '✨' },
  { id: 'all', label: 'Alle', icon: '📋' },
  { id: 'confirmed', label: 'Bestätigt', icon: '✓' },
  { id: 'completed', label: 'Abgeschlossen', icon: '✓' },
  { id: 'rejected', label: 'Abgelehnt', icon: '✗' },
  { id: 'failed', label: 'Fehlgeschlagen', icon: '⚠' },
  { id: 'no_show', label: 'Nicht erschienen', icon: '👤' },
  { id: 'cancelled', label: 'Storniert', icon: '🚫' }
];

/**
 * Fetch bookings using dataLayer (with caching)
 */
export const fetchBookings = async () => {
  const state = getState();
  const { filter, page, perPage } = state.bookings;

  const result = await fetchEntities('bookings', {
    filter,
    page,
    perPage
  });

  setNestedState('bookings', {
    items: result.items,
    totalPages: result.totalPages
  });

  renderBookingsTable();
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
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-stone-500);">Keine Buchungen gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(booking => `
    <tr>
      <td>
        ${getIconString('user')}
        ${booking.customer_name || 'Unbekannt'}
      </td>
      <td>
        <span class="cell-link">${booking.objects?.name || '-'}</span>
      </td>
      <td>${booking.services?.name || '-'}</td>
      <td class="cell-muted">${formatDateRange(booking.start_time, booking.end_time)}</td>
      <td>${booking.total_price ? booking.total_price + '€' : '-'}</td>
      <td>
        <button class="action-btn" data-booking-id="${booking.id}">⋮</button>
      </td>
    </tr>
  `).join('');

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

/**
 * Handle booking action menu
 */
const handleBookingAction = (bookingId) => {
  // TODO: Implement booking action menu (confirm, reject, etc.)
  alert('Booking Actions: ' + bookingId);
};

/**
 * Main render function for bookings page
 */
export const renderBookingsPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  mainContent.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb">
        <a href="#">Home</a> / Buchungen
      </div>
      <h1 class="page-title">Buchungen</h1>
      
      <div class="filter-tabs">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.bookings.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
            ${tab.icon} ${tab.label}
          </button>
        `).join('')}
        
        <div class="header-actions">
          ${getIconString('gear')}
          <button class="header-action-btn">Help Center</button>
          <button class="header-action-btn">Support</button>
        </div>
      </div>
    </div>

    <div class="search-bar">
      🔍
      <input type="text" class="search-input" placeholder="Suchen" id="booking-search">
      <button class="search-filter">Kunde ▾</button>
      <button class="search-filter">Datum ▾</button>
      <button class="search-filter">Service ▾</button>
      <button class="search-filter">Objekt ▾</button>
      
      <div class="view-toggle">
        ${getIconString('calender-days-date')}
        <button class="view-btn">Kalender</button>
        <button class="view-btn active">${getIconString('list')} List</button>
      </div>
    </div>

    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>${getIconString('user')} Kunde ⇅</th>
            <th>${getIconString('package')} Objekt ⇅</th>
            <th>${getIconString('list')} Service ⇅</th>
            <th>${getIconString('calender-days-date')} Zeitraum ⇅</th>
            <th>${getIconString('ticket-percent')} Betrag ⇅</th>
            <th>Aktion ⇅</th>
          </tr>
        </thead>
        <tbody id="bookings-table-body">
          <tr><td colspan="6" style="text-align: center; padding: 2rem;">Laden...</td></tr>
        </tbody>
      </table>
      <div class="pagination" id="pagination"></div>
    </div>
  `;

  // Event delegation for filter tabs
  mainContent.addEventListener('click', (e) => {
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

    const actionBtn = e.target.closest('[data-booking-id]');
    if (actionBtn) {
      handleBookingAction(actionBtn.dataset.bookingId);
      return;
    }
  });

  // Load bookings
  fetchBookings();
};
