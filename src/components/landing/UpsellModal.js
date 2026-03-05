import './UpsellModal.css';
import { saveDemoToSession } from '../../lib/DemoStore.js';

/**
 * Open the Upsell Modal
 * "Du willst mehr? Registriere dich jetzt."
 */
export const openUpsellModal = () => {
  // Check if modal already exists
  if (document.getElementById('upsell-modal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'upsell-modal';
  modalOverlay.className = 'modal-overlay upsell-modal';

  modalOverlay.innerHTML = `
    <div class="modal-container upsell-modal__container">
      <div class="modal-header upsell-modal__header">
        <button class="modal-close-btn upsell-modal__close-btn" id="upsell-close-btn" aria-label="Modal schließen"></button>
      </div>
      <div class="modal-content upsell-modal__content">
        <h2 class="upsell-modal__title">Bereit für mehr?</h2>
        <p class="upsell-modal__subtitle">
          Die Demo-Funktionen sind eingeschränkt. Erstellen Sie jetzt Ihren kostenlosen Account, um Buchungen anzulegen, Rechnungen zu schreiben und Ihr Business zu verwalten.
        </p>

        <div class="upsell-modal__actions">
          <button class="btn btn-primary upsell-modal__register-btn" id="upsell-register-btn">
            Kostenlos registrieren
          </button>
          <button class="btn-text upsell-modal__cancel-btn" id="upsell-cancel-btn">
            Zurück zur Demo
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Animation
  requestAnimationFrame(() => {
    modalOverlay.classList.add('open');
  });

  // Event Listeners
  const close = () => {
    modalOverlay.classList.remove('open');
    setTimeout(() => {
      modalOverlay.remove();
    }, 300);
  };

  modalOverlay.querySelector('#upsell-close-btn').addEventListener('click', close);
  modalOverlay.querySelector('#upsell-cancel-btn').addEventListener('click', close);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) close();
  });

  // Register Button
  modalOverlay.querySelector('#upsell-register-btn').addEventListener('click', () => {
    saveDemoToSession();
    window.location.href = '/register.html';
  });
};
