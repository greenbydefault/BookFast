import { getIconString } from '../../../../components/Icons/Icon.js';
import { getState } from '../../../../lib/store.js';
import { formatDate } from '../../../../lib/dateUtils.js';
import { SearchDropdown } from '../../../../components/SearchDropdown/SearchDropdown.js';
import {
    fetchBookingCustomers,
    fetchBookingModalData,
    fetchAvailabilityForRange,
    checkAvailabilityForBooking,
    createManualBooking,
} from '../../../../lib/services/bookingService.js';
import { STEPS, initialModalState, getStepTitle } from './createBookingState.js';
import {
    parseISODate,
    formatISODate,
    extractTimePart,
    parseTimeToMinutes,
    formatMinutesToTime,
    resolveWindowForDate,
    extractBookingsForDay,
    normalizeBookingInterval,
    isSameDay,
    isInRange,
    isPastDate,
} from './createBookingAvailability.js';

const CALENDAR_DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const CALENDAR_MONTHS = ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

let modalState = initialModalState();

const showToast = (message, type = 'info') => {
    alert(`${type.toUpperCase()}: ${message}`);
};

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const isHourlyService = (service) => service?.service_type === 'hourly';
const isOvernightService = (service) => service?.service_type === 'overnight';
const isDailyService = (service) => service?.service_type === 'daily';

const buildDefaultItem = (itemDef) => {
    const variants = itemDef?.addon_item_variants || [];
    const firstVariant = variants[0]?.name || null;
    const mode = itemDef?.selection_mode || 'quantity';

    if (mode === 'single_choice' && variants.length > 0) {
        return { variant: firstVariant };
    }
    return {
        qty: 1,
        variant: firstVariant || null,
    };
};

const buildBookingItems = (addon) => {
    const defs = addon?.addon_items || [];
    const items = [];
    defs.forEach((def, idx) => {
        if (def.applicability === 'booking') {
            items[idx] = buildDefaultItem(def);
        }
    });
    return items;
};

const buildGuestItems = (addon) => {
    const defs = addon?.addon_items || [];
    const items = [];
    defs.forEach((def, idx) => {
        if (!def.applicability || def.applicability === 'guest') {
            items[idx] = buildDefaultItem(def);
        }
    });
    return items;
};

const getAddonSelection = (addonId) => modalState.addons.find((a) => a.id === addonId);

const toggleAddonSelection = (addonId, checked) => {
    const existingIndex = modalState.addons.findIndex((a) => a.id === addonId);
    if (!checked) {
        if (existingIndex >= 0) modalState.addons.splice(existingIndex, 1);
        return;
    }
    if (existingIndex >= 0) return;
    const addon = modalState.data.addons.find((a) => a.id === addonId);
    if (!addon) return;

    const addonItems = addon.addon_items || [];
    if (addonItems.length === 0) {
        modalState.addons.push({ id: addonId });
        return;
    }

    const bookingItems = buildBookingItems(addon);
    const guests = [];
    for (let i = 0; i < modalState.guestCount; i += 1) {
        guests.push({ items: buildGuestItems(addon) });
    }
    modalState.addons.push({ id: addonId, items: bookingItems, guests });
};

const syncAddonGuestsToGuestCount = () => {
    modalState.addons.forEach((selectedAddon) => {
        const addonDef = modalState.data.addons.find((a) => a.id === selectedAddon.id);
        const hasGuestItems = (addonDef?.addon_items || []).some((item) => !item.applicability || item.applicability === 'guest');
        if (!hasGuestItems) return;

        if (!Array.isArray(selectedAddon.guests)) selectedAddon.guests = [];
        while (selectedAddon.guests.length < modalState.guestCount) {
            selectedAddon.guests.push({ items: buildGuestItems(addonDef) });
        }
        if (selectedAddon.guests.length > modalState.guestCount) {
            selectedAddon.guests.length = modalState.guestCount;
        }
    });
};

const updateAddonItemSelection = ({ addonId, scope, guestIndex, itemIndex, field, value }) => {
    const selectedAddon = getAddonSelection(addonId);
    if (!selectedAddon) return;

    if (scope === 'booking') {
        if (!Array.isArray(selectedAddon.items)) selectedAddon.items = [];
        if (!selectedAddon.items[itemIndex]) selectedAddon.items[itemIndex] = { qty: 1, variant: null };
        if (field === 'qty') selectedAddon.items[itemIndex].qty = Math.max(1, Number(value) || 1);
        if (field === 'variant') selectedAddon.items[itemIndex].variant = value || null;
        return;
    }

    if (scope === 'guest') {
        if (!Array.isArray(selectedAddon.guests)) selectedAddon.guests = [];
        if (!selectedAddon.guests[guestIndex]) selectedAddon.guests[guestIndex] = { items: [] };
        if (!Array.isArray(selectedAddon.guests[guestIndex].items)) selectedAddon.guests[guestIndex].items = [];
        if (!selectedAddon.guests[guestIndex].items[itemIndex]) selectedAddon.guests[guestIndex].items[itemIndex] = { qty: 1, variant: null };
        if (field === 'qty') selectedAddon.guests[guestIndex].items[itemIndex].qty = Math.max(1, Number(value) || 1);
        if (field === 'variant') selectedAddon.guests[guestIndex].items[itemIndex].variant = value || null;
    }
};

const renderAddonItemControl = ({ addonId, item, selection, scope, guestIndex, itemIndex }) => {
    const variants = item.addon_item_variants || [];
    const mode = item.selection_mode || 'quantity';

    if (mode === 'single_choice' && variants.length > 0) {
        const currentVariant = selection?.variant || variants[0].name;
        return `
            <select
                class="modal-form-input cb-addon-field"
                data-addon-id="${addonId}"
                data-scope="${scope}"
                data-guest-index="${guestIndex}"
                data-item-index="${itemIndex}"
                data-field="variant"
            >
                    ${variants.map((variant) => `<option value="${escapeHtml(variant.name)}" ${variant.name === currentVariant ? 'selected' : ''}>${escapeHtml(variant.name)}</option>`).join('')}
            </select>
        `;
    }

    const qty = Math.max(1, Number(selection?.qty) || Number(item.quantity) || 1);
    const variantSelect =
        mode === 'quantity' && variants.length > 0
            ? (() => {
                const currentVariant = selection?.variant || variants[0].name;
                return `
                <select
                    class="modal-form-input cb-addon-field"
                    data-addon-id="${addonId}"
                    data-scope="${scope}"
                    data-guest-index="${guestIndex}"
                    data-item-index="${itemIndex}"
                    data-field="variant"
                >
                    ${variants.map((v) => `<option value="${escapeHtml(v.name)}" ${v.name === currentVariant ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('')}
                </select>
            `;
            })()
            : '';

    if (variantSelect) {
        return `
            <div class="cb-addon-qty-row">
                <input
                    type="number"
                    min="1"
                    class="modal-form-input cb-addon-field"
                    value="${qty}"
                    data-addon-id="${addonId}"
                    data-scope="${scope}"
                    data-guest-index="${guestIndex}"
                    data-item-index="${itemIndex}"
                    data-field="qty"
                >
                ${variantSelect}
            </div>
        `;
    }

    return `
        <input
            type="number"
            min="1"
            class="modal-form-input cb-addon-field"
            value="${qty}"
            data-addon-id="${addonId}"
            data-scope="${scope}"
            data-guest-index="${guestIndex}"
            data-item-index="${itemIndex}"
            data-field="qty"
        >
    `;
};

const renderAddonConfiguration = (addon, selectedAddon) => {
    const items = addon.addon_items || [];
    if (!selectedAddon || items.length === 0) return '';

    const bookingItems = items
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) => item.applicability === 'booking');

    const guestItems = items
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) => !item.applicability || item.applicability === 'guest');

    const bookingSection = bookingItems.length
        ? `
            <div class="cb-addon-config-section">
                <h5>Pro Buchung</h5>
                ${bookingItems.map(({ item, idx }) => {
            const hasVariants = (item.addon_item_variants || []).length > 0;
            const mode = item.selection_mode || 'quantity';
            const label = mode === 'single_choice' ? 'Variante' : hasVariants ? 'Menge & Variante' : 'Menge';
            return `
                    <div class="cb-addon-config-row">
                        <div class="cb-addon-config-label">
                            <strong>${escapeHtml(item.name)}</strong>
                            <span>${label}</span>
                        </div>
                        ${renderAddonItemControl({
                addonId: addon.id,
                item,
                selection: selectedAddon.items?.[idx],
                scope: 'booking',
                guestIndex: -1,
                itemIndex: idx,
            })}
                    </div>
                `;
        }).join('')}
            </div>
        `
        : '';

    const guestSection = guestItems.length
        ? `
            <div class="cb-addon-config-section">
                <h5>Pro Gast</h5>
                ${Array.from({ length: modalState.guestCount }, (_, guestIdx) => `
                    <div class="cb-addon-guest-group">
                        <div class="cb-addon-guest-title">Gast ${guestIdx + 1}</div>
                        ${guestItems.map(({ item, idx }) => {
            const hasVariants = (item.addon_item_variants || []).length > 0;
            const mode = item.selection_mode || 'quantity';
            const label = mode === 'single_choice' ? 'Variante' : hasVariants ? 'Menge & Variante' : 'Menge';
            return `
                            <div class="cb-addon-config-row">
                                <div class="cb-addon-config-label">
                                    <strong>${escapeHtml(item.name)}</strong>
                                    <span>${label}</span>
                                </div>
                                ${renderAddonItemControl({
                addonId: addon.id,
                item,
                selection: selectedAddon.guests?.[guestIdx]?.items?.[idx],
                scope: 'guest',
                guestIndex: guestIdx,
                itemIndex: idx,
            })}
                            </div>
                        `;
        }).join('')}
                    </div>
                `).join('')}
            </div>
        `
        : '';

    return `
        <div class="cb-addon-config">
            ${bookingSection}
            ${guestSection}
        </div>
    `;
};

const buildAddonSelectionsPayload = () => {
    return modalState.addons.map((selectedAddon) => {
        const addon = modalState.data.addons.find((a) => a.id === selectedAddon.id);
        if (!addon) return null;
        const defs = addon.addon_items || [];
        const result = { addon_id: selectedAddon.id, addon_name: addon.name };

        if (Array.isArray(selectedAddon.items)) {
            const bookingItems = selectedAddon.items.map((itemSelection, idx) => {
                if (!itemSelection) return null;
                const def = defs[idx];
                if (!def) return null;
                return {
                    name: def.name || '',
                    variant: itemSelection.variant || null,
                    qty: Math.max(1, Number(itemSelection.qty) || 1),
                };
            }).filter(Boolean);
            if (bookingItems.length) result.items = bookingItems;
        }

        if (Array.isArray(selectedAddon.guests)) {
            const guestSelections = selectedAddon.guests.map((guest, guestIdx) => {
                const guestItems = (guest?.items || []).map((itemSelection, idx) => {
                    if (!itemSelection) return null;
                    const def = defs[idx];
                    if (!def) return null;
                    return {
                        name: def.name || '',
                        variant: itemSelection.variant || null,
                        qty: Math.max(1, Number(itemSelection.qty) || 1),
                    };
                }).filter(Boolean);
                return guestItems.length ? { guest: guestIdx + 1, items: guestItems } : null;
            }).filter(Boolean);
            if (guestSelections.length) result.guests = guestSelections;
        }

        return result;
    }).filter(Boolean);
};

const getCalendarBookingCountMap = () => {
    const counts = new Map();
    (modalState.calendarData?.bookings || []).forEach((entry) => {
        if (!entry?.date) return;
        counts.set(entry.date, (counts.get(entry.date) || 0) + 1);
    });
    return counts;
};

const renderCalendarDays = () => {
    const month = modalState.calendarMonth;
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const start = new Date(firstDay);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const blockedDates = modalState.calendarData?.blocked_dates || [];
    const bookingCountMap = getCalendarBookingCountMap();
    const todayISO = formatISODate(new Date());

    return Array.from({ length: 42 }, (_, i) => {
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + i);
        const dayISO = formatISODate(dayDate);
        const outsideMonth = dayDate.getMonth() !== monthIndex;
        const blocked = blockedDates.includes(dayISO);
        const selected = isSameDay(dayDate, modalState.startDate) || isSameDay(dayDate, modalState.endDate);
        const inRange = modalState.service?.service_type === 'overnight' && isInRange(dayISO, modalState.startDate, modalState.endDate);
        const isToday = dayISO === todayISO;
        const bookedCount = bookingCountMap.get(dayISO) || 0;
        const canClick = !outsideMonth && !blocked && !isPastDate(dayISO);

        const classes = [
            'cb-day',
            outsideMonth ? 'cb-day--other-month' : '',
            blocked ? 'cb-day--blocked' : '',
            selected ? 'cb-day--selected' : '',
            inRange ? 'cb-day--in-range' : '',
            isToday ? 'cb-day--today' : '',
        ].filter(Boolean).join(' ');

        return `
            <button
                type="button"
                class="${classes}"
                ${canClick ? `data-cal-date="${dayISO}"` : ''}
                ${canClick ? '' : 'disabled'}
            >
                <span class="cb-day-number">${dayDate.getDate()}</span>
                ${bookedCount > 0 ? `<span class="cb-day-booked-dot">${bookedCount}</span>` : ''}
            </button>
        `;
    }).join('');
};

const renderDateStepContent = () => {
    const month = modalState.calendarMonth;
    const isHourly = isHourlyService(modalState.service);
    const isOvernight = isOvernightService(modalState.service);

    const slotsHtml = isHourly
        ? `
        <div class="cb-date-side-section">
            <label class="modal-form-label">Verfuegbare Zeiten</label>
            <div id="cb-slots-list" class="cb-slots-list">
                ${modalState.slots.length === 0
            ? '<p class="cb-muted-text">Bitte zuerst einen Tag waehlen.</p>'
            : modalState.slots.map((slot) => `
                        <button
                            type="button"
                            class="cb-slot ${modalState.time === slot.time ? 'cb-slot--selected' : ''} ${slot.available === false ? 'cb-slot--disabled' : ''}"
                            data-slot-time="${slot.time}"
                            data-slot-available="${slot.available === false ? '0' : '1'}"
                            ${slot.available === false ? 'disabled' : ''}
                        >
                            ${slot.time}
                        </button>
                    `).join('')}
            </div>
        </div>
        `
        : '';

    const availabilityHtml = modalState.availabilityStatus
        ? `<div class="cb-avail-status ${modalState.availabilityStatus === 'available' ? 'cb-avail-ok' : 'cb-avail-nok'}">${modalState.availabilityStatus === 'available' ? 'Verfuegbar' : 'Nicht verfuegbar (trotzdem buchen moeglich)'}</div>`
        : '';

    return `
        <div class="cb-date-layout">
            <div class="cb-calendar">
                <div class="cb-cal-header">
                    <button type="button" class="btn btn-outline cb-cal-nav" data-cal-nav="-1">Zurueck</button>
                    <strong>${CALENDAR_MONTHS[month.getMonth()]} ${month.getFullYear()}</strong>
                    <button type="button" class="btn btn-outline cb-cal-nav" data-cal-nav="1">Weiter</button>
                </div>
                <div class="cb-cal-grid">
                    <div class="cb-cal-weekdays">
                        ${CALENDAR_DAYS.map((day) => `<span>${day}</span>`).join('')}
                    </div>
                    <div class="cb-cal-days">
                        ${modalState.calendarLoading
            ? '<div class="cb-calendar-loading">Lade Verfuegbarkeit ...</div>'
            : renderCalendarDays()}
                    </div>
                </div>
            </div>

            <div class="cb-date-side">
                <div class="cb-date-side-section">
                    <label class="modal-form-label">Startdatum</label>
                    <input type="text" class="modal-form-input" value="${modalState.startDate ? formatDate(modalState.startDate) : ''}" readonly>
                </div>
                ${isOvernight
            ? `
                    <div class="cb-date-side-section">
                        <label class="modal-form-label">Abreisedatum</label>
                        <input type="text" class="modal-form-input" value="${modalState.endDate ? formatDate(modalState.endDate) : ''}" readonly>
                        <small class="cb-muted-text">${modalState.selectingEndDate ? 'Bitte Checkout-Datum im Kalender waehlen.' : 'Erst Start waehlen, dann Checkout.'}</small>
                    </div>
                    `
            : ''}
                ${slotsHtml}
                ${availabilityHtml}
            </div>
        </div>
    `;
};

const getStepContent = (step) => {
    switch (step) {
        case STEPS.SEARCH_CUSTOMER:
            return `
                <div class="modal-content-section">
                    <div class="modal-form-field">
                        <label class="modal-form-label">Kunde suchen (Name oder E-Mail)</label>
                        <div id="cb-customer-search-container"></div>
                    </div>
                </div>
                <div class="modal-content-section">
                    <div class="cb-grid-2">
                        <div class="modal-form-field">
                            <label class="modal-form-label">Vorname</label>
                            <input type="text" id="cb-fname" class="modal-form-input" value="${escapeHtml(modalState.customer?.fname || '')}">
                        </div>
                        <div class="modal-form-field">
                            <label class="modal-form-label">Nachname</label>
                            <input type="text" id="cb-lname" class="modal-form-input" value="${escapeHtml(modalState.customer?.lname || '')}">
                        </div>
                    </div>
                    <div class="cb-grid-2">
                        <div class="modal-form-field">
                            <label class="modal-form-label">E-Mail *</label>
                            <input type="email" id="cb-email" class="modal-form-input" value="${escapeHtml(modalState.customer?.email || '')}">
                        </div>
                        <div class="modal-form-field">
                            <label class="modal-form-label">Telefon</label>
                            <input type="tel" id="cb-phone" class="modal-form-input" value="${escapeHtml(modalState.customer?.phone || '')}">
                        </div>
                    </div>
                    <div class="modal-form-field">
                        <label class="modal-form-label">Notizen</label>
                        <textarea id="cb-notes" class="modal-form-input" rows="2">${escapeHtml(modalState.customer?.notes || '')}</textarea>
                    </div>
                </div>
            `;
        case STEPS.SELECT_OBJECT:
            return `
                <div class="cb-option-list">
                    ${modalState.data.objects.map((obj) => `
                        <label class="modal-option-card">
                            <input type="radio" name="cb-object" value="${escapeHtml(obj.id)}" ${modalState.object?.id === obj.id ? 'checked' : ''}>
                            <div>
                                <div class="cb-option-title">${escapeHtml(obj.name)}</div>
                                <div class="cb-option-subtitle">${escapeHtml(obj.description || '')}</div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            `;
        case STEPS.SELECT_SERVICE: {
            const services = modalState.data.services.filter((s) => s.object_id === modalState.object?.id && s.status === 'active');
            return `
                <div class="cb-option-list">
                    ${services.length === 0 ? '<p class="cb-muted-text">Keine Services fuer dieses Objekt verfuegbar.</p>' : ''}
                    ${services.map((svc) => `
                        <label class="modal-option-card">
                            <input type="radio" name="cb-service" value="${escapeHtml(svc.id)}" ${modalState.service?.id === svc.id ? 'checked' : ''}>
                            <div class="cb-option-row">
                                <div>
                                    <div class="cb-option-title">${escapeHtml(svc.name)}</div>
                                    <div class="cb-option-subtitle">${svc.duration_minutes ? `${svc.duration_minutes} Min` : ''} ${isOvernightService(svc) ? 'pro Nacht' : isDailyService(svc) ? 'pro Tag' : ''}</div>
                                </div>
                                <strong>${svc.price} EUR</strong>
                            </div>
                        </label>
                    `).join('')}
                </div>
                ${modalState.service ? `
                    <div class="modal-separator"></div>
                    <div class="cb-section">
                        <label class="modal-form-label">Mitarbeiter (optional)</label>
                        <div id="cb-staff-list" class="cb-grid-2"></div>
                    </div>
                ` : ''}
            `;
        }
        case STEPS.SELECT_DATE:
            return renderDateStepContent();
        case STEPS.SELECT_ADDONS: {
            const addons = modalState.data.addons.filter((addon) => {
                const links = addon.addon_services || [];
                if (links.length === 0) return true;
                return links.some((link) => link.service_id === modalState.service?.id);
            });
            return `
                <div class="cb-guest-box">
                    <div>
                        <div class="cb-option-title">Anzahl Gaeste</div>
                        <div class="cb-option-subtitle">Max. ${modalState.object?.capacity || 99}</div>
                    </div>
                    <div class="stepper-input">
                        <button type="button" class="stepper-btn" data-action="dec-guests">-</button>
                        <input type="number" class="stepper-value" value="${modalState.guestCount}" readonly>
                        <button type="button" class="stepper-btn" data-action="inc-guests">+</button>
                    </div>
                </div>
                <div class="cb-section">
                    <h3 class="cb-option-title">Extras</h3>
                    ${addons.length === 0 ? '<p class="cb-muted-text">Keine Extras verfuegbar.</p>' : ''}
                    <div class="cb-option-list">
                        ${addons.map((addon) => {
                const selectedAddon = getAddonSelection(addon.id);
                const isSelected = !!selectedAddon;
                return `
                                <label class="modal-option-card ${isSelected ? 'modal-option-card--selected' : ''}">
                                    <input type="checkbox" data-addon-id="${escapeHtml(addon.id)}" ${isSelected ? 'checked' : ''}>
                                    <div>
                                        <div class="cb-option-title">${escapeHtml(addon.name)}</div>
                                        <div class="cb-option-subtitle">+${addon.price} EUR</div>
                                    </div>
                                </label>
                                ${isSelected ? renderAddonConfiguration(addon, selectedAddon) : ''}
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        }
        case STEPS.SUMMARY: {
            const svc = modalState.service;
            let total = Number(svc.price);
            if (isOvernightService(svc) && modalState.startDate && modalState.endDate) {
                const nights = Math.ceil((new Date(modalState.endDate) - new Date(modalState.startDate)) / 86400000);
                total *= Math.max(1, nights);
            }

            const addonRows = [];
            let addonsTotal = 0;
            modalState.addons.forEach((sel) => {
                const addonDef = modalState.data.addons.find((ad) => ad.id === sel.id);
                if (!addonDef) return;
                const items = addonDef.addon_items || [];
                const pricePerUnit = Number(addonDef.price) || 0;

                if (items.length > 0) {
                    (sel.items || []).forEach((it, ii) => {
                        if (!it) return;
                        const def = items[ii];
                        if (!def) return;
                        const qty = Math.max(1, Number(it.qty) || 1);
                        const itemPrice = pricePerUnit * qty;
                        addonsTotal += itemPrice;
                        const detail = it.variant ? ` ${it.variant}` : '';
                        addonRows.push({ label: `+ ${escapeHtml(def.name)}${escapeHtml(detail)}`, price: itemPrice });
                    });
                    (sel.guests || []).forEach((guest, gi) => {
                        const guestLabel = modalState.guestCount > 1 ? ` (Gast ${gi + 1})` : '';
                        (guest.items || []).forEach((it, ii) => {
                            if (!it) return;
                            const def = items[ii];
                            if (!def) return;
                            const qty = Math.max(1, Number(it.qty) || 1);
                            const itemPrice = pricePerUnit * qty;
                            addonsTotal += itemPrice;
                            const detail = it.variant ? ` ${it.variant}` : '';
                            addonRows.push({ label: `+ ${escapeHtml(def.name)}${escapeHtml(detail)}${escapeHtml(guestLabel)}`, price: itemPrice });
                        });
                    });
                } else {
                    const itemTotal = pricePerUnit * modalState.guestCount;
                    addonsTotal += itemTotal;
                    addonRows.push({
                        label: `+ ${escapeHtml(addonDef.name)}${modalState.guestCount > 1 ? ` ×${modalState.guestCount}` : ''}`,
                        price: itemTotal,
                    });
                }
            });

            total += addonsTotal + (Number(svc.cleaning_fee) || 0);

            const addonRowsHtml = addonRows
                .map((r) => `<div class="cb-summary-row"><span>${r.label}</span><strong>${r.price.toFixed(2)} EUR</strong></div>`)
                .join('');

            return `
                <div class="cb-summary-card">
                    <div class="cb-summary-row"><span>Kunde</span><strong>${escapeHtml(modalState.customer.name || `${modalState.customer.fname} ${modalState.customer.lname}`)}</strong></div>
                    <div class="cb-summary-row"><span>Email</span><strong>${escapeHtml(modalState.customer.email)}</strong></div>
                    <div class="cb-summary-row"><span>Objekt</span><strong>${escapeHtml(modalState.object.name)}</strong></div>
                    <div class="cb-summary-row"><span>Service</span><strong>${escapeHtml(svc.name)}</strong></div>
                    <div class="cb-summary-row"><span>Start</span><strong>${modalState.startDate ? formatDate(modalState.startDate) : '-'} ${modalState.time || ''}</strong></div>
                    ${modalState.endDate ? `<div class="cb-summary-row"><span>Ende</span><strong>${formatDate(modalState.endDate)}</strong></div>` : ''}
                    ${addonRowsHtml}
                    ${(Number(svc.cleaning_fee) || 0) > 0 ? `<div class="cb-summary-row"><span>Reinigung</span><strong>${Number(svc.cleaning_fee).toFixed(2)} EUR</strong></div>` : ''}
                    <div class="cb-summary-total"><span>Gesamtpreis</span><strong>${total.toFixed(2)} EUR</strong></div>
                </div>
                <label class="cb-checkbox-row">
                    <input type="checkbox" id="cb-send-email" checked>
                    <span>Buchungsbestaetigung per E-Mail senden (mit Link zum Kundenportal)</span>
                </label>
            `;
        }
        default:
            return '';
    }
};

const renderFooter = (modal) => {
    const footer = modal.querySelector('.modal-footer');
    if (!footer) return;
    const isFirst = modalState.step === STEPS.SEARCH_CUSTOMER;
    const isLast = modalState.step === STEPS.SUMMARY;

    footer.innerHTML = `
        <button class="btn btn-secondary" data-action="cancel">Abbrechen</button>
        <div class="cb-footer-actions">
            <button class="btn btn-outline ${isFirst ? 'cb-hidden' : ''}" data-action="back" ${isFirst ? 'disabled' : ''}>Zurueck</button>
            <button class="btn btn-primary" data-action="${isLast ? 'submit' : 'next'}">${isLast ? 'Buchen und Senden' : 'Weiter'}</button>
        </div>
    `;
};

const renderModal = () => {
    const modal = document.getElementById('create-booking-modal');
    if (!modal) return;
    const container = modal.querySelector('.modal-container');
    const content = modal.querySelector('.modal-content');
    const title = modal.querySelector('.modal-title');

    if (!content || !title || !container) return;
    container.classList.toggle('modal-container--date-step', modalState.step === STEPS.SELECT_DATE);
    title.textContent = getStepTitle(modalState.step);

    if (modalState.loading) {
        content.innerHTML = '<div class="cb-loading">Lade Daten ...</div>';
    } else {
        content.innerHTML = getStepContent(modalState.step);
    }

    // Mount SearchDropdown for customer search step
    if (modalState.step === STEPS.SEARCH_CUSTOMER) {
        mountCustomerSearch();
    }

    renderFooter(modal);
    bindEvents(modal);
    if (modalState.step === STEPS.SELECT_SERVICE) updateStaffList();
};

const loadCustomers = async () => {
    const workspaceId = getState().currentWorkspace?.id;
    const bookings = workspaceId ? await fetchBookingCustomers(workspaceId) : [];

    const customerMap = new Map();
    (bookings || []).forEach((b) => {
        const key = (b.customer_email || '').toLowerCase();
        if (!key || customerMap.has(key)) return;
        const nameParts = (b.customer_name || '').trim().split(/\s+/);
        const fname = nameParts[0] || '';
        const lname = nameParts.slice(1).join(' ') || '';
        customerMap.set(key, {
            email: b.customer_email,
            name: b.customer_name || '',
            fname,
            lname,
            phone: b.customer_phone || '',
        });
    });
    modalState.data.customers = Array.from(customerMap.values());
};

const mountCustomerSearch = () => {
    // Destroy previous instance if any
    if (modalState._searchDropdown) {
        modalState._searchDropdown.destroy();
        modalState._searchDropdown = null;
    }

    const container = document.getElementById('cb-customer-search-container');
    if (!container) return;

    modalState._searchDropdown = new SearchDropdown({
        container,
        placeholder: 'Name oder E-Mail eingeben …',
        debounceMs: 150,
        onSearch: async (query) => {
            const q = query.toLowerCase();
            return modalState.data.customers
                .filter((c) => {
                    return (c.name || '').toLowerCase().includes(q)
                        || (c.email || '').toLowerCase().includes(q)
                        || (c.phone || '').toLowerCase().includes(q);
                })
                .slice(0, 10)
                .map((c) => ({
                    id: c.email,
                    primary: c.name || c.email,
                    secondary: c.name ? c.email : '',
                    data: c,
                }));
        },
        onSelect: (item) => {
            const c = item.data;
            modalState.customer = {
                fname: c.fname,
                lname: c.lname,
                name: c.name,
                email: c.email,
                phone: c.phone,
                notes: '',
            };
            // Fill the form fields
            const fnameEl = document.getElementById('cb-fname');
            const lnameEl = document.getElementById('cb-lname');
            const emailEl = document.getElementById('cb-email');
            const phoneEl = document.getElementById('cb-phone');
            if (fnameEl) fnameEl.value = c.fname || '';
            if (lnameEl) lnameEl.value = c.lname || '';
            if (emailEl) emailEl.value = c.email || '';
            if (phoneEl) phoneEl.value = c.phone || '';
        },
    });

    // If customer was already selected, show their name in the search field
    if (modalState.customer?.name) {
        modalState._searchDropdown.setValue(modalState.customer.name);
    }
};

const loadData = async () => {
    modalState.loading = true;
    renderModal();

    const workspaceId = getState().currentWorkspace?.id;
    const { objects, services, addons, staff } = workspaceId
        ? await fetchBookingModalData(workspaceId)
        : { objects: [], services: [], addons: [], staff: [] };

    modalState.data = {
        ...modalState.data,
        objects,
        services,
        addons,
        staff,
    };
    modalState.loading = false;

    // Load customers in background (non-blocking)
    loadCustomers();

    renderModal();
};

const loadCalendarData = async () => {
    if (!modalState.object) return;
    modalState.calendarLoading = true;
    renderModal();
    const start = new Date(modalState.calendarMonth.getFullYear(), modalState.calendarMonth.getMonth(), 1);
    const end = new Date(modalState.calendarMonth.getFullYear(), modalState.calendarMonth.getMonth() + 1, 0);
    const data = await fetchAvailabilityForRange(
        modalState.object.id,
        formatISODate(start),
        formatISODate(end),
    );
    modalState.calendarData = data;
    modalState.calendarLoading = false;
    renderModal();
};

const checkAvailability = async () => {
    if (!modalState.object || !modalState.service || !modalState.startDate) return;
    if (isHourlyService(modalState.service)) {
        const data = await fetchAvailabilityForRange(
            modalState.object.id,
            modalState.startDate,
            modalState.startDate,
        );
        const bookingsForDay = extractBookingsForDay(data, modalState.startDate);
        generateSlots(bookingsForDay);
        modalState.availabilityStatus = null;
        renderModal();
        return;
    }

    if (isOvernightService(modalState.service) && !modalState.endDate) return;
    const checkinTime = extractTimePart(modalState.service.checkin_start) || '14:00';
    const checkoutTime = extractTimePart(modalState.service.checkout_end) || '11:00';
    const effectiveEndDate = modalState.endDate || modalState.startDate;
    const available = await checkAvailabilityForBooking({
        p_object_id: modalState.object.id,
        p_start_time: `${modalState.startDate}T${checkinTime}:00`,
        p_end_time: `${effectiveEndDate}T${checkoutTime}:00`,
        p_buffer_before: 0,
        p_buffer_after: 0,
    });
    modalState.availabilityStatus = available ? 'available' : 'unavailable';
    renderModal();
};

const generateSlots = (bookingsForDay = []) => {
    const svc = modalState.service;
    const obj = modalState.object;
    if (!svc || svc.service_type !== 'hourly') {
        modalState.slots = [];
        return;
    }

    const { start, end } = resolveWindowForDate(svc, obj, modalState.startDate);
    const duration = Math.max(1, Number(svc.duration_minutes) || 60);
    const step = svc.fixed_start_times
        ? Math.max(duration + (Number(svc.buffer_after_minutes) || 0), 1)
        : 30;
    const intervals = bookingsForDay
        .map((entry) => normalizeBookingInterval(entry))
        .filter(Boolean);

    const slots = [];
    for (let t = start; t + duration <= end; t += step) {
        const slotEnd = t + duration;
        const overlaps = intervals.some((booking) => !(slotEnd <= booking.start || t >= booking.end));
        slots.push({ time: formatMinutesToTime(t), available: !overlaps });
    }

    if (modalState.time && !slots.some((slot) => slot.time === modalState.time && slot.available)) {
        modalState.time = null;
    }
    modalState.slots = slots;
};

const selectDateFromCalendar = async (dateISO) => {
    const isOvernight = isOvernightService(modalState.service);
    const isDaily = isDailyService(modalState.service);
    if (isOvernight) {
        if (modalState.selectingEndDate && modalState.startDate && parseISODate(dateISO) > parseISODate(modalState.startDate)) {
            modalState.endDate = dateISO;
            modalState.selectingEndDate = false;
            await checkAvailability();
            return;
        }
        modalState.startDate = dateISO;
        modalState.endDate = null;
        modalState.selectingEndDate = true;
        modalState.availabilityStatus = null;
        renderModal();
        return;
    }

    if (isDaily) {
        modalState.startDate = dateISO;
        modalState.endDate = dateISO;
        modalState.time = null;
        await checkAvailability();
        return;
    }

    modalState.startDate = dateISO;
    modalState.endDate = null;
    modalState.time = null;
    await checkAvailability();
};

const updateStaffList = () => {
    const container = document.getElementById('cb-staff-list');
    if (!container || !modalState.service) return;
    const linkedStaff = modalState.data.staff.filter((st) => st.status === 'active');
    container.innerHTML = `
        <label class="modal-option-card">
            <input type="radio" name="cb-staff" value="" ${!modalState.staff ? 'checked' : ''}>
            <div><div class="cb-option-title">Kein Mitarbeiter</div><div class="cb-option-subtitle">Automatisch zuweisen</div></div>
        </label>
        ${linkedStaff.map((st) => `
            <label class="modal-option-card">
                <input type="radio" name="cb-staff" value="${escapeHtml(st.id)}" ${modalState.staff === st.id ? 'checked' : ''}>
                <div><div class="cb-option-title">${escapeHtml(st.name)}</div></div>
            </label>
        `).join('')}
    `;
};

const handleNext = async () => {
    const state = modalState;
    if (state.step === STEPS.SEARCH_CUSTOMER) {
        if (!state.customer?.email) {
            const fname = document.getElementById('cb-fname')?.value?.trim() || '';
            const lname = document.getElementById('cb-lname')?.value?.trim() || '';
            const email = document.getElementById('cb-email')?.value?.trim() || '';
            const phone = document.getElementById('cb-phone')?.value?.trim() || '';
            const notes = document.getElementById('cb-notes')?.value?.trim() || '';
            if (!email || !fname) return showToast('Bitte Name und E-Mail eingeben.', 'error');
            state.customer = { fname, lname, name: `${fname} ${lname}`.trim(), email, phone, notes };
        }
    } else if (state.step === STEPS.SELECT_OBJECT) {
        if (!state.object) return showToast('Bitte Objekt waehlen.', 'error');
    } else if (state.step === STEPS.SELECT_SERVICE) {
        if (!state.service) return showToast('Bitte Service waehlen.', 'error');
    } else if (state.step === STEPS.SELECT_DATE) {
        if (!state.startDate) return showToast('Bitte Datum waehlen.', 'error');
        if (isHourlyService(state.service) && !state.time) return showToast('Bitte Uhrzeit waehlen.', 'error');
        if (isOvernightService(state.service) && !state.endDate) return showToast('Bitte Abreisedatum waehlen.', 'error');
    }

    if (state.step < STEPS.SUMMARY) {
        state.step += 1;
        if (state.step === STEPS.SELECT_DATE) {
            await loadCalendarData();
            return;
        }
        renderModal();
    } else {
        await handleSubmit();
    }
};

const handleSubmit = async () => {
    const submitBtn = document.querySelector('button[data-action="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird erstellt ...';
    }

    const sendEmail = document.getElementById('cb-send-email')?.checked || false;
    let startTime;
    let endTime;
    if (isHourlyService(modalState.service)) {
        const start = new Date(`${modalState.startDate}T${modalState.time}:00`);
        const end = new Date(start.getTime() + (modalState.service.duration_minutes || 60) * 60000);
        startTime = start.toISOString();
        endTime = end.toISOString();
    } else if (isOvernightService(modalState.service)) {
        const checkinTime = extractTimePart(modalState.service.checkin_start) || '14:00';
        const checkoutTime = extractTimePart(modalState.service.checkout_end) || '11:00';
        startTime = `${modalState.startDate}T${checkinTime}:00`;
        endTime = `${modalState.endDate || modalState.startDate}T${checkoutTime}:00`;
    } else {
        const checkinTime = extractTimePart(modalState.service.checkin_start) || '14:00';
        const checkoutTime = extractTimePart(modalState.service.checkout_end) || '11:00';
        startTime = `${modalState.startDate}T${checkinTime}:00`;
        endTime = `${modalState.startDate}T${checkoutTime}:00`;
    }

    const payload = {
        object_id: modalState.object.id,
        service_id: modalState.service.id,
        start_time: startTime,
        end_time: endTime,
        customer_name: modalState.customer.name,
        customer_email: modalState.customer.email,
        customer_phone: modalState.customer.phone,
        customer_notes: modalState.customer.notes,
        staff_id: modalState.staff,
        guest_count: modalState.guestCount,
        addon_ids: modalState.addons.map((a) => a.id),
        addon_selections: buildAddonSelectionsPayload(),
        send_email: sendEmail,
    };

    try {
        const result = await createManualBooking(payload);
        if (!result.success || !result.booking_id) {
            throw new Error('Buchung fehlgeschlagen: ungueltige Serverantwort.');
        }

        if (sendEmail && !result.email_sent) {
            const reason = result.email_error ? ` (${result.email_error})` : '';
            showToast(`Buchung erstellt, E-Mail konnte nicht gesendet werden${reason}.`, 'error');
        } else {
            showToast('Buchung erfolgreich erstellt!', 'success');
        }
        closeModal();
        window.dispatchEvent(new CustomEvent('bookings:refresh', {
            detail: { preferredFilter: 'unpaid' },
        }));
    } catch (error) {
        showToast(error.message || 'Buchung fehlgeschlagen', 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Buchen und Senden';
        }
    }
};

const resetCalendarSelection = () => {
    modalState.startDate = null;
    modalState.endDate = null;
    modalState.time = null;
    modalState.slots = [];
    modalState.availabilityStatus = null;
    modalState.selectingEndDate = false;
    modalState.calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    modalState.calendarData = { blocked_dates: [], bookings: [] };
};

const bindEvents = (modal) => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const nextBtn = modal.querySelector('[data-action="next"]');
    const submitBtn = modal.querySelector('[data-action="submit"]');
    const backBtn = modal.querySelector('[data-action="back"]');
    const content = modal.querySelector('.modal-content');
    if (!content) return;

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (nextBtn) nextBtn.onclick = () => handleNext();
    if (submitBtn) submitBtn.onclick = () => handleNext();
    if (backBtn) {
        backBtn.onclick = () => {
            if (modalState.step > STEPS.SEARCH_CUSTOMER) {
                modalState.step -= 1;
                renderModal();
            }
        };
    }

    content.onchange = (event) => {
        const target = event.target;
        if (target.name === 'cb-object') {
            modalState.object = modalState.data.objects.find((o) => o.id === target.value) || null;
            modalState.service = null;
            modalState.staff = null;
            resetCalendarSelection();
            renderModal();
        } else if (target.name === 'cb-service') {
            modalState.service = modalState.data.services.find((s) => s.id === target.value) || null;
            modalState.staff = null;
            resetCalendarSelection();
            renderModal();
        } else if (target.name === 'cb-staff') {
            modalState.staff = target.value || null;
        } else if (target.type === 'checkbox' && target.dataset.addonId) {
            const addonId = target.dataset.addonId;
            toggleAddonSelection(addonId, target.checked);
            renderModal();
        } else if (target.classList.contains('cb-addon-field')) {
            updateAddonItemSelection({
                addonId: target.dataset.addonId,
                scope: target.dataset.scope,
                guestIndex: Number(target.dataset.guestIndex || -1),
                itemIndex: Number(target.dataset.itemIndex || -1),
                field: target.dataset.field,
                value: target.value,
            });
        }
    };

    content.onclick = async (event) => {
        const actionButton = event.target.closest('[data-action]');
        const calendarNavButton = event.target.closest('[data-cal-nav]');
        const calendarDayButton = event.target.closest('[data-cal-date]');
        const slotButton = event.target.closest('[data-slot-time]');

        if (calendarNavButton) {
            const delta = Number(calendarNavButton.dataset.calNav || 0);
            modalState.calendarMonth = new Date(modalState.calendarMonth.getFullYear(), modalState.calendarMonth.getMonth() + delta, 1);
            await loadCalendarData();
            return;
        }

        if (calendarDayButton) {
            await selectDateFromCalendar(calendarDayButton.dataset.calDate);
            return;
        }

        if (slotButton) {
            if (slotButton.dataset.slotAvailable === '0') return;
            modalState.time = slotButton.dataset.slotTime;
            renderModal();
            return;
        }

        if (actionButton?.dataset.action === 'inc-guests') {
            const max = modalState.object?.capacity || 99;
            modalState.guestCount = Math.min(max, modalState.guestCount + 1);
            syncAddonGuestsToGuestCount();
            renderModal();
        } else if (actionButton?.dataset.action === 'dec-guests') {
            modalState.guestCount = Math.max(1, modalState.guestCount - 1);
            syncAddonGuestsToGuestCount();
            renderModal();
        }
    };
};

const closeModal = () => {
    if (modalState._searchDropdown) {
        modalState._searchDropdown.destroy();
        modalState._searchDropdown = null;
    }
    const modal = document.getElementById('create-booking-modal');
    if (modal) modal.classList.remove('open');
};

export const openCreateBookingModal = async () => {
    modalState = initialModalState();
    if (!document.getElementById('create-booking-modal')) {
        const modalHtml = `
            <div id="create-booking-modal" class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header cb-modal-header">
                        <div class="modal-title-group">
                            <h2 class="modal-title">Neue Buchung</h2>
                        </div>
                        <button class="modal-close-btn" aria-label="Close">${getIconString('close')}</button>
                    </div>
                    <div class="modal-content"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const workspaceId = getState().currentWorkspace?.id;
    if (!workspaceId) {
        showToast('Kein Workspace ausgewaehlt. Bitte waehle einen Workspace.', 'error');
        return;
    }

    // Preload data BEFORE showing the modal to avoid layout shift
    modalState.loading = true;

    const { objects, services, addons, staff } = await fetchBookingModalData(workspaceId);

    modalState.data = {
        ...modalState.data,
        objects,
        services,
        addons,
        staff,
    };
    modalState.loading = false;

    // Load customers in background (non-blocking)
    loadCustomers();

    // NOW show the modal — content is already ready
    const modal = document.getElementById('create-booking-modal');
    modal.classList.add('open');
    renderModal();
};
