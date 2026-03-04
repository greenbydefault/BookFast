/**
 * PDF Export - Generates a real-text PDF from booking + workspace data
 * Uses pdfmake for native text rendering (selectable, searchable, copyable)
 */

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { formatDate } from '../../../lib/dateUtils.js';
import {
    fmt,
    buildLineItems,
    calculateTotals,
    getInvoiceNumber,
    getLeistungszeitraum,
} from './invoiceUtils.js';

// Register embedded Roboto fonts (vfs_fonts.js exports the vfs object directly in 0.2.x)
pdfMake.vfs = pdfFonts;

// ── Colors ──────────────────────────────────────────────
const C = {
    primary: '#1a1a2e',
    muted: '#6b7280',
    border: '#e5e7eb',
    headerBg: '#f9fafb',
    white: '#ffffff',
};

// ── Helpers ─────────────────────────────────────────────

/** Thin horizontal line spanning full width */
const hr = () => ({
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: C.border }],
    margin: [0, 8, 0, 8],
});

/** Spacer */
const spacer = (h = 12) => ({ text: '', margin: [0, 0, 0, h] });

// ── Section builders ────────────────────────────────────

const buildHeader = (booking) => {
    const invoiceNumber = getInvoiceNumber(booking);

    return [
        { text: 'Rechnung', style: 'title' },
        { text: `Rechnungsnummer  #${invoiceNumber}`, style: 'subtitle', margin: [0, 4, 0, 12] },
        {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: 'Ausstellungsdatum', style: 'label' },
                        { text: formatDate(booking.created_at), style: 'value' },
                    ],
                },
                {
                    width: '50%',
                    stack: [
                        { text: 'Leistungszeitraum', style: 'label' },
                        { text: getLeistungszeitraum(booking), style: 'value' },
                    ],
                },
            ],
        },
        spacer(16),
        hr(),
    ];
};

const buildAddresses = (booking, workspace) => {
    const fromName = workspace?.company_name || 'Firmenname';
    const fromAddress = workspace?.company_address || 'Stra\u00DFe Nr.';
    const fromZip = workspace?.company_zip || 'PLZ';
    const fromCity = workspace?.company_city || 'Stadt';
    const fromCountry = workspace?.company_country || 'Deutschland';

    const toName = booking.customer_name || 'Kundenname';
    const toAddress = 'Adresse';
    const toZip = 'PLZ';
    const toCity = 'Stadt';

    return [
        {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: 'Von', style: 'label' },
                        { text: fromName, bold: true, margin: [0, 2, 0, 0] },
                        { text: fromAddress, style: 'bodySmall' },
                        { text: `${fromZip} ${fromCity}`, style: 'bodySmall' },
                        { text: fromCountry, style: 'bodySmall' },
                    ],
                },
                {
                    width: '50%',
                    stack: [
                        { text: 'An', style: 'label' },
                        { text: toName, bold: true, margin: [0, 2, 0, 0] },
                        { text: toAddress, style: 'bodySmall' },
                        { text: `${toZip} ${toCity}`, style: 'bodySmall' },
                    ],
                },
            ],
        },
        spacer(16),
        hr(),
    ];
};

const buildItemsTable = (lineItems) => {
    const headerRow = [
        { text: 'Beschreibung', style: 'tableHeader' },
        { text: 'Menge', style: 'tableHeader', alignment: 'center' },
        { text: 'Einzelpreis', style: 'tableHeader', alignment: 'right' },
        { text: 'Gesamt', style: 'tableHeader', alignment: 'right' },
    ];

    const dataRows = lineItems.map((item) => [
        { text: item.name, fontSize: 9 },
        { text: String(item.quantity), fontSize: 9, alignment: 'center' },
        { text: fmt(item.unitPrice), fontSize: 9, alignment: 'right' },
        { text: fmt(item.total), fontSize: 9, alignment: 'right' },
    ]);

    return [
        {
            table: {
                headerRows: 1,
                widths: ['*', 50, 80, 80],
                body: [headerRow, ...dataRows],
            },
            layout: {
                hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 0.5 : 0,
                vLineWidth: () => 0,
                hLineColor: () => C.border,
                paddingLeft: () => 6,
                paddingRight: () => 6,
                paddingTop: () => 6,
                paddingBottom: () => 6,
                fillColor: (i) => (i === 0 ? C.headerBg : null),
            },
        },
        spacer(12),
    ];
};

const buildSummary = (totals) => {
    const rows = [];

    rows.push(['Zwischensumme (Brutto)', fmt(totals.subtotal)]);

    if (totals.discountAmount > 0) {
        const label = totals.discountPercent > 0
            ? `Rabatt (${totals.discountPercent} %)`
            : 'Rabatt';
        rows.push([label, `\u2212 ${fmt(totals.discountAmount)}`]);
        rows.push(['Zwischensumme nach Rabatt', fmt(totals.subtotalAfterDiscount)]);
    }

    rows.push(['Nettobetrag', fmt(totals.netAmount)]);
    rows.push([`darin enth. USt. (${totals.taxRate} %)`, fmt(totals.taxAmount)]);

    // Total row (bold)
    const totalRow = [
        { text: 'Gesamtbetrag', bold: true, fontSize: 11 },
        { text: fmt(totals.total), bold: true, fontSize: 11, alignment: 'right' },
    ];

    const summaryBody = rows.map(([label, value]) => [
        { text: label, fontSize: 9, color: C.muted },
        { text: value, fontSize: 9, alignment: 'right' },
    ]);

    summaryBody.push(totalRow);

    return [
        {
            columns: [
                { width: '*', text: '' },
                {
                    width: 250,
                    table: {
                        widths: ['*', 'auto'],
                        body: summaryBody,
                    },
                    layout: {
                        hLineWidth: (i, node) => (i === node.table.body.length - 1) ? 0.5 : 0,
                        vLineWidth: () => 0,
                        hLineColor: () => C.border,
                        paddingLeft: () => 4,
                        paddingRight: () => 4,
                        paddingTop: () => 4,
                        paddingBottom: () => 4,
                    },
                },
            ],
        },
        spacer(20),
        hr(),
    ];
};

const buildFooter = (workspace) => {
    const name = workspace?.company_name || 'Firmenname';
    const address = workspace?.company_address || 'Stra\u00DFe Nr.';
    const zip = workspace?.company_zip || 'PLZ';
    const city = workspace?.company_city || 'Stadt';
    const country = workspace?.company_country || 'Deutschland';
    const bankName = workspace?.bank_name || 'Bankname';
    const iban = workspace?.iban || 'DE00 0000 0000 0000 0000 00';
    const bic = workspace?.bic || 'BICXXXXXX';
    const taxId = workspace?.tax_id || null;
    const vatId = workspace?.vat_id || null;

    const taxParts = [];
    if (taxId) taxParts.push(`St.-Nr. ${taxId}`);
    if (vatId) taxParts.push(`USt-IdNr. ${vatId}`);
    const taxLine = taxParts.length > 0 ? taxParts.join('    ') : 'St.-Nr. \u2014    USt-IdNr. \u2014';

    return [
        {
            columns: [
                {
                    width: '35%',
                    stack: [
                        { text: name, bold: true, fontSize: 8 },
                        { text: address, fontSize: 8, color: C.muted },
                        { text: `${zip} ${city}`, fontSize: 8, color: C.muted },
                        { text: country, fontSize: 8, color: C.muted },
                    ],
                },
                {
                    width: '35%',
                    stack: [
                        { text: [{ text: 'Bank: ', bold: true, fontSize: 8 }, { text: bankName, fontSize: 8 }] },
                        { text: [{ text: 'IBAN: ', bold: true, fontSize: 8 }, { text: iban, fontSize: 8 }] },
                        { text: [{ text: 'BIC: ', bold: true, fontSize: 8 }, { text: bic, fontSize: 8 }] },
                    ],
                },
                {
                    width: '30%',
                    stack: [
                        { text: taxLine, fontSize: 8, color: C.muted },
                    ],
                },
            ],
        },
    ];
};

// ── Main export ─────────────────────────────────────────

/**
 * Generate and download a PDF invoice with real selectable text
 * @param {Object} booking - Booking data with relations
 * @param {Object} workspace - Workspace data for sender info
 */
export const generateInvoicePDF = (booking, workspace) => {
    const lineItems = buildLineItems(booking);
    const totals = calculateTotals(booking, lineItems, workspace);
    const invoiceNumber = getInvoiceNumber(booking);

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],

        content: [
            ...buildHeader(booking),
            ...buildAddresses(booking, workspace),
            ...buildItemsTable(lineItems),
            ...buildSummary(totals),
            ...buildFooter(workspace),
        ],

        styles: {
            title: {
                fontSize: 22,
                bold: true,
                color: C.primary,
            },
            subtitle: {
                fontSize: 10,
                color: C.muted,
            },
            label: {
                fontSize: 8,
                color: C.muted,
                margin: [0, 0, 0, 2],
            },
            value: {
                fontSize: 10,
            },
            bodySmall: {
                fontSize: 9,
                color: C.muted,
                margin: [0, 1, 0, 0],
            },
            tableHeader: {
                fontSize: 8,
                bold: true,
                color: C.muted,
            },
        },

        defaultStyle: {
            font: 'Roboto',
            fontSize: 9,
        },
    };

    pdfMake.createPdf(docDefinition).download(`Rechnung-${invoiceNumber}.pdf`);
};
