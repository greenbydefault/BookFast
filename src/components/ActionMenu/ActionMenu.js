/**
 * ActionMenu Component
 * Reusable dropdown menu for table row actions
 */

import { getIconString } from '../Icons/Icon.js';
import './ActionMenu.css';

/**
 * Create an action menu
 * @param {Object} config - Configuration object
 * @param {HTMLElement} config.trigger - The button element that triggers the menu
 * @param {Array} config.actions - Array of action objects
 * @param {string} config.actions[].label - Action label text
 * @param {string} config.actions[].iconName - Icon name from sprite
 * @param {Function} config.actions[].action - Function to execute on click
 * @param {string} [config.actions[].variant] - Visual variant: 'success', 'danger', 'warning', 'default'
 * @returns {Object} - Menu control object with open/close methods
 */
export const createActionMenu = ({ trigger, actions }) => {
    // Create menu container
    const menu = document.createElement('div');
    menu.className = 'action-menu-dropdown';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');

    // Create menu items
    actions.forEach(({ label, iconName, action, variant = 'default' }) => {
        const item = document.createElement('button');
        item.className = `action-menu-item action-menu-item-${variant}`;
        item.setAttribute('role', 'menuitem');

        item.innerHTML = `
            <span class="action-menu-item-icon">${getIconString(iconName)}</span>
            <span class="action-menu-item-label">${label}</span>
        `;

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            action();
            close();
        });

        menu.appendChild(item);
    });

    // Position menu relative to trigger
    const positionMenu = () => {
        const triggerRect = trigger.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        // Position to the left of the trigger, aligned to bottom
        menu.style.top = `${triggerRect.bottom}px`;
        menu.style.left = `${triggerRect.right - menuRect.width}px`;
    };

    // Open menu
    const open = () => {
        // Close any other open menus
        document.querySelectorAll('.action-menu-dropdown.open').forEach(m => {
            if (m !== menu) m.classList.remove('open');
        });

        document.body.appendChild(menu);
        // Trigger reflow for animation
        menu.offsetHeight;
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        positionMenu();

        // Add event listeners
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }, 0);
    };

    // Close menu
    const close = () => {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
        }, 200); // Wait for animation

        // Remove event listeners
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
    };

    // Click outside handler
    const handleClickOutside = (e) => {
        if (!menu.contains(e.target) && e.target !== trigger) {
            close();
        }
    };

    // Escape key handler
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            close();
        }
    };

    // Open menu immediately
    open();

    return {
        open,
        close,
        element: menu
    };
};
