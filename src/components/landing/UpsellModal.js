import { getIconString } from '../Icons/Icon.js';
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
  modalOverlay.className = 'modal-overlay';
  // Ensure centering and full coverage
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100vw'; // Fallback
  modalOverlay.style.height = '100vh'; // Fallback
  modalOverlay.style.inset = '0';
  modalOverlay.style.zIndex = '999999';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Ensure backdrop is visible
  modalOverlay.style.backdropFilter = 'blur(4px)';

  modalOverlay.innerHTML = `
    <div class="modal-container" style="max-width: 480px; text-align: center; margin: 0;">
      <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
        <button class="modal-close-btn" id="upsell-close-btn">${getIconString('x')}</button>
      </div>
      <div class="modal-body" style="padding: 0 2rem 2.5rem 2rem;">
        <div style="margin-bottom: 1.5rem; display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: var(--color-majorelle-blue-50); color: var(--color-primary-600); border-radius: 50%;">
           ${getIconString('lock')}
        </div>
        
        <h2 class="modal-title" style="font-size: 1.5rem; margin-bottom: 0.75rem;">Bereit für mehr?</h2>
        <p class="modal-subtitle" style="margin-bottom: 2rem; color: var(--color-stone-600);">
          Die Demo-Funktionen sind eingeschränkt. Erstellen Sie jetzt Ihren kostenlosen Account, um Buchungen anzulegen, Rechnungen zu schreiben und Ihr Business zu verwalten.
        </p>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button class="btn-primary" id="upsell-register-btn" style="width: 100%; justify-content: center; padding: 0.875rem;">
              Kostenlos registrieren
            </button>
            <button class="btn-text" id="upsell-cancel-btn" style="color: var(--color-stone-500);">
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
