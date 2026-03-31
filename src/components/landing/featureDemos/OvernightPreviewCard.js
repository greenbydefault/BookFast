/**
 * OvernightPreviewCard – Landing-only, strukturgleich zu ServicePreviewCard bei serviceType === 'overnight'.
 * Tabs: nur „Übernachtung“ aktiv (andere deaktiviert). Kein API.
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr, escapeHtml } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const SERVICE_TABS = [
  { id: 'hourly', label: 'Stunden' },
  { id: 'daily', label: 'Tagesmiete' },
  { id: 'overnight', label: 'Übernachtung' },
];

const DEMO_OBJECTS = [
  { value: 'demo-obj-1', label: 'Villa Nord' },
  { value: 'demo-obj-2', label: 'Studio Süd' },
  { value: 'demo-obj-3', label: 'Loft Mitte' },
];

const getInitialState = () => ({
  name: '',
  description: '',
  price: 140,
  selectedObjects: ['demo-obj-1'],
  bookableDays: [...DAYS],
  checkinStart: '16:00',
  checkoutEnd: '10:30',
  minAdvance: 4,
  minNightsEnabled: false,
  minNights: 2,
  cleaningFee: 40,
  bufferBefore: 120,
  bufferAfter: 60,
});

export const createOvernightPreviewCard = () => `
  <div class="feature-demo-card" id="overnight-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Service Anlegen</h3>
        <p class="feature-demo-card__subtitle">Lege einen Service an und ordne ihn einem Objekt zu.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="overnight-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Service speichern</button>
    </div>
  </div>
`;

export const initOvernightPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#overnight-preview-body');
  if (!body) return;

  const state = getInitialState();

  const render = () => {
    body.innerHTML = `
      <div class="svc-demo-tabs" role="tablist" aria-label="Service-Typ">
        ${SERVICE_TABS.map((tab) => `
          <button
            type="button"
            class="svc-demo-tab ${tab.id === 'overnight' ? 'active' : ''}"
            role="tab"
            aria-selected="${tab.id === 'overnight' ? 'true' : 'false'}"
            ${tab.id !== 'overnight' ? 'disabled' : ''}
          >${escapeHtml(tab.label)}</button>
        `).join('')}
      </div>

      <div class="modal-content-section" data-demo-section="ov-service">
        <div class="modal-form-field">
          <input type="text" class="modal-form-input modal-input-large"
            placeholder="z. B. Ferienwohnung Bergblick oder Zimmer Garten"
            value="${escapeAttr(state.name)}" id="ov-input-name" autocomplete="off">
        </div>
        <div class="modal-form-field">
          <label class="modal-label modal-form-label" for="ov-input-desc">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
          <textarea class="modal-form-input" placeholder="Optional: Was ist enthalten, wichtige Hinweise ..."
            rows="2" id="ov-input-desc">${escapeAttr(state.description)}</textarea>
        </div>
        <div class="modal-form-field">
          <div class="modal-row">
            <div class="modal-label">${getIconString('home')} Objekt</div>
            <div class="modal-controls">
              <div class="svc-demo-tags">
                ${DEMO_OBJECTS.map(
                  (obj) => `
                  <button class="svc-demo-tag ${state.selectedObjects.includes(obj.value) ? 'active' : ''}"
                          data-obj="${escapeAttr(obj.value)}" type="button">${escapeHtml(obj.label)}</button>
                `,
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="ov-pricing-times">
        <div class="modal-row">
          <div class="modal-label">${getIconString('coins')} Preis</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.price}" id="ov-input-price" min="0" step="1">
            <span class="svc-demo-price-currency">\u20ac</span>
            <span class="svc-demo-price-unit">Nacht</span>
          </div>
        </div>
        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} CheckIn/Out</div>
          <div class="modal-controls">
            <span class="svc-demo-label-inline">Von</span>
            <input type="time" class="svc-demo-time-input" value="${escapeAttr(state.checkinStart)}" id="ov-input-time-start">
            <span class="svc-demo-label-inline">Bis</span>
            <input type="time" class="svc-demo-time-input" value="${escapeAttr(state.checkoutEnd)}" id="ov-input-time-end">
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="ov-rules-buffers">
        <div class="modal-row">
          <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
          <div class="modal-controls">
            <div class="day-toggles" id="ov-day-toggles">
              ${DAYS.map(
                (day) => `
                <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}"
                        data-day="${day}" type="button">${day}</button>
              `,
              ).join('')}
            </div>
          </div>
        </div>
        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} Mindestvorlauf</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.minAdvance}" id="ov-input-advance" min="0">
            <span class="svc-demo-price-unit">Tage</span>
          </div>
        </div>
        <div class="modal-row">
          <div class="modal-label">${getIconString('bed')} Min. Übernachtungen</div>
          <div class="modal-controls">
            <label class="toggle-switch">
              <input type="checkbox" id="ov-toggle-min-nights" ${state.minNightsEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        ${
          state.minNightsEnabled
            ? `
        <div class="modal-row" style="padding-left:20px;margin-top:-8px;">
          <div class="modal-label"></div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.minNights}" id="ov-input-min-nights" min="1">
            <span class="svc-demo-price-unit">N\u00e4chte</span>
          </div>
        </div>`
            : ''
        }
        <div class="modal-row">
          <div class="modal-label">${getIconString('sparkles')} Reinigungsgeb\u00fchr</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.cleaningFee}" id="ov-input-cleaning-fee" min="0" step="1">
            <span class="svc-demo-price-currency">\u20ac</span>
          </div>
        </div>
        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} Reinigungspuffer</div>
          <div class="modal-controls modal-controls-column">
            <div class="control-group-row">
              <span class="text-small-muted">Davor</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="ov-input-buffer-before">
              </div>
              <span class="text-small">Min.</span>
            </div>
            <div class="control-group-row">
              <span class="text-small-muted">Danach</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="ov-input-buffer-after">
              </div>
              <span class="text-small">Min.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    wireEvents();
  };

  const toggleObject = (val) => {
    if (state.selectedObjects.includes(val)) {
      if (state.selectedObjects.length <= 1) return;
      state.selectedObjects = state.selectedObjects.filter((v) => v !== val);
    } else {
      state.selectedObjects = [...state.selectedObjects, val];
    }
    render();
  };

  const toggleDay = (day) => {
    if (state.bookableDays.includes(day)) {
      state.bookableDays = state.bookableDays.filter((d) => d !== day);
    } else {
      state.bookableDays = [...state.bookableDays, day];
    }
    render();
  };

  const wireEvents = () => {
    body.querySelector('#ov-input-name')?.addEventListener('input', (e) => {
      state.name = e.target.value;
    });
    body.querySelector('#ov-input-desc')?.addEventListener('input', (e) => {
      state.description = e.target.value;
    });
    body.querySelector('#ov-input-price')?.addEventListener('input', (e) => {
      state.price = parseFloat(e.target.value) || 0;
    });
    body.querySelector('#ov-input-time-start')?.addEventListener('change', (e) => {
      state.checkinStart = e.target.value;
    });
    body.querySelector('#ov-input-time-end')?.addEventListener('change', (e) => {
      state.checkoutEnd = e.target.value;
    });
    body.querySelector('#ov-input-advance')?.addEventListener('input', (e) => {
      state.minAdvance = parseInt(e.target.value, 10) || 0;
    });
    body.querySelector('#ov-input-cleaning-fee')?.addEventListener('input', (e) => {
      state.cleaningFee = parseFloat(e.target.value) || 0;
    });
    body.querySelector('#ov-input-buffer-before')?.addEventListener('input', (e) => {
      state.bufferBefore = Math.max(0, parseInt(e.target.value, 10) || 0);
      e.target.value = String(state.bufferBefore);
    });
    body.querySelector('#ov-input-buffer-after')?.addEventListener('input', (e) => {
      state.bufferAfter = Math.max(0, parseInt(e.target.value, 10) || 0);
      e.target.value = String(state.bufferAfter);
    });
    body.querySelector('#ov-toggle-min-nights')?.addEventListener('change', (e) => {
      state.minNightsEnabled = e.target.checked;
      render();
    });
    body.querySelector('#ov-input-min-nights')?.addEventListener('input', (e) => {
      state.minNights = Math.max(1, parseInt(e.target.value, 10) || 1);
      e.target.value = String(state.minNights);
    });

    body.querySelectorAll('#ov-day-toggles .day-toggle').forEach((btn) => {
      btn.addEventListener('click', () => toggleDay(btn.dataset.day || ''));
    });

    body.querySelectorAll('.svc-demo-tag').forEach((btn) => {
      btn.addEventListener('click', () => toggleObject(btn.dataset.obj || ''));
    });
  };

  render();
};
