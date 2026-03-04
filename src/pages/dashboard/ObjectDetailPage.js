/**
 * Object Detail Page - Orchestrator
 * 2-column layout: Center (preview card) | Side Card (edit fields + meta + actions)
 */
import { fetchEntity, fetchEntities, updateEntity, invalidateCache } from '../../lib/dataLayer.js';
import { supabase } from '../../lib/supabaseClient.js';
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
import { createCustomHoursManager } from '../../components/CustomHours/CustomHours.js';

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DAY_IDS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const EN_TO_SHORT = { monday: 'Mo', tuesday: 'Di', wednesday: 'Mi', thursday: 'Do', friday: 'Fr', saturday: 'Sa', sunday: 'So' };

const normalizeDays = (days) => {
    if (!Array.isArray(days)) return [...DAY_IDS];
    return days.map(d => EN_TO_SHORT[d] || d).filter(d => DAY_IDS.includes(d));
};

const fmtTime = (v) => v ? v.slice(0, 5) : '—';

// ── Center Preview ──

const buildCenterPreview = (obj) => {
    const linkedServices = obj.services || [];
    const bookableDays = normalizeDays(obj.bookable_days);
    const isActive = obj.status !== 'draft';
    const badgeClass = isActive ? 'detail-preview-card__badge--active' : 'detail-preview-card__badge--draft';
    const badgeLabel = isActive ? `${getIconString('check')} Aktiv` : 'Entwurf';

    return `
        <div class="detail-preview-card">
            <div class="detail-preview-card__header">
                <h2 class="detail-preview-card__title">${esc(obj.name) || 'Neues Objekt'}</h2>
                <div style="margin-left: auto; display: flex; align-items: center; gap: 12px;">
                    <div class="autosave-status" id="autosave-status"></div>
                    <span class="detail-preview-card__badge ${badgeClass}">${badgeLabel}</span>
                </div>
            </div>

            <div class="detail-preview-block--description">
                <p class="detail-preview-section__title">Beschreibung <span class="detail-preview-section__title-optional">(Optional)</span></p>
                <div class="detail-preview-description">
                    <span class="detail-preview-value detail-preview-value--left">${obj.description ? esc(obj.description) : '<span class="text-small-muted">Optional: Was ist enthalten, was soll der Gast mitbringen, wichtige Hinweise …</span>'}</span>
                </div>
            </div>

            <div class="detail-preview-block">
                <div class="detail-preview-icon-row">
                    <div class="modal-label">${getIconString('user')} Kapazität</div>
                    <div class="modal-controls">
                        <div class="number-control">
                            <input type="number" class="number-input" value="${obj.capacity ?? 0}" readonly>
                        </div>
                    </div>
                </div>

                <div class="detail-preview-icon-row">
                    <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
                    <div class="modal-controls">
                        <div class="day-toggles">
                            ${DAY_IDS.map(day => `
                                <button class="day-toggle ${bookableDays.includes(day) ? 'active' : ''}" type="button" tabindex="-1">${day}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="detail-preview-icon-row">
                    <div class="modal-label">${getIconString('clock')} Buchungszeitfenster</div>
                    <div class="modal-controls">
                        <div class="control-group-row">
                            <span class="text-small">Von</span>
                            <div class="number-control">
                                <input type="text" class="number-input" value="${fmtTime(obj.booking_window_start)}" readonly style="width: 50px;">
                            </div>
                            <span class="text-small">Bis</span>
                            <div class="number-control">
                                <input type="text" class="number-input" value="${fmtTime(obj.booking_window_end)}" readonly style="width: 50px;">
                            </div>
                        </div>
                    </div>
                </div>

                ${Array.isArray(obj.custom_hours) && obj.custom_hours.length > 0 ? `
                <div class="detail-preview-icon-row" style="align-items: flex-start;">
                    <div class="modal-label">${getIconString('clock')} Individuelle Zeiten</div>
                    <div class="modal-controls modal-controls-column">
                        ${obj.custom_hours.map(h => `
                            <div class="control-group-row">
                                <span class="text-small" style="min-width: auto;">${(h.days || []).join(', ') || '—'}</span>
                                <div class="number-control">
                                    <input type="text" class="number-input" value="${fmtTime(h.from)}" readonly style="width: 50px;">
                                </div>
                                <span class="text-small">Bis</span>
                                <div class="number-control">
                                    <input type="text" class="number-input" value="${fmtTime(h.to)}" readonly style="width: 50px;">
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="detail-preview-block">
                <div class="detail-preview-icon-row">
                    <div class="modal-label">${getIconString('clean')} Reinigungspuffer</div>
                    <div class="modal-controls modal-controls-column">
                        <div class="control-group-row">
                            <span class="text-small">Davor</span>
                            <div class="number-control">
                                <input type="number" class="number-input" value="${obj.buffer_before_minutes ?? 0}" readonly>
                            </div>
                            <span class="text-small">Minuten</span>
                        </div>
                        <div class="control-group-row">
                            <span class="text-small">Danach</span>
                            <div class="number-control">
                                <input type="number" class="number-input" value="${obj.buffer_after_minutes ?? 0}" readonly>
                            </div>
                            <span class="text-small">Minuten</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-preview-block">
                <p class="detail-preview-section__title">${getIconString('list')} Services</p>
                ${linkedServices.length > 0 ? linkedServices.map(s => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value detail-preview-value--left">${esc(s.name || '—')}</span>
                    </div>
                `).join('') : `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value detail-preview-value--left text-small-muted">Keine Services verknüpft</span>
                    </div>
                `}
            </div>
        </div>
    `;
};

// ── Side Card (edit fields + meta + actions) ──

const renderSideCard = (obj) => {
    const bookableDays = normalizeDays(obj.bookable_days);
    const hasCustomHours = Array.isArray(obj.custom_hours) && obj.custom_hours.length > 0;

    return buildSideCardWithTabs({
        title: 'Objekt Details',
        tabs: [
            {
                id: 'details',
                label: 'Details',
                sections: [
                    sideCardSection({
                        content: `
                            ${navField({ label: 'Name', name: 'name', value: esc(obj.name), placeholder: 'Objekt-Name' })}
                            ${navField({ label: 'Beschreibung', name: 'description', value: esc(obj.description), tag: 'textarea', placeholder: 'Beschreibung...' })}
                            ${navField({ label: 'Kapazität', name: 'capacity', value: obj.capacity ?? 1, type: 'number', placeholder: '1' })}
                        `
                    }),
                ],
            },
            {
                id: 'zeiten',
                label: 'Zeiten',
                sections: [
                    sideCardSection({
                        title: 'Buchungseinstellungen',
                        content: `
                            <div class="detail-nav-field">
                                <label>Buchbare Tage</label>
                                <div class="day-toggles" id="day-toggles-container">
                                    ${DAY_IDS.map(day => `
                                        <button class="day-toggle ${bookableDays.includes(day) ? 'active' : ''}" data-day="${day}" type="button">${day}</button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="detail-nav-field-row">
                                ${navField({ label: 'Von', name: 'booking_window_start', value: obj.booking_window_start ? obj.booking_window_start.slice(0, 5) : '', type: 'time' })}
                                ${navField({ label: 'Bis', name: 'booking_window_end', value: obj.booking_window_end ? obj.booking_window_end.slice(0, 5) : '', type: 'time' })}
                            </div>
                            <div class="custom-hours-toggle-row">
                                <span class="custom-hours-toggle-label">Individuelle Zeiten pro Tag</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="toggle-custom-hours" ${hasCustomHours ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div id="custom-hours-detail-container" class="custom-hours-container" style="${hasCustomHours ? '' : 'display: none;'}"></div>
                        `
                    }),
                    sideCardSection({
                        title: 'Puffer',
                        content: `
                            <div class="detail-nav-field-row">
                                ${navField({ label: 'Vorher (Min.)', name: 'buffer_before_minutes', value: obj.buffer_before_minutes ?? '', type: 'number', placeholder: '0' })}
                                ${navField({ label: 'Nachher (Min.)', name: 'buffer_after_minutes', value: obj.buffer_after_minutes ?? '', type: 'number', placeholder: '0' })}
                            </div>
                        `
                    }),
                ],
            },
            {
                id: 'regeln',
                label: 'Regeln & Verknüpfungen',
                sections: [
                    sideCardSection({
                        title: 'Verknüpfte Services',
                        content: '<div id="link-services-container"></div>'
                    }),
                ],
            },
        ],
    });
};

// Custom hours manager instance (set in loadAndRender)
let chManager = null;

// ── Collect form values ──

const collectFormValues = () => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return {};

    const val = (name) => card.querySelector(`[name="${name}"]`)?.value ?? '';
    const intOrNull = (name) => { const v = parseInt(val(name), 10); return isNaN(v) ? null : v; };
    const timeOrNull = (name) => { const v = val(name); return v || null; };

    // Bookable days from toggle buttons
    const bookable_days = [...card.querySelectorAll('#day-toggles-container .day-toggle.active')].map(btn => btn.dataset.day);

    return {
        name: val('name'),
        description: val('description'),
        capacity: intOrNull('capacity') ?? 1,
        bookable_days,
        booking_window_start: timeOrNull('booking_window_start'),
        booking_window_end: timeOrNull('booking_window_end'),
        buffer_before_minutes: intOrNull('buffer_before_minutes'),
        buffer_after_minutes: intOrNull('buffer_after_minutes'),
        custom_hours: chManager ? chManager.getState() : null,
    };
};

// ── Live Preview ──

const setupLivePreview = (objectId, obj, signal) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return;

    // Initialize debounced save
    const debouncedSave = debounce(() => saveObject(objectId, obj), 1000);

    const handler = (e) => {
        const values = collectFormValues();
        const merged = { ...obj, ...values };

        // Debounced save
        debouncedSave();

        updateCenter(buildCenterPreview(merged));
    };

    card.addEventListener('input', handler, { signal });
    card.addEventListener('change', handler, { signal });

    // Day toggle buttons – direct click handlers
    card.querySelectorAll('.day-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            handler(); // Triggers debouncedSave via else branch?? No, handler calls debouncedSave
        }, { signal });
    });
};

const saveObject = async (objectId, objContext) => {
    const statusEl = document.getElementById('autosave-status');
    if (statusEl) {
        statusEl.innerHTML = '<div class="autosave-spinner"></div><span>Speichert...</span>';
        statusEl.classList.add('visible');
    }

    try {
        const updates = collectFormValues();
        await updateEntity('objects', objectId, updates);
        invalidateCache('objects');

        // Update context
        Object.assign(objContext, updates);

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

export const renderObjectDetailPage = (params = {}) => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const objectId = params.id;
    if (!objectId) {
        renderDetailError('Keine Objekt-ID angegeben.', () => navigate('objects'));
        return;
    }

    const ac = new AbortController();
    const gen = getNavigationGeneration();

    renderDetailLoading('Objekt wird geladen...');
    loadAndRender(objectId, gen, ac.signal);

    // Cleanup: abort listeners when navigating away
    return () => ac.abort();
};

const loadAndRender = async (objectId, gen, signal) => {
    const obj = await fetchEntity('objects', objectId);

    // Stale navigation guard
    if (gen !== getNavigationGeneration()) return;

    if (!obj) {
        renderDetailError('Objekt nicht gefunden.', () => navigate('objects'));
        return;
    }

    renderDetailLayout({
        centerContent: buildCenterPreview(obj),
        sideCardContent: renderSideCard(obj),
        breadcrumbHtml: `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('package')} <a href="#" class="breadcrumb-link" data-nav="objects">Objekte</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('package')} ${esc(obj.name)}</span>
        `,
    });

    setupLivePreview(objectId, obj, signal);

    // Setup custom hours via shared component
    const triggerChange = () => {
        const values = collectFormValues();
        const merged = { ...obj, ...values };
        updateCenter(buildCenterPreview(merged));
        saveObject(objectId, obj);
    };

    chManager = createCustomHoursManager({
        containerId: 'custom-hours-detail-container',
        toggleId: 'toggle-custom-hours',
        onChange: triggerChange,
    });
    chManager.init(obj.custom_hours);
    chManager.wireToggle(signal);

    // Load all services for link selector
    const servicesResult = await fetchEntities('services', { perPage: 999 });
    const allServices = servicesResult.items;
    const linkedServiceIds = (obj.services || []).map(s => s.id);

    const serviceContainer = document.getElementById('link-services-container');
    if (serviceContainer) {
        const serviceSelect = createMultiSelectTags({
            label: 'Services', icon: 'list',
            placeholder: 'Service hinzufügen...',
            options: allServices.map(s => ({ value: s.id, label: s.name })),
            selectedValues: linkedServiceIds,
            onChange: async (ids) => {
                // Removed services: set object_id to null
                const removed = linkedServiceIds.filter(id => !ids.includes(id));
                // Added services: set object_id to this object
                const added = ids.filter(id => !linkedServiceIds.includes(id));

                const promises = [];
                for (const sId of removed) {
                    promises.push(supabase.from('services').update({ object_id: null }).eq('id', sId));
                }
                for (const sId of added) {
                    promises.push(supabase.from('services').update({ object_id: objectId }).eq('id', sId));
                }
                await Promise.all(promises);

                // Update local state
                linkedServiceIds.length = 0;
                linkedServiceIds.push(...ids);
                obj.services = ids.map(id => {
                    const found = allServices.find(s => s.id === id);
                    return found ? { id: found.id, name: found.name } : { id, name: '—' };
                });

                const values = collectFormValues();
                updateCenter(buildCenterPreview({ ...obj, ...values }));
                saveObject(objectId, obj);
            }
        });
        serviceContainer.appendChild(serviceSelect.element);
    }

    // Breadcrumb nav
    document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        navigate(link.dataset.nav === 'home' ? 'bookings' : 'objects');
    }, { signal });

    // Footer removed (auto-save)

};
