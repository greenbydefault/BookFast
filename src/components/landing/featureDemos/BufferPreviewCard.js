/**
 * BufferPreviewCard – Landing-only mirror von Service-/Objekt-Reinigungspuffer.
 * Nur lokaler Demo-State (kein API).
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const INITIAL = { bufferBefore: 30, bufferAfter: 30 };

export const createBufferPreviewCard = () => `
  <div class="feature-demo-card" id="buffer-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Reinigungspuffer</h3>
        <p class="feature-demo-card__subtitle">Pro Service – wie in den Service-Einstellungen.</p>
      </div>
    </div>
    <div class="feature-demo-card__body" id="buffer-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Abbrechen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Speichern</button>
    </div>
  </div>
`;

export const initBufferPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#buffer-preview-body');
  if (!body) return;

  const state = { ...INITIAL };

  body.innerHTML = `
    <div class="modal-content-section" data-demo-section="bf-puffer-config">
      <div class="modal-row">
        <div class="modal-label">${getIconString('clean')} Reinigungspuffer</div>
        <div class="modal-controls modal-controls-column">
          <div class="control-group-row">
            <span class="text-small-muted">Davor</span>
            <div class="number-control">
              <input type="number" class="number-input" value="${state.bufferBefore}" min="0" id="buffer-demo-input-before">
            </div>
            <span class="text-small">Minuten ⌄</span>
          </div>
          <div class="control-group-row">
            <span class="text-small-muted">Danach</span>
            <div class="number-control">
              <input type="number" class="number-input" value="${state.bufferAfter}" min="0" id="buffer-demo-input-after">
            </div>
            <span class="text-small">Minuten ⌄</span>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-content-section" data-demo-section="bf-auto-block">
      <p class="bf-preview-section-label">${getIconString('lock')} Automatisch blockiert</p>
      <p class="bf-auto-block-hint text-small-muted">Buchung 10:00–12:00 Uhr mit 30&nbsp;Min Puffer – nächster Slot ab 12:30 Uhr.</p>
      <div class="bf-timeline" aria-hidden="true">
        <div class="bf-timeline__segment bf-timeline__segment--booking">
          <span class="bf-timeline__label">Buchung</span>
          <span class="bf-timeline__time">10:00–12:00</span>
        </div>
        <div class="bf-timeline__segment bf-timeline__segment--buffer">
          <span class="bf-timeline__label">Puffer</span>
          <span class="bf-timeline__time">30 Min</span>
        </div>
        <div class="bf-timeline__segment bf-timeline__segment--next">
          <span class="bf-timeline__label">Nächster Slot</span>
          <span class="bf-timeline__time">ab 12:30</span>
        </div>
      </div>
    </div>

    <div class="modal-content-section" data-demo-section="bf-benefits">
      <p class="bf-preview-section-label">${getIconString('check')} Kein Stress</p>
      <ul class="bf-benefits-list">
        <li class="bf-benefits-item">
          ${getIconString('check', 'bf-benefits-item__icon')}
          <span>Genug Zeit zwischen Terminen</span>
        </li>
        <li class="bf-benefits-item">
          ${getIconString('check', 'bf-benefits-item__icon')}
          <span>Pro Service individuell einstellbar</span>
        </li>
        <li class="bf-benefits-item">
          ${getIconString('check', 'bf-benefits-item__icon')}
          <span>Ruhe für dich und dein Team</span>
        </li>
      </ul>
    </div>
  `;

  body.querySelector('#buffer-demo-input-before')?.addEventListener('input', (e) => {
    state.bufferBefore = Math.max(0, parseInt(e.target.value, 10) || 0);
    e.target.value = String(state.bufferBefore);
  });
  body.querySelector('#buffer-demo-input-after')?.addEventListener('input', (e) => {
    state.bufferAfter = Math.max(0, parseInt(e.target.value, 10) || 0);
    e.target.value = String(state.bufferAfter);
  });
};
