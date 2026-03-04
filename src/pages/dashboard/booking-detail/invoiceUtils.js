/**
 * Invoice utility functions shared between InvoiceView (HTML) and pdfExport (PDF)
 * Contains business logic: line items, totals, formatting, invoice numbers
 */

import { formatDate } from '../../../lib/dateUtils.js';

/**
 * Format currency — always 2 decimals, comma separator, EUR
 */
export const fmt = (value) => {
    return `${Number(value).toFixed(2).replace('.', ',')} \u20AC`;
};

/**
 * Build line items from booking data
 * Each item has: name, quantity, unitPrice, total
 */
export const buildLineItems = (booking) => {
    const items = [];

    // Main service
    if (booking.services?.name) {
        const price = parseFloat(booking.service_price) || 0;
        items.push({
            name: booking.services.name,
            quantity: 1,
            unitPrice: price,
            total: price,
        });
    }

    // Addons
    if (booking.booking_addons?.length > 0) {
        for (const ba of booking.booking_addons) {
            const qty = ba.quantity || 1;
            const unitPrice = parseFloat(ba.price_per_unit) || 0;
            const total = parseFloat(ba.total_price) || unitPrice * qty;
            items.push({
                name: ba.addons?.name || 'Addon',
                quantity: qty,
                unitPrice,
                total,
            });
        }
    }

    return items;
};

/**
 * Calculate invoice totals (brutto-based)
 * Prices in line items are brutto — tax is calculated out of total
 */
export const calculateTotals = (booking, lineItems, workspace) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = parseFloat(booking.discount_amount) || 0;
    const total = parseFloat(booking.total_price) || 0;

    // Discount percentage (for display in parentheses)
    let discountPercent = 0;
    if (discountAmount > 0 && subtotal > 0) {
        discountPercent = Math.round((discountAmount / subtotal) * 100);
    }

    const subtotalAfterDiscount = subtotal - discountAmount;

    // Tax rate from workspace settings (default 19% MwSt.)
    const taxRate = parseFloat(workspace?.tax_rate) || 19;

    // Brutto -> Netto: Netto = Brutto / (1 + Steuersatz)
    const netAmount = total / (1 + taxRate / 100);
    const taxAmount = total - netAmount;

    return {
        subtotal,
        discountAmount,
        discountPercent,
        subtotalAfterDiscount,
        taxRate,
        taxAmount,
        netAmount,
        total,
    };
};

/**
 * Get formatted invoice number from DB field
 * Format: RE-YYYY-XXXX (e.g. RE-2026-0001)
 */
export const getInvoiceNumber = (booking) => {
    const num = booking.invoice_number || 0;
    const created = new Date(booking.created_at);
    const year = created.getFullYear();
    return `RE-${year}-${String(num).padStart(4, '0')}`;
};

/**
 * Build Leistungszeitraum string
 * Single date if same day, range if different
 */
export const getLeistungszeitraum = (booking) => {
    const startStr = formatDate(booking.start_time);
    const endStr = formatDate(booking.end_time);
    if (!booking.end_time || startStr === endStr) return startStr;
    return `${startStr} \u2013 ${endStr}`;
};
