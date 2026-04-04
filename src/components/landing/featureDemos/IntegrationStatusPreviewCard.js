import './featureDemos.css';
import { openWaitlistModal } from '../WaitlistModal.js';
import { getIconString } from '../../Icons/Icon.js';

const INITIAL_STATE = {
  trackingEnabled: false,
  timezone: 'Europe/Berlin',
  language: 'de',
  embedOpen: false,
};
const DEFAULT_CONTENT = {
  card: {
    loading: 'Lade Integrationsmodul...',
    websiteTitle: 'Website Integration',
    websiteSubtitle: '1 von 2 Schritten abgeschlossen',
    settingsTitle: 'Einstellungen',
    settingsSubtitle: '0 von 3 Schritten abgeschlossen',
  },
  embed: {
    title: 'Embed Script',
    subtitle: 'Fügen Sie dieses Skript in den <body> Ihrer Website ein.',
    copyCode: 'Code kopieren',
    toggleLabel: 'Embed-Bereich umschalten',
    linkedDomain: 'Verknüpfte Webseite',
    linkedDomainValue: 'bookfast.de',
  },
  template: {
    title: 'Booking Flow Template (Webflow)',
    subtitle: 'Kopieren Sie das Buchungs-Widget und fügen Sie es in Webflow ein.',
    action: 'Template kopieren',
  },
  settings: {
    trackingTitle: 'Tracking aktivieren',
    trackingSubtitle: 'Cookie-loses Tracking für Analysen aktivieren.',
    trackingAria: 'Tracking aktivieren',
    trackingInfo: 'Mehr zum Tracking erfahren',
    timezoneTitle: 'Zeitzone',
    timezoneSubtitle: 'Zeiten und Buchungen werden in dieser Zeitzone angezeigt.',
    languageTitle: 'Sprache',
    languageSubtitle: 'Sprache für E-Mails und Buchungswidget.',
    timezones: [],
    languages: [],
  },
};

const renderDemo = (container, state, content) => {
  const embedExpandedClass = state.embedOpen ? ' is-open' : '';
  const embedExpandedAria = state.embedOpen ? 'true' : 'false';
  const checkedAttr = state.trackingEnabled ? 'checked' : '';

  container.innerHTML = `
    <div class="integration-settings-demo">
      <div class="integration-settings-demo__section">
        <h3 class="feature-demo-card__title integration-settings-demo__title">${content.card.websiteTitle}</h3>
        <p class="feature-demo-card__subtitle integration-settings-demo__subtitle">${content.card.websiteSubtitle}</p>

        <div class="integration-settings-demo__list">
          <article class="integration-settings-demo__item">
            <div class="integration-settings-demo__item-left">
              <span class="integration-settings-demo__check" aria-hidden="true">✓</span>
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${content.embed.title}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${content.embed.subtitle}</p>
              </div>
            </div>
            <div class="integration-settings-demo__item-actions">
              <button type="button" class="integration-settings-demo__btn integration-settings-demo__btn--primary" data-integration-open-waitlist>
                ${content.embed.copyCode}
              </button>
              <button
                type="button"
                class="integration-settings-demo__chevron-btn${embedExpandedClass}"
                aria-expanded="${embedExpandedAria}"
                data-integration-toggle-embed
                aria-label="${content.embed.toggleLabel}"
              >
                ${getIconString('arrow-down')}
              </button>
            </div>
          </article>
          ${state.embedOpen ? `
          <article class="integration-settings-demo__item integration-settings-demo__item--domain">
            <div class="integration-settings-demo__item-left integration-settings-demo__item-left--domain">
              <span class="modal-label integration-settings-demo__item-title">${content.embed.linkedDomain}</span>
            </div>
            <div class="integration-settings-demo__domain-value">
              <span>${content.embed.linkedDomainValue}</span>
              <span class="integration-settings-demo__domain-check" aria-hidden="true">✓</span>
            </div>
          </article>
          ` : ''}

          <article class="integration-settings-demo__item">
            <div class="integration-settings-demo__item-left">
              <span class="integration-settings-demo__check" aria-hidden="true">✓</span>
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${content.template.title}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${content.template.subtitle}</p>
              </div>
            </div>
            <div class="integration-settings-demo__item-actions">
              <button type="button" class="integration-settings-demo__btn integration-settings-demo__btn--primary" data-integration-open-waitlist>
                ${content.template.action}
              </button>
            </div>
          </article>
        </div>
      </div>

      <div class="integration-settings-demo__section integration-settings-demo__section--top-border">
        <h3 class="feature-demo-card__title integration-settings-demo__title">${content.card.settingsTitle}</h3>
        <p class="feature-demo-card__subtitle integration-settings-demo__subtitle">${content.card.settingsSubtitle}</p>

        <div class="integration-settings-demo__settings-list">
          <article class="integration-settings-demo__settings-item">
            <div class="integration-settings-demo__settings-left">
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${content.settings.trackingTitle}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${content.settings.trackingSubtitle}</p>
              </div>
            </div>
            <label class="integration-settings-demo__toggle" aria-label="${content.settings.trackingAria}">
              <input type="checkbox" data-integration-tracking-toggle ${checkedAttr} />
              <span class="integration-settings-demo__toggle-slider"></span>
            </label>
          </article>

          <div class="integration-settings-demo__settings-item integration-settings-demo__settings-item--link">
            <button type="button" class="integration-settings-demo__link-btn" data-integration-open-waitlist>
              ${content.settings.trackingInfo}
            </button>
          </div>

          <article class="integration-settings-demo__settings-item">
            <div class="integration-settings-demo__settings-left">
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${content.settings.timezoneTitle}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${content.settings.timezoneSubtitle}</p>
              </div>
            </div>
            <select class="integration-settings-demo__select" data-integration-timezone-select>
              ${content.settings.timezones.map((item) => `
                <option value="${item.value}" ${state.timezone === item.value ? 'selected' : ''}>${item.label}</option>
              `).join('')}
            </select>
          </article>

          <article class="integration-settings-demo__settings-item">
            <div class="integration-settings-demo__settings-left">
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${content.settings.languageTitle}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${content.settings.languageSubtitle}</p>
              </div>
            </div>
            <select class="integration-settings-demo__select" data-integration-language-select>
              ${content.settings.languages.map((item) => `
                <option value="${item.value}" ${state.language === item.value ? 'selected' : ''}>${item.label}</option>
              `).join('')}
            </select>
          </article>
        </div>
      </div>
    </div>
  `;
};

export const createIntegrationStatusPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="integration-status-preview-card">
    <div class="integration-preview-loading">${content.card.loading}</div>
  </div>
`;

export const initIntegrationStatusPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const root = heroContainer.querySelector('#integration-status-preview-card');
  if (!root) return;

  if (root.__integrationCleanup) {
    root.__integrationCleanup();
  }
  const state = { ...INITIAL_STATE };
  renderDemo(root, state, content);

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
      renderDemo(root, state, content);
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
