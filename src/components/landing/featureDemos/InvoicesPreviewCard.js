/**
 * InvoicesPreviewCard – Landing-only mirror of invoice creation, portal handoff
 * and dashboard-side document actions.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Rechnung',
    subtitle: 'Automatisch aus Buchung, Add-ons und Firmendaten gebaut.',
    closeLabel: 'Schließen',
    footerSecondary: 'Entwurf',
    footerPrimary: 'PDF öffnen',
  },
  lineItems: [],
  sections: {
    created: 'Automatisch erzeugt',
    portal: 'Im Kundenportal sichtbar',
    dashboard: 'Dashboard & Download',
  },
  labels: {
    invoiceNumber: 'Rechnungsnummer',
    total: 'Gesamtbetrag',
    portalView: 'Portalansicht',
    pdfExport: 'PDF-Export',
    outstandingAmount: 'Offener Betrag',
  },
  paymentStatuses: {
    paid: 'Bezahlt',
    unpaid: 'Unbezahlt',
  },
  portalStates: {
    readyTitle: 'Magic Link vorbereitet',
    openTitle: 'Magic Link geöffnet',
    readyDescription: 'Nach Bestätigung landet die Rechnung ohne Login im Self-Service.',
    openDescription: 'Kunde sieht Rechnung, PDF und offenen Betrag direkt.',
    readyAction: 'Portal öffnen',
    openAction: 'Portal aktiv',
  },
  dashboardStates: {
    pdfReady: 'Bereit',
    pdfNotReady: 'Noch nicht geöffnet',
    download: 'PDF erzeugen',
    redownload: 'PDF erneut laden',
    markPaid: 'Als bezahlt markieren',
    markUnpaid: 'Als offen zeigen',
  },
  values: {
    invoiceNumber: '#2026-1047',
    total: '175 EUR',
    paidOutstanding: '0 EUR',
    unpaidOutstanding: '175 EUR',
  },
};

export const createInvoicesPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="invoices-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="${content.card.closeLabel}">×</button>
    </div>
    <div class="feature-demo-card__body" id="invoices-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initInvoicesPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#invoices-preview-body');
  if (!body) return;

  const state = {
    paymentStatus: 'unpaid',
    portalOpened: false,
    pdfReady: false,
  };

  const render = () => {
    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="inv-created">
        <p class="inv-preview-section-label">${getIconString('receipt-euro')} ${content.sections.created}</p>
        <div class="invoice-demo__paper">
          <div class="invoice-demo__paper-top">
            <div>
              <span class="booking-demo__mini-label">${content.labels.invoiceNumber}</span>
              <strong>${content.values.invoiceNumber}</strong>
            </div>
            <span class="booking-demo__badge booking-demo__badge--${state.paymentStatus === 'paid' ? 'confirmed' : 'pending'}">
              ${state.paymentStatus === 'paid' ? content.paymentStatuses.paid : content.paymentStatuses.unpaid}
            </span>
          </div>
          <div class="invoice-demo__line-items">
            ${(content.lineItems || []).map((item) => `
              <div class="invoice-demo__line-item">
                <span>${item.label}</span>
                <span>${item.qty}</span>
                <strong>${item.price}</strong>
              </div>
            `).join('')}
          </div>
          <div class="invoice-demo__totals">
            <span>${content.labels.total}</span>
            <strong>${content.values.total}</strong>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="inv-portal">
        <p class="inv-preview-section-label">${getIconString('key')} ${content.sections.portal}</p>
        <div class="invoice-demo__portal-card ${state.portalOpened ? 'is-open' : ''}">
          <div>
            <span class="booking-demo__mini-label">${content.labels.portalView}</span>
            <strong>${state.portalOpened ? content.portalStates.openTitle : content.portalStates.readyTitle}</strong>
            <p>${state.portalOpened
              ? content.portalStates.openDescription
              : content.portalStates.readyDescription}</p>
          </div>
          <button type="button" class="invoice-demo__secondary-btn" id="invoice-demo-open-portal">
            ${state.portalOpened ? content.portalStates.openAction : content.portalStates.readyAction}
          </button>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="inv-dashboard">
        <p class="inv-preview-section-label">${getIconString('download-file')} ${content.sections.dashboard}</p>
        <div class="invoice-demo__actions-card">
          <div class="invoice-demo__action-row">
            <span>${content.labels.pdfExport}</span>
            <strong>${state.pdfReady ? content.dashboardStates.pdfReady : content.dashboardStates.pdfNotReady}</strong>
          </div>
          <div class="invoice-demo__action-row">
            <span>${content.labels.outstandingAmount}</span>
            <strong>${state.paymentStatus === 'paid' ? content.values.paidOutstanding : content.values.unpaidOutstanding}</strong>
          </div>
          <div class="invoice-demo__action-buttons">
            <button type="button" class="invoice-demo__secondary-btn" id="invoice-demo-download">
              ${state.pdfReady ? content.dashboardStates.redownload : content.dashboardStates.download}
            </button>
            <button type="button" class="invoice-demo__secondary-btn invoice-demo__secondary-btn--primary" id="invoice-demo-toggle-paid">
              ${state.paymentStatus === 'paid' ? content.dashboardStates.markUnpaid : content.dashboardStates.markPaid}
            </button>
          </div>
        </div>
      </div>
    `;

    body.querySelector('#invoice-demo-open-portal')?.addEventListener('click', () => {
      state.portalOpened = true;
      render();
    });

    body.querySelector('#invoice-demo-download')?.addEventListener('click', () => {
      state.pdfReady = true;
      render();
    });

    body.querySelector('#invoice-demo-toggle-paid')?.addEventListener('click', () => {
      state.paymentStatus = state.paymentStatus === 'paid' ? 'unpaid' : 'paid';
      render();
    });
  };

  render();
};
