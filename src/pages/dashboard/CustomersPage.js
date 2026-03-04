/**
 * Customers Page - Kunden Dashboard View
 * Displays aggregated customer data from bookings
 */

import { getState, setNestedState } from '../../lib/store.js';
import { formatDate } from '../../lib/dateUtils.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { initFilterToggle } from '../../lib/uiHelpers.js';
import { navigateWithParams, getNavigationGeneration } from '../../lib/router.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';
import { openCreateBookingModal } from './bookings/modals/CreateBookingModal.js';
import { fetchAggregatedCustomers, fetchCustomerEmailCount, fetchBookingsForCustomerAggregation } from '../../lib/services/customersService.js';
import { fetchEntities } from '../../lib/dataLayer.js';

/**
 * Fetch customers aggregated from bookings
 */
export const fetchCustomers = async () => {
  const state = getState();
  const { page, perPage } = state.customers;

  // Demo mode: use dataLayer which reads from DEMO_DATA.customers
  if (state.isDemoMode) {
    const currentGen = getNavigationGeneration();
    const result = await fetchEntities('customers', { page, perPage });
    if (currentGen !== getNavigationGeneration()) return;

    setNestedState('customers', {
      items: result.items,
      totalPages: result.totalPages
    });

    const mainContent = document.getElementById('main-content');
    if (result.items.length === 0) {
      renderEmptyState(mainContent, {
        title: 'Noch keine Kunden vorhanden.',
        description: 'Kundenprofile werden automatisch erstellt, sobald eine neue Buchung eingeht.',
        primaryLabel: 'Buchung anlegen',
        onPrimaryClick: () => openCreateBookingModal(),
      });
      return;
    }

    const tableBody = document.getElementById('customers-table-body');
    if (!tableBody) renderCustomersLayout(mainContent);
    renderCustomersTable();
    return;
  }

  const workspaceId = state.currentWorkspace?.id;
  if (!workspaceId) return;

  const currentGen = getNavigationGeneration();
  const offset = (page - 1) * perPage;

  let data = [];
  try {
    data = await fetchAggregatedCustomers({
      workspaceId,
      limit: perPage,
      offset
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return fetchCustomersDirect(currentGen);
  }

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  const count = await fetchCustomerEmailCount(workspaceId);

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  const totalPages = Math.ceil((count || 0) / perPage);

  setNestedState('customers', {
    items: data || [],
    totalPages
  });

  const mainContent = document.getElementById('main-content');
  const topBarActions = document.getElementById('top-bar-actions');
  if ((data || []).length === 0) {
    renderEmptyState(mainContent, {
      title: 'Noch keine Kunden vorhanden.',
      description: 'Hier finden Sie bald Ihre Kunden. Kundenprofile werden automatisch erstellt, sobald eine neue Buchung eingeht.',
      primaryLabel: 'Buchung anlegen',
      onPrimaryClick: () => openCreateBookingModal(),
      secondaryLabel: 'Mehr über Kunden erfahren',
      secondaryHref: '#'
    });
    if (topBarActions) topBarActions.innerHTML = '';
    return;
  }

  const tableBody = document.getElementById('customers-table-body');
  if (!tableBody) {
    renderCustomersLayout(mainContent);
  }

  renderCustomersTable();
};

/**
 * Fallback: Fetch customers with direct query (less efficient but works without RPC)
 */
const fetchCustomersDirect = async (passedGen) => {
  const state = getState();
  const { page, perPage } = state.customers;
  const workspaceId = state.currentWorkspace?.id;

  if (!workspaceId) return;

  const currentGen = passedGen || getNavigationGeneration();

  // Get all bookings and aggregate in JS
  let bookings = [];
  try {
    bookings = await fetchBookingsForCustomerAggregation(workspaceId);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return;
  }

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  // Aggregate customers
  const customerMap = new Map();
  bookings?.forEach(b => {
    const key = b.customer_email;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        customer_email: b.customer_email,
        customer_name: b.customer_name,
        customer_phone: b.customer_phone,
        booking_count: 1,
        last_booking: b.created_at
      });
    } else {
      const c = customerMap.get(key);
      c.booking_count++;
      // Update last_booking if newer
      if (new Date(b.created_at) > new Date(c.last_booking)) {
        c.last_booking = b.created_at;
      }
    }
  });

  // Sort by last_booking desc and paginate
  const allCustomers = Array.from(customerMap.values())
    .sort((a, b) => new Date(b.last_booking) - new Date(a.last_booking));

  const totalPages = Math.ceil(allCustomers.length / perPage);
  const offset = (page - 1) * perPage;
  const pageItems = allCustomers.slice(offset, offset + perPage);

  setNestedState('customers', {
    items: pageItems,
    totalPages
  });

  const mainContent = document.getElementById('main-content');
  const topBarActions = document.getElementById('top-bar-actions');
  if (pageItems.length === 0) {
    renderEmptyState(mainContent, {
      title: 'Noch keine Kunden vorhanden.',
      description: 'Hier finden Sie bald Ihre Kunden. Kundenprofile werden automatisch erstellt, sobald eine neue Buchung eingeht.',
      primaryLabel: 'Buchung anlegen',
      onPrimaryClick: () => openCreateBookingModal(),
      secondaryLabel: 'Mehr über Kunden erfahren',
      secondaryHref: '#'
    });
    if (topBarActions) topBarActions.innerHTML = '';
    return;
  }

  const tableBody = document.getElementById('customers-table-body');
  if (!tableBody) {
    renderCustomersLayout(mainContent);
  }

  renderCustomersTable();
};

/**
 * Render the customers table body
 */
const renderCustomersTable = () => {
  const container = document.getElementById('customers-table-body');
  if (!container) return;

  const state = getState();
  const { items } = state.customers;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-stone-500);">Keine Kunden gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(customer => `
    <tr class="clickable-row" data-customer-email="${customer.customer_email}">
      <td>${customer.customer_name || 'Unbekannt'}</td>
      <td class="cell-link">${customer.customer_email}</td>
      <td class="cell-muted">${customer.customer_phone || '-'}</td>
      <td>
        <span class="badge badge-info">${customer.booking_count}</span>
      </td>
      <td class="cell-muted">${formatDate(customer.last_booking)}</td>
      <td>
        <button class="action-btn" data-customer-email="${customer.customer_email}">⋮</button>
      </td>
    </tr>
  `).join('');

  renderPagination();
};

/**
 * Render pagination controls
 */
const renderPagination = () => {
  const container = document.getElementById('customers-pagination');
  if (!container) return;

  const state = getState();
  const { page, totalPages } = state.customers;
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
 * Handle pagination click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.customers.totalPages) return;

  setNestedState('customers', { page });
  fetchCustomers();
};

/**
 * Handle customer action menu
 */
const handleCustomerAction = (customerEmail) => {
  navigateWithParams('customer-detail', { id: encodeURIComponent(customerEmail) });
};

const renderCustomersLayout = (mainContent) => {
  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        <!-- No filter tabs for customers page -->
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
        <input type="text" class="search-input" placeholder="Suchen nach Name, E-Mail oder Telefon" id="customer-search">
      </div>
      
      <button class="search-filter">Buchungen ▾</button>
      <button class="search-filter">Datum ▾</button>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name ${getIconString('arrow-up-down')}</th>
              <th>E-Mail ${getIconString('arrow-up-down')}</th>
              <th>Telefon ${getIconString('arrow-up-down')}</th>
              <th>Buchungen ${getIconString('arrow-up-down')}</th>
              <th>Letzte Buchung ${getIconString('arrow-up-down')}</th>
              <th>Aktion ${getIconString('arrow-up-down')}</th>
            </tr>
          </thead>
          <tbody id="customers-table-body">
            <tr><td colspan="6" style="text-align: center; padding: 2rem;">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="customers-pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function for customers page
 */
export const renderCustomersPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('user-square')} Kunden</span>`;
  }

  // Clear top bar actions (no main button for customers)
  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
  }

  renderPageLoading(mainContent);

  // Event delegation
  const handleMainContentClick = (e) => {
    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) {
      handlePageClick(parseInt(pageBtn.dataset.page, 10));
      return;
    }

    const actionBtn = e.target.closest('[data-customer-email]');
    if (actionBtn) {
      handleCustomerAction(actionBtn.dataset.customerEmail);
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);



  // Load customers
  fetchCustomers();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
