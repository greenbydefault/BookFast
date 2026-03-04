/**
 * Vouchers Page - Dashboard View
 */
import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities, fetchEntityCount, deleteEntity, invalidateCache } from '../../lib/dataLayer.js';
import { navigateWithParams, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { createActionMenu } from '../../components/ActionMenu/ActionMenu.js';
import { openCreateVoucherModal } from './modals/CreateVoucherModal.js';
import { openDeleteConfirmModal } from './modals/DeleteConfirmModal.js';
import { renderLinkedItems, initFilterToggle } from '../../lib/uiHelpers.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';

// Status options for filter tabs
const FILTER_TABS = [
  { id: 'all', label: 'Alle', icon: 'list' },
  { id: 'active', label: 'Aktiv', icon: 'check' },
  { id: 'draft', label: 'Entwurf', icon: 'square-pen' },
  { id: 'expired', label: 'Abgelaufen', icon: 'clock' }
];

/**
 * Format discount display
 */
const formatDiscount = (type, value) => {
  if (!type || !value) return '-';
  return type === 'percentage' ? `${value}%` : `${value} €`;
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
};

const EMPTY_STATE_CONFIG = {
  title: 'Noch keine Gutscheine vorhanden.',
  description: 'Erstellen Sie Ihren ersten Gutschein – z. B. für Geschenke oder Marketingaktionen. Code, Rabatt und Gültigkeit können Sie jederzeit anpassen.',
  primaryLabel: '+ Gutschein erstellen',
  secondaryLabel: 'Mehr über Gutscheine erfahren'
};

/**
 * Fetch data using dataLayer
 */
const fetchVouchers = async () => {
  const mainContent = document.getElementById('main-content');
  const dataTableWrapper = document.querySelector('.data-table-wrapper');
  const topBarActions = document.getElementById('top-bar-actions');
  const state = getState();
  const { filter, page, perPage } = state.vouchers;

  const currentGen = getNavigationGeneration();

  const result = await fetchEntities('vouchers', { filter, page, perPage });

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  setNestedState('vouchers', {
    items: result.items,
    totalPages: result.totalPages
  });

  if (result.items.length === 0) {
    let globalCount = 0;
    if (filter !== 'all') {
      globalCount = await fetchEntityCount('vouchers');
    }
    if (globalCount === 0) {
      renderEmptyState(mainContent, {
        ...EMPTY_STATE_CONFIG,
        onPrimaryClick: handleAddVoucher,
        secondaryHref: '#'
      });
      if (topBarActions) topBarActions.innerHTML = '';
      return;
    }
  }

  const tableBody = document.getElementById('vouchers-table-body');
  if (!tableBody) {
    renderVouchersLayout(mainContent);
  }

  renderTable();
  renderPagination();
};

/**
 * Render table body
 */
const renderTable = () => {
  const container = document.getElementById('vouchers-table-body');
  if (!container) return;

  const { items } = getState().vouchers;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="8" class="table-empty-state">Keine Gutscheine gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <tr class="table-row-clickable" data-row-id="${item.id}">
      <td>${item.name || '-'}</td>
      <td><code class="voucher-code">${item.code || '-'}</code></td>
      <td>${formatDiscount(item.discount_type, item.discount_value)}</td>
      <td>${renderLinkedItems(item.linked_services, 'service')}</td>
      <td>
          <div style="font-weight: 500;">${item.max_uses_total ? `${item.times_used || item.bookings?.length || 0}/${item.max_uses_total}` : '∞'}</div>
      </td>
      <td>${formatDate(item.valid_until)}</td>
      <td>
        <span class="status-badge status-${item.status}">${item.status}</span>
      </td>
      <td>
        <button class="action-btn" data-voucher-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

/**
 * Render pagination
 */
const renderPagination = () => {
  const container = document.getElementById('vouchers-pagination');
  if (!container) return;

  const { page, totalPages } = getState().vouchers;
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
 * Handle filter click
 */
const handleFilterClick = (filter) => {
  setNestedState('vouchers', { filter, page: 1 });

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');

  fetchVouchers();
};

/**
 * Handle page click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.vouchers.totalPages) return;

  setNestedState('vouchers', { page });
  fetchVouchers();
};

/**
 * Handle add voucher
 */
const handleAddVoucher = () => {
  openCreateVoucherModal(() => {
    renderVouchersPage();
  });
};

/**
 * Handle voucher action menu
 */
const handleVoucherAction = (voucherId, buttonElement) => {
  const state = getState();
  const voucher = state.vouchers.items.find(v => v.id === voucherId);
  if (!voucher) return;

  const actions = [
    {
      label: 'Details ansehen',
      iconName: 'eye',
      action: () => navigateWithParams('voucher-detail', { id: voucherId })
    },
    {
      label: 'Löschen',
      iconName: 'trash',
      action: () => {
        openDeleteConfirmModal({
          title: 'Gutschein löschen',
          subtitle: 'Möchtest du diesen Gutschein wirklich löschen?',
          entityName: voucher.name,
          entityType: 'Gutschein',
          onConfirm: async () => {
            try {
              await deleteEntity('vouchers', voucherId);
              invalidateCache('vouchers');
              await fetchVouchers();
            } catch (error) {
              console.error('Failed to delete voucher:', error);
              alert('Fehler beim Löschen des Gutscheins.');
            }
          }
        });
      },
      variant: 'danger'
    }
  ];

  createActionMenu({ trigger: buttonElement, actions });
};

const renderVouchersLayout = (mainContent) => {
  const state = getState();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
    const addBtn = createButton('+ Neuer Gutschein', handleAddVoucher, 'btn-primary');
    topBarActions.appendChild(addBtn);
  }

  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.vouchers.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
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
        <input type="text" class="search-input" placeholder="Gutscheine suchen..." id="voucher-search">
      </div>
      
      <button class="search-filter">Rabatt ▾</button>
      <button class="search-filter">Gültigkeit ▾</button>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name ${getIconString('arrow-up-down')}</th>
              <th>Code</th>
              <th>Rabatt ${getIconString('arrow-up-down')}</th>
              <th>Services</th>
              <th>Nutzung</th>
              <th>Gültig bis ${getIconString('arrow-up-down')}</th>
              <th>Status ${getIconString('arrow-up-down')}</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="vouchers-table-body">
            <tr><td colspan="8" class="table-empty-state">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="vouchers-pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function
 */
export const renderVouchersPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('ticket-percent')} Gutscheine</span>`;
  }

  // Add main action button to top bar (Clear initially during loading)
  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
  }

  renderPageLoading(mainContent);

  // Event delegation
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

    const actionBtn = e.target.closest('.action-btn[data-voucher-id]');
    if (actionBtn) {
      handleVoucherAction(actionBtn.dataset.voucherId, actionBtn);
      return;
    }

    // Row click -> detail page
    const row = e.target.closest('.table-row-clickable');
    if (row && !e.target.closest('.action-btn')) {
      navigateWithParams('voucher-detail', { id: row.dataset.rowId });
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);

  // Load data
  fetchVouchers();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
