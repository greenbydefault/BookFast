/**
 * Create Vacation Modal
 * Handles the logic and rendering for creating a new vacation period.
 * Scope: workspace (global), object, staff, or service.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { createEntity, fetchEntities } from '../../../lib/dataLayer.js';

const SCOPE_OPTIONS = [
    { value: 'workspace', label: 'Ganzes Workspace' },
    { value: 'object', label: 'Objekt' },
    { value: 'staff', label: 'Mitarbeiter' },
    { value: 'service', label: 'Service' },
];

const getInitialState = () => ({
    startDate: '',
    endDate: '',
    description: '',
    scope: 'workspace',
    objectId: '',
    staffId: '',
    serviceId: '',
});

export const openCreateVacationModal = async (onSuccess) => {
    let state = getInitialState();
    let modalInstance = null;
    let contentContainer = null;
    let objects = [];
    let staff = [];
    let services = [];

    try {
        const [objRes, staffRes, svcRes] = await Promise.all([
            fetchEntities('objects', { perPage: 100, filter: 'active' }),
            fetchEntities('staff', { perPage: 100, filter: 'active' }),
            fetchEntities('services', { perPage: 100, filter: 'active' }),
        ]);
        objects = objRes.items || [];
        staff = staffRes.items || [];
        services = svcRes.items || [];
    } catch (err) {
        console.error('Failed to load vacation options:', err);
    }

    const handleSave = async () => {
        if (!state.startDate || !state.endDate) {
            alert('Bitte wähle Start- und Enddatum aus.');
            return;
        }

        if (new Date(state.startDate) > new Date(state.endDate)) {
            alert('Das Enddatum muss nach dem Startdatum liegen.');
            return;
        }

        if (state.scope === 'object' && !state.objectId) {
            alert('Bitte wähle ein Objekt aus.');
            return;
        }
        if (state.scope === 'staff' && !state.staffId) {
            alert('Bitte wähle einen Mitarbeiter aus.');
            return;
        }
        if (state.scope === 'service' && !state.serviceId) {
            alert('Bitte wähle einen Service aus.');
            return;
        }

        const payload = {
            start_date: state.startDate,
            end_date: state.endDate,
            description: state.description || null,
            scope: state.scope,
            object_id: state.scope === 'object' ? state.objectId : null,
            staff_id: state.scope === 'staff' ? state.staffId : null,
            service_id: state.scope === 'service' ? state.serviceId : null,
        };

        try {
            await createEntity('vacations', payload);
            modalInstance.close();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create vacation:', error);
            alert('Fehler beim Speichern des Urlaubs.');
        }
    };

    const updateState = (key, value) => {
        state[key] = value;
        if (key === 'scope') {
            state.objectId = '';
            state.staffId = '';
            state.serviceId = '';
        }
    };

    const rerenderScopeSelect = () => {
        const wrap = contentContainer?.querySelector('#vacation-scope-select-wrap');
        if (!wrap) return;

        wrap.innerHTML = `
            <label class="modal-label" for="select-scope">Gültig für</label>
            <select class="modal-form-input" id="select-scope">
                ${SCOPE_OPTIONS.map(o => `<option value="${o.value}" ${state.scope === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
            </select>
        `;

        const scopeOpt = state.scope;
        if (scopeOpt === 'object') {
            wrap.innerHTML += `
                <label class="modal-label" for="select-object">Objekt</label>
                <select class="modal-form-input" id="select-object">
                    <option value="">— Objekt wählen —</option>
                    ${objects.map(o => `<option value="${o.id}" ${state.objectId === o.id ? 'selected' : ''}>${o.name || 'Unbenannt'}</option>`).join('')}
                </select>
            `;
        } else if (scopeOpt === 'staff') {
            wrap.innerHTML += `
                <label class="modal-label" for="select-staff">Mitarbeiter</label>
                <select class="modal-form-input" id="select-staff">
                    <option value="">— Mitarbeiter wählen —</option>
                    ${staff.map(s => `<option value="${s.id}" ${state.staffId === s.id ? 'selected' : ''}>${s.name || 'Unbenannt'}</option>`).join('')}
                </select>
            `;
        } else if (scopeOpt === 'service') {
            wrap.innerHTML += `
                <label class="modal-label" for="select-service">Service</label>
                <select class="modal-form-input" id="select-service">
                    <option value="">— Service wählen —</option>
                    ${services.map(s => `<option value="${s.id}" ${state.serviceId === s.id ? 'selected' : ''}>${s.name || 'Unbenannt'}</option>`).join('')}
                </select>
            `;
        }

        const scopeSelect = wrap.querySelector('#select-scope');
        const objSelect = wrap.querySelector('#select-object');
        const staffSelect = wrap.querySelector('#select-staff');
        const svcSelect = wrap.querySelector('#select-service');

        if (scopeSelect) scopeSelect.onchange = (e) => { updateState('scope', e.target.value); rerenderScopeSelect(); };
        if (objSelect) objSelect.onchange = (e) => updateState('objectId', e.target.value || '');
        if (staffSelect) staffSelect.onchange = (e) => updateState('staffId', e.target.value || '');
        if (svcSelect) svcSelect.onchange = (e) => updateState('serviceId', e.target.value || '');
    };

    const renderContent = () => {
        const div = document.createElement('div');
        div.className = 'modal-content-section';
        contentContainer = div;

        div.innerHTML = `
            <div class="modal-form-field">
            <div class="modal-row" id="vacation-scope-select-wrap"></div>
            </div>
            <div class="modal-form-field">
            <div class="modal-row">
                <div class="modal-label">${getIconString('calender-days-date')} Zeitraum</div>
                <div class="modal-controls">
                    <span class="label-inline">Von</span>
                    <input type="date" class="modal-form-input" id="input-start-date">
                    <span class="label-inline">Bis</span>
                    <input type="date" class="modal-form-input" id="input-end-date">
                </div>
            </div>
            </div>
            <div class="modal-form-field">
            <div class="modal-row">
                <div class="modal-label">Beschreibung <span class="modal-label-optional">(Optional)</span></div>
                <div class="modal-controls">
                    <input type="text" class="modal-form-input" placeholder="z. B. Betriebsferien" id="input-description">
                </div>
            </div>
            </div>
        `;

        setTimeout(() => {
            const startInput = div.querySelector('#input-start-date');
            const endInput = div.querySelector('#input-end-date');
            const descInput = div.querySelector('#input-description');

            if (startInput) startInput.onchange = (e) => updateState('startDate', e.target.value);
            if (endInput) endInput.onchange = (e) => updateState('endDate', e.target.value);
            if (descInput) descInput.oninput = (e) => updateState('description', e.target.value);

            rerenderScopeSelect();
        }, 0);

        return div;
    };

    const renderFooterRight = () => {
        const container = document.createElement('div');
        container.className = 'footer-actions-container';

        const cancelBtn = createButton('Abbrechen', () => modalInstance.close(), 'btn-secondary');
        const saveBtn = createActionButton({
            text: 'Speichern',
            loadingText: 'Wird gespeichert...',
            onClick: handleSave,
            className: 'btn-primary'
        });

        container.appendChild(cancelBtn);
        container.appendChild(saveBtn.element);
        return container;
    };

    modalInstance = createModal({
        title: 'Urlaub anlegen',
        subtitle: 'Definiere einen Zeitraum – für das ganze Workspace, ein Objekt, einen Mitarbeiter oder einen Service.',
        content: renderContent(),
        footerRight: renderFooterRight()
    });

    modalInstance.open();
};
