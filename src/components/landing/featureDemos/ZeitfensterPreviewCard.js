/**
 * ZeitfensterPreviewCard – Landing-only mirror of Objekt-„Zeiten“ + Service-Vorlauf.
 * Local demo state only (no API).
 */
import { getIconString } from '../../Icons/Icon.js';
import { escapeAttr } from '../../../lib/sanitize.js';
import './featureDemos.css';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const INITIAL_STATE = {
  bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  timeFrom: '08:00',
  timeTo: '18:00',
  customHoursEnabled: false,
  customHours: [],
  minAdvanceHours: 24,
  maxAdvanceMonths: 3,
};

const createRow = (id) => ({
  id,
  days: [],
  from: '09:00',
  to: '17:00',
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

export const createZeitfensterPreviewCard = () => `
  <div class="feature-demo-card" id="zeitfenster-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Buchbare Zeiten</h3>
        <p class="feature-demo-card__subtitle">Pro Objekt – wie in der Objekt-Ansicht unter „Zeiten“.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="zf-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Übernehmen</button>
    </div>
  </div>
`;

export const initZeitfensterPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#zf-preview-body');
  if (!body) return;

  const state = {
    ...INITIAL_STATE,
    bookableDays: [...INITIAL_STATE.bookableDays],
    customHours: [],
  };
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
    state.customHours.push(createRow(`zf-ch-${customHoursCounter}`));
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
    const container = body.querySelector('#zf-preview-custom-hours-container');
    if (!container) return;

    container.innerHTML = `
      ${renderCustomHoursRows(state)}
      <button class="custom-hours-add-btn" id="zf-preview-add-custom-hours" type="button">+ Zeitfenster hinzufügen</button>
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

    container.querySelector('#zf-preview-add-custom-hours')?.addEventListener('click', addCustomHoursRow);
  };

  body.innerHTML = `
    <div class="modal-content-section" data-demo-section="zf-object-times">
      <p class="zf-preview-section-label">${getIconString('calender-days-date')} Objekt</p>
      <div class="modal-row">
        <div class="modal-label">${getIconString('calender-days-date')} Buchbare Tage</div>
        <div class="modal-controls">
          <div class="day-toggles" id="zf-preview-day-toggles">
            ${DAYS.map((day) => `
              <button class="day-toggle ${state.bookableDays.includes(day) ? 'active' : ''}" data-day="${day}" type="button">${day}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('clock')} Standard-Zeitfenster</div>
        <div class="modal-controls">
          <div class="time-group">
            <span>Von</span>
            <input type="time" value="${escapeAttr(state.timeFrom)}" id="zf-preview-input-time-from">
          </div>
          <div class="time-group">
            <span>Bis</span>
            <input type="time" value="${escapeAttr(state.timeTo)}" id="zf-preview-input-time-to">
          </div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-label">${getIconString('date-cog')} Individuelle Zeiten pro Tag</div>
        <div class="modal-controls">
          <label class="toggle-switch">
            <input type="checkbox" id="zf-preview-toggle-custom-hours">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div id="zf-preview-custom-hours-container" class="custom-hours-container" style="display:none;"></div>
    </div>

    <div class="modal-content-section" data-demo-section="zf-booking-rules">
      <p class="zf-preview-section-label">${getIconString('clock-check')} Buchungsregeln</p>
      <div class="modal-row">
        <div class="modal-label">Mindestvorlauf (Std.)</div>
        <div class="modal-controls modal-controls-column">
          <div class="number-control">
            <input type="number" class="number-input" value="${state.minAdvanceHours}" min="0" id="zf-input-min-advance">
          </div>
          <span class="text-small-muted">Wie im Service (z. B. keine Buchung unter 24 h)</span>
        </div>
      </div>
      <div class="modal-row">
        <div class="modal-label">Max. Vorausbuchung (Monate)</div>
        <div class="modal-controls modal-controls-column">
          <div class="number-control">
            <input type="number" class="number-input" value="${state.maxAdvanceMonths}" min="1" max="24" id="zf-input-max-months">
          </div>
          <span class="text-small-muted">Beispiel – wie weit Kunden voraus buchen dürfen</span>
        </div>
      </div>
    </div>

    <div class="modal-content-section" data-demo-section="zf-rules-active">
      <p class="zf-preview-section-label">${getIconString('check')} Regeln aktiv</p>
      <p class="zf-rules-active-lead">Im Widget sieht der Kunde nur noch Slots, die zu deinen Regeln passen.</p>
      <ul class="zf-rules-active-list">
        <li class="zf-rules-active-item">
          <span class="zf-rules-active-item__icon" aria-hidden="true">${getIconString('check')}</span>
          <span>Keine Buchung außerhalb der Zeitfenster</span>
        </li>
        <li class="zf-rules-active-item">
          <span class="zf-rules-active-item__icon" aria-hidden="true">${getIconString('check')}</span>
          <span>Mindestvorlauf wird automatisch geprüft</span>
        </li>
        <li class="zf-rules-active-item">
          <span class="zf-rules-active-item__icon" aria-hidden="true">${getIconString('check')}</span>
          <span>Max. Vorausbuchung begrenzt sichtbare Termine</span>
        </li>
      </ul>
    </div>
  `;

  body.querySelector('#zf-preview-input-time-from')?.addEventListener('change', (e) => {
    state.timeFrom = e.target.value;
  });
  body.querySelector('#zf-preview-input-time-to')?.addEventListener('change', (e) => {
    state.timeTo = e.target.value;
  });
  body.querySelector('#zf-input-min-advance')?.addEventListener('input', (e) => {
    state.minAdvanceHours = Math.max(0, parseInt(e.target.value, 10) || 0);
    e.target.value = state.minAdvanceHours;
  });
  body.querySelector('#zf-input-max-months')?.addEventListener('input', (e) => {
    state.maxAdvanceMonths = Math.max(1, Math.min(24, parseInt(e.target.value, 10) || 1));
    e.target.value = state.maxAdvanceMonths;
  });

  body.querySelectorAll('#zf-preview-day-toggles .day-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleDay(btn.dataset.day);
      btn.classList.toggle('active', state.bookableDays.includes(btn.dataset.day));
    });
  });

  body.querySelector('#zf-preview-toggle-custom-hours')?.addEventListener('change', (event) => {
    state.customHoursEnabled = event.target.checked;
    const container = body.querySelector('#zf-preview-custom-hours-container');
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
