/**
 * Settings - E-Mail Templates Section
 * Card-based overview of 7 email template types with inline editor.
 * Detail page uses renderDetailLayout (same as Service, Object, etc.)
 * with live placeholder preview in center card.
 */
import { supabase } from '../../../lib/supabaseClient.js';
import { getState } from '../../../lib/store.js';
import { navigate } from '../../../lib/router.js';
import { fetchEntities } from '../../../lib/dataLayer.js';
import { getAppUrl } from '../../../lib/urlHelpers.js';
import { createActionButton } from '../../../components/Button/Button.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import {
  renderDetailLayout,
  updateCenter,
  navField,
  buildSideCard,
  sideCardSection,
} from '../../../components/DetailLayout/DetailLayout.js';


// ─── Template Type Configuration ───

const TEMPLATE_TYPES = [
  {
    type: 'booking_received',
    label: 'Buchung eingegangen',
    description: 'Wird gesendet, wenn eine neue Buchungsanfrage eingeht.',
    icon: 'newmail',
  },
  {
    type: 'booking_accepted',
    label: 'Buchung akzeptiert',
    description: 'Bestätigung an den Kunden nach Annahme der Buchung.',
    icon: 'check',
  },
  {
    type: 'booking_rejected',
    label: 'Buchung abgelehnt',
    description: 'Benachrichtigung bei Ablehnung einer Buchungsanfrage.',
    icon: 'thumb-down',
  },
  {
    type: 'booking_cancelled',
    label: 'Buchung storniert',
    description: 'Info an den Kunden bei Stornierung der Buchung.',
    icon: 'close',
  },
  {
    type: 'booking_modified',
    label: 'Buchung geändert',
    description: 'Benachrichtigung bei Änderungen an einer bestehenden Buchung.',
    icon: 'pencil',
  },
  {
    type: 'refund',
    label: 'Rückerstattung',
    description: 'Bestätigung einer erfolgten Rückerstattung.',
    icon: 'banknote-x',
  },
  {
    type: 'booking_reminder',
    label: 'Buchungserinnerung',
    description: 'Erinnerung vor dem gebuchten Termin.',
    icon: 'clock',
  },
];

// ─── Default Templates ───

const COMMON_PLACEHOLDERS = [
  { key: '{{customer_name}}', label: 'Kundenname', defaultPreview: 'Max Mustermann' },
  { key: '{{booking_number}}', label: 'Buchungsnr.', defaultPreview: '#4232323214214123' },
  { key: '{{service_name}}', label: 'Service', defaultPreview: 'After-Work Spa' },
  { key: '{{object_name}}', label: 'Objekt', defaultPreview: 'UferSpa Suite L – Private Spa' },
  { key: '{{start_date}}', label: 'Startdatum', defaultPreview: '25.02.2026, 19:00' },
  { key: '{{end_date}}', label: 'Enddatum', defaultPreview: '25.02.2026, 22:00' },
  { key: '{{total_price}}', label: 'Gesamtpreis', defaultPreview: '210,50 €' },
  { key: '{{company_name}}', label: 'Firmenname', defaultPreview: 'Kagayaku Art Museum' },
];

const PORTAL_PLACEHOLDERS = [
  { key: '{{portal_link}}', label: 'Kundenportal-Link', defaultPreview: `${getAppUrl('/b/abc123')}` },
  { key: '{{pin_code}}', label: 'Zugangscode', defaultPreview: '847291' },
];

const REFUND_PLACEHOLDERS = [
  { key: '{{refund_amount}}', label: 'Erstattungsbetrag', defaultPreview: '210,50 €' },
];

const REJECTION_PLACEHOLDERS = [
  { key: '{{rejection_reason}}', label: 'Ablehnungsgrund', defaultPreview: 'Leider ist der gewählte Zeitraum nicht mehr verfügbar.' },
];

const ADDON_PLACEHOLDERS = [
  { key: '{{addon_name}}', label: 'Addon-Name', defaultPreview: 'Bademantel-Set' },
];

const PLACEHOLDERS_BY_TYPE = {
  booking_received: [...COMMON_PLACEHOLDERS, ...ADDON_PLACEHOLDERS],
  booking_accepted: [...COMMON_PLACEHOLDERS, ...PORTAL_PLACEHOLDERS, ...ADDON_PLACEHOLDERS],
  booking_rejected: [...COMMON_PLACEHOLDERS, ...REJECTION_PLACEHOLDERS],
  booking_cancelled: [...COMMON_PLACEHOLDERS, ...ADDON_PLACEHOLDERS],
  booking_modified: [...COMMON_PLACEHOLDERS, ...PORTAL_PLACEHOLDERS, ...ADDON_PLACEHOLDERS],
  refund: [...COMMON_PLACEHOLDERS, ...REFUND_PLACEHOLDERS],
  booking_reminder: [...COMMON_PLACEHOLDERS, ...PORTAL_PLACEHOLDERS, ...ADDON_PLACEHOLDERS],
};

const DEFAULT_TEMPLATES = {
  booking_received: {
    subject: 'Deine Buchungsanfrage ist eingegangen!',
    body: `Hallo {{customer_name}},

vielen Dank für deine Buchungsanfrage! Wir haben deine Anfrage erhalten und werden sie schnellstmöglich bearbeiten.

Du erhältst eine weitere E-Mail, sobald deine Buchung bestätigt wurde.

Vielen Dank für dein Vertrauen!`,
    cta_text: 'Kundenzentrale öffnen',
  },

  booking_accepted: {
    subject: 'Deine Buchung ist bestätigt!',
    body: `Hallo {{customer_name}},

deine Buchung wurde erfolgreich bestätigt!

Mit deinem persönlichen Zugangslink und Code kannst du jederzeit deine Buchungsdetails einsehen, Rechnungen herunterladen und bei Bedarf stornieren.

Vielen Dank und bis bald!`,
    cta_text: 'Kundenzentrale öffnen',
  },

  booking_rejected: {
    subject: 'Deine Buchungsanfrage konnte nicht bestätigt werden',
    body: `Hallo {{customer_name}},

leider konnten wir deine Buchungsanfrage nicht bestätigen.

Gerne kannst du einen anderen Zeitraum anfragen. Bei Fragen stehen wir dir zur Verfügung.

Mit freundlichen Grüßen`,
    cta_text: 'Kundenzentrale öffnen',
  },

  booking_cancelled: {
    subject: 'Deine Buchung wurde storniert',
    body: `Hallo {{customer_name}},

deine Buchung wurde storniert. Falls eine Rückerstattung anfällt, wirst du separat darüber informiert.

Bei Fragen stehen wir dir gerne zur Verfügung.`,
    cta_text: 'Kundenzentrale öffnen',
  },

  booking_modified: {
    subject: 'Deine Buchung wurde geändert',
    body: `Hallo {{customer_name}},

deine Buchung wurde aktualisiert. Die neuen Details findest du in der Übersicht unten.

Bei Fragen stehen wir dir gerne zur Verfügung.`,
    cta_text: 'Kundenzentrale öffnen',
  },

  refund: {
    subject: 'Rückerstattung für deine Buchung',
    body: `Hallo {{customer_name}},

für deine Buchung wurde eine Rückerstattung veranlasst. Die Erstattung wird innerhalb von 5–10 Werktagen auf deinem Konto gutgeschrieben.

Bei Fragen stehen wir dir gerne zur Verfügung.`,
    cta_text: 'Kundenzentrale öffnen',
  },

  booking_reminder: {
    subject: 'Erinnerung: Deine Buchung steht bevor!',
    body: `Hallo {{customer_name}},

dies ist eine freundliche Erinnerung an deine bevorstehende Buchung. Alle Details findest du in der Übersicht unten.

Wir freuen uns auf dich!`,
    cta_text: 'Kundenzentrale öffnen',
  },
};

// ─── State ───

let savedTemplates = {}; // { template_type: { id, subject, body, cta_text } }
let currentEditType = null; // null = card overview, string = editing that type
let previewValues = {}; // { '{{customer_name}}': 'Max Mustermann', ... }
const fieldTimers = {}; // { templateType_fieldName: timeoutId }

// ─── Helpers ───

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Replace all placeholders in text with preview values
 */
const replacePlaceholders = (text, values) => {
  let result = text || '';
  for (const [key, val] of Object.entries(values)) {
    if (val) {
      result = result.replaceAll(key, val);
    }
  }
  return result;
};

/**
 * Load all email templates for the current workspace
 */
const loadTemplates = async () => {
  const result = await fetchEntities('email_templates', { perPage: 50, forceRefresh: true });
  savedTemplates = {};
  for (const tpl of result.items) {
    savedTemplates[tpl.template_type] = tpl;
  }
};

/**
 * Upsert a template (insert or update based on workspace + type)
 */
const upsertTemplate = async (templateType, subject, body, ctaText) => {
  const state = getState();
  const workspaceId = state.currentWorkspace?.id;
  if (!workspaceId) return;

  const rowData = { workspace_id: workspaceId, template_type: templateType, subject, body };

  // Only include cta_text if the template natively uses it
  if (DEFAULT_TEMPLATES[templateType]?.cta_text !== undefined) {
    rowData.cta_text = ctaText;
  }

  const { data, error } = await supabase
    .from('email_templates')
    .upsert(
      rowData,
      { onConflict: 'workspace_id,template_type' }
    )
    .select()
    .single();

  if (error) {
    console.error('upsertTemplate error:', error);
    throw error;
  }

  savedTemplates[templateType] = data;
  return data;
};

/**
 * Delete a saved template (resets to default)
 */
const deleteTemplate = async (templateType) => {
  const existing = savedTemplates[templateType];
  if (!existing) return;

  const { error } = await supabase
    .from('email_templates')
    .delete()
    .eq('id', existing.id);

  if (error) {
    console.error('deleteTemplate error:', error);
    throw error;
  }

  delete savedTemplates[templateType];
};

/**
 * Auto-save a field (subject, body, or cta_text) for a template
 */
const autoSaveTemplate = async (templateType, fieldName, value) => {
  const statusEl = document.getElementById('autosave-status');

  // Show spinner
  if (statusEl) {
    statusEl.innerHTML = `<div class="autosave-spinner"></div><span>Speichert...</span>`;
    statusEl.classList.add('visible');
  }

  try {
    const getFieldVal = (name) => {
      const el = document.getElementById(`tpl-${name}`);
      if (el) return el.value;
      return savedTemplates[templateType]?.[name] ?? DEFAULT_TEMPLATES[templateType][name];
    };

    const subject = fieldName === 'subject' ? value : getFieldVal('subject');
    const body = fieldName === 'body' ? value : getFieldVal('body');
    const ctaText = fieldName === 'cta_text' ? value : getFieldVal('cta_text');

    await upsertTemplate(templateType, subject, body, ctaText);

    if (statusEl) {
      statusEl.innerHTML = `<span>Gespeichert</span>`;
      setTimeout(() => {
        statusEl.classList.remove('visible');
      }, 2000);
    }
  } catch (err) {
    console.error('Auto-save error:', err);
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:var(--color-red-600)">Fehler!</span>`;
      setTimeout(() => {
        statusEl.classList.remove('visible');
      }, 3000);
    }
  }
};

// ─── Initialize preview values from placeholder defaults ───

const initPreviewValues = (templateType) => {
  const placeholders = PLACEHOLDERS_BY_TYPE[templateType] || COMMON_PLACEHOLDERS;
  previewValues = {};
  for (const p of placeholders) {
    previewValues[p.key] = p.defaultPreview || '';
  }
};

// ─── Render: Settings redirect card ───

export const renderEmailTemplatesRedirectContent = () => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  container.innerHTML = `
    <div class="settings-card" style="max-width: 560px;">
      <div style="display: flex; align-items: flex-start; gap: 1rem;">
        <div style="color: var(--color-stone-400);">${getIconString('mails')}</div>
        <div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem;">E-Mail Vorlagen verwalten</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-stone-600); font-size: 0.95rem;">
            Passe die 7 Buchungs-E-Mails an: Betreff, Text und Platzhalter – von Bestätigung über Erinnerung bis Rückerstattung.
          </p>
          <a href="#" class="btn btn-primary" id="email-templates-settings-link">E-Mail Vorlagen verwalten</a>
        </div>
      </div>
    </div>
  `;

  const link = document.getElementById('email-templates-settings-link');
  if (link) {
    link.onclick = (e) => {
      e.preventDefault();
      navigate('email-templates');
    };
  }
};

// ─── Render: Main Entry ───

export const renderEmailTemplatesContent = async () => {
  await loadTemplates();

  const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
  const templateParam = urlParams.get('template');

  if (templateParam) {
    currentEditType = templateParam;
  } else {
    currentEditType = null;
  }

  if (currentEditType) {
    renderEditor(currentEditType);
  } else {
    renderCardOverview();
  }
};

// ─── Render: Card Overview ───

const renderCardOverview = () => {
  // Ensure editor mode is deactivated when showing card overview
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.classList.remove('email-editor-active');

  // Remove any leftover sidecard
  const mainWrapper = document.querySelector('.main-wrapper');
  const existingSidecard = mainWrapper?.querySelector(':scope > .detail-sidecard');
  if (existingSidecard) existingSidecard.remove();
  mainWrapper?.classList.remove('has-detail-sidecard');

  const container = document.getElementById('settings-content');
  if (!container) return;

  container.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto;">

      <!-- Template Cards -->
      <div class="email-template-cards">
        ${TEMPLATE_TYPES.map(t => {
    const isCustom = !!savedTemplates[t.type];
    const subject = savedTemplates[t.type]?.subject ?? DEFAULT_TEMPLATES[t.type].subject;
    const bodyStr = savedTemplates[t.type]?.body ?? DEFAULT_TEMPLATES[t.type].body;

    // Status Badges
    const erledigtIcon = getIconString('double-check');
    const openIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`;

    const badgeHtml = isCustom
      ? `<span class="email-template-card__badge email-template-card__badge--custom">${erledigtIcon} Erledigt</span>`
      : `<span class="email-template-card__badge email-template-card__badge--default">${openIcon} Offen</span>`;

    return `
            <div class="email-template-card" data-template-type="${t.type}">
              
              <div class="email-template-card__graphic">
                <div class="email-preview-panel">
                  <div class="email-preview-panel__header">
                    ${getIconString('mail')}
                    <span class="email-preview-panel__label">${t.label}</span>
                  </div>
                  <div class="email-preview-panel__body">
                    <h5 class="email-preview-panel__subject">${esc(subject)}</h5>
                    <p class="email-preview-panel__text">${esc(bodyStr)}</p>
                  </div>
                </div>
              </div>

              <div class="email-template-card__main">
                <h4 class="email-template-card__title">${t.label}</h4>
                <p class="email-template-card__desc">${t.description}</p>
              </div>

              ${badgeHtml}
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;

  // Card click handlers
  setTimeout(() => {
    document.querySelectorAll('.email-template-card').forEach(card => {
      card.onclick = () => {
        currentEditType = card.dataset.templateType;
        const currentHash = window.location.hash.split('?')[0];
        window.history.pushState(null, '', `${window.location.pathname}${currentHash}?tab=email-templates&template=${currentEditType}`);
        renderEditor(currentEditType);
      };
    });
  }, 0);
};

// ─── Center Preview: Structured email card mimicking actual email render ───

const buildEmailCenterPreview = (templateType, subject, body, ctaText) => {
  const config = TEMPLATE_TYPES.find(t => t.type === templateType);
  const placeholders = PLACEHOLDERS_BY_TYPE[templateType] || COMMON_PLACEHOLDERS;
  const pv = previewValues; // shorthand
  const has = (key) => placeholders.some(p => p.key === key);
  const v = (key) => esc(pv[key] || key); // resolved or raw placeholder

  const state = getState();
  const ws = state.currentWorkspace || {};

  // ── Build message text ──
  const resolvedBody = esc(replacePlaceholders(body, pv));

  // Portal section
  const hasPortal = has('{{portal_link}}');
  const hasPin = has('{{pin_code}}');
  const hasRefund = has('{{refund_amount}}');
  const hasRejection = has('{{rejection_reason}}');

  return `
    <div class="email-render-card">
      <!-- Dark header -->
      <div class="email-render__header">
        <div class="email-render__logo">
          ${ws.logo_url
      ? `<img src="${esc(ws.logo_url)}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />`
      : (getIconString('logo') || `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`)
    }
        </div>
        <h2 class="email-render__header-title">${esc(replacePlaceholders(subject, pv))}</h2>
      </div>

      <div class="email-render__body">
        <!-- Message -->
        <div class="email-render__greeting">
          <p class="email-render__greeting-text">
            ${resolvedBody.replace(/\n/g, '<br>')}
          </p>
          <p class="email-render__company-name">
            ${v('{{company_name}}')}
          </p>
        </div>

        ${hasRejection ? `
        <!-- Rejection Reason -->
        <div class="email-render__section">
          <p class="email-render__rejection">${v('{{rejection_reason}}')}</p>
        </div>
        ` : ''}

        ${hasRefund ? `
        <!-- Refund Amount -->
        <div class="email-render__section">
          <div class="email-render__info-row">
            <div>
              <div class="email-render__info-label">Erstattungsbetrag</div>
              <div class="email-render__info-value">${v('{{refund_amount}}')}</div>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Booking Info Row -->
        <div class="email-render__section email-render__info-row">
          <div>
            <div class="email-render__info-label">Buchungsnummer</div>
            <div class="email-render__info-value">${v('{{booking_number}}')}</div>
          </div>
          <div>
            <div class="email-render__info-label">Zahlungsoption</div>
            <div class="email-render__info-value">PayPal</div>
          </div>
        </div>

        <!-- Address Block -->
        <div class="email-render__section">
          <div class="email-render__address-box">
            <div class="email-render__address-col">
              <span class="email-render__address-label">From</span>
              <span>${v('{{company_name}}')}</span>
              <span>${esc(ws.company_address || 'Musterstraße 1')}</span>
              <span>${esc((ws.company_zip || '12345') + ' ' + (ws.company_city || 'Musterstadt'))}</span>
            </div>
            <div class="email-render__address-col">
              <span class="email-render__address-label">To</span>
              <span>${v('{{customer_name}}')}</span>
              <span>Musterstraße 1</span>
              <span>12345 Musterstadt</span>
            </div>
          </div>
        </div>

        <!-- Object Name -->
        <div class="email-render__section email-render__line-item">
          <span class="email-render__line-name">${v('{{object_name}}')}</span>
        </div>

        <!-- Service Line Item -->
        <div class="email-render__section email-render__line-item">
          <div>
            <span class="email-render__line-name">${v('{{service_name}}')}</span>
            <span class="email-render__line-sub">${v('{{start_date}}')} – ${v('{{end_date}}')}</span>
          </div>
          <span class="email-render__line-price">${v('{{total_price}}')}</span>
        </div>

        ${has('{{addon_name}}') ? `
        <!-- Addon Line Items -->
        <div class="email-render__section email-render__line-item">
          <span class="email-render__line-name">${v('{{addon_name}}')}</span>
          <span class="email-render__line-price">12,50 €</span>
        </div>
        ` : ''}

        <!-- Total -->
        <div class="email-render__section email-render__total">
          <span class="email-render__total-label">Gesamt</span>
          <span class="email-render__total-value">${v('{{total_price}}')}</span>
        </div>

        <!-- CTA Button -->
        <div class="email-render__section email-render__cta-section">
          <a class="email-render__cta-btn">${esc(ctaText || 'Kundenzentrale öffnen')}</a>
        </div>

        <!-- Pin Code -->
        <div class="email-render__section email-render__pin-section">
          <span class="email-render__pin">${v('{{pin_code}}')}</span>
          <p class="email-render__pin-info">Mit diesem Link und Code kannst du jederzeit deine Buchungsdetails einsehen, Rechnungen herunterladen und bei Bedarf stornieren.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="email-render__footer">
        <div class="email-render__footer-col">
          <strong>${v('{{company_name}}')}</strong>
          <span>${esc(ws.company_address || 'Musterstraße 1')}</span>
          <span>${esc((ws.company_zip || '12345') + ' ' + (ws.company_city || 'Musterstadt'))}</span>
          <span>${esc(ws.company_country || 'Deutschland')}</span>
        </div>
        <div class="email-render__footer-col">
          <span>Inhaber/-in: ${esc(ws.managing_directors || 'Max Mustermann')}</span>
          <span>Tel. ${esc(ws.phone || '0123456789')}</span>
          <span>E-Mail: ${esc(ws.email || 'info@example.de')}</span>
        </div>
        <div class="email-render__footer-col">
          <span>Impressum</span>
          <span>Datenschutz</span>
        </div>
      </div>

      <!-- Autosave Status (floating) -->
      <div class="autosave-status" id="autosave-status" style="position:absolute;top:12px;right:12px;"></div>
    </div>
  `;
};

// ─── Side Card: Two tabs – Vorlage (edit) + Vorschau (placeholder fields) ───

const buildEmailSideCard = (templateType, subject, body, ctaText, isCustom) => {
  const placeholders = PLACEHOLDERS_BY_TYPE[templateType] || COMMON_PLACEHOLDERS;
  const hasCtaConfig = DEFAULT_TEMPLATES[templateType]?.cta_text !== undefined;

  // Tab 1: Vorlage (subject, body, ctaText editing)
  const vorlageSections = [
    sideCardSection({
      content: `
        ${navField({ label: 'Betreff', name: 'tpl-subject', value: esc(subject), placeholder: 'E-Mail Betreff...' })}
      `
    }),
    sideCardSection({
      content: `
        ${navField({ label: 'Nachricht', name: 'tpl-body', value: esc(body), tag: 'textarea', placeholder: 'E-Mail Text...' })}
      `
    }),
  ];

  if (hasCtaConfig) {
    vorlageSections.push(
      sideCardSection({
        content: `
          ${navField({ label: 'Button-Text', name: 'tpl-cta_text', value: esc(ctaText), placeholder: 'Kundenzentrale öffnen' })}
        `
      })
    );
  }

  return buildSideCard({
    title: 'E-Mail Template',
    sections: vorlageSections,
  });
};

// ─── Render: Template Editor (Detail Page) ───

const renderEditor = (templateType) => {
  const config = TEMPLATE_TYPES.find(t => t.type === templateType);
  if (!config) return;

  const saved = savedTemplates[templateType];
  const defaults = DEFAULT_TEMPLATES[templateType];
  const subject = saved?.subject ?? defaults.subject;
  const body = saved?.body ?? defaults.body;
  const ctaText = saved?.cta_text ?? defaults.cta_text ?? null;
  const isCustom = !!saved;

  // Initialize preview values
  initPreviewValues(templateType);

  // Hide tabs + update content area
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.classList.add('email-editor-active');

  const isStandalone = getState().currentPage === 'email-templates';
  const parentLabel = isStandalone ? 'E-Mail Vorlagen' : 'Settings';
  const parentNav = isStandalone ? 'email-templates' : 'settings';

  // Use renderDetailLayout for proper 2-column layout
  renderDetailLayout({
    centerContent: buildEmailCenterPreview(templateType, subject, body, ctaText),
    sideCardContent: buildEmailSideCard(templateType, subject, body, ctaText, isCustom),
    breadcrumbHtml: `
      <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
      <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
      <span class="breadcrumb-item"><a href="#" class="breadcrumb-link" data-nav="settings">Settings</a></span>
      <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
      <span class="breadcrumb-item"><a href="#" class="breadcrumb-link" id="breadcrumb-back">E-Mail Vorlagen</a></span>
      <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
      <span class="breadcrumb-item">${getIconString('mail')} ${config.label}</span>
    `,
  });

  // Make the textarea taller for email body
  const bodyTextarea = document.querySelector('[name="tpl-body"]');
  if (bodyTextarea) {
    bodyTextarea.style.minHeight = '280px';
  }

  // Wire up breadcrumb back navigation
  const breadcrumbBack = document.getElementById('breadcrumb-back');
  if (breadcrumbBack) {
    breadcrumbBack.onclick = (e) => {
      e.preventDefault();
      exitEditorMode();
    };
  }

  // Wire up home/settings breadcrumb
  document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
    const link = e.target.closest('.breadcrumb-link');
    if (!link) return;
    if (link.id === 'breadcrumb-back') return; // handled above
    e.preventDefault();
    if (link.dataset.nav === 'home') navigate('bookings');
    if (link.dataset.nav === 'settings') navigate('settings');
  });

  // Reset button (only if custom)
  const resetContainer = document.getElementById('reset-btn-container');
  if (isCustom && resetContainer) {
    const { element: resetBtn } = createActionButton({
      text: 'Auf Standard zurücksetzen',
      loadingText: 'Zurücksetzen...',
      className: 'btn-secondary',
      onClick: async () => {
        await deleteTemplate(templateType);
        renderEditor(templateType);
      },
    });
    resetBtn.style.padding = '0.5rem 1.5rem';
    resetContainer.appendChild(resetBtn);
  }

  // ── Wire up live preview + autosave ──
  wireUpEditor(templateType);
};

/**
 * Wire up all interactive listeners for the editor
 */
const wireUpEditor = (templateType) => {
  const sidecard = document.getElementById('detail-sidecard');
  if (!sidecard) return;

  // Get current subject/body/ctaText values
  const getSubject = () => sidecard.querySelector('[name="tpl-subject"]')?.value || '';
  const getBody = () => sidecard.querySelector('[name="tpl-body"]')?.value || '';
  const getCtaText = () => sidecard.querySelector('[name="tpl-cta_text"]')?.value || '';

  // Update center preview from current values
  const refreshPreview = () => {
    updateCenter(buildEmailCenterPreview(templateType, getSubject(), getBody(), getCtaText()));
  };

  // Tab 1: Vorlage – subject, body, ctaText auto-save + live preview
  const subjectEl = sidecard.querySelector('[name="tpl-subject"]');
  const bodyEl = sidecard.querySelector('[name="tpl-body"]');
  const ctaTextEl = sidecard.querySelector('[name="tpl-cta_text"]');

  if (subjectEl) {
    subjectEl.addEventListener('input', () => {
      refreshPreview();

      const timerKey = `${templateType}_subject`;
      if (fieldTimers[timerKey]) clearTimeout(fieldTimers[timerKey]);
      fieldTimers[timerKey] = setTimeout(() => {
        autoSaveTemplate(templateType, 'subject', subjectEl.value);
      }, 1000);
    });
  }

  if (bodyEl) {
    bodyEl.addEventListener('input', () => {
      refreshPreview();

      const timerKey = `${templateType}_body`;
      if (fieldTimers[timerKey]) clearTimeout(fieldTimers[timerKey]);
      fieldTimers[timerKey] = setTimeout(() => {
        autoSaveTemplate(templateType, 'body', bodyEl.value);
      }, 1000);
    });
  }

  if (ctaTextEl) {
    ctaTextEl.addEventListener('input', () => {
      refreshPreview();

      const timerKey = `${templateType}_cta_text`;
      if (fieldTimers[timerKey]) clearTimeout(fieldTimers[timerKey]);
      fieldTimers[timerKey] = setTimeout(() => {
        autoSaveTemplate(templateType, 'cta_text', ctaTextEl.value);
      }, 1000);
    });
  }
};

/**
 * Exit editor and go back to card overview
 */
const exitEditorMode = () => {
  currentEditType = null;
  // Navigate back to settings with the email-templates tab pre-selected.
  // renderSettingsPage() reads ?tab=email-templates and opens the matching tab.
  navigate('settings', { queryParams: '?tab=email-templates' });
};
