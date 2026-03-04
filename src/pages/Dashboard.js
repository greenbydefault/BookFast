/**
 * Dashboard Layout - Main navigation and layout wrapper
 */
import '../styles/layout.css';
import { supabase } from '../lib/supabaseClient.js';
import { getState, setState } from '../lib/store.js';
import { navigate, initRouter } from '../lib/router.js';
import { preloadEntities, invalidateCache } from '../lib/dataLayer.js';
import { getIconString } from '../components/Icons/Icon.js';
import { renderWorkspaceOnboarding } from './Onboarding.js';
import { Dropdown, renderUserAvatar } from '../components/Dropdown/Dropdown.js';
import { renderSidebar } from '../components/Sidebar/Sidebar.js';
import { renderTopBar } from '../components/TopBar/TopBar.js';
import { registerAllPages } from './dashboard/registry.js';
import { getStorageItem, removeStorageItem, setStorageItem } from '../lib/storageService.js';

const app = document.querySelector('#app');


/**
 * Fetch user workspaces
 */
const fetchWorkspaces = async () => {
  const { data } = await supabase.from('workspaces').select('*');

  if (data && data.length > 0) {
    // Check for saved workspace in localStorage
    const savedWorkspaceId = getStorageItem('selectedWorkspaceId');
    let selectedWorkspace = data[0];

    if (savedWorkspaceId) {
      const found = data.find(w => w.id === savedWorkspaceId);
      if (found) {
        selectedWorkspace = found;
      }
    }

    setState({
      workspaces: data,
      currentWorkspace: selectedWorkspace
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
  removeStorageItem('freeTrialDismissed');

  app.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar({ activePage: state.currentPage })}

      <div class="main-wrapper">
        ${renderTopBar()}
        
        <main class="main-content" id="main-content">
          <!-- Content will be loaded dynamically -->
        </main>
      </div>
    </div>
  `;

  // "Buchung anlegen" button — open modal from anywhere
  const createBookingLink = document.querySelector('.nav-link[data-page="create-booking"]');
  if (createBookingLink) {
    createBookingLink.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent router from trying to navigate
      const { openCreateBookingModal } = await import('./dashboard/bookings/modals/CreateBookingModal.js');
      openCreateBookingModal();
    });
  }

  // Workspace Switcher - Custom Dropdown
  const workspaceOptions = state.workspaces.map((w, index) => ({
    label: w.name,
    value: w.id,
    shortcut: index < 9 ? `⌘${index + 1}` : undefined,
    hideIcon: true
  }));
  workspaceOptions.push({ label: 'Neuen Workspace anlegen', value: 'new', isAction: true, shortcut: '⌘A' });

  const dropdownContainer = document.getElementById('workspace-dropdown-wrapper');

  const handleWorkspaceSelect = async (value) => {
    if (value === 'new') {
      const { openCreateWorkspaceModal } = await import('../components/CreateWorkspaceModal/CreateWorkspaceModal.js');
      const newWorkspace = await openCreateWorkspaceModal();

      if (newWorkspace) {
        setStorageItem('selectedWorkspaceId', newWorkspace.id);
        window.location.reload();
      }
    } else {
      const currentState = getState();
      const workspace = currentState.workspaces.find(w => w.id === value);
      if (workspace && workspace.id !== currentState.currentWorkspace?.id) {
        setState({ currentWorkspace: workspace });
        setStorageItem('selectedWorkspaceId', workspace.id);
        invalidateCache();
        navigate('home');
      }
    }
  };

  const workspaceDropdown = new Dropdown({
    container: dropdownContainer,
    options: workspaceOptions,
    selectedValue: state.currentWorkspace?.id,
    placeholder: 'Select Workspace',
    onSelect: handleWorkspaceSelect
  });

  // Keyboard shortcuts for workspace switching (⌘1–⌘9) and new workspace (⌘A)
  const workspaceShortcutHandler = (e) => {
    if (!e.metaKey && !e.ctrlKey) return;

    // ⌘1 through ⌘9
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      const wsIndex = num - 1;
      const currentState = getState();
      if (wsIndex < currentState.workspaces.length) {
        e.preventDefault();
        handleWorkspaceSelect(currentState.workspaces[wsIndex].id);
      }
      return;
    }

    // ⌘A — New account
    if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      handleWorkspaceSelect('new');
    }
  };
  document.addEventListener('keydown', workspaceShortcutHandler);

  // User dropdown (email + Settings, Docs, Wishlist, Logout, Account)
  const userDropdownContainer = document.getElementById('user-dropdown-wrapper');
  if (userDropdownContainer && state.user) {
    const userEmail = state.user.email || 'Account';
    const userFullName = state.user.user_metadata?.full_name || userEmail;
    const wishlistUrl = 'https://book-fast.de/roadmap';

    const userMenuOptions = [
      { label: 'Settings', value: 'settings', icon: 'gear' },
      { label: 'Account', value: 'account', icon: 'user' },
      { label: 'Docs', value: 'docs', icon: 'book-open-text' },
      { label: 'Wishlist', value: 'roadmap', icon: 'road', external: true },
      { label: 'Logout', value: 'logout', icon: 'log-out', dividerBefore: true }
    ];

    const handleUserMenuSelect = async (value) => {
      if (value === 'settings') {
        navigate('settings');
      } else if (value === 'account') {
        navigate('settings', { queryParams: '?tab=account' });
      } else if (value === 'docs') {
        window.location.href = 'https://book-fast.de/docs';
      } else if (value === 'roadmap') {
        window.open(wishlistUrl, '_blank');
      } else if (value === 'logout') {
        await supabase.auth.signOut();
        window.location.href = 'https://book-fast.de/';
      }
    };

    const workspaceLogoUrl = state.currentWorkspace?.logo_url;

    new Dropdown({
      container: userDropdownContainer,
      options: userMenuOptions,
      selectedValue: null,
      placeholder: userFullName,
      triggerLabel: userFullName,
      triggerPrefix: renderUserAvatar(userFullName, workspaceLogoUrl),
      menuPosition: 'up',
      onSelect: handleUserMenuSelect
    });
  }
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
  registerAllPages();

  // Initialize router (handles initial render based on URL)
  initRouter();

  // Preload common entities for faster page switching
  preloadEntities(['bookings', 'sites', 'objects', 'services', 'addons', 'staff', 'customers', 'vouchers']);
};
