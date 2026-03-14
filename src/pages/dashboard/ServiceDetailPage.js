/**
 * Service Detail Page - Orchestrator
 * 2-column layout: Center (preview card) | Side Card (edit fields + actions)
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
import { createCustomHoursManager } from '../../components/CustomHours/CustomHours.js';

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SERVICE_TYPE_LABELS = { hourly: 'Stündlich', daily: 'Tagesmiete', overnight: 'Übernachtung' };
const PRICE_UNITS = { hourly: 'Stunde', daily: 'Tag', overnight: 'Nacht' };

const DAY_IDS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const EN_TO_SHORT = { monday: 'Mo', tuesday: 'Di', wednesday: 'Mi', thursday: 'Do', friday: 'Fr', saturday: 'Sa', sunday: 'So' };
const normalizeDays = (days) => {
    if (!Array.isArray(days)) return [...DAY_IDS];
    return days.map(d => EN_TO_SHORT[d] || d).filter(d => DAY_IDS.includes(d));
};

const fmt = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? '—' : n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

const fmtTime = (v) => v ? v.slice(0, 5) : '—';

/** Calculate fixed start time slots from booking window + duration */
const calcFixedSlots = (windowStart, windowEnd, durationMin) => {
    if (!windowStart || !windowEnd || !durationMin || durationMin <= 0) return [];
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
    const toStr = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const start = toMin(windowStart);
    const end = toMin(windowEnd);
    if (start >= end) return [];
    const slots = [];
    for (let t = start; t + durationMin <= end; t += durationMin) {
        slots.push(`${toStr(t)} – ${toStr(t + durationMin)}`);
    }
    return slots;
};

// ── Center Preview ──

const buildCenterPreview = (service) => {
    const linkedObjects = service.objects ? (Array.isArray(service.objects) ? service.objects : [service.objects]) : [];
    const linkedAddons = service.addons || [];
    const linkedStaff = service.staff || [];
    const isOvernight = service.service_type === 'overnight';
    const isHourly = service.service_type === 'hourly';

    const bookableDays = normalizeDays(service.bookable_days);
    const bookableDaysDisplay = bookableDays.length === 7
        ? 'Alle Tage'
        : bookableDays.length > 0
            ? bookableDays.join(', ')
            : '—';

    // Fixed start time slots
    const showFixedSlots = isHourly && service.fixed_start_times;
    const fixedSlots = showFixedSlots
        ? calcFixedSlots(service.booking_window_start, service.booking_window_end, service.duration_minutes)
        : [];

    // Determine what's missing for slot calculation
    const slotMissing = [];
    if (showFixedSlots && fixedSlots.length === 0) {
        if (!service.duration_minutes) slotMissing.push('Dauer');
        if (!service.booking_window_start) slotMissing.push('Fenster von');
        if (!service.booking_window_end) slotMissing.push('Fenster bis');
    }

    const isActive = service.status !== 'draft';
    const badgeClass = isActive ? 'detail-preview-card__badge--active' : 'detail-preview-card__badge--draft';
    const badgeLabel = isActive ? `${getIconString('check')} Aktiv` : 'Entwurf';

    return `
        <div class="detail-preview-card">
            <div class="detail-preview-card__header">
                <h2 class="detail-preview-card__title">${esc(service.name) || 'Neuer Service'}</h2>
                <div style="margin-left: auto; display: flex; align-items: center; gap: 12px;">
                    <div class="autosave-status" id="autosave-status"></div>
                    <span class="detail-preview-card__badge ${badgeClass}">${badgeLabel}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Beschreibung</p>
                <div class="detail-preview-description">
                    <span class="detail-preview-value detail-preview-value--left">${service.description ? esc(service.description) : '<span style="color: var(--color-stone-400);">Keine Beschreibung</span>'}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Details</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Typ</span>
                    <span class="detail-preview-value">${SERVICE_TYPE_LABELS[service.service_type] || service.service_type || '—'}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Preis</span>
                    <span class="detail-preview-value">${fmt(service.price)} ${service.price_type === 'per_person' ? 'pro Person' : PRICE_UNITS[service.service_type] || ''}</span>
                </div>
                ${isHourly ? `
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Dauer</span>
                    <span class="detail-preview-value">${service.duration_minutes ? service.duration_minutes + ' Min.' : '—'}</span>
                </div>
                ` : ''}
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Reinigungsgebühr</span>
                    <span class="detail-preview-value">${service.cleaning_fee ? fmt(service.cleaning_fee) : '—'}</span>
                </div>
                ${isOvernight ? `
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Min. Nächte</span>
                    <span class="detail-preview-value">${service.min_nights || '—'}</span>
                </div>
                ` : ''}
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Buchungseinstellungen</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Buchbare Tage</span>
                    <span class="detail-preview-value">${bookableDaysDisplay}</span>
                </div>
                ${!isOvernight ? `
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Buchungsfenster</span>
                    <span class="detail-preview-value">${fmtTime(service.booking_window_start)} – ${fmtTime(service.booking_window_end)}</span>
                </div>
                ` : ''}
                ${!isOvernight && Array.isArray(service.custom_hours) && service.custom_hours.length > 0 ? `
                <div class="detail-preview-item" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                    <span class="detail-preview-label">Individuelle Zeiten</span>
                    <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
                        ${service.custom_hours.map(h => `
                            <div class="custom-hours-preview-row">
                                <span class="custom-hours-preview-days">${(h.days || []).join(', ') || '—'}</span>
                                <span class="custom-hours-preview-time">${fmtTime(h.from)} – ${fmtTime(h.to)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Mindestvorlauf</span>
                    <span class="detail-preview-value">${service.min_advance_hours ? service.min_advance_hours + ' Std.' : '—'}</span>
                </div>
            </div>

            ${showFixedSlots ? `
            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Feste Startzeiten</p>
                ${fixedSlots.length > 0 ? fixedSlots.map(slot => `
                <div class="detail-preview-item">
                    <span class="detail-preview-value" style="text-align: left; font-variant-numeric: tabular-nums;">${slot}</span>
                </div>
                `).join('') : `
                <div class="detail-preview-item">
                    <span class="detail-preview-value" style="text-align: left; color: var(--color-stone-400); font-size: 0.82rem;">
                        ${slotMissing.length > 0
                ? 'Bitte ' + slotMissing.join(' & ') + ' einstellen, um Slots zu berechnen.'
                : 'Buchungsfenster zu kurz für die eingestellte Dauer.'}
                    </span>
                </div>
                `}
            </div>
            ` : ''}

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Mehrfachbuchung</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Kapazitätsbasiert buchbar</span>
                    <span class="detail-preview-value">${service.capacity_based_booking ? 'Ja' : 'Nein'}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Puffer</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Vorher</span>
                    <span class="detail-preview-value">${service.buffer_before_minutes ? service.buffer_before_minutes + ' Min.' : '—'}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Nachher</span>
                    <span class="detail-preview-value">${service.buffer_after_minutes ? service.buffer_after_minutes + ' Min.' : '—'}</span>
                </div>
            </div>

            ${isOvernight ? `
            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Check-in / Check-out</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Check-in</span>
                    <span class="detail-preview-value">${fmtTime(service.checkin_start)}</span>
                </div>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Check-out</span>
                    <span class="detail-preview-value">${fmtTime(service.checkout_end)}</span>
                </div>
            </div>
            ` : ''}

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Verknüpfte Objekte</p>
                ${linkedObjects.length > 0 ? linkedObjects.map(o => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value">${esc(o.name || '—')}</span>
                    </div>
                `).join('') : `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value" style="color: var(--color-stone-400);">Keine Objekte verknüpft</span>
                    </div>
                `}
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Verknüpfte Addons</p>
                ${linkedAddons.length > 0 ? linkedAddons.map(a => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value">${esc(a.addons?.name || '—')}</span>
                    </div>
                `).join('') : `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value" style="color: var(--color-stone-400);">Keine Addons verknüpft</span>
                    </div>
                `}
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Verknüpfte Mitarbeiter</p>
                ${linkedStaff.length > 0 ? linkedStaff.map(s => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value">${esc(s.staff?.name || '—')}</span>
                    </div>
                `).join('') : `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value" style="color: var(--color-stone-400);">Keine Mitarbeiter verknüpft</span>
                    </div>
                `}
            </div>
        </div>
    `;
};

// ── Side Card (edit fields + actions) ──

const renderSideCard = (service) => {
    const type = service.service_type || 'hourly';
    const isOvernight = type === 'overnight';
    const isHourly = type === 'hourly';
    const bookableDays = normalizeDays(service.bookable_days);
    const hasCustomHours = Array.isArray(service.custom_hours) && service.custom_hours.length > 0;

    const detailsSections = [
        sideCardSection({
            content: `
                <div class="detail-nav-field">
                    <label>Typ</label>
                    <div class="detail-nav-readonly">${SERVICE_TYPE_LABELS[type]}</div>
                </div>
            `
        }),
        sideCardSection({
            content: `
                ${navField({ label: 'Name', name: 'name', value: esc(service.name), placeholder: 'Service-Name' })}
            `
        }),
        sideCardSection({
            content: `
                ${navField({ label: 'Beschreibung', name: 'description', value: esc(service.description), tag: 'textarea', placeholder: 'Beschreibung...' })}
            `
        }),
        sideCardSection({
            content: `
                ${navField({ label: 'Preis (€)', name: 'price', value: service.price ?? '', type: 'number', placeholder: '0.00' })}
                ${navField({ label: 'Preisart', name: 'price_type', tag: 'select', options: `
                    <option value="per_unit" ${(service.price_type || 'per_unit') === 'per_unit' ? 'selected' : ''}>${PRICE_UNITS[type]}</option>
                    <option value="per_person" ${service.price_type === 'per_person' ? 'selected' : ''}>pro Person</option>
                ` })}
            `
        }),
        ...(isHourly ? [sideCardSection({
            content: `
                ${navField({ label: 'Dauer (Minuten)', name: 'duration_minutes', value: service.duration_minutes ?? '', type: 'number', placeholder: '60' })}
            `
        })] : []),
        sideCardSection({
            content: `
                ${navField({ label: 'Reinigungsgebühr (€)', name: 'cleaning_fee', value: service.cleaning_fee ?? '', type: 'number', placeholder: '0.00' })}
            `
        }),
        ...(isOvernight ? [sideCardSection({
            content: `
                ${navField({ label: 'Min. Nächte', name: 'min_nights', value: service.min_nights ?? '', type: 'number', placeholder: '1' })}
            `
        })] : []),
    ];

    const zeitenSections = [
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
                ${!isOvernight ? `
                <div class="detail-nav-field-row">
                    ${navField({ label: 'Fenster von', name: 'booking_window_start', value: service.booking_window_start ? service.booking_window_start.slice(0, 5) : '', type: 'time' })}
                    ${navField({ label: 'Fenster bis', name: 'booking_window_end', value: service.booking_window_end ? service.booking_window_end.slice(0, 5) : '', type: 'time' })}
                </div>
                <div class="custom-hours-toggle-row">
                    <span class="custom-hours-toggle-label">Individuelle Zeiten pro Tag</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggle-svc-custom-hours" ${hasCustomHours ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div id="svc-custom-hours-container" class="custom-hours-container" style="${hasCustomHours ? '' : 'display: none;'}"></div>
                ` : ''}
                ${navField({ label: 'Mindestvorlauf (Std.)', name: 'min_advance_hours', value: service.min_advance_hours ?? '', type: 'number', placeholder: '0' })}
                ${isHourly ? `
                <div class="custom-hours-toggle-row">
                    <span class="custom-hours-toggle-label">Feste Startzeiten</span>
                    <label class="toggle-switch">
                        <input type="checkbox" name="fixed_start_times" ${service.fixed_start_times ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                ` : ''}
            `
        }),
        sideCardSection({
            title: 'Mehrfachbuchung',
            content: `
                <div class="custom-hours-toggle-row">
                    <span class="custom-hours-toggle-label">Kapazitätsbasiert buchbar</span>
                    <label class="toggle-switch">
                        <input type="checkbox" name="capacity_based_booking" ${service.capacity_based_booking ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <p class="detail-nav-hint" style="margin-top: 6px; font-size: 0.8rem; color: var(--color-stone-500);">Mehrere Buchungen pro Slot möglich, solange Objekt-Kapazität nicht überschritten wird.</p>
            `
        }),
        sideCardSection({
            title: 'Puffer',
            content: `
                <div class="detail-nav-field-row">
                    ${navField({ label: 'Vorher (Min.)', name: 'buffer_before_minutes', value: service.buffer_before_minutes ?? '', type: 'number', placeholder: '0' })}
                    ${navField({ label: 'Nachher (Min.)', name: 'buffer_after_minutes', value: service.buffer_after_minutes ?? '', type: 'number', placeholder: '0' })}
                </div>
            `
        }),
    ];
    if (isOvernight) {
        zeitenSections.push(sideCardSection({
            title: 'Check-in / Check-out',
            content: `
                <div class="detail-nav-field-row">
                    ${navField({ label: 'Check-in', name: 'checkin_start', value: service.checkin_start ? service.checkin_start.slice(0, 5) : '', type: 'time' })}
                    ${navField({ label: 'Check-out', name: 'checkout_end', value: service.checkout_end ? service.checkout_end.slice(0, 5) : '', type: 'time' })}
                </div>
            `
        }));
    }

    return buildSideCardWithTabs({
        title: 'Service Details',
        tabs: [
            { id: 'details', label: 'Details', sections: detailsSections },
            { id: 'zeiten', label: 'Zeiten & Puffer', sections: zeitenSections },
            {
                id: 'verknuepfungen',
                label: 'Verknüpfungen',
                sections: [
                    sideCardSection({
                        title: 'Verknüpfungen',
                        content: `
                            <div id="link-addons-container"></div>
                            <div id="link-staff-container" class="detail-nav-link-group"></div>
                        `
                    }),
                ],
            },
        ],
    });
};

// Custom hours manager instance (set in loadAndRender)
let svcChManager = null;

// ── Collect form values ──

const collectFormValues = (currentType) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return {};

    const val = (name) => card.querySelector(`[name="${name}"]`)?.value ?? '';
    const numOrNull = (name) => { const v = parseFloat(val(name)); return isNaN(v) ? null : v; };
    const intOrNull = (name) => { const n = numOrNull(name); return n !== null ? Math.round(n) : null; };
    const timeOrNull = (name) => { const v = val(name); return v || null; };
    const checked = (name) => card.querySelector(`[name="${name}"]`)?.checked || false;

    const serviceType = currentType;

    // Bookable days from toggle buttons (only from the day-toggles-container, not custom hours toggles)
    const bookable_days = [...card.querySelectorAll('#day-toggles-container .day-toggle.active')].map(btn => btn.dataset.day);

    const data = {
        name: val('name'),
        description: val('description'),
        price: numOrNull('price'),
        price_type: val('price_type') || 'per_unit',
        cleaning_fee: numOrNull('cleaning_fee'),
        buffer_before_minutes: intOrNull('buffer_before_minutes'),
        buffer_after_minutes: intOrNull('buffer_after_minutes'),
        capacity_based_booking: checked('capacity_based_booking'),
        bookable_days,
        min_advance_hours: intOrNull('min_advance_hours'),
    };

    if (serviceType === 'hourly') {
        data.duration_minutes = intOrNull('duration_minutes');
        data.fixed_start_times = checked('fixed_start_times');
        data.booking_window_start = timeOrNull('booking_window_start');
        data.booking_window_end = timeOrNull('booking_window_end');
        data.custom_hours = svcChManager ? svcChManager.getState() : null;
    } else if (serviceType === 'daily') {
        data.booking_window_start = timeOrNull('booking_window_start');
        data.booking_window_end = timeOrNull('booking_window_end');
        data.custom_hours = svcChManager ? svcChManager.getState() : null;
    } else if (serviceType === 'overnight') {
        data.min_nights = intOrNull('min_nights');
        data.checkin_start = timeOrNull('checkin_start');
        data.checkout_end = timeOrNull('checkout_end');
        data.custom_hours = null;
    }

    return data;
};

// ── Live Preview & Interactivity ──
// NOTE: currentService is now a closure variable inside renderServiceDetailPage,
// shared via the `ctx` object to avoid stale module-level state.

const triggerUpdate = (ctx) => {
    const values = collectFormValues(ctx.currentService.service_type);
    const merged = { ...ctx.currentService, ...values };
    updateCenter(buildCenterPreview(merged));
};

/** Attach all interactive listeners to the side card */
/** Attach all interactive listeners to the side card */
const wireUpSideCard = (serviceId, ctx, signal) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return;

    // Initialize debounced save
    const debouncedSave = debounce(() => saveService(serviceId, ctx), 1000);

    // Day toggle buttons – direct click handlers (only main day toggles, not custom hours)
    card.querySelectorAll('#day-toggles-container .day-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            triggerUpdate(ctx);
            debouncedSave();
        }, { signal });
    });

    // Input/change for form fields
    const fieldHandler = (e) => {
        const values = collectFormValues(ctx.currentService.service_type);
        const merged = { ...ctx.currentService, ...values };

        // Debounced save for fields
        debouncedSave();

        // Toggle changed → rebuild to show/hide slot preview reactively
        if (e?.target?.name === 'fixed_start_times') {
            ctx.currentService = { ...ctx.currentService, ...values };
        }

        updateCenter(buildCenterPreview(merged));
    };

    card.addEventListener('input', fieldHandler, { signal });
    card.addEventListener('change', fieldHandler, { signal });
};

/** Mount MultiSelectTags for Addons + Staff into side card containers */
const mountLinkSelectors = (service, serviceId, ctx) => {
    if (!ctx.allAddons || !ctx.allStaff) return;

    const addonContainer = document.getElementById('link-addons-container');
    if (addonContainer) {
        addonContainer.innerHTML = '';
        const addonSelect = createMultiSelectTags({
            label: 'Addons', icon: 'blocks-integration',
            placeholder: 'Addon hinzufügen...',
            options: ctx.allAddons.map(a => ({ value: a.id, label: a.name })),
            selectedValues: (ctx.currentService.addons || []).map(a => a.addon_id),
            onChange: async (ids) => {
                await syncJunctionTable('addon_services', 'service_id', serviceId, 'addon_id', ids);
                // Update local state for preview
                ctx.currentService.addons = ids.map(id => {
                    const found = ctx.allAddons.find(a => a.id === id);
                    return { addon_id: id, addons: found ? { id: found.id, name: found.name } : { id, name: '—' } };
                });
                const values = collectFormValues(ctx.currentService.service_type);
                updateCenter(buildCenterPreview({ ...ctx.currentService, ...values }));
            }
        });
        addonContainer.appendChild(addonSelect.element);
    }

    const staffContainer = document.getElementById('link-staff-container');
    if (staffContainer) {
        staffContainer.innerHTML = '';
        const staffSelect = createMultiSelectTags({
            label: 'Mitarbeiter', icon: 'user',
            placeholder: 'Mitarbeiter hinzufügen...',
            options: ctx.allStaff.map(s => ({ value: s.id, label: s.name })),
            selectedValues: (ctx.currentService.staff || []).map(s => s.staff_id),
            onChange: async (ids) => {
                await syncJunctionTable('staff_services', 'service_id', serviceId, 'staff_id', ids);
                ctx.currentService.staff = ids.map(id => {
                    const found = ctx.allStaff.find(s => s.id === id);
                    return { staff_id: id, staff: found ? { id: found.id, name: found.name } : { id, name: '—' } };
                });
                const values = collectFormValues(ctx.currentService.service_type);
                updateCenter(buildCenterPreview({ ...ctx.currentService, ...values }));
            }
        });
        staffContainer.appendChild(staffSelect.element);
    }
};



const saveService = async (serviceId, ctx) => {
    const statusEl = document.getElementById('autosave-status');
    if (statusEl) {
        statusEl.innerHTML = '<div class="autosave-spinner"></div><span>Speichert...</span>';
        statusEl.classList.add('visible');
    }

    try {
        const updates = collectFormValues(ctx.currentService.service_type);
        await updateEntity('services', serviceId, updates);
        invalidateCache('services');

        // Update context correctly
        ctx.currentService = { ...ctx.currentService, ...updates };

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

const attachFooterActions = (serviceId, signal) => {
    // Footer removed for auto-save
};

// ── Main Render ──

export const renderServiceDetailPage = (params = {}) => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const serviceId = params.id;
    if (!serviceId) {
        renderDetailError('Keine Service-ID angegeben.', () => navigate('services'));
        return;
    }

    const ac = new AbortController();
    const gen = getNavigationGeneration();
    // Closure-level state instead of module-level
    const ctx = { currentService: null };

    renderDetailLoading('Service wird geladen...');
    loadAndRender(serviceId, gen, ac.signal, ctx);

    return () => ac.abort();
};

const loadAndRender = async (serviceId, gen, signal, ctx) => {
    const service = await fetchEntity('services', serviceId);

    if (gen !== getNavigationGeneration()) return;

    if (!service) {
        renderDetailError('Service nicht gefunden.', () => navigate('services'));
        return;
    }

    ctx.currentService = { ...service };

    renderDetailLayout({
        centerContent: buildCenterPreview(service),
        sideCardContent: renderSideCard(service),
        breadcrumbHtml: `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('list')} <a href="#" class="breadcrumb-link" data-nav="services">Services</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('list')} ${esc(service.name)}</span>
        `,
    });

    wireUpSideCard(serviceId, ctx, signal);

    // Initialize and wire up custom hours for non-overnight types
    const isOvernight = (ctx.currentService.service_type === 'overnight');
    if (!isOvernight) {
        const debouncedSaveFn = debounce(() => saveService(serviceId, ctx), 1000);
        const triggerCh = () => {
            const values = collectFormValues(ctx.currentService.service_type);
            const merged = { ...ctx.currentService, ...values };
            updateCenter(buildCenterPreview(merged));
            debouncedSaveFn();
        };

        svcChManager = createCustomHoursManager({
            containerId: 'svc-custom-hours-container',
            toggleId: 'toggle-svc-custom-hours',
            onChange: triggerCh,
        });
        svcChManager.init(ctx.currentService.custom_hours);
        svcChManager.wireToggle(signal);
    }

    // Load options for link selectors, then mount
    const [addonsResult, staffResult] = await Promise.all([
        fetchEntities('addons', { perPage: 999 }),
        fetchEntities('staff', { perPage: 999 }),
    ]);
    ctx.allAddons = addonsResult.items;
    ctx.allStaff = staffResult.items;
    mountLinkSelectors(service, serviceId, ctx);

    // Breadcrumb nav
    document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        navigate(link.dataset.nav === 'home' ? 'bookings' : 'services');
    }, { signal });
};
