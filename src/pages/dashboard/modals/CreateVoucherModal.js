/**
 * Create Voucher Modal
 * Handles the logic and rendering for creating a new voucher/discount code.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { createEntity, fetchEntities } from '../../../lib/dataLayer.js';
import { supabase } from '../../../lib/supabaseClient.js';
import { createMultiSelectTags } from '../../../components/MultiSelectTags/MultiSelectTags.js';

// Discount type options (matching database enum: fixed_amount, percentage)
const DISCOUNT_TYPES = [
    { id: 'fixed_amount', label: 'Betrag', suffix: '€' },
    { id: 'percentage', label: 'Prozent', suffix: '%' }
];

// Default state for the form
const getInitialState = () => ({
    name: '',
    code: '',
    discountType: 'fixed_amount',
    discountValue: 140,
    validUntil: '',
    maxUsesTotal: null,
    maxUsesPerCustomer: null,
    maxUsesPerCustomer: null,
    isDraft: false,
    services: [], // loaded services
    selectedServices: new Set(), // IDs of selected services
    appliesToAll: true, // default to all services
    loadingServices: false
});

/**
 * Generate a random voucher code
 */
const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const openCreateVoucherModal = async (onSuccess) => {
    let state = getInitialState();
    let modalInstance = null;
    let contentContainer = null;

    // Load available services
    const loadServices = async () => {
        updateState('loadingServices', true);
        renderFormContent();
        const res = await fetchEntities('services', { perPage: 100, filter: 'active' });
        updateState('services', res.items || []);
        updateState('loadingServices', false);
        renderFormContent();
    };

    // --- Actions ---

    const handleSave = async () => {
        if (!state.name) {
            alert('Bitte geben Sie einen Namen ein.');
            throw new Error('Validierungsfehler');
        }
        if (!state.code) {
            alert('Bitte geben Sie einen Gutscheincode ein.');
            throw new Error('Validierungsfehler');
        }

        const data = {
            name: state.name,
            code: state.code.toUpperCase(),
            discount_type: state.discountType,
            discount_value: state.discountValue,
            valid_until: state.validUntil || null,
            max_uses_total: state.maxUsesTotal,
            max_uses_per_customer: state.maxUsesPerCustomer,
            status: state.isDraft ? 'draft' : 'active'
        };

        const res = await createEntity('vouchers', data);

        // Save linked services if not appliesToAll
        if (!state.appliesToAll && state.selectedServices.size > 0 && res && res.id) {
            const links = Array.from(state.selectedServices).map(serviceId => ({
                voucher_id: res.id,
                service_id: serviceId
            }));

            const { error } = await supabase.from('voucher_services').insert(links);
            if (error) {
                console.error('Error linking services:', error);
                alert('Gutschein erstellt, aber Fehler beim Verknüpfen der Services.');
            }
        }

        modalInstance.close();
        if (onSuccess) onSuccess();
    };

    const updateState = (key, value) => {
        state[key] = value;
    };

    const toggleService = (id) => {
        if (state.selectedServices.has(id)) {
            state.selectedServices.delete(id);
        } else {
            state.selectedServices.add(id);
        }
        renderFormContent();
    };

    const handleIncrement = (key) => {
        if (state[key] === null) {
            state[key] = 1;
        } else {
            state[key]++;
        }
        renderFormContent();
    };

    const handleDecrement = (key) => {
        if (state[key] !== null && state[key] > 1) {
            state[key]--;
        } else {
            state[key] = null;
        }
        renderFormContent();
    };

    // --- Render Form Content ---
    const renderFormContent = () => {
        if (!contentContainer) return;

        const currentType = DISCOUNT_TYPES.find(t => t.id === state.discountType);

        contentContainer.innerHTML = `
            <!-- Name Input (Optional) -->
            <input type="text" class="modal-form-input modal-input-large" 
                   placeholder="z. B. Frühbucher-Rabatt oder Neukunden-Gutschein"
                   value="${state.name}" id="input-name">

            <div class="modal-separator"></div>

            <!-- Gutscheincode -->
            <label class="modal-label modal-form-label">Gutscheincode</label>
            <div class="voucher-code-input-wrapper">
                <input type="text" class="modal-form-input voucher-code-input" 
                       placeholder="WELCOME25"
                       value="${state.code}" id="input-code" style="text-transform: uppercase;">
                <button type="button" class="voucher-generate-btn" id="btn-generate-code" title="Code generieren">
                    ${getIconString('refresh-cw')}
                </button>
            </div>

            <!-- Wert (Discount Value) -->
            <div class="modal-row">
                <div class="modal-label">${getIconString('coins')} Wert</div>
                <div class="modal-controls addon-price-controls">
                    <select class="price-type-select" id="input-discount-type">
                        ${DISCOUNT_TYPES.map(type => `
                            <option value="${type.id}" ${state.discountType === type.id ? 'selected' : ''}>
                                ${type.label}
                            </option>
                        `).join('')}
                    </select>
                    <input type="number" class="price-amount-input" value="${state.discountValue}" id="input-discount-value" step="1" min="0">
                    <span class="price-currency">${currentType.suffix}</span>
                </div>
            </div>

            <!-- Service auswählen -->
            <div class="modal-row" style="align-items: flex-start;">
                <div class="modal-label">${getIconString('briefcase')} Service auswählen</div>
                <div class="modal-controls" style="flex-direction: column; gap: 8px; width: 100%;">
                    <div id="services-multiselect-container" style="width: 100%; ${state.appliesToAll ? 'opacity: 0.5; pointer-events: none;' : ''}"></div>
                </div>
            </div>

            <!-- Gilt für alle Services (separate toggle row) -->
            <div class="modal-row">
                <div class="modal-label">${getIconString('globe')} Gilt für alle Services</div>
                <div class="modal-controls">
                    <label class="toggle-switch">
                        <input type="checkbox" id="input-applies-all" ${state.appliesToAll ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <!-- Gültig bis (Optional) -->
            <div class="modal-row">
                <div class="modal-label">${getIconString('calender-days-date')} Gültig bis<span class="modal-label-optional">(Optional)</span></div>
                <div class="modal-controls">
                    <div class="date-input-group">
                        <input type="date" class="date-input" value="${state.validUntil}" id="input-valid-until">
                        <button class="date-clear" type="button" id="btn-clear-date">×</button>
                    </div>
                </div>
            </div>

            <!-- Max. Einlösungen insgesamt (Optional) -->
            <div class="modal-row">
                <div class="modal-label">${getIconString('hash')} Max. Einlösungen insgesamt<span class="modal-label-optional">(Optional)</span></div>
                <div class="modal-controls">
                    <div class="stepper-input">
                        <button type="button" class="stepper-btn" data-action="increment" data-key="maxUsesTotal">+</button>
                        <input type="number" class="stepper-value" value="${state.maxUsesTotal ?? ''}" id="input-max-uses" placeholder="∞" min="1">
                        <button type="button" class="stepper-btn" data-action="decrement" data-key="maxUsesTotal">−</button>
                    </div>
                </div>
            </div>

            <!-- Max. Einlösungen pro Kunde (Optional) -->
            <div class="modal-row">
                <div class="modal-label">${getIconString('user')} Max. Einlösungen pro Kunde<span class="modal-label-optional">(Optional)</span></div>
                <div class="modal-controls">
                    <div class="stepper-input">
                        <button type="button" class="stepper-btn" data-action="increment" data-key="maxUsesPerCustomer">+</button>
                        <input type="number" class="stepper-value" value="${state.maxUsesPerCustomer ?? ''}" id="input-max-per-customer" placeholder="∞" min="1">
                        <button type="button" class="stepper-btn" data-action="decrement" data-key="maxUsesPerCustomer">−</button>
                    </div>
                </div>
            </div>
        `;

        // Create MultiSelectTags - always render, but disable if appliesToAll
        const servicesMultiSelect = createMultiSelectTags({
            label: '',
            icon: 'layers',
            placeholder: state.loadingServices ? 'Lade Services...' : 'Services auswählen...',
            options: state.services.map(s => ({ value: s.id, label: s.name })),
            selectedValues: Array.from(state.selectedServices),
            onChange: (values) => {
                state.selectedServices = new Set(values);
            }
        });
        const container = contentContainer.querySelector('#services-multiselect-container');
        if (container) {
            container.innerHTML = ''; // Clear previous
            container.appendChild(servicesMultiSelect.element);
        }

        // Attach event listeners
        attachEventListeners();
    };

    const attachEventListeners = () => {
        // Name input
        const nameInput = contentContainer.querySelector('#input-name');
        if (nameInput) nameInput.oninput = (e) => updateState('name', e.target.value);

        // Code input
        const codeInput = contentContainer.querySelector('#input-code');
        if (codeInput) codeInput.oninput = (e) => updateState('code', e.target.value.toUpperCase());

        // Generate code button
        const generateBtn = contentContainer.querySelector('#btn-generate-code');
        if (generateBtn) {
            generateBtn.onclick = () => {
                state.code = generateCode();
                renderFormContent();
            };
        }

        // Discount type select
        const discountTypeSelect = contentContainer.querySelector('#input-discount-type');
        if (discountTypeSelect) {
            discountTypeSelect.onchange = (e) => {
                state.discountType = e.target.value;
                renderFormContent();
            };
        }

        // Discount value
        const discountValueInput = contentContainer.querySelector('#input-discount-value');
        if (discountValueInput) {
            discountValueInput.oninput = (e) => updateState('discountValue', parseFloat(e.target.value) || 0);
        }

        // Valid until date
        const validUntilInput = contentContainer.querySelector('#input-valid-until');
        if (validUntilInput) {
            validUntilInput.onchange = (e) => updateState('validUntil', e.target.value);
        }

        // Clear date button
        const clearDateBtn = contentContainer.querySelector('#btn-clear-date');
        if (clearDateBtn) {
            clearDateBtn.onclick = () => {
                state.validUntil = '';
                renderFormContent();
            };
        }

        // Max uses total input
        const maxUsesInput = contentContainer.querySelector('#input-max-uses');
        if (maxUsesInput) {
            maxUsesInput.oninput = (e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value);
                updateState('maxUsesTotal', val);
            };
        }

        // Max uses per customer input
        const maxPerCustomerInput = contentContainer.querySelector('#input-max-per-customer');
        if (maxPerCustomerInput) {
            maxPerCustomerInput.oninput = (e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value);
                updateState('maxUsesPerCustomer', val);
            };
        }

        // Stepper buttons
        contentContainer.querySelectorAll('.stepper-btn').forEach(btn => {
            btn.onclick = () => {
                const action = btn.dataset.action;
                const key = btn.dataset.key;
                if (action === 'increment') {
                    handleIncrement(key);
                } else {
                    handleDecrement(key);
                }
            };
        });

        // Applies to all toggle
        const appliesAllInput = contentContainer.querySelector('#input-applies-all');
        if (appliesAllInput) {
            appliesAllInput.onchange = (e) => {
                updateState('appliesToAll', e.target.checked);
                renderFormContent();
            };
        }

        // Service checkboxes - Removed (replaced by MultiSelectTags)
    };

    // --- UI Construction ---

    const renderContent = () => {
        const div = document.createElement('div');
        div.className = 'voucher-modal-content';
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
            text: 'Gutschein Speichern',
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
        title: 'Gutschein Anlegen',
        subtitle: 'Lege einen Gutschein an.',
        content: renderContent(),
        footerLeft: renderFooterLeft(),
        footerRight: renderFooterRight(),
        onClose: () => { /* clean up */ }
    });

    modalInstance.open();
    loadServices();
};
