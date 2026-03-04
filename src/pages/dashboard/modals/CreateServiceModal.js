/**
 * Create Service Modal
 * Handles the logic and rendering for creating a new service.
 * Tab-based UI for different service types: Stunden, Tagesmiete, Übernachtung
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { createEntity, fetchEntities } from '../../../lib/dataLayer.js';
import { supabase } from '../../../lib/supabaseClient.js';
import { createMultiSelectTags } from '../../../components/MultiSelectTags/MultiSelectTags.js';

// Tab definitions
const SERVICE_TABS = [
    { id: 'hourly', label: 'Stunden' },
    { id: 'daily', label: 'Tagesmiete' },
    { id: 'overnight', label: 'Übernachtung' }
];

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

// Price unit labels per service type
const PRICE_UNITS = {
    hourly: 'Stunde',
    daily: 'Tag',
    overnight: 'Nacht'
};

// Advance notice units per service type
const ADVANCE_UNITS = {
    hourly: 'Stunden',
    daily: 'Tage',
    overnight: 'Tage'
};

let chIdCounter = 0;
const generateChId = () => `ch-svc-${++chIdCounter}`;

// Default state for the form
const getInitialState = () => ({
    // Common fields
    name: '',
    description: '',
    serviceType: 'hourly',
    price: 120,
    objectIds: [], // Array for multi-select
    staffIds: [], // Array for multi-select
    bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    isDraft: false,
    availableObjects: [],
    availableStaff: [],

    // Duration (hourly only)
    durationHours: 4,

    // Booking window (hourly & daily)
    bookingWindowStart: '10:00',
    bookingWindowEnd: '16:30',

    // CheckIn/Out (overnight only)
    checkinStart: '16:00',
    checkoutEnd: '10:30',

    // Advance notice
    minAdvance: 4,

    // Toggles
    fixedStartTimesEnabled: false,
    minNightsEnabled: false,
    minNights: 2,

    // Cleaning
    cleaningFee: 40,
    bufferBefore: 120,
    bufferAfter: 60,
    bufferUnit: 'Minuten',

    // Custom hours
    customHoursEnabled: false,
    customHours: []
});

export const openCreateServiceModal = async (onSuccess) => {
    let state = getInitialState();
    let modalInstance = null;
    let contentContainer = null;
    let objectMultiSelect = null;

    // Fetch available objects and staff
    try {
        const [objResult, staffResult] = await Promise.all([
            fetchEntities('objects', { perPage: 100, filter: 'active' }),
            fetchEntities('staff', { perPage: 100, filter: 'active' })
        ]);
        state.availableObjects = objResult.items || [];
        state.availableStaff = staffResult.items || [];
    } catch (error) {
        console.error('Failed to load data for service creation:', error);
        alert('Fehler beim Laden der Daten.');
        return;
    }

    if (state.availableObjects.length === 0) {
        alert('Bitte erstelle zuerst ein Objekt, bevor du einen Service anlegst.');
        return;
    }

    // --- Actions ---

    const handleSave = async () => {
        if (!state.name) {
            alert('Bitte geben Sie einen Namen ein.');
            throw new Error('Validierungsfehler');
        }
        if (state.objectIds.length === 0) {
            alert('Bitte wählen Sie mindestens ein Objekt aus.');
            throw new Error('Validierungsfehler');
        }

        // Build the data object, only including relevant fields
        const data = {
            name: state.name,
            description: state.description,
            service_type: state.serviceType,
            price: state.price,
            object_id: state.objectIds[0], // Using first selected object (schema limitation)
            bookable_days: state.bookableDays,
            cleaning_fee: state.cleaningFee,
            buffer_before_minutes: state.bufferBefore,
            buffer_after_minutes: state.bufferAfter,
            status: state.isDraft ? 'draft' : 'active'
        };

        // Type-specific fields
        if (state.serviceType === 'hourly') {
            data.duration_minutes = state.durationHours * 60;
            data.booking_window_start = state.bookingWindowStart;
            data.booking_window_end = state.bookingWindowEnd;
            data.min_advance_hours = state.minAdvance;
            // Don't send fixed_start_times as empty array - causes boolean error
        } else if (state.serviceType === 'daily') {
            data.booking_window_start = state.bookingWindowStart;
            data.booking_window_end = state.bookingWindowEnd;
            data.min_advance_hours = state.minAdvance * 24;
        } else if (state.serviceType === 'overnight') {
            data.checkin_start = state.checkinStart;
            data.checkout_end = state.checkoutEnd;
            data.min_advance_hours = state.minAdvance * 24;
            if (state.minNightsEnabled) {
                data.min_nights = state.minNights;
            }
        }

        // Custom hours (only for hourly & daily)
        if (state.serviceType !== 'overnight' && state.customHoursEnabled && state.customHours.length > 0) {
            data.custom_hours = state.customHours.map(h => ({ days: h.days, from: h.from, to: h.to }));
        } else {
            data.custom_hours = null;
        }

        const newService = await createEntity('services', data);

        // Save Staff Associations
        if (state.staffIds.length > 0 && newService?.id) {
            const staffAssociations = state.staffIds.map(staffId => ({
                service_id: newService.id,
                staff_id: staffId
            }));

            const { error: staffError } = await supabase
                .from('staff_services')
                .insert(staffAssociations);

            if (staffError) {
                console.error('Error saving staff associations:', staffError);
                // Non-fatal, but we should probably alert or log
            }
        }

        modalInstance.close();
        if (onSuccess) onSuccess();
    };

    /** Read current DOM input values back into state so they survive tab switches */
    const captureCurrentValues = () => {
        if (!contentContainer) return;
        const q = (sel) => contentContainer.querySelector(sel);
        const qVal = (sel) => q(sel)?.value ?? '';

        // Shared fields
        const name = qVal('#input-name');
        if (name) state.name = name;
        const desc = qVal('#input-desc');
        if (desc !== undefined) state.description = desc;

        const price = parseFloat(qVal('#input-price'));
        if (!isNaN(price)) state.price = price;

        const cleaningFee = parseFloat(qVal('#input-cleaning-fee'));
        if (!isNaN(cleaningFee)) state.cleaningFee = cleaningFee;

        const advance = parseInt(qVal('#input-advance'), 10);
        if (!isNaN(advance)) state.minAdvance = advance;

        const bufBefore = parseInt(qVal('#input-buffer-before'), 10);
        if (!isNaN(bufBefore)) state.bufferBefore = bufBefore;

        const bufAfter = parseInt(qVal('#input-buffer-after'), 10);
        if (!isNaN(bufAfter)) state.bufferAfter = bufAfter;

        // Bookable days from toggle state
        const activeDays = [...contentContainer.querySelectorAll('.day-toggle.active')].map(b => b.dataset.day);
        if (activeDays.length > 0 || contentContainer.querySelector('.day-toggle')) {
            state.bookableDays = activeDays;
        }

        // Type-specific fields
        if (state.serviceType === 'hourly') {
            const dur = parseInt(qVal('#input-duration'), 10);
            if (!isNaN(dur)) state.durationHours = dur;
            const ts = qVal('#input-time-start');
            if (ts) state.bookingWindowStart = ts;
            const te = qVal('#input-time-end');
            if (te) state.bookingWindowEnd = te;
        } else if (state.serviceType === 'daily') {
            const ts = qVal('#input-time-start');
            if (ts) state.bookingWindowStart = ts;
            const te = qVal('#input-time-end');
            if (te) state.bookingWindowEnd = te;
        } else if (state.serviceType === 'overnight') {
            const ci = qVal('#input-time-start');
            if (ci) state.checkinStart = ci;
            const co = qVal('#input-time-end');
            if (co) state.checkoutEnd = co;
        }
    };

    const DEFAULT_PRICES = { hourly: 120, daily: 560, overnight: 140 };

    const switchTab = (tabId) => {
        // Capture current values before destroying DOM
        captureCurrentValues();

        const oldType = state.serviceType;
        state.serviceType = tabId;

        // Only set default price if the user hasn't changed it from the previous type's default
        if (state.price === DEFAULT_PRICES[oldType]) {
            state.price = DEFAULT_PRICES[tabId];
        }

        // Reset custom hours when switching to overnight
        if (tabId === 'overnight') {
            state.customHoursEnabled = false;
            state.customHours = [];
        }
        renderFormContent();
    };

    const toggleDay = (day) => {
        if (state.bookableDays.includes(day)) {
            state.bookableDays = state.bookableDays.filter(d => d !== day);
        } else {
            state.bookableDays = [...state.bookableDays, day];
        }
        renderFormContent();
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
        renderCustomHoursInModal();
    };

    const removeCustomHoursRow = (rowId) => {
        state.customHours = state.customHours.filter(h => h.id !== rowId);
        renderCustomHoursInModal();
    };

    const toggleCustomHourDay = (rowId, day) => {
        const row = state.customHours.find(h => h.id === rowId);
        if (!row) return;
        if (row.days.includes(day)) {
            row.days = row.days.filter(d => d !== day);
        } else {
            row.days = [...row.days, day];
        }
        renderCustomHoursInModal();
    };

    const updateCustomHourTime = (rowId, field, value) => {
        const row = state.customHours.find(h => h.id === rowId);
        if (row) row[field] = value;
    };

    const renderCustomHoursInModal = () => {
        const container = contentContainer?.querySelector('#custom-hours-container');
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

    // --- Render Form Content based on tab ---
    const renderFormContent = () => {
        if (!contentContainer) return;

        const type = state.serviceType;
        const priceUnit = PRICE_UNITS[type];
        const advanceUnit = ADVANCE_UNITS[type];
        const showCustomHours = type !== 'overnight';

        contentContainer.innerHTML = `
            <!-- Tabs -->
            <div class="modal-tabs">
                ${SERVICE_TABS.map(tab => `
                    <button class="modal-tab ${state.serviceType === tab.id ? 'active' : ''}" 
                            data-tab="${tab.id}" type="button">${tab.label}</button>
                `).join('')}
            </div>

            <!-- SECTION: Basic Info -->
            <div class="modal-content-section">
                <!-- Name Input -->
                <div class="modal-form-field">
                    <input type="text" class="modal-form-input modal-input-large" 
                           placeholder="z. B. Massage (60 Min.) oder Hausboot (4 Std.)"
                           value="${state.name}" id="input-name">
                </div>
                
                <!-- Description -->
                <div class="modal-form-field">
                    <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
                    <textarea class="modal-form-input modal-textarea" placeholder="Optional: Was ist enthalten, was soll der Gast mitbringen, wichtige Hinweise ..." rows="2" id="input-desc">${state.description}</textarea>
                </div>

                <!-- Object Multi-Select -->
                <div class="modal-form-field" id="object-multi-select-container"></div>
                
                <!-- Staff Multi-Select -->
                <div class="modal-form-field" id="staff-multi-select-container"></div>
            </div>

            <!-- SECTION: Pricing & Time Structure -->
            <div class="modal-content-section">
                <!-- Price with unit -->
                <div class="modal-row">
                    <div class="modal-label">${getIconString('coins')} Preis</div>
                    <div class="modal-controls addon-price-controls">
                        <input type="number" class="price-amount-input" value="${state.price}" id="input-price" step="1">
                        <span class="price-currency">€</span>
                        <select class="price-type-select" id="input-price-unit" disabled>
                            <option value="${priceUnit}">${priceUnit}</option>
                        </select>
                    </div>
                </div>

                <!-- Duration (hourly only) -->
                ${type === 'hourly' ? `
                    <div class="modal-row">
                        <div class="modal-label">${getIconString('clock')} Dauer</div>
                        <div class="modal-controls addon-price-controls">
                            <input type="number" class="price-amount-input" value="${state.durationHours}" id="input-duration" min="1">
                            <select class="price-type-select" id="input-duration-unit">
                                <option value="Stunden">Stunden</option>
                            </select>
                        </div>
                    </div>
                ` : ''}

                <!-- Booking Window / CheckIn-Out -->
                <div class="modal-row">
                    <div class="modal-label">${getIconString('clock')} ${type === 'overnight' ? 'CheckIn/Out' : 'Buchungszeitfenster'}</div>
                    <div class="modal-controls">
                        <span class="label-inline">Von</span>
                        <div class="time-input-group">
                            <input type="time" class="time-input" value="${type === 'overnight' ? state.checkinStart : state.bookingWindowStart}" id="input-time-start">
                            <button class="time-clear" type="button" data-target="input-time-start">×</button>
                        </div>
                        <span class="label-inline">Bis</span>
                        <div class="time-input-group">
                            <input type="time" class="time-input" value="${type === 'overnight' ? state.checkoutEnd : state.bookingWindowEnd}" id="input-time-end">
                            <button class="time-clear" type="button" data-target="input-time-end">×</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-content-section">
                ${showCustomHours ? `
                <!-- Custom Hours Toggle -->
                <div class="custom-hours-toggle-row">
                    <span class="custom-hours-toggle-label">${getIconString('clock')} Individuelle Zeiten pro Tag</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggle-custom-hours" ${state.customHoursEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Custom Hours Container -->
                <div id="custom-hours-container" class="custom-hours-container" style="${state.customHoursEnabled ? '' : 'display: none;'}"></div>
                ` : ''}

                <!-- Bookable Days -->
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

                <!-- Minimum Advance Notice -->
                <div class="modal-row">
                    <div class="modal-label">${getIconString('clock')} Mindestvorlauf</div>
                    <div class="modal-controls addon-price-controls">
                        <input type="number" class="price-amount-input" value="${state.minAdvance}" id="input-advance" min="0">
                        <select class="price-type-select" id="input-advance-unit">
                            <option value="${advanceUnit}">${advanceUnit}</option>
                        </select>
                    </div>
                </div>

                <!-- Fixed Start Times Toggle (hourly only) -->
                ${type === 'hourly' ? `
                    <div class="modal-row">
                        <div class="modal-label">${getIconString('clock')} Feste Startzeiten aktivieren <span class="help-icon">?</span></div>
                        <div class="modal-controls">
                            <label class="toggle-switch">
                                <input type="checkbox" id="toggle-fixed-times" ${state.fixedStartTimesEnabled ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                ` : ''}

                <!-- Min Nights Toggle (overnight only) -->
                ${type === 'overnight' ? `
                    <div class="modal-row">
                        <div class="modal-label">${getIconString('bed')} Mindest Anzahl Übernachtungen</div>
                        <div class="modal-controls">
                            <label class="toggle-switch">
                                <input type="checkbox" id="toggle-min-nights" ${state.minNightsEnabled ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    ${state.minNightsEnabled ? `
                        <div class="modal-row toggle-sub-row">
                            <div class="modal-label"></div>
                            <div class="modal-controls addon-price-controls">
                                <input type="number" class="price-amount-input" value="${state.minNights}" id="input-min-nights" min="1">
                                <span class="price-currency">Nächte</span>
                            </div>
                        </div>
                    ` : ''}
                ` : ''}
            </div>

            <!-- Cleaning Fee & Buffers Section -->
            <div class="modal-content-section">
                <!-- Cleaning Fee -->
                <div class="modal-row">
                    <div class="modal-label">${getIconString('sparkles')} Reinigungsgebühr</div>
                    <div class="modal-controls addon-price-controls">
                        <input type="number" class="price-amount-input" value="${state.cleaningFee}" id="input-cleaning-fee" step="1">
                        <span class="price-currency">€</span>
                    </div>
                </div>

                <!-- Buffer Times -->
                <div class="modal-row modal-row-stacked">
                    <div class="modal-label">${getIconString('clock')} Reinigungspuffer</div>
                    <div class="modal-controls modal-controls-stacked">
                        <div class="buffer-row">
                            <span class="label-inline">Davor</span>
                            <input type="number" class="price-amount-input" value="${state.bufferBefore}" id="input-buffer-before" min="0">
                            <select class="price-type-select">
                                <option value="Minuten">Minuten</option>
                            </select>
                        </div>
                        <div class="buffer-row">
                            <span class="label-inline">Danach</span>
                            <input type="number" class="price-amount-input" value="${state.bufferAfter}" id="input-buffer-after" min="0">
                            <select class="price-type-select">
                                <option value="Minuten">Minuten</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create and insert the multi-select component for objects
        objectMultiSelect = createMultiSelectTags({
            label: 'Objekt',
            icon: 'home',
            placeholder: 'Objekt auswählen...',
            options: state.availableObjects.map(obj => ({
                value: obj.id,
                label: obj.name
            })),
            selectedValues: state.objectIds,
            onChange: (selectedValues) => {
                state.objectIds = selectedValues;
            }
        });

        const multiSelectContainer = contentContainer.querySelector('#object-multi-select-container');
        if (multiSelectContainer) {
            multiSelectContainer.appendChild(objectMultiSelect.element);
        }

        // Create and insert the multi-select component for staff
        const staffMultiSelect = createMultiSelectTags({
            label: 'Mitarbeiter',
            icon: 'user-circle',
            placeholder: 'Mitarbeiter auswählen...',
            options: state.availableStaff.map(s => ({
                value: s.id,
                label: s.name,
                image: s.image_url
            })),
            selectedValues: state.staffIds,
            onChange: (selectedValues) => {
                state.staffIds = selectedValues;
            }
        });

        const staffContainer = contentContainer.querySelector('#staff-multi-select-container');
        if (staffContainer) {
            staffContainer.appendChild(staffMultiSelect.element);
        }

        // Attach event listeners
        attachEventListeners();

        // Render custom hours if enabled
        if (state.customHoursEnabled && type !== 'overnight') {
            renderCustomHoursInModal();
        }
    };

    const attachEventListeners = () => {
        // Tab clicks
        contentContainer.querySelectorAll('.modal-tab').forEach(tab => {
            tab.onclick = () => switchTab(tab.dataset.tab);
        });

        // Name input
        const nameInput = contentContainer.querySelector('#input-name');
        if (nameInput) nameInput.oninput = (e) => updateState('name', e.target.value);

        // Description
        const descInput = contentContainer.querySelector('#input-desc');
        if (descInput) descInput.oninput = (e) => updateState('description', e.target.value);

        // Price
        const priceInput = contentContainer.querySelector('#input-price');
        if (priceInput) priceInput.oninput = (e) => updateState('price', parseFloat(e.target.value) || 0);

        // Duration
        const durationInput = contentContainer.querySelector('#input-duration');
        if (durationInput) durationInput.oninput = (e) => updateState('durationHours', parseInt(e.target.value) || 1);

        // Time inputs
        const timeStart = contentContainer.querySelector('#input-time-start');
        const timeEnd = contentContainer.querySelector('#input-time-end');
        if (timeStart) {
            timeStart.onchange = (e) => {
                if (state.serviceType === 'overnight') {
                    updateState('checkinStart', e.target.value);
                } else {
                    updateState('bookingWindowStart', e.target.value);
                }
            };
        }
        if (timeEnd) {
            timeEnd.onchange = (e) => {
                if (state.serviceType === 'overnight') {
                    updateState('checkoutEnd', e.target.value);
                } else {
                    updateState('bookingWindowEnd', e.target.value);
                }
            };
        }

        // Time clear buttons
        contentContainer.querySelectorAll('.time-clear').forEach(btn => {
            btn.onclick = () => {
                const input = contentContainer.querySelector(`#${btn.dataset.target}`);
                if (input) input.value = '';
            };
        });

        // Day toggles
        contentContainer.querySelectorAll('.day-toggle').forEach(btn => {
            btn.onclick = () => toggleDay(btn.dataset.day);
        });

        // Advance notice
        const advanceInput = contentContainer.querySelector('#input-advance');
        if (advanceInput) advanceInput.oninput = (e) => updateState('minAdvance', parseInt(e.target.value) || 0);

        // Toggle: Fixed start times
        const fixedTimesToggle = contentContainer.querySelector('#toggle-fixed-times');
        if (fixedTimesToggle) {
            fixedTimesToggle.onchange = (e) => updateState('fixedStartTimesEnabled', e.target.checked);
        }

        // Toggle: Min nights
        const minNightsToggle = contentContainer.querySelector('#toggle-min-nights');
        if (minNightsToggle) {
            minNightsToggle.onchange = (e) => {
                updateState('minNightsEnabled', e.target.checked);
                renderFormContent(); // Re-render to show/hide the input
            };
        }

        // Min nights input
        const minNightsInput = contentContainer.querySelector('#input-min-nights');
        if (minNightsInput) minNightsInput.oninput = (e) => updateState('minNights', parseInt(e.target.value) || 1);

        // Cleaning fee
        const cleaningFeeInput = contentContainer.querySelector('#input-cleaning-fee');
        if (cleaningFeeInput) cleaningFeeInput.oninput = (e) => updateState('cleaningFee', parseFloat(e.target.value) || 0);

        // Buffer times
        const bufferBefore = contentContainer.querySelector('#input-buffer-before');
        const bufferAfter = contentContainer.querySelector('#input-buffer-after');
        if (bufferBefore) bufferBefore.oninput = (e) => updateState('bufferBefore', parseInt(e.target.value) || 0);
        if (bufferAfter) bufferAfter.oninput = (e) => updateState('bufferAfter', parseInt(e.target.value) || 0);

        // Custom Hours Toggle
        const customHoursToggle = contentContainer.querySelector('#toggle-custom-hours');
        if (customHoursToggle) {
            customHoursToggle.onchange = (e) => {
                state.customHoursEnabled = e.target.checked;
                const container = contentContainer.querySelector('#custom-hours-container');
                if (container) {
                    container.style.display = state.customHoursEnabled ? '' : 'none';
                    if (state.customHoursEnabled && state.customHours.length === 0) {
                        addCustomHoursRow();
                    } else {
                        renderCustomHoursInModal();
                    }
                }
            };
        }
    };

    // --- UI Construction ---

    const renderContent = () => {
        const div = document.createElement('div');
        div.className = ''; // Removing service-modal-content, use modal-content-section in HTML
        contentContainer = div;
        renderFormContent();
        return div;
    };

    const renderFooterLeft = () => {
        const div = document.createElement('div');
        div.className = 'draft-toggle';
        div.innerHTML = `${getIconString('folder')} Als Entwurf speichern`;
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
            text: 'Service Speichern',
            loadingText: 'wird angelegt...',
            onClick: handleSave,
            className: 'btn-primary'
        });

        container.appendChild(cancelBtn);
        container.appendChild(saveBtn.element);
        return container;
    };

    // Create Modal
    modalInstance = createModal({
        title: 'Service Anlegen',
        subtitle: 'Lege einen Service an und ordne ihn einem Objekt zu.',
        content: renderContent(),
        footerLeft: renderFooterLeft(),
        footerRight: renderFooterRight(),
        onClose: () => { /* clean up */ }
    });

    modalInstance.open();
};
