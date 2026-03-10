import './featureDemos.css';
import { openWaitlistModal } from '../WaitlistModal.js';
import { getIconString } from '../../Icons/Icon.js';

const INITIAL_STATE = {
  trackingEnabled: false,
  timezone: 'Europe/Berlin',
  language: 'de',
  embedOpen: false,
};
const TEST_LINKED_DOMAIN = 'bookfast.de';

const renderDemo = (container, state) => {
  const embedExpandedClass = state.embedOpen ? ' is-open' : '';
  const embedExpandedAria = state.embedOpen ? 'true' : 'false';
  const checkedAttr = state.trackingEnabled ? 'checked' : '';

  container.innerHTML = `
    <div class="integration-settings-demo">
      <div class="integration-settings-demo__section">
        <h3 class="feature-demo-card__title integration-settings-demo__title">Website Integration</h3>
        <p class="feature-demo-card__subtitle integration-settings-demo__subtitle">1 von 2 Schritten abgeschlossen</p>

        <div class="integration-settings-demo__list">
          <article class="integration-settings-demo__item">
            <div class="integration-settings-demo__item-left">
              <span class="integration-settings-demo__check" aria-hidden="true">✓</span>
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">Embed Script</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">Fuegen Sie dieses Skript in den &lt;body&gt; Ihrer Website ein.</p>
              </div>
            </div>
            <div class="integration-settings-demo__item-actions">
              <button type="button" class="integration-settings-demo__btn integration-settings-demo__btn--primary" data-integration-open-waitlist>
                Code kopieren
              </button>
              <button
                type="button"
                class="integration-settings-demo__chevron-btn${embedExpandedClass}"
                aria-expanded="${embedExpandedAria}"
                data-integration-toggle-embed
                aria-label="Embed-Bereich umschalten"
              >
                ${getIconString('arrow-down')}
              </button>
            </div>
          </article>
          ${state.embedOpen ? `
          <article class="integration-settings-demo__item integration-settings-demo__item--domain">
            <div class="integration-settings-demo__item-left integration-settings-demo__item-left--domain">
              <span class="modal-label integration-settings-demo__item-title">Verknüpfte Webseite</span>
            </div>
            <div class="integration-settings-demo__domain-value">
              <span>${TEST_LINKED_DOMAIN}</span>
              <span class="integration-settings-demo__domain-check" aria-hidden="true">✓</span>
            </div>
          </article>
          ` : ''}

          <article class="integration-settings-demo__item">
            <div class="integration-settings-demo__item-left">
              <span class="integration-settings-demo__check" aria-hidden="true">✓</span>
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">Booking Flow Template (Webflow)</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">Kopieren Sie das Buchungs-Widget und fuegen Sie es in Webflow ein.</p>
              </div>
            </div>
            <div class="integration-settings-demo__item-actions">
              <button type="button" class="integration-settings-demo__btn integration-settings-demo__btn--primary" data-integration-open-waitlist>
                Template kopieren
              </button>
            </div>
          </article>
        </div>
      </div>

      <div class="integration-settings-demo__section integration-settings-demo__section--top-border">
        <h3 class="feature-demo-card__title integration-settings-demo__title">Einstellungen</h3>
        <p class="feature-demo-card__subtitle integration-settings-demo__subtitle">0 von 3 Schritten abgeschlossen</p>

        <div class="integration-settings-demo__settings-list">
          <article class="integration-settings-demo__settings-item">
            <div class="integration-settings-demo__settings-left">
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">Tracking aktivieren</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">Cookie-loses Tracking fuer Analysen aktivieren.</p>
              </div>
            </div>
            <label class="integration-settings-demo__toggle" aria-label="Tracking aktivieren">
              <input type="checkbox" data-integration-tracking-toggle ${checkedAttr} />
              <span class="integration-settings-demo__toggle-slider"></span>
            </label>
          </article>

          <div class="integration-settings-demo__settings-item integration-settings-demo__settings-item--link">
            <button type="button" class="integration-settings-demo__link-btn" data-integration-open-waitlist>
              Mehr zum Tracking erfahren
            </button>
          </div>

          <article class="integration-settings-demo__settings-item">
            <div class="integration-settings-demo__settings-left">
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">Zeitzone</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">Zeiten und Buchungen werden in dieser Zeitzone angezeigt.</p>
              </div>
            </div>
            <select class="integration-settings-demo__select" data-integration-timezone-select>
              <option value="Europe/Berlin" ${state.timezone === 'Europe/Berlin' ? 'selected' : ''}>Deutschland (GMT+1)</option>
              <option value="Europe/Vienna" ${state.timezone === 'Europe/Vienna' ? 'selected' : ''}>Oesterreich (GMT+1)</option>
              <option value="Europe/Zurich" ${state.timezone === 'Europe/Zurich' ? 'selected' : ''}>Schweiz (GMT+1)</option>
            </select>
          </article>

          <article class="integration-settings-demo__settings-item">
            <div class="integration-settings-demo__settings-left">
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">Sprache</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">Sprache fuer E-Mails und Buchungswidget.</p>
              </div>
            </div>
            <select class="integration-settings-demo__select" data-integration-language-select>
              <option value="de" ${state.language === 'de' ? 'selected' : ''}>Deutsch</option>
              <option value="en" ${state.language === 'en' ? 'selected' : ''}>Englisch</option>
            </select>
          </article>
        </div>
      </div>
    </div>
  `;
};

export const createIntegrationStatusPreviewCard = () => `
  <div class="feature-demo-card" id="integration-status-preview-card">
    <div class="integration-preview-loading">Lade Integrationsmodul...</div>
  </div>
`;

export const initIntegrationStatusPreviewCard = (heroContainer) => {
  const root = heroContainer.querySelector('#integration-status-preview-card');
  if (!root) return;

  if (root.__integrationCleanup) {
    root.__integrationCleanup();
  }
  const state = { ...INITIAL_STATE };
  renderDemo(root, state);

  const onClick = (event) => {
    const waitlistTarget = event.target.closest('[data-integration-open-waitlist]');
    if (waitlistTarget) {
      event.preventDefault();
      openWaitlistModal();
      return;
    }

    const toggleTarget = event.target.closest('[data-integration-toggle-embed]');
    if (toggleTarget) {
      state.embedOpen = !state.embedOpen;
      renderDemo(root, state);
    }
  };

  const onChange = (event) => {
    const trackingInput = event.target.closest('[data-integration-tracking-toggle]');
    if (trackingInput) {
      state.trackingEnabled = Boolean(trackingInput.checked);
      return;
    }

    const timezoneSelect = event.target.closest('[data-integration-timezone-select]');
    if (timezoneSelect) {
      state.timezone = timezoneSelect.value;
      return;
    }

    const languageSelect = event.target.closest('[data-integration-language-select]');
    if (languageSelect) {
      state.language = languageSelect.value;
    }
  };

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);

  root.__integrationCleanup = () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('change', onChange);
    delete root.__integrationCleanup;
  };
};
