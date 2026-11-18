import './WaitlistModal.css';
import { getIconString } from '../Icons/Icon.js';
import { getLocaleFromPath, normalizeLandingPath } from '../../lib/landingLocale.js';
import { getUiChrome } from '../../locales/uiChrome.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const resolveCloseIconMarkup = () => {
  const hasCloseIcon = Boolean(document.getElementById('icon-close'));
  return hasCloseIcon
    ? getIconString('close', 'waitlist-modal__close-icon')
    : '<span class="waitlist-modal__close-fallback" aria-hidden="true">&times;</span>';
};

const currentLocale = () =>
  getLocaleFromPath(
    normalizeLandingPath(window.location.pathname === '/index.html' ? '/' : window.location.pathname),
  );

/**
 * Open the Waitlist Modal
 * E-Mail-Eingabe für Testphase-Waitlist mit Double-Opt-In.
 */
export const openWaitlistModal = () => {
  if (document.getElementById('waitlist-modal')) return;

  const chrome = getUiChrome(currentLocale()).waitlist;
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'waitlist-modal';
  modalOverlay.className = 'modal-overlay waitlist-modal';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-labelledby', 'waitlist-modal-title');

  modalOverlay.innerHTML = `
    <div class="modal-container waitlist-modal__container">
      <div class="modal-header waitlist-modal__header">
        <button type="button" class="modal-close-btn waitlist-modal__close-btn" id="waitlist-close-btn" aria-label="${chrome.closeLabel}" title="${chrome.closeTitle}">${resolveCloseIconMarkup()}</button>
      </div>
      <div class="modal-content waitlist-modal__content">
        <h2 class="waitlist-modal__title" id="waitlist-modal-title">${chrome.title}</h2>
        <p class="waitlist-modal__subtitle">
          ${chrome.subtitle}
        </p>

        <form class="waitlist-modal__form" id="waitlist-form">
          <label class="waitlist-modal__label" for="waitlist-email">${chrome.emailLabel}</label>
          <input
            type="email"
            id="waitlist-email"
            class="waitlist-modal__input"
            placeholder="${chrome.placeholder}"
            required
            autocomplete="email"
          >
          <p class="waitlist-modal__error" id="waitlist-error" style="display:none;"></p>
          <button type="submit" class="btn btn-primary waitlist-modal__submit-btn" id="waitlist-submit-btn" title="${chrome.submitTitle}">
            ${chrome.submit}
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  requestAnimationFrame(() => {
    modalOverlay.classList.add('open');
    modalOverlay.querySelector('#waitlist-email')?.focus();
  });

  const close = () => {
    document.removeEventListener('keydown', onKeyDown);
    modalOverlay.classList.remove('open');
    setTimeout(() => modalOverlay.remove(), 300);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') close();
  };

  document.addEventListener('keydown', onKeyDown);

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
    submitBtn.textContent = chrome.submitting;
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
            ? chrome.rateLimit
            : res.status >= 500
              ? chrome.serverError
              : (data.error || res.statusText || String(res.status));
        throw new Error(data.error || fallback);
      }

      const content = modalOverlay.querySelector('.waitlist-modal__content');
      content.innerHTML = `
        <h2 class="waitlist-modal__title" id="waitlist-modal-title">${chrome.successTitle}</h2>
        <p class="waitlist-modal__subtitle">
          ${chrome.successBody}
        </p>
        <button type="button" class="btn btn-primary waitlist-modal__submit-btn" id="waitlist-done-btn" title="${chrome.doneTitle}">${chrome.done}</button>
      `;
      modalOverlay.querySelector('#waitlist-done-btn').addEventListener('click', close);
    } catch (err) {
      errorEl.textContent = err.message || chrome.genericError;
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = chrome.submit;
    }
  });
};
