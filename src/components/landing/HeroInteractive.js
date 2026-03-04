/**
 * HeroInteractive — Landing page hero with interactive dashboard demo.
 *
 * Phase 1: Workspace name card (input + button)
 * Phase 2: Card expands into a dashboard preview with sidebar + checklist
 * Phase 3: CTA bar to register and carry over demo data
 */

import './HeroInteractive.css';
import '../../styles/layout.css';
import { setDemoWorkspaceName } from '../../lib/DemoStore.js';
import { setState } from '../../lib/store.js';
import { navigate } from '../../lib/router.js';
import { renderSidebar } from '../Sidebar/Sidebar.js';
import { DEMO_WORKSPACE } from '../../lib/DemoData.js';
import { renderTopBar } from '../TopBar/TopBar.js';
import { openUpsellModal } from './UpsellModal.js';
let dashboardPagesRegistered = false;

// ── Main Component ──────────────────────────────────────

/**
 * Create the interactive hero HTML string.
 * @param {Object} config
 * @param {string} [config.headline]
 * @param {string} [config.subheadline]
 * @param {string} [config.formLabel]
 * @param {string} [config.formPlaceholder]
 * @param {string} [config.formButtonText]
 * @param {string} [config.formHint]
 * @param {string[]} [config.trustClaims]
 * @returns {string} HTML string
 */
export const createHeroInteractive = (config) => {
  const {
    headline = 'BookFast jetzt testen – ohne Anmeldung.',
    subheadline = 'Workspace-Name eingeben und direkt loslegen.',
    formLabel = 'Workspace-Name',
    formPlaceholder = 'z.B. Alpine Chalets, Studio Nordlicht…',
    formButtonText = 'Jetzt testen →',
    formHint = 'Keine E-Mail. Keine Kreditkarte. Kein Abo.',
    trustClaims = [],
  } = config;

  const checkSVG = '<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>';

  const trustHTML = trustClaims.length ? `
    <div class="landing-trust-claims hero-interactive__trust" style="justify-content: center;">
      ${trustClaims.map(c => `<div class="landing-trust-claim">${checkSVG} <span>${c}</span></div>`).join('')}
    </div>` : '';

  // Pre-render layout components
  // Note: Sidebar and TopBar are now real components used in the actual dashboard
  const sidebarHTML = renderSidebar({ activePage: 'home' });
  const topBarHTML = renderTopBar();

  return `
    <section class="hero-interactive">
      <div class="landing-container">
        <!-- Headline -->
        <div class="hero-interactive__headline">
          <h1 class="landing-h1 text-balance">${headline}</h1>
          <p class="landing-text-lg">${subheadline}</p>
        </div>

        <!-- Card (expands into dashboard) -->
        <div class="hero-interactive__card" id="hero-demo-card">
          <!-- Phase 1: Workspace form -->
          <div class="hero-interactive__form" id="hero-demo-form">
            <label class="hero-interactive__form-label" for="hero-workspace-name">${formLabel}</label>
            <input
              type="text"
              id="hero-workspace-name"
              class="hero-interactive__form-input"
              placeholder="${formPlaceholder}"
              maxlength="60"
              autocomplete="off"
            >
            <button type="button" class="hero-interactive__form-btn" id="hero-create-btn">
              ${formButtonText}
            </button>
            ${formHint ? `<p class="hero-interactive__form-hint">${formHint}</p>` : ''}
          </div>

          <!-- Phase 2: Dashboard frame (Replicates Dashboard.js layout structure) -->
          <div class="hero-interactive__dashboard dashboard-layout" id="hero-demo-dashboard">
             ${sidebarHTML}

             <div class="main-wrapper">
               ${topBarHTML}
               
               <div class="main-content" id="main-content">
                 <!-- Content will be loaded dynamically by router -->
               </div>
             </div>
          </div>

        </div>

        ${trustHTML}
      </div>
    </section>
  `;
};


// ── Initialization (attach event listeners) ──────────────────────────────────────

/**
 * Initialize the interactive hero. Call after the HTML is in the DOM.
 */
export const initHeroInteractive = () => {
  const card = document.getElementById('hero-demo-card');
  const createBtn = document.getElementById('hero-create-btn');
  const nameInput = document.getElementById('hero-workspace-name');

  if (!card || !createBtn || !nameInput) return;
  const EXPAND_DURATION_MS = 560;
  const DASHBOARD_REVEAL_DELAY_MS = 140;

  // Handle workspace creation
  createBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.style.borderColor = '#ef4444';
      nameInput.focus();
      setTimeout(() => {
        nameInput.style.borderColor = '';
      }, 1500);
      return;
    }

    // 1. Initialize Demo State
    const demoWorkspace = { ...DEMO_WORKSPACE, name: name, slug: 'demo', role: 'owner' };

    // Set global state to Demo Mode
    setState({
      isDemoMode: true,
      user: { id: 'demo-user', email: 'demo@book-fast.de', user_metadata: { full_name: 'Demo User' } },
      workspaces: [demoWorkspace],
      currentWorkspace: demoWorkspace
    });

    // 2. Register Dashboard Pages
    try {
      if (!dashboardPagesRegistered) {
        const { registerAllPages } = await import('../../pages/dashboard/registry.js');
        registerAllPages();
        dashboardPagesRegistered = true;
      }
    } catch (error) {
      console.error('Demo page registration failed:', error);
      alert('Die Demo konnte nicht gestartet werden. Bitte versuche es erneut.');
      return;
    }

    // 3. Store name in local demo store (optional, for persistency across reloads if needed)
    setDemoWorkspaceName(name);

    // 4. Transform UI
    // Inject workspace name into sidebar header (where dropdown usually is)
    const sidebarHeaderWrapper = document.getElementById('workspace-dropdown-wrapper');
    if (sidebarHeaderWrapper) {
      sidebarHeaderWrapper.innerHTML = `
        <div class="hero-demo-workspace">
          <div class="hero-demo-workspace__avatar">${name.charAt(0).toUpperCase()}</div>
          <span class="hero-demo-workspace__name">${escapeHtml(name)}</span>
        </div>
      `;
    }

    // Expand card in phases for smoother motion.
    card.style.willChange = 'width, height, transform, border-radius, box-shadow';
    card.classList.add('is-expanding');
    requestAnimationFrame(() => {
      card.classList.add('expanded');
    });

    // 5. Start Router / Render Home with slight delay to avoid competing with initial reflow.
    setTimeout(() => {
      navigate('home');
    }, DASHBOARD_REVEAL_DELAY_MS);

    // Reveal dashboard content after card transition settles.
    setTimeout(() => {
      card.classList.add('is-expanded-content');
      card.classList.remove('is-expanding');
      card.style.willChange = 'auto';
    }, EXPAND_DURATION_MS);

    // Smooth scroll to card center
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  });

  // Handle Sidebar Navigation (delegated from card)
  // We need to manually listen because we are not running the global initRouter()
  // to avoid interfering with the landing page routing.
  card.addEventListener('click', (e) => {
    // Handle Nav Links
    const navLink = e.target.closest('.nav-link');
    if (navLink) {
      e.preventDefault();
      const pageId = navLink.dataset.page;
      if (pageId) {
        navigate(pageId);
        // On mobile/tablet where sidebar might be toggleable, we'd close it here
      }
      return;
    }

    // Handle "Action" buttons that link to pages (e.g. "Buchung anlegen" in sidebar is special, but others might exist)
    // The sidebar "Buchung anlegen" has isAction=true, so it might not have data-page, or it might be handled separately.
    // In Sidebar.js: { label: 'Buchung anlegen', id: 'create-booking', icon: 'plus', isAction: true }
    // It has data-page="create-booking".
    // But Dashboard.js handles 'create-booking' via specific event listener on ID.
    // We should emulate that here or let it be.
    // In Dashboard.js:
    // const createBookingLink = document.querySelector('.nav-link[data-page="create-booking"]');
    // if (createBookingLink) { createBookingLink.addEventListener(...) }
    //
    // Ideally, we want the "Create Booking" modal to work in Demo too.
    // For now, let's at least ensure navigation works for regular pages.
  });

  // Special handling for "Buchung anlegen" & other Create buttons in Demo
  // Use CAPTURING phase to intercept clicks before they reach the inner elements
  card.addEventListener('click', (e) => {
    // 1. "Buchung anlegen" in Sidebar
    const createLink = e.target.closest('.nav-link[data-page="create-booking"]');
    if (createLink) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openUpsellModal();
      return;
    }

    // 2. Create buttons in dashboard views (not in modals/forms)
    const actionBtn = e.target.closest('.btn-primary');
    if (actionBtn && shouldOpenUpsellForPrimaryAction(actionBtn)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openUpsellModal();
    }
  }, true); // <--- Capture phase!

  // Block action-menu items in demo mode.
  // Menus are rendered into document.body, so we need a document-level capture listener.
  document.addEventListener('click', (e) => {
    if (!card.classList.contains('expanded')) return;

    const actionMenuItem = e.target.closest('.action-menu-item');
    if (!actionMenuItem) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Close open menus for clear UX feedback.
    document.querySelectorAll('.action-menu-dropdown.open').forEach((menu) => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (menu.parentNode) {
        menu.parentNode.removeChild(menu);
      }
    });
  }, true);

  // Handle Enter key on input
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createBtn.click();
    }
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

  // Let modal interactions continue normally in demo.
  if (button.closest('.modal-overlay, .modal-content')) return false;

  const label = (button.textContent || '').trim().toLowerCase();
  return /(^\+)|neu|new|erstellen|anlegen|add/.test(label);
}
