/**
 * HeroNew — Redesigned landing page hero section.
 *
 * Groups:
 * 1. Tagline (violet label)
 * 2. Headline with branded "+" accent
 * 3. Subheadline
 * 4. Illustration (SVG)
 * 5. Workspace Card (input + CTA button)
 * 6. Trust Claims
 */

import './HeroNew.css';
import { setDemoWorkspaceName } from '../../lib/DemoStore.js';
import { setState } from '../../lib/store.js';
import { navigate } from '../../lib/router.js';
import { registerAllPages } from '../../pages/dashboard/registry.js';
import { renderSidebar } from '../Sidebar/Sidebar.js';
import { renderTopBar } from '../TopBar/TopBar.js';
import { openUpsellModal } from './UpsellModal.js';
import { DEMO_WORKSPACE } from '../../lib/DemoData.js';

/**
 * Create the new hero HTML string.
 * @param {Object} config
 * @returns {string} HTML string
 */
export const createHeroNew = (config = {}) => {
  const {
    tagline = 'Buchungen & Zahlungen für Webflow',
    headline = 'Book <img src="/src/svg/logo-bookfast-hero.svg" alt="+" class="hero-new__logo" width="56" height="56"> Fast jetzt testen<br>– ohne Anmeldung.',
    subheadline = 'Workspace-Name eingeben und Live-Demo starten.',
    illustrationSrc = '/src/svg/hero-illustration.svg',
    illustrationAlt = 'BookFast Illustration',
    formLabel = 'Workspace-Name',
    formPlaceholder = 'z.B. Alpine Chalets, Studio Nordlicht…',
    formButtonText = 'Live-Demo starten',
    formHint = 'Ohne Account Live Demo testen.',
    trustClaims = ['0% Provision', 'Webflow-native', 'Zahlung vor Termin'],
  } = config;

  const checkSVG = '<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>';

  const trustHTML = trustClaims.length ? `
    <div class="landing-trust-claims hero-new__trust">
      ${trustClaims.map(c => `<div class="landing-trust-claim">${checkSVG} <span>${c}</span></div>`).join('')}
    </div>` : '';

  // Pre-render layout for expanded demo
  const sidebarHTML = renderSidebar({ activePage: 'home' });
  const topBarHTML = renderTopBar();

  return `
    <section class="hero-new">
      <div class="landing-container">
        <!-- Group 1: Tagline -->
        <p class="hero-new__tagline">${tagline}</p>

        <!-- Group 2: Headline -->
        <h1 class="hero-new__headline">${headline}</h1>

        <!-- Group 3: Subheadline -->
        <p class="hero-new__subheadline">${subheadline}</p>

        <div class="hero-new__workspace">
          <!-- Group 4: Illustration -->
          <div class="hero-new__illustration">
            <img src="${illustrationSrc}" alt="${illustrationAlt}" width="280" height="280" loading="eager">
          </div>

          <!-- Group 5: Workspace Card -->
          <div class="hero-new__card" id="hero-new-card">
            <!-- Phase 1: Form -->
            <div class="hero-new__form" id="hero-new-form">
              <label class="hero-new__card-label" for="hero-new-workspace-name">${formLabel}</label>
              <input
                type="text"
                id="hero-new-workspace-name"
                class="hero-new__card-input"
                placeholder="${formPlaceholder}"
                maxlength="60"
                autocomplete="off"
              >
              <button type="button" class="hero-new__card-btn" id="hero-new-create-btn">
                ${formButtonText}
              </button>
              ${formHint ? `<p class="hero-new__card-hint">${formHint}</p>` : ''}
            </div>

            <!-- Phase 2: Dashboard (expands on submit) -->
            <div class="hero-new__dashboard dashboard-layout" id="hero-new-dashboard">
              ${sidebarHTML}
              <div class="main-wrapper">
                ${topBarHTML}
                <div class="main-content" id="main-content"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Group 6: Trust Claims -->
        ${trustHTML}
      </div>
    </section>
  `;
};


/**
 * Initialize the hero interactions. Call after the HTML is in the DOM.
 */
export const initHeroNew = () => {
  const card = document.getElementById('hero-new-card');
  const createBtn = document.getElementById('hero-new-create-btn');
  const nameInput = document.getElementById('hero-new-workspace-name');

  if (!card || !createBtn || !nameInput) return;

  const EXPAND_DURATION_MS = 560;
  const DASHBOARD_REVEAL_DELAY_MS = 140;

  createBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.classList.add('hero-new__card-input--error');
      nameInput.focus();
      setTimeout(() => nameInput.classList.remove('hero-new__card-input--error'), 1500);
      return;
    }

    // Initialize Demo State
    const demoWorkspace = { ...DEMO_WORKSPACE, name, slug: 'demo', role: 'owner' };
    setState({
      isDemoMode: true,
      user: { id: 'demo-user', email: 'demo@book-fast.de', user_metadata: { full_name: 'Demo User' } },
      workspaces: [demoWorkspace],
      currentWorkspace: demoWorkspace,
    });

    registerAllPages();
    setDemoWorkspaceName(name);

    // Inject workspace name into sidebar
    const sidebarHeaderWrapper = document.getElementById('workspace-dropdown-wrapper');
    if (sidebarHeaderWrapper) {
      sidebarHeaderWrapper.innerHTML = `
        <div class="hero-demo-workspace">
          <div class="hero-demo-workspace__avatar">${escapeHtml(name.charAt(0).toUpperCase())}</div>
          <span class="hero-demo-workspace__name">${escapeHtml(name)}</span>
        </div>
      `;
    }

    // Expand card
    card.style.willChange = 'width, height, transform, border-radius, box-shadow';
    card.classList.add('is-expanding');
    requestAnimationFrame(() => card.classList.add('expanded'));

    setTimeout(() => navigate('home'), DASHBOARD_REVEAL_DELAY_MS);

    setTimeout(() => {
      card.classList.add('is-expanded-content');
      card.classList.remove('is-expanding');
      card.style.willChange = 'auto';
    }, EXPAND_DURATION_MS);

    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  });

  // Sidebar navigation within demo
  card.addEventListener('click', (e) => {
    const navLink = e.target.closest('.nav-link');
    if (navLink) {
      e.preventDefault();
      const pageId = navLink.dataset.page;
      if (pageId) navigate(pageId);
      return;
    }
  });

  // Upsell modal for create actions in demo
  card.addEventListener('click', (e) => {
    const createLink = e.target.closest('.nav-link[data-page="create-booking"]');
    if (createLink) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openUpsellModal();
      return;
    }
    const actionBtn = e.target.closest('.btn-primary');
    if (actionBtn && shouldOpenUpsellForPrimaryAction(actionBtn)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openUpsellModal();
    }
  }, true);

  // Block action-menu items in demo
  document.addEventListener('click', (e) => {
    if (!card.classList.contains('expanded')) return;
    const actionMenuItem = e.target.closest('.action-menu-item');
    if (!actionMenuItem) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    document.querySelectorAll('.action-menu-dropdown.open').forEach((menu) => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (menu.parentNode) menu.parentNode.removeChild(menu);
    });
  }, true);

  // Enter key
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); createBtn.click(); }
  });
};

// ── Helpers ──────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function shouldOpenUpsellForPrimaryAction(button) {
  if (!button) return false;
  if (button.closest('.modal-overlay, .modal-content')) return false;
  const label = (button.textContent || '').trim().toLowerCase();
  return /(^\+)|neu|new|erstellen|anlegen|add/.test(label);
}
