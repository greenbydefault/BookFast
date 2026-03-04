import { getIconString } from '../Icons/Icon.js';

const DAY_IDS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/**
 * Creates a reusable Custom Hours manager for detail pages.
 *
 * @param {Object} opts
 * @param {string} opts.containerId - ID of the container element for the hours rows
 * @param {string} opts.toggleId   - ID of the toggle checkbox element
 * @param {Function} opts.onChange  - Called whenever state changes (for preview + autosave)
 * @returns {{ init: Function, getState: Function, wireToggle: Function }}
 */
export const createCustomHoursManager = ({ containerId, toggleId, onChange }) => {
    let state = { enabled: false, rows: [] };
    let idCounter = 0;
    const genId = () => `ch-${Date.now()}-${++idCounter}`;

    const init = (customHours) => {
        if (Array.isArray(customHours) && customHours.length > 0) {
            state = {
                enabled: true,
                rows: customHours.map(h => ({
                    id: genId(),
                    days: h.days || [],
                    from: h.from || '10:00',
                    to: h.to || '18:00',
                })),
            };
        } else {
            state = { enabled: false, rows: [] };
        }
    };

    const render = () => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const allUsedDays = new Map();
        state.rows.forEach(r => r.days.forEach(d => allUsedDays.set(d, r.id)));

        container.innerHTML = state.rows.map(row => `
            <div class="custom-hours-row" data-row-id="${row.id}">
                <div class="custom-hours-row-top">
                    <div class="day-toggles">
                        ${DAY_IDS.map(day => {
                            const isActive = row.days.includes(day);
                            const isUsedElsewhere = allUsedDays.has(day) && allUsedDays.get(day) !== row.id;
                            return `<button class="day-toggle ${isActive ? 'active' : ''}"
                                    data-row-id="${row.id}" data-day="${day}" type="button"
                                    ${isUsedElsewhere ? 'disabled' : ''}>${day}</button>`;
                        }).join('')}
                    </div>
                    <button class="custom-hours-delete" data-row-id="${row.id}" type="button">
                        ${getIconString('delete')}
                    </button>
                </div>
                <div class="custom-hours-time-row">
                    <div class="custom-hours-time-col">
                        <span class="label-above">Von</span>
                        <input type="time" class="time-input" value="${row.from}" data-row-id="${row.id}" data-field="from">
                    </div>
                    <div class="custom-hours-time-col">
                        <span class="label-above">Bis</span>
                        <input type="time" class="time-input" value="${row.to}" data-row-id="${row.id}" data-field="to">
                    </div>
                </div>
            </div>
        `).join('');

        const addBtn = document.createElement('button');
        addBtn.className = 'custom-hours-add-btn';
        addBtn.type = 'button';
        addBtn.textContent = '+ Zeitfenster hinzufügen';
        addBtn.onclick = () => {
            state.rows.push({ id: genId(), days: [], from: '10:00', to: '18:00' });
            render();
            if (onChange) onChange();
        };
        container.appendChild(addBtn);

        container.querySelectorAll('.day-toggles .day-toggle').forEach(btn => {
            btn.onclick = () => {
                if (btn.disabled) return;
                const row = state.rows.find(r => r.id === btn.dataset.rowId);
                if (!row) return;
                const day = btn.dataset.day;
                row.days = row.days.includes(day) ? row.days.filter(d => d !== day) : [...row.days, day];
                render();
                if (onChange) onChange();
            };
        });

        container.querySelectorAll('.custom-hours-delete').forEach(btn => {
            btn.onclick = () => {
                state.rows = state.rows.filter(r => r.id !== btn.dataset.rowId);
                render();
                if (onChange) onChange();
            };
        });

        container.querySelectorAll('.custom-hours-time-row .time-input').forEach(input => {
            input.onchange = (e) => {
                const row = state.rows.find(r => r.id === e.target.dataset.rowId);
                if (row) row[e.target.dataset.field] = e.target.value;
                if (onChange) onChange();
            };
        });
    };

    const wireToggle = (signal) => {
        const toggle = document.getElementById(toggleId);
        const container = document.getElementById(containerId);
        if (!toggle) return;

        toggle.addEventListener('change', (e) => {
            state.enabled = e.target.checked;
            if (container) container.style.display = state.enabled ? '' : 'none';
            if (state.enabled && state.rows.length === 0) {
                state.rows.push({ id: genId(), days: [], from: '10:00', to: '18:00' });
            }
            render();
            if (onChange) onChange();
        }, signal ? { signal } : undefined);

        if (state.enabled) {
            render();
        }
    };

    const getState = () => {
        if (!state.enabled || state.rows.length === 0) return null;
        return state.rows.map(r => ({ days: r.days, from: r.from, to: r.to }));
    };

    return { init, render, wireToggle, getState };
};
