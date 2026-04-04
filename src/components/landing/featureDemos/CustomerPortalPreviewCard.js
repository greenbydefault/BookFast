/**
 * CustomerPortalPreviewCard – Landing-only mirror of the magic-link portal.
 * Shows the no-login promise, PIN gate and self-service actions.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Kundenportal',
    subtitle: 'Magic Link, PIN und Self-Service wie im echten Portal verdichtet.',
    closeLabel: 'Schließen',
    footerSecondary: 'Mail ansehen',
    footerPrimary: 'Portal öffnen',
  },
  sections: {
    frictionless: 'Buchen ohne Konto',
    magicLink: 'Magic Link mit PIN',
    selfService: 'Self-Service für Kunden',
  },
  labels: {
    bookingConfirmed: 'Buchung bestätigt',
    noLogin: 'Ohne Login',
    actions: 'Aktionen',
    paid: 'Bezahlt',
    open: 'Offen',
    cancelled: 'Storniert',
  },
  values: {
    bookingSummary: 'Workshop Raum · 24. April',
    pinCode: ['4', '1', '9', '2', '7'],
    openAmount: '175 EUR offen',
    invoiceAction: 'Rechnung als PDF',
  },
  descriptions: {
    frictionless: 'Der Kunde bucht direkt im Widget. Kein Passwort, kein Konto, keine App nötig.',
    lockedTitle: 'Zugangscode eingeben',
    unlockedTitle: 'Portal entsperrt',
    lockedSubtitle: '5-stellig per E-Mail',
    unlockedSubtitle: 'PIN bestätigt',
    unlockAction: 'Magic Link öffnen',
    unlockActionDone: 'Erneut anzeigen',
    payAction: 'Jetzt bezahlen',
    payActionDone: 'Zahlung verbucht',
    cancelAction: 'Buchung stornieren',
    cancelActionDone: 'Storno durchgeführt',
    paidSummary: 'Restbetrag bezahlt',
    cancelledSummary: 'Buchung storniert',
  },
};

export const createCustomerPortalPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="customer-portal-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="${content.card.closeLabel}">×</button>
    </div>
    <div class="feature-demo-card__body" id="customer-portal-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initCustomerPortalPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#customer-portal-preview-body');
  if (!body) return;

  const state = {
    unlocked: false,
    paid: false,
    cancelled: false,
  };

  const render = () => {
    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="cp-frictionless">
        <p class="cp-preview-section-label">${getIconString('blocks-integration')} ${content.sections.frictionless}</p>
        <div class="customer-portal-demo__summary">
          <div class="customer-portal-demo__summary-top">
            <div>
              <span class="booking-demo__mini-label">${content.labels.bookingConfirmed}</span>
              <strong>${content.values.bookingSummary}</strong>
            </div>
            <span class="booking-demo__badge booking-demo__badge--confirmed">${content.labels.noLogin}</span>
          </div>
          <p>${content.descriptions.frictionless}</p>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="cp-magic-link">
        <p class="cp-preview-section-label">${getIconString('key')} ${content.sections.magicLink}</p>
        <div class="customer-portal-demo__pin-card ${state.unlocked ? 'is-unlocked' : ''}">
          <div class="customer-portal-demo__pin-top">
            <strong>${state.unlocked ? content.descriptions.unlockedTitle : content.descriptions.lockedTitle}</strong>
            <span>${state.unlocked ? content.descriptions.unlockedSubtitle : content.descriptions.lockedSubtitle}</span>
          </div>
          <div class="customer-portal-demo__pin-digits" aria-hidden="true">
            ${(content.values.pinCode || []).map((digit) => `<span>${digit}</span>`).join('')}
          </div>
          <button type="button" class="customer-portal-demo__primary-btn" id="customer-portal-demo-unlock">
            ${state.unlocked ? content.descriptions.unlockActionDone : content.descriptions.unlockAction}
          </button>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="cp-self-service">
        <p class="cp-preview-section-label">${getIconString('check')} ${content.sections.selfService}</p>
        <div class="customer-portal-demo__actions-card">
          <div class="customer-portal-demo__actions-top">
            <div>
              <span class="booking-demo__mini-label">${content.labels.actions}</span>
              <strong>${state.cancelled ? content.descriptions.cancelledSummary : state.paid ? content.descriptions.paidSummary : content.values.openAmount}</strong>
            </div>
            <span class="booking-demo__badge booking-demo__badge--${state.cancelled ? 'cancelled' : state.paid ? 'confirmed' : 'pending'}">
              ${state.cancelled ? content.labels.cancelled : state.paid ? content.labels.paid : content.labels.open}
            </span>
          </div>
          <div class="customer-portal-demo__actions-list">
            <button type="button" class="customer-portal-demo__action">${getIconString('download-file')} ${content.values.invoiceAction}</button>
            <button type="button" class="customer-portal-demo__action" id="customer-portal-demo-pay">
              ${getIconString('money-hand')} ${state.paid ? content.descriptions.payActionDone : content.descriptions.payAction}
            </button>
            <button type="button" class="customer-portal-demo__action" id="customer-portal-demo-cancel">
              ${getIconString('lock')} ${state.cancelled ? content.descriptions.cancelActionDone : content.descriptions.cancelAction}
            </button>
          </div>
        </div>
      </div>
    `;

    body.querySelector('#customer-portal-demo-unlock')?.addEventListener('click', () => {
      state.unlocked = true;
      render();
    });

    body.querySelector('#customer-portal-demo-pay')?.addEventListener('click', () => {
      state.paid = !state.paid;
      if (state.paid) state.cancelled = false;
      render();
    });

    body.querySelector('#customer-portal-demo-cancel')?.addEventListener('click', () => {
      state.cancelled = !state.cancelled;
      if (state.cancelled) state.paid = false;
      render();
    });
  };

  render();
};
