/**
 * InvoiceView - Visual invoice rendering for a booking
 * Generates a paper-style invoice from booking + workspace data
 * DE-compliant: §14 UStG Pflichtangaben
 */

import { formatDate } from '../../../lib/dateUtils.js';
import { fmt, buildLineItems, calculateTotals, getInvoiceNumber, getLeistungszeitraum } from './invoiceUtils.js';

// Payment status labels and colors
const PAYMENT_BADGES = {
    unpaid: { label: 'Unbezahlt', class: 'invoice-badge--unpaid' },
    paid: { label: 'Bezahlt', class: 'invoice-badge--paid' },
    refunded: { label: 'Erstattet', class: 'invoice-badge--refunded' },
    partial_refunded: { label: 'Teilweise erstattet', class: 'invoice-badge--refunded' },
    failed: { label: 'Fehlgeschlagen', class: 'invoice-badge--failed' },
};

/**
 * Render the invoice header (logo, badge, title, number, dates)
 */
const renderInvoiceHeader = (booking) => {
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
            <div class="invoice-meta-row">
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
        </div>
    `;
};

/**
 * Render from/to address blocks
 */
const renderAddresses = (booking, workspace) => {
    const fromName = workspace?.company_name || 'Firmenname';
    const fromAddress = workspace?.company_address || 'Straße Nr.';
    const fromZip = workspace?.company_zip || 'PLZ';
    const fromCity = workspace?.company_city || 'Stadt';
    const fromCountry = workspace?.company_country || 'Deutschland';

    const toName = booking.customer_name || 'Kundenname';
    // Customer address placeholder (not in DB yet)
    const toAddress = 'Adresse';
    const toZip = 'PLZ';
    const toCity = 'Stadt';

    return `
        <div class="invoice-addresses">
            <div class="invoice-address-block">
                <span class="invoice-address-label">Von</span>
                <p class="invoice-address-name">${fromName}</p>
                <p>${fromAddress}</p>
                <p>${fromZip} ${fromCity}</p>
                <p>${fromCountry}</p>
            </div>
            <div class="invoice-address-block">
                <span class="invoice-address-label">An</span>
                <p class="invoice-address-name">${toName}</p>
                <p>${toAddress}</p>
                <p>${toZip} ${toCity}</p>
            </div>
        </div>
    `;
};

/**
 * Render line items table with Einzelpreis + Gesamt columns
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
        <div class="invoice-table-wrapper">
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th class="invoice-th-item">Beschreibung</th>
                        <th class="invoice-th-qty">Menge</th>
                        <th class="invoice-th-price">Einzelpreis</th>
                        <th class="invoice-th-price">Gesamt</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
};

/**
 * Render totals summary — DE-compliant breakdown
 * Zwischensumme → Rabatt → Zwischensumme nach Rabatt → Netto → USt → Gesamtbetrag
 */
const renderSummary = (totals) => {
    // Rabatt-Zeilen nur wenn Rabatt vorhanden
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
 * Helper: render a value or a "missing" hint linking to settings
 */
const val = (v) => v
    ? v
    : '<span class="invoice-footer-missing">In Einstellungen ergänzen</span>';

/**
 * Render invoice footer (company info, contact, legal, bank)
 * 4-column grid matching the target design
 */
const renderInvoiceFooter = (workspace) => {
    const ws = workspace || {};

    return `
        <div class="invoice-footer">
            <div class="invoice-footer-col">
                <p>${val(ws.company_name)}</p>
                <p>${val(ws.company_address)}</p>
                <p>${ws.company_zip || ws.company_city ? `${ws.company_zip || ''} ${ws.company_city || ''}`.trim() : val(null)}</p>
                <p>${val(ws.company_country)}</p>
            </div>
            <div class="invoice-footer-col">
                <p>Tel. ${val(ws.phone)}</p>
                <p>E-Mail: ${val(ws.email)}</p>
                <p>Web: ${val(ws.website)}</p>
            </div>
            <div class="invoice-footer-col">
                <p>Steuer-Nr: ${val(ws.tax_id)}</p>
                ${ws.vat_id ? `<p>USt-IdNr.: ${ws.vat_id}</p>` : ''}
                <p>Inhaber/-in: ${val(ws.managing_directors)}</p>
                ${ws.website ? `<p>Web: ${ws.website}</p>` : ''}
            </div>
            <div class="invoice-footer-col">
                <p>Bank ${val(ws.bank_name)}</p>
                <p>IBAN ${val(ws.iban)}</p>
                <p>BIC ${val(ws.bic)}</p>
            </div>
        </div>
    `;
};

/**
 * Main render function — returns full invoice HTML string
 * @param {Object} booking - Booking data with relations
 * @param {Object} workspace - Workspace data for sender info
 * @returns {string} HTML string
 */
export const renderInvoice = (booking, workspace) => {
    const lineItems = buildLineItems(booking);
    const totals = calculateTotals(booking, lineItems, workspace);

    return `
        <div class="invoice-container">
            ${renderInvoiceHeader(booking)}
            ${renderAddresses(booking, workspace)}
            ${renderItemsTable(lineItems)}
            ${renderSummary(totals)}
            ${renderInvoiceFooter(workspace)}
        </div>
    `;
};
