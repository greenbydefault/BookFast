/**
 * Addons Page - Addons Dashboard View
 * Following workflow: /create-dashboard-page
 */
import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities, deleteEntity, invalidateCache } from '../../lib/dataLayer.js';
import { navigateWithParams, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { createActionMenu } from '../../components/ActionMenu/ActionMenu.js';
import { openCreateAddonModal } from './modals/CreateAddonModal.js';
import { openDeleteConfirmModal } from './modals/DeleteConfirmModal.js';
import { renderLinkedItems, ENTITY_STATUS_TABS, initFilterToggle } from '../../lib/uiHelpers.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';

// Status options for filter tabs
const FILTER_TABS = ENTITY_STATUS_TABS;

const EMPTY_STATE_CONFIG = {
  title: 'Noch keine Add-ons vorhanden.',
  description: 'Erstellen Sie Ihr erstes Add-on – z. B. Frühstück, Parkplatz oder Wellness-Optionen. Preise und Verknüpfung mit Services können Sie jederzeit anpassen.',
  primaryLabel: '+ Add-on erstellen',
  secondaryLabel: 'Mehr über Add-ons erfahren'
};

/**
 * Fetch addons using dataLayer
 */
const fetchAddons = async () => {
  const mainContent = document.getElementById('main-content');
  const dataTableWrapper = document.querySelector('.data-table-wrapper');
  const topBarActions = document.getElementById('top-bar-actions');
  const state = getState();
  const { filter, page, perPage } = state.addons;

  const currentGen = getNavigationGeneration();

  const result = await fetchEntities('addons', { filter, page, perPage });

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  setNestedState('addons', {
    items: result.items,
    totalPages: result.totalPages
  });

  if (result.items.length === 0) {
    renderEmptyState(mainContent, {
      ...EMPTY_STATE_CONFIG,
      onPrimaryClick: handleAddAddon,
      secondaryHref: '#'
    });
    if (topBarActions) topBarActions.innerHTML = '';
    return;
  }

  const tableBody = document.getElementById('addons-table-body');
  if (!tableBody) {
    renderAddonsLayout(mainContent);
  }

  renderTable();
  renderPagination();
};

/**
 * Render table body
 */
const renderTable = () => {
  const container = document.getElementById('addons-table-body');
  if (!container) return;

  const { items } = getState().addons;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="table-empty-state">Keine Add-ons gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <tr class="table-row-clickable" data-row-id="${item.id}">
      <td>${item.name || 'Unbenannt'}</td>
      <td>${item.price} € / ${getPricingLabel(item.pricing_type)}</td>
      <td>
        <span class="status-badge status-${item.status}">${item.status || 'draft'}</span>
      </td>
      <td class="cell-muted">${item.description?.substring(0, 50) || '-'}${item.description?.length > 50 ? '...' : ''}</td>
      <td>${renderLinkedItems(item.linked_services, 'service')}</td>
      <td>
        <button class="action-btn" data-addon-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

const getPricingLabel = (type) => {
  const types = {
    'one_time': 'Einmalig',
    'per_night': 'Nacht',
    'per_person': 'Person',
    'per_ticket': 'Ticket'
  };
  return types[type] || type;
};

/**
 * Render pagination
 */
const renderPagination = () => {
  const container = document.getElementById('addons-pagination');
  if (!container) return;

  const { page, totalPages } = getState().addons;
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
  setNestedState('addons', { filter, page: 1 });

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');

  fetchAddons();
};

/**
 * Handle page click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.addons.totalPages) return;

  setNestedState('addons', { page });
  fetchAddons();
};

/**
 * Handle add addon
 */
const handleAddAddon = () => {
  openCreateAddonModal(() => {
    renderAddonsPage();
  });
};

/**
 * Handle addon action menu
 */
const handleAddonAction = (addonId, buttonElement) => {
  const state = getState();
  const addon = state.addons.items.find(a => a.id === addonId);
  if (!addon) return;

  const actions = [
    {
      label: 'Details ansehen',
      iconName: 'eye',
      action: () => navigateWithParams('addon-detail', { id: addonId })
    },
    {
      label: 'Löschen',
      iconName: 'trash',
      action: () => {
        openDeleteConfirmModal({
          title: 'Add-on löschen',
          subtitle: 'Möchtest du dieses Add-on wirklich löschen?',
          entityName: addon.name,
          entityType: 'Add-on',
          onConfirm: async () => {
            try {
              await deleteEntity('addons', addonId);
              invalidateCache('addons');
              await fetchAddons();
            } catch (error) {
              console.error('Failed to delete addon:', error);
              alert('Fehler beim Löschen des Add-ons.');
            }
          }
        });
      },
      variant: 'danger'
    }
  ];

  createActionMenu({ trigger: buttonElement, actions });
};

const renderAddonsLayout = (mainContent) => {
  const state = getState();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
    const addBtn = createButton('+ Neues Add-on', handleAddAddon, 'btn-primary');
    topBarActions.appendChild(addBtn);
  }

  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.addons.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
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
        <input type="text" class="search-input" placeholder="Addons suchen..." id="addon-search">
      </div>
      
      <button class="search-filter">Preis ▾</button>
      <button class="search-filter">Typ ▾</button>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name ${getIconString('arrow-up-down')}</th>
              <th>Preis ${getIconString('arrow-up-down')}</th>
              <th>Status ${getIconString('arrow-up-down')}</th>
              <th>Beschreibung</th>
              <th>Verknüpfte Services</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="addons-table-body">
            <tr><td colspan="6" class="table-empty-state">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="addons-pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function
 */
export const renderAddonsPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('blocks-integration')} Addons</span>`;
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

    const actionBtn = e.target.closest('.action-btn[data-addon-id]');
    if (actionBtn) {
      handleAddonAction(actionBtn.dataset.addonId, actionBtn);
      return;
    }

    // Row click -> detail page
    const row = e.target.closest('.table-row-clickable');
    if (row && !e.target.closest('.action-btn')) {
      navigateWithParams('addon-detail', { id: row.dataset.rowId });
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);

  // Load data
  fetchAddons();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
