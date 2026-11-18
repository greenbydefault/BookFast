/**
 * PaymentsPreviewCard – Landing-only mirror of Stripe setup, checkout amount and payouts.
 * Focuses on the commercial flow, not the full checkout implementation.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Zahlungen',
    subtitle: 'Stripe Connect, Checkout-Betrag und Auszahlung wie in der App.',
    footerSecondary: 'Später',
    footerPrimary: 'Stripe starten',
  },
  connectStates: [
    { id: 'inactive', label: 'Nicht eingerichtet', tone: 'pending', title: 'Stripe Konto erstellen' },
    { id: 'pending', label: 'In Prüfung', tone: 'pending', title: 'Verifizierung' },
    { id: 'active', label: 'Aktiv', tone: 'confirmed', title: 'Bereit' },
  ],
  payouts: [],
  sections: {
    connect: 'Stripe verbinden',
    checkout: 'Betrag im Checkout',
    payouts: 'Auszahlung & Refund',
  },
  serviceLabel: 'Service',
  serviceName: 'Workshop Raum',
  checkoutLines: [
    { label: 'Workshop Raum, 4 Std.', amount: 180 },
    { label: 'Reinigungsgebühr', amount: 40 },
    { label: 'Beamer', amount: 15 },
  ],
  voucher: { label: 'Gutschein SPRING', amount: -20 },
  deposit: { percent: 30, now: 'Jetzt fällig, Anzahlung 30 %', later: 'Später im Kundenportal' },
  decimalSeparator: ',',
  checkoutHint: 'Der Kunde zahlt bei der Buchung per Karte.',
  statusDescriptions: {
    inactive: 'Onboarding startest du unter Einstellungen → Integration.',
    pending: 'Stripe prüft deine Angaben. Mit "Status prüfen" holst du den aktuellen Stand.',
    active: 'Kartenzahlung im Widget ist freigeschaltet.',
  },
  actions: {
    refund: 'Ablehnung simulieren',
    refundReset: 'Zurücksetzen',
    next: 'Nächsten Schritt zeigen',
    active: 'Aktiv',
    refundedBadge: 'Erstattet',
    voucherApply: 'Gutschein anwenden',
    voucherRemove: 'Gutschein entfernen',
    depositOn: 'Anzahlung 30 % an',
    depositOff: 'Anzahlung aus',
  },
};

const formatAmount = (value, separator = ',') => (
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace('.', separator)
);

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
    voucherApplied: true,
    depositEnabled: false,
    refunded: false,
  };

  const render = () => {
    const connect = getConnectMeta(content, state.connectStatus);
    const lines = [
      ...(content.checkoutLines || DEFAULT_CONTENT.checkoutLines),
      ...(state.voucherApplied ? [content.voucher || DEFAULT_CONTENT.voucher] : []),
    ];
    const checkoutTotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const deposit = content.deposit || DEFAULT_CONTENT.deposit;
    const depositNow = Math.round(checkoutTotal * deposit.percent) / 100;
    const separator = content.decimalSeparator || DEFAULT_CONTENT.decimalSeparator;
    const actions = { ...DEFAULT_CONTENT.actions, ...content.actions };

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

      <div class="modal-content-section" data-demo-section="pay-checkout">
        <p class="pay-preview-section-label">${getIconString('receipt-euro')} ${content.sections.checkout}</p>
        <div class="payments-demo__deposit-card">
          <div class="payments-demo__deposit-top">
            <div>
              <span class="booking-demo__mini-label">${content.serviceLabel}</span>
              <strong>${content.serviceName}</strong>
            </div>
            <span class="payments-demo__deposit-value">${checkoutTotal} EUR</span>
          </div>
          <div class="payments-demo__lines">
            ${lines.map((line) => `
              <div class="payments-demo__line">
                <span>${line.label}</span>
                <strong>${line.amount < 0 ? '−' : ''}${Math.abs(line.amount)} EUR</strong>
              </div>
            `).join('')}
            ${state.depositEnabled ? `
              <div class="payments-demo__line payments-demo__line--due">
                <span>${deposit.now}</span>
                <strong>${formatAmount(depositNow, separator)} EUR</strong>
              </div>
              <div class="payments-demo__line">
                <span>${deposit.later}</span>
                <strong>${formatAmount(checkoutTotal - depositNow, separator)} EUR</strong>
              </div>
            ` : ''}
          </div>
          <div class="payments-demo__payout-actions">
            <button type="button" class="payments-demo__action" id="payments-demo-voucher">
              ${state.voucherApplied ? actions.voucherRemove : actions.voucherApply}
            </button>
            <button type="button" class="payments-demo__action" id="payments-demo-deposit">
              ${state.depositEnabled ? actions.depositOff : actions.depositOn}
            </button>
          </div>
          <p class="payments-demo__hint">${content.checkoutHint}</p>
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

    body.querySelector('#payments-demo-voucher')?.addEventListener('click', () => {
      state.voucherApplied = !state.voucherApplied;
      render();
    });

    body.querySelector('#payments-demo-deposit')?.addEventListener('click', () => {
      state.depositEnabled = !state.depositEnabled;
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
