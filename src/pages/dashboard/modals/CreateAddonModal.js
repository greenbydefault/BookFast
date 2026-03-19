/**
 * Create Addon Modal
 * Handles the logic and rendering for creating a new addon.
 * Design: Multi-select services, price with type, dynamic content items with variants.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { createEntity, fetchEntities, syncJunctionTable } from '../../../lib/dataLayer.js';
import { createMultiSelectTags } from '../../../components/MultiSelectTags/MultiSelectTags.js';
import { supabase } from '../../../lib/supabaseClient.js';

// Default state for the form
const getInitialState = () => ({
    name: '',
    description: '',
    price: 40,
    pricingType: 'one_time',
    applicability: 'guest',
    serviceIds: [],
    availableServices: [],
    contentItems: [], // Array of { id, name, quantity, variants: [{ id, name }] }
    isDraft: false
});

const PRICING_TYPES = [
    { value: 'one_time', label: 'einmalig' },
    { value: 'per_night', label: 'pro Nacht' },
    { value: 'per_person', label: 'pro Person' },
    { value: 'per_ticket', label: 'pro Ticket' }
];

// Generate unique IDs for content items
let contentIdCounter = 0;
const generateId = () => `content-${++contentIdCounter}`;

export const openCreateAddonModal = async (onSuccess) => {
    let state = getInitialState();
    let modalInstance = null;
    let serviceMultiSelect = null;

    // Fetch available services first
    try {
        const result = await fetchEntities('services', { perPage: 100, filter: 'active' });
        state.availableServices = result.items || [];
    } catch (error) {
        console.error('Failed to load services:', error);
        // Continue anyway, services are optional
    }

    // --- Actions ---

    const handleSave = async () => {
        if (!state.name) {
            alert('Bitte geben Sie einen Namen ein.');
            throw new Error('Validierungsfehler');
        }

        // Create main addon
        const newAddon = await createEntity('addons', {
            name: state.name,
            description: state.description,
            price: state.price,
            price: state.price,
            pricing_type: state.pricingType,
            status: state.isDraft ? 'draft' : 'active'
        });

        if (newAddon) {
            // 1. Link services via junction table
            if (state.serviceIds.length > 0) {
                await syncJunctionTable(
                    'addon_services',
                    'addon_id',
                    newAddon.id,
                    'service_id',
                    state.serviceIds
                );
            }

            // 2. Create content items & variants
            if (state.contentItems.length > 0) {
                for (const item of state.contentItems) {
                    const newItem = await createEntity('addon_items', {
                        addon_id: newAddon.id,
                        name: item.name,
                        selection_mode: item.selectionMode || 'quantity',
                        addon_id: newAddon.id,
                        name: item.name,
                        selection_mode: item.selectionMode || 'quantity',
                        quantity: typeof item.quantity === 'number' ? item.quantity : 1,
                        applicability: item.applicability || 'guest'
                    });

                    if (newItem && item.variants && item.variants.length > 0) {
                        const variantPromises = item.variants.map(v => createEntity('addon_item_variants', {
                            addon_item_id: newItem.id,
                            name: v.name
                        }));
                        await Promise.all(variantPromises);
                    }
                }
            }

            modalInstance.close();
            if (onSuccess) onSuccess();
        }
    };

    const updateState = (key, value) => {
        state[key] = value;
    };

    // Content item management
    const addContentItem = () => {
        state.contentItems.push({
            id: generateId(),
            name: '',
            quantity: 1,
            selectionMode: 'quantity',
            variants: [],
            id: generateId(),
            name: '',
            quantity: 1,
            selectionMode: 'quantity',
            applicability: 'guest',
            variants: [],
            isExpanded: true
        });
        renderContentSection();
    };

    const removeContentItem = (itemId) => {
        state.contentItems = state.contentItems.filter(item => item.id !== itemId);
        renderContentSection();
    };

    const updateContentItem = (itemId, key, value) => {
        const item = state.contentItems.find(i => i.id === itemId);
        if (item) {
            item[key] = value;
            if (key === 'quantity') renderContentSection();
        }
    };

    const addVariant = (itemId) => {
        const item = state.contentItems.find(i => i.id === itemId);
        if (item) {
            item.variants.push({ id: generateId(), name: '' });
            renderContentSection();
        }
    };

    const removeVariant = (itemId, variantId) => {
        const item = state.contentItems.find(i => i.id === itemId);
        if (item) {
            item.variants = item.variants.filter(v => v.id !== variantId);
            renderContentSection();
        }
    };

    const updateVariant = (itemId, variantId, name) => {
        const item = state.contentItems.find(i => i.id === itemId);
        if (item) {
            const variant = item.variants.find(v => v.id === variantId);
            if (variant) variant.name = name;
        }
    };

    const toggleItemExpanded = (itemId) => {
        const item = state.contentItems.find(i => i.id === itemId);
        if (item) {
            item.isExpanded = !item.isExpanded;
            renderContentSection();
        }
    };

    // --- Render Content Section ---
    const renderContentSection = () => {
        const container = document.getElementById('content-items-container');
        if (!container) return;

        container.innerHTML = state.contentItems.map(item => `
            <div class="content-item" data-item-id="${item.id}">
                <div class="content-item-header">
                    <div class="content-item-left">
                        <input type="text" class="content-item-name" placeholder="Artikelname..." 
                               value="${item.name}" data-item-id="${item.id}">
                        <button class="content-item-expand" data-item-id="${item.id}" type="button">
                            ${getIconString('list')}
                        </button>
                    </div>
                    <div class="content-item-controls">
                        <button class="content-item-delete" data-item-id="${item.id}" type="button">
                            ${getIconString('trash')}
                        </button>
                    </div>
                </div>
                ${item.isExpanded ? `
                    <div class="content-item-body">
                        <div class="content-item-mode">
                            <label class="content-mode-option">
                                <input type="radio" name="mode-${item.id}" value="single_choice" 
                                       ${item.selectionMode === 'single_choice' ? 'checked' : ''} data-item-id="${item.id}">
                                <span>Eine Variante auswählen</span>
                            </label>
                            <label class="content-mode-option">
                                <input type="radio" name="mode-${item.id}" value="quantity" 
                                       ${item.selectionMode === 'quantity' ? 'checked' : ''} data-item-id="${item.id}">
                                <span>Menge wählen</span>
                            </label>
                            <label class="content-mode-option" style="margin-left:auto;">
                                <select class="content-item-applicability" data-item-id="${item.id}" style="padding: 2px 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.8rem;">
                                    <option value="guest" ${(item.applicability || 'guest') === 'guest' ? 'selected' : ''}>Pro Gast</option>
                                    <option value="booking" ${item.applicability === 'booking' ? 'selected' : ''}>Pro Buchung</option>
                                </select>
                            </label>
                        </div>
                        <div class="content-item-variants">
                            ${item.variants.map(variant => `
                                <div class="variant-row" data-variant-id="${variant.id}">
                                    <span class="variant-icon">↳</span>
                                     <input type="text" class="variant-name" placeholder="Variante..." 
                                            value="${variant.name}" data-item-id="${item.id}" data-variant-id="${variant.id}">
                                     <button class="variant-delete" data-item-id="${item.id}" data-variant-id="${variant.id}" type="button" 
                                             style="background: none; border: none; color: var(--color-stone-400); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;" title="Variante löschen">
                                         <span style="transform: scale(0.8)">${getIconString('trash')}</span>
                                     </button>
                                 </div>
                            `).join('')}
                            <button class="add-variant-btn" data-item-id="${item.id}" type="button">
                                + Variante
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');

        if (state.contentItems.length > 0) {
            container.innerHTML += `
            <button id="add-content-item-btn-bottom" type="button" 
                    style="margin-top: 8px; background: var(--color-stone-50); border: 1px dashed var(--border-color); border-radius: 6px; padding: 8px; width: 100%; cursor: pointer; font-size: 0.85rem; color: var(--color-stone-500);">
                + Artikel hinzufügen
            </button>`;
        }

        // Attach event listeners for content items
        container.querySelectorAll('.content-item-name').forEach(input => {
            input.oninput = (e) => updateContentItem(e.target.dataset.itemId, 'name', e.target.value);
        });

        container.querySelectorAll('.content-item-expand').forEach(btn => {
            btn.onclick = () => toggleItemExpanded(btn.dataset.itemId);
        });

        container.querySelectorAll('.content-item-delete').forEach(btn => {
            btn.onclick = () => removeContentItem(btn.dataset.itemId);
        });

        // Selection mode radios
        container.querySelectorAll('.content-item-mode input[type="radio"]').forEach(radio => {
            radio.onchange = (e) => updateContentItem(e.target.dataset.itemId, 'selectionMode', e.target.value);
        });

        container.querySelectorAll('.content-item-applicability').forEach(sel => {
            sel.onchange = (e) => updateContentItem(e.target.dataset.itemId, 'applicability', e.target.value);
        });

        container.querySelectorAll('.variant-name').forEach(input => {
            input.oninput = (e) => updateVariant(e.target.dataset.itemId, e.target.dataset.variantId, e.target.value);
        });

        container.querySelectorAll('.variant-delete').forEach(btn => {
            btn.onclick = () => removeVariant(btn.dataset.itemId, btn.dataset.variantId);
        });

        container.querySelectorAll('.add-variant-btn').forEach(btn => {
            btn.onclick = () => addVariant(btn.dataset.itemId);
        });

        const bottomAddBtn = container.querySelector('#add-content-item-btn-bottom');
        if (bottomAddBtn) {
            bottomAddBtn.onclick = addContentItem;
        }
    };

    // --- UI Construction ---

    const renderContent = () => {
        const div = document.createElement('div');

        div.innerHTML = `
            <div class="modal-content-section">
                <div class="modal-form-field">
                    <input type="text" class="modal-form-input modal-input-large" 
                           placeholder="Ganzkörpermassage 60 Min"
                           value="${state.name}" id="input-name">
                </div>
                <div class="modal-form-field">
                    <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
                    <textarea class="modal-form-input" placeholder="Die perfekte Überraschung, für Euren Aufenthalt!" rows="2" id="input-desc">${state.description}</textarea>
                </div>
            </div>

            <div class="modal-content-section">
                <div id="service-multi-select-container"></div>
                <div class="modal-row">
                    <div class="modal-label">${getIconString('money-hand')} Preis</div>
                    <div class="modal-controls addon-price-controls">
                        <input type="number" class="price-amount-input" value="${state.price}" id="input-price" step="0.01">
                        <span class="price-currency">€</span>
                        <select class="price-type-select" id="input-pricing-type">
                            ${PRICING_TYPES.map(t => `
                                <option value="${t.value}" ${state.pricingType === t.value ? 'selected' : ''}>${t.label}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="modal-content-section">
                <div class="modal-section-header">
                    <div class="modal-label">${getIconString('package')} Inhalt</div>
                    <button class="add-content-btn" type="button" id="btn-add-content">+</button>
                </div>
                <div id="content-items-container" class="content-items-container"></div>
            </div>
        `;

        // Create and insert the multi-select component for services
        serviceMultiSelect = createMultiSelectTags({
            label: 'Service zuordnen',
            icon: 'home',
            placeholder: 'Service auswählen...',
            options: state.availableServices.map(svc => ({
                value: svc.id,
                label: svc.name
            })),
            selectedValues: state.serviceIds,
            onChange: (selectedValues) => {
                state.serviceIds = selectedValues;
            }
        });

        const multiSelectContainer = div.querySelector('#service-multi-select-container');
        multiSelectContainer.appendChild(serviceMultiSelect.element);

        // Attach Event Listeners
        const nameInput = div.querySelector('#input-name');
        nameInput.oninput = (e) => updateState('name', e.target.value);

        const descInput = div.querySelector('#input-desc');
        descInput.oninput = (e) => updateState('description', e.target.value);

        const priceInput = div.querySelector('#input-price');
        priceInput.oninput = (e) => updateState('price', parseFloat(e.target.value) || 0);

        const pricingTypeSelect = div.querySelector('#input-pricing-type');
        pricingTypeSelect.onchange = (e) => updateState('pricingType', e.target.value);



        const addContentBtn = div.querySelector('#btn-add-content');
        addContentBtn.onclick = addContentItem;

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
            text: 'Addon Speichern',
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
        title: 'Addon Anlegen',
        subtitle: 'Lege einen Addon an.',
        icon: 'package',
        content: renderContent(),
        footerLeft: renderFooterLeft(),
        footerRight: renderFooterRight(),
        onClose: () => { /* clean up */ }
    });

    modalInstance.open();
};
