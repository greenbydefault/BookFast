/**
 * UrlaubPreviewCard – Landing-only Spiegel von „Urlaub anlegen“ (CreateVacationModal).
 * Nur lokaler Demo-State, keine API-Calls.
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr, escapeHtml } from '../../../lib/sanitize.js';
import './featureDemos.css';

const SCOPE_OPTIONS = [
  { value: 'workspace', label: 'Ganzes Workspace' },
  { value: 'object', label: 'Objekt' },
  { value: 'staff', label: 'Mitarbeiter' },
  { value: 'service', label: 'Service' },
];

const DEMO_OBJECTS = [
  { id: 'demo-obj-1', name: 'Ferienwohnung Alpenblick' },
  { id: 'demo-obj-2', name: 'Studio Mitte' },
];

const DEMO_STAFF = [
  { id: 'demo-staff-1', name: 'Maria K.' },
  { id: 'demo-staff-2', name: 'Jonas W.' },
];

const DEMO_SERVICES = [
  { id: 'demo-svc-1', name: 'Haarschnitt' },
  { id: 'demo-svc-2', name: 'Yoga 60 Min' },
];

const getInitialState = () => ({
  scope: 'workspace',
  objectId: '',
  staffId: '',
  serviceId: '',
  startDate: '',
  endDate: '',
  description: '',
});

export const createUrlaubPreviewCard = () => `
  <div class="feature-demo-card" id="urlaub-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Urlaub anlegen</h3>
        <p class="feature-demo-card__subtitle">Definiere einen Zeitraum – für das ganze Workspace, ein Objekt, einen Mitarbeiter oder einen Service.</p>
      </div>
    </div>
    <div class="feature-demo-card__body" id="urlaub-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Speichern</button>
    </div>
  </div>
`;

export const initUrlaubPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#urlaub-preview-body');
  if (!body) return;

  const state = getInitialState();

  const renderScopeInner = () => {
    const wrap = body.querySelector('#vu-demo-scope-inner');
    if (!wrap) return;

    wrap.innerHTML = `
      <div class="modal-form-field">
        <label class="modal-form-label" for="vu-demo-select-scope">Gültig für</label>
        <select class="modal-form-input" id="vu-demo-select-scope">
          ${SCOPE_OPTIONS.map(
            (o) =>
              `<option value="${escapeAttr(o.value)}" ${state.scope === o.value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`,
          ).join('')}
        </select>
      </div>
      ${
        state.scope === 'object'
          ? `
      <div class="modal-form-field">
        <label class="modal-form-label" for="vu-demo-select-object">Objekt</label>
        <select class="modal-form-input" id="vu-demo-select-object">
          <option value="">— Objekt wählen —</option>
          ${DEMO_OBJECTS.map(
            (o) =>
              `<option value="${escapeAttr(o.id)}" ${state.objectId === o.id ? 'selected' : ''}>${escapeHtml(o.name)}</option>`,
          ).join('')}
        </select>
      </div>`
          : ''
      }
      ${
        state.scope === 'staff'
          ? `
      <div class="modal-form-field">
        <label class="modal-form-label" for="vu-demo-select-staff">Mitarbeiter</label>
        <select class="modal-form-input" id="vu-demo-select-staff">
          <option value="">— Mitarbeiter wählen —</option>
          ${DEMO_STAFF.map(
            (s) =>
              `<option value="${escapeAttr(s.id)}" ${state.staffId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`,
          ).join('')}
        </select>
      </div>`
          : ''
      }
      ${
        state.scope === 'service'
          ? `
      <div class="modal-form-field">
        <label class="modal-form-label" for="vu-demo-select-service">Service</label>
        <select class="modal-form-input" id="vu-demo-select-service">
          <option value="">— Service wählen —</option>
          ${DEMO_SERVICES.map(
            (s) =>
              `<option value="${escapeAttr(s.id)}" ${state.serviceId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`,
          ).join('')}
        </select>
      </div>`
          : ''
      }
    `;

    const scopeSelect = wrap.querySelector('#vu-demo-select-scope');
    if (scopeSelect) {
      scopeSelect.addEventListener('change', (e) => {
        state.scope = e.target.value;
        state.objectId = '';
        state.staffId = '';
        state.serviceId = '';
        renderScopeInner();
      });
    }
    wrap.querySelector('#vu-demo-select-object')?.addEventListener('change', (e) => {
      state.objectId = e.target.value || '';
    });
    wrap.querySelector('#vu-demo-select-staff')?.addEventListener('change', (e) => {
      state.staffId = e.target.value || '';
    });
    wrap.querySelector('#vu-demo-select-service')?.addEventListener('change', (e) => {
      state.serviceId = e.target.value || '';
    });
  };

  body.innerHTML = `
    <div class="modal-content-section" data-demo-section="vu-scope">
      <p class="vu-preview-section-label">${getIconString('funnel')} Scope wählen</p>
      <div id="vu-demo-scope-inner"></div>
    </div>

    <div class="modal-content-section" data-demo-section="vu-period">
      <div class="modal-row">
        <div class="modal-label">${getIconString('calender-days-date')} Zeitraum</div>
        <div class="modal-controls vu-demo-period-controls">
          <span class="label-inline">Von</span>
          <input type="date" class="modal-form-input" id="vu-demo-start-date" value="${escapeAttr(state.startDate)}">
          <span class="label-inline">Bis</span>
          <input type="date" class="modal-form-input" id="vu-demo-end-date" value="${escapeAttr(state.endDate)}">
        </div>
      </div>
      <div class="modal-row vu-demo-desc-row">
        <div class="modal-label">Beschreibung <span class="modal-label-optional">(Optional)</span></div>
        <div class="modal-controls">
          <input type="text" class="modal-form-input" placeholder="z. B. Betriebsferien" id="vu-demo-description" value="${escapeAttr(state.description)}">
        </div>
      </div>
    </div>

    <div class="modal-content-section" data-demo-section="vu-lock">
      <p class="vu-preview-section-label">${getIconString('lock')} Keine Buchungen in Sperrzeiten</p>
      <ul class="vu-benefits-list">
        <li class="vu-benefits-item">
          ${getIconString('check', 'vu-benefits-item__icon')}
          <span>Verfügbarkeitsprüfung inkl. Urlaub – automatisch berücksichtigt</span>
        </li>
        <li class="vu-benefits-item">
          ${getIconString('check', 'vu-benefits-item__icon')}
          <span>Kein manueller Kalender-Aufwand</span>
        </li>
        <li class="vu-benefits-item">
          ${getIconString('check', 'vu-benefits-item__icon')}
          <span>Klarheit für dich und deine Kunden</span>
        </li>
      </ul>
    </div>
  `;

  renderScopeInner();

  body.querySelector('#vu-demo-start-date')?.addEventListener('change', (e) => {
    state.startDate = e.target.value;
  });
  body.querySelector('#vu-demo-end-date')?.addEventListener('change', (e) => {
    state.endDate = e.target.value;
  });
  body.querySelector('#vu-demo-description')?.addEventListener('input', (e) => {
    state.description = e.target.value;
  });
};
