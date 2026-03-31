/**
 * WorkspacesPreviewCard – Landing-only mirror of „Neuer Workspace“ + Setup-Hinweis + Wechsel-UI.
 * Local demo state only (no API).
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr, escapeHtml } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DEMO_WS = [
  { id: 'ws-demo-1', label: 'Studio Mitte' },
  { id: 'ws-demo-2', label: 'Villa Nord' },
  { id: 'ws-demo-3', label: 'Pop-up Sommer' },
];

export const createWorkspacesPreviewCard = () => `
  <div class="feature-demo-card" id="workspaces-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Neuer Workspace</h3>
        <p class="feature-demo-card__subtitle">Wie im Dashboard bei „Neuen Workspace anlegen“.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="ws-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Workspace erstellen</button>
    </div>
  </div>
`;

export const initWorkspacesPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#ws-preview-body');
  if (!body) return;

  const state = {
    name: '',
    activeId: 'ws-demo-1',
  };

  const renderSwitch = () => {
    const list = body.querySelector('#ws-demo-switch-list');
    if (!list) return;
    list.innerHTML = DEMO_WS.map((w) => `
      <button
        type="button"
        class="ws-demo-switch-item ${state.activeId === w.id ? 'is-active' : ''}"
        data-ws-id="${escapeAttr(w.id)}"
      >
        ${getIconString('building-comapny', 'ws-demo-switch-item__icon')}
        <span class="ws-demo-switch-item__label">${escapeHtml(w.label)}</span>
        ${state.activeId === w.id ? `<span class="ws-demo-switch-item__badge">Aktiv</span>` : ''}
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
        <label class="modal-form-label" for="ws-demo-name-input">Workspace-Name *</label>
        <input
          type="text"
          id="ws-demo-name-input"
          class="modal-form-input modal-input-large"
          placeholder="z. B. Salon München"
          value="${escapeAttr(state.name)}"
          autocomplete="off"
        />
      </div>
      <div class="modal-info-box">
        <small class="modal-info-text">
          <strong>Hinweis:</strong> Jeder Workspace ist isoliert – eigene Objekte, Services und Einstellungen. Demo: noch <strong>22</strong> weitere möglich.
        </small>
      </div>
    </div>

    <div class="modal-content-section" data-demo-section="ws-setup">
      <p class="ws-preview-section-label">${getIconString('gear')} Pro Workspace</p>
      <ul class="ws-setup-list">
        <li class="ws-setup-item">
          ${getIconString('package', 'ws-setup-item__icon')}
          <span><strong>Objekte &amp; Services</strong> – eigenständig konfigurierbar</span>
        </li>
        <li class="ws-setup-item">
          ${getIconString('users-2', 'ws-setup-item__icon')}
          <span><strong>Team &amp; Add-ons</strong> – getrennt pro Workspace</span>
        </li>
        <li class="ws-setup-item">
          ${getIconString('list', 'ws-setup-item__icon')}
          <span><strong>Buchungen &amp; Kunden</strong> – nur in diesem Kontext</span>
        </li>
      </ul>
    </div>

    <div class="modal-content-section" data-demo-section="ws-switch">
      <p class="ws-preview-section-label">${getIconString('arrow-up-down')} Workspace wechseln</p>
      <p class="ws-switch-hint text-small-muted">Oben in der Sidebar oder im Dropdown – ein Klick, neuer Kontext.</p>
      <div class="ws-demo-switch-list" id="ws-demo-switch-list" role="group" aria-label="Demo Workspaces"></div>
    </div>
  `;

  body.querySelector('#ws-demo-name-input')?.addEventListener('input', (e) => {
    state.name = e.target.value;
  });

  renderSwitch();
};
