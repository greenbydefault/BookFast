import './Button.css';
import { getIconString } from '../Icons/Icon.js';

/**
 * Creates a button element with optional loading state support.
 * 
 * @param {string} text - The button text
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 * @returns {HTMLButtonElement} The button element
 */
export function createButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.className = `btn ${className}`;
    button.innerText = text;
    button.addEventListener('click', onClick);
    return button;
}

/**
 * Creates an action button with loading state support.
 * Returns an object with the button element and methods to control its state.
 * 
 * @param {Object} options - Button configuration
 * @param {string} options.text - Default button text
 * @param {string} options.loadingText - Text shown while loading (e.g., "wird angelegt...")
 * @param {Function} options.onClick - Async click handler
 * @param {string} options.className - Additional CSS classes
 * @param {string} options.icon - Optional icon name to show before text
 * @returns {Object} { element: HTMLButtonElement, setLoading: Function, isLoading: Function }
 */
export function createActionButton(options) {
    const {
        text,
        loadingText = 'Wird ausgeführt...',
        onClick,
        className = '',
        icon = null
    } = options;

    let isLoading = false;
    const button = document.createElement('button');
    button.className = `btn btn-action ${className}`;

    const renderContent = () => {
        if (isLoading) {
            button.innerHTML = `
                <span class="btn-loading-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </span>
                <span class="btn-text">${loadingText}</span>
            `;
            button.disabled = true;
            button.classList.add('is-loading');
        } else {
            const iconHtml = icon ? getIconString(icon) : '';
            button.innerHTML = `${iconHtml}<span class="btn-text">${text}</span>`;
            button.disabled = false;
            button.classList.remove('is-loading');
        }
    };

    const handleClick = async (e) => {
        if (isLoading) return;

        setLoading(true);
        try {
            await onClick(e);
        } finally {
            setLoading(false);
        }
    };

    const setLoading = (loading) => {
        isLoading = loading;
        renderContent();
    };

    button.addEventListener('click', handleClick);
    renderContent();

    return {
        element: button,
        setLoading,
        isLoading: () => isLoading
    };
}
