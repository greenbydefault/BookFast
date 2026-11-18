import './featureDemos.css';
import { openWaitlistModal } from '../WaitlistModal.js';
import { getIconString } from '../../Icons/Icon.js';

const INITIAL_STATE = {
  embedOpen: false,
  domainChecked: false,
};
const DEFAULT_CONTENT = {
  card: {
    loading: 'Lade Integrationsmodul...',
    websiteTitle: 'Website Integration',
    websiteSubtitle: 'Template in Webflow einfügen, Script einbinden, fertig.',
  },
  template: {
    title: 'Booking Flow Template (Webflow)',
    subtitle: 'Kopiere den Booking Flow und füge ihn in Webflow ein.',
    action: 'Template kopieren',
  },
  embed: {
    title: 'Embed Script',
    subtitle: 'Füge dieses Script in den <body> deiner Website ein.',
    copyCode: 'Code kopieren',
    toggleLabel: 'Embed-Bereich umschalten',
    code: "<script src='https://app.book-fast.de/embed.js' data-site-id='a1b2c3d4'></script>",
  },
  domain: {
    title: 'Verknüpfte Domain',
    value: 'studio-nordlicht.de',
    check: 'Verbindung prüfen',
    pending: 'Noch nicht geprüft',
    connected: 'Verbunden',
  },
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const renderDemo = (container, state, content) => {
  const template = { ...DEFAULT_CONTENT.template, ...content.template };
  const embed = { ...DEFAULT_CONTENT.embed, ...content.embed };
  const domain = { ...DEFAULT_CONTENT.domain, ...content.domain };
  const card = { ...DEFAULT_CONTENT.card, ...content.card };
  const embedExpandedClass = state.embedOpen ? ' is-open' : '';
  const embedExpandedAria = state.embedOpen ? 'true' : 'false';

  container.innerHTML = `
    <div class="integration-settings-demo" data-demo-body>
      <div class="integration-settings-demo__section">
        <h3 class="feature-demo-card__title integration-settings-demo__title">${card.websiteTitle}</h3>
        <p class="feature-demo-card__subtitle integration-settings-demo__subtitle">${card.websiteSubtitle}</p>

        <div class="integration-settings-demo__list">
          <article class="integration-settings-demo__item" data-demo-section="int-template">
            <div class="integration-settings-demo__item-left">
              <span class="integration-settings-demo__check" aria-hidden="true">${getIconString('check')}</span>
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${template.title}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${template.subtitle}</p>
              </div>
            </div>
            <div class="integration-settings-demo__item-actions">
              <button type="button" class="integration-settings-demo__btn integration-settings-demo__btn--primary" data-integration-open-waitlist>
                ${template.action}
              </button>
            </div>
          </article>

          <article class="integration-settings-demo__item integration-settings-demo__item--stacked" data-demo-section="int-embed">
            <div class="integration-settings-demo__item-row">
              <div class="integration-settings-demo__item-left">
                <span class="integration-settings-demo__check" aria-hidden="true">${getIconString('check')}</span>
                <div>
                  <h4 class="modal-label integration-settings-demo__item-title">${embed.title}</h4>
                  <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${escapeHtml(embed.subtitle)}</p>
                </div>
              </div>
              <div class="integration-settings-demo__item-actions">
                <button type="button" class="integration-settings-demo__btn integration-settings-demo__btn--primary" data-integration-open-waitlist>
                  ${embed.copyCode}
                </button>
                <button
                  type="button"
                  class="integration-settings-demo__chevron-btn${embedExpandedClass}"
                  aria-expanded="${embedExpandedAria}"
                  data-integration-toggle-embed
                  aria-label="${embed.toggleLabel}"
                >
                  ${getIconString('arrow-down')}
                </button>
              </div>
            </div>
            ${state.embedOpen ? `<pre class="integration-settings-demo__code"><code>${escapeHtml(embed.code)}</code></pre>` : ''}
          </article>

          <article class="integration-settings-demo__item integration-settings-demo__item--domain" data-demo-section="int-domain">
            <div class="integration-settings-demo__item-left integration-settings-demo__item-left--domain">
              <span class="integration-settings-demo__settings-icon" aria-hidden="true">${getIconString('road')}</span>
              <div>
                <h4 class="modal-label integration-settings-demo__item-title">${domain.title}</h4>
                <p class="feature-demo-card__subtitle integration-settings-demo__item-subtitle">${domain.value} · ${state.domainChecked ? domain.connected : domain.pending}</p>
              </div>
            </div>
            <div class="integration-settings-demo__item-actions">
              <button type="button" class="integration-settings-demo__btn" data-integration-check-domain>
                ${state.domainChecked ? `${getIconString('check')} ${domain.connected}` : domain.check}
              </button>
            </div>
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
      return;
    }

    const checkTarget = event.target.closest('[data-integration-check-domain]');
    if (checkTarget) {
      state.domainChecked = true;
      renderDemo(root, state, content);
    }
  };

  root.addEventListener('click', onClick);

  root.__integrationCleanup = () => {
    root.removeEventListener('click', onClick);
    delete root.__integrationCleanup;
  };
};
