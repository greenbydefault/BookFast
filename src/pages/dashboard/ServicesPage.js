/**
 * Services Page - Dashboard View
 */
import { getState, setNestedState, setState } from '../../lib/store.js';
import { fetchEntities, createEntity, updateEntity, deleteEntity } from '../../lib/dataLayer.js';
import { getIconString } from '../../components/Icons/Icon.js';

// Status options for filter tabs
const FILTER_TABS = [
    { id: 'all', label: 'Alle', icon: 'clipboard-list' },
    { id: 'active', label: 'Aktiv', icon: 'check-circle' },
    { id: 'draft', label: 'Entwurf', icon: 'edit-3' },
    { id: 'archived', label: 'Archiviert', icon: 'archive' }
];

/**
 * Fetch data using dataLayer
 */
const fetchData = async () => {
    const state = getState();
    const { filter, page, perPage } = state.services;

    const result = await fetchEntities('services', { filter, page, perPage });

    setNestedState('services', {
        items: result.items,
        totalPages: result.totalPages
    });

    renderTable();
};

/**
 * Render table
 */
const renderTable = () => {
    const container = document.getElementById('entity-table-body');
    if (!container) return;

    const { items } = getState().services;

    if (items.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="text-center p-4">Keine Services gefunden.</td></tr>`;
        return;
    }

    container.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.service_type || '-'}</td>
      <td>${item.price ? item.price + '€' : '-'}</td>
      <td>${item.duration_minutes ? item.duration_minutes + ' min' : '-'}</td>
      <td>
        <span class="status-badge status-${item.status}">${item.status}</span>
      </td>
      <td>
        <button class="action-btn" data-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

/**
 * Handle filter click
 */
const handleFilterClick = (filterId) => {
    setNestedState('services', { filter: filterId, page: 1 });
    renderServicesPage(); // Re-render to update tabs
};

/**
 * Main render function
 */
export const renderServicesPage = () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const state = getState().services;

    mainContent.innerHTML = `
    <div class="page-header">
      <div class="header-left">
          <div class="breadcrumb"><a href="#">Dashboard</a> / Services</div>
          <h1 class="page-title">Services</h1>
      </div>
      <div class="header-actions">
          <button class="btn-primary" id="btn-add-service">
              ${getIconString('plus')} Neuer Service
          </button>
      </div>
    </div>
    
    <div class="filter-tabs">
        ${FILTER_TABS.map(tab => `
            <button class="filter-tab ${state.filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
                ${getIconString(tab.icon)} ${tab.label}
            </button>
        `).join('')}
    </div>

    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Typ</th>
            <th>Preis</th>
            <th>Dauer</th>
            <th>Status</th>
            <th style="width: 50px"></th>
          </tr>
        </thead>
        <tbody id="entity-table-body">
          <tr><td colspan="6" class="text-center">Laden...</td></tr>
        </tbody>
      </table>
    </div>
  `;

    // Attach event listeners
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => handleFilterClick(btn.dataset.filter));
    });

    fetchData();
};
