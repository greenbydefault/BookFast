/**
 * Voucher Detail Page - Orchestrator
 * 2-column layout: Center (preview card) | Side Card (edit fields + meta + actions)
 */
import { fetchEntity, fetchEntities, updateEntity, invalidateCache, syncJunctionTable } from '../../lib/dataLayer.js';
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
const DISCOUNT_TYPE_LABELS = { percent: 'Prozent (%)', fixed: 'Festbetrag (€)' };

const fmt = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? '—' : n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE') : '—';
const formatDateInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

// ── Center Preview ──

const buildCenterPreview = (voucher) => {
    const linkedServices = voucher.linked_services || [];
    const discountDisplay = voucher.discount_type === 'percent'
        ? `${voucher.discount_value || 0} %`
        : fmt(voucher.discount_value);

    return `
        <div class="detail-preview-card">
            <div class="detail-preview-card__header">
                <div>
                    <h2 class="detail-preview-card__title">${esc(voucher.name) || 'Neuer Gutschein'}</h2>
                    <p style="color:var(--color-stone-500); font-size:0.9rem; margin-top:4px;">${esc(voucher.code)}</p>
                </div>
                 <div style="margin-left: auto; display: flex; align-items: center; gap: 12px;">
                    <div class="autosave-status" id="autosave-status"></div>
                </div>
            </div>

            <div class="detail-preview-block--description">
                <p class="detail-preview-section__title">Beschreibung</p>
                <div class="detail-preview-description">
                    <span class="detail-preview-value detail-preview-value--left">${voucher.description ? esc(voucher.description) : '<span style="color: var(--color-stone-400);">Keine Beschreibung</span>'}</span>
                </div>
            </div>
            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Gutschein-Details</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Code</span>
                    <span class="detail-preview-value" style="font-family: monospace; font-weight: 600;">${esc(voucher.code) || '—'}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Rabatt</span>
                    <span class="detail-preview-value">${discountDisplay}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Rabattart</span>
                    <span class="detail-preview-value">${DISCOUNT_TYPE_LABELS[voucher.discount_type] || voucher.discount_type || '—'}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Gültigkeit</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Gültig ab</span>
                    <span class="detail-preview-value">${formatDate(voucher.valid_from)}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Gültig bis</span>
                    <span class="detail-preview-value">${formatDate(voucher.valid_until)}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Nutzung</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Verwendet</span>
                    <span class="detail-preview-value">${voucher.times_used || 0}${voucher.max_uses_total ? ` / ${voucher.max_uses_total}` : ''}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Max. pro Kunde</span>
                    <span class="detail-preview-value">${voucher.max_uses_per_customer || 'Unbegrenzt'}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Verknüpfte Services</p>
                ${linkedServices.length > 0 ? linkedServices.map(ls => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value">${esc(ls.services?.name || '—')}</span>
                    </div>
                `).join('') : '<p style="color: var(--color-stone-400); font-size: 0.85rem;">Gilt für alle Services</p>'}
            </div>
        </div>
    `;
};

// ── Side Card (edit fields + meta + actions) ──

const renderSideCard = (voucher) => buildSideCardWithTabs({
    title: 'Gutschein Details',
    tabs: [
        {
            id: 'details',
            label: 'Details',
            sections: [
                sideCardSection({
                    title: 'Allgemein',
                    content: `
                        ${navField({ label: 'Name', name: 'name', value: esc(voucher.name), placeholder: 'Gutschein-Name' })}
                        ${navField({ label: 'Code', name: 'code', value: esc(voucher.code), placeholder: 'z.B. SUMMER2025' })}
                        ${navField({ label: 'Beschreibung', name: 'description', value: esc(voucher.description), tag: 'textarea', placeholder: 'Beschreibung...' })}
                    `
                }),
                sideCardSection({
                    title: 'Rabatt',
                    content: `
                        ${navField({
                            label: 'Rabattart', name: 'discount_type', tag: 'select',
                            options: Object.entries(DISCOUNT_TYPE_LABELS).map(([v, l]) => `<option value="${v}" ${voucher.discount_type === v ? 'selected' : ''}>${l}</option>`).join('')
                        })}
                        ${navField({ label: 'Rabattwert', name: 'discount_value', value: voucher.discount_value ?? '', type: 'number', placeholder: '0' })}
                    `
                }),
            ],
        },
        {
            id: 'gueltigkeit',
            label: 'Gültigkeit & Limits',
            sections: [
                sideCardSection({
                    title: 'Gültigkeit',
                    content: `
                        ${navField({ label: 'Gültig ab', name: 'valid_from', value: formatDateInput(voucher.valid_from), type: 'date' })}
                        ${navField({ label: 'Gültig bis', name: 'valid_until', value: formatDateInput(voucher.valid_until), type: 'date' })}
                    `
                }),
                sideCardSection({
                    title: 'Nutzungslimits',
                    content: `
                        ${navField({ label: 'Max. Nutzung gesamt', name: 'max_uses_total', value: voucher.max_uses_total ?? '', type: 'number', placeholder: 'Unbegrenzt' })}
                        ${navField({ label: 'Max. pro Kunde', name: 'max_uses_per_customer', value: voucher.max_uses_per_customer ?? '', type: 'number', placeholder: 'Unbegrenzt' })}
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

const collectFormValues = () => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return {};

    const val = (name) => card.querySelector(`[name="${name}"]`)?.value ?? '';
    const numOrNull = (name) => { const v = parseFloat(val(name)); return isNaN(v) ? null : v; };
    const dateOrNull = (name) => { const v = val(name); return v || null; };

    return {
        name: val('name'),
        code: val('code'),
        description: val('description'),
        discount_type: val('discount_type'),
        discount_value: numOrNull('discount_value'),
        valid_from: dateOrNull('valid_from'),
        valid_until: dateOrNull('valid_until'),
        max_uses_total: numOrNull('max_uses_total') !== null ? Math.round(numOrNull('max_uses_total')) : null,
        max_uses_per_customer: numOrNull('max_uses_per_customer') !== null ? Math.round(numOrNull('max_uses_per_customer')) : null,
    };
};

// ── Live Preview ──

const setupLivePreview = (voucherId, voucher, signal) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return;

    // Initialize debounced save
    const debouncedSave = debounce(() => saveVoucher(voucherId, voucher), 1000);

    const handler = (e) => {
        const values = collectFormValues();
        const merged = { ...voucher, ...values };

        // Debounced save
        debouncedSave();

        updateCenter(buildCenterPreview(merged));
    };

    card.addEventListener('input', handler, { signal });
    card.addEventListener('change', handler, { signal });
};

const saveVoucher = async (voucherId, voucherContext) => {
    const statusEl = document.getElementById('autosave-status');
    if (statusEl) {
        statusEl.innerHTML = '<div class="autosave-spinner"></div><span>Speichert...</span>';
        statusEl.classList.add('visible');
    }

    try {
        const updates = collectFormValues();
        await updateEntity('vouchers', voucherId, updates);
        invalidateCache('vouchers');

        // Update context
        Object.assign(voucherContext, updates);

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

// ── Main Render ──

export const renderVoucherDetailPage = (params = {}) => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const voucherId = params.id;
    if (!voucherId) {
        renderDetailError('Keine Gutschein-ID angegeben.', () => navigate('vouchers'));
        return;
    }

    const ac = new AbortController();
    const gen = getNavigationGeneration();

    renderDetailLoading('Gutschein wird geladen...');
    loadAndRender(voucherId, gen, ac.signal);

    return () => ac.abort();
};

const loadAndRender = async (voucherId, gen, signal) => {
    const voucher = await fetchEntity('vouchers', voucherId);

    if (gen !== getNavigationGeneration()) return;

    if (!voucher) {
        renderDetailError('Gutschein nicht gefunden.', () => navigate('vouchers'));
        return;
    }

    renderDetailLayout({
        centerContent: buildCenterPreview(voucher),
        sideCardContent: renderSideCard(voucher),
        breadcrumbHtml: `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('ticket-percent')} <a href="#" class="breadcrumb-link" data-nav="vouchers">Gutscheine</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('ticket-percent')} ${esc(voucher.name)}</span>
        `,
    });

    setupLivePreview(voucherId, voucher, signal);

    // Load all services for link selector
    const servicesResult = await fetchEntities('services', { perPage: 999 });
    const allServices = servicesResult.items;

    const serviceContainer = document.getElementById('link-services-container');
    if (serviceContainer) {
        const serviceSelect = createMultiSelectTags({
            label: 'Services', icon: 'list',
            placeholder: 'Service hinzufügen...',
            options: allServices.map(s => ({ value: s.id, label: s.name })),
            selectedValues: (voucher.linked_services || []).map(ls => ls.service_id),
            onChange: async (ids) => {
                await syncJunctionTable('voucher_services', 'voucher_id', voucherId, 'service_id', ids);
                voucher.linked_services = ids.map(id => {
                    const found = allServices.find(s => s.id === id);
                    return { service_id: id, services: found ? { id: found.id, name: found.name } : { id, name: '—' } };
                });
                const values = collectFormValues();
                updateCenter(buildCenterPreview({ ...voucher, ...values }));
                saveVoucher(voucherId, voucher);
            }
        });
        serviceContainer.appendChild(serviceSelect.element);
    }

    // Breadcrumb nav
    document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        navigate(link.dataset.nav === 'home' ? 'bookings' : 'vouchers');
    }, { signal });

    // Footer removed (auto-save)

};
