/**
 * ServicePreviewCard – Landing-only mirror of "Service anlegen" modal
 * (src/pages/dashboard/modals/CreateServiceModal.js) plus the add-on link
 * from the service detail page. Local demo state only.
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
  priceTypes: { perPerson: 'pro Person', total: 'gesamt' },
  advanceUnits: { hourly: 'Stunden', daily: 'Tage', overnight: 'Tage' },
  defaultPrices: { hourly: 120, daily: 560, overnight: 140 },
  objects: [
    { value: 'demo-obj-1', label: 'Villa Nord' },
    { value: 'demo-obj-2', label: 'Studio Süd' },
    { value: 'demo-obj-3', label: 'Loft Mitte' },
  ],
  staff: [
    { value: 'demo-staff-1', label: 'Jennifer P.' },
    { value: 'demo-staff-2', label: 'Max K.' },
  ],
  addons: [
    { value: 'demo-addon-1', label: 'Beamer' },
    { value: 'demo-addon-2', label: 'Frühstück' },
    { value: 'demo-addon-3', label: 'Yogamatte' },
  ],
  placeholders: {
    name: 'z. B. Massage (60 Min.) oder Hausboot (4 Std.)',
    description: 'Optional: Was ist enthalten, wichtige Hinweise ...',
  },
  labels: {
    description: 'Beschreibung',
    optional: '(Optional)',
    object: 'Objekt',
    staff: 'Mitarbeiter',
    addons: 'Add-ons',
    price: 'Preis',
    duration: 'Dauer',
    bookingWindow: 'Buchungszeitfenster',
    checkinCheckout: 'Check-in/Out',
    from: 'Von',
    to: 'Bis',
    customHours: 'Individuelle Zeiten pro Tag',
    capacityBased: 'Kapazitätsbasiert buchbar',
    bookableDays: 'Buchbare Tage',
    minAdvance: 'Mindestvorlauf',
    fixedStartTimes: 'Feste Startzeiten',
    minNights: 'Min. Übernachtungen',
    nights: 'Nächte',
    cleaningFee: 'Reinigungsgebühr',
    cleaningBuffer: 'Reinigungspuffer',
    before: 'Davor',
    after: 'Danach',
    minutes: 'Minuten',
    euro: '€',
    hours: 'Stunden',
    addTimeWindow: '+ Zeitfenster hinzufügen',
  },
};

const getInitialState = () => ({
  serviceType: 'hourly',
  name: '',
  description: '',
  price: 120,
  priceType: 'per_unit',
  selectedObjects: ['demo-obj-1'],
  selectedStaff: [],
  selectedAddons: ['demo-addon-1'],
  bookableDays: DEFAULT_CONTENT.days.map((day) => day.id),
  durationHours: 4,
  bookingWindowStart: '10:00',
  bookingWindowEnd: '16:30',
  checkinStart: '16:00',
  checkoutEnd: '10:30',
  minAdvance: 4,
  fixedStartTimesEnabled: false,
  customHoursEnabled: false,
  capacityBasedBooking: false,
  minNightsEnabled: false,
  minNights: 2,
  cleaningFee: 40,
  bufferBefore: 120,
  bufferAfter: 60,
});

const renderTags = (items, selected, dataAttr) => (items || []).map((item) => `
  <button class="svc-demo-tag ${selected.includes(item.value) ? 'active' : ''}"
          ${dataAttr}="${escapeAttr(item.value)}" type="button">${item.label}</button>
`).join('');

const renderToggle = (id, checked) => `
  <label class="toggle-switch">
    <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
    <span class="toggle-slider"></span>
  </label>
`;

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

  const labels = { ...DEFAULT_CONTENT.labels, ...(content.labels || {}) };
  const priceTypes = { ...DEFAULT_CONTENT.priceTypes, ...(content.priceTypes || {}) };
  const staffOptions = content.staff || DEFAULT_CONTENT.staff;
  const addonOptions = content.addons || DEFAULT_CONTENT.addons;
  const state = getInitialState();
  let customHoursRows = [];
  let customHoursCounter = 0;

  const switchTab = (tabId) => {
    const old = state.serviceType;
    state.serviceType = tabId;
    if (state.price === content.defaultPrices[old]) state.price = content.defaultPrices[tabId];
    if (tabId === 'overnight') {
      state.customHoursEnabled = false;
      customHoursRows = [];
    }
    render();
  };

  const toggleInList = (key, value, { keepOne = false } = {}) => {
    const list = state[key];
    if (list.includes(value)) {
      if (keepOne && list.length <= 1) return;
      state[key] = list.filter((v) => v !== value);
    } else {
      state[key] = [...list, value];
    }
    render();
  };

  const renderCustomHours = () => {
    const container = body.querySelector('#svc-custom-hours-container');
    if (!container) return;
    container.style.display = state.customHoursEnabled ? '' : 'none';
    if (!state.customHoursEnabled) return;

    container.innerHTML = `
      ${customHoursRows.map((row) => `
        <div class="custom-hours-row" data-row-id="${escapeAttr(row.id)}">
          <div class="custom-hours-row-top">
            <div class="custom-hours-day-toggles">
              ${content.days.map((day) => `
                <button class="custom-hours-day-toggle ${row.days.includes(day.id) ? 'active' : ''}" data-row-id="${escapeAttr(row.id)}" data-day="${day.id}" type="button">${day.label}</button>
              `).join('')}
            </div>
            <button class="custom-hours-delete" data-row-id="${escapeAttr(row.id)}" type="button">${getIconString('trash')}</button>
          </div>
          <div class="custom-hours-time-row">
            <span class="label-inline">${labels.from}</span>
            <input type="time" class="time-input" value="${escapeAttr(row.from)}" data-row-id="${escapeAttr(row.id)}" data-field="from">
            <span class="label-inline">${labels.to}</span>
            <input type="time" class="time-input" value="${escapeAttr(row.to)}" data-row-id="${escapeAttr(row.id)}" data-field="to">
          </div>
        </div>
      `).join('')}
      <button class="custom-hours-add-btn" id="svc-add-custom-hours" type="button">${labels.addTimeWindow}</button>
    `;

    container.querySelectorAll('.custom-hours-day-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = customHoursRows.find((r) => r.id === btn.dataset.rowId);
        if (!row) return;
        row.days = row.days.includes(btn.dataset.day)
          ? row.days.filter((d) => d !== btn.dataset.day)
          : [...row.days, btn.dataset.day];
        renderCustomHours();
      });
    });
    container.querySelectorAll('.custom-hours-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        customHoursRows = customHoursRows.filter((r) => r.id !== btn.dataset.rowId);
        renderCustomHours();
      });
    });
    container.querySelectorAll('.time-input').forEach((input) => {
      input.addEventListener('change', (e) => {
        const row = customHoursRows.find((r) => r.id === e.target.dataset.rowId);
        if (row) row[e.target.dataset.field] = e.target.value;
      });
    });
    container.querySelector('#svc-add-custom-hours')?.addEventListener('click', addCustomHoursRow);
  };

  const addCustomHoursRow = () => {
    customHoursCounter += 1;
    customHoursRows.push({ id: `svc-ch-${customHoursCounter}`, days: [], from: '10:00', to: '18:00' });
    renderCustomHours();
  };

  const render = () => {
    const type = state.serviceType;
    const priceUnit = content.priceUnits[type];
    const advanceUnit = content.advanceUnits[type];
    const isOvernight = type === 'overnight';

    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="svc-type">
        <div class="svc-demo-tabs">
          ${(content.tabs || []).map((tab) => `
            <button class="svc-demo-tab ${state.serviceType === tab.id ? 'active' : ''}"
                    data-tab="${tab.id}" type="button">${tab.label}</button>
          `).join('')}
        </div>
        <div class="modal-form-field">
          <input type="text" class="modal-form-input modal-input-large"
                 placeholder="${escapeAttr(content.placeholders.name)}"
                 value="${escapeAttr(state.name)}" id="svc-input-name">
        </div>
        <div class="modal-form-field">
          <label class="modal-label modal-form-label">${labels.description} <span class="modal-label-optional">${labels.optional}</span></label>
          <textarea class="modal-form-input" placeholder="${escapeAttr(content.placeholders.description)}"
                    rows="2" id="svc-input-desc">${escapeAttr(state.description)}</textarea>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="svc-pricing">
        <div class="modal-row">
          <div class="modal-label">${getIconString('money-hand')} ${labels.price}</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.price}" id="svc-input-price" step="1">
            <span class="svc-demo-price-currency">${labels.euro}</span>
            <select class="svc-demo-price-unit" id="svc-input-price-type">
              <option value="per_unit" ${state.priceType === 'per_unit' ? 'selected' : ''}>${priceUnit}</option>
              <option value="per_person" ${state.priceType === 'per_person' ? 'selected' : ''}>${priceTypes.perPerson}</option>
              <option value="per_total" ${state.priceType === 'per_total' ? 'selected' : ''}>${priceTypes.total}</option>
            </select>
          </div>
        </div>

        ${type === 'hourly' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('clock')} ${labels.duration}</div>
            <div class="modal-controls svc-demo-price-controls">
              <input type="number" class="svc-demo-price-input" value="${state.durationHours}" id="svc-input-duration" min="1">
              <span class="svc-demo-price-unit">${labels.hours}</span>
            </div>
          </div>
        ` : ''}

        <div class="modal-row">
          <div class="modal-label">${getIconString('clock')} ${isOvernight ? labels.checkinCheckout : labels.bookingWindow}</div>
          <div class="modal-controls">
            <span class="svc-demo-label-inline">${labels.from}</span>
            <input type="time" class="svc-demo-time-input" value="${isOvernight ? state.checkinStart : state.bookingWindowStart}" id="svc-input-time-start">
            <span class="svc-demo-label-inline">${labels.to}</span>
            <input type="time" class="svc-demo-time-input" value="${isOvernight ? state.checkoutEnd : state.bookingWindowEnd}" id="svc-input-time-end">
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="svc-assign">
        <div class="modal-row">
          <div class="modal-label">${getIconString('home')} ${labels.object}</div>
          <div class="modal-controls">
            <div class="svc-demo-tags">${renderTags(content.objects, state.selectedObjects, 'data-obj')}</div>
          </div>
        </div>
        <div class="modal-row">
          <div class="modal-label">${getIconString('user')} ${labels.staff}</div>
          <div class="modal-controls">
            <div class="svc-demo-tags">${renderTags(staffOptions, state.selectedStaff, 'data-staff')}</div>
          </div>
        </div>
        <div class="modal-row">
          <div class="modal-label">${getIconString('blocks-integration')} ${labels.addons}</div>
          <div class="modal-controls">
            <div class="svc-demo-tags">${renderTags(addonOptions, state.selectedAddons, 'data-addon')}</div>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="svc-rules">
        ${!isOvernight ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('date-cog')} ${labels.customHours}</div>
            <div class="modal-controls">${renderToggle('svc-toggle-custom-hours', state.customHoursEnabled)}</div>
          </div>
          <div class="modal-row">
            <div class="modal-label">${getIconString('users-2')} ${labels.capacityBased}</div>
            <div class="modal-controls">${renderToggle('svc-toggle-capacity', state.capacityBasedBooking)}</div>
          </div>
          <div id="svc-custom-hours-container" class="custom-hours-container" style="display:none;"></div>
        ` : ''}

        <div class="modal-row">
          <div class="modal-label">${getIconString('calender-days-date')} ${labels.bookableDays}</div>
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
          <div class="modal-label">${getIconString('clock')} ${labels.minAdvance}</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.minAdvance}" id="svc-input-advance" min="0">
            <span class="svc-demo-price-unit">${advanceUnit}</span>
          </div>
        </div>

        ${type === 'hourly' ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('clock')} ${labels.fixedStartTimes}</div>
            <div class="modal-controls">${renderToggle('svc-toggle-fixed', state.fixedStartTimesEnabled)}</div>
          </div>
        ` : ''}

        ${isOvernight ? `
          <div class="modal-row">
            <div class="modal-label">${getIconString('bed')} ${labels.minNights}</div>
            <div class="modal-controls">${renderToggle('svc-toggle-min-nights', state.minNightsEnabled)}</div>
          </div>
          ${state.minNightsEnabled ? `
            <div class="modal-row" style="padding-left:20px;margin-top:-8px;">
              <div class="modal-label"></div>
              <div class="modal-controls svc-demo-price-controls">
                <input type="number" class="svc-demo-price-input" value="${state.minNights}" id="svc-input-min-nights" min="1">
                <span class="svc-demo-price-unit">${labels.nights}</span>
              </div>
            </div>
          ` : ''}
        ` : ''}
      </div>

      <div class="modal-content-section" data-demo-section="svc-cleaning">
        <div class="modal-row">
          <div class="modal-label">${getIconString('clean')} ${labels.cleaningFee}</div>
          <div class="modal-controls svc-demo-price-controls">
            <input type="number" class="svc-demo-price-input" value="${state.cleaningFee}" id="svc-input-cleaning-fee" step="1">
            <span class="svc-demo-price-currency">${labels.euro}</span>
          </div>
        </div>

        <div class="modal-row">
          <div class="modal-label">${getIconString('clean')} ${labels.cleaningBuffer}</div>
          <div class="modal-controls modal-controls-column">
            <div class="control-group-row">
              <span class="text-small-muted">${labels.before}</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="svc-input-buffer-before">
              </div>
              <span class="text-small">${labels.minutes}</span>
            </div>
            <div class="control-group-row">
              <span class="text-small-muted">${labels.after}</span>
              <div class="number-control">
                <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="svc-input-buffer-after">
              </div>
              <span class="text-small">${labels.minutes}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const bindNumber = (selector, key, { int = false, min = null } = {}) => {
      body.querySelector(selector)?.addEventListener('input', (e) => {
        let value = int ? parseInt(e.target.value, 10) : parseFloat(e.target.value);
        if (Number.isNaN(value)) value = 0;
        if (min !== null) value = Math.max(min, value);
        state[key] = value;
      });
    };

    body.querySelectorAll('.svc-demo-tab').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    body.querySelector('#svc-input-name')?.addEventListener('input', (e) => { state.name = e.target.value; });
    body.querySelector('#svc-input-desc')?.addEventListener('input', (e) => { state.description = e.target.value; });
    body.querySelector('#svc-input-price-type')?.addEventListener('change', (e) => { state.priceType = e.target.value; });
    bindNumber('#svc-input-price', 'price');
    bindNumber('#svc-input-duration', 'durationHours', { int: true, min: 1 });
    bindNumber('#svc-input-advance', 'minAdvance', { int: true, min: 0 });
    bindNumber('#svc-input-cleaning-fee', 'cleaningFee');
    bindNumber('#svc-input-buffer-before', 'bufferBefore', { int: true, min: 0 });
    bindNumber('#svc-input-buffer-after', 'bufferAfter', { int: true, min: 0 });
    bindNumber('#svc-input-min-nights', 'minNights', { int: true, min: 1 });

    body.querySelector('#svc-input-time-start')?.addEventListener('change', (e) => {
      if (state.serviceType === 'overnight') state.checkinStart = e.target.value;
      else state.bookingWindowStart = e.target.value;
    });
    body.querySelector('#svc-input-time-end')?.addEventListener('change', (e) => {
      if (state.serviceType === 'overnight') state.checkoutEnd = e.target.value;
      else state.bookingWindowEnd = e.target.value;
    });

    body.querySelectorAll('#svc-day-toggles .day-toggle').forEach((btn) => {
      btn.addEventListener('click', () => toggleInList('bookableDays', btn.dataset.day));
    });
    body.querySelectorAll('[data-obj]').forEach((btn) => {
      btn.addEventListener('click', () => toggleInList('selectedObjects', btn.dataset.obj, { keepOne: true }));
    });
    body.querySelectorAll('[data-staff]').forEach((btn) => {
      btn.addEventListener('click', () => toggleInList('selectedStaff', btn.dataset.staff));
    });
    body.querySelectorAll('[data-addon]').forEach((btn) => {
      btn.addEventListener('click', () => toggleInList('selectedAddons', btn.dataset.addon));
    });

    body.querySelector('#svc-toggle-fixed')?.addEventListener('change', (e) => {
      state.fixedStartTimesEnabled = e.target.checked;
    });
    body.querySelector('#svc-toggle-capacity')?.addEventListener('change', (e) => {
      state.capacityBasedBooking = e.target.checked;
    });
    body.querySelector('#svc-toggle-custom-hours')?.addEventListener('change', (e) => {
      state.customHoursEnabled = e.target.checked;
      if (state.customHoursEnabled && customHoursRows.length === 0) {
        addCustomHoursRow();
        return;
      }
      renderCustomHours();
    });
    body.querySelector('#svc-toggle-min-nights')?.addEventListener('change', (e) => {
      state.minNightsEnabled = e.target.checked;
      render();
    });

    renderCustomHours();
  };

  render();
};
