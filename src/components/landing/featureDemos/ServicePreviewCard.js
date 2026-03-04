/**
 * ServicePreviewCard – Landing-only mirror of "Service anlegen" modal.
 * Tab-based UI (Stunden / Tagesmiete / Übernachtung) with local demo state.
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const SERVICE_TABS = [
  { id: 'hourly', label: 'Stunden' },
  { id: 'daily', label: 'Tagesmiete' },
  { id: 'overnight', label: 'Übernachtung' },
];

const PRICE_UNITS = { hourly: 'Stunde', daily: 'Tag', overnight: 'Nacht' };
const ADVANCE_UNITS = { hourly: 'Stunden', daily: 'Tage', overnight: 'Tage' };
const DEFAULT_PRICES = { hourly: 120, daily: 560, overnight: 140 };

const DEMO_OBJECTS = [
  { value: 'demo-obj-1', label: 'Villa Nord' },
  { value: 'demo-obj-2', label: 'Studio Süd' },
  { value: 'demo-obj-3', label: 'Loft Mitte' },
];

const getInitialState = () => ({
  serviceType: 'hourly',
  name: '',
  description: '',
  price: 120,
  selectedObjects: ['demo-obj-1'],
  bookableDays: [...DAYS],
  durationHours: 4,
  bookingWindowStart: '10:00',
  bookingWindowEnd: '16:30',
  checkinStart: '16:00',
  checkoutEnd: '10:30',
  minAdvance: 4,
  fixedStartTimesEnabled: false,
  minNightsEnabled: false,
  minNights: 2,
  cleaningFee: 40,
  bufferBefore: 120,
  bufferAfter: 60,
});

export const createServicePreviewCard = () => `
  <div class="feature-demo-card" id="service-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Service Anlegen</h3>
        <p class="feature-demo-card__subtitle">Lege einen Service an und ordne ihn einem Objekt zu.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">\u00d7</button>
    </div>
    <div class="feature-demo-card__body" id="service-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Service speichern</button>
    </div>
  </div>
`;

export const initServicePreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#service-preview-body');
  if (!body) return;

  const state = getInitialState();

  const captureValues = () => {
    const q = (sel) => body.querySelector(sel);
    const v = (sel) => q(sel)?.value ?? '';

    const name = v('#svc-input-name');
    if (name !== undefined) state.name = name;
    const desc = v('#svc-input-desc');
    if (desc !== undefined) state.description = desc;

    const price = parseFloat(v('#svc-input-price'));
    if (!isNaN(price)) state.price = price;
    const fee = parseFloat(v('#svc-input-cleaning-fee'));
    if (!isNaN(fee)) state.cleaningFee = fee;
    const adv = parseInt(v('#svc-input-advance'), 10);
    if (!isNaN(adv)) state.minAdvance = adv;
    const bb = parseInt(v('#svc-input-buffer-before'), 10);
    if (!isNaN(bb)) state.bufferBefore = bb;
    const ba = parseInt(v('#svc-input-buffer-after'), 10);
    if (!isNaN(ba)) state.bufferAfter = ba;

    const activeDays = [...body.querySelectorAll('.day-toggle.active')].map((b) => b.dataset.day);
    if (activeDays.length > 0 || body.querySelector('.day-toggle')) {
      state.bookableDays = activeDays;
    }

    if (state.serviceType === 'hourly') {
      const dur = parseInt(v('#svc-input-duration'), 10);
      if (!isNaN(dur)) state.durationHours = dur;
      const ts = v('#svc-input-time-start'); if (ts) state.bookingWindowStart = ts;
      const te = v('#svc-input-time-end'); if (te) state.bookingWindowEnd = te;
    } else if (state.serviceType === 'daily') {
      const ts = v('#svc-input-time-start'); if (ts) state.bookingWindowStart = ts;
      const te = v('#svc-input-time-end'); if (te) state.bookingWindowEnd = te;
    } else {
      const ci = v('#svc-input-time-start'); if (ci) state.checkinStart = ci;
      const co = v('#svc-input-time-end'); if (co) state.checkoutEnd = co;
    }
  };

  const switchTab = (tabId) => {
    captureValues();
    const old = state.serviceType;
    state.serviceType = tabId;
    if (state.price === DEFAULT_PRICES[old]) state.price = DEFAULT_PRICES[tabId];
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

  const toggleObject = (val) => {
    if (state.selectedObjects.includes(val)) {
      if (state.selectedObjects.length <= 1) return;
      state.selectedObjects = state.selectedObjects.filter((v) => v !== val);
    } else {
      state.selectedObjects = [...state.selectedObjects, val];
    }
    render();
  };

  const render = () => {
    const type = state.serviceType;
    const priceUnit = PRICE_UNITS[type];
    const advanceUnit = ADVANCE_UNITS[type];

    body.innerHTML = `
      <div class="svc-demo-tabs">
        ${SERVICE_TABS.map((tab) => `
          <button class="svc-demo-tab ${state.serviceType === tab.id ? 'active' : ''}"
                  data-tab="${tab.id}" type="button">${tab.label}</button>
        `).join('')}
      </div>

      <div class="modal-content-section">
        <div class="modal-form-field">
          <input type="text" class="modal-form-input modal-input-large"
                 placeholder="z. B. Massage (60 Min.) oder Hausboot (4 Std.)"
                 value="${escapeAttr(state.name)}" id="svc-input-name">
        </div>
        <div class="modal-form-field">
          <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
          <textarea class="modal-form-input" placeholder="Optional: Was ist enthalten, wichtige Hinweise ..."
                    rows="2" id="svc-input-desc">${escapeAttr(state.description)}</textarea>
        </div>
        <div class="modal-form-field">
          <div class="modal-row">
            <div class="modal-label">${getIconString('home')} Objekt</div>
            <div class="modal-controls">
              <div class="svc-demo-tags">
                ${DEMO_OBJECTS.map((obj) => `
                  <button class="svc-demo-tag ${state.selectedObjects.includes(obj.value) ? 'active' : ''}"
                          data-obj="${escapeAttr(obj.value)}" type="button">${obj.label}</button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-content-section">
        <div class="modal-row">
          <div class="modal-label">${getIconString('coins')} Preis</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.price}" id="svc-input-price" step="1">
            <span class="svc-demo-price-currency">\u20ac</span>
            <span class="svc-demo-price-unit">${priceUnit}</span>
          </div>
        </div>

        ${type === 'hourly' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('clock')} Dauer</div>
            <div class="modal-controls svc-demo-price-controls">
              <input type="number" class="svc-demo-price-input" value="${state.durationHours}" id="svc-input-duration" min="1">
              <span class="svc-demo-price-unit">Stunden</span>
            </div>
          </div>
        ` : ''}

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} ${type === 'overnight' ? 'CheckIn/Out' : 'Buchungszeitfenster'}</div>
          <div class="modal-controls">
            <span class="svc-demo-label-inline">Von</span>
            <input type="time" class="svc-demo-time-input" value="${type === 'overnight' ? state.checkinStart : state.bookingWindowStart}" id="svc-input-time-start">
            <span class="svc-demo-label-inline">Bis</span>
            <input type="time" class="svc-demo-time-input" value="${type === 'overnight' ? state.checkoutEnd : state.bookingWindowEnd}" id="svc-input-time-end">
          </div>
        </div>
      </div>

      <div class="modal-content-section">
        <div class="modal-row">
          <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
          <div class="modal-controls">
            <div class="day-toggles" id="svc-day-toggles">
              ${DAYS.map((day) => `
                <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}"
                        data-day="${day}" type="button">${day}</button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} Mindestvorlauf</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.minAdvance}" id="svc-input-advance" min="0">
            <span class="svc-demo-price-unit">${advanceUnit}</span>
          </div>
        </div>

        ${type === 'hourly' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('clock')} Feste Startzeiten</div>
            <div class="modal-controls">
              <label class="toggle-switch">
                <input type="checkbox" id="svc-toggle-fixed" ${state.fixedStartTimesEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        ` : ''}

        ${type === 'overnight' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('bed')} Min. Übernachtungen</div>
            <div class="modal-controls">
              <label class="toggle-switch">
                <input type="checkbox" id="svc-toggle-min-nights" ${state.minNightsEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          ${state.minNightsEnabled ? `
            <div class="modal-row" style="padding-left:20px;margin-top:-8px;">
              <div class="modal-label"></div>
              <div class="modal-controls svc-demo-price-controls">
                <input type="number" class="svc-demo-price-input" value="${state.minNights}" id="svc-input-min-nights" min="1">
                <span class="svc-demo-price-unit">N\u00e4chte</span>
              </div>
            </div>
          ` : ''}
        ` : ''}
      </div>

      <div class="modal-content-section">
        <div class="modal-row">
          <div class="modal-label">${getIconString('sparkles')} Reinigungsgeb\u00fchr</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.cleaningFee}" id="svc-input-cleaning-fee" step="1">
            <span class="svc-demo-price-currency">\u20ac</span>
          </div>
        </div>

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} Reinigungspuffer</div>
          <div class="modal-controls modal-controls-column">
            <div class="control-group-row">
              <span class="text-small-muted">Davor</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="svc-input-buffer-before">
              </div>
              <span class="text-small">Min.</span>
            </div>
            <div class="control-group-row">
              <span class="text-small-muted">Danach</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="svc-input-buffer-after">
              </div>
              <span class="text-small">Min.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // --- Event listeners ---

    body.querySelectorAll('.svc-demo-tab').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    body.querySelector('#svc-input-name')?.addEventListener('input', (e) => { state.name = e.target.value; });
    body.querySelector('#svc-input-desc')?.addEventListener('input', (e) => { state.description = e.target.value; });
    body.querySelector('#svc-input-price')?.addEventListener('input', (e) => { state.price = parseFloat(e.target.value) || 0; });
    body.querySelector('#svc-input-duration')?.addEventListener('input', (e) => { state.durationHours = parseInt(e.target.value, 10) || 1; });
    body.querySelector('#svc-input-advance')?.addEventListener('input', (e) => { state.minAdvance = parseInt(e.target.value, 10) || 0; });
    body.querySelector('#svc-input-cleaning-fee')?.addEventListener('input', (e) => { state.cleaningFee = parseFloat(e.target.value) || 0; });

    body.querySelector('#svc-input-buffer-before')?.addEventListener('input', (e) => {
      state.bufferBefore = Math.max(0, parseInt(e.target.value, 10) || 0);
      e.target.value = state.bufferBefore;
    });
    body.querySelector('#svc-input-buffer-after')?.addEventListener('input', (e) => {
      state.bufferAfter = Math.max(0, parseInt(e.target.value, 10) || 0);
      e.target.value = state.bufferAfter;
    });

    body.querySelector('#svc-input-time-start')?.addEventListener('change', (e) => {
      if (state.serviceType === 'overnight') state.checkinStart = e.target.value;
      else state.bookingWindowStart = e.target.value;
    });
    body.querySelector('#svc-input-time-end')?.addEventListener('change', (e) => {
      if (state.serviceType === 'overnight') state.checkoutEnd = e.target.value;
      else state.bookingWindowEnd = e.target.value;
    });

    body.querySelectorAll('#svc-day-toggles .day-toggle').forEach((btn) => {
      btn.addEventListener('click', () => toggleDay(btn.dataset.day));
    });

    body.querySelectorAll('.svc-demo-tag').forEach((btn) => {
      btn.addEventListener('click', () => toggleObject(btn.dataset.obj));
    });

    body.querySelector('#svc-toggle-fixed')?.addEventListener('change', (e) => {
      state.fixedStartTimesEnabled = e.target.checked;
    });

    body.querySelector('#svc-toggle-min-nights')?.addEventListener('change', (e) => {
      state.minNightsEnabled = e.target.checked;
      render();
    });

    body.querySelector('#svc-input-min-nights')?.addEventListener('input', (e) => {
      state.minNights = parseInt(e.target.value, 10) || 1;
    });
  };

  render();
};
