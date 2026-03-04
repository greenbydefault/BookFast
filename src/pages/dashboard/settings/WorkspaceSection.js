/**
 * Settings - Workspace Section (Company Details)
 * Unified checklist-style layout with per-field auto-save.
 * Each row is both a checklist item AND an editable input with inline spinner/checkmark.
 */
import { getState } from '../../../lib/store.js';
import { updateEntity, invalidateCache } from '../../../lib/dataLayer.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { refreshWorkspace } from './settingsHelpers.js';
import { uploadWorkspaceLogo, removeWorkspaceLogo } from '../../../lib/services/workspaceService.js';

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
  const defaultSiteId = sites.length > 0 ? sites[0].id : (ws.id || 'YOUR_SITE_ID');
  const activeSite = sites.find(s => s.is_active);
  const workspaceName = workspaceUiState.workspaceName || ws.company_name || ws.name || 'Massagegold Berlin Tegel';
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
                <button type="button" class="workspace-action-btn" data-copy-embed data-embed-code="<script src='${window.location.origin}/embed.js' data-site-id='${defaultSiteId}'></script>">Code kopieren</button>
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
                  : `<span class="workspace-domain-value--empty">Noch nicht verbunden</span>`
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
                <button type="button" class="workspace-action-btn" data-copy-embed data-embed-code="<script src='${window.location.origin}/embed.js' data-site-id='${defaultSiteId}'></script>">Code kopieren</button>
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

  const workspaceNameInput = container.querySelector('[data-workspace-name-input]');
  if (workspaceNameInput) {
    workspaceNameInput.addEventListener('input', (e) => {
      workspaceUiState.workspaceName = e.target.value;
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
  workspaceUiState.workspaceName = ws.company_name || ws.name || 'Massagegold Berlin Tegel';
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

  // --- Webflow class definitions (appear in Designer's style panel) ---
  const cls = {};
  const styleDefs = [];
  const defClass = (name, styleLess) => {
    const id = mongoId();
    cls[name] = id;
    styleDefs.push({ "_id": id, "fake": false, "type": "class", "name": name, "namespace": "", "comb": "", "styleLess": styleLess });
    return id;
  };

  defClass('bf-root', 'max-width: 640px; margin-left: auto; margin-right: auto; font-family: inherit;');
  defClass('bf-form', 'display: flex; flex-direction: column;');
  defClass('bf-step', 'padding-top: 20px; padding-bottom: 20px;');
  defClass('bf-step-title', 'font-size: 1.25rem; font-weight: 600; margin-bottom: 1.25rem; margin-top: 0;');
  defClass('bf-label', 'display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: 0.5rem;');
  defClass('bf-select', 'width: 100%; padding-top: 0.6rem; padding-bottom: 0.6rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: #d1d5db; border-bottom-color: #d1d5db; border-left-color: #d1d5db; border-right-color: #d1d5db; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-size: 1rem; background-color: #fff; margin-bottom: 1rem;');
  defClass('bf-dynamic-area', 'margin-top: 0.75rem; margin-bottom: 0.75rem; min-height: 40px;');
  defClass('bf-nav', 'display: flex; align-items: center; gap: 12px; margin-top: 1.5rem;');
  defClass('bf-btn-next', 'display: inline-block; padding-top: 0.65rem; padding-bottom: 0.65rem; padding-left: 1.5rem; padding-right: 1.5rem; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-weight: 600; font-size: 0.95rem; text-decoration: none; cursor: pointer; background-color: #18181b; color: #fff;');
  defClass('bf-btn-back', 'display: inline-block; padding-top: 0.65rem; padding-bottom: 0.65rem; padding-left: 1.25rem; padding-right: 1.25rem; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-weight: 500; font-size: 0.95rem; text-decoration: none; cursor: pointer; background-color: transparent; color: #71717a;');
  defClass('bf-voucher-row', 'display: flex; align-items: center; gap: 8px; margin-top: 0.75rem; margin-bottom: 0.5rem;');
  defClass('bf-voucher-input', 'flex-grow: 1; padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 0.75rem; padding-right: 0.75rem; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: #d1d5db; border-bottom-color: #d1d5db; border-left-color: #d1d5db; border-right-color: #d1d5db; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-size: 0.95rem;');
  defClass('bf-btn-voucher', 'display: inline-block; padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-right: 1rem; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-weight: 500; font-size: 0.9rem; text-decoration: none; cursor: pointer; background-color: #f4f4f5; color: #18181b;');
  defClass('bf-total-display', 'margin-top: 0.75rem; font-size: 1.1rem; font-weight: 600;');
  defClass('bf-submit', 'width: 100%; padding-top: 0.75rem; padding-bottom: 0.75rem; border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-weight: 600; font-size: 1rem; cursor: pointer; background-color: #18181b; color: #fff; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-right-width: 0px; margin-top: 1rem;');
  defClass('bf-success', 'text-align: center; padding-top: 3rem; padding-bottom: 3rem;');
  defClass('bf-success-icon', 'font-size: 3rem; margin-bottom: 1rem;');
  defClass('bf-success-title', 'font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0;');
  defClass('bf-success-desc', 'color: #71717a; font-size: 1rem; margin-top: 0;');

  const c = (name) => [cls[name]];

  const ids = {
    root: mongoId(), form: mongoId(),
    step1: mongoId(), step1Title: mongoId(), step1TitleText: mongoId(),
    objectLabel: mongoId(), objectLabelText: mongoId(), objectSelect: mongoId(),
    objectPlaceholder: mongoId(), objectPlaceholderText: mongoId(),
    step1Nav: mongoId(), step1Btn: mongoId(), step1BtnText: mongoId(),
    step2: mongoId(), step2Title: mongoId(), step2TitleText: mongoId(),
    servicesContainer: mongoId(), staffContainer: mongoId(),
    step2Nav: mongoId(), step2BtnNext: mongoId(), step2BtnNextText: mongoId(),
    step2BtnBack: mongoId(), step2BtnBackText: mongoId(),
    step3: mongoId(), step3Title: mongoId(), step3TitleText: mongoId(),
    calendarContainer: mongoId(), timeslotsContainer: mongoId(), dateInfoContainer: mongoId(),
    step3Nav: mongoId(), step3BtnNext: mongoId(), step3BtnNextText: mongoId(),
    step3BtnBack: mongoId(), step3BtnBackText: mongoId(),
    step4: mongoId(), step4Title: mongoId(), step4TitleText: mongoId(),
    addonsContainer: mongoId(),
    step4Nav: mongoId(), step4BtnNext: mongoId(), step4BtnNextText: mongoId(),
    step4BtnBack: mongoId(), step4BtnBackText: mongoId(),
    step5: mongoId(), step5Title: mongoId(), step5TitleText: mongoId(),
    summaryContainer: mongoId(),
    voucherRow: mongoId(), voucherLabel: mongoId(), voucherLabelText: mongoId(), voucherInput: mongoId(),
    voucherBtn: mongoId(), voucherBtnText: mongoId(), voucherStatus: mongoId(),
    totalDisplay: mongoId(), submitBtn: mongoId(),
    step5Nav: mongoId(), step5BtnBack: mongoId(), step5BtnBackText: mongoId(),
    stepSuccess: mongoId(),
    successIcon: mongoId(), successIconText: mongoId(),
    successTitle: mongoId(), successTitleText: mongoId(),
    successDesc: mongoId(), successDescText: mongoId(),
    successMsg: mongoId(), successMsgText: mongoId(),
    errorMsg: mongoId(), errorMsgText: mongoId()
  };

  const nodes = [
    // Root & Form
    { "_id": ids.root, "tag": "div", "classes": c('bf-root'), "children": [ids.form, ids.successMsg, ids.errorMsg], "type": "FormWrapper", "data": { "form": { "type": "wrapper" }, "attr": { "data-bf-root": "true" } } },
    { "_id": ids.form, "tag": "form", "classes": c('bf-form'), "children": [ids.step1, ids.step2, ids.step3, ids.step4, ids.step5, ids.stepSuccess], "type": "FormForm", "data": { "form": { "type": "form", "name": "booking-form" }, "attr": { "name": "booking-form", "data-name": "Booking Form" } } },

    // Step 1: Object
    { "_id": ids.step1, "tag": "div", "classes": c('bf-step'), "children": [ids.step1Title, ids.objectLabel, ids.objectSelect, ids.step1Nav], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-step": "1" } } },
    { "_id": ids.step1Title, "tag": "h2", "classes": c('bf-step-title'), "children": [ids.step1TitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.step1TitleText, "text": true, "v": "Objekt wählen" },
    { "_id": ids.objectLabel, "tag": "label", "classes": c('bf-label'), "children": [ids.objectLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "object" } } },
    { "_id": ids.objectLabelText, "text": true, "v": "Objekt wählen" },
    { "_id": ids.objectSelect, "tag": "select", "classes": c('bf-select'), "children": [ids.objectPlaceholder], "type": "FormSelect", "data": { "form": { "type": "select", "name": "object" }, "attr": { "name": "object", "id": "object", "data-bf-field": "object", "data-bf-dynamic": "objects", "required": true } } },
    { "_id": ids.objectPlaceholder, "tag": "option", "classes": [], "children": [ids.objectPlaceholderText], "type": "FormSelectOption", "data": { "form": { "type": "select-option" }, "attr": { "value": "" } } },
    { "_id": ids.objectPlaceholderText, "text": true, "v": "Bitte wählen..." },
    { "_id": ids.step1Nav, "tag": "div", "classes": c('bf-nav'), "children": [ids.step1Btn], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step1Btn, "tag": "a", "classes": c('bf-btn-next'), "children": [ids.step1BtnText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "next", "data-bf-goto": "2" } } },
    { "_id": ids.step1BtnText, "text": true, "v": "Weiter" },

    // Step 2: Service
    { "_id": ids.step2, "tag": "div", "classes": c('bf-step'), "children": [ids.step2Title, ids.servicesContainer, ids.staffContainer, ids.step2Nav], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-step": "2", "style": "display: none;" } } },
    { "_id": ids.step2Title, "tag": "h2", "classes": c('bf-step-title'), "children": [ids.step2TitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.step2TitleText, "text": true, "v": "Service wählen" },
    { "_id": ids.servicesContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "services" } } },
    { "_id": ids.staffContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "staff", "style": "display: none;" } } },
    { "_id": ids.step2Nav, "tag": "div", "classes": c('bf-nav'), "children": [ids.step2BtnNext, ids.step2BtnBack], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step2BtnNext, "tag": "a", "classes": c('bf-btn-next'), "children": [ids.step2BtnNextText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "next", "data-bf-goto": "3" } } },
    { "_id": ids.step2BtnNextText, "text": true, "v": "Weiter" },
    { "_id": ids.step2BtnBack, "tag": "a", "classes": c('bf-btn-back'), "children": [ids.step2BtnBackText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "back", "data-bf-goto": "1" } } },
    { "_id": ids.step2BtnBackText, "text": true, "v": "Zurück" },

    // Step 3: Date & Time
    { "_id": ids.step3, "tag": "div", "classes": c('bf-step'), "children": [ids.step3Title, ids.calendarContainer, ids.timeslotsContainer, ids.dateInfoContainer, ids.step3Nav], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-step": "3", "style": "display: none;" } } },
    { "_id": ids.step3Title, "tag": "h2", "classes": c('bf-step-title'), "children": [ids.step3TitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.step3TitleText, "text": true, "v": "Datum & Zeit" },
    { "_id": ids.calendarContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "calendar" } } },
    { "_id": ids.timeslotsContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "timeslots", "style": "display: none;" } } },
    { "_id": ids.dateInfoContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "dateinfo" } } },
    { "_id": ids.step3Nav, "tag": "div", "classes": c('bf-nav'), "children": [ids.step3BtnNext, ids.step3BtnBack], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step3BtnNext, "tag": "a", "classes": c('bf-btn-next'), "children": [ids.step3BtnNextText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "next", "data-bf-goto": "4" } } },
    { "_id": ids.step3BtnNextText, "text": true, "v": "Weiter" },
    { "_id": ids.step3BtnBack, "tag": "a", "classes": c('bf-btn-back'), "children": [ids.step3BtnBackText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "back", "data-bf-goto": "2" } } },
    { "_id": ids.step3BtnBackText, "text": true, "v": "Zurück" },

    // Step 4: Addons
    { "_id": ids.step4, "tag": "div", "classes": c('bf-step'), "children": [ids.step4Title, ids.addonsContainer, ids.step4Nav], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-step": "4", "style": "display: none;" } } },
    { "_id": ids.step4Title, "tag": "h2", "classes": c('bf-step-title'), "children": [ids.step4TitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.step4TitleText, "text": true, "v": "Extras hinzufügen" },
    { "_id": ids.addonsContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "addons" } } },
    { "_id": ids.step4Nav, "tag": "div", "classes": c('bf-nav'), "children": [ids.step4BtnNext, ids.step4BtnBack], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step4BtnNext, "tag": "a", "classes": c('bf-btn-next'), "children": [ids.step4BtnNextText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "next", "data-bf-goto": "5" } } },
    { "_id": ids.step4BtnNextText, "text": true, "v": "Weiter" },
    { "_id": ids.step4BtnBack, "tag": "a", "classes": c('bf-btn-back'), "children": [ids.step4BtnBackText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "back", "data-bf-goto": "3" } } },
    { "_id": ids.step4BtnBackText, "text": true, "v": "Zurück" },

    // Step 5: Summary
    { "_id": ids.step5, "tag": "div", "classes": c('bf-step'), "children": [ids.step5Title, ids.summaryContainer, ids.voucherLabel, ids.voucherRow, ids.voucherStatus, ids.totalDisplay, ids.submitBtn, ids.step5Nav], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-step": "5", "style": "display: none;" } } },
    { "_id": ids.step5Title, "tag": "h2", "classes": c('bf-step-title'), "children": [ids.step5TitleText], "type": "Heading", "data": { "tag": "h2" } },
    { "_id": ids.step5TitleText, "text": true, "v": "Zusammenfassung" },
    { "_id": ids.summaryContainer, "tag": "div", "classes": c('bf-dynamic-area'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-dynamic": "summary" } } },
    { "_id": ids.voucherLabel, "tag": "label", "classes": c('bf-label'), "children": [ids.voucherLabelText], "type": "FormBlockLabel", "data": { "form": { "type": "label" }, "attr": { "for": "voucher" } } },
    { "_id": ids.voucherLabelText, "text": true, "v": "Gutscheincode" },
    { "_id": ids.voucherRow, "tag": "div", "classes": c('bf-voucher-row'), "children": [ids.voucherInput, ids.voucherBtn], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.voucherInput, "tag": "input", "classes": c('bf-voucher-input'), "children": [], "type": "FormTextInput", "data": { "form": { "type": "input", "name": "voucher" }, "attr": { "type": "text", "name": "voucher", "placeholder": "Code eingeben", "id": "voucher", "data-bf-field": "voucher" } } },
    { "_id": ids.voucherBtn, "tag": "a", "classes": c('bf-btn-voucher'), "children": [ids.voucherBtnText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "apply-voucher" } } },
    { "_id": ids.voucherBtnText, "text": true, "v": "Einlösen" },
    { "_id": ids.voucherStatus, "tag": "div", "classes": [], "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-display": "voucher-status" } } },
    { "_id": ids.totalDisplay, "tag": "div", "classes": c('bf-total-display'), "children": [], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-display": "total" } } },
    { "_id": ids.submitBtn, "tag": "input", "classes": c('bf-submit'), "children": [], "type": "FormButton", "data": { "form": { "type": "button", "wait": "Wird gesendet..." }, "attr": { "type": "submit", "value": "Buchung anfragen", "data-bf-action": "submit" } } },
    { "_id": ids.step5Nav, "tag": "div", "classes": c('bf-nav'), "children": [ids.step5BtnBack], "type": "Block", "data": { "tag": "div" } },
    { "_id": ids.step5BtnBack, "tag": "a", "classes": c('bf-btn-back'), "children": [ids.step5BtnBackText], "type": "Link", "data": { "link": { "mode": "external", "url": "#" }, "attr": { "data-bf-action": "back", "data-bf-goto": "4" } } },
    { "_id": ids.step5BtnBackText, "text": true, "v": "Zurück" },

    // Success
    { "_id": ids.stepSuccess, "tag": "div", "classes": c('bf-success'), "children": [ids.successIcon, ids.successTitle, ids.successDesc], "type": "Block", "data": { "tag": "div", "attr": { "data-bf-step": "success", "style": "display: none;" } } },
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
    dummy.style.left = '-9999px';
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
