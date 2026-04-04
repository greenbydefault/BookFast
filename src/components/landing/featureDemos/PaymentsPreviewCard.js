/**
 * PaymentsPreviewCard – Landing-only mirror of Stripe setup, deposits and payouts.
 * Focuses on the commercial flow, not the full checkout implementation.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const CONNECT_STATES = [
  { id: 'inactive', label: 'Nicht eingerichtet', tone: 'pending' },
  { id: 'pending', label: 'In Prüfung', tone: 'pending' },
  { id: 'active', label: 'Aktiv', tone: 'confirmed' },
];

const PAYOUTS = [
  { id: 'po-1', label: 'Auszahlung geplant', amount: '623 EUR', meta: 'morgen · Studio Nordlicht' },
  { id: 'po-2', label: 'Refund automatisiert', amount: '149 EUR', meta: 'bei Ablehnung ohne Extra-Aufwand' },
];

const getConnectMeta = (status) => CONNECT_STATES.find((item) => item.id === status) || CONNECT_STATES[0];

export const createPaymentsPreviewCard = () => `
  <div class="feature-demo-card" id="payments-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Zahlungen</h3>
        <p class="feature-demo-card__subtitle">Stripe Connect, Anzahlung und Auszahlung wie im Zahlungs-Setup verdichtet.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="payments-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Später</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Stripe starten</button>
    </div>
  </div>
`;

export const initPaymentsPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#payments-preview-body');
  if (!body) return;

  const state = {
    connectStatus: 'inactive',
    depositPercent: 30,
    totalAmount: 240,
    refunded: false,
  };

  const render = () => {
    const connect = getConnectMeta(state.connectStatus);
    const depositAmount = Math.round((state.totalAmount * state.depositPercent) / 100);
    const remainingAmount = state.totalAmount - depositAmount;

    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="pay-connect">
        <p class="pay-preview-section-label">${getIconString('bank-card')} Stripe verbinden</p>
        <div class="payments-demo__steps">
          ${CONNECT_STATES.map((step, index) => `
            <button
              type="button"
              class="payments-demo__step ${state.connectStatus === step.id ? 'is-active' : ''}"
              data-connect-status="${step.id}"
            >
              <span class="payments-demo__step-index">${index + 1}</span>
              <span class="payments-demo__step-copy">
                <strong>${step.id === 'inactive' ? 'Konto starten' : step.id === 'pending' ? 'Verifizierung läuft' : 'Zahlungen bereit'}</strong>
                <small>${step.label}</small>
              </span>
            </button>
          `).join('')}
        </div>
        <div class="payments-demo__status-card">
          <span class="booking-demo__badge booking-demo__badge--${connect.tone}">${connect.label}</span>
          <p>${state.connectStatus === 'active'
            ? 'Karte, Wallet und Checkout sind freigeschaltet.'
            : state.connectStatus === 'pending'
              ? 'Stripe prüft noch Angaben, BookFast hält den Workspace synchron.'
              : 'Onboarding-Link direkt aus den Einstellungen starten.'}</p>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="pay-deposit">
        <p class="pay-preview-section-label">${getIconString('receipt-euro')} Anzahlungen pro Service</p>
        <div class="payments-demo__deposit-card">
          <div class="payments-demo__deposit-top">
            <div>
              <span class="booking-demo__mini-label">Service</span>
              <strong>Workshop Raum</strong>
            </div>
            <span class="payments-demo__deposit-value">${state.depositPercent} %</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value="${state.depositPercent}"
            id="payments-demo-deposit-range"
            class="payments-demo__range"
          >
          <div class="payments-demo__split">
            <div>
              <span>Anzahlung bei Buchung</span>
              <strong>${depositAmount} EUR</strong>
            </div>
            <div>
              <span>Restbetrag</span>
              <strong>${remainingAmount} EUR</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="pay-payouts">
        <p class="pay-preview-section-label">${getIconString('money-hand')} Auszahlung & Refund</p>
        <div class="payments-demo__payout-list">
          ${PAYOUTS.map((item, index) => `
            <div class="payments-demo__payout-item ${index === 1 && state.refunded ? 'is-refunded' : ''}">
              <div>
                <strong>${item.label}</strong>
                <p>${item.meta}</p>
              </div>
              <span>${index === 1 && state.refunded ? 'Erstattet' : item.amount}</span>
            </div>
          `).join('')}
        </div>
        <div class="payments-demo__payout-actions">
          <button type="button" class="payments-demo__action" id="payments-demo-refund">
            ${state.refunded ? 'Refund zurücksetzen' : 'Refund simulieren'}
          </button>
          <button type="button" class="payments-demo__action payments-demo__action--primary" id="payments-demo-connect-next">
            ${state.connectStatus === 'active' ? 'Aktiv' : 'Nächsten Schritt zeigen'}
          </button>
        </div>
      </div>
    `;

    body.querySelectorAll('[data-connect-status]').forEach((button) => {
      button.addEventListener('click', () => {
        state.connectStatus = button.dataset.connectStatus || 'inactive';
        render();
      });
    });

    body.querySelector('#payments-demo-deposit-range')?.addEventListener('input', (event) => {
      state.depositPercent = Number(event.target.value) || 30;
      render();
    });

    body.querySelector('#payments-demo-refund')?.addEventListener('click', () => {
      state.refunded = !state.refunded;
      render();
    });

    body.querySelector('#payments-demo-connect-next')?.addEventListener('click', () => {
      if (state.connectStatus === 'inactive') {
        state.connectStatus = 'pending';
      } else if (state.connectStatus === 'pending') {
        state.connectStatus = 'active';
      }
      render();
    });
  };

  render();
};
