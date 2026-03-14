/**
 * MultiSelectTags Component
 * A reusable component for selecting multiple items and displaying them as removable tags.
 * 
 * Usage:
 * const multiSelect = createMultiSelectTags({
 *   label: 'Zugehöriges Objekt',
 *   icon: 'package',
 *   placeholder: 'Objekt auswählen...',
 *   options: [{ value: 'uuid-1', label: 'Villa Nord' }, ...],
 *   selectedValues: ['uuid-1'],
 *   onChange: (selectedValues) => { ... }
 * });
 * container.appendChild(multiSelect.element);
 * 
 * // To update options dynamically:
 * multiSelect.setOptions(newOptions);
 * 
 * // To get current selection:
 * const selected = multiSelect.getSelectedValues();
 */

import { getIconString } from '../Icons/Icon.js';

/**
 * Creates a multi-select tags component
 * @param {Object} config - Configuration object
 * @param {string} config.label - Label text for the field
 * @param {string} [config.icon] - Optional icon name
 * @param {string} [config.placeholder] - Placeholder text for the dropdown
 * @param {Array<{value: string, label: string}>} config.options - Available options
 * @param {Array<string>} [config.selectedValues] - Initially selected values
 * @param {Function} [config.onChange] - Callback when selection changes
 * @returns {Object} Component instance with element, setOptions, getSelectedValues methods
 */
export const createMultiSelectTags = (config) => {
    const {
        label = 'Auswählen',
        icon = null,
        placeholder = 'Auswählen...',
        options = [],
        selectedValues = [],
        onChange = () => { }
    } = config;

    let currentOptions = [...options];
    let currentSelected = [...selectedValues];

    // Create main container
    const container = document.createElement('div');
    container.className = 'multi-select-tags';

    // Render the component
    const render = () => {
        const availableOptions = currentOptions.filter(
            opt => !currentSelected.includes(opt.value)
        );

        container.innerHTML = `
            <div class="multi-select-row">
                <div class="multi-select-label modal-label">
                    ${icon ? getIconString(icon) : ''} ${label}
                </div>
                <div class="multi-select-dropdown-wrapper">
                    <select class="multi-select-dropdown" ${availableOptions.length === 0 ? 'disabled' : ''}>
                        <option value="" disabled selected>${placeholder}</option>
                        ${availableOptions.map(opt => `
                            <option value="${opt.value}">${opt.label}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            <div class="multi-select-tags-container">
                ${currentSelected.map(value => {
            const option = currentOptions.find(o => o.value === value);
            if (!option) return '';
            return `
                        <span class="multi-select-tag" data-value="${value}">
                            ${option.label}
                            <button class="multi-select-tag-remove" data-value="${value}" type="button">×</button>
                        </span>
                    `;
        }).join('')}
            </div>
        `;

        // Attach event listeners
        const dropdown = container.querySelector('.multi-select-dropdown');
        if (dropdown) {
            dropdown.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value && !currentSelected.includes(value)) {
                    currentSelected.push(value);
                    onChange(currentSelected);
                    render();
                }
            });
        }

        // Remove tag listeners
        container.querySelectorAll('.multi-select-tag-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = btn.dataset.value;
                currentSelected = currentSelected.filter(v => v !== value);
                onChange(currentSelected);
                render();
            });
        });
    };

    // Initial render
    render();

    // Public API
    return {
        element: container,

        /**
         * Update the available options
         * @param {Array<{value: string, label: string}>} newOptions 
         */
        setOptions: (newOptions) => {
            currentOptions = [...newOptions];
            render();
        },

        /**
         * Get currently selected values
         * @returns {Array<string>}
         */
        getSelectedValues: () => [...currentSelected],

        /**
         * Set selected values programmatically
         * @param {Array<string>} values 
         */
        setSelectedValues: (values) => {
            currentSelected = [...values];
            render();
        },

        /**
         * Force re-render
         */
        refresh: () => render()
    };
};
