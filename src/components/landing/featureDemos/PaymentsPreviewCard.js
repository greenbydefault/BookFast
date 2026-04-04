/**
 * PaymentsPreviewCard – Landing-only mirror of Stripe setup, deposits and payouts.
 * Focuses on the commercial flow, not the full checkout implementation.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Zahlungen',
    subtitle: 'Stripe Connect, Anzahlung und Auszahlung wie im Zahlungs-Setup verdichtet.',
    footerSecondary: 'Später',
    footerPrimary: 'Stripe starten',
  },
  connectStates: [
    { id: 'inactive', label: 'Nicht eingerichtet', tone: 'pending', title: 'Konto starten' },
    { id: 'pending', label: 'In Prüfung', tone: 'pending', title: 'Verifizierung läuft' },
    { id: 'active', label: 'Aktiv', tone: 'confirmed', title: 'Zahlungen bereit' },
  ],
  payouts: [],
  sections: {
    connect: 'Stripe verbinden',
    deposit: 'Anzahlungen pro Service',
    payouts: 'Auszahlung & Refund',
  },
  serviceLabel: 'Service',
  serviceName: 'Workshop Raum',
  splitLabels: {
    deposit: 'Anzahlung bei Buchung',
    remainder: 'Restbetrag',
  },
  statusDescriptions: {
    inactive: 'Onboarding-Link direkt aus den Einstellungen starten.',
    pending: 'Stripe prüft noch Angaben, BookFast hält den Workspace synchron.',
    active: 'Karte, Wallet und Checkout sind freigeschaltet.',
  },
  actions: {
    refund: 'Refund simulieren',
    refundReset: 'Refund zurücksetzen',
    next: 'Nächsten Schritt zeigen',
    active: 'Aktiv',
    refundedBadge: 'Erstattet',
  },
};

const getConnectMeta = (content, status) => (
  (content.connectStates || DEFAULT_CONTENT.connectStates).find((item) => item.id === status)
  || (content.connectStates || DEFAULT_CONTENT.connectStates)[0]
);

export const createPaymentsPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="payments-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
    </div>
    <div class="feature-demo-card__body" id="payments-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initPaymentsPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#payments-preview-body');
  if (!body) return;

  const state = {
    connectStatus: 'inactive',
    depositPercent: 30,
    totalAmount: 240,
    refunded: false,
  };

  const render = () => {
    const connect = getConnectMeta(content, state.connectStatus);
    const depositAmount = Math.round((state.totalAmount * state.depositPercent) / 100);
    const remainingAmount = state.totalAmount - depositAmount;

    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="pay-connect">
        <p class="pay-preview-section-label">${getIconString('bank-card')} ${content.sections.connect}</p>
        <div class="payments-demo__steps">
          ${(content.connectStates || DEFAULT_CONTENT.connectStates).map((step, index) => `
            <button
              type="button"
              class="payments-demo__step ${state.connectStatus === step.id ? 'is-active' : ''}"
              data-connect-status="${step.id}"
            >
              <span class="payments-demo__step-index">${index + 1}</span>
              <span class="payments-demo__step-copy">
                <strong>${step.title}</strong>
                <small>${step.label}</small>
              </span>
            </button>
          `).join('')}
        </div>
        <div class="payments-demo__status-card">
          <span class="booking-demo__badge booking-demo__badge--${connect.tone}">${connect.label}</span>
          <p>${content.statusDescriptions[state.connectStatus] || content.statusDescriptions.inactive}</p>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="pay-deposit">
        <p class="pay-preview-section-label">${getIconString('receipt-euro')} ${content.sections.deposit}</p>
        <div class="payments-demo__deposit-card">
          <div class="payments-demo__deposit-top">
            <div>
              <span class="booking-demo__mini-label">${content.serviceLabel}</span>
              <strong>${content.serviceName}</strong>
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
              <span>${content.splitLabels.deposit}</span>
              <strong>${depositAmount} EUR</strong>
            </div>
            <div>
              <span>${content.splitLabels.remainder}</span>
              <strong>${remainingAmount} EUR</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="pay-payouts">
        <p class="pay-preview-section-label">${getIconString('money-hand')} ${content.sections.payouts}</p>
        <div class="payments-demo__payout-list">
          ${(content.payouts || []).map((item, index) => `
            <div class="payments-demo__payout-item ${index === 1 && state.refunded ? 'is-refunded' : ''}">
              <div>
                <strong>${item.label}</strong>
                <p>${item.meta}</p>
              </div>
              <span>${index === 1 && state.refunded ? content.actions.refundedBadge : item.amount}</span>
            </div>
          `).join('')}
        </div>
        <div class="payments-demo__payout-actions">
          <button type="button" class="payments-demo__action" id="payments-demo-refund">
            ${state.refunded ? content.actions.refundReset : content.actions.refund}
          </button>
          <button type="button" class="payments-demo__action payments-demo__action--primary" id="payments-demo-connect-next">
            ${state.connectStatus === 'active' ? content.actions.active : content.actions.next}
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
