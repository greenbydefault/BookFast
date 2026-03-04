/**
 * Addon Detail Page - Orchestrator
 * 2-column layout: Center (preview card) | Side Card (edit fields + meta + actions)
 */
import { fetchEntity, fetchEntities, updateEntity, createEntity, deleteEntity, invalidateCache, syncJunctionTable } from '../../lib/dataLayer.js';
import { createMultiSelectTags } from '../../components/MultiSelectTags/MultiSelectTags.js';
import { navigate, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createActionButton } from '../../components/Button/Button.js';
import {
    renderDetailLayout,
    updateCenter,
    navField,
    buildSideCardWithTabs,
    sideCardSection,
    renderDetailLoading,
    renderDetailError,
} from '../../components/DetailLayout/DetailLayout.js';
import { debounce } from '../../lib/utils.js';

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const PRICING_TYPE_LABELS = { per_booking: 'Pro Buchung', per_unit: 'Pro Einheit', per_hour: 'Pro Stunde', per_day: 'Pro Tag' };
const APPLICABILITY_LABELS = { booking: 'Für die Buchung (einmalig)', guest: 'Pro Gast' };
const MODE_LABELS = { single_choice: 'Eine Variante', quantity: 'Menge wählbar' };

const fmt = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? '—' : n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

// ── Center Preview ──

const buildCenterPreview = (addon) => {
    const linkedServices = addon.linked_services || [];
    const addonItems = addon.addon_items || [];

    const renderContentPreview = () => {
        if (!addonItems.length) return '<p style="color: var(--color-stone-400); font-size: 0.85rem;">Kein Inhalt definiert</p>';
        return addonItems.map(item => `
            <div class="detail-preview-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                    <span class="detail-preview-value" style="font-weight: 500;">${esc(item.name || 'Unbenannt')}</span>
                    <span style="font-size: 0.75rem; color: var(--color-stone-400); margin-left: auto;">${MODE_LABELS[item.selection_mode] || item.selection_mode || 'Menge'}</span>
                </div>
                ${item.addon_item_variants?.length ? `<div style="padding-left: 16px; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${item.addon_item_variants.map(v => `<span style="font-size: 0.8rem; color: var(--color-stone-500); background: var(--color-stone-100); padding: 2px 8px; border-radius: 4px;">↳ ${esc(v.name)}</span>`).join('')}
                </div>` : ''}
            </div>
        `).join('');
    };

    return `
        <div class="detail-preview-card">
            <div class="detail-preview-card__header">
                <h2 class="detail-preview-card__title">${esc(addon.name) || 'Neues Addon'}</h2>
                <div style="margin-left: auto; display: flex; align-items: center; gap: 12px;">
                    <div class="autosave-status" id="autosave-status"></div>
                </div>
            </div>

            <div class="detail-preview-block--description">
                <p class="detail-preview-section__title">Beschreibung</p>
                <div class="detail-preview-description">
                    <span class="detail-preview-value detail-preview-value--left">${addon.description ? esc(addon.description) : '<span style="color: var(--color-stone-400);">Keine Beschreibung</span>'}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Details</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Preis</span>
                    <span class="detail-preview-value">${fmt(addon.price)}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Preismodell</span>
                    <span class="detail-preview-value">${PRICING_TYPE_LABELS[addon.pricing_type] || addon.pricing_type || '—'}</span>
                </div>

            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Inhalt</p>
                ${renderContentPreview()}
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Verknüpfte Services</p>
                ${linkedServices.length > 0 ? linkedServices.map(ls => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value">${esc(ls.services?.name || '—')}</span>
                    </div>
                `).join('') : '<p style="color: var(--color-stone-400); font-size: 0.85rem;">Keine Services verknüpft</p>'}
            </div>
        </div>
    `;
};

// ── Side Card (edit fields + meta + actions) ──

const renderSideCard = (addon) => buildSideCardWithTabs({
    title: 'Add-on Details',
    tabs: [
        {
            id: 'details',
            label: 'Details',
            sections: [
                sideCardSection({
                    title: 'Allgemein',
                    content: `
                        ${navField({ label: 'Name', name: 'name', value: esc(addon.name), placeholder: 'Addon-Name' })}
                        ${navField({ label: 'Beschreibung', name: 'description', value: esc(addon.description), tag: 'textarea', placeholder: 'Beschreibung...' })}
                    `
                }),
                sideCardSection({
                    title: 'Preis',
                    content: `
                        ${navField({ label: 'Preis (€)', name: 'price', value: addon.price ?? '', type: 'number', placeholder: '0.00' })}
                        ${navField({
                            label: 'Preismodell', name: 'pricing_type', tag: 'select',
                            options: Object.entries(PRICING_TYPE_LABELS).map(([v, l]) => `<option value="${v}" ${addon.pricing_type === v ? 'selected' : ''}>${l}</option>`).join('')
                        })}
                    `
                }),
            ],
        },
        {
            id: 'inhalte',
            label: 'Inhalte',
            sections: [
                sideCardSection({
                    title: 'Inhalt',
                    content: `
                        <div id="content-items-editor"></div>
                        <button id="add-content-item-btn" type="button" class="detail-nav-add-btn">
                            + Artikel hinzufügen
                        </button>
                    `
                }),
            ],
        },
        {
            id: 'verknuepfungen',
            label: 'Verknüpfungen',
            sections: [
                sideCardSection({
                    title: 'Verknüpfungen',
                    content: '<div id="link-services-container"></div>'
                }),
            ],
        },
    ],
});

// ── Collect form values ──

const collectFormValues = (addonContext) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return {};

    const val = (name) => card.querySelector(`[name="${name}"]`)?.value ?? '';
    const numOrNull = (name) => { const v = parseFloat(val(name)); return isNaN(v) ? null : v; };

    return {
        name: val('name'),
        description: val('description'),
        price: numOrNull('price'),
        pricing_type: val('pricing_type'),

    };
};

// ── Live Preview ──

const setupLivePreview = (addonId, addon, signal) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return;

    // Initialize debounced save
    const debouncedSave = debounce(() => saveAddon(addonId, addon), 1000);

    const handler = (e) => {
        const values = collectFormValues(addon);
        const merged = { ...addon, ...values };

        // Debounced save for main fields
        debouncedSave();

        updateCenter(buildCenterPreview(merged));
    };

    card.addEventListener('input', handler, { signal });
    card.addEventListener('change', handler, { signal });

    // Setup content item buttons (delegated)
    setupContentItemHandlers(addonId, addon, signal, debouncedSave);
};

const saveAddon = async (addonId, addonContext) => {
    const statusEl = document.getElementById('autosave-status');
    if (statusEl) {
        statusEl.innerHTML = '<div class="autosave-spinner"></div><span>Speichert...</span>';
        statusEl.classList.add('visible');
    }

    try {
        const updates = collectFormValues(addonContext);
        await updateEntity('addons', addonId, updates);
        invalidateCache('addons');

        // Update context
        Object.assign(addonContext, updates);

        if (statusEl) {
            statusEl.innerHTML = '<span>Gespeichert</span>';
            setTimeout(() => {
                statusEl.classList.remove('visible');
            }, 2000);
        }
    } catch (err) {
        console.error(err);
        if (statusEl) statusEl.innerHTML = '<span style="color:var(--color-red-600)">Fehler!</span>';
    }
};

// ── Content Item Handlers ──

const setupContentItemHandlers = (addonId, addon, signal, debouncedSave) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return;

    let items = addon.addon_items || [];
    // Ensure item variants are arrays
    items.forEach(i => { if (!i.addon_item_variants) i.addon_item_variants = []; });

    const refreshEditor = () => {
        const editor = card.querySelector('#content-items-editor');
        if (!editor) return;

        let html = items.map((item, idx) => `
            <div class="addon-content-item" data-ci-id="${item.id}" data-ci-idx="${idx}" style="background: var(--color-stone-50); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <input type="text" class="ci-name" value="${esc(item.name || '')}" placeholder="Artikelname..." 
                           data-ci-id="${item.id}"
                           style="flex:1; padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.85rem;">
                    <button class="ci-delete" data-ci-id="${item.id}" type="button" 
                            style="background: none; border: 1px solid var(--border-color); border-radius: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-stone-400);">
                        ${getIconString('trash')}
                    </button>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 6px; padding-left: 4px;">
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--color-stone-600); cursor: pointer;">
                        <input type="radio" name="ci-mode-${item.id}" value="single_choice" ${item.selection_mode === 'single_choice' ? 'checked' : ''} class="ci-mode" data-ci-id="${item.id}">
                        Eine Variante
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--color-stone-600); cursor: pointer;">
                        <input type="radio" name="ci-mode-${item.id}" value="quantity" ${item.selection_mode === 'quantity' || !item.selection_mode ? 'checked' : ''} class="ci-mode" data-ci-id="${item.id}">
                        Menge
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--color-stone-600); margin-left: auto;">
                        <select class="ci-applicability" data-ci-id="${item.id}" style="padding: 2px 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.78rem; color: var(--color-stone-600);">
                            <option value="guest" ${(item.applicability || 'guest') === 'guest' ? 'selected' : ''}>Pro Gast</option>
                            <option value="booking" ${item.applicability === 'booking' ? 'selected' : ''}>Pro Buchung</option>
                        </select>
                    </label>
                </div>
                <div class="ci-variants">
                    ${(item.addon_item_variants || []).map((v, vi) => `
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; padding-left: 12px;">
                            <span style="color: var(--color-stone-400); font-size: 0.8rem;">↳</span>
                            <input type="text" class="ci-variant-name" value="${esc(v.name || '')}" placeholder="Variante..." 
                                   data-v-id="${v.id}" data-ci-id="${item.id}"
                                   style="flex:1; padding: 4px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.82rem;">
                            <button class="ci-variant-delete" data-v-id="${v.id}" data-ci-id="${item.id}" type="button" 
                                    style="background: none; border: none; color: var(--color-stone-400); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;" title="Variante löschen">
                                <span style="transform: scale(0.8)">${getIconString('trash')}</span>
                            </button>
                        </div>
                    `).join('')}
                    <button class="ci-add-variant" data-ci-id="${item.id}" type="button" 
                            style="background: none; border: none; color: var(--color-primary, #2563eb); cursor: pointer; font-size: 0.8rem; padding: 2px 12px; text-align: left;">
                        + Variante
                    </button>
                </div>
            </div>
        `).join('');

        if (items.length > 0) {
            html += `
            <button id="add-content-item-btn-bottom" type="button" 
                    style="margin-top: 8px; background: var(--color-stone-50); border: 1px dashed var(--border-color); border-radius: 6px; padding: 8px; width: 100%; cursor: pointer; font-size: 0.85rem; color: var(--color-stone-500);">
                + Artikel hinzufügen
            </button>`;
        }

        editor.innerHTML = html;

        // Toggle static button visibility
        const staticAddBtn = card.querySelector('#add-content-item-btn');
        if (staticAddBtn) {
            staticAddBtn.style.display = items.length > 0 ? 'none' : 'block';
        }

        // Re-attach listeners
        attachListeners();

        // Update center preview
        addon.addon_items = items;
        updateCenter(buildCenterPreview(addon));
    };

    const handleAddItem = async () => {
        const newItem = await createEntity('addon_items', {
            addon_id: addonId,
            name: '',
            quantity: 1,
            selection_mode: 'quantity'
        });

        if (newItem) {
            newItem.addon_item_variants = [];
            items.push(newItem);
            refreshEditor();
        }
    };

    const attachListeners = () => {
        const editor = card.querySelector('#content-items-editor');
        if (!editor) return;

        // Delete Item
        editor.querySelectorAll('.ci-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.ciId;
                if (!confirm('Artikel wirklich löschen?')) return;

                // Optimistic UI update
                items = items.filter(i => i.id !== id);
                refreshEditor();

                await deleteEntity('addon_items', id);
            }, { signal });
        });

        // Delete Variant
        editor.querySelectorAll('.ci-variant-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const vId = btn.dataset.vId;
                const ciId = btn.dataset.ciId;
                const item = items.find(i => i.id === ciId);
                if (!item) return;

                if (!confirm('Variante wirklich löschen?')) return;

                item.addon_item_variants = item.addon_item_variants.filter(v => v.id !== vId);
                refreshEditor();

                await deleteEntity('addon_item_variants', vId);
            }, { signal });
        });

        // Add Variant
        editor.querySelectorAll('.ci-add-variant').forEach(btn => {
            btn.addEventListener('click', async () => {
                const ciId = btn.dataset.ciId;
                const item = items.find(i => i.id === ciId);
                if (!item) return;

                const newVar = await createEntity('addon_item_variants', {
                    addon_item_id: ciId,
                    name: ''
                });

                if (newVar) {
                    item.addon_item_variants.push(newVar);
                    refreshEditor();
                }
            }, { signal });
        });

        // Selection Mode Change
        editor.querySelectorAll('.ci-mode').forEach(radio => {
            radio.addEventListener('change', async (e) => {
                const ciId = e.target.dataset.ciId;
                const item = items.find(i => i.id === ciId);
                if (!item) return;

                item.selection_mode = e.target.value;
                // No refresh needed, just update center
                addon.addon_items = items;
                updateCenter(buildCenterPreview(addon));

                await updateEntity('addon_items', ciId, { selection_mode: e.target.value });
            }, { signal });
        });

        // Applicability Change (per item)
        editor.querySelectorAll('.ci-applicability').forEach(sel => {
            sel.addEventListener('change', async (e) => {
                const ciId = e.target.dataset.ciId;
                const item = items.find(i => i.id === ciId);
                if (!item) return;

                const prevValue = item.applicability;
                item.applicability = e.target.value;
                addon.addon_items = items;
                updateCenter(buildCenterPreview(addon));

                try {
                    await updateEntity('addon_items', ciId, { applicability: e.target.value });
                } catch (err) {
                    console.error('Applicability update failed:', err);
                    item.applicability = prevValue;
                    addon.addon_items = items;
                    updateCenter(buildCenterPreview(addon));
                    refreshEditor();
                    const statusEl = document.getElementById('autosave-status');
                    if (statusEl) {
                        statusEl.innerHTML = '<span style="color:var(--color-red-600)">Fehler beim Speichern</span>';
                        statusEl.classList.add('visible');
                        setTimeout(() => statusEl.classList.remove('visible'), 3000);
                    }
                }
            }, { signal });
        });

        // Name Edit (Debounced)
        editor.querySelectorAll('.ci-name').forEach(input => {
            input.addEventListener('input', (e) => {
                const ciId = e.target.dataset.ciId;
                const item = items.find(i => i.id === ciId);
                if (!item) return;

                item.name = e.target.value;
                addon.addon_items = items;
                updateCenter(buildCenterPreview(addon)); // Live preview

                debounceUpdateItem(ciId, { name: e.target.value });
            }, { signal });
        });

        // Variant Name Edit (Debounced)
        editor.querySelectorAll('.ci-variant-name').forEach(input => {
            input.addEventListener('input', (e) => {
                const vId = e.target.dataset.vId;
                const ciId = e.target.dataset.ciId;
                const item = items.find(i => i.id === ciId);
                const variant = item?.addon_item_variants.find(v => v.id === vId);
                if (!variant) return;

                variant.name = e.target.value;
                addon.addon_items = items;
                updateCenter(buildCenterPreview(addon));

                debounceUpdateVariant(vId, { name: e.target.value });
            }, { signal });
        });

        // Bottom Add Item Button
        const bottomBtn = editor.querySelector('#add-content-item-btn-bottom');
        if (bottomBtn) {
            bottomBtn.addEventListener('click', handleAddItem, { signal });
        }
    };

    // Debounce helpers
    let itemTimeouts = {};
    const debounceUpdateItem = (id, updates) => {
        if (itemTimeouts[id]) clearTimeout(itemTimeouts[id]);
        itemTimeouts[id] = setTimeout(() => {
            updateEntity('addon_items', id, updates);
            delete itemTimeouts[id];
        }, 800);
    };

    let variantTimeouts = {};
    const debounceUpdateVariant = (id, updates) => {
        if (variantTimeouts[id]) clearTimeout(variantTimeouts[id]);
        variantTimeouts[id] = setTimeout(() => {
            updateEntity('addon_item_variants', id, updates);
            delete variantTimeouts[id];
        }, 800);
    };

    // Add Item Button (Top)
    const addBtn = card.querySelector('#add-content-item-btn');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddItem, { signal });
    }

    // Initial render
    refreshEditor();
};

// ── Main Render ──

export const renderAddonDetailPage = (params = {}) => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const addonId = params.id;
    if (!addonId) {
        renderDetailError('Keine Addon-ID angegeben.', () => navigate('addons'));
        return;
    }

    const ac = new AbortController();
    const gen = getNavigationGeneration();

    renderDetailLoading('Addon wird geladen...');
    loadAndRender(addonId, gen, ac.signal);

    // Cleanup: abort listeners when navigating away
    return () => ac.abort();
};

const loadAndRender = async (addonId, gen, signal) => {
    const addon = await fetchEntity('addons', addonId);

    // Stale navigation guard
    if (gen !== getNavigationGeneration()) return;

    if (!addon) {
        renderDetailError('Addon nicht gefunden.', () => navigate('addons'));
        return;
    }

    renderDetailLayout({
        centerContent: buildCenterPreview(addon),
        sideCardContent: renderSideCard(addon),
        breadcrumbHtml: `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('blocks-integration')} <a href="#" class="breadcrumb-link" data-nav="addons">Addons</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('blocks-integration')} ${esc(addon.name)}</span>
        `,
    });

    setupLivePreview(addonId, addon, signal);

    // Load all services for link selector
    const servicesResult = await fetchEntities('services', { perPage: 999 });
    const allServices = servicesResult.items;

    const serviceContainer = document.getElementById('link-services-container');
    if (serviceContainer) {
        const serviceSelect = createMultiSelectTags({
            label: 'Services', icon: 'list',
            placeholder: 'Service hinzufügen...',
            options: allServices.map(s => ({ value: s.id, label: s.name })),
            selectedValues: (addon.linked_services || []).map(ls => ls.service_id),
            onChange: async (ids) => {
                await syncJunctionTable('addon_services', 'addon_id', addonId, 'service_id', ids);
                addon.linked_services = ids.map(id => {
                    const found = allServices.find(s => s.id === id);
                    return { service_id: id, services: found ? { id: found.id, name: found.name } : { id, name: '—' } };
                });
                const values = collectFormValues();
                updateCenter(buildCenterPreview({ ...addon, ...values }));
                saveAddon(addonId, addon);
            }
        });
        serviceContainer.appendChild(serviceSelect.element);
    }

    // Breadcrumb nav
    document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        navigate(link.dataset.nav === 'home' ? 'bookings' : 'addons');
    }, { signal });

    // Footer actions removed (auto-save)
};
