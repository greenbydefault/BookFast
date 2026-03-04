/**
 * Objects Page - Objekte Dashboard View
 * Following workflow: /create-dashboard-page
 */
import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities, fetchEntityCount, deleteEntity, invalidateCache } from '../../lib/dataLayer.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { createActionMenu } from '../../components/ActionMenu/ActionMenu.js';
import { openCreateObjectModal } from './modals/CreateObjectModal.js';
import { openDeleteConfirmModal } from './modals/DeleteConfirmModal.js';
import { renderLinkedItems, ENTITY_STATUS_TABS, initFilterToggle } from '../../lib/uiHelpers.js';
import { navigateWithParams, getNavigationGeneration } from '../../lib/router.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';

// Status options for filter tabs
const FILTER_TABS = ENTITY_STATUS_TABS;

const EMPTY_STATE_CONFIG = {
  title: 'Noch keine Objekte vorhanden.',
  description: 'Erstellen Sie Ihr erstes Objekt, damit Gäste buchen können. Kapazität, Ausstattung und verknüpfte Services können Sie später anpassen.',
  primaryLabel: '+ Objekt erstellen',
  secondaryLabel: 'Mehr über Objekte erfahren'
};

/**
 * Fetch objects using dataLayer
 */
const fetchObjects = async () => {
  const mainContent = document.getElementById('main-content');
  const dataTableWrapper = document.querySelector('.data-table-wrapper');
  const topBarActions = document.getElementById('top-bar-actions');
  const state = getState();
  const { filter, page, perPage } = state.objects;

  const currentGen = getNavigationGeneration();

  const result = await fetchEntities('objects', { filter, page, perPage });

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  setNestedState('objects', {
    items: result.items,
    totalPages: result.totalPages
  });

  if (result.items.length === 0) {
    let globalCount = 0;
    if (filter !== 'all') {
      globalCount = await fetchEntityCount('objects');
    }
    if (globalCount === 0) {
      renderEmptyState(mainContent, {
        ...EMPTY_STATE_CONFIG,
        onPrimaryClick: handleAddObject,
        secondaryHref: '#'
      });
      if (topBarActions) topBarActions.innerHTML = '';
      return;
    }
  }

  const tableBody = document.getElementById('objects-table-body');
  if (!tableBody) {
    renderObjectsLayout(mainContent);
  }

  renderTable();
  renderPagination();
};

/**
 * Render table body
 */
const renderTable = () => {
  const container = document.getElementById('objects-table-body');
  if (!container) return;

  const { items } = getState().objects;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="table-empty-state">Keine Objekte gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <tr class="clickable-row" data-row-id="${item.id}">
      <td>${item.name || 'Unbenannt'}</td>
      <td>${item.capacity || '-'}</td>
      <td>
        <span class="status-badge status-${item.status}">${item.status || 'draft'}</span>
      </td>
      <td class="cell-muted">${item.description?.substring(0, 50) || '-'}${item.description?.length > 50 ? '...' : ''}</td>
      <td>${renderLinkedItems(item.services, 'service')}</td>
      <td>
        <button class="action-btn" data-object-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

/**
 * Render pagination
 */
const renderPagination = () => {
  const container = document.getElementById('objects-pagination');
  if (!container) return;

  const { page, totalPages } = getState().objects;
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
  setNestedState('objects', { filter, page: 1 });

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');

  fetchObjects();
};

/**
 * Handle page click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.objects.totalPages) return;

  setNestedState('objects', { page });
  fetchObjects();
};

/**
 * Handle add object
 */
const handleAddObject = () => {
  openCreateObjectModal(() => {
    renderObjectsPage();
  });
};

/**
 * Handle object action menu
 */
const handleObjectAction = (objectId, buttonElement) => {
  const state = getState();
  const object = state.objects.items.find(o => o.id === objectId);

  if (!object) return;

  const actions = [
    {
      label: 'Bearbeiten',
      iconName: 'pencil',
      action: () => {
        navigateWithParams('object-detail', { id: objectId });
      }
    },
    {
      label: 'Löschen',
      iconName: 'trash',
      action: () => {
        openDeleteConfirmModal({
          title: 'Objekt löschen',
          subtitle: 'Möchtest du dieses Objekt wirklich löschen?',
          entityName: object.name,
          entityType: 'Objekt',
          onConfirm: async () => {
            try {
              await deleteEntity('objects', objectId);
              invalidateCache('objects');
              await fetchObjects();
            } catch (error) {
              console.error('Failed to delete object:', error);
              alert('Fehler beim Löschen des Objekts.');
            }
          }
        });
      },
      variant: 'danger'
    }
  ];

  createActionMenu({
    trigger: buttonElement,
    actions
  });
};

const renderObjectsLayout = (mainContent) => {
  const state = getState();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
    const addBtn = createButton('+ Neues Objekt', handleAddObject, 'btn-primary');
    topBarActions.appendChild(addBtn);
  }

  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.objects.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
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
        <input type="text" class="search-input" placeholder="Objekte suchen..." id="object-search">
      </div>
      
      <button class="search-filter">Kapazität ▾</button>
      <button class="search-filter">Status ▾</button>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name ${getIconString('arrow-up-down')}</th>
              <th>Kapazität ${getIconString('arrow-up-down')}</th>
              <th>Status ${getIconString('arrow-up-down')}</th>
              <th>Beschreibung</th>
              <th>Verknüpfte Services</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="objects-table-body">
            <tr><td colspan="6" class="table-empty-state">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="objects-pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function
 */
export const renderObjectsPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('package')} Objekte</span>`;
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

    const actionBtn = e.target.closest('[data-object-id]');
    if (actionBtn) {
      handleObjectAction(actionBtn.dataset.objectId, actionBtn);
      return;
    }

    // Row click → navigate to detail page
    const row = e.target.closest('.clickable-row[data-row-id]');
    if (row) {
      navigateWithParams('object-detail', { id: row.dataset.rowId });
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);

  // Load data
  fetchObjects();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
