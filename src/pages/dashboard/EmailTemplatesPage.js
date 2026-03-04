/**
 * E-Mail Templates Page
 * Standalone page that delegates to EmailTemplatesSection.
 */
import { getIconString } from '../../components/Icons/Icon.js';
import { renderEmailTemplatesContent } from './settings/EmailTemplatesSection.js';

export const renderEmailTemplatesPage = async () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `
      <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
      <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
      <span class="breadcrumb-item">${getIconString('mails')} E-Mail Vorlagen</span>
    `;
  }

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) topBarActions.innerHTML = '';

  mainContent.innerHTML = `
    <div class="settings-content-area">
      <div id="settings-content" class="settings-content">
        <div style="text-align: center; padding: 2rem; color: var(--color-stone-500);">Lade Vorlagen...</div>
      </div>
      <div class="dashboard-scroll-fade"></div>
    </div>
  `;

  await renderEmailTemplatesContent();
};
