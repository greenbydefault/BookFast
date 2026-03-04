/**
 * PortalInvoiceView - Customer-facing invoice display
 * 
 * Reuses invoiceUtils (buildLineItems, calculateTotals, fmt, etc.)
 * and pdfExport for PDF download. Renders a clean read-only invoice.
 */

import { formatDate } from '../../lib/dateUtils.js';
import {
    fmt,
    buildLineItems,
    calculateTotals,
    getInvoiceNumber,
    getLeistungszeitraum,
} from '../dashboard/booking-detail/invoiceUtils.js';

// Payment badges
const PAYMENT_BADGES = {
    unpaid: { label: 'Unbezahlt', class: 'invoice-badge--unpaid' },
    paid: { label: 'Bezahlt', class: 'invoice-badge--paid' },
    refunded: { label: 'Erstattet', class: 'invoice-badge--refunded' },
    partial_refunded: { label: 'Teilweise erstattet', class: 'invoice-badge--refunded' },
    failed: { label: 'Fehlgeschlagen', class: 'invoice-badge--failed' },
};

/**
 * Render invoice header
 */
const renderHeader = (booking) => {
    const paymentStatus = booking.payment_status || 'unpaid';
    const badge = PAYMENT_BADGES[paymentStatus] || PAYMENT_BADGES.unpaid;
    const invoiceNumber = getInvoiceNumber(booking);

    return `
        <div class="invoice-header">
            <div class="invoice-header-top">
                <div class="invoice-logo-placeholder"></div>
                <span class="invoice-badge ${badge.class}">${badge.label}</span>
            </div>
            <h1 class="invoice-title">Rechnung</h1>
            <p class="invoice-number">Rechnungsnummer &nbsp;#${invoiceNumber}</p>
            <div class="invoice-dates">
                <div class="invoice-date-col">
                    <span class="invoice-date-label">Ausstellungsdatum</span>
                    <span class="invoice-date-value">${formatDate(booking.created_at)}</span>
                </div>
                <div class="invoice-date-col">
                    <span class="invoice-date-label">Leistungszeitraum</span>
                    <span class="invoice-date-value">${getLeistungszeitraum(booking)}</span>
                </div>
            </div>
        </div>
    `;
};

/**
 * Render addresses
 */
const renderAddresses = (booking, workspace) => {
    const fromName = workspace?.company_name || 'Firmenname';
    const fromAddress = workspace?.company_address || '';
    const fromZip = workspace?.company_zip || '';
    const fromCity = workspace?.company_city || '';
    const fromCountry = workspace?.company_country || 'Deutschland';

    const toName = booking.customer_name || 'Kundenname';

    return `
        <div class="invoice-addresses">
            <div class="invoice-address-block">
                <span class="invoice-address-label">Von</span>
                <p class="invoice-address-name">${fromName}</p>
                ${fromAddress ? `<p>${fromAddress}</p>` : ''}
                ${fromZip || fromCity ? `<p>${fromZip} ${fromCity}</p>` : ''}
                <p>${fromCountry}</p>
            </div>
            <div class="invoice-address-block">
                <span class="invoice-address-label">An</span>
                <p class="invoice-address-name">${toName}</p>
                ${booking.customer_email ? `<p>${booking.customer_email}</p>` : ''}
            </div>
        </div>
    `;
};

/**
 * Render line items table
 */
const renderItemsTable = (lineItems) => {
    const rows = lineItems.map(item => `
        <tr>
            <td class="invoice-item-name">${item.name}</td>
            <td class="invoice-item-qty">${item.quantity}</td>
            <td class="invoice-item-price">${fmt(item.unitPrice)}</td>
            <td class="invoice-item-price">${fmt(item.total)}</td>
        </tr>
    `).join('');

    return `
        <table class="invoice-table">
            <thead>
                <tr>
                    <th class="invoice-th-item">Beschreibung</th>
                    <th class="invoice-th-qty">Menge</th>
                    <th class="invoice-th-price">Einzelpreis</th>
                    <th class="invoice-th-price">Gesamt</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
};

/**
 * Render totals summary
 */
const renderSummary = (totals) => {
    const discountRows = totals.discountAmount > 0 ? `
        <tr class="invoice-summary-row">
            <td>Rabatt${totals.discountPercent > 0 ? ` (${totals.discountPercent} %)` : ''}</td>
            <td>− ${fmt(totals.discountAmount)}</td>
        </tr>
        <tr class="invoice-summary-row">
            <td>Zwischensumme nach Rabatt</td>
            <td>${fmt(totals.subtotalAfterDiscount)}</td>
        </tr>
    ` : '';

    return `
        <div class="invoice-summary">
            <table class="invoice-summary-table">
                <tr class="invoice-summary-row">
                    <td>Zwischensumme (Brutto)</td>
                    <td>${fmt(totals.subtotal)}</td>
                </tr>
                ${discountRows}
                <tr class="invoice-summary-row">
                    <td>Nettobetrag</td>
                    <td>${fmt(totals.netAmount)}</td>
                </tr>
                <tr class="invoice-summary-row">
                    <td>darin enth. USt. (${totals.taxRate} %)</td>
                    <td>${fmt(totals.taxAmount)}</td>
                </tr>
                <tr class="invoice-summary-row invoice-summary-total">
                    <td>Gesamtbetrag</td>
                    <td>${fmt(totals.total)}</td>
                </tr>
            </table>
        </div>
    `;
};

/**
 * Render invoice footer
 */
const renderFooter = (workspace) => {
    const name = workspace?.company_name || '';
    const address = workspace?.company_address || '';
    const zip = workspace?.company_zip || '';
    const city = workspace?.company_city || '';
    const bankName = workspace?.bank_name || '';
    const iban = workspace?.iban || '';
    const bic = workspace?.bic || '';
    const taxId = workspace?.tax_id || null;
    const vatId = workspace?.vat_id || null;

    const taxLines = [];
    if (taxId) taxLines.push(`St.-Nr. ${taxId}`);
    if (vatId) taxLines.push(`USt-IdNr. ${vatId}`);

    return `
        <div class="invoice-footer">
            ${name ? `
            <div class="invoice-footer-col">
                ${name}
                ${address ? `<p>${address}</p>` : ''}
                ${zip || city ? `<p>${zip} ${city}</p>` : ''}
            </div>` : ''}
            ${bankName || iban ? `
            <div class="invoice-footer-col">
                ${bankName ? `Bank ${bankName}` : ''}
                ${iban ? `<br>IBAN ${iban}` : ''}
                ${bic ? `&nbsp;&nbsp;BIC ${bic}` : ''}
            </div>` : ''}
            ${taxLines.length > 0 ? `
            <div class="invoice-footer-col">${taxLines.join(' &nbsp;&nbsp; ')}</div>` : ''}
        </div>
    `;
};

/**
 * Render the full invoice for the portal
 */
export const renderPortalInvoice = (booking, workspace) => {
    const lineItems = buildLineItems(booking);
    const totals = calculateTotals(booking, lineItems, workspace);

    return `
        <div class="portal-invoice-wrapper">
            <div class="invoice-container">
                ${renderHeader(booking)}
                ${renderAddresses(booking, workspace)}
                ${renderItemsTable(lineItems)}
                ${renderSummary(totals)}
                ${renderFooter(workspace)}
            </div>
        </div>
    `;
};
