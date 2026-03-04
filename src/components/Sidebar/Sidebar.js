/**
 * Sidebar Component
 * Reusable sidebar navigation for Dashboard and Demo.
 */

import { getIconString } from '../Icons/Icon.js';

const getFreeTrialIllustrationUrl = () => {
    try {
        return new URL('../../svg/illustrations/free-trial-illustration.svg', import.meta.url).href;
    } catch {
        return '/src/svg/illustrations/free-trial-illustration.svg';
    }
};

// Menu items configuration
export const MENU_ITEMS_GENERAL = [
    { label: 'Buchung anlegen', id: 'create-booking', icon: 'plus', isAction: true },
    { label: 'Home', id: 'home', icon: 'home' },
    { label: 'Buchungen', id: 'bookings', icon: 'calender-days-date' },
];

export const MENU_ITEMS_MANAGEMENT = [
    { label: 'Objekte', id: 'objects', icon: 'package' },
    { label: 'Services', id: 'services', icon: 'list' },
    { label: 'Addons', id: 'addons', icon: 'blocks-integration' },
    { label: 'Mitarbeiter', id: 'staff', icon: 'user' },
    { label: 'Gutscheine', id: 'vouchers', icon: 'ticket-percent' },
];

export const MENU_ITEMS_ANALYTICS = [
    { label: 'Insights', id: 'insights', icon: 'insights' },
    { label: 'Kunden', id: 'customers', icon: 'user-square' },
];

/**
 * Render the Sidebar HTML
 * @param {Object} props
 * @param {string} props.activePage - ID of the current active page
 * @returns {string} HTML string
 */
export const renderSidebar = ({ activePage = 'home' } = {}) => {
    const renderNavItem = (item) => `
    <li>
      <a href="#" class="nav-link ${item.id === activePage ? 'active' : ''} ${item.isAction ? 'nav-link-action' : ''}" data-page="${item.id}">
        ${getIconString(item.icon)}
        ${item.label}
      </a>
    </li>
  `;

    return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="workspace-select-wrapper" id="workspace-dropdown-wrapper">
          <!-- Custom Dropdown will be mounted here -->
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Group 1: General -->
        <div class="nav-group">
          <ul class="nav-menu">
            ${MENU_ITEMS_GENERAL.map(renderNavItem).join('')}
          </ul>
        </div>
        
        <!-- Group 2: Management -->
        <div class="nav-group">
          <div class="nav-group-title">Verwaltung</div>
          <ul class="nav-menu">
            ${MENU_ITEMS_MANAGEMENT.map(renderNavItem).join('')}
          </ul>
        </div>
        
        <!-- Group 3: Analytics -->
        <div class="nav-group">
           <div class="nav-group-title">Analyse</div>
          <ul class="nav-menu">
            ${MENU_ITEMS_ANALYTICS.map(renderNavItem).join('')}
          </ul>
        </div>
      </nav>

      <div class="sidebar-free-trial" id="sidebar-free-trial">
        <div class="free-trial-box">
          <div class="free-trial-box__head">
            <span class="free-trial-box__title">Free Trial</span>
          </div>
          <p class="free-trial-box__text">Dein Freeplan ist noch drei Tage gültig.</p>
          <a href="#" class="free-trial-box__link" data-free-trial-update>Update →</a>
          <img class="free-trial-box__illustration" src="${getFreeTrialIllustrationUrl()}" alt="" aria-hidden="true" />
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-dropdown-wrapper" id="user-dropdown-wrapper">
          <!-- User dropdown (email + Settings, Docs, etc.) mounted by Dashboard.js -->
        </div>
      </div>
    </aside>
  `;
};
