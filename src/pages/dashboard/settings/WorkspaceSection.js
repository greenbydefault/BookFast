/**
 * Settings - Workspace Section (Company Details)
 * Unified checklist-style layout with per-field auto-save.
 * Each row is both a checklist item AND an editable input with inline spinner/checkmark.
 */
import { getState, setState } from '../../../lib/store.js';
import { updateEntity, invalidateCache, fetchEntities } from '../../../lib/dataLayer.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { refreshWorkspace } from './settingsHelpers.js';
import { uploadWorkspaceLogo, removeWorkspaceLogo } from '../../../lib/services/workspaceService.js';
import { getEmbedBaseUrl } from '../../../lib/urlHelpers.js';

const EMBED_BASE_URL = getEmbedBaseUrl();

const workspaceUiState = {
  embedOpen: false,
  workspaceName: '',
  trackingEnabled: false,
  timezone: 'Europe/Berlin',
  language: 'de',
};

const renderWorkspaceVisualContent = () => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const state = getState();
  const ws = state.currentWorkspace || {};
  const sites = state.sites || [];
  const defaultSiteId = sites.length > 0 ? sites[0].id : 'YOUR_SITE_ID';
  const activeSite = sites.find(s => s.is_active);
  const workspaceName = workspaceUiState.workspaceName || ws.name || ws.company_name || 'Massagegold Berlin Tegel';
  const integrationSteps = (activeSite ? 1 : 0);
  const integrationTotal = 2;

  container.innerHTML = `
    <div class="workspace-visual">
      <section class="workspace-visual-card">
        <h2 class="workspace-visual-card__title">Workspace</h2>
        <p class="workspace-visual-card__subtitle">Name Ihres Workspace für E-Mails und Buchungswidget.</p>
        <div class="workspace-field-row">
          <div class="workspace-field-row__label">
            <span class="workspace-field-row__icon">${getIconString('bank')}</span>
            <span class="workspace-field-row__text">Workspace Name</span>
          </div>
          <div class="workspace-field-row__control">
            <input
              type="text"
              class="workspace-field-input"
              data-workspace-name-input
              value="${esc(workspaceName)}"
              aria-label="Workspace Name"
            />
          </div>
        </div>
      </section>

      <section class="workspace-visual-card workspace-visual-card--flat">
        <div class="workspace-visual-card__section">
          <h2 class="workspace-visual-card__title">Website Integration</h2>
          <p class="workspace-visual-card__subtitle">${integrationSteps} von ${integrationTotal} Schritten abgeschlossen</p>
          ${workspaceUiState.embedOpen ? `
          <div class="workspace-checklist">
            <article class="workspace-checklist-item">
              <div class="workspace-checklist-item__left">
                <span class="workspace-checklist-item__icon">${getIconString('check')}</span>
                <div>
                  <h3 class="workspace-checklist-item__title">Embed Script</h3>
                  <p class="workspace-checklist-item__subtitle">Fügen Sie dieses Skript in den &lt;body&gt; Ihrer Website ein.</p>
                </div>
              </div>
              <div class="workspace-checklist-item__actions">
                <button type="button" class="workspace-action-btn" data-copy-embed data-embed-code="<script src='${EMBED_BASE_URL}/embed.js' data-site-id='${defaultSiteId}'></script>">Code kopieren</button>
                <button type="button" class="workspace-accordion-btn is-open" data-workspace-toggle-embed aria-expanded="true">
                  ${getIconString('arrow-down')}
                </button>
              </div>
            </article>
            <article class="workspace-checklist-item workspace-checklist-item--domain">
              <div class="workspace-checklist-item__left">
                <span class="workspace-checklist-item__icon workspace-checklist-item__icon--link">${getIconString('road')}</span>
                <span class="workspace-checklist-item__title">Verknüpfte Domain</span>
              </div>
              <div class="workspace-domain-value">
                ${activeSite
                  ? `<span>${esc(activeSite.domain)}</span>
                     <span class="workspace-domain-value__check">${getIconString('check')}</span>`
                  : `<span class="workspace-domain-value--empty">Noch nicht verbunden</span>
                     <button type="button" class="workspace-action-btn workspace-action-btn--check" data-check-connection>Verbindung prüfen</button>`
                }
              </div>
            </article>
          </div>
          <div class="workspace-checklist">
            <article class="workspace-checklist-item">
              <div class="workspace-checklist-item__left">
                <span class="workspace-checklist-item__icon">${getIconString('check')}</span>
                <div>
                  <h3 class="workspace-checklist-item__title">Booking Flow Template (Webflow)</h3>
                  <p class="workspace-checklist-item__subtitle">Kopieren Sie das Buchungs-Widget und fügen Sie es in Webflow ein.</p>
                </div>
              </div>
              <div class="workspace-checklist-item__actions">
                <button type="button" class="workspace-action-btn" data-copy-template>Template kopieren</button>
              </div>
            </article>
          </div>
          ` : `
          <div class="workspace-checklist">
            <article class="workspace-checklist-item">
              <div class="workspace-checklist-item__left">
                <span class="workspace-checklist-item__icon">${getIconString('check')}</span>
                <div>
                  <h3 class="workspace-checklist-item__title">Embed Script</h3>
                  <p class="workspace-checklist-item__subtitle">Fügen Sie dieses Skript in den &lt;body&gt; Ihrer Website ein.</p>
                </div>
              </div>
              <div class="workspace-checklist-item__actions">
                <button type="button" class="workspace-action-btn" data-copy-embed data-embed-code="<script src='${EMBED_BASE_URL}/embed.js' data-site-id='${defaultSiteId}'></script>">Code kopieren</button>
                <button type="button" class="workspace-accordion-btn" data-workspace-toggle-embed aria-expanded="false">
                  ${getIconString('arrow-down')}
                </button>
              </div>
            </article>
            <article class="workspace-checklist-item">
              <div class="workspace-checklist-item__left">
                <span class="workspace-checklist-item__icon">${getIconString('check')}</span>
                <div>
                  <h3 class="workspace-checklist-item__title">Booking Flow Template (Webflow)</h3>
                  <p class="workspace-checklist-item__subtitle">Kopieren Sie das Buchungs-Widget und fügen Sie es in Webflow ein.</p>
                </div>
              </div>
              <div class="workspace-checklist-item__actions">
                <button type="button" class="workspace-action-btn" data-copy-template>Template kopieren</button>
              </div>
            </article>
          </div>
          `}
        </div>

        <div class="workspace-visual-card__section workspace-visual-card__section--border-top">
          <h2 class="workspace-visual-card__title">Einstellungen</h2>
          <p class="workspace-visual-card__subtitle">0 von 3 Schritten abgeschlossen</p>
          <div class="workspace-settings-list">
            <article class="workspace-settings-item">
              <div class="workspace-settings-item__left">
                <span class="workspace-settings-item__icon">${getIconString('target')}</span>
                <div>
                  <h3 class="workspace-settings-item__title">Tracking aktivieren</h3>
                  <p class="workspace-settings-item__subtitle">Cookie-loses Tracking für Analysen aktivieren.</p>
                </div>
              </div>
              <label class="workspace-toggle" aria-label="Tracking aktivieren">
                <input type="checkbox" data-workspace-tracking-toggle ${workspaceUiState.trackingEnabled ? 'checked' : ''} />
                <span class="workspace-toggle__slider"></span>
              </label>
            </article>

            <div class="workspace-settings-item workspace-settings-item--link">
              <button type="button" class="workspace-link-btn">Mehr zum Tracking erfahren</button>
            </div>

            <article class="workspace-settings-item">
              <div class="workspace-settings-item__left">
                <span class="workspace-settings-item__icon">${getIconString('globe')}</span>
                <div>
                  <h3 class="workspace-settings-item__title">Zeitzone</h3>
                  <p class="workspace-settings-item__subtitle">Zeiten und Buchungen werden in dieser Zeitzone angezeigt.</p>
                </div>
              </div>
              <select class="workspace-select" data-workspace-timezone-select>
                <option value="Europe/Berlin" ${workspaceUiState.timezone === 'Europe/Berlin' ? 'selected' : ''}>Deutschland (GMT+1)</option>
              </select>
            </article>

            <article class="workspace-settings-item">
              <div class="workspace-settings-item__left">
                <span class="workspace-settings-item__icon">${getIconString('messages-square')}</span>
                <div>
                  <h3 class="workspace-settings-item__title">Sprache</h3>
                  <p class="workspace-settings-item__subtitle">Sprache für E-Mails und Buchungswidget.</p>
                </div>
              </div>
              <select class="workspace-select" data-workspace-language-select>
                <option value="de" ${workspaceUiState.language === 'de' ? 'selected' : ''}>Deutsch</option>
                <option value="en" ${workspaceUiState.language === 'en' ? 'selected' : ''}>Englisch</option>
              </select>
            </article>
          </div>
        </div>
      </section>
    </div>
  `;

  const toggleBtn = container.querySelector('[data-workspace-toggle-embed]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      workspaceUiState.embedOpen = !workspaceUiState.embedOpen;
      renderWorkspaceVisualContent();
    });
  }

  const copyEmbedBtn = container.querySelector('[data-copy-embed]');
  if (copyEmbedBtn) {
    copyEmbedBtn.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalText = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.embedCode || '');
        btn.textContent = 'Kopiert!';
        btn.classList.add('is-success');
      } catch (err) {
        console.error('Embed copy failed:', err);
        btn.textContent = 'Kopieren fehlgeschlagen. Bitte erneut versuchen.';
      }
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('is-success');
      }, 1500);
    });
  }

  const copyTemplateBtn = container.querySelector('[data-copy-template]');
  if (copyTemplateBtn) {
    copyTemplateBtn.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalText = btn.textContent;
      try {
        await copyWebflowTemplate();
        btn.textContent = 'Kopiert!';
        btn.classList.add('is-success');
      } catch (err) {
        console.error('Template copy failed:', err);
        btn.textContent = 'Kopieren fehlgeschlagen. Bitte erneut versuchen.';
      }
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('is-success');
      }, 1500);
    });
  }

  const checkConnBtn = container.querySelector('[data-check-connection]');
  if (checkConnBtn) {
    checkConnBtn.addEventListener('click', async () => {
      checkConnBtn.disabled = true;
      checkConnBtn.innerHTML = `<div class="autosave-spinner"></div>`;
      try {
        const result = await fetchEntities('sites', { forceRefresh: true });
        setState({ sites: result.items });
        const nowActive = result.items.find(s => s.is_active);
        if (nowActive) {
          renderWorkspaceVisualContent();
        } else {
          checkConnBtn.textContent = 'Keine Verbindung erkannt';
          checkConnBtn.classList.add('is-warning');
          setTimeout(() => {
            checkConnBtn.textContent = 'Verbindung prüfen';
            checkConnBtn.classList.remove('is-warning');
            checkConnBtn.disabled = false;
          }, 2500);
        }
      } catch (err) {
        console.error('Connection check failed:', err);
        checkConnBtn.textContent = 'Fehler – erneut versuchen';
        checkConnBtn.disabled = false;
      }
    });
  }

  const workspaceNameInput = container.querySelector('[data-workspace-name-input]');
  if (workspaceNameInput) {
    let nameSaveTimer;
    workspaceNameInput.addEventListener('input', (e) => {
      workspaceUiState.workspaceName = e.target.value;
      clearTimeout(nameSaveTimer);
      nameSaveTimer = setTimeout(async () => {
        const value = e.target.value.trim();
        try {
          await updateEntity('workspaces', ws.id, { name: value || ws.name });
          invalidateCache('workspaces');
          await refreshWorkspace();
        } catch (err) {
          console.error('Workspace name save error:', err);
        }
      }, 1000);
    });
  }

  const trackingToggle = container.querySelector('[data-workspace-tracking-toggle]');
  if (trackingToggle) {
    trackingToggle.addEventListener('change', (e) => {
      workspaceUiState.trackingEnabled = e.target.checked;
    });
  }

  const timezoneSelect = container.querySelector('[data-workspace-timezone-select]');
  if (timezoneSelect) {
    timezoneSelect.addEventListener('change', (e) => {
      workspaceUiState.timezone = e.target.value;
    });
  }

  const languageSelect = container.querySelector('[data-workspace-language-select]');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      workspaceUiState.language = e.target.value;
    });
  }
};

export const renderWorkspaceTabContent = () => {
  const state = getState();
  const ws = state.currentWorkspace || {};

  workspaceUiState.embedOpen = false;
  workspaceUiState.workspaceName = ws.name || ws.company_name || 'Massagegold Berlin Tegel';
  renderWorkspaceVisualContent();
};

// ─── Section definitions ───

const SECTIONS = [
  {
    id: 'account-checklist',
    title: 'Unternehmensdaten',
    showProgress: true,
    fields: [
      { name: 'company_name', label: 'Firmenname', subtext: 'Anzeigename Ihres Unternehmens.', placeholder: 'z.B. Acme Corp GmbH', icon: 'bank', type: 'text', required: true },
      { name: 'phone', label: 'Telefon', subtext: 'Geschäftliche Telefonnummer.', placeholder: '+49 30 123456', icon: 'phone', type: 'tel' },
      { name: 'website', label: 'Webseite', subtext: 'URL Ihrer Unternehmenswebseite.', placeholder: 'https://example.com', icon: 'globe', type: 'url' },
      { name: 'email', label: 'Kontakt E-Mail', subtext: 'E-Mail für Kundenanfragen.', placeholder: 'kontakt@example.com', icon: 'mail', type: 'email' },
      { name: 'logo_url', label: 'Firmenlogo', subtext: 'Logo für E-Mails und Buchungswidget.', icon: 'upload', type: 'file' },
    ],
  },
  {
    id: 'adresse',
    title: 'Adresse',
    subtitle: 'Adressdaten Ihres Unternehmens.',
    fields: [
      { name: 'company_address', label: 'Adresse', subtext: 'Straße und Hausnummer Ihres Unternehmens.', placeholder: 'Musterstraße 1', icon: 'location-map', type: 'text', required: true },
      { name: 'company_zip', label: 'PLZ', subtext: 'Postleitzahl Ihres Standorts.', placeholder: '10115', icon: 'hash', type: 'text' },
      { name: 'company_city', label: 'Stadt', subtext: 'Stadt Ihres Unternehmensstandorts.', placeholder: 'Berlin', icon: 'home', type: 'text' },
      { name: 'company_country', label: 'Land', subtext: 'Land Ihres Unternehmens.', placeholder: 'Deutschland', icon: 'globe', type: 'text', defaultValue: 'Germany' },
    ],
  },
  {
    id: 'steuerdaten',
    title: 'Steuerdaten',
    subtitle: 'Steuernummer und Umsatzsteuer-ID für Rechnungen.',
    fields: [
      { name: 'tax_id', label: 'Steuernummer', subtext: 'Steuernummer für Rechnungen.', placeholder: '12/345/67890', icon: 'receipt-euro', type: 'text', required: true },
      { name: 'vat_id', label: 'USt-IdNr.', subtext: 'Umsatzsteuer-Identifikationsnummer für grenzüberschreitende Rechnungen.', placeholder: 'DE123456789', icon: 'receipt-euro', type: 'text' },
    ],
  },
  {
    id: 'bankdaten',
    title: 'Bankdaten',
    subtitle: 'Die Bankdaten werden auf Ihrer Rechnung ausgegeben.',
    fields: [
      { name: 'bank_name', label: 'Bank Name', subtext: 'Name Ihrer Bank.', placeholder: 'Berliner Sparkasse', icon: 'bank-card', type: 'text', required: true },
      { name: 'iban', label: 'IBAN', subtext: 'Internationale Bankkontonummer.', placeholder: 'DE00 0000 0000 0000 0000 00', icon: 'hash', type: 'text', required: true },
      { name: 'bic', label: 'BIC', subtext: 'Bank Identifier Code.', placeholder: 'ABCD DE BB', icon: 'hash', type: 'text' },
    ],
  },
  {
    id: 'rechtliches',
    title: 'Rechtliches',
    subtitle: 'Handelsregister und Geschäftsführung.',
    fields: [
      { name: 'managing_directors', label: 'Geschäftsführer', subtext: 'Vertretungsberechtigte Person(en).', placeholder: 'Max Mustermann', icon: 'user', type: 'text' },
      { name: 'register_court', label: 'Amtsgericht', subtext: 'Zuständiges Registergericht.', placeholder: 'Amtsgericht Berlin-Charlottenburg', icon: 'bank', type: 'text' },
      { name: 'register_number', label: 'Handelsregister (HRB)', subtext: 'Handelsregisternummer.', placeholder: 'HRB 123456', icon: 'hash', type: 'text' },
    ],
  },
];

// ─── Helpers ───

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const getAllFields = () => SECTIONS.flatMap(s => s.fields);

const countCompleted = (ws) => getAllFields().filter(f => {
  const val = ws[f.name] || f.defaultValue || '';
  return val.trim().length > 0;
}).length;

// ─── Per-field debounce timers ───
const fieldTimers = {};
let confettiFired = false;

// ─── Render a single field row ───

const renderFieldRow = (field, ws, isLast) => {
  const value = ws[field.name] || field.defaultValue || '';

  return `
    <div class="account-checklist-row${isLast ? ' account-checklist-row--last' : ''}">
      <div class="home-checklist-step__icon-box">
        ${getIconString(field.icon)}
      </div>
      <div class="account-checklist-row__content">
        <div class="account-checklist-row__text">
          <h3 class="home-checklist-step__label">${field.label}</h3>
          <p class="home-checklist-step__subtext">${field.subtext}</p>
        </div>
        <div class="account-input-wrapper">
          <input type="${field.type}" name="${field.name}" value="${esc(value)}" class="account-checklist-row__input" placeholder="${field.placeholder}" data-field="${field.name}">
          <div class="account-input-status" id="status-${field.name}"></div>
        </div>
      </div>
    </div>
  `;
};

// ─── Render upload row (for file-type fields) ───

const renderUploadRow = (field, ws, isLast) => {
  const value = ws[field.name] || '';
  const hasImage = value && value.trim().length > 0;

  return `
    <div class="account-checklist-row${isLast ? ' account-checklist-row--last' : ''}">
      <div class="home-checklist-step__icon-box">
        ${getIconString(field.icon)}
      </div>
      <div class="account-checklist-row__content">
        <div class="account-checklist-row__text">
          <h3 class="home-checklist-step__label">${field.label}</h3>
          <p class="home-checklist-step__subtext">${field.subtext}</p>
        </div>
        <div class="account-input-wrapper">
          <div class="account-logo-upload" id="logo-upload-zone" tabindex="0" role="button" aria-label="Logo hochladen">
            ${hasImage
      ? `<div class="account-logo-preview">
                   <img src="${esc(value)}" alt="Firmenlogo" />
                   <button class="account-logo-remove" id="logo-remove-btn" title="Logo entfernen" type="button">&times;</button>
                 </div>`
      : `<div class="account-logo-placeholder">
                   ${getIconString('upload')}
                   <span>Hochladen</span>
                 </div>`
    }
            <input type="file" id="logo-file-input" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;" />
          </div>
          <div class="account-input-status" id="status-${field.name}"></div>
        </div>
      </div>
    </div>
  `;
};

// ─── Render progress bar ───

const renderProgressBar = (ws) => {
  const allFields = getAllFields();
  const completed = countCompleted(ws);
  const total = allFields.length;
  const progressPercent = Math.round((completed / total) * 100);
  const TOTAL_SEGMENTS = 100;
  const filledSegments = Math.round((progressPercent / 100) * TOTAL_SEGMENTS);
  const hue = Math.round((progressPercent / 100) * 130);
  const progressColor = `hsl(${hue}, 75%, 45%)`;

  const segmentsHTML = Array(TOTAL_SEGMENTS).fill(0).map((_, i) => {
    const isActive = i < filledSegments;
    if (!isActive) return `<div class="progress-segment"></div>`;
    return `<div class="progress-segment active" style="background-color: ${progressColor}"></div>`;
  }).join('');

  return `
    <div class="home-checklist-header">
      <div class="home-checklist-header__row">
        <div>
          <p class="home-checklist-header__subtitle">${completed} von ${total} Feldern ausgefüllt</p>
        </div>
        <span class="home-checklist-header__percent">${progressPercent} / 100%</span>
      </div>
      <div class="home-checklist-progress-segments">${segmentsHTML}</div>
    </div>
  `;
};

// ─── Render a section card ───

const renderSection = (section, ws) => {
  const fieldsHTML = section.fields.map((field, i) => {
    const isLast = i === section.fields.length - 1;
    if (field.type === 'file') return renderUploadRow(field, ws, isLast);
    return renderFieldRow(field, ws, isLast);
  }).join('');

  const progressHTML = section.showProgress ? renderProgressBar(ws) : '';
  const subtitleHTML = section.subtitle
    ? `<p class="account-section-card__subtitle">${section.subtitle}</p>`
    : '';

  return `
    <div class="home-checklist-card account-section-card" id="${section.id}-section">
      <h2 class="account-section-card__title">${section.title}</h2>
      ${subtitleHTML}
      ${progressHTML}
      <div class="checklist-steps">${fieldsHTML}</div>
    </div>
  `;
};

// ─── Auto-save a single field ───

const saveField = async (fieldName, value, wsContext) => {
  const statusEl = document.getElementById(`status-${fieldName}`);

  // Show spinner
  if (statusEl) {
    statusEl.innerHTML = `<div class="autosave-spinner"></div>`;
    statusEl.classList.add('visible');
  }

  try {
    const state = getState();
    const updates = { [fieldName]: value };
    await updateEntity('workspaces', state.currentWorkspace.id, updates);
    invalidateCache('workspaces');

    // Update context in place
    wsContext[fieldName] = value;

    // Show checkmark
    if (statusEl) {
      statusEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      statusEl.classList.add('saved');
      setTimeout(() => {
        statusEl.classList.remove('visible', 'saved');
      }, 2000);
    }

    // Update progress bar & icon states without full re-render
    await refreshWorkspace();
    updateProgressAndIcons();
  } catch (err) {
    console.error('Auto-save error:', err);
    if (statusEl) {
      statusEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      statusEl.style.color = '#dc2626';
      setTimeout(() => {
        statusEl.classList.remove('visible');
        statusEl.style.color = '';
      }, 3000);
    }
  }
};

// ─── Update progress bar and icon states in-place ───

const updateProgressAndIcons = () => {
  const state = getState();
  const ws = state.currentWorkspace || {};

  // Update progress bar
  const headerEl = document.querySelector('#account-checklist-section .home-checklist-header');
  if (headerEl) {
    const allFields = getAllFields();
    const completed = countCompleted(ws);
    const total = allFields.length;
    const progressPercent = Math.round((completed / total) * 100);
    const TOTAL_SEGMENTS = 100;
    const filledSegments = Math.round((progressPercent / 100) * TOTAL_SEGMENTS);
    const hue = Math.round((progressPercent / 100) * 130);
    const progressColor = `hsl(${hue}, 75%, 45%)`;

    // Update subtitle
    const subtitleEl = headerEl.querySelector('.home-checklist-header__subtitle');
    if (subtitleEl) subtitleEl.textContent = `${completed} von ${total} Feldern ausgefüllt`;

    // Update percent
    const percentEl = headerEl.querySelector('.home-checklist-header__percent');
    if (percentEl) percentEl.textContent = `${progressPercent} / 100%`;

    // Update segments
    const segments = headerEl.querySelectorAll('.progress-segment');
    segments.forEach((seg, i) => {
      if (i < filledSegments) {
        seg.classList.add('active');
        seg.style.backgroundColor = progressColor;
      } else {
        seg.classList.remove('active');
        seg.style.backgroundColor = '';
      }
    });
  }

  // Fire confetti if 100%
  const allFields = getAllFields();
  if (countCompleted(ws) === allFields.length && !confettiFired) {
    confettiFired = true;
    setTimeout(() => fireConfetti(), 400);
  }
};

// ─── Setup auto-save listeners ───

const setupAutoSave = (wsContext) => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  container.addEventListener('input', (e) => {
    const input = e.target.closest('[data-field]');
    if (!input) return;

    const fieldName = input.dataset.field;
    const value = input.value;



    // Clear previous timer for this field
    if (fieldTimers[fieldName]) clearTimeout(fieldTimers[fieldName]);

    // Show spinner immediately
    const statusEl = document.getElementById(`status-${fieldName}`);
    if (statusEl) {
      statusEl.innerHTML = `<div class="autosave-spinner"></div>`;
      statusEl.classList.add('visible');
      statusEl.classList.remove('saved');
    }

    // Debounce save (1 second after last keystroke)
    fieldTimers[fieldName] = setTimeout(() => {
      saveField(fieldName, value, wsContext);
    }, 1000);
  });
};

// ─── Main Render ───

export const renderWorkspaceContent = () => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const state = getState();
  const ws = state.currentWorkspace || {};

  container.innerHTML = `
    <div class="account-section">
      <form id="company-settings-form" onsubmit="return false;">
        ${SECTIONS.map(s => renderSection(s, ws)).join('')}
      </form>
    </div>
  `;

  // Setup per-field auto-save
  confettiFired = false;
  setupAutoSave(ws);

  // Setup logo upload
  setupLogoUpload(ws);
};

// ─── Logo upload / remove ───

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 MB

const uploadLogo = async (file, wsContext) => {
  const statusEl = document.getElementById('status-logo_url');

  // Validate
  if (!file.type.startsWith('image/')) {
    alert('Bitte wählen Sie eine Bilddatei (PNG, JPG, WebP oder SVG).');
    return;
  }
  if (file.size > MAX_LOGO_SIZE) {
    alert('Das Bild darf maximal 2 MB groß sein.');
    return;
  }

  // Show spinner
  if (statusEl) {
    statusEl.innerHTML = `<div class="autosave-spinner"></div>`;
    statusEl.classList.add('visible');
  }

  try {
    const state = getState();
    const wsId = state.currentWorkspace.id;
    const publicUrl = await uploadWorkspaceLogo({ workspaceId: wsId, file });

    // Save to workspace
    await updateEntity('workspaces', wsId, { logo_url: publicUrl });
    invalidateCache('workspaces');
    wsContext.logo_url = publicUrl;

    // Update preview in-place
    const zone = document.getElementById('logo-upload-zone');
    if (zone) {
      zone.innerHTML = `
        <div class="account-logo-preview">
          <img src="${esc(publicUrl)}" alt="Firmenlogo" />
          <button class="account-logo-remove" id="logo-remove-btn" title="Logo entfernen" type="button">&times;</button>
        </div>
        <input type="file" id="logo-file-input" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;" />
      `;
      // Re-bind remove button
      bindRemoveBtn(wsContext);
    }

    // Show checkmark
    if (statusEl) {
      statusEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      statusEl.classList.add('saved');
      setTimeout(() => statusEl.classList.remove('visible', 'saved'), 2000);
    }

    await refreshWorkspace();
    updateProgressAndIcons();
  } catch (err) {
    console.error('Logo upload error:', err);
    if (statusEl) {
      statusEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      statusEl.style.color = '#dc2626';
      setTimeout(() => { statusEl.classList.remove('visible'); statusEl.style.color = ''; }, 3000);
    }
  }
};

const removeLogo = async (wsContext) => {
  const statusEl = document.getElementById('status-logo_url');
  if (statusEl) {
    statusEl.innerHTML = `<div class="autosave-spinner"></div>`;
    statusEl.classList.add('visible');
  }

  try {
    const state = getState();
    const wsId = state.currentWorkspace.id;

    // Try to remove from storage (ignore errors if file doesn't exist)
    const oldUrl = wsContext.logo_url || '';
    await removeWorkspaceLogo(oldUrl);

    // Clear from workspace
    await updateEntity('workspaces', wsId, { logo_url: null });
    invalidateCache('workspaces');
    wsContext.logo_url = '';

    // Reset upload zone
    const zone = document.getElementById('logo-upload-zone');
    if (zone) {
      zone.innerHTML = `
        <div class="account-logo-placeholder">
          ${getIconString('upload')}
          <span>Hochladen</span>
        </div>
        <input type="file" id="logo-file-input" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;" />
      `;
    }

    if (statusEl) {
      statusEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      statusEl.classList.add('saved');
      setTimeout(() => statusEl.classList.remove('visible', 'saved'), 2000);
    }

    await refreshWorkspace();
    updateProgressAndIcons();
  } catch (err) {
    console.error('Logo remove error:', err);
  }
};

const bindRemoveBtn = (wsContext) => {
  const removeBtn = document.getElementById('logo-remove-btn');
  if (removeBtn) {
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeLogo(wsContext);
    };
  }
};

const setupLogoUpload = (wsContext) => {
  const zone = document.getElementById('logo-upload-zone');
  const fileInput = document.getElementById('logo-file-input');
  if (!zone || !fileInput) return;

  // Click to open file picker
  zone.addEventListener('click', (e) => {
    if (e.target.closest('#logo-remove-btn')) return;
    fileInput.click();
  });

  // Keyboard accessibility
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // File selected
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) uploadLogo(file, wsContext);
    fileInput.value = ''; // reset so same file can be re-selected
  });

  // Drag & drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) uploadLogo(file, wsContext);
  });

  // Bind remove button if logo exists
  bindRemoveBtn(wsContext);
};

// ─── Confetti Effect ───

const fireConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  const pieces = [];
  const total = 120;

  for (let i = 0; i < total; i++) {
    pieces.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 400,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 22 - 8,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35 + Math.random() * 0.15,
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 180;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    for (const p of pieces) {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.vx *= 0.99;
      if (frame > maxFrames - 60) p.opacity = Math.max(0, p.opacity - 0.02);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(animate);
};

const getWebflowTemplate = () => {
  const mongoId = () => {
    const timestamp = (Math.floor(Date.now() / 1000)).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      (Math.random() * 16 | 0).toString(16)
    ).toLowerCase();
  };

  const cls = {};
  const styleDefs = [];
  const defClass = (name, styleLess) => {
    const id = mongoId();
    cls[name] = id;
    styleDefs.push({ "_id": id, "fake": false, "type": "class", "name": name, "namespace": "", "comb": "", "styleLess": styleLess });
    return id;
  };

  // --- Split-Screen Layout classes ---
  defClass('bf-root', 'width: 60rem; max-width: 100%; margin-left: auto; margin-right: auto; font-family: Inter, system-ui, sans-serif; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #e7e5e4; border-bottom-color: #e7e5e4; border-left-color: #e7e5e4; border-right-color: #e7e5e4; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; overflow: hidden;');
  defClass('bf-form', 'display: flex; flex-direction: column;');
  defClass('bf-split', 'display: flex; min-height: 37.5rem;');
  defClass('bf-split-left', 'flex-grow: 1; flex-basis: 50%; border-right-width: 0.0625rem; border-right-style: solid; border-right-color: #e7e5e4; display: flex; flex-direction: column; overflow-y: auto;');
  defClass('bf-split-right', 'flex-grow: 1; flex-basis: 50%; display: flex; flex-direction: column; padding-top: 1.5rem; padding-bottom: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem; opacity: 0.5;');
  defClass('bf-split-header', 'padding-top: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem; padding-bottom: 0; display: flex; flex-direction: column; gap: 0.75rem;');
  defClass('bf-split-header-name', 'font-size: 1.25rem; font-weight: 400; color: #000; line-height: 1;');
  defClass('bf-split-header-sub', 'font-size: 1rem; font-weight: 400; color: #717079; line-height: 1.2;');
  defClass('bf-split-cards', 'padding-top: 1.5rem; padding-bottom: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; flex-grow: 1;');
  defClass('bf-split-card', 'border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #e7e5e4; border-bottom-color: #e7e5e4; border-left-color: #e7e5e4; border-right-color: #e7e5e4; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; transition: border-top-color 0.2s, border-bottom-color 0.2s, border-left-color 0.2s, border-right-color 0.2s;');
  defClass('bf-split-card-open', 'border-top-color: #624cd8; border-bottom-color: #624cd8; border-left-color: #624cd8; border-right-color: #624cd8;');
  defClass('bf-split-card-header', 'display: flex; align-items: flex-start; gap: 0.75rem; padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem; padding-right: 1rem; cursor: pointer; width: 100%; border-top-width: 0; border-bottom-width: 0; border-left-width: 0; border-right-width: 0; background-color: transparent; text-align: left;');
  defClass('bf-split-card-num', 'min-width: 2.25rem; min-height: 2.25rem; display: flex; align-items: center; justify-content: center; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #e7e5e4; border-bottom-color: #e7e5e4; border-left-color: #e7e5e4; border-right-color: #e7e5e4; border-top-left-radius: 0.25rem; border-top-right-radius: 0.25rem; border-bottom-left-radius: 0.25rem; border-bottom-right-radius: 0.25rem; font-size: 1rem; font-weight: 500; color: #12111f;');
  defClass('bf-split-card-info', 'flex-grow: 1; display: flex; flex-direction: column; gap: 0.25rem;');
  defClass('bf-split-card-title', 'font-size: 1rem; font-weight: 500; color: #12111f; line-height: 1.2;');
  defClass('bf-split-card-desc', 'font-size: 1rem; font-weight: 400; color: #78716c; line-height: 1.2;');
  defClass('bf-split-card-arrow', 'min-width: 1.5rem; min-height: 1.5rem; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;');
  defClass('bf-split-card-arrow-open', 'transform: rotate(180deg);');
  defClass('bf-split-card-arrow-svg', 'width: 1.25rem; height: 1.25rem; display: block;');
  defClass('bf-split-card-body', 'display: none; padding-left: 1rem; padding-right: 1rem; padding-bottom: 1rem;');
  defClass('bf-split-card-body-open', 'display: block;');
  defClass('bf-dynamic-area', 'min-height: 1rem;');
  defClass('bf-template-empty', 'font-size: 0.95rem; color: #78716c;');
  defClass('bf-template-item', 'display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding-top: 0.75rem; padding-bottom: 0.75rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #e7e5e4; border-bottom-color: #e7e5e4; border-left-color: #e7e5e4; border-right-color: #e7e5e4; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem;');
  defClass('bf-template-item-title', 'font-size: 1rem; font-weight: 500; color: #12111f;');
  defClass('bf-template-item-sub', 'font-size: 0.875rem; color: #78716c; margin-top: 0.125rem;');
  defClass('bf-split-footer', 'display: flex; align-items: center; justify-content: flex-end; gap: 0.625rem; padding-top: 1.125rem; padding-bottom: 1.125rem; padding-left: 1.5rem; padding-right: 1.5rem; border-top-width: 0.0625rem; border-top-style: solid; border-top-color: #e7e5e4; background-color: #fff;');
  defClass('bf-split-btn-back', 'display: inline-flex; align-items: center; justify-content: center; padding-top: 0.75rem; padding-bottom: 0.75rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #d6d3d1; border-bottom-color: #d6d3d1; border-left-color: #d6d3d1; border-right-color: #d6d3d1; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; background-color: #fff; color: #12111f; font-size: 1rem; font-weight: 400; cursor: pointer; text-decoration: none;');
  defClass('bf-split-btn-next', 'display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; min-width: 2.875rem; min-height: 2.125rem; padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 0; border-bottom-width: 0; border-left-width: 0; border-right-width: 0; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; background-color: #7660f1; color: #f8f7fe; font-size: 1rem; font-weight: 500; cursor: pointer; text-decoration: none;');

  // --- Step 2 classes (summary/form) ---
  defClass('bf-step', 'padding-top: 0; padding-bottom: 0; padding-left: 0; padding-right: 0;');
  defClass('bf-step2-layout', 'display: flex; min-height: 37.5rem;');
  defClass('bf-step2-left', 'flex-grow: 1; flex-basis: 50%; border-right-width: 0.0625rem; border-right-style: solid; border-right-color: #e7e5e4; display: flex; flex-direction: column;');
  defClass('bf-step2-right', 'flex-grow: 1; flex-basis: 50%; display: flex; flex-direction: column;');
  defClass('bf-step2-header', 'display: flex; align-items: center; justify-content: space-between; border-bottom-width: 0.0625rem; border-bottom-style: solid; border-bottom-color: #e7e5e4; padding-top: 1.5rem; padding-bottom: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem;');
  defClass('bf-step-title', 'font-size: 1.25rem; font-weight: 400; color: #12111f; line-height: 1; margin-top: 0; margin-bottom: 0;');
  defClass('bf-step-counter', 'font-size: 1rem; font-weight: 500; color: #717079; line-height: 1.2;');
  defClass('bf-step2-form', 'padding-top: 1.5rem; padding-bottom: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem; display: flex; flex-direction: column; gap: 2rem;');
  defClass('bf-grid-2', 'display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;');
  defClass('bf-form-group', 'display: flex; flex-direction: column; gap: 0.75rem;');
  defClass('bf-form-label', 'display: block; font-size: 1rem; font-weight: 500; line-height: 1.2; color: #12111f;');
  defClass('bf-input', 'width: 100%; min-height: 3rem; padding-top: 1.125rem; padding-bottom: 1.125rem; padding-left: 1rem; padding-right: 1rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #e7e5e4; border-bottom-color: #e7e5e4; border-left-color: #e7e5e4; border-right-color: #e7e5e4; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; box-sizing: border-box; font-size: 1rem; color: #12111f;');
  defClass('bf-row-2', 'display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;');
  defClass('bf-step2-section', 'border-top-width: 0.0625rem; border-top-style: solid; border-top-color: #e7e5e4;');
  defClass('bf-step2-voucher-wrap', 'padding-top: 1.5rem; padding-bottom: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;');
  defClass('bf-label', 'display: block; font-size: 1.125rem; font-weight: 400; color: #12111f; line-height: 1.2; margin-top: 0; margin-bottom: 0;');
  defClass('bf-voucher-help', 'font-size: 1rem; color: #717079; line-height: 1.2; margin-top: 0; margin-bottom: 0;');
  defClass('bf-voucher-row', 'display: flex; align-items: stretch; gap: 0.75rem;');
  defClass('bf-voucher-input', 'flex-grow: 1; min-height: 3rem; padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem; padding-right: 1rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-color: #e7e5e4; border-bottom-color: #e7e5e4; border-left-color: #e7e5e4; border-right-color: #e7e5e4; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; font-size: 1rem;');
  defClass('bf-btn-voucher', 'display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding-top: 0.75rem; padding-bottom: 0.75rem; padding-left: 1rem; padding-right: 1rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-color: #d6d3d1; border-bottom-color: #d6d3d1; border-left-color: #d6d3d1; border-right-color: #d6d3d1; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; background-color: #fff; color: #12111f; font-size: 1rem; text-decoration: none; cursor: pointer;');
  defClass('bf-voucher-status-box', 'display: none; background-color: #f8f7fe; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem; padding-right: 1rem;');
  defClass('bf-summary-column', 'display: flex; flex-direction: column;');
  defClass('bf-step2-summary-wrap', 'padding-top: 1.5rem; padding-bottom: 1.5rem; padding-left: 1.5rem; padding-right: 1.5rem;');
  defClass('bf-form-column', '');
  defClass('bf-summary-details', 'display: flex; flex-direction: column; gap: 1.5rem;');
  defClass('bf-summary-row', 'display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; padding-bottom: 0.5rem;');
  defClass('bf-summary-label', 'color: #12111f; font-size: 1rem; font-weight: 400; line-height: 1.2;');
  defClass('bf-summary-value', 'font-size: 1rem; font-weight: 400; color: #78716c; text-align: right; line-height: 1.2;');
  defClass('bf-summary-divider', 'height: 0.0625rem; background-color: #e7e5e4;');
  defClass('bf-price-rows', 'display: flex; flex-direction: column; gap: 1.5rem;');
  defClass('bf-summary-row-muted', 'display: flex; justify-content: space-between; align-items: center; padding-top: 0.25rem; padding-bottom: 0.25rem;');
  defClass('bf-summary-label-muted', 'color: #717079; font-size: 1rem; font-weight: 400; line-height: 1.2;');
  defClass('bf-summary-value-muted', 'color: #717079; font-size: 1rem; font-weight: 400; line-height: 1.2; text-align: right;');
  defClass('bf-total-display', 'display: flex; justify-content: space-between; align-items: center; font-size: 1rem; margin-top: 0;');
  defClass('bf-total-label', 'color: #12111f; font-weight: 400;');
  defClass('bf-total-value', 'color: #717079; font-weight: 400;');
  defClass('bf-submit', 'display: inline-flex; align-items: center; justify-content: center; min-height: 2.125rem; padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 0; border-bottom-width: 0; border-left-width: 0; border-right-width: 0; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; font-size: 1rem; font-weight: 500; cursor: pointer; background-color: #7660f1; color: #f8f7fe;');

  // Guest count
  defClass('bf-guest-count', 'margin-bottom: 0.75rem;');
  defClass('bf-qty-row', 'display: flex; align-items: center; gap: 0.375rem; margin-top: 0.25rem; margin-bottom: 1rem;');
  defClass('bf-qty-btn', 'display: inline-flex; align-items: center; justify-content: center; min-width: 2.75rem; min-height: 2.75rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #d1d5db; border-bottom-color: #d1d5db; border-left-color: #d1d5db; border-right-color: #d1d5db; border-top-left-radius: 0.375rem; border-top-right-radius: 0.375rem; border-bottom-left-radius: 0.375rem; border-bottom-right-radius: 0.375rem; background-color: #fff; color: #18181b; text-decoration: none; font-size: 1rem;');
  defClass('bf-qty-val', 'min-width: 2ch; text-align: center; font-size: 0.95rem; font-weight: 600;');

  // Legacy addons
  defClass('bf-addon-card', 'border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #e5e7eb; border-bottom-color: #e5e7eb; border-left-color: #e5e7eb; border-right-color: #e5e7eb; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; padding-top: 0.75rem; padding-bottom: 0.75rem; padding-left: 0.75rem; padding-right: 0.75rem; margin-bottom: 0.5rem; background-color: #fafafa;');
  defClass('bf-addon-active', 'border-top-color: #624cd8; border-bottom-color: #624cd8; border-left-color: #624cd8; border-right-color: #624cd8; background-color: #f8f7fe;');
  defClass('bf-addon-header', 'display: flex; align-items: center; gap: 0.5rem; cursor: pointer;');
  defClass('bf-addon-body', 'margin-top: 0.5rem; padding-left: 1.5rem;');
  defClass('bf-addon-item', 'margin-bottom: 0.375rem;');
  defClass('bf-addon-item-label', 'font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem;');
  defClass('bf-variant-radios', '');
  defClass('bf-variant-select', 'padding-top: 0.25rem; padding-bottom: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-color: #d1d5db; border-bottom-color: #d1d5db; border-left-color: #d1d5db; border-right-color: #d1d5db; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-left-radius: 0.25rem; border-top-right-radius: 0.25rem; border-bottom-left-radius: 0.25rem; border-bottom-right-radius: 0.25rem; font-size: 0.85rem;');
  defClass('bf-guest-block', 'padding-top: 0.625rem; border-top-width: 0.0625rem; border-top-style: solid; border-top-color: #e5e7eb;');
  defClass('bf-guest-label', 'font-weight: 600; font-size: 0.9rem; margin-bottom: 0.375rem; color: #1e40af;');

  // Success & errors
  defClass('bf-init-error', 'display: none; margin-bottom: 0.75rem; padding-top: 0.6rem; padding-bottom: 0.6rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 0.0625rem; border-bottom-width: 0.0625rem; border-left-width: 0.0625rem; border-right-width: 0.0625rem; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-color: #fecaca; border-bottom-color: #fecaca; border-left-color: #fecaca; border-right-color: #fecaca; background-color: #fef2f2; color: #991b1b; border-top-left-radius: 0.375rem; border-top-right-radius: 0.375rem; border-bottom-left-radius: 0.375rem; border-bottom-right-radius: 0.375rem; font-size: 0.92rem;');
  defClass('bf-success', 'text-align: center; padding-top: 3rem; padding-bottom: 3rem;');
  defClass('bf-success-icon', 'font-size: 3rem; margin-bottom: 1rem;');
  defClass('bf-success-title', 'font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0;');
  defClass('bf-success-desc', 'color: #71717a; font-size: 1rem; margin-top: 0;');
  defClass('bf-avail-status', 'font-weight: 600; margin-top: 0.5rem;');
  defClass('bf-dateinfo', 'margin-top: 0.75rem; margin-bottom: 0.75rem;');

  const c = (name) => [cls[name]];

  // --- Node IDs ---
  const ids = {
    root: mongoId(), form: mongoId(), initError: mongoId(), initErrorText: mongoId(),
    // Step 1: Split-Screen
    step1: mongoId(), split: mongoId(),
    splitLeft: mongoId(), splitHeader: mongoId(), splitHeaderName: mongoId(), splitHeaderNameText: mongoId(),
    splitHeaderSub: mongoId(), splitHeaderSubText: mongoId(), splitCards: mongoId(),
    // Object card
    cardObj: mongoId(), cardObjHeader: mongoId(), cardObjNum: mongoId(), cardObjNumText: mongoId(),
    cardObjInfo: mongoId(), cardObjTitle: mongoId(), cardObjTitleText: mongoId(), cardObjDesc: mongoId(), cardObjDescText: mongoId(),
    cardObjArrow: mongoId(), cardObjArrowSvg: mongoId(), cardObjArrowPolyline: mongoId(), cardObjBody: mongoId(), objDynamic: mongoId(),
    objEmpty: mongoId(), objEmptyText: mongoId(), objSample: mongoId(), objSampleMain: mongoId(), objSampleTitle: mongoId(), objSampleTitleText: mongoId(), objSampleSub: mongoId(), objSampleSubText: mongoId(), objSampleMeta: mongoId(), objSampleMetaText: mongoId(),
    // Service card
    cardSvc: mongoId(), cardSvcHeader: mongoId(), cardSvcNum: mongoId(), cardSvcNumText: mongoId(),
    cardSvcInfo: mongoId(), cardSvcTitle: mongoId(), cardSvcTitleText: mongoId(), cardSvcDesc: mongoId(), cardSvcDescText: mongoId(),
    cardSvcArrow: mongoId(), cardSvcArrowSvg: mongoId(), cardSvcArrowPolyline: mongoId(), cardSvcBody: mongoId(), svcDynamic: mongoId(),
    svcEmpty: mongoId(), svcEmptyText: mongoId(), svcSample: mongoId(), svcSampleMain: mongoId(), svcSampleTitle: mongoId(), svcSampleTitleText: mongoId(), svcSampleSub: mongoId(), svcSampleSubText: mongoId(), svcSampleMeta: mongoId(), svcSampleMetaText: mongoId(),
    // Staff card
    cardStaff: mongoId(), cardStaffHeader: mongoId(), cardStaffNum: mongoId(), cardStaffNumText: mongoId(),
    cardStaffInfo: mongoId(), cardStaffTitle: mongoId(), cardStaffTitleText: mongoId(), cardStaffDesc: mongoId(), cardStaffDescText: mongoId(),
    cardStaffArrow: mongoId(), cardStaffArrowSvg: mongoId(), cardStaffArrowPolyline: mongoId(), cardStaffBody: mongoId(), staffDynamic: mongoId(),
    staffEmpty: mongoId(), staffEmptyText: mongoId(), staffSample: mongoId(), staffSampleMain: mongoId(), staffSampleTitle: mongoId(), staffSampleTitleText: mongoId(), staffSampleSub: mongoId(), staffSampleSubText: mongoId(),
    // Addon card
    cardAddon: mongoId(), cardAddonHeader: mongoId(), cardAddonNum: mongoId(), cardAddonNumText: mongoId(),
    cardAddonInfo: mongoId(), cardAddonTitle: mongoId(), cardAddonTitleText: mongoId(), cardAddonDesc: mongoId(), cardAddonDescText: mongoId(),
    cardAddonArrow: mongoId(), cardAddonArrowSvg: mongoId(), cardAddonArrowPolyline: mongoId(), cardAddonBody: mongoId(),
    guestCountBlock: mongoId(), guestCountTitle: mongoId(), guestCountTitleStrong: mongoId(), guestCountTitleText: mongoId(), guestCountMaxText: mongoId(),
    guestCountRow: mongoId(), guestCountMinus: mongoId(), guestCountMinusText: mongoId(), guestCountValue: mongoId(), guestCountValueText: mongoId(), guestCountPlus: mongoId(), guestCountPlusText: mongoId(),
    addonsDynamic: mongoId(), addonsEmpty: mongoId(), addonsEmptyText: mongoId(), addonsSample: mongoId(), addonsSampleMain: mongoId(), addonsSampleMainText: mongoId(), addonsSamplePrice: mongoId(), addonsSamplePriceText: mongoId(),
    // Right side
    splitRight: mongoId(), calDynamic: mongoId(), calEmpty: mongoId(), calEmptyText: mongoId(), calSampleHeader: mongoId(), calSampleHeaderText: mongoId(), calSampleGrid: mongoId(), calSampleDay: mongoId(), calSampleDayText: mongoId(),
    slotsDynamic: mongoId(), slotsEmpty: mongoId(), slotsEmptyText: mongoId(), slotsSampleWrap: mongoId(), slotsSampleTitle: mongoId(), slotsSampleTitleText: mongoId(), slotsSampleDesc: mongoId(), slotsSampleDescText: mongoId(), slotsSampleItem: mongoId(), slotsSampleItemText: mongoId(),
    dateInfoContainer: mongoId(), dateInfoText: mongoId(),
    availStatus: mongoId(), availChecking: mongoId(), availCheckingText: mongoId(), availAvailable: mongoId(), availAvailableText: mongoId(), availUnavailable: mongoId(), availUnavailableText: mongoId(),
    // Footer Step 1
    footer1: mongoId(), footer1Next: mongoId(), footer1NextText: mongoId(),
    // Step 2: Summary/Details
    step2: mongoId(), step2Layout: mongoId(),
    step2Left: mongoId(), step2LeftHeader: mongoId(), step2Title: mongoId(), step2TitleText: mongoId(), step2Counter: mongoId(), step2CounterText: mongoId(),
    step2FormWrap: mongoId(), summaryContainer: mongoId(), summaryGrid: mongoId(),
    formColumn: mongoId(), formColumnTitle: mongoId(), formColumnTitleText: mongoId(),
    fnameGroup: mongoId(), fnameLabel: mongoId(), fnameLabelText: mongoId(), fnameInput: mongoId(),
    lnameGroup: mongoId(), lnameLabel: mongoId(), lnameLabelText: mongoId(), lnameInput: mongoId(),
    emailGroup: mongoId(), emailLabel: mongoId(), emailLabelText: mongoId(), emailInput: mongoId(),
    phoneGroup: mongoId(), phoneLabel: mongoId(), phoneLabelText: mongoId(), phoneInput: mongoId(),
    streetHouseRow: mongoId(), streetGroup: mongoId(), streetLabel: mongoId(), streetLabelText: mongoId(), streetInput: mongoId(),
    houseGroup: mongoId(), houseLabel: mongoId(), houseLabelText: mongoId(), houseInput: mongoId(),
    zipCityRow: mongoId(), zipGroup: mongoId(), zipLabel: mongoId(), zipLabelText: mongoId(), zipInput: mongoId(),
    cityGroup: mongoId(), cityLabel: mongoId(), cityLabelText: mongoId(), cityInput: mongoId(),
    voucherSection: mongoId(), voucherHeader: mongoId(), voucherLabel: mongoId(), voucherLabelText: mongoId(), voucherHelp: mongoId(), voucherHelpText: mongoId(),
    voucherRow: mongoId(), voucherInputRow: mongoId(), voucherInput: mongoId(), voucherBtn: mongoId(), voucherBtnText: mongoId(), voucherStatus: mongoId(),
    voucherValid: mongoId(), voucherValidText: mongoId(), voucherInvalid: mongoId(), voucherInvalidText: mongoId(), voucherChecking: mongoId(), voucherCheckingText: mongoId(),
    step2Right: mongoId(), summaryColumn: mongoId(), summaryColumnHeader: mongoId(), summaryColumnTitle: mongoId(), summaryColumnTitleText: mongoId(),
    summaryDetailsWrap: mongoId(), summaryDetails: mongoId(), summaryDivider: mongoId(), summaryPrices: mongoId(),
    sumRowObject: mongoId(), sumRowObjectLabel: mongoId(), sumRowObjectLabelText: mongoId(), sumRowObjectValue: mongoId(),
    sumRowService: mongoId(), sumRowServiceLabel: mongoId(), sumRowServiceLabelText: mongoId(), sumRowServiceValue: mongoId(),
    sumRowAddon: mongoId(), sumRowAddonLabel: mongoId(), sumRowAddonLabelText: mongoId(), sumRowAddonValue: mongoId(),
    sumRowStaff: mongoId(), sumRowStaffLabel: mongoId(), sumRowStaffLabelText: mongoId(), sumRowStaffValue: mongoId(),
    sumRowGuests: mongoId(), sumRowGuestsLabel: mongoId(), sumRowGuestsLabelText: mongoId(), sumRowGuestsValue: mongoId(),
    sumRowDate: mongoId(), sumRowDateLabel: mongoId(), sumRowDateLabelText: mongoId(), sumRowDateValue: mongoId(),
    sumRowTime: mongoId(), sumRowTimeLabel: mongoId(), sumRowTimeLabelText: mongoId(), sumRowTimeValue: mongoId(),
    priceRows: mongoId(), sumRowSubtotal: mongoId(), sumRowSubtotalLabel: mongoId(), sumRowSubtotalLabelText: mongoId(), sumRowSubtotalValue: mongoId(),
    sumRowDiscount: mongoId(), sumRowDiscountLabel: mongoId(), sumRowDiscountLabelText: mongoId(), sumRowDiscountValue: mongoId(),
    sumRowTax: mongoId(), sumRowTaxLabel: mongoId(), sumRowTaxLabelText: mongoId(), sumRowTaxValue: mongoId(),
    sumRowTotal: mongoId(), sumRowTotalLabel: mongoId(), sumRowTotalLabelText: mongoId(), sumRowTotalValue: mongoId(),
    totalDisplay: mongoId(), totalLabel: mongoId(), totalLabelText: mongoId(), totalValue: mongoId(),
    submitBtn: mongoId(),
    footer2: mongoId(), footer2Back: mongoId(), footer2BackText: mongoId(),
    // Success
    stepSuccess: mongoId(), successIcon: mongoId(), successIconText: mongoId(),
    successTitle: mongoId(), successTitleText: mongoId(), successDesc: mongoId(), successDescText: mongoId(),
    successMsg: mongoId(), successMsgText: mongoId(), errorMsg: mongoId(), errorMsgText: mongoId()
  };

  const nodes = [
    // Root
    { "_id": ids.root, "tag": "div", "classes": c('bf-root'), "children": [ids.initError, ids.form, ids.successMsg, ids.errorMsg], "type": "FormWrapper", "data": { "form": { "type": "wrapper" }, "attr": { "data-bf-root": "true" } } },
    { "_id": ids.initError, "tag": "div", "classes": c('bf-init-error'), "children": [ids.initErrorText], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-init-error": "true", "role": "alert" } } },
    { "_id": ids.initErrorText, "text": true, "v": "" },
    { "_id": ids.form, "tag": "form", "classes": c('bf-form'), "children": [ids.step1, ids.step2, ids.stepSuccess], "type": "FormForm", "data": { "form": { "type": "form", "name": "booking-form" }, "attr": { "name": "booking-form", "data-name": "Booking Form" } } },

    // ===== STEP 1: Split-Screen =====
    { "_id": ids.step1, "tag": "div", "classes": [], "children": [ids.split, ids.footer1], "type": "Block", "data": { "tag": "section", "attr": { "data-bf-step": "1", "aria-label": "Auswahl" } } },
    { "_id": ids.split, "tag": "div", "classes": c('bf-split'), "children": [ids.splitLeft, ids.splitRight], "type": "Block", "data": { "tag": "div" } },

    // -- LEFT SIDE --
    { "_id": ids.splitLeft, "tag": "div", "classes": c('bf-split-left'), "children": [ids.splitHeader, ids.splitCards], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.splitHeader, "tag": "div", "classes": c('bf-split-header'), "children": [ids.splitHeaderName, ids.splitHeaderSub], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.splitHeaderName, "tag": "div", "classes": c('bf-split-header-name'), "children": [ids.splitHeaderNameText], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-display": "workspace-name" } } },
    { "_id": ids.splitHeaderNameText, "text": true, "v": "Buchung" },
    { "_id": ids.splitHeaderSub, "tag": "div", "classes": c('bf-split-header-sub'), "children": [ids.splitHeaderSubText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.splitHeaderSubText, "text": true, "v": "Wähle deine Optionen aus" },

    { "_id": ids.splitCards, "tag": "div", "classes": c('bf-split-cards'), "children": [ids.cardObj, ids.cardSvc, ids.cardStaff, ids.cardAddon], "type": "Block", "data": { "tag": "div" } },

    // Card: Object
    { "_id": ids.cardObj, "tag": "div", "classes": c('bf-split-card').concat(c('bf-split-card-open')), "children": [ids.cardObjHeader, ids.cardObjBody], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-card": "object" } } },
    { "_id": ids.cardObjHeader, "tag": "div", "classes": c('bf-split-card-header'), "children": [ids.cardObjNum, ids.cardObjInfo, ids.cardObjArrow], "type": "Block", "data": { "tag": "button", "attr": { "type": "button", "aria-expanded": "true" } } },
    { "_id": ids.cardObjNum, "tag": "div", "classes": c('bf-split-card-num'), "children": [ids.cardObjNumText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardObjNumText, "text": true, "v": "1" },
    { "_id": ids.cardObjInfo, "tag": "div", "classes": c('bf-split-card-info'), "children": [ids.cardObjTitle, ids.cardObjDesc], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardObjTitle, "tag": "div", "classes": c('bf-split-card-title'), "children": [ids.cardObjTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardObjTitleText, "text": true, "v": "Objekt" },
    { "_id": ids.cardObjDesc, "tag": "div", "classes": c('bf-split-card-desc'), "children": [ids.cardObjDescText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardObjDescText, "text": true, "v": "Wähle das Objekt aus" },
    { "_id": ids.cardObjArrow, "tag": "div", "classes": c('bf-split-card-arrow').concat(c('bf-split-card-arrow-open')), "children": [ids.cardObjArrowSvg], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.cardObjArrowSvg, "tag": "svg", "classes": c('bf-split-card-arrow-svg'), "children": [ids.cardObjArrowPolyline], "type": "Block", "data": { "tag": "svg", "attr": { "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" } } },
    { "_id": ids.cardObjArrowPolyline, "tag": "polyline", "classes": [], "children": [], "type": "Block", "data": { "tag": "polyline", "attr": { "points": "6 9 12 15 18 9" } } },
    { "_id": ids.cardObjBody, "tag": "div", "classes": c('bf-split-card-body').concat(c('bf-split-card-body-open')), "children": [ids.objDynamic], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-panel": "object" } } },
    { "_id": ids.objDynamic, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.objEmpty, ids.objSample], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "objects" } } },
    { "_id": ids.objEmpty, "tag": "p", "classes": c('bf-template-empty'), "children": [ids.objEmptyText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-empty": "objects", "style": "display: none;" } } },
    { "_id": ids.objEmptyText, "text": true, "v": "Keine Objekte verfügbar." },
    { "_id": ids.objSample, "tag": "div", "classes": c('bf-template-item'), "children": [ids.objSampleMain, ids.objSampleMeta], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "object-item" } } },
    { "_id": ids.objSampleMain, "tag": "div", "classes": [], "children": [ids.objSampleTitle, ids.objSampleSub], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.objSampleTitle, "tag": "div", "classes": c('bf-template-item-title'), "children": [ids.objSampleTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.objSampleTitleText, "text": true, "v": "Beispiel Objekt" },
    { "_id": ids.objSampleSub, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.objSampleSubText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.objSampleSubText, "text": true, "v": "Adresse oder Beschreibung" },
    { "_id": ids.objSampleMeta, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.objSampleMetaText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.objSampleMetaText, "text": true, "v": "Max. 4 Gäste" },

    // Card: Service
    { "_id": ids.cardSvc, "tag": "div", "classes": c('bf-split-card'), "children": [ids.cardSvcHeader, ids.cardSvcBody], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-card": "service" } } },
    { "_id": ids.cardSvcHeader, "tag": "div", "classes": c('bf-split-card-header'), "children": [ids.cardSvcNum, ids.cardSvcInfo, ids.cardSvcArrow], "type": "Block", "data": { "tag": "button", "attr": { "type": "button", "aria-expanded": "false" } } },
    { "_id": ids.cardSvcNum, "tag": "div", "classes": c('bf-split-card-num'), "children": [ids.cardSvcNumText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardSvcNumText, "text": true, "v": "2" },
    { "_id": ids.cardSvcInfo, "tag": "div", "classes": c('bf-split-card-info'), "children": [ids.cardSvcTitle, ids.cardSvcDesc], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardSvcTitle, "tag": "div", "classes": c('bf-split-card-title'), "children": [ids.cardSvcTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardSvcTitleText, "text": true, "v": "Service" },
    { "_id": ids.cardSvcDesc, "tag": "div", "classes": c('bf-split-card-desc'), "children": [ids.cardSvcDescText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardSvcDescText, "text": true, "v": "Wähle den Service aus" },
    { "_id": ids.cardSvcArrow, "tag": "div", "classes": c('bf-split-card-arrow'), "children": [ids.cardSvcArrowSvg], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.cardSvcArrowSvg, "tag": "svg", "classes": c('bf-split-card-arrow-svg'), "children": [ids.cardSvcArrowPolyline], "type": "Block", "data": { "tag": "svg", "attr": { "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" } } },
    { "_id": ids.cardSvcArrowPolyline, "tag": "polyline", "classes": [], "children": [], "type": "Block", "data": { "tag": "polyline", "attr": { "points": "6 9 12 15 18 9" } } },
    { "_id": ids.cardSvcBody, "tag": "div", "classes": c('bf-split-card-body'), "children": [ids.svcDynamic], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-panel": "service" } } },
    { "_id": ids.svcDynamic, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.svcEmpty, ids.svcSample], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "services" } } },
    { "_id": ids.svcEmpty, "tag": "p", "classes": c('bf-template-empty'), "children": [ids.svcEmptyText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-empty": "services", "style": "display: none;" } } },
    { "_id": ids.svcEmptyText, "text": true, "v": "Keine Services verfügbar." },
    { "_id": ids.svcSample, "tag": "div", "classes": c('bf-template-item'), "children": [ids.svcSampleMain, ids.svcSampleMeta], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "service-item" } } },
    { "_id": ids.svcSampleMain, "tag": "div", "classes": [], "children": [ids.svcSampleTitle, ids.svcSampleSub], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.svcSampleTitle, "tag": "div", "classes": c('bf-template-item-title'), "children": [ids.svcSampleTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.svcSampleTitleText, "text": true, "v": "Beispiel Service" },
    { "_id": ids.svcSampleSub, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.svcSampleSubText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.svcSampleSubText, "text": true, "v": "09:00-12:00 Uhr" },
    { "_id": ids.svcSampleMeta, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.svcSampleMetaText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.svcSampleMetaText, "text": true, "v": "120 Min. - EUR 49" },

    // Card: Staff
    { "_id": ids.cardStaff, "tag": "div", "classes": c('bf-split-card'), "children": [ids.cardStaffHeader, ids.cardStaffBody], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-card": "staff" } } },
    { "_id": ids.cardStaffHeader, "tag": "div", "classes": c('bf-split-card-header'), "children": [ids.cardStaffNum, ids.cardStaffInfo, ids.cardStaffArrow], "type": "Block", "data": { "tag": "button", "attr": { "type": "button", "aria-expanded": "false" } } },
    { "_id": ids.cardStaffNum, "tag": "div", "classes": c('bf-split-card-num'), "children": [ids.cardStaffNumText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardStaffNumText, "text": true, "v": "3" },
    { "_id": ids.cardStaffInfo, "tag": "div", "classes": c('bf-split-card-info'), "children": [ids.cardStaffTitle, ids.cardStaffDesc], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardStaffTitle, "tag": "div", "classes": c('bf-split-card-title'), "children": [ids.cardStaffTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardStaffTitleText, "text": true, "v": "Mitarbeiter" },
    { "_id": ids.cardStaffDesc, "tag": "div", "classes": c('bf-split-card-desc'), "children": [ids.cardStaffDescText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardStaffDescText, "text": true, "v": "Wähle deinen Mitarbeiter" },
    { "_id": ids.cardStaffArrow, "tag": "div", "classes": c('bf-split-card-arrow'), "children": [ids.cardStaffArrowSvg], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.cardStaffArrowSvg, "tag": "svg", "classes": c('bf-split-card-arrow-svg'), "children": [ids.cardStaffArrowPolyline], "type": "Block", "data": { "tag": "svg", "attr": { "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" } } },
    { "_id": ids.cardStaffArrowPolyline, "tag": "polyline", "classes": [], "children": [], "type": "Block", "data": { "tag": "polyline", "attr": { "points": "6 9 12 15 18 9" } } },
    { "_id": ids.cardStaffBody, "tag": "div", "classes": c('bf-split-card-body'), "children": [ids.staffDynamic], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-panel": "staff" } } },
    { "_id": ids.staffDynamic, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.staffEmpty, ids.staffSample], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "staff" } } },
    { "_id": ids.staffEmpty, "tag": "p", "classes": c('bf-template-empty'), "children": [ids.staffEmptyText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-empty": "staff", "style": "display: none;" } } },
    { "_id": ids.staffEmptyText, "text": true, "v": "Kein Mitarbeiter verfugbar." },
    { "_id": ids.staffSample, "tag": "div", "classes": c('bf-template-item'), "children": [ids.staffSampleMain], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "staff-item" } } },
    { "_id": ids.staffSampleMain, "tag": "div", "classes": [], "children": [ids.staffSampleTitle, ids.staffSampleSub], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.staffSampleTitle, "tag": "div", "classes": c('bf-template-item-title'), "children": [ids.staffSampleTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.staffSampleTitleText, "text": true, "v": "Naechstverfuegbaren" },
    { "_id": ids.staffSampleSub, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.staffSampleSubText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.staffSampleSubText, "text": true, "v": "Oder festen Mitarbeiter waehlen" },

    // Card: Addon
    { "_id": ids.cardAddon, "tag": "div", "classes": c('bf-split-card'), "children": [ids.cardAddonHeader, ids.cardAddonBody], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-card": "addon" } } },
    { "_id": ids.cardAddonHeader, "tag": "div", "classes": c('bf-split-card-header'), "children": [ids.cardAddonNum, ids.cardAddonInfo, ids.cardAddonArrow], "type": "Block", "data": { "tag": "button", "attr": { "type": "button", "aria-expanded": "false" } } },
    { "_id": ids.cardAddonNum, "tag": "div", "classes": c('bf-split-card-num'), "children": [ids.cardAddonNumText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardAddonNumText, "text": true, "v": "4" },
    { "_id": ids.cardAddonInfo, "tag": "div", "classes": c('bf-split-card-info'), "children": [ids.cardAddonTitle, ids.cardAddonDesc], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardAddonTitle, "tag": "div", "classes": c('bf-split-card-title'), "children": [ids.cardAddonTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardAddonTitleText, "text": true, "v": "Addon" },
    { "_id": ids.cardAddonDesc, "tag": "div", "classes": c('bf-split-card-desc'), "children": [ids.cardAddonDescText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cardAddonDescText, "text": true, "v": "Extras hinzufügen" },
    { "_id": ids.cardAddonArrow, "tag": "div", "classes": c('bf-split-card-arrow'), "children": [ids.cardAddonArrowSvg], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.cardAddonArrowSvg, "tag": "svg", "classes": c('bf-split-card-arrow-svg'), "children": [ids.cardAddonArrowPolyline], "type": "Block", "data": { "tag": "svg", "attr": { "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" } } },
    { "_id": ids.cardAddonArrowPolyline, "tag": "polyline", "classes": [], "children": [], "type": "Block", "data": { "tag": "polyline", "attr": { "points": "6 9 12 15 18 9" } } },
    { "_id": ids.cardAddonBody, "tag": "div", "classes": c('bf-split-card-body'), "children": [ids.guestCountBlock, ids.addonsDynamic], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-panel": "addon" } } },
    { "_id": ids.guestCountBlock, "tag": "div", "classes": c('bf-guest-count'), "children": [ids.guestCountTitle, ids.guestCountRow], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-static": "guest-count" } } },
    { "_id": ids.guestCountTitle, "tag": "p", "classes": [], "children": [ids.guestCountTitleStrong, ids.guestCountMaxText], "type": "Paragraph", "data": { "tag": "p" } },
    { "_id": ids.guestCountTitleStrong, "tag": "strong", "classes": [], "children": [ids.guestCountTitleText], "type": "Block", "data": { "tag": "strong" } },
    { "_id": ids.guestCountTitleText, "text": true, "v": "Anzahl Gäste" },
    { "_id": ids.guestCountMaxText, "tag": "small", "classes": [], "children": [], "type": "Block", "data": { "tag": "small", "attr": { "data-bf-display": "guest-max" } } },
    { "_id": ids.guestCountRow, "tag": "div", "classes": c('bf-qty-row'), "children": [ids.guestCountMinus, ids.guestCountValue, ids.guestCountPlus], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.guestCountMinus, "tag": "a", "classes": c('bf-qty-btn'), "children": [ids.guestCountMinusText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "gc-minus" } } },
    { "_id": ids.guestCountMinusText, "text": true, "v": "−" },
    { "_id": ids.guestCountValue, "tag": "span", "classes": c('bf-qty-val'), "children": [ids.guestCountValueText], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "guest-count" } } },
    { "_id": ids.guestCountValueText, "text": true, "v": "1" },
    { "_id": ids.guestCountPlus, "tag": "a", "classes": c('bf-qty-btn'), "children": [ids.guestCountPlusText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "gc-plus" } } },
    { "_id": ids.guestCountPlusText, "text": true, "v": "+" },
    { "_id": ids.addonsDynamic, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.addonsEmpty, ids.addonsSample], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "addons" } } },
    { "_id": ids.addonsEmpty, "tag": "p", "classes": c('bf-template-empty'), "children": [ids.addonsEmptyText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-empty": "addons", "style": "display: none;" } } },
    { "_id": ids.addonsEmptyText, "text": true, "v": "Keine Extras verfugbar." },
    { "_id": ids.addonsSample, "tag": "div", "classes": c('bf-template-item'), "children": [ids.addonsSampleMain, ids.addonsSamplePrice], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "addon-item" } } },
    { "_id": ids.addonsSampleMain, "tag": "div", "classes": c('bf-template-item-title'), "children": [ids.addonsSampleMainText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.addonsSampleMainText, "text": true, "v": "Beispiel Extra" },
    { "_id": ids.addonsSamplePrice, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.addonsSamplePriceText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.addonsSamplePriceText, "text": true, "v": "+ EUR 15" },

    // -- RIGHT SIDE --
    { "_id": ids.splitRight, "tag": "div", "classes": c('bf-split-right'), "children": [ids.calDynamic, ids.slotsDynamic, ids.dateInfoContainer], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.calDynamic, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.calEmpty, ids.calSampleHeader, ids.calSampleGrid], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "calendar" } } },
    { "_id": ids.calEmpty, "tag": "p", "classes": c('bf-template-empty'), "children": [ids.calEmptyText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-empty": "calendar", "style": "display: none;" } } },
    { "_id": ids.calEmptyText, "text": true, "v": "Kalender wird nach Auswahl geladen." },
    { "_id": ids.calSampleHeader, "tag": "div", "classes": c('bf-template-item-title'), "children": [ids.calSampleHeaderText], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "calendar-header" } } },
    { "_id": ids.calSampleHeaderText, "text": true, "v": "April 2026" },
    { "_id": ids.calSampleGrid, "tag": "div", "classes": c('bf-template-item'), "children": [ids.calSampleDay], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "calendar-day" } } },
    { "_id": ids.calSampleDay, "tag": "span", "classes": c('bf-template-item-sub'), "children": [ids.calSampleDayText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.calSampleDayText, "text": true, "v": "15" },
    { "_id": ids.slotsDynamic, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.slotsEmpty, ids.slotsSampleWrap], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "timeslots" } } },
    { "_id": ids.slotsEmpty, "tag": "p", "classes": c('bf-template-empty'), "children": [ids.slotsEmptyText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-empty": "timeslots", "style": "display: none;" } } },
    { "_id": ids.slotsEmptyText, "text": true, "v": "Keine freien Termine an diesem Tag." },
    { "_id": ids.slotsSampleWrap, "tag": "div", "classes": c('bf-template-item'), "children": [ids.slotsSampleTitle, ids.slotsSampleDesc, ids.slotsSampleItem], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-template": "timeslot-item" } } },
    { "_id": ids.slotsSampleTitle, "tag": "div", "classes": c('bf-template-item-title'), "children": [ids.slotsSampleTitleText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.slotsSampleTitleText, "text": true, "v": "Uhrzeit" },
    { "_id": ids.slotsSampleDesc, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.slotsSampleDescText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.slotsSampleDescText, "text": true, "v": "Waehle einen passenden Slot" },
    { "_id": ids.slotsSampleItem, "tag": "div", "classes": c('bf-template-item-sub'), "children": [ids.slotsSampleItemText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.slotsSampleItemText, "text": true, "v": "10:00" },
    { "_id": ids.dateInfoContainer, "tag": "div", "classes": c('bf-dateinfo'), "children": [ids.dateInfoText, ids.availStatus], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "dateinfo" } } },
    { "_id": ids.dateInfoText, "tag": "div", "classes": [], "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-static": "dateinfo-text" } } },
    { "_id": ids.availStatus, "tag": "p", "classes": c('bf-avail-status'), "children": [ids.availChecking, ids.availAvailable, ids.availUnavailable], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-static": "avail-status", "style": "display: none;" } } },
    { "_id": ids.availChecking, "tag": "span", "classes": [], "children": [ids.availCheckingText], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-status": "checking", "style": "display: none;" } } },
    { "_id": ids.availCheckingText, "text": true, "v": "Prüfe Verfügbarkeit..." },
    { "_id": ids.availAvailable, "tag": "span", "classes": [], "children": [ids.availAvailableText], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-status": "available", "style": "display: none;" } } },
    { "_id": ids.availAvailableText, "text": true, "v": "Verfügbar" },
    { "_id": ids.availUnavailable, "tag": "span", "classes": [], "children": [ids.availUnavailableText], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-status": "unavailable", "style": "display: none;" } } },
    { "_id": ids.availUnavailableText, "text": true, "v": "Nicht verfügbar" },

    // Footer Step 1
    { "_id": ids.footer1, "tag": "div", "classes": c('bf-split-footer'), "children": [ids.footer1Next], "type": "Block", "data": { "tag": "nav" } },
    { "_id": ids.footer1Next, "tag": "a", "classes": c('bf-split-btn-next'), "children": [ids.footer1NextText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "next", "data-bf-goto": "2" } } },
    { "_id": ids.footer1NextText, "text": true, "v": "Weiter" },

    // ===== STEP 2: Summary + Form =====
    { "_id": ids.step2, "tag": "div", "classes": c('bf-step'), "children": [ids.step2Layout, ids.footer2], "type": "Block", "data": { "tag": "section", "attr": { "data-bf-step": "2", "aria-label": "Zusammenfassung" } } },
    { "_id": ids.step2Layout, "tag": "div", "classes": c('bf-step2-layout'), "children": [ids.step2Left, ids.step2Right], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step2Left, "tag": "div", "classes": c('bf-step2-left'), "children": [ids.step2LeftHeader, ids.step2FormWrap, ids.voucherSection], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step2LeftHeader, "tag": "div", "classes": c('bf-step2-header'), "children": [ids.step2Title, ids.step2Counter], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step2Title, "tag": "h2", "classes": c('bf-step-title'), "children": [ids.step2TitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.step2TitleText, "text": true, "v": "Persönliche Angaben" },
    { "_id": ids.step2Counter, "tag": "p", "classes": c('bf-step-counter'), "children": [ids.step2CounterText], "type": "Paragraph", "data": { "tag": "p" } },
    { "_id": ids.step2CounterText, "text": true, "v": "Schritt 2/2" },
    { "_id": ids.step2FormWrap, "tag": "div", "classes": c('bf-step2-form'), "children": [ids.summaryContainer], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.summaryContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [ids.summaryGrid], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "summary" } } },
    { "_id": ids.summaryGrid, "tag": "div", "classes": c('bf-grid-2'), "children": [ids.fnameGroup, ids.lnameGroup, ids.emailGroup, ids.phoneGroup, ids.streetGroup, ids.houseGroup, ids.zipGroup, ids.cityGroup], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-static": "summary-grid" } } },
    { "_id": ids.fnameGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.fnameLabel, ids.fnameInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.fnameLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.fnameLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-fname" } } },
    { "_id": ids.fnameLabelText, "text": true, "v": "Vorname" },
    { "_id": ids.fnameInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "fname" }, "attr": { "type": "text", "id": "bf-fname", "name": "fname", "placeholder": "Max", "data-bf-bind": "fname" } } },
    { "_id": ids.lnameGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.lnameLabel, ids.lnameInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.lnameLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.lnameLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-lname" } } },
    { "_id": ids.lnameLabelText, "text": true, "v": "Nachname" },
    { "_id": ids.lnameInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "lname" }, "attr": { "type": "text", "id": "bf-lname", "name": "lname", "placeholder": "Mustermann", "data-bf-bind": "lname" } } },
    { "_id": ids.emailGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.emailLabel, ids.emailInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.emailLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.emailLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-email" } } },
    { "_id": ids.emailLabelText, "text": true, "v": "E-Mail Adresse" },
    { "_id": ids.emailInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "email" }, "attr": { "type": "email", "id": "bf-email", "name": "email", "placeholder": "max@beispiel.de", "data-bf-bind": "email" } } },
    { "_id": ids.phoneGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.phoneLabel, ids.phoneInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.phoneLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.phoneLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-phone" } } },
    { "_id": ids.phoneLabelText, "text": true, "v": "Telefonnummer" },
    { "_id": ids.phoneInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "phone" }, "attr": { "type": "tel", "id": "bf-phone", "name": "phone", "placeholder": "+49 123 59492354", "data-bf-bind": "phone" } } },
    { "_id": ids.streetGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.streetLabel, ids.streetInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.streetLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.streetLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-street" } } },
    { "_id": ids.streetLabelText, "text": true, "v": "Straße" },
    { "_id": ids.streetInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "street" }, "attr": { "type": "text", "id": "bf-street", "name": "street", "placeholder": "Musterstraße", "data-bf-bind": "street" } } },
    { "_id": ids.houseGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.houseLabel, ids.houseInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.houseLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.houseLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-house" } } },
    { "_id": ids.houseLabelText, "text": true, "v": "Hausnummer" },
    { "_id": ids.houseInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "houseNumber" }, "attr": { "type": "text", "id": "bf-house", "name": "houseNumber", "placeholder": "74", "data-bf-bind": "houseNumber" } } },
    { "_id": ids.zipGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.zipLabel, ids.zipInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.zipLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.zipLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-zip" } } },
    { "_id": ids.zipLabelText, "text": true, "v": "PLZ" },
    { "_id": ids.zipInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "zip" }, "attr": { "type": "text", "id": "bf-zip", "name": "zip", "placeholder": "12345", "data-bf-bind": "zip" } } },
    { "_id": ids.cityGroup, "tag": "div", "classes": c('bf-form-group'), "children": [ids.cityLabel, ids.cityInput], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.cityLabel, "tag": "label", "classes": c('bf-form-label'), "children": [ids.cityLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "bf-city" } } },
    { "_id": ids.cityLabelText, "text": true, "v": "Stadt" },
    { "_id": ids.cityInput, "tag": "input", "classes": c('bf-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "city" }, "attr": { "type": "text", "id": "bf-city", "name": "city", "placeholder": "Berlin", "data-bf-bind": "city" } } },
    { "_id": ids.voucherSection, "tag": "div", "classes": c('bf-step2-section'), "children": [ids.voucherHeader, ids.voucherRow], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.voucherHeader, "tag": "div", "classes": c('bf-step2-voucher-wrap'), "children": [ids.voucherLabel, ids.voucherHelp], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.voucherLabel, "tag": "p", "classes": c('bf-label'), "children": [ids.voucherLabelText], "type": "Paragraph", "data": { "tag": "p" } },
    { "_id": ids.voucherLabelText, "text": true, "v": "Gutschein" },
    { "_id": ids.voucherHelp, "tag": "p", "classes": c('bf-voucher-help'), "children": [ids.voucherHelpText], "type": "Paragraph", "data": { "tag": "p" } },
    { "_id": ids.voucherHelpText, "text": true, "v": "Wähle deine passende Uhrzeit aus." },
    { "_id": ids.voucherRow, "tag": "div", "classes": c('bf-step2-voucher-wrap'), "children": [ids.voucherInputRow, ids.voucherStatus], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.voucherInputRow, "tag": "div", "classes": c('bf-voucher-row'), "children": [ids.voucherInput, ids.voucherBtn], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.voucherInput, "tag": "input", "classes": c('bf-voucher-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "voucher" }, "attr": { "type": "text", "name": "voucher", "placeholder": "BookFast15", "id": "voucher", "data-bf-field": "voucher" } } },
    { "_id": ids.voucherBtn, "tag": "a", "classes": c('bf-btn-voucher'), "children": [ids.voucherBtnText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "apply-voucher" } } },
    { "_id": ids.voucherBtnText, "text": true, "v": "Einlösen" },
    { "_id": ids.voucherStatus, "tag": "div", "classes": c('bf-voucher-status-box'), "children": [ids.voucherValid, ids.voucherInvalid, ids.voucherChecking], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-display": "voucher-status" } } },
    { "_id": ids.voucherValid, "tag": "p", "classes": [], "children": [ids.voucherValidText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-voucher": "valid", "style": "display: none;" } } },
    { "_id": ids.voucherValidText, "text": true, "v": "Dein Gutschein wurde erfolgreich angewendet" },
    { "_id": ids.voucherInvalid, "tag": "p", "classes": [], "children": [ids.voucherInvalidText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-voucher": "invalid", "style": "display: none;" } } },
    { "_id": ids.voucherInvalidText, "text": true, "v": "Ungültiger Code" },
    { "_id": ids.voucherChecking, "tag": "p", "classes": [], "children": [ids.voucherCheckingText], "type": "Paragraph", "data": { "tag": "p", "attr": { "data-bf-voucher": "checking", "style": "display: none;" } } },
    { "_id": ids.voucherCheckingText, "text": true, "v": "Wird geprüft..." },
    { "_id": ids.step2Right, "tag": "div", "classes": c('bf-step2-right'), "children": [ids.summaryColumn], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.summaryColumn, "tag": "div", "classes": c('bf-summary-column'), "children": [ids.summaryColumnHeader, ids.summaryDetailsWrap], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.summaryColumnHeader, "tag": "div", "classes": c('bf-step2-header'), "children": [ids.summaryColumnTitle], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.summaryColumnTitle, "tag": "h3", "classes": c('bf-step-title'), "children": [ids.summaryColumnTitleText], "type": "Heading", "data": { "tag": "h3" } },
    { "_id": ids.summaryColumnTitleText, "text": true, "v": "Deine Buchungsübersicht" },
    { "_id": ids.summaryDetailsWrap, "tag": "div", "classes": c('bf-step2-section'), "children": [ids.summaryDetails, ids.summaryDivider, ids.summaryPrices, ids.totalDisplay], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.summaryDetails, "tag": "div", "classes": c('bf-step2-summary-wrap').concat(c('bf-summary-details')), "children": [ids.sumRowObject, ids.sumRowService, ids.sumRowAddon, ids.sumRowStaff, ids.sumRowGuests, ids.sumRowDate, ids.sumRowTime], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "summary-details" } } },
    { "_id": ids.sumRowObject, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowObjectLabel, ids.sumRowObjectValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "object" } } },
    { "_id": ids.sumRowObjectLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowObjectLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowObjectLabelText, "text": true, "v": "Objekt" },
    { "_id": ids.sumRowObjectValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-object" } } },
    { "_id": ids.sumRowService, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowServiceLabel, ids.sumRowServiceValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "service" } } },
    { "_id": ids.sumRowServiceLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowServiceLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowServiceLabelText, "text": true, "v": "Service" },
    { "_id": ids.sumRowServiceValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-service" } } },
    { "_id": ids.sumRowAddon, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowAddonLabel, ids.sumRowAddonValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "addon" } } },
    { "_id": ids.sumRowAddonLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowAddonLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowAddonLabelText, "text": true, "v": "Addon" },
    { "_id": ids.sumRowAddonValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-addon" } } },
    { "_id": ids.sumRowStaff, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowStaffLabel, ids.sumRowStaffValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "staff" } } },
    { "_id": ids.sumRowStaffLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowStaffLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowStaffLabelText, "text": true, "v": "Mitarbeiter" },
    { "_id": ids.sumRowStaffValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-staff" } } },
    { "_id": ids.sumRowGuests, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowGuestsLabel, ids.sumRowGuestsValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "guests" } } },
    { "_id": ids.sumRowGuestsLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowGuestsLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowGuestsLabelText, "text": true, "v": "Anzahl der Gäste" },
    { "_id": ids.sumRowGuestsValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-guests" } } },
    { "_id": ids.sumRowDate, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowDateLabel, ids.sumRowDateValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "date" } } },
    { "_id": ids.sumRowDateLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowDateLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowDateLabelText, "text": true, "v": "Datum" },
    { "_id": ids.sumRowDateValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-date" } } },
    { "_id": ids.sumRowTime, "tag": "div", "classes": c('bf-summary-row'), "children": [ids.sumRowTimeLabel, ids.sumRowTimeValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "time" } } },
    { "_id": ids.sumRowTimeLabel, "tag": "span", "classes": c('bf-summary-label'), "children": [ids.sumRowTimeLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowTimeLabelText, "text": true, "v": "Uhrzeit" },
    { "_id": ids.sumRowTimeValue, "tag": "span", "classes": c('bf-summary-value'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-time" } } },
    { "_id": ids.summaryDivider, "tag": "div", "classes": c('bf-summary-divider'), "children": [], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.summaryPrices, "tag": "div", "classes": c('bf-step2-summary-wrap').concat(c('bf-price-rows')), "children": [ids.sumRowSubtotal, ids.sumRowDiscount, ids.sumRowTax, ids.priceRows], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "summary-prices" } } },
    { "_id": ids.sumRowSubtotal, "tag": "div", "classes": c('bf-summary-row-muted'), "children": [ids.sumRowSubtotalLabel, ids.sumRowSubtotalValue], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.sumRowSubtotalLabel, "tag": "span", "classes": c('bf-summary-label-muted'), "children": [ids.sumRowSubtotalLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowSubtotalLabelText, "text": true, "v": "Subtotel" },
    { "_id": ids.sumRowSubtotalValue, "tag": "span", "classes": c('bf-summary-value-muted'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-subtotal" } } },
    { "_id": ids.sumRowDiscount, "tag": "div", "classes": c('bf-summary-row-muted'), "children": [ids.sumRowDiscountLabel, ids.sumRowDiscountValue], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.sumRowDiscountLabel, "tag": "span", "classes": c('bf-summary-label-muted'), "children": [ids.sumRowDiscountLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowDiscountLabelText, "text": true, "v": "Discount" },
    { "_id": ids.sumRowDiscountValue, "tag": "span", "classes": c('bf-summary-value-muted'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-discount" } } },
    { "_id": ids.sumRowTax, "tag": "div", "classes": c('bf-summary-row-muted'), "children": [ids.sumRowTaxLabel, ids.sumRowTaxValue], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.sumRowTaxLabel, "tag": "span", "classes": c('bf-summary-label-muted'), "children": [ids.sumRowTaxLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowTaxLabelText, "text": true, "v": "Steuer 19 %" },
    { "_id": ids.sumRowTaxValue, "tag": "span", "classes": c('bf-summary-value-muted'), "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-tax" } } },
    { "_id": ids.priceRows, "tag": "div", "classes": [], "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "price-rows", "style": "display: none;" } } },
    { "_id": ids.totalDisplay, "tag": "div", "classes": c('bf-step2-summary-wrap').concat(c('bf-total-display')), "children": [ids.totalLabel, ids.totalValue], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-summary": "total" } } },
    { "_id": ids.totalLabel, "tag": "span", "classes": c('bf-total-label'), "children": [ids.totalLabelText], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.totalLabelText, "text": true, "v": "Gesamtpreis" },
    { "_id": ids.totalValue, "tag": "span", "classes": c('bf-total-value'), "children": [ids.sumRowTotalValue], "type": "Block", "data": { "tag": "span" } },
    { "_id": ids.sumRowTotalValue, "tag": "span", "classes": [], "children": [], "type": "Block", "data": { "tag": "span", "attr": { "data-bf-display": "summary-total" } } },
    { "_id": ids.submitBtn, "tag": "input", "classes": c('bf-submit'), "children": [], "type": "FormButton", "data": { "form": { "type": "button", "wait": "Wird gesendet..." }, "attr": { "type": "submit", "value": "Buchung anfragen", "data-bf-action": "submit" } } },
    { "_id": ids.footer2, "tag": "div", "classes": c('bf-split-footer'), "children": [ids.footer2Back, ids.submitBtn], "type": "Block", "data": { "tag": "nav" } },
    { "_id": ids.footer2Back, "tag": "a", "classes": c('bf-split-btn-back'), "children": [ids.footer2BackText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "back", "data-bf-goto": "1" } } },
    { "_id": ids.footer2BackText, "text": true, "v": "Zurück" },

    // ===== SUCCESS =====
    { "_id": ids.stepSuccess, "tag": "div", "classes": c('bf-success'), "children": [ids.successIcon, ids.successTitle, ids.successDesc], "type": "Block", "data": { "tag": "section", "attr": { "data-bf-step": "success", "role": "status", "aria-label": "Buchung erfolgreich" } } },
    { "_id": ids.successIcon, "tag": "div", "classes": c('bf-success-icon'), "children": [ids.successIconText], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.successIconText, "text": true, "v": "🎉" },
    { "_id": ids.successTitle, "tag": "h2", "classes": c('bf-success-title'), "children": [ids.successTitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.successTitleText, "text": true, "v": "Buchungsanfrage erhalten!" },
    { "_id": ids.successDesc, "tag": "p", "classes": c('bf-success-desc'), "children": [ids.successDescText], "type": "Paragraph", "data": {} },
    { "_id": ids.successDescText, "text": true, "v": "Wir werden Ihre Anfrage prüfen und Sie per E-Mail kontaktieren." },

    // Webflow form messages
    { "_id": ids.successMsg, "tag": "div", "classes": [], "children": [ids.successMsgText], "type": "FormSuccessMessage", "data": { "form": { "type": "msg-done" } } },
    { "_id": ids.successMsgText, "text": true, "v": "Vielen Dank! Ihre Buchung wurde erfolgreich übermittelt." },
    { "_id": ids.errorMsg, "tag": "div", "classes": [], "children": [ids.errorMsgText], "type": "FormErrorMessage", "data": { "form": { "type": "msg-fail" } } },
    { "_id": ids.errorMsgText, "text": true, "v": "Hoppla! Beim Absenden ist ein Fehler aufgetreten." }
  ];

  return {
    "type": "@webflow/XscpData",
    "payload": { "nodes": nodes, "styles": styleDefs, "assets": [], "ix1": [], "ix2": { "interactions": [], "events": [], "actionLists": [] } },
    "meta": { "unlinkedSymbolCount": 0, "droppedLinks": 0, "dynBindRemovedCount": 0, "dynListBindRemovedCount": 0, "paginationRemovedCount": 0 }
  };
};

export const copyWebflowTemplate = async () => {
  const template = getWebflowTemplate();
  const jsonString = JSON.stringify(template);

  return new Promise((resolve, reject) => {
    const onCopy = (e) => {
      e.preventDefault();
      try {
        e.clipboardData.setData('application/json', jsonString);
        e.clipboardData.setData('text/plain', jsonString);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    const dummy = document.createElement('textarea');
    dummy.style.position = 'fixed';
    dummy.style.left = '-100vw';
    dummy.style.top = '0';
    document.body.appendChild(dummy);
    dummy.focus();
    dummy.select();

    document.addEventListener('copy', onCopy, { once: true });

    try {
      const successful = document.execCommand('copy');
      if (!successful) throw new Error('execCommand returned false');
    } catch (err) {
      document.removeEventListener('copy', onCopy);
      reject(err);
    } finally {
      document.body.removeChild(dummy);
    }
  });
};
