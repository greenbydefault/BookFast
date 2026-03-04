/**
 * Services Page - Dashboard View
 */
import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities, deleteEntity, invalidateCache } from '../../lib/dataLayer.js';
import { navigateWithParams, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { createActionMenu } from '../../components/ActionMenu/ActionMenu.js';
import { openCreateServiceModal } from './modals/CreateServiceModal.js';
import { openDeleteConfirmModal } from './modals/DeleteConfirmModal.js';
import { renderLinkedItems, ENTITY_STATUS_TABS, initFilterToggle } from '../../lib/uiHelpers.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';

// Status options for filter tabs
const FILTER_TABS = ENTITY_STATUS_TABS;

const EMPTY_STATE_CONFIG = {
  title: 'Noch keine Services vorhanden.',
  description: 'Erstellen Sie Ihren ersten Service, damit Gäste buchen können. Dauer, Preis und Verfügbarkeit können Sie später jederzeit anpassen.',
  primaryLabel: '+ Service erstellen',
  secondaryLabel: 'Mehr über Services erfahren'
};

/**
 * Fetch data using dataLayer
 */
const fetchServices = async () => {
  const mainContent = document.getElementById('main-content');
  const dataTableWrapper = document.querySelector('.data-table-wrapper');
  const topBarActions = document.getElementById('top-bar-actions');
  const state = getState();
  const { filter, page, perPage } = state.services;

  const currentGen = getNavigationGeneration();

  const result = await fetchEntities('services', { filter, page, perPage });

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  setNestedState('services', {
    items: result.items,
    totalPages: result.totalPages
  });

  if (result.items.length === 0) {
    renderEmptyState(mainContent, {
      ...EMPTY_STATE_CONFIG,
      onPrimaryClick: handleAddService,
      secondaryHref: '#'
    });
    if (topBarActions) topBarActions.innerHTML = '';
    return;
  }

  const tableBody = document.getElementById('services-table-body');
  if (!tableBody) {
    renderServicesLayout(mainContent);
  }

  renderTable();
  renderPagination();
};

/**
 * Render table body
 */
const renderTable = () => {
  const container = document.getElementById('services-table-body');
  if (!container) return;

  const { items } = getState().services;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="table-empty-state">Keine Services gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <tr class="table-row-clickable" data-row-id="${item.id}">
      <td>${item.name}</td>
      <td>${item.service_type || '-'}</td>
      <td>${item.price ? item.price + ' €' : '-'}</td>
      <td>${item.duration_minutes ? item.duration_minutes + ' min' : '-'}</td>
      <td>
        <span class="status-badge status-${item.status}">${item.status}</span>
      </td>
      <td>${renderLinkedItems(item.objects, 'object')}</td>
      <td>${renderLinkedItems(item.addons, 'addon')}</td>
      <td>${renderLinkedItems(item.staff, 'staff')}</td>
      <td>
        <button class="action-btn" data-service-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

/**
 * Render pagination
 */
const renderPagination = () => {
  const container = document.getElementById('services-pagination');
  if (!container) return;

  const { page, totalPages } = getState().services;
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
  setNestedState('services', { filter, page: 1 });

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');

  fetchServices();
};

/**
 * Handle page click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.services.totalPages) return;

  setNestedState('services', { page });
  fetchServices();
};

/**
 * Handle add service
 */
const handleAddService = () => {
  openCreateServiceModal(() => {
    renderServicesPage();
  });
};

/**
 * Handle service action menu
 */
const handleServiceAction = (serviceId, buttonElement) => {
  const state = getState();
  const service = state.services.items.find(s => s.id === serviceId);
  if (!service) return;

  const actions = [
    {
      label: 'Details ansehen',
      iconName: 'eye',
      action: () => navigateWithParams('service-detail', { id: serviceId })
    },
    {
      label: 'Löschen',
      iconName: 'trash',
      action: () => {
        openDeleteConfirmModal({
          title: 'Service löschen',
          subtitle: 'Möchtest du diesen Service wirklich löschen?',
          entityName: service.name,
          entityType: 'Service',
          onConfirm: async () => {
            try {
              await deleteEntity('services', serviceId);
              invalidateCache('services');
              await fetchServices();
            } catch (error) {
              console.error('Failed to delete service:', error);
              alert('Fehler beim Löschen des Services.');
            }
          }
        });
      },
      variant: 'danger'
    }
  ];

  createActionMenu({ trigger: buttonElement, actions });
};

const renderServicesLayout = (mainContent) => {
  const state = getState();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
    const addBtn = createButton('+ Neuer Service', handleAddService, 'btn-primary');
    topBarActions.appendChild(addBtn);
  }

  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.services.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
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
        <input type="text" class="search-input" placeholder="Services suchen..." id="service-search">
      </div>
      
      <button class="search-filter">Typ ▾</button>
      <button class="search-filter">Preis ▾</button>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name ${getIconString('arrow-up-down')}</th>
              <th>Typ ${getIconString('arrow-up-down')}</th>
              <th>Preis ${getIconString('arrow-up-down')}</th>
              <th>Dauer</th>
              <th>Status ${getIconString('arrow-up-down')}</th>
              <th>Objekte</th>
              <th>Addons</th>
              <th>Mitarbeiter</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="services-table-body">
            <tr><td colspan="9" class="table-empty-state">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="services-pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function
 */
export const renderServicesPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('list')} Services</span>`;
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

    const actionBtn = e.target.closest('.action-btn[data-service-id]');
    if (actionBtn) {
      handleServiceAction(actionBtn.dataset.serviceId, actionBtn);
      return;
    }

    // Row click -> detail page
    const row = e.target.closest('.table-row-clickable');
    if (row && !e.target.closest('.action-btn')) {
      navigateWithParams('service-detail', { id: row.dataset.rowId });
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);

  // Load data
  fetchServices();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
