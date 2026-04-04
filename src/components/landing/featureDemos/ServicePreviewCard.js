/**
 * ServicePreviewCard – Landing-only mirror of "Service anlegen" modal.
 * Tab-based UI (Stunden / Tagesmiete / Übernachtung) with local demo state.
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Service anlegen',
    subtitle: 'Lege einen Service an und ordne ihn einem Objekt zu.',
    footerSecondary: 'Abbrechen',
    footerPrimary: 'Service speichern',
  },
  days: [
    { id: 'Mo', label: 'Mo' },
    { id: 'Di', label: 'Di' },
    { id: 'Mi', label: 'Mi' },
    { id: 'Do', label: 'Do' },
    { id: 'Fr', label: 'Fr' },
    { id: 'Sa', label: 'Sa' },
    { id: 'So', label: 'So' },
  ],
  tabs: [
    { id: 'hourly', label: 'Stunden' },
    { id: 'daily', label: 'Tagesmiete' },
    { id: 'overnight', label: 'Übernachtung' },
  ],
  priceUnits: { hourly: 'Stunde', daily: 'Tag', overnight: 'Nacht' },
  advanceUnits: { hourly: 'Stunden', daily: 'Tage', overnight: 'Tage' },
  defaultPrices: { hourly: 120, daily: 560, overnight: 140 },
  objects: [
    { value: 'demo-obj-1', label: 'Villa Nord' },
    { value: 'demo-obj-2', label: 'Studio Süd' },
    { value: 'demo-obj-3', label: 'Loft Mitte' },
  ],
  placeholders: {
    name: 'z. B. Massage (60 Min.) oder Hausboot (4 Std.)',
    description: 'Optional: Was ist enthalten, wichtige Hinweise ...',
  },
  labels: {
    description: 'Beschreibung',
    optional: '(Optional)',
    object: 'Objekt',
    price: 'Preis',
    duration: 'Dauer',
    bookingWindow: 'Buchungszeitfenster',
    checkinCheckout: 'Check-in/Out',
    from: 'Von',
    to: 'Bis',
    bookableDays: 'Buchbare Tage',
    minAdvance: 'Mindestvorlauf',
    fixedStartTimes: 'Feste Startzeiten',
    minNights: 'Min. Übernachtungen',
    nights: 'Nächte',
    cleaningFee: 'Reinigungsgebühr',
    cleaningBuffer: 'Reinigungspuffer',
    before: 'Davor',
    after: 'Danach',
    minutesShort: 'Min.',
    euro: '€',
    hours: 'Stunden',
  },
};

const getInitialState = () => ({
  serviceType: 'hourly',
  name: '',
  description: '',
  price: 120,
  selectedObjects: ['demo-obj-1'],
  bookableDays: DEFAULT_CONTENT.days.map((day) => day.id),
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

export const createServicePreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="service-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
    </div>
    <div class="feature-demo-card__body" id="service-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initServicePreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
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
      if (state.price === content.defaultPrices[old]) state.price = content.defaultPrices[tabId];
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
    const priceUnit = content.priceUnits[type];
    const advanceUnit = content.advanceUnits[type];

    body.innerHTML = `
      <div class="svc-demo-tabs">
        ${(content.tabs || []).map((tab) => `
          <button class="svc-demo-tab ${state.serviceType === tab.id ? 'active' : ''}"
                  data-tab="${tab.id}" type="button">${tab.label}</button>
        `).join('')}
      </div>

      <div class="modal-content-section">
        <div class="modal-form-field">
          <input type="text" class="modal-form-input modal-input-large"
                 placeholder="${escapeAttr(content.placeholders.name)}"
                 value="${escapeAttr(state.name)}" id="svc-input-name">
        </div>
        <div class="modal-form-field">
          <label class="modal-label modal-form-label">${content.labels.description} <span class="modal-label-optional">${content.labels.optional}</span></label>
          <textarea class="modal-form-input" placeholder="${escapeAttr(content.placeholders.description)}"
                    rows="2" id="svc-input-desc">${escapeAttr(state.description)}</textarea>
        </div>
        <div class="modal-form-field">
          <div class="modal-row">
            <div class="modal-label">${getIconString('home')} ${content.labels.object}</div>
            <div class="modal-controls">
              <div class="svc-demo-tags">
                ${(content.objects || []).map((obj) => `
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
          <div class="modal-label">${getIconString('coins')} ${content.labels.price}</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.price}" id="svc-input-price" step="1">
            <span class="svc-demo-price-currency">${content.labels.euro}</span>
            <span class="svc-demo-price-unit">${priceUnit}</span>
          </div>
        </div>

        ${type === 'hourly' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('clock')} ${content.labels.duration}</div>
            <div class="modal-controls svc-demo-price-controls">
              <input type="number" class="svc-demo-price-input" value="${state.durationHours}" id="svc-input-duration" min="1">
              <span class="svc-demo-price-unit">${content.labels.hours}</span>
            </div>
          </div>
        ` : ''}

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} ${type === 'overnight' ? content.labels.checkinCheckout : content.labels.bookingWindow}</div>
          <div class="modal-controls">
            <span class="svc-demo-label-inline">${content.labels.from}</span>
            <input type="time" class="svc-demo-time-input" value="${type === 'overnight' ? state.checkinStart : state.bookingWindowStart}" id="svc-input-time-start">
            <span class="svc-demo-label-inline">${content.labels.to}</span>
            <input type="time" class="svc-demo-time-input" value="${type === 'overnight' ? state.checkoutEnd : state.bookingWindowEnd}" id="svc-input-time-end">
          </div>
        </div>
      </div>

      <div class="modal-content-section">
        <div class="modal-row">
          <div class="modal-label">${getIconString('calender-days-date')} ${content.labels.bookableDays}</div>
          <div class="modal-controls">
            <div class="day-toggles" id="svc-day-toggles">
              ${content.days.map((day) => `
                <button class="day-toggle ${state.bookableDays.includes(day.id) ? 'active' : ''}"
                        data-day="${day.id}" type="button">${day.label}</button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} ${content.labels.minAdvance}</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.minAdvance}" id="svc-input-advance" min="0">
            <span class="svc-demo-price-unit">${advanceUnit}</span>
          </div>
        </div>

        ${type === 'hourly' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('clock')} ${content.labels.fixedStartTimes}</div>
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
            <div class="modal-label">${getIconString('bed')} ${content.labels.minNights}</div>
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
                <span class="svc-demo-price-unit">${content.labels.nights}</span>
              </div>
            </div>
          ` : ''}
        ` : ''}
      </div>

      <div class="modal-content-section">
        <div class="modal-row">
          <div class="modal-label">${getIconString('sparkles')} ${content.labels.cleaningFee}</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.cleaningFee}" id="svc-input-cleaning-fee" step="1">
            <span class="svc-demo-price-currency">${content.labels.euro}</span>
          </div>
        </div>

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} ${content.labels.cleaningBuffer}</div>
          <div class="modal-controls modal-controls-column">
            <div class="control-group-row">
              <span class="text-small-muted">${content.labels.before}</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="svc-input-buffer-before">
              </div>
              <span class="text-small">${content.labels.minutesShort}</span>
            </div>
            <div class="control-group-row">
              <span class="text-small-muted">${content.labels.after}</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="svc-input-buffer-after">
              </div>
              <span class="text-small">${content.labels.minutesShort}</span>
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
