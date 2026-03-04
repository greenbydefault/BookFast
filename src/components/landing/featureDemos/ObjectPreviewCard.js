/**
 * ObjectPreviewCard – Landing-only mirror of "Objekt anlegen" modal.
 * Uses local demo state only (no persistence / API calls).
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

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

const renderCustomHoursRows = (state) => state.customHours.map((row) => `
  <div class="custom-hours-row" data-row-id="${escapeAttr(row.id)}">
    <div class="custom-hours-row-top">
      <div class="custom-hours-day-toggles">
        ${DAYS.map((day) => `
          <button class="custom-hours-day-toggle ${row.days.includes(day) ? 'active' : ''}" data-row-id="${escapeAttr(row.id)}" data-day="${day}" type="button">${day}</button>
        `).join('')}
      </div>
      <button class="custom-hours-delete" data-row-id="${escapeAttr(row.id)}" type="button">
        ${getIconString('trash')}
      </button>
    </div>
    <div class="custom-hours-time-row">
      <span class="label-inline">Von</span>
      <input type="time" class="time-input" value="${escapeAttr(row.from)}" data-row-id="${escapeAttr(row.id)}" data-field="from">
      <span class="label-inline">Bis</span>
      <input type="time" class="time-input" value="${escapeAttr(row.to)}" data-row-id="${escapeAttr(row.id)}" data-field="to">
    </div>
  </div>
`).join('');

export const createObjectPreviewCard = () => `
  <div class="feature-demo-card" id="object-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Objekt Anlegen</h3>
        <p class="feature-demo-card__subtitle">Lege einen Objekt an.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="object-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Modul speichern</button>
    </div>
  </div>
`;

export const initObjectPreviewCard = (heroContainer) => {
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
      ${renderCustomHoursRows(state)}
      <button class="custom-hours-add-btn" id="object-preview-add-custom-hours" type="button">+ Zeitfenster hinzufügen</button>
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
        placeholder="z. B. Villa Nord oder Hausboot Molchow"
        value="${escapeAttr(state.name)}"
        id="object-preview-input-name"
      >

      <div class="modal-form-field">
        <label class="modal-label modal-form-label">Beschreibung <span class="modal-label-optional">(Optional)</span></label>
        <textarea
          class="modal-form-input"
          placeholder="Optional: Was ist enthalten, was soll der Gast mitbringen, wichtige Hinweise ..."
          rows="3"
          id="object-preview-input-desc"
        >${escapeAttr(state.description)}</textarea>
      </div>
    </div>

    <div class="modal-content-section">
      <div class="modal-row">
        <div class="modal-label">${getIconString('users-2')} Kapazität</div>
        <div class="modal-controls">
          <div class="number-control">
            <input type="number" class="number-input" value="${state.capacity}" min="0" id="object-preview-input-capacity">
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
        <div class="modal-controls">
          <div class="day-toggles" id="object-preview-day-toggles">
            ${DAYS.map((day) => `
              <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}" data-day="${day}" type="button">${day}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('clock')} Buchungszeitfenster</div>
        <div class="modal-controls">
          <div class="time-group">
            <span>Von</span>
            <input type="time" value="${escapeAttr(state.timeFrom)}" id="object-preview-input-time-from">
          </div>
          <div class="time-group">
            <span>Bis</span>
            <input type="time" value="${escapeAttr(state.timeTo)}" id="object-preview-input-time-to">
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('date-cog')} Individuelle Zeiten pro Tag</div>
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
        <div class="modal-label">${getIconString('clean')} Reinigungspuffer</div>
        <div class="modal-controls modal-controls-column">
          <div class="control-group-row">
            <span class="text-small-muted">Davor</span>
            <div class="number-control">
              <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="object-preview-input-buffer-before">
            </div>
            <span class="text-small">Minuten ⌄</span>
          </div>
          <div class="control-group-row">
            <span class="text-small-muted">Danach</span>
            <div class="number-control">
              <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="object-preview-input-buffer-after">
            </div>
            <span class="text-small">Minuten ⌄</span>
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
