import './WaitlistModal.css';
import { getIconString } from '../Icons/Icon.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const resolveCloseIconMarkup = () => {
  const hasCloseIcon = Boolean(document.getElementById('icon-close'));
  return hasCloseIcon
    ? getIconString('close', 'waitlist-modal__close-icon')
    : '<span class="waitlist-modal__close-fallback" aria-hidden="true">&times;</span>';
};

/**
 * Open the Waitlist Modal
 * E-Mail-Eingabe für Testphase-Waitlist mit Double-Opt-In.
 */
export const openWaitlistModal = () => {
  if (document.getElementById('waitlist-modal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'waitlist-modal';
  modalOverlay.className = 'modal-overlay waitlist-modal';

  modalOverlay.innerHTML = `
    <div class="modal-container waitlist-modal__container">
      <div class="modal-header waitlist-modal__header">
        <button class="modal-close-btn waitlist-modal__close-btn" id="waitlist-close-btn" aria-label="Modal schließen">${resolveCloseIconMarkup()}</button>
      </div>
      <div class="modal-content waitlist-modal__content">
        <h2 class="waitlist-modal__title">Zur Warteliste anmelden</h2>
        <p class="waitlist-modal__subtitle">
          Wir sind gerade in der Testphase. Trag dich ein und wir melden uns, sobald BookFast für dich bereit ist.
        </p>

        <form class="waitlist-modal__form" id="waitlist-form">
          <label class="waitlist-modal__label" for="waitlist-email">E-Mail</label>
          <input
            type="email"
            id="waitlist-email"
            class="waitlist-modal__input"
            placeholder="deine@email.de"
            required
            autocomplete="email"
          >
          <p class="waitlist-modal__error" id="waitlist-error" style="display:none;"></p>
          <button type="submit" class="btn btn-primary waitlist-modal__submit-btn" id="waitlist-submit-btn">
            Eintragen
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  requestAnimationFrame(() => {
    modalOverlay.classList.add('open');
  });

  const close = () => {
    modalOverlay.classList.remove('open');
    setTimeout(() => modalOverlay.remove(), 300);
  };

  modalOverlay.querySelector('#waitlist-close-btn').addEventListener('click', close);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) close();
  });

  modalOverlay.querySelector('#waitlist-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = modalOverlay.querySelector('#waitlist-email');
    const submitBtn = modalOverlay.querySelector('#waitlist-submit-btn');
    const errorEl = modalOverlay.querySelector('#waitlist-error');
    const email = emailInput?.value?.trim();
    if (!email) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird eingetragen…';
    errorEl.style.display = 'none';

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/waitlist-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const fallback =
          res.status === 429
            ? 'Zu viele Versuche. Bitte warte kurz und probiere es erneut.'
            : res.status >= 500
              ? 'Ein interner Fehler ist aufgetreten. Bitte versuche es später erneut.'
              : `Fehler: ${data.error || res.statusText || res.status}`;
        throw new Error(data.error || fallback);
      }

      const content = modalOverlay.querySelector('.waitlist-modal__content');
      content.innerHTML = `
        <h2 class="waitlist-modal__title">Fast geschafft!</h2>
        <p class="waitlist-modal__subtitle">
          Wir haben dir eine Bestätigungsmail geschickt. Bitte klicke auf den Link in der E-Mail, um deine Anmeldung abzuschließen.
        </p>
        <button class="btn btn-primary waitlist-modal__submit-btn" id="waitlist-done-btn">Schließen</button>
      `;
      modalOverlay.querySelector('#waitlist-done-btn').addEventListener('click', close);

    } catch (err) {
      errorEl.textContent = err.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Eintragen';
    }
  });
};
