/**
 * Settings Page - Orchestrator
 * Manages tabs and delegates rendering to section modules.
 */
import './settings.css';
import { getState, setState } from '../../../lib/store.js';
import { fetchEntities, createEntity } from '../../../lib/dataLayer.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { refreshWorkspace } from './settingsHelpers.js';
import { renderWorkspaceContent, renderWorkspaceTabContent } from './WorkspaceSection.js';
import { renderEmailTemplatesContent } from './EmailTemplatesSection.js';
import { renderIntegrationContent } from './IntegrationSection.js';
import { handleCheckStripeStatusSilent } from './PaymentsSection.js';
import { renderVacationContent } from './VacationSection.js';

let currentSection = 'workspace';

const cleanupEmailEditorLayout = () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.classList.remove('email-editor-active');

  // Clean up both old-style and new DetailLayout-based sidecards
  const sidecard = document.getElementById('detail-sidecard') || document.getElementById('email-editor-sidecard');
  if (sidecard) sidecard.remove();

  const mainWrapper = document.querySelector('.main-wrapper');
  if (mainWrapper) {
    mainWrapper.classList.remove('email-editor-sidecard-active');
    mainWrapper.classList.remove('has-detail-sidecard');
  }
};

const SETTINGS_NAV_ITEMS = [
  { id: 'workspace', label: 'Workspace', icon: 'home' },
  { id: 'integration', label: 'Integration', icon: 'blocks-integration' },
  { id: 'email-templates', label: 'E-Mail Vorlagen', icon: 'mails' },
  { id: 'account', label: 'Account', icon: 'user-square' },
  { id: 'billing', label: 'Abo und Zahlungen', icon: 'receipt-euro' },
  { id: 'sustainability', label: 'Nachhaltigkeit', icon: 'sprout' },
];

/**
 * Fetch sites (auto-provision default if needed)
 */
export const fetchSites = async () => {
  let result = await fetchEntities('sites');

  if (result.items.length === 0) {
    try {
      await createEntity('sites', { name: 'Main Website' });
      result = await fetchEntities('sites', { forceRefresh: true });
    } catch (error) {
      console.error('Failed to auto-provision site:', error);
    }
  }

  setState({ sites: result.items });
};

// ─── Section Switching ───

const SECTION_LABELS = Object.fromEntries(
  SETTINGS_NAV_ITEMS.map(item => [item.id, item.label])
);

const updateSettingsBreadcrumb = (section) => {
  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    const sectionLabel = SECTION_LABELS[section] || section;
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">Settings</span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${sectionLabel}</span>`;
  }
};

const switchSettingsSection = (section) => {
  currentSection = section;

  // Defensive cleanup in case editor sidecard is still mounted
  cleanupEmailEditorLayout();

  document.querySelectorAll('.settings-nav__item[data-section]').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });

  updateSettingsBreadcrumb(section);

  // Toggle scroll fade visibility (hide on email templates)
  const scrollFade = document.querySelector('.dashboard-scroll-fade');
  if (scrollFade) {
    scrollFade.style.display = section === 'email-templates' ? 'none' : '';
  }

  renderActiveSection();
};

const renderPlaceholderContent = (section) => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const labels = {
    billing: 'Abo und Zahlungen',
    sustainability: 'Nachhaltigkeit',
  };

  container.innerHTML = `
    <div class="tab-placeholder">
      <h3>${labels[section] || section}</h3>
      <p>Dieser Bereich wird bald verfügbar sein.</p>
    </div>
  `;
};

const renderActiveSection = (fromStripe = false) => {
  if (currentSection === 'workspace') {
    if (fromStripe) {
      setTimeout(async () => {
        await handleCheckStripeStatusSilent();
        renderWorkspaceTabContent();
      }, 300);
      return;
    }
    renderWorkspaceTabContent();
  } else if (currentSection === 'account') {
    renderWorkspaceContent(); // Company Details
  } else if (currentSection === 'email-templates') {
    renderEmailTemplatesContent();
  } else if (currentSection === 'integration') {
    fetchSites().then(() => renderIntegrationContent());
  } else if (currentSection === 'vacation') {
    renderVacationContent();
  } else {
    renderPlaceholderContent(currentSection);
  }
};

// ─── Main Render ───

export const renderSettingsPage = async () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Defensive cleanup when entering Settings page
  cleanupEmailEditorLayout();

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) topBarActions.innerHTML = '';

  // Check URL params for tab / Stripe return
  const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
  const tabParam = urlParams.get('tab');

  if (tabParam === 'payments') currentSection = 'workspace';
  else if (tabParam === 'billing') currentSection = 'billing';
  else if (tabParam === 'account') currentSection = 'account';
  else if (tabParam === 'integration') currentSection = 'integration';
  else if (tabParam === 'email-templates') currentSection = 'email-templates';
  else if (!urlParams.has('template')) currentSection = 'workspace'; // Fallback to default if no specific tab or template action

  updateSettingsBreadcrumb(currentSection);

  const scrollToSection = urlParams.get('section');

  const fromStripe = urlParams.get('connected') === 'true' || urlParams.get('refresh') === 'true';
  if (fromStripe) {
    const cleanHash = window.location.hash.split('?')[0];
    history.replaceState(null, '', window.location.pathname + cleanHash);
  }

  // Secondary Nav: in main-wrapper (Header + Nav + Content in einer Einheit)
  const mainWrapper = document.querySelector('.main-wrapper');

  // Defensive cleanup in case a previous settings nav still exists
  const existingSettingsNav = document.getElementById('settings-secondary-nav')
    || mainWrapper?.querySelector(':scope > .settings-nav');
  if (existingSettingsNav) existingSettingsNav.remove();
  mainWrapper?.classList.remove('main-wrapper--settings');

  mainWrapper?.classList.add('main-wrapper--settings');
  // Force reflow so grid layout is applied before inserting content (stabilizes demo layout)
  if (mainWrapper) void mainWrapper.offsetHeight;

  const settingsNav = document.createElement('aside');
  settingsNav.className = 'settings-nav';
  settingsNav.id = 'settings-secondary-nav';
  settingsNav.innerHTML = `
    <h2 class="settings-nav__title">Settings</h2>
    <nav class="settings-nav__list">
      ${SETTINGS_NAV_ITEMS.map(item => `
        <button type="button" class="settings-nav__item ${currentSection === item.id ? 'active' : ''}" data-section="${item.id}">
          ${getIconString(item.icon)}
          ${item.label}
        </button>
      `).join('')}
    </nav>
  `;
  if (mainWrapper) {
    mainWrapper.insertBefore(settingsNav, mainContent);
  }

  // main-content: nur der rechte Content-Bereich (Breadcrumb bleibt in TopBar)
  mainContent.innerHTML = `
    <div class="settings-content-area">
      <div id="settings-content" class="settings-content">
        <div style="text-align: center; padding: 2rem; color: var(--color-stone-500);">Loading settings...</div>
      </div>
      <div class="dashboard-scroll-fade" style="display: ${currentSection === 'email-templates' ? 'none' : ''}"></div>
    </div>
  `;

  await fetchSites();
  await refreshWorkspace();
  renderActiveSection(fromStripe);

  // Scroll to a specific section if requested (e.g. ?section=billing → #billing-section)
  if (scrollToSection) {
    requestAnimationFrame(() => {
      const target = document.getElementById(`${scrollToSection}-section`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const handleSettingsNavClick = (e) => {
    const navItem = e.target.closest('.settings-nav__item');
    if (navItem) {
      const section = navItem.dataset.section;
      if (section) switchSettingsSection(section);
    }
  };
  settingsNav.addEventListener('click', handleSettingsNavClick);

  return () => {
    settingsNav.removeEventListener('click', handleSettingsNavClick);
    settingsNav.remove();
    mainWrapper?.classList.remove('main-wrapper--settings');
  };
};
