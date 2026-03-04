/**
 * Staff Page - Mitarbeiter Dashboard View
 * Following workflow: /create-dashboard-page
 */
import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities, fetchEntityCount, deleteEntity, invalidateCache } from '../../lib/dataLayer.js';
import { navigateWithParams, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { createActionMenu } from '../../components/ActionMenu/ActionMenu.js';
import { openCreateStaffModal } from './modals/CreateStaffModal.js';
import { openDeleteConfirmModal } from './modals/DeleteConfirmModal.js';
import { renderLinkedItems, ENTITY_STATUS_TABS, initFilterToggle } from '../../lib/uiHelpers.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';

// Status options for filter tabs
const FILTER_TABS = ENTITY_STATUS_TABS;

const EMPTY_STATE_CONFIG = {
  title: 'Noch keine Mitarbeiter vorhanden.',
  description: 'Fügen Sie Ihre ersten Mitarbeiter hinzu und verknüpfen Sie sie mit Services. Arbeitszeiten und Verfügbarkeit können Sie jederzeit anpassen.',
  primaryLabel: '+ Mitarbeiter hinzufügen',
  secondaryLabel: 'Mehr über Mitarbeiter erfahren'
};

/**
 * Fetch staff using dataLayer
 */
const fetchStaff = async () => {
  const mainContent = document.getElementById('main-content');
  const dataTableWrapper = document.querySelector('.data-table-wrapper');
  const topBarActions = document.getElementById('top-bar-actions');
  const state = getState();
  const { filter, page, perPage } = state.staff;

  const currentGen = getNavigationGeneration();

  const result = await fetchEntities('staff', { filter, page, perPage });

  if (currentGen !== getNavigationGeneration()) {
    return;
  }

  setNestedState('staff', {
    items: result.items,
    totalPages: result.totalPages
  });

  if (result.items.length === 0) {
    let globalCount = 0;
    if (filter !== 'all') {
      globalCount = await fetchEntityCount('staff');
    }
    if (globalCount === 0) {
      renderEmptyState(mainContent, {
        ...EMPTY_STATE_CONFIG,
        onPrimaryClick: handleAddStaff,
        secondaryHref: '#'
      });
      if (topBarActions) topBarActions.innerHTML = '';
      return;
    }
  }

  const tableBody = document.getElementById('staff-table-body');
  if (!tableBody) {
    renderStaffLayout(mainContent);
  }

  renderTable();
  renderPagination();
};

/**
 * Render table body
 */
const renderTable = () => {
  const container = document.getElementById('staff-table-body');
  if (!container) return;

  const { items } = getState().staff;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="4" class="table-empty-state">Keine Mitarbeiter gefunden.</td></tr>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <tr class="table-row-clickable" data-row-id="${item.id}">
      <td>
        <div class="user-avatar-small" style="display:inline-block; margin-right:8px; vertical-align:middle; background:#eee; border-radius:50%; width:24px; height:24px; text-align:center; line-height:24px; font-size:12px;">
            ${item.name.charAt(0).toUpperCase()}
        </div>
        ${item.name || 'Unbenannt'}
      </td>
      <td>
        <span class="status-badge status-${item.status}">${item.status || 'draft'}</span>
      </td>
      <td class="cell-muted">
        ${Array.isArray(item.bookable_days) ? item.bookable_days.join(', ') : '-'}
      </td>
      <td>${renderLinkedItems(item.linked_services, 'service')}</td>
      <td>
        <button class="action-btn" data-staff-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

/**
 * Render pagination
 */
const renderPagination = () => {
  const container = document.getElementById('staff-pagination');
  if (!container) return;

  const { page, totalPages } = getState().staff;
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
  setNestedState('staff', { filter, page: 1 });

  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');

  fetchStaff();
};

/**
 * Handle page click
 */
const handlePageClick = (page) => {
  const state = getState();
  if (page < 1 || page > state.staff.totalPages) return;

  setNestedState('staff', { page });
  fetchStaff();
};

/**
 * Handle add staff
 */
const handleAddStaff = () => {
  openCreateStaffModal(() => {
    renderStaffPage();
  });
};

/**
 * Handle staff action menu
 */
const handleStaffAction = (staffId, buttonElement) => {
  const state = getState();
  const member = state.staff.items.find(s => s.id === staffId);
  if (!member) return;

  const actions = [
    {
      label: 'Details ansehen',
      iconName: 'eye',
      action: () => navigateWithParams('staff-detail', { id: staffId })
    },
    {
      label: 'Löschen',
      iconName: 'trash',
      action: () => {
        openDeleteConfirmModal({
          title: 'Mitarbeiter löschen',
          subtitle: 'Möchtest du diesen Mitarbeiter wirklich löschen?',
          entityName: member.name,
          entityType: 'Mitarbeiter',
          onConfirm: async () => {
            try {
              await deleteEntity('staff', staffId);
              invalidateCache('staff');
              await fetchStaff();
            } catch (error) {
              console.error('Failed to delete staff member:', error);
              alert('Fehler beim Löschen des Mitarbeiters.');
            }
          }
        });
      },
      variant: 'danger'
    }
  ];

  createActionMenu({ trigger: buttonElement, actions });
};

const renderStaffLayout = (mainContent) => {
  const state = getState();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) {
    topBarActions.innerHTML = '';
    const addBtn = createButton('+ Neuer Mitarbeiter', handleAddStaff, 'btn-primary');
    topBarActions.appendChild(addBtn);
  }

  mainContent.innerHTML = `
    <!-- Zone 1: Tabs -->
    <div class="zone-tabs">
      <div class="tabs-list">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.staff.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
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
        <input type="text" class="search-input" placeholder="Mitarbeiter suchen..." id="staff-search">
      </div>
      
      <button class="search-filter">Arbeitstage ▾</button>
      <button class="search-filter">Services ▾</button>
    </div>

    <!-- Zone 4: Content -->
    <div class="data-table-wrapper">
      <div class="data-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name ${getIconString('arrow-up-down')}</th>
              <th>Status ${getIconString('arrow-up-down')}</th>
              <th>Arbeitstage</th>
              <th>Services</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="staff-table-body">
            <tr><td colspan="5" class="table-empty-state">Laden...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" id="staff-pagination"></div>
    </div>
  `;
  initFilterToggle();
};

/**
 * Main render function
 */
export const renderStaffPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  // Update top bar breadcrumb
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('user')} Mitarbeiter</span>`;
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

    const actionBtn = e.target.closest('.action-btn[data-staff-id]');
    if (actionBtn) {
      handleStaffAction(actionBtn.dataset.staffId, actionBtn);
      return;
    }

    // Row click -> detail page
    const row = e.target.closest('.table-row-clickable');
    if (row && !e.target.closest('.action-btn')) {
      navigateWithParams('staff-detail', { id: row.dataset.rowId });
      return;
    }
  };
  mainContent.addEventListener('click', handleMainContentClick);

  // Load data
  fetchStaff();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
