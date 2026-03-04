/**
 * StaffFormFields — Shared presentational form for staff data.
 * Used by CreateStaffModal (Dashboard), StaffDetailPage (Dashboard) and
 * StaffPreviewCard (Landing demo).  Changes here propagate everywhere.
 *
 * @param {Object} config
 * @param {Object}  config.state           - Initial state { name, description, imageUrl, bookableDays[], serviceIds[], timeFrom, timeTo }
 * @param {Object}  config.options
 * @param {Array}   config.options.services - [{ value, label }] available service options
 * @param {boolean} [config.options.showImage=true]
 * @param {boolean} [config.options.showDescription=true]
 * @param {boolean} [config.options.showTimeWindows=true]
 * @param {Function} [config.onChange]       - Called with current state on every change
 * @returns {{ element: HTMLElement, getState: Function, destroy: Function }}
 */
import { getIconString } from '../Icons/Icon.js';
import { createMultiSelectTags } from '../MultiSelectTags/MultiSelectTags.js';
import { escapeAttr } from '../../lib/sanitize.js';
import { DAY_IDS } from '../../lib/staffDays.js';

const PLACEHOLDER_NAME = 'Jennifer Paul';

export const createStaffFormFields = (config = {}) => {
    const {
        state: initialState = {},
        options = {},
        onChange = () => {},
    } = config;

    const {
        services = [],
        showImage = true,
        showDescription = true,
        showTimeWindows = true,
    } = options;

    const state = {
        name: initialState.name || '',
        description: initialState.description || '',
        imageUrl: initialState.imageUrl || '',
        bookableDays: initialState.bookableDays || [...DAY_IDS],
        serviceIds: initialState.serviceIds || [],
        timeFrom: initialState.timeFrom || '10:00',
        timeTo: initialState.timeTo || '18:00',
    };

    const container = document.createElement('div');
    container.className = 'staff-form-fields';

    let multiSelect = null;

    const notify = () => onChange({ ...state });

    const render = () => {
        container.innerHTML = `
            <div class="modal-content-section">
                <div class="staff-form-fields__header">
                    <input type="text" class="modal-form-input modal-input-large" placeholder="${PLACEHOLDER_NAME}" value="${escapeAttr(state.name)}" data-field="name">
                    <div class="staff-form-fields__status-badge">
                        ${getIconString('calender-days-date')} Urlaub <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                </div>
                ${showDescription ? `
                <div class="modal-form-field">
                    <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
                    <input type="text" class="modal-form-input" placeholder="Sympathische Mitarbeiterin aus Halle-Saale." value="${escapeAttr(state.description)}" data-field="description">
                </div>
                ` : ''}
            </div>

            <div class="modal-content-section">
                <div class="modal-row">
                    <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
                    <div class="modal-controls">
                        <div class="day-toggles">
                            ${DAY_IDS.map(day => `
                                <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}" data-day="${day}" type="button">${day}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ${showTimeWindows ? `
                <div class="modal-row">
                    <div class="modal-label">${getIconString('clock')} Buchungszeitfenster</div>
                    <div class="modal-controls">
                        <div class="time-group">
                            <span>Von</span>
                            <input type="time" value="${state.timeFrom}" data-field="timeFrom">
                        </div>
                        <div class="time-group">
                            <span>Bis</span>
                            <input type="time" value="${state.timeTo}" data-field="timeTo">
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="modal-content-section">
                <div class="modal-row">
                    <div class="modal-label">${getIconString('gear')} Services</div>
                    <div class="modal-controls modal-controls-stretch">
                        <div id="staff-form-services"></div>
                    </div>
                </div>
            </div>
        `;

        multiSelect = createMultiSelectTags({
            label: '',
            placeholder: 'Weiteren Service verknüpfen',
            options: services,
            selectedValues: state.serviceIds,
            onChange: (vals) => { state.serviceIds = vals; notify(); },
        });

        const svcContainer = container.querySelector('#staff-form-services');
        if (svcContainer) svcContainer.appendChild(multiSelect.element);

        wireListeners();
    };

    const wireListeners = () => {
        container.querySelector('[data-field="name"]')?.addEventListener('input', (e) => {
            state.name = e.target.value;
            notify();
        });

        container.querySelector('[data-field="description"]')?.addEventListener('input', (e) => {
            state.description = e.target.value;
            notify();
        });

        container.querySelector('[data-field="timeFrom"]')?.addEventListener('change', (e) => {
            state.timeFrom = e.target.value;
            notify();
        });

        container.querySelector('[data-field="timeTo"]')?.addEventListener('change', (e) => {
            state.timeTo = e.target.value;
            notify();
        });

        container.querySelectorAll('.day-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const day = btn.dataset.day;
                btn.classList.toggle('active');
                if (state.bookableDays.includes(day)) {
                    state.bookableDays = state.bookableDays.filter(d => d !== day);
                } else {
                    state.bookableDays = [...state.bookableDays, day];
                }
                notify();
            });
        });
    };

    render();

    return {
        element: container,
        getState: () => ({ ...state }),
        destroy: () => { container.innerHTML = ''; },
    };
};
