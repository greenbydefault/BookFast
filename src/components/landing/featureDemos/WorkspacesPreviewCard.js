/**
 * WorkspacesPreviewCard – Landing-only mirror of „Neuer Workspace“ + Setup-Hinweis + Wechsel-UI.
 * Local demo state only (no API).
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr, escapeHtml } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Neuer Workspace',
    subtitle: 'Wie im Dashboard bei „Neuen Workspace anlegen“.',
    footerSecondary: 'Abbrechen',
    footerPrimary: 'Workspace erstellen',
  },
  workspaces: [],
  labels: {
    active: 'Aktiv',
    workspaceName: 'Workspace-Name *',
    placeholder: 'z. B. Salon München',
    hintTitle: 'Hinweis:',
    hintBody: 'Jeder Workspace ist isoliert – eigene Objekte, Services und Einstellungen. Demo: noch',
    hintRemaining: '22',
    hintSuffix: 'weitere möglich.',
    perWorkspace: 'Pro Workspace',
    objectsServices: 'Objekte & Services',
    objectsServicesDescription: 'eigenständig konfigurierbar',
    teamAddons: 'Team & Add-ons',
    teamAddonsDescription: 'getrennt pro Workspace',
    bookingsCustomers: 'Buchungen & Kunden',
    bookingsCustomersDescription: 'nur in diesem Kontext',
    switchTitle: 'Workspace wechseln',
    switchHint: 'Oben in der Sidebar oder im Dropdown – ein Klick, neuer Kontext.',
    switchAria: 'Demo Workspaces',
  },
};

export const createWorkspacesPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="workspaces-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
    </div>
    <div class="feature-demo-card__body" id="ws-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initWorkspacesPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#ws-preview-body');
  if (!body) return;

  const state = {
    name: '',
    activeId: 'ws-demo-1',
  };

  const renderSwitch = () => {
    const list = body.querySelector('#ws-demo-switch-list');
    if (!list) return;
    list.innerHTML = (content.workspaces || []).map((w) => `
      <button
        type="button"
        class="ws-demo-switch-item ${state.activeId === w.id ? 'is-active' : ''}"
        data-ws-id="${escapeAttr(w.id)}"
      >
        ${getIconString('building-comapny', 'ws-demo-switch-item__icon')}
        <span class="ws-demo-switch-item__label">${escapeHtml(w.label)}</span>
        ${state.activeId === w.id ? `<span class="ws-demo-switch-item__badge">${content.labels.active}</span>` : ''}
      </button>
    `).join('');

    list.querySelectorAll('.ws-demo-switch-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeId = btn.dataset.wsId || state.activeId;
        renderSwitch();
      });
    });
  };

  body.innerHTML = `
    <div class="modal-content-section" data-demo-section="ws-create">
      <div class="modal-form-field">
        <label class="modal-form-label" for="ws-demo-name-input">${content.labels.workspaceName}</label>
        <input
          type="text"
          id="ws-demo-name-input"
          class="modal-form-input modal-input-large"
          placeholder="${escapeAttr(content.labels.placeholder)}"
          value="${escapeAttr(state.name)}"
          autocomplete="off"
        />
      </div>
      <div class="modal-info-box">
        <small class="modal-info-text">
          <strong>${content.labels.hintTitle}</strong> ${content.labels.hintBody} <strong>${content.labels.hintRemaining}</strong> ${content.labels.hintSuffix}
        </small>
      </div>
    </div>

    <div class="modal-content-section" data-demo-section="ws-setup">
      <p class="ws-preview-section-label">${getIconString('gear')} ${content.labels.perWorkspace}</p>
      <ul class="ws-setup-list">
        <li class="ws-setup-item">
          ${getIconString('package', 'ws-setup-item__icon')}
          <span><strong>${content.labels.objectsServices}</strong> – ${content.labels.objectsServicesDescription}</span>
        </li>
        <li class="ws-setup-item">
          ${getIconString('users-2', 'ws-setup-item__icon')}
          <span><strong>${content.labels.teamAddons}</strong> – ${content.labels.teamAddonsDescription}</span>
        </li>
        <li class="ws-setup-item">
          ${getIconString('list', 'ws-setup-item__icon')}
          <span><strong>${content.labels.bookingsCustomers}</strong> – ${content.labels.bookingsCustomersDescription}</span>
        </li>
      </ul>
    </div>

    <div class="modal-content-section" data-demo-section="ws-switch">
      <p class="ws-preview-section-label">${getIconString('arrow-up-down')} ${content.labels.switchTitle}</p>
      <p class="ws-switch-hint text-small-muted">${content.labels.switchHint}</p>
      <div class="ws-demo-switch-list" id="ws-demo-switch-list" role="group" aria-label="${content.labels.switchAria}"></div>
    </div>
  `;

  body.querySelector('#ws-demo-name-input')?.addEventListener('input', (e) => {
    state.name = e.target.value;
  });

  renderSwitch();
};
