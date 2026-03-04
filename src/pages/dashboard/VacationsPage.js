/**
 * Vacations Page - Urlaubsverwaltung
 * List vacations with scope (workspace, object, staff, service) and CRUD.
 */
import { getState } from '../../lib/store.js';
import { fetchEntities, deleteEntity } from '../../lib/dataLayer.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createButton } from '../../components/Button/Button.js';
import { openCreateVacationModal } from './modals/CreateVacationModal.js';
import { renderEmptyState } from '../../components/EmptyState/EmptyState.js';

const SCOPE_LABELS = {
    workspace: 'Ganzes Workspace',
    object: 'Objekt',
    staff: 'Mitarbeiter',
    service: 'Service',
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getScopeDisplay = (v) => {
    const scope = v.scope || 'workspace';
    if (scope === 'workspace') return SCOPE_LABELS.workspace;
    const ref = v.objects || v.staff || v.services;
    const name = (ref && typeof ref === 'object' && ref.name) ? ref.name : '';
    return `${SCOPE_LABELS[scope]}: ${name}`;
};

let listContainer = null;

const handleAddVacation = () => {
    openCreateVacationModal(() => renderVacationsPage());
};

const EMPTY_STATE_CONFIG = {
    title: 'Noch keine Urlaubszeiten vorhanden.',
    description: 'Urlaub blockiert Slots automatisch – für das ganze Workspace, einzelne Objekte, Mitarbeiter oder Services.',
    primaryLabel: '+ Urlaub anlegen',
    secondaryLabel: 'Mehr über Urlaub erfahren'
};

const renderVacationList = async () => {
    const mainContent = document.getElementById('main-content');
    const topBarActions = document.getElementById('top-bar-actions');
    if (!listContainer || !mainContent) return;

    try {
        const result = await fetchEntities('vacations', { forceRefresh: true });
        const vacations = result.items || [];

        if (vacations.length === 0) {
            renderEmptyState(mainContent, {
                ...EMPTY_STATE_CONFIG,
                onPrimaryClick: handleAddVacation,
                secondaryHref: '#'
            });
            if (topBarActions) topBarActions.innerHTML = '';
            return;
        }

        listContainer.innerHTML = vacations.map(v => `
            <tr class="clickable-row" data-vacation-id="${v.id}">
                <td>${formatDate(v.start_date)} – ${formatDate(v.end_date)}</td>
                <td>${getScopeDisplay(v)}</td>
                <td class="cell-muted">${v.description || '–'}</td>
                <td>
                    <button class="action-btn vacation-delete-btn" data-vacation-id="${v.id}" title="Löschen">${getIconString('trash')}</button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.error('Failed to load vacations:', err);
        listContainer.innerHTML = `<tr><td colspan="4" class="table-empty-state">Fehler beim Laden der Daten.</td></tr>`;
    }
};

export const renderVacationsPage = () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
    if (topBarBreadcrumb) {
        topBarBreadcrumb.innerHTML = `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('calender-days-date')} Urlaub</span>
        `;
    }

    const topBarActions = document.getElementById('top-bar-actions');
    if (topBarActions) {
        topBarActions.innerHTML = '';
        const addBtn = createButton('+ Urlaub anlegen', handleAddVacation, 'btn-primary');
        topBarActions.appendChild(addBtn);
    }

    mainContent.innerHTML = `
        <div class="zone-filters" style="margin-bottom: 1rem;">
            <p style="margin: 0; color: var(--color-stone-600); font-size: 0.95rem;">
                Urlaub blockiert Slots automatisch – für das ganze Workspace, einzelne Objekte, Mitarbeiter oder Services.
            </p>
        </div>
        <div class="data-table-wrapper">
            <div class="data-table-scroll">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Zeitraum</th>
                            <th>Gültig für</th>
                            <th>Beschreibung</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody id="vacations-table-body">
                        <tr><td colspan="4" class="table-empty-state">Lade Daten...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    listContainer = document.getElementById('vacations-table-body');
    renderVacationList();

    const handleMainContentClick = (e) => {
        const delBtn = e.target.closest('.vacation-delete-btn');
        if (delBtn) {
            e.stopPropagation();
            const id = delBtn.dataset.vacationId;
            if (!id || !confirm('Möchtest du diesen Urlaubszeitraum wirklich löschen?')) return;
            deleteEntity('vacations', id).then(() => renderVacationList()).catch(err => {
                console.error(err);
                alert('Fehler beim Löschen.');
            });
            return;
        }
    };
    mainContent.addEventListener('click', handleMainContentClick);

    return () => {
        if (mainContent) {
            mainContent.removeEventListener('click', handleMainContentClick);
        }
    };
};
