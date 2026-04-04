/**
 * InvoicesPreviewCard – Landing-only mirror of invoice creation, portal handoff
 * and dashboard-side document actions.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const LINE_ITEMS = [
  { label: 'Workshop Raum', qty: '1x', price: '180 EUR' },
  { label: 'Beamer', qty: '1x', price: '15 EUR' },
  { label: 'Rabattcode SPRING', qty: '1x', price: '-20 EUR' },
];

export const createInvoicesPreviewCard = () => `
  <div class="feature-demo-card" id="invoices-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Rechnung</h3>
        <p class="feature-demo-card__subtitle">Automatisch aus Buchung, Add-ons und Firmendaten gebaut.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="invoices-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Entwurf</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">PDF öffnen</button>
    </div>
  </div>
`;

export const initInvoicesPreviewCard = (heroContainer) => {
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
        <p class="inv-preview-section-label">${getIconString('receipt-euro')} Automatisch erzeugt</p>
        <div class="invoice-demo__paper">
          <div class="invoice-demo__paper-top">
            <div>
              <span class="booking-demo__mini-label">Rechnungsnummer</span>
              <strong>#2026-1047</strong>
            </div>
            <span class="booking-demo__badge booking-demo__badge--${state.paymentStatus === 'paid' ? 'confirmed' : 'pending'}">
              ${state.paymentStatus === 'paid' ? 'Bezahlt' : 'Unbezahlt'}
            </span>
          </div>
          <div class="invoice-demo__line-items">
            ${LINE_ITEMS.map((item) => `
              <div class="invoice-demo__line-item">
                <span>${item.label}</span>
                <span>${item.qty}</span>
                <strong>${item.price}</strong>
              </div>
            `).join('')}
          </div>
          <div class="invoice-demo__totals">
            <span>Gesamtbetrag</span>
            <strong>175 EUR</strong>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="inv-portal">
        <p class="inv-preview-section-label">${getIconString('key')} Im Kundenportal sichtbar</p>
        <div class="invoice-demo__portal-card ${state.portalOpened ? 'is-open' : ''}">
          <div>
            <span class="booking-demo__mini-label">Portalansicht</span>
            <strong>${state.portalOpened ? 'Magic Link geöffnet' : 'Magic Link vorbereitet'}</strong>
            <p>${state.portalOpened
              ? 'Kunde sieht Rechnung, PDF und offenen Betrag direkt.'
              : 'Nach Bestätigung landet die Rechnung ohne Login im Self-Service.'}</p>
          </div>
          <button type="button" class="invoice-demo__secondary-btn" id="invoice-demo-open-portal">
            ${state.portalOpened ? 'Portal aktiv' : 'Portal öffnen'}
          </button>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="inv-dashboard">
        <p class="inv-preview-section-label">${getIconString('download-file')} Dashboard & Download</p>
        <div class="invoice-demo__actions-card">
          <div class="invoice-demo__action-row">
            <span>PDF-Export</span>
            <strong>${state.pdfReady ? 'Bereit' : 'Noch nicht geöffnet'}</strong>
          </div>
          <div class="invoice-demo__action-row">
            <span>Offener Betrag</span>
            <strong>${state.paymentStatus === 'paid' ? '0 EUR' : '175 EUR'}</strong>
          </div>
          <div class="invoice-demo__action-buttons">
            <button type="button" class="invoice-demo__secondary-btn" id="invoice-demo-download">
              ${state.pdfReady ? 'PDF erneut laden' : 'PDF erzeugen'}
            </button>
            <button type="button" class="invoice-demo__secondary-btn invoice-demo__secondary-btn--primary" id="invoice-demo-toggle-paid">
              ${state.paymentStatus === 'paid' ? 'Als offen zeigen' : 'Als bezahlt markieren'}
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
