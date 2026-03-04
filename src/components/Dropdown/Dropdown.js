import './Dropdown.css';
import { getIconString } from '../Icons/Icon.js';

/**
 * Generate a deterministic color from a string (workspace name).
 * Returns an HSL color string.
 */
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 45%, 55%)`;
};

/**
 * Generate a workspace icon with initials on a dark rounded square.
 */
const renderWorkspaceIcon = (label) => {
    const initials = label
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    const accentColor = stringToColor(label);
    return `
        <span class="dropdown-item-icon" style="background: var(--color-vulcan-900);">
            <span class="dropdown-item-icon-accent" style="color: ${accentColor};">${initials}</span>
        </span>
    `;
};

/**
 * Render avatar circle with initial(s) or logo image. Background colour is set via CSS variable.
 */
export const renderUserAvatar = (label, logoUrl = null) => {
    if (logoUrl) {
        return `
            <span class="dropdown-trigger-avatar" style="background: transparent; padding: 0;">
                <img src="${logoUrl}" alt="${label}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;" />
            </span>
        `;
    }
    const initial = (label || '?').charAt(0).toUpperCase();
    const color = stringToColor(label || '');
    return `
        <span class="dropdown-trigger-avatar" style="--dropdown-avatar-bg: ${color}">${initial}</span>
    `;
};

export class Dropdown {
    constructor({ container, options, selectedValue, onSelect, placeholder = 'Select...', triggerLabel, triggerPrefix, menuPosition = 'down' }) {
        this.container = container;
        this.options = options;
        this.selectedValue = selectedValue;
        this.onSelect = onSelect;
        this.placeholder = placeholder;
        this.triggerLabel = triggerLabel;
        this.triggerPrefix = triggerPrefix;
        this.menuPosition = menuPosition;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.container.classList.add('dropdown-container');
        if (this.menuPosition === 'up') {
            this.container.classList.add('dropdown-container--menu-up');
        }
        this.render();
        this.attachEvents();
    }

    get selectedOption() {
        return this.options.find(opt => opt.value === this.selectedValue);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.updateState();
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.updateState();
    }

    updateState() {
        const trigger = this.container.querySelector('.dropdown-trigger');
        const menu = this.container.querySelector('.dropdown-menu');

        if (!trigger || !menu) return;

        if (this.isOpen) {
            trigger.classList.add('is-open');
            menu.classList.add('is-open');
        } else {
            trigger.classList.remove('is-open');
            menu.classList.remove('is-open');
        }
    }

    select(value) {
        const option = this.options.find(opt => opt.value === value);
        const isAction = option?.isAction || value === 'new';
        const isCustomTrigger = this.triggerLabel !== undefined;

        if (!isAction && !isCustomTrigger) {
            this.selectedValue = value;
            // Update trigger label
            const label = this.container.querySelector('.dropdown-label');
            if (label) {
                label.textContent = option?.label || this.placeholder;
            }
            // Update selected state on items
            this.container.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.remove('is-selected');
                // Hide/show checkmark
                const check = item.querySelector('.dropdown-item-check');
                if (check) check.style.display = 'none';
            });
            const items = this.container.querySelectorAll('.dropdown-item:not(.is-action)');
            const idx = this.options.filter(o => !o.isAction && o.value !== 'new').findIndex(o => o.value === value);
            if (idx >= 0 && items[idx]) {
                items[idx].classList.add('is-selected');
                const check = items[idx].querySelector('.dropdown-item-check');
                if (check) check.style.display = '';
            }
        }

        this.isOpen = false;
        this.updateState();
        this.onSelect(value);
    }

    render() {
        this.container.innerHTML = '';

        const selected = this.selectedOption;
        const displayLabel = this.triggerLabel !== undefined ? this.triggerLabel : (selected ? selected.label : this.placeholder);
        const prefixHtml = this.triggerPrefix !== undefined ? this.triggerPrefix : '';

        // Trigger
        const trigger = document.createElement('div');
        trigger.className = 'dropdown-trigger';
        trigger.innerHTML = `
            ${prefixHtml}
            <span class="dropdown-label">
                ${displayLabel}
            </span>
            <div class="dropdown-trigger-icon">
                ${getIconString('arrow-up-down')}
            </div>
        `;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Menu
        const menu = document.createElement('div');
        menu.className = this.menuPosition === 'up' ? 'dropdown-menu dropdown-menu--up' : 'dropdown-menu';

        // Workspace items section
        const itemsSection = document.createElement('div');
        itemsSection.className = 'dropdown-items-section';

        let actionItems = [];

        this.options.forEach(option => {
            const isAction = option.value === 'new' || option.isAction;

            if (isAction) {
                actionItems.push(option);
                return;
            }

            if (option.dividerBefore) {
                const divider = document.createElement('div');
                divider.className = 'dropdown-divider';
                itemsSection.appendChild(divider);
            }

            const item = document.createElement('div');
            const isSelected = this.selectedValue === option.value;
            item.className = `dropdown-item ${isSelected ? 'is-selected' : ''}`;

            // Build item content: icon + label + checkmark + shortcut
            let iconHtml = '';
            if (option.hideIcon) {
                iconHtml = '';
            } else if (option.icon) {
                iconHtml = `<span class="dropdown-item-icon-wrap">${getIconString(option.icon)}</span>`;
            } else {
                iconHtml = renderWorkspaceIcon(option.label);
            }

            const checkHtml = isSelected
                ? `<span class="dropdown-item-check">${getIconString('check')}</span>`
                : `<span class="dropdown-item-check" style="display:none;">${getIconString('check')}</span>`;

            const shortcutHtml = option.shortcut
                ? `<span class="dropdown-item-shortcut">${option.shortcut}</span>`
                : '';

            item.innerHTML = `
                ${iconHtml}
                <span class="dropdown-item-label">${option.label}</span>
                ${checkHtml}
                ${shortcutHtml}
            `;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.select(option.value);
            });

            itemsSection.appendChild(item);
        });

        menu.appendChild(itemsSection);

        // Action items (e.g. "+ New account")
        if (actionItems.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'dropdown-divider';
            menu.appendChild(divider);

            actionItems.forEach(option => {
                const item = document.createElement('div');
                item.className = 'dropdown-item is-action';

                const shortcutHtml = option.shortcut
                    ? `<span class="dropdown-item-shortcut">${option.shortcut}</span>`
                    : '';

                item.innerHTML = `
                    <span class="dropdown-item-action-icon">${getIconString('plus')}</span>
                    <span class="dropdown-item-label">${option.label}</span>
                    ${shortcutHtml}
                `;

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.select(option.value);
                });

                menu.appendChild(item);
            });
        }

        this.container.appendChild(trigger);
        this.container.appendChild(menu);

        this.updateState();
    }

    attachEvents() {
        this.closeHandler = (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        };
        document.addEventListener('click', this.closeHandler);
    }

    destroy() {
        document.removeEventListener('click', this.closeHandler);
        this.container.innerHTML = '';
    }
}
