/**
 * PortalBookingInfo - Customer-facing booking details card
 * 
 * Shows booking status, dates, object, service, addons — read-only view
 * for the customer. Similar to BookingSidebar but without operator actions.
 */

import { formatDateRange } from '../../lib/dateUtils.js';
import { getEffectiveBookingStatus } from '../../lib/bookingStatus.js';

// Status labels and CSS classes
const STATUS_MAP = {
    pending: { label: 'Ausstehend', class: 'portal-status--pending' },
    pending_approval: { label: 'Wartet auf Bestätigung', class: 'portal-status--pending' },
    confirmed: { label: 'Bestätigt', class: 'portal-status--confirmed' },
    active: { label: 'Aktiv', class: 'portal-status--active' },
    completed: { label: 'Abgeschlossen', class: 'portal-status--completed' },
    rejected: { label: 'Abgelehnt', class: 'portal-status--rejected' },
    cancelled: { label: 'Storniert', class: 'portal-status--cancelled' },
    failed: { label: 'Fehlgeschlagen', class: 'portal-status--rejected' },
    no_show: { label: 'Nicht erschienen', class: 'portal-status--rejected' },
};

// Payment status labels
const PAYMENT_MAP = {
    unpaid: { label: 'Unbezahlt', class: 'portal-payment--unpaid' },
    paid: { label: 'Bezahlt', class: 'portal-payment--paid' },
    refunded: { label: 'Erstattet', class: 'portal-payment--refunded' },
    partial_refunded: { label: 'Teilweise erstattet', class: 'portal-payment--refunded' },
    failed: { label: 'Fehlgeschlagen', class: 'portal-payment--failed' },
};

// Service type labels
const SERVICE_TYPE_MAP = {
    hourly: 'Stündlich',
    daily: 'Tagesmiete',
    overnight: 'Übernachtung',
};

/**
 * Info row helper
 */
const infoRow = (label, value) => `
    <div class="portal-info-row">
        <span class="portal-info-label">${label}</span>
        <span class="portal-info-value">${value || '—'}</span>
    </div>
`;

/**
 * Render addon tags
 */
const renderAddons = (bookingAddons) => {
    if (!bookingAddons || bookingAddons.length === 0) return '—';
    return bookingAddons.map(ba => {
        const name = ba.addons?.name || 'Addon';
        return `<span class="portal-tag">${name}</span>`;
    }).join(' ');
};

/**
 * Render staff tags
 */
const renderStaff = (bookingStaff) => {
    if (!bookingStaff || bookingStaff.length === 0) return null;
    const tags = bookingStaff.map(bs => {
        const name = bs.staff?.name || 'Mitarbeiter';
        return `<span class="portal-tag portal-tag--staff">${name}</span>`;
    }).join(' ');
    return tags;
};

/**
 * Render the booking info card
 */
export const renderPortalBookingInfo = (booking) => {
    const bookingNumber = booking.booking_number || '—';
    const effectiveStatus = getEffectiveBookingStatus(booking);
    const status = STATUS_MAP[effectiveStatus] || STATUS_MAP.pending;
    const payment = PAYMENT_MAP[booking.payment_status] || PAYMENT_MAP.unpaid;
    const serviceType = SERVICE_TYPE_MAP[booking.services?.service_type] || '';
    const staffHtml = renderStaff(booking.booking_staff);

    return `
        <div class="portal-card">
            <div class="portal-card-header">
                <h2 class="portal-card-title">Buchung #${bookingNumber}</h2>
                <span class="portal-status ${status.class}">${status.label}</span>
            </div>

            <div class="portal-info">
                ${infoRow('Zahlungsstatus', `<span class="portal-payment ${payment.class}">${payment.label}</span>`)}
                ${infoRow('Zeitraum', formatDateRange(booking.start_time, booking.end_time))}
                ${infoRow('Objekt', booking.objects?.name)}
                ${infoRow('Service', booking.services?.name)}
                ${serviceType ? infoRow('Art', serviceType) : ''}
                <div class="portal-info-row">
                    <span class="portal-info-label">Extras</span>
                    <span class="portal-info-value portal-tags-wrap">
                        ${renderAddons(booking.booking_addons)}
                    </span>
                </div>
                ${staffHtml ? `
                <div class="portal-info-row">
                    <span class="portal-info-label">Mitarbeiter</span>
                    <span class="portal-info-value portal-tags-wrap">${staffHtml}</span>
                </div>` : ''}
                ${booking.customer_notes ? infoRow('Ihre Notiz', booking.customer_notes) : ''}
            </div>
        </div>
    `;
};
