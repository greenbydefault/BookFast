/**
 * Create Object Modal
 * Handles the logic and rendering for creating a new object/site.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton } from '../../../components/Button/Button.js';
import { createEntity } from '../../../lib/dataLayer.js';
import { getState, setState, setNestedState } from '../../../lib/store.js';

// Default state for the form
const getInitialState = () => ({
    name: '',
    description: '',
    capacity: 0,
    bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], // Default all selected?
    timeFrom: '10:00',
    timeTo: '18:00',
    bufferBefore: 0,
    bufferAfter: 0,
    isDraft: false
});

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const openCreateObjectModal = (onSuccess) => {
    let state = getInitialState();
    let modalInstance = null;

    // --- Actions ---

    const handleSave = async () => {
        if (!state.name) {
            alert('Bitte geben Sie einen Namen ein.');
            return;
        }

        try {
            await createEntity('objects', {
                name: state.name,
                description: state.description,
                capacity: state.capacity,
                status: state.isDraft ? 'draft' : 'active',
                // Store serialized settings in a JSON column or separate fields?
                // For now, mapping to existing schema or standard fields.
                // Assuming 'settings' or specific columns exist.
                // If schema doesn't support these yet, we might need to update it.
                // Based on current task, we assume basic fields map, others might be settings.
                settings: {
                    bookableDays: state.bookableDays,
                    timeWindow: { from: state.timeFrom, to: state.timeTo },
                    buffer: { before: state.bufferBefore, after: state.bufferAfter }
                }
            });

            modalInstance.close();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create object:', error);
            alert('Fehler beim Erstellen: ' + error.message);
        }
    };

    const toggleDay = (day) => {
        if (state.bookableDays.includes(day)) {
            state.bookableDays = state.bookableDays.filter(d => d !== day);
        } else {
            state.bookableDays = [...state.bookableDays, day];
        }
        updateRender();
    };

    const updateState = (key, value) => {
        state[key] = value;
        // Should we re-render whole content or target elements?
        // Simple re-render of content is easier for this scale.
        // updateRender(); // Only if UI needs to reflect immediate change (like toggle)
        // For inputs, we rely on DOM event connection usually, but manual re-render loses focus.
        // So we just update state reference.
    };

    // --- UI Construction ---

    const renderContent = () => {
        const div = document.createElement('div');

        div.innerHTML = `
            <input type="text" class="modal-form-input modal-input-large" 
                   placeholder="z. B. Villa Nord oder Hausboot Molchow"
                   value="${state.name}" id="input-name">
            
            <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
            <textarea class="modal-form-input" placeholder="Optional: Was ist enthalten, was soll der Gast mitbringen, wichtige Hinweise ..." rows="3" id="input-desc">${state.description}</textarea>
            
            <div class="modal-separator"></div>
            
            <div class="modal-row">
                <div class="modal-label">${getIconString('users-group')} Kapazität</div>
                <div class="modal-controls">
                    <div class="number-control">
                        <input type="number" class="number-input" value="${state.capacity}" id="input-capacity">
                        <div class="number-btns">
                            <button class="number-btn" data-action="inc">${getIconString('arrow-up-down')}</button> 
                        </div>
                    </div>
                    <!-- Using arrow-up-down as generic spinner icon or constructing custom SVG for up/down arrows -->
                </div>
            </div>
            
            <div class="modal-row">
                <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
                <div class="modal-controls">
                    <div class="day-toggles">
                        ${DAYS.map(day => `
                            <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}" 
                                    data-day="${day}">${day}</button>
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
                        <button class="time-remove">×</button>
                    </div>
                    <div class="time-group">
                        <span>Bis</span>
                        <input type="text" value="${state.timeTo}" id="input-time-to">
                        <button class="time-remove">×</button>
                    </div>
                </div>
            </div>
            
            <div class="modal-separator"></div>
            
            <div class="modal-row">
                <div class="modal-label">${getIconString('broom')} Reinigungspuffer</div>
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

        // Time inputs (simple text update for now)
        div.querySelector('#input-time-from').onchange = (e) => updateState('timeFrom', e.target.value);
        div.querySelector('#input-time-to').onchange = (e) => updateState('timeTo', e.target.value);

        div.querySelector('#input-buffer-before').onchange = (e) => updateState('bufferBefore', parseInt(e.target.value) || 0);
        div.querySelector('#input-buffer-after').onchange = (e) => updateState('bufferAfter', parseInt(e.target.value) || 0);

        return div;
    };

    const renderFooterLeft = () => {
        const div = document.createElement('div');
        div.className = 'draft-toggle';
        div.innerHTML = `${getIconString('folder')} Als Entwurf speichern`;
        // Add checkbox behavior if needed, or simple toggle state visual
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
        const saveBtn = createButton('Objekt anlegen', handleSave, 'btn-primary');

        container.appendChild(cancelBtn);
        container.appendChild(saveBtn);
        return container;
    };

    const updateRender = () => {
        // We only re-render if essential structure changes or toggles. 
        // For inputs we avoid re-render to keep focus.
        // But for day toggles we need to re-render or manually update classes.
        // Let's manually update classes for efficiency.
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
        title: 'Objekt Anlegen',
        subtitle: 'Lege einen Objekt an.',
        content: renderContent(),
        footerLeft: renderFooterLeft(),
        footerRight: renderFooterRight(),
        onClose: () => { /* clean up */ }
    });

    modalInstance.open();
};
