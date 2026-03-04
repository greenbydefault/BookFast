/**
 * BookingSidebar - Right sidebar with booking info, tags, and actions
 */

import { getIconString } from '../../../components/Icons/Icon.js';
import { formatDateRange } from '../../../lib/dateUtils.js';
import { navigate } from '../../../lib/router.js';
import { updateEntity, invalidateCache } from '../../../lib/dataLayer.js';
import { generateInvoicePDF } from './pdfExport.js';
import { buildSideCardWithTabs, sideCardSection, sideCardRow } from '../../../components/DetailLayout/DetailLayout.js';

const SERVICE_TYPE_MAP = {
    hourly: 'Stündlich',
    daily: 'Tagesmiete',
    overnight: 'Übernachtung'
};

const renderAddonTags = (bookingAddons) => {
    if (!bookingAddons || bookingAddons.length === 0) return '—';
    return bookingAddons.map(ba => {
        const name = ba.addons?.name || 'Addon';
        return `<span class="detail-sidecard__tag">${name}</span>`;
    }).join(' ');
};

const renderStaffTags = (bookingStaff) => {
    if (!bookingStaff || bookingStaff.length === 0) return '—';
    return bookingStaff.map(bs => {
        const name = bs.staff?.name || 'Mitarbeiter';
        return `<span class="detail-sidecard__tag detail-sidecard__tag--highlight">${name}</span>`;
    }).join(' ');
};

/**
 * Render the sidebar HTML string
 * @param {Object} booking - Booking with relations
 * @returns {string} HTML string
 */
export const renderBookingSidebar = (booking) => {
    const bookingNumber = booking.booking_number || '—';
    const serviceType = booking.services?.service_type || '';
    const serviceTypeLabel = SERVICE_TYPE_MAP[serviceType] || serviceType || '—';
    const voucherCode = booking.vouchers?.code || null;

    return buildSideCardWithTabs({
        title: `Buchung #${bookingNumber}`,
        tabs: [
            {
                id: 'details',
                label: 'Details',
                sections: [
                    sideCardSection({
                        title: 'Kunde',
                        content: `
                            ${sideCardRow('Name', booking.customer_name)}
                            ${sideCardRow('E-Mail', booking.customer_email)}
                            ${sideCardRow('Telefon', booking.customer_phone)}
                        `
                    }),
                    sideCardSection({
                        title: 'Buchung',
                        content: `
                            ${sideCardRow('Typ', serviceTypeLabel)}
                            ${sideCardRow('Zeitraum', formatDateRange(booking.start_time, booking.end_time))}
                            ${sideCardRow('Objekt', booking.objects?.name)}
                            ${sideCardRow('Service', booking.services?.name)}
                            <div class="detail-sidecard__row">
                                <span class="detail-sidecard__label">Addon</span>
                                <span class="detail-sidecard__value"><span class="detail-sidecard__tags">${renderAddonTags(booking.booking_addons)}</span></span>
                            </div>
                            <div class="detail-sidecard__row">
                                <span class="detail-sidecard__label">Mitarbeiter</span>
                                <span class="detail-sidecard__value"><span class="detail-sidecard__tags">${renderStaffTags(booking.booking_staff)}</span></span>
                            </div>
                            ${voucherCode ? sideCardRow('Gutschein', voucherCode) : ''}
                        `
                    }),
                ],
            },
            {
                id: 'aktionen',
                label: 'Aktionen',
                sections: [
                    sideCardSection({
                        title: 'Aktionen',
                        content: `
                            <div class="detail-sidecard__row" style="border-bottom: none;">
                                <button class="sidebar-copy-btn" id="btn-download-pdf" title="Rechnung als PDF herunterladen">
                                    ${getIconString('download-file')} PDF
                                </button>
                                <button class="btn-storno" id="btn-storno">
                                    ${getIconString('banknote-x')} Stornieren
                                </button>
                            </div>
                        `
                    }),
                ],
            },
        ],
    });
};

/**
 * Initialize sidebar event handlers
 * Called after DOM is rendered
 * @param {Object} booking - Current booking data
 * @param {Object} workspace - Workspace data (needed for PDF export)
 */
export const initSidebarEvents = (booking, workspace) => {
    // Download PDF
    const downloadBtn = document.getElementById('btn-download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => generateInvoicePDF(booking, workspace));
    }

    // Save/Cancel buttons removed

    // Storno button
    const stornoBtn = document.getElementById('btn-storno');
    if (stornoBtn) {
        stornoBtn.addEventListener('click', async () => {
            if (!confirm('Möchten Sie diese Buchung wirklich stornieren?')) return;

            try {
                await updateEntity('bookings', booking.id, { status: 'cancelled' });
                invalidateCache('bookings');
                navigate('bookings');
            } catch (error) {
                console.error('Storno failed:', error);
                alert('Fehler beim Stornieren: ' + error.message);
            }
        });
    }

};
