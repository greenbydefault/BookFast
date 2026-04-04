/**
 * CustomerPortalPreviewCard – Landing-only mirror of the magic-link portal.
 * Shows the no-login promise, PIN gate and self-service actions.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

export const createCustomerPortalPreviewCard = () => `
  <div class="feature-demo-card" id="customer-portal-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Kundenportal</h3>
        <p class="feature-demo-card__subtitle">Magic Link, PIN und Self-Service wie im echten Portal verdichtet.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="customer-portal-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Mail ansehen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Portal öffnen</button>
    </div>
  </div>
`;

export const initCustomerPortalPreviewCard = (heroContainer) => {
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
        <p class="cp-preview-section-label">${getIconString('blocks-integration')} Buchen ohne Konto</p>
        <div class="customer-portal-demo__summary">
          <div class="customer-portal-demo__summary-top">
            <div>
              <span class="booking-demo__mini-label">Buchung bestätigt</span>
              <strong>Workshop Raum · 24. April</strong>
            </div>
            <span class="booking-demo__badge booking-demo__badge--confirmed">Ohne Login</span>
          </div>
          <p>Der Kunde bucht direkt im Widget. Kein Passwort, kein Konto, keine App nötig.</p>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="cp-magic-link">
        <p class="cp-preview-section-label">${getIconString('key')} Magic Link mit PIN</p>
        <div class="customer-portal-demo__pin-card ${state.unlocked ? 'is-unlocked' : ''}">
          <div class="customer-portal-demo__pin-top">
            <strong>${state.unlocked ? 'Portal entsperrt' : 'Zugangscode eingeben'}</strong>
            <span>${state.unlocked ? 'PIN bestätigt' : '5-stellig per E-Mail'}</span>
          </div>
          <div class="customer-portal-demo__pin-digits" aria-hidden="true">
            <span>4</span><span>1</span><span>9</span><span>2</span><span>7</span>
          </div>
          <button type="button" class="customer-portal-demo__primary-btn" id="customer-portal-demo-unlock">
            ${state.unlocked ? 'Erneut anzeigen' : 'Magic Link öffnen'}
          </button>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="cp-self-service">
        <p class="cp-preview-section-label">${getIconString('check')} Self-Service für Kunden</p>
        <div class="customer-portal-demo__actions-card">
          <div class="customer-portal-demo__actions-top">
            <div>
              <span class="booking-demo__mini-label">Aktionen</span>
              <strong>${state.cancelled ? 'Buchung storniert' : state.paid ? 'Restbetrag bezahlt' : '175 EUR offen'}</strong>
            </div>
            <span class="booking-demo__badge booking-demo__badge--${state.cancelled ? 'cancelled' : state.paid ? 'confirmed' : 'pending'}">
              ${state.cancelled ? 'Storniert' : state.paid ? 'Bezahlt' : 'Offen'}
            </span>
          </div>
          <div class="customer-portal-demo__actions-list">
            <button type="button" class="customer-portal-demo__action">${getIconString('download-file')} Rechnung als PDF</button>
            <button type="button" class="customer-portal-demo__action" id="customer-portal-demo-pay">
              ${getIconString('money-hand')} ${state.paid ? 'Zahlung verbucht' : 'Jetzt bezahlen'}
            </button>
            <button type="button" class="customer-portal-demo__action" id="customer-portal-demo-cancel">
              ${getIconString('lock')} ${state.cancelled ? 'Storno durchgeführt' : 'Buchung stornieren'}
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
