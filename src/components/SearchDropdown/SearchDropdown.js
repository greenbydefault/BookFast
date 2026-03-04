/**
 * SearchDropdown - Reusable typeahead / autocomplete component
 *
 * Usage:
 *   const search = new SearchDropdown({
 *       container: document.getElementById('my-container'),
 *       placeholder: 'Suchen ...',
 *       onSearch: async (query) => [{ id, primary, secondary, data }],
 *       onSelect: (item) => { ... },
 *   });
 *
 *   search.destroy();   // cleanup
 *   search.clear();     // reset input + close
 */

import './SearchDropdown.css';
import { getIconString } from '../Icons/Icon.js';

export class SearchDropdown {
    /**
     * @param {Object} opts
     * @param {HTMLElement}   opts.container    - DOM element to render into
     * @param {string}        [opts.placeholder] - input placeholder
     * @param {Function}      opts.onSearch     - async (query) => Array<{ id, primary, secondary, data }>
     * @param {Function}      opts.onSelect     - (item) => void
     * @param {number}        [opts.debounceMs] - debounce delay in ms (default 200)
     */
    constructor({ container, placeholder = 'Suchen ...', onSearch, onSelect, debounceMs = 200 }) {
        this.container = container;
        this.placeholder = placeholder;
        this.onSearch = onSearch;
        this.onSelect = onSelect;
        this.debounceMs = debounceMs;

        this.isOpen = false;
        this.results = [];
        this.loading = false;
        this._debounceTimer = null;

        this._build();
        this._attachEvents();
    }

    /* ---- DOM Construction ---- */

    _build() {
        this.container.classList.add('search-dropdown');
        this.container.innerHTML = '';

        // Input wrapper
        this.inputWrapper = document.createElement('div');
        this.inputWrapper.className = 'search-dropdown-input-wrapper';
        this.inputWrapper.innerHTML = getIconString('search');

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'search-dropdown-input';
        this.input.placeholder = this.placeholder;
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('autocorrect', 'off');
        this.input.setAttribute('autocapitalize', 'off');
        this.input.setAttribute('spellcheck', 'false');
        this.input.setAttribute('name', 'search-dropdown-' + Date.now());
        this.inputWrapper.appendChild(this.input);

        // Clear button (hidden initially)
        this.clearBtn = document.createElement('button');
        this.clearBtn.type = 'button';
        this.clearBtn.className = 'search-dropdown-clear';
        this.clearBtn.innerHTML = getIconString('close');
        this.clearBtn.style.display = 'none';
        this.inputWrapper.appendChild(this.clearBtn);

        // Results panel
        this.resultsPanel = document.createElement('div');
        this.resultsPanel.className = 'search-dropdown-results';

        this.container.appendChild(this.inputWrapper);
        this.container.appendChild(this.resultsPanel);
    }

    /* ---- Events ---- */

    _attachEvents() {
        this.input.addEventListener('input', () => this._onInput());
        this.input.addEventListener('focus', () => {
            if (this.input.value.trim().length > 0 && this.results.length > 0) {
                this._open();
            }
        });
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this._close();
                this.input.blur();
            }
        });

        this.clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clear();
        });

        this._outsideClickHandler = (e) => {
            if (!this.container.contains(e.target)) {
                this._close();
            }
        };
        document.addEventListener('click', this._outsideClickHandler);
    }

    _onInput() {
        const query = this.input.value.trim();

        // Show / hide clear button
        this.clearBtn.style.display = query.length > 0 ? 'flex' : 'none';

        if (query.length < 1) {
            this._close();
            this.results = [];
            return;
        }

        // Debounce
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => this._search(query), this.debounceMs);
    }

    async _search(query) {
        this.loading = true;
        this._renderLoading();
        this._open();

        try {
            this.results = await this.onSearch(query);
        } catch (err) {
            console.error('SearchDropdown: search failed', err);
            this.results = [];
        }

        this.loading = false;
        this._renderResults(query);
    }

    /* ---- Rendering ---- */

    _open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.resultsPanel.classList.add('is-open');
    }

    _close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.resultsPanel.classList.remove('is-open');
    }

    _renderLoading() {
        this.resultsPanel.innerHTML = `
            <div class="search-dropdown-loading">Suche …</div>
        `;
    }

    _renderResults(query) {
        if (this.results.length === 0) {
            this.resultsPanel.innerHTML = `
                <div class="search-dropdown-empty">Keine Ergebnisse</div>
            `;
            this._open();
            return;
        }

        this.resultsPanel.innerHTML = '';
        this.results.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'search-dropdown-item';
            el.innerHTML = `
                <span class="search-dropdown-item-primary">${this._highlight(item.primary, query)}</span>
                ${item.secondary ? `<span class="search-dropdown-item-secondary">${this._highlight(item.secondary, query)}</span>` : ''}
            `;
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.input.value = item.primary;
                this.clearBtn.style.display = 'flex';
                this._close();
                this.onSelect(item);
            });
            this.resultsPanel.appendChild(el);
        });
    }

    /**
     * Highlight matching portions of text (case-insensitive).
     */
    _highlight(text, query) {
        if (!query) return this._escapeHtml(text);
        const escaped = this._escapeHtml(text);
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escaped.replace(regex, '<span class="search-dropdown-highlight">$1</span>');
    }

    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /* ---- Public API ---- */

    clear() {
        this.input.value = '';
        this.clearBtn.style.display = 'none';
        this.results = [];
        this._close();
    }

    setValue(value) {
        this.input.value = value;
        this.clearBtn.style.display = value ? 'flex' : 'none';
    }

    destroy() {
        clearTimeout(this._debounceTimer);
        document.removeEventListener('click', this._outsideClickHandler);
        this.container.innerHTML = '';
        this.container.classList.remove('search-dropdown');
    }
}
