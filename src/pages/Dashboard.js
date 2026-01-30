/**
 * Dashboard Layout - Main navigation and layout wrapper
 */
import { supabase } from '../lib/supabaseClient.js';
import { getState, setState } from '../lib/store.js';
import { registerPage, navigate, initRouter } from '../lib/router.js';
import { preloadEntities } from '../lib/dataLayer.js';
import { getIconString } from '../components/Icons/Icon.js';
import { renderBookingsPage } from './dashboard/BookingsPage.js';
import { renderSitesPage } from './dashboard/SitesPage.js';
import { renderObjectsPage } from './dashboard/ObjectsPage.js';
import { renderWorkspaceOnboarding } from './Onboarding.js';
import { renderServicesPage } from './dashboard/ServicesPage.js';

const app = document.querySelector('#app');

// Menu items configuration
const MENU_ITEMS = [
  { label: 'Buchungen', id: 'bookings', icon: 'calender-days-date' },
  { label: 'Objekte', id: 'objects', icon: 'package' },
  { label: 'Services', id: 'services', icon: 'list' },
  { label: 'Addons', id: 'addons', icon: 'blocks-integration' },
  { label: 'Mitarbeiter', id: 'staff', icon: 'user' },
  { label: 'Kunden', id: 'customers', icon: 'user-square' },
  { label: 'Gutscheine', id: 'vouchers', icon: 'ticket-percent' },
  { label: 'Insights', id: 'insights', icon: 'chart' },
  { label: 'Settings', id: 'settings', icon: 'gear' }
];

/**
 * Fetch user workspaces
 */
const fetchWorkspaces = async () => {
  const { data } = await supabase.from('workspaces').select('*');

  if (data && data.length > 0) {
    setState({
      workspaces: data,
      currentWorkspace: data[0]
    });
    return true;
  }
  return false;
};

/**
 * Render the main dashboard layout
 */
const renderLayout = (user) => {
  const state = getState();
  const userName = user?.user_metadata?.full_name || 'User';

  app.innerHTML = `
    <div class="dashboard-layout">
      <header class="top-nav">
        <a href="#" class="nav-brand">
          ${getIconString('sprout', 'text-primary')} BookFast
        </a>
        
        <nav>
          <ul class="nav-menu">
            ${MENU_ITEMS.map((item, index) => `
              <li>
                <a href="#" class="nav-link ${index === 0 ? 'active' : ''}" data-page="${item.id}">
                  ${getIconString(item.icon)}
                  ${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <div class="nav-actions">
          <div class="workspace-select-wrapper">
            <select id="workspace-selector" class="workspace-selector">
              ${state.workspaces.map(w => `<option value="${w.id}" ${w.id === state.currentWorkspace?.id ? 'selected' : ''}>${w.name}</option>`).join('')}
              <option value="new">+ New Workspace</option>
            </select>
          </div>
          
          <div class="user-avatar" title="${user?.email || ''}">
            ${userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main class="main-content" id="main-content">
        <!-- Content will be loaded dynamically -->
      </main>
    </div>
  `;

  // Workspace Switcher
  document.getElementById('workspace-selector').addEventListener('change', async (e) => {
    if (e.target.value === 'new') {
      renderWorkspaceOnboarding();
    } else {
      const workspace = state.workspaces.find(w => w.id === e.target.value);
      setState({ currentWorkspace: workspace });
      // Refresh current page
      navigate(getState().currentPage);
    }
  });
};

/**
 * Initialize and render the dashboard
 */
export const renderDashboard = async (session) => {
  const user = session?.user;

  // Store user in state
  setState({ user });

  // Fetch workspaces
  const hasWorkspaces = await fetchWorkspaces();

  if (!hasWorkspaces) {
    // First time user - show onboarding
    renderWorkspaceOnboarding();
    return;
  }

  // Render main layout
  renderLayout(user);



  // Register pages with router
  registerPage('bookings', renderBookingsPage);
  registerPage('sites', renderSitesPage);
  registerPage('objects', renderObjectsPage);
  registerPage('services', renderServicesPage);

  // Initialize router (handles initial render based on URL)
  initRouter();

  // Preload common entities for faster page switching
  preloadEntities(['bookings', 'sites', 'objects', 'services']);
};
