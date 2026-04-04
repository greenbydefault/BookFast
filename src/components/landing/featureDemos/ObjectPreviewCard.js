/**
 * ObjectPreviewCard – Landing-only mirror of "Objekt anlegen" modal.
 * Uses local demo state only (no persistence / API calls).
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Objekt anlegen',
    subtitle: 'Lege ein Objekt an.',
    closeLabel: 'Schließen',
    footerSecondary: 'Abbrechen',
    footerPrimary: 'Objekt speichern',
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
  placeholders: {
    name: 'z. B. Villa Nord oder Hausboot Molchow',
    description: 'Optional: Was ist enthalten, was soll der Gast mitbringen, wichtige Hinweise ...',
  },
  labels: {
    description: 'Beschreibung',
    optional: '(Optional)',
    capacity: 'Kapazität',
    bookableDays: 'Buchbare Tage',
    bookingWindow: 'Buchungszeitfenster',
    from: 'Von',
    to: 'Bis',
    customHours: 'Individuelle Zeiten pro Tag',
    cleaningBuffer: 'Reinigungspuffer',
    before: 'Davor',
    after: 'Danach',
    minutes: 'Minuten',
    addTimeWindow: '+ Zeitfenster hinzufügen',
  },
};

const INITIAL_STATE = {
  name: '',
  description: '',
  capacity: 0,
  bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  timeFrom: '10:00',
  timeTo: '18:00',
  bufferBefore: 0,
  bufferAfter: 0,
  customHoursEnabled: false,
  customHours: [],
};

const createRow = (id) => ({
  id,
  days: [],
  from: '10:00',
  to: '18:00',
});

const renderCustomHoursRows = (state, content) => state.customHours.map((row) => `
  <div class="custom-hours-row" data-row-id="${escapeAttr(row.id)}">
    <div class="custom-hours-row-top">
      <div class="custom-hours-day-toggles">
        ${content.days.map((day) => `
          <button class="custom-hours-day-toggle ${row.days.includes(day.id) ? 'active' : ''}" data-row-id="${escapeAttr(row.id)}" data-day="${day.id}" type="button">${day.label}</button>
        `).join('')}
      </div>
      <button class="custom-hours-delete" data-row-id="${escapeAttr(row.id)}" type="button">
        ${getIconString('trash')}
      </button>
    </div>
    <div class="custom-hours-time-row">
      <span class="label-inline">${content.labels.from}</span>
      <input type="time" class="time-input" value="${escapeAttr(row.from)}" data-row-id="${escapeAttr(row.id)}" data-field="from">
      <span class="label-inline">${content.labels.to}</span>
      <input type="time" class="time-input" value="${escapeAttr(row.to)}" data-row-id="${escapeAttr(row.id)}" data-field="to">
    </div>
  </div>
`).join('');

export const createObjectPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="object-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="${content.card.closeLabel}">×</button>
    </div>
    <div class="feature-demo-card__body" id="object-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initObjectPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#object-preview-body');
  if (!body) return;

  const state = { ...INITIAL_STATE, bookableDays: [...INITIAL_STATE.bookableDays], customHours: [] };
  let customHoursCounter = 0;

  const toggleDay = (day) => {
    if (state.bookableDays.includes(day)) {
      state.bookableDays = state.bookableDays.filter((d) => d !== day);
    } else {
      state.bookableDays = [...state.bookableDays, day];
    }
  };

  const addCustomHoursRow = () => {
    customHoursCounter += 1;
    state.customHours.push(createRow(`demo-ch-${customHoursCounter}`));
    renderCustomHoursSection();
  };

  const removeCustomHoursRow = (rowId) => {
    state.customHours = state.customHours.filter((row) => row.id !== rowId);
    renderCustomHoursSection();
  };

  const toggleCustomHoursDay = (rowId, day) => {
    const row = state.customHours.find((item) => item.id === rowId);
    if (!row) return;
    if (row.days.includes(day)) {
      row.days = row.days.filter((d) => d !== day);
    } else {
      row.days = [...row.days, day];
    }
    renderCustomHoursSection();
  };

  const setCustomHoursTime = (rowId, field, value) => {
    const row = state.customHours.find((item) => item.id === rowId);
    if (!row) return;
    row[field] = value;
  };

  const renderCustomHoursSection = () => {
    const container = body.querySelector('#object-preview-custom-hours-container');
    if (!container) return;

    container.innerHTML = `
      ${renderCustomHoursRows(state, content)}
      <button class="custom-hours-add-btn" id="object-preview-add-custom-hours" type="button">${content.labels.addTimeWindow}</button>
    `;

    container.querySelectorAll('.custom-hours-day-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleCustomHoursDay(btn.dataset.rowId, btn.dataset.day);
      });
    });

    container.querySelectorAll('.custom-hours-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeCustomHoursRow(btn.dataset.rowId);
      });
    });

    container.querySelectorAll('.time-input').forEach((input) => {
      input.addEventListener('change', (event) => {
        setCustomHoursTime(event.target.dataset.rowId, event.target.dataset.field, event.target.value);
      });
    });

    const addBtn = container.querySelector('#object-preview-add-custom-hours');
    addBtn?.addEventListener('click', addCustomHoursRow);
  };

  body.innerHTML = `
    <div class="modal-content-section">
      <input
        type="text"
        class="modal-form-input modal-input-large"
        placeholder="${escapeAttr(content.placeholders.name)}"
        value="${escapeAttr(state.name)}"
        id="object-preview-input-name"
      >

      <div class="modal-form-field">
        <label class="modal-label modal-form-label">${content.labels.description} <span class="modal-label-optional">${content.labels.optional}</span></label>
        <textarea
          class="modal-form-input"
          placeholder="${escapeAttr(content.placeholders.description)}"
          rows="3"
          id="object-preview-input-desc"
        >${escapeAttr(state.description)}</textarea>
      </div>
    </div>

    <div class="modal-content-section">
      <div class="modal-row">
        <div class="modal-label">${getIconString('users-2')} ${content.labels.capacity}</div>
        <div class="modal-controls">
          <div class="number-control">
            <input type="number" class="number-input" value="${state.capacity}" min="0" id="object-preview-input-capacity">
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('calender-days-date')} ${content.labels.bookableDays}</div>
        <div class="modal-controls">
          <div class="day-toggles" id="object-preview-day-toggles">
            ${content.days.map((day) => `
              <button class="day-toggle ${state.bookableDays.includes(day.id) ? 'active' : ''}" data-day="${day.id}" type="button">${day.label}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('clock')} ${content.labels.bookingWindow}</div>
        <div class="modal-controls">
          <div class="time-group">
            <span>${content.labels.from}</span>
            <input type="time" value="${escapeAttr(state.timeFrom)}" id="object-preview-input-time-from">
          </div>
          <div class="time-group">
            <span>${content.labels.to}</span>
            <input type="time" value="${escapeAttr(state.timeTo)}" id="object-preview-input-time-to">
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('date-cog')} ${content.labels.customHours}</div>
        <div class="modal-controls">
          <label class="toggle-switch">
            <input type="checkbox" id="object-preview-toggle-custom-hours">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div id="object-preview-custom-hours-container" class="custom-hours-container" style="display:none;"></div>
    </div>

    <div class="modal-content-section">
      <div class="modal-row">
        <div class="modal-label">${getIconString('clean')} ${content.labels.cleaningBuffer}</div>
        <div class="modal-controls modal-controls-column">
          <div class="control-group-row">
            <span class="text-small-muted">${content.labels.before}</span>
            <div class="number-control">
              <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="object-preview-input-buffer-before">
            </div>
            <span class="text-small">${content.labels.minutes} ⌄</span>
          </div>
          <div class="control-group-row">
            <span class="text-small-muted">${content.labels.after}</span>
            <div class="number-control">
              <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="object-preview-input-buffer-after">
            </div>
            <span class="text-small">${content.labels.minutes} ⌄</span>
          </div>
        </div>
      </div>
    </div>
  `;

  body.querySelector('#object-preview-input-name')?.addEventListener('input', (event) => {
    state.name = event.target.value;
  });
  body.querySelector('#object-preview-input-desc')?.addEventListener('input', (event) => {
    state.description = event.target.value;
  });
  body.querySelector('#object-preview-input-capacity')?.addEventListener('input', (event) => {
    state.capacity = Math.max(0, parseInt(event.target.value, 10) || 0);
    event.target.value = state.capacity;
  });
  body.querySelector('#object-preview-input-time-from')?.addEventListener('change', (event) => {
    state.timeFrom = event.target.value;
  });
  body.querySelector('#object-preview-input-time-to')?.addEventListener('change', (event) => {
    state.timeTo = event.target.value;
  });
  body.querySelector('#object-preview-input-buffer-before')?.addEventListener('input', (event) => {
    state.bufferBefore = Math.max(0, parseInt(event.target.value, 10) || 0);
    event.target.value = state.bufferBefore;
  });
  body.querySelector('#object-preview-input-buffer-after')?.addEventListener('input', (event) => {
    state.bufferAfter = Math.max(0, parseInt(event.target.value, 10) || 0);
    event.target.value = state.bufferAfter;
  });

  body.querySelectorAll('#object-preview-day-toggles .day-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleDay(btn.dataset.day);
      btn.classList.toggle('active', state.bookableDays.includes(btn.dataset.day));
    });
  });

  body.querySelector('#object-preview-toggle-custom-hours')?.addEventListener('change', (event) => {
    state.customHoursEnabled = event.target.checked;
    const container = body.querySelector('#object-preview-custom-hours-container');
    if (!container) return;
    container.style.display = state.customHoursEnabled ? '' : 'none';

    if (state.customHoursEnabled && state.customHours.length === 0) {
      addCustomHoursRow();
      return;
    }
    if (state.customHoursEnabled) {
      renderCustomHoursSection();
    }
  });
};
