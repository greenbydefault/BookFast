/**
 * Objects Page - Objekte Dashboard View
 * Following workflow: /create-dashboard-page
 */
import { getState, setNestedState } from '../../lib/store.js';
import { fetchEntities, createEntity, updateEntity, deleteEntity } from '../../lib/dataLayer.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { openCreateObjectModal } from './modals/CreateObjectModal.js';

// Status options for filter tabs
const FILTER_TABS = [
  { id: 'all', label: 'Alle', icon: '📋' },
  { id: 'active', label: 'Aktiv', icon: '✓' },
  { id: 'draft', label: 'Entwurf', icon: '📝' },
  { id: 'inactive', label: 'Inaktiv', icon: '⏸' },
  { id: 'archived', label: 'Archiviert', icon: '📦' }
];

/**
 * Fetch objects using dataLayer
 */
const fetchObjects = async () => {
  const state = getState();
  const { filter, page, perPage } = state.objects;

  const result = await fetchEntities('objects', { filter, page, perPage });

  setNestedState('objects', {
    items: result.items,
    totalPages: result.totalPages
  });

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
    <tr>
      <td>
        ${getIconString('package')}
        ${item.name || 'Unbenannt'}
      </td>
      <td>${item.capacity || '-'}</td>
      <td>
        <span class="status-badge status-${item.status}">${item.status || 'draft'}</span>
      </td>
      <td class="cell-muted">${item.description?.substring(0, 50) || '-'}${item.description?.length > 50 ? '...' : ''}</td>
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
    fetchObjects();
  });
};

/**
 * Handle object action
 */
const handleObjectAction = (objectId) => {
  // TODO: Implement action menu (edit, delete, activate)
  const action = prompt('Aktion: edit / delete / activate');

  if (action === 'delete') {
    if (confirm('Objekt wirklich löschen?')) {
      deleteEntity('objects', objectId).then(fetchObjects);
    }
  } else if (action === 'activate') {
    updateEntity('objects', objectId, { status: 'active' }).then(fetchObjects);
  }
};

/**
 * Main render function
 */
export const renderObjectsPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const state = getState();

  mainContent.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb"><a href="#">Home</a> / Objekte</div>
      <h1 class="page-title">Objekte</h1>
      
      <div class="filter-tabs">
        ${FILTER_TABS.map(tab => `
          <button class="filter-tab ${state.objects.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
            ${tab.icon} ${tab.label}
          </button>
        `).join('')}
        
        <div class="header-actions">
          <div id="add-object-btn"></div>
        </div>
      </div>
    </div>

    <div class="search-bar">
      🔍
      <input type="text" class="search-input" placeholder="Objekte suchen..." id="object-search">
    </div>

    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>${getIconString('package')} Name ⇅</th>
            <th>Kapazität ⇅</th>
            <th>Status ⇅</th>
            <th>Beschreibung</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody id="objects-table-body">
          <tr><td colspan="5" class="table-empty-state">Laden...</td></tr>
        </tbody>
      </table>
      <div class="pagination" id="objects-pagination"></div>
    </div>
  `;

  // Add button
  const addBtn = createButton('+ Neues Objekt', handleAddObject, 'btn-primary');
  document.querySelector('#add-object-btn').appendChild(addBtn);

  // Event delegation
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

    const actionBtn = e.target.closest('[data-object-id]');
    if (actionBtn) {
      handleObjectAction(actionBtn.dataset.objectId);
      return;
    }
  });

  // Load data
  fetchObjects();
};
