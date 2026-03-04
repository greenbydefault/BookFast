/**
 * Object Modal (Create/Edit)
 * Handles the logic and rendering for creating or editing an object/site.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { createEntity, updateEntity } from '../../../lib/dataLayer.js';
import { supabase } from '../../../lib/supabaseClient.js';

// Default state for the form
const getInitialState = (existingObject = null) => {
    if (existingObject) {
        return {
            id: existingObject.id,
            name: existingObject.name || '',
            description: existingObject.description || '',
            capacity: existingObject.capacity || 0,
            bookableDays: existingObject.bookable_days || ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            timeFrom: existingObject.booking_window_start || '10:00',
            timeTo: existingObject.booking_window_end || '18:00',
            bufferBefore: existingObject.buffer_before_minutes || 0,
            bufferAfter: existingObject.buffer_after_minutes || 0,
            isDraft: existingObject.status === 'draft',
            linkedServices: existingObject.services || [],
            isEditMode: true,
            customHoursEnabled: Array.isArray(existingObject.custom_hours) && existingObject.custom_hours.length > 0,
            customHours: (existingObject.custom_hours || []).map((h, i) => ({
                id: `ch-${i}`,
                days: h.days || [],
                from: h.from || '10:00',
                to: h.to || '18:00'
            }))
        };
    }
    return {
        id: null,
        name: '',
        description: '',
        capacity: 0,
        bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        timeFrom: '10:00',
        timeTo: '18:00',
        bufferBefore: 0,
        bufferAfter: 0,
        isDraft: false,
        linkedServices: [],
        isEditMode: false,
        customHoursEnabled: false,
        customHours: []
    };
};

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

let chIdCounter = 0;
const generateChId = () => `ch-${++chIdCounter}`;

/**
 * Open the object modal for creating or editing
 * @param {Object|null} existingObject - Object to edit, or null for create mode
 * @param {Function} onSuccess - Callback after successful save
 */
export const openObjectModal = (existingObject, onSuccess) => {
    let state = getInitialState(existingObject);
    let modalInstance = null;
    let contentContainer = null;

    // --- Actions ---

    const handleSave = async () => {
        if (!state.name) {
            alert('Bitte geben Sie einen Namen ein.');
            throw new Error('Validierungsfehler');
        }

        const objectData = {
            name: state.name,
            description: state.description,
            capacity: state.capacity,
            status: state.isDraft ? 'draft' : 'active',
            bookable_days: state.bookableDays,
            booking_window_start: state.timeFrom,
            booking_window_end: state.timeTo,
            buffer_before_minutes: state.bufferBefore,
            buffer_after_minutes: state.bufferAfter,
            custom_hours: state.customHoursEnabled
                ? state.customHours.map(h => ({ days: h.days, from: h.from, to: h.to }))
                : null
        };

        if (state.isEditMode) {
            await updateEntity('objects', state.id, objectData);
        } else {
            await createEntity('objects', objectData);
        }

        modalInstance.close();
        if (onSuccess) onSuccess();
    };

    const toggleDay = (day) => {
        if (state.bookableDays.includes(day)) {
            state.bookableDays = state.bookableDays.filter(d => d !== day);
        } else {
            state.bookableDays = [...state.bookableDays, day];
        }
        updateDayToggles();
    };

    const updateState = (key, value) => {
        state[key] = value;
    };

    // --- Custom Hours Management ---

    const addCustomHoursRow = () => {
        state.customHours.push({
            id: generateChId(),
            days: [],
            from: '10:00',
            to: '18:00'
        });
        renderCustomHoursSection();
    };

    const removeCustomHoursRow = (rowId) => {
        state.customHours = state.customHours.filter(h => h.id !== rowId);
        renderCustomHoursSection();
    };

    const toggleCustomHourDay = (rowId, day) => {
        const row = state.customHours.find(h => h.id === rowId);
        if (!row) return;
        if (row.days.includes(day)) {
            row.days = row.days.filter(d => d !== day);
        } else {
            row.days = [...row.days, day];
        }
        renderCustomHoursSection();
    };

    const updateCustomHourTime = (rowId, field, value) => {
        const row = state.customHours.find(h => h.id === rowId);
        if (row) row[field] = value;
    };

    const renderCustomHoursSection = () => {
        const container = document.getElementById('custom-hours-container');
        if (!container) return;

        container.innerHTML = state.customHours.map(row => `
            <div class="custom-hours-row" data-row-id="${row.id}">
                <div class="custom-hours-row-top">
                    <div class="custom-hours-day-toggles">
                        ${DAYS.map(day => `
                            <button class="custom-hours-day-toggle ${row.days.includes(day) ? 'active' : ''}" 
                                    data-row-id="${row.id}" data-day="${day}" type="button">${day}</button>
                        `).join('')}
                    </div>
                    <button class="custom-hours-delete" data-row-id="${row.id}" type="button">
                        ${getIconString('trash')}
                    </button>
                </div>
                <div class="custom-hours-time-row">
                    <span class="label-inline">Von</span>
                    <input type="time" class="time-input" value="${row.from}" data-row-id="${row.id}" data-field="from">
                    <span class="label-inline">Bis</span>
                    <input type="time" class="time-input" value="${row.to}" data-row-id="${row.id}" data-field="to">
                </div>
            </div>
        `).join('');

        // Add button
        const addBtn = document.createElement('button');
        addBtn.className = 'custom-hours-add-btn';
        addBtn.type = 'button';
        addBtn.textContent = '+ Zeitfenster hinzufügen';
        addBtn.onclick = addCustomHoursRow;
        container.appendChild(addBtn);

        // Attach event listeners
        container.querySelectorAll('.custom-hours-day-toggle').forEach(btn => {
            btn.onclick = () => toggleCustomHourDay(btn.dataset.rowId, btn.dataset.day);
        });

        container.querySelectorAll('.custom-hours-delete').forEach(btn => {
            btn.onclick = () => removeCustomHoursRow(btn.dataset.rowId);
        });

        container.querySelectorAll('.custom-hours-time-row .time-input').forEach(input => {
            input.onchange = (e) => updateCustomHourTime(e.target.dataset.rowId, e.target.dataset.field, e.target.value);
        });
    };

    const removeLinkedService = async (serviceId) => {
        try {
            // Update the service to remove the object_id reference
            const { error } = await supabase
                .from('services')
                .update({ object_id: null })
                .eq('id', serviceId);

            if (error) throw error;

            // Update local state
            state.linkedServices = state.linkedServices.filter(s => s.id !== serviceId);
            renderLinkedServicesSection();
        } catch (error) {
            console.error('Failed to unlink service:', error);
            alert('Fehler beim Entfernen des Services.');
        }
    };

    // --- Render Linked Services ---
    const renderLinkedServicesSection = () => {
        const container = document.getElementById('linked-services-container');
        if (!container) return;

        if (state.linkedServices.length === 0) {
            container.innerHTML = `
                <div class="linked-services-empty">
                    Keine Services verknüpft
                </div>
            `;
            return;
        }

        container.innerHTML = state.linkedServices.map(service => `
            <div class="linked-service-item" data-service-id="${service.id}">
                <div class="linked-service-info">
                    ${getIconString('list')}
                    <span class="linked-service-name">${service.name}</span>
                </div>
                <button class="linked-service-delete" data-service-id="${service.id}" type="button">
                    ${getIconString('trash')}
                </button>
            </div>
        `).join('');

        // Attach delete listeners
        container.querySelectorAll('.linked-service-delete').forEach(btn => {
            btn.onclick = () => removeLinkedService(btn.dataset.serviceId);
        });
    };

    // --- UI Construction ---

    const renderContent = () => {
        const div = document.createElement('div');
        contentContainer = div;

        div.innerHTML = `
            <div class="modal-content-section">
                <input type="text" class="modal-form-input modal-input-large" 
                       placeholder="z. B. Villa Nord oder Hausboot Molchow"
                       value="${state.name}" id="input-name">
                
                <div class="modal-form-field">
                    <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
                    <textarea class="modal-form-input" placeholder="Optional: Was ist enthalten, was soll der Gast mitbringen, wichtige Hinweise ..." rows="3" id="input-desc">${state.description}</textarea>
                </div>
            </div>
            
            <div class="modal-content-section">
                <div class="modal-row">
                    <div class="modal-label">${getIconString('users-2')} Kapazität</div>
                    <div class="modal-controls">
                        <div class="number-control">
                            <input type="number" class="number-input" value="${state.capacity}" id="input-capacity">
                            <div class="number-btns">
                                <button class="number-btn" data-action="inc">${getIconString('arrow-up-down')}</button> 
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-row">
                    <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
                    <div class="modal-controls">
                        <div class="day-toggles">
                            ${DAYS.map(day => `
                                <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}" 
                                        data-day="${day}" type="button">${day}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="modal-row">
                    <div class="modal-label">${getIconString('clock')} Buchungszeitfenster</div>
                    <div class="modal-controls">
                        <div class="time-group">
                            <span>Von</span>
                            <input type="text" value="${state.timeFrom}" id="input-time-from">
                            <button class="time-remove" type="button">×</button>
                        </div>
                        <div class="time-group">
                            <span>Bis</span>
                            <input type="text" value="${state.timeTo}" id="input-time-to">
                            <button class="time-remove" type="button">×</button>
                        </div>
                    </div>
                </div>

                <div class="modal-row">
                    <div class="modal-label">${getIconString('date-cog')} Individuelle Zeiten pro Tag</div>
                    <div class="modal-controls">
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-custom-hours" ${state.customHoursEnabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div id="custom-hours-container" class="custom-hours-container" style="${state.customHoursEnabled ? '' : 'display: none;'}"></div>
            </div>
            
            <div class="modal-content-section">
                <div class="modal-row">
                    <div class="modal-label">${getIconString('clean')} Reinigungspuffer</div>
                    <div class="modal-controls modal-controls-column">
                        <div class="control-group-row">
                            <span class="text-small-muted">Davor</span>
                            <div class="number-control">
                                <input type="number" class="number-input" value="${state.bufferBefore}" id="input-buffer-before">
                            </div>
                            <span class="text-small">Minuten ⌄</span>
                        </div>
                        <div class="control-group-row">
                            <span class="text-small-muted">Danach</span>
                            <div class="number-control">
                                <input type="number" class="number-input" value="${state.bufferAfter}" id="input-buffer-after">
                            </div>
                            <span class="text-small">Minuten ⌄</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${state.isEditMode ? `
                <div class="modal-section-header">
                    <div class="modal-label">${getIconString('list')} Verknüpfte Services</div>
                </div>
                <div id="linked-services-container" class="linked-services-container"></div>
            ` : ''}
        `;

        // Attach Event Listeners
        const nameInput = div.querySelector('#input-name');
        nameInput.oninput = (e) => updateState('name', e.target.value);

        const descInput = div.querySelector('#input-desc');
        descInput.oninput = (e) => updateState('description', e.target.value);

        const capacityInput = div.querySelector('#input-capacity');
        capacityInput.oninput = (e) => updateState('capacity', parseInt(e.target.value) || 0);

        // Day toggles
        div.querySelectorAll('.day-toggle').forEach(btn => {
            btn.onclick = () => toggleDay(btn.dataset.day);
        });

        // Time inputs
        div.querySelector('#input-time-from').onchange = (e) => updateState('timeFrom', e.target.value);
        div.querySelector('#input-time-to').onchange = (e) => updateState('timeTo', e.target.value);

        div.querySelector('#input-buffer-before').onchange = (e) => updateState('bufferBefore', parseInt(e.target.value) || 0);
        div.querySelector('#input-buffer-after').onchange = (e) => updateState('bufferAfter', parseInt(e.target.value) || 0);

        // Custom Hours Toggle
        const customHoursToggle = div.querySelector('#toggle-custom-hours');
        customHoursToggle.onchange = (e) => {
            state.customHoursEnabled = e.target.checked;
            const container = div.querySelector('#custom-hours-container');
            if (container) {
                container.style.display = state.customHoursEnabled ? '' : 'none';
                if (state.customHoursEnabled && state.customHours.length === 0) {
                    addCustomHoursRow();
                } else {
                    renderCustomHoursSection();
                }
            }
        };

        return div;
    };

    const renderFooterLeft = () => {
        const div = document.createElement('div');
        div.className = 'draft-toggle';
        div.innerHTML = `${getIconString('folder')} Als Entwurf speichern`;
        if (state.isDraft) div.classList.add('active');
        div.onclick = () => {
            state.isDraft = !state.isDraft;
            div.classList.toggle('active', state.isDraft);
        };
        return div;
    };

    const renderFooterRight = () => {
        const container = document.createElement('div');
        container.className = 'footer-actions-container';

        const cancelBtn = createButton('Abbrechen', () => modalInstance.close(), 'btn-secondary');

        const saveBtn = createActionButton({
            text: state.isEditMode ? 'Objekt speichern' : 'Objekt anlegen',
            loadingText: state.isEditMode ? 'wird gespeichert...' : 'wird angelegt...',
            onClick: handleSave,
            className: 'btn-primary'
        });

        container.appendChild(cancelBtn);
        container.appendChild(saveBtn.element);
        return container;
    };

    const updateDayToggles = () => {
        const content = modalInstance.element.querySelector('.modal-content');
        if (content) {
            content.querySelectorAll('.day-toggle').forEach(btn => {
                if (state.bookableDays.includes(btn.dataset.day)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    };

    // Create Modal
    modalInstance = createModal({
        title: state.isEditMode ? 'Objekt bearbeiten' : 'Objekt Anlegen',
        subtitle: state.isEditMode ? 'Bearbeite die Objektdaten.' : 'Lege ein Objekt an.',
        content: renderContent(),
        footerLeft: renderFooterLeft(),
        footerRight: renderFooterRight(),
        onClose: () => { /* clean up */ }
    });

    modalInstance.open();

    // Render linked services and custom hours after modal is open
    if (state.isEditMode) {
        renderLinkedServicesSection();
    }
    if (state.customHoursEnabled) {
        renderCustomHoursSection();
    }
};

// Legacy export for backwards compatibility
export const openCreateObjectModal = (onSuccess) => openObjectModal(null, onSuccess);
