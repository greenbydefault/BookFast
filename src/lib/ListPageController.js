import { getState, setNestedState } from './store.js';
import { fetchEntities, fetchEntityCount, deleteEntity, invalidateCache } from './dataLayer.js';
import { navigateWithParams, getNavigationGeneration } from './router.js';
import { getIconString } from '../components/Icons/Icon.js';
import { createButton } from '../components/Button/Button.js';
import { createActionMenu } from '../components/ActionMenu/ActionMenu.js';
import { openDeleteConfirmModal } from '../pages/dashboard/modals/DeleteConfirmModal.js';
import { renderEmptyState, renderPageLoading } from '../components/EmptyState/EmptyState.js';
import { ENTITY_STATUS_TABS, initFilterToggle } from './uiHelpers.js';

const ENTITY_META = {
  objects:  { breadcrumb: 'Objekte',      icon: 'package',            singular: 'Objekt',       detailRoute: 'object-detail',  addLabel: '+ Neues Objekt',      search: 'Objekte suchen...',      rowClass: 'clickable-row' },
  services: { breadcrumb: 'Services',     icon: 'list',               singular: 'Service',      detailRoute: 'service-detail', addLabel: '+ Neuer Service',     search: 'Services suchen...',     rowClass: 'table-row-clickable' },
  addons:   { breadcrumb: 'Addons',       icon: 'blocks-integration', singular: 'Add-on',       detailRoute: 'addon-detail',   addLabel: '+ Neues Add-on',      search: 'Addons suchen...',       rowClass: 'table-row-clickable' },
  staff:    { breadcrumb: 'Mitarbeiter',  icon: 'user',               singular: 'Mitarbeiter',  detailRoute: 'staff-detail',   addLabel: '+ Mitarbeiter hinzufügen', search: 'Mitarbeiter suchen...', rowClass: 'table-row-clickable' },
  vouchers: { breadcrumb: 'Gutscheine',   icon: 'ticket-percent',     singular: 'Gutschein',    detailRoute: 'voucher-detail', addLabel: '+ Neuer Gutschein',   search: 'Gutscheine suchen...',   rowClass: 'table-row-clickable' },
};

/**
 * @param {Object} config
 * @param {string} config.entity
 * @param {Array<{label: string, sortable?: boolean, render: (item: any) => string}>} config.columns
 * @param {(onSuccess: () => void) => void} config.openCreateModal
 * @param {Array<{id: string, label: string}>} [config.filterTabs]
 * @param {Object} [config.emptyState]
 * @param {string[]} [config.filterButtons]
 * @param {string} [config.rowClass]
 * @returns {() => (() => void) | undefined}
 */
export function createListPage(config) {
  const meta = ENTITY_META[config.entity];
  if (!meta) throw new Error(`Unknown entity: ${config.entity}`);

  const entity = config.entity;
  const filterTabs = config.filterTabs || ENTITY_STATUS_TABS;
  const rowClass = config.rowClass || meta.rowClass;
  const emptyState = config.emptyState || {
    title: `Noch keine ${meta.breadcrumb} vorhanden.`,
    description: `Erstellen Sie Ihr erstes Element.`,
    primaryLabel: meta.addLabel,
    secondaryLabel: `Mehr über ${meta.breadcrumb} erfahren`,
  };
  const filterButtons = config.filterButtons || [];
  const dataAttr = `data-${meta.singular.toLowerCase().replace(/[\s-]/g, '')}-id`;

  let fetchData;
  let renderPage;

  const handleAdd = () => {
    config.openCreateModal(() => renderPage());
  };

  fetchData = async () => {
    const mainContent = document.getElementById('main-content');
    const topBarActions = document.getElementById('top-bar-actions');
    const state = getState();
    const { filter, page, perPage } = state[entity];
    const currentGen = getNavigationGeneration();

    const result = await fetchEntities(entity, { filter, page, perPage });
    if (currentGen !== getNavigationGeneration()) return;

    setNestedState(entity, { items: result.items, totalPages: result.totalPages });

    if (result.items.length === 0) {
      let globalCount = 0;
      if (filter !== 'all') {
        globalCount = await fetchEntityCount(entity);
      }
      if (globalCount === 0) {
        renderEmptyState(mainContent, {
          ...emptyState,
          onPrimaryClick: handleAdd,
          secondaryHref: '#',
        });
        if (topBarActions) topBarActions.innerHTML = '';
        return;
      }
    }

    const tableBody = document.getElementById(`${entity}-table-body`);
    if (!tableBody) renderLayout(mainContent);

    renderTable();
    renderPagination();
  };

  const renderTable = () => {
    const container = document.getElementById(`${entity}-table-body`);
    if (!container) return;
    const { items } = getState()[entity];
    const colCount = config.columns.length + 1;

    if (items.length === 0) {
      container.innerHTML = `<tr><td colspan="${colCount}" class="table-empty-state">Keine ${meta.breadcrumb} gefunden.</td></tr>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <tr class="${rowClass}" data-row-id="${item.id}">
        ${config.columns.map(col => `<td>${col.render(item)}</td>`).join('')}
        <td><button class="action-btn" ${dataAttr}="${item.id}">⋮</button></td>
      </tr>
    `).join('');
  };

  const renderPagination = () => {
    const container = document.getElementById(`${entity}-pagination`);
    if (!container) return;
    const { page, totalPages } = getState()[entity];
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) pages.push(i);

    container.innerHTML = `
      <button class="pagination-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>Zurück</button>
      ${pages.map(p => `<button class="page-number ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`).join('')}
      <button class="pagination-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>Weiter</button>
    `;
  };

  const handleFilterClick = (filter) => {
    setNestedState(entity, { filter, page: 1 });
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.filter-tab[data-filter="${filter}"]`)?.classList.add('active');
    fetchData();
  };

  const handlePageClick = (page) => {
    const state = getState();
    if (page < 1 || page > state[entity].totalPages) return;
    setNestedState(entity, { page });
    fetchData();
  };

  const handleAction = (itemId, buttonElement) => {
    const item = getState()[entity].items.find(i => i.id === itemId);
    if (!item) return;

    createActionMenu({
      trigger: buttonElement,
      actions: [
        {
          label: 'Details ansehen',
          iconName: 'eye',
          action: () => navigateWithParams(meta.detailRoute, { id: itemId }),
        },
        {
          label: 'Löschen',
          iconName: 'trash',
          variant: 'danger',
          action: () => {
            openDeleteConfirmModal({
              title: `${meta.singular} löschen`,
              subtitle: `Möchtest du dieses ${meta.singular} wirklich löschen?`,
              entityName: item.name,
              entityType: meta.singular,
              onConfirm: async () => {
                try {
                  await deleteEntity(entity, itemId);
                  invalidateCache(entity);
                  await fetchData();
                } catch (error) {
                  console.error(`Failed to delete ${entity}:`, error);
                  alert(`Fehler beim Löschen.`);
                }
              },
            });
          },
        },
      ],
    });
  };

  const renderLayout = (mainContent) => {
    const state = getState();
    const topBarActions = document.getElementById('top-bar-actions');
    if (topBarActions) {
      topBarActions.innerHTML = '';
      topBarActions.appendChild(createButton(meta.addLabel, handleAdd, 'btn-primary'));
    }

    const headerCells = config.columns.map(col => {
      const sort = col.sortable !== false ? ` ${getIconString('arrow-up-down')}` : '';
      return `<th>${col.label}${sort}</th>`;
    }).join('') + '<th>Aktion</th>';

    const filterBtns = filterButtons.map(b => `<button class="search-filter">${b}</button>`).join('\n      ');

    mainContent.innerHTML = `
      <div class="zone-tabs">
        <div class="tabs-list">
          ${filterTabs.map(tab => `
            <button class="filter-tab ${state[entity].filter === tab.id ? 'active' : ''}" data-filter="${tab.id}">${tab.label}</button>
          `).join('')}
        </div>
        <div class="tabs-actions">
          <button class="filter-toggle-btn" id="filter-toggle-btn">${getIconString('funnel')} Filter</button>
        </div>
      </div>
      <div class="zone-filters">
        <div class="filter-search-wrapper">
          ${getIconString('search')}
          <input type="text" class="search-input" placeholder="${meta.search}" id="${entity}-search">
        </div>
        ${filterBtns}
      </div>
      <div class="data-table-wrapper">
        <div class="data-table-scroll">
          <table class="data-table">
            <thead><tr>${headerCells}</tr></thead>
            <tbody id="${entity}-table-body">
              <tr><td colspan="${config.columns.length + 1}" class="table-empty-state">Laden...</td></tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" id="${entity}-pagination"></div>
      </div>
    `;
    initFilterToggle();
  };

  renderPage = () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
    if (topBarBreadcrumb) {
      topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString(meta.icon)} ${meta.breadcrumb}</span>`;
    }

    const topBarActions = document.getElementById('top-bar-actions');
    if (topBarActions) topBarActions.innerHTML = '';

    renderPageLoading(mainContent);

    const handleMainContentClick = (e) => {
      const filterTab = e.target.closest('.filter-tab');
      if (filterTab) { handleFilterClick(filterTab.dataset.filter); return; }

      const pageBtn = e.target.closest('[data-page]');
      if (pageBtn) { handlePageClick(parseInt(pageBtn.dataset.page, 10)); return; }

      const actionBtn = e.target.closest(`.action-btn[${dataAttr}]`);
      if (actionBtn) {
        const id = actionBtn.getAttribute(dataAttr);
        handleAction(id, actionBtn);
        return;
      }

      const row = e.target.closest(`.${rowClass}[data-row-id]`);
      if (row && !e.target.closest('.action-btn')) {
        navigateWithParams(meta.detailRoute, { id: row.dataset.rowId });
        return;
      }
    };
    mainContent.addEventListener('click', handleMainContentClick);

    fetchData();

    return () => {
      if (mainContent) mainContent.removeEventListener('click', handleMainContentClick);
    };
  };

  return renderPage;
}
