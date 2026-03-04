/**
 * DetailLayout - Generic 2-column detail page layout
 * 
 * Structure:
 *   [Main Sidebar] [Center Preview] [Side Card (edit fields + meta + actions)]
 * 
 * - Center + Side Card are rendered inside #main-content
 * - No secondary nav injection needed
 */
import './DetailLayout.css';
import { getIconString } from '../Icons/Icon.js';

/**
 * Render the 2-column detail layout
 * 
 * @param {Object} config
 * @param {string} config.centerContent - HTML string for center preview area
 * @param {string} config.sideCardContent - HTML string for the right side card (edit fields + meta + actions)
 * @param {string} [config.breadcrumbHtml] - Optional breadcrumb HTML
 * @param {boolean} [config.showPreviewButton=true] - Show "Vorschau" button above center (false for BookingDetailPage)
 */
export const renderDetailLayout = (config) => {
    const mainContent = document.getElementById('main-content');
    const mainWrapper = document.querySelector('.main-wrapper');
    if (!mainContent) return;

    // Clear top bar actions
    const topBarActions = document.getElementById('top-bar-actions');
    if (topBarActions) topBarActions.innerHTML = '';

    // Update breadcrumb if provided
    if (config.breadcrumbHtml) {
        const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
        if (topBarBreadcrumb) {
            topBarBreadcrumb.innerHTML = config.breadcrumbHtml;
        }
    }

    // Remove any existing sidecard from main-wrapper (from previous detail page)
    const existingSidecard = mainWrapper?.querySelector(':scope > .detail-sidecard');
    if (existingSidecard) existingSidecard.remove();
    mainWrapper?.classList.remove('has-detail-sidecard');

    const showPreviewButton = config.showPreviewButton !== false && config.centerContent;
    const previewBtnHtml = showPreviewButton
        ? `<button type="button" class="detail-preview-btn" aria-label="Live-Vorschau">${getIconString('view-eye-scan')}<span>Vorschau</span></button>`
        : '';

    // Render center content in main-content
    mainContent.innerHTML = `
        <div class="detail-layout">
            ${previewBtnHtml}
            <div class="detail-center" id="detail-center">
                ${config.centerContent || ''}
            </div>
        </div>
    `;

    if (showPreviewButton) {
        const btn = mainContent.querySelector('.detail-preview-btn');
        const center = document.getElementById('detail-center');
        if (btn && center) {
            btn.addEventListener('click', () => center.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        }
    }

    // Inject sidecard as direct child of main-wrapper (full height)
    if (config.sideCardContent && mainWrapper) {
        mainWrapper.classList.add('has-detail-sidecard');
        const sidecard = document.createElement('aside');
        sidecard.className = 'detail-sidecard';
        sidecard.id = 'detail-sidecard';
        sidecard.innerHTML = config.sideCardContent;
        mainWrapper.appendChild(sidecard);
        // Tab switching when sidecard has tabs
        const tabBar = sidecard.querySelector('.detail-sidecard__tabs');
        if (tabBar) {
            sidecard.addEventListener('click', (e) => {
                const tabBtn = e.target.closest('.detail-sidecard__tab');
                if (!tabBtn) return;
                const tabId = tabBtn.getAttribute('data-detail-tab');
                if (!tabId) return;
                sidecard.querySelectorAll('.detail-sidecard__tab').forEach(btn => btn.classList.remove('active'));
                sidecard.querySelectorAll('.detail-sidecard__tab-panel').forEach(panel => panel.classList.remove('detail-sidecard__tab-panel--active'));
                tabBtn.classList.add('active');
                tabBtn.setAttribute('aria-selected', 'true');
                const panel = sidecard.querySelector(`.detail-sidecard__tab-panel[data-detail-tab="${tabId}"]`);
                if (panel) {
                    panel.classList.add('detail-sidecard__tab-panel--active');
                }
                sidecard.querySelectorAll('.detail-sidecard__tab').forEach(btn => {
                    if (btn !== tabBtn) btn.setAttribute('aria-selected', 'false');
                });
            });
        }
    }
};

/**
 * Update only the center preview content
 * @param {string} html - New HTML for the center area
 */
export const updateCenter = (html) => {
    const center = document.getElementById('detail-center');
    if (center) center.innerHTML = html;
};

/**
 * Update only the side card content
 * @param {string} html - New HTML for the side card
 */
export const updateSideCard = (html) => {
    const sideCard = document.getElementById('detail-sidecard');
    if (sideCard) sideCard.innerHTML = html;
};

/**
 * Helper: Render a standard side card info row
 * @param {string} label 
 * @param {string} value 
 * @returns {string} HTML string
 */
export const sideCardRow = (label, value) => `
    <div class="detail-sidecard__row">
        <span class="detail-sidecard__label">${label}</span>
        <span class="detail-sidecard__value">${value || '—'}</span>
    </div>
`;

/**
 * Helper: Render a form field for use inside the side card
 * @param {Object} opts
 * @param {string} opts.label
 * @param {string} opts.name - input name attribute
 * @param {string} [opts.value]
 * @param {string} [opts.type='text'] - input type
 * @param {string} [opts.placeholder]
 * @param {string} [opts.tag='input'] - 'input', 'select', 'textarea'
 * @param {string} [opts.options] - HTML options string for select
 * @returns {string} HTML string
 */
export const navField = (opts) => {
    const type = opts.type || 'text';
    const tag = opts.tag || 'input';
    const value = opts.value || '';
    const placeholder = opts.placeholder || '';
    const cls = opts.className ? `detail-nav-input ${opts.className}` : 'detail-nav-input';

    let inputHtml = '';
    if (tag === 'textarea') {
        inputHtml = `<textarea name="${opts.name}" placeholder="${placeholder}" class="${cls}">${value}</textarea>`;
    } else if (tag === 'select') {
        inputHtml = `<select name="${opts.name}" class="${cls}">${opts.options || ''}</select>`;
    } else {
        inputHtml = `<input type="${type}" name="${opts.name}" value="${value}" placeholder="${placeholder}" class="${cls}">`;
    }

    return `
        <div class="detail-nav-field">
            <label>${opts.label}</label>
            ${inputHtml}
        </div>
    `;
};

/**
 * Helper: Build the complete side card wrapper (inner + header + body with sections)
 * @param {Object} config
 * @param {string} config.title - Header title
 * @param {string[]} config.sections - Array of section HTML strings (from sideCardSection)
 * @returns {string} HTML string
 */
export const buildSideCard = ({ title, sections }) => `
    <div class="detail-sidecard-inner">
        <div class="detail-sidecard__header">
            <h3 class="detail-sidecard__title">${title}</h3>
        </div>
        <div class="detail-sidecard__body">
            ${sections.join('<hr class="detail-nav-divider">')}
        </div>
    </div>
`;

/**
 * Helper: Build side card with tabs (max 3). Each tab has id, label, sections.
 * @param {Object} config
 * @param {string} config.title - Header title
 * @param {{ id: string, label: string, sections: string[] }[]} config.tabs - Array of tabs (sections from sideCardSection)
 * @returns {string} HTML string
 */
export const buildSideCardWithTabs = ({ title, tabs }) => {
    if (!tabs?.length) return buildSideCard({ title, sections: [] });
    const tabBar = `
        <div class="detail-sidecard__tabs" role="tablist">
            ${tabs.map((t, i) => `
                <button type="button" class="detail-sidecard__tab ${i === 0 ? 'active' : ''}" role="tab" data-detail-tab="${t.id}" aria-selected="${i === 0}">${t.label}</button>
            `).join('')}
        </div>
    `;
    const panels = tabs.map((t, i) => `
        <div class="detail-sidecard__tab-panel ${i === 0 ? 'detail-sidecard__tab-panel--active' : ''}" role="tabpanel" data-detail-tab="${t.id}">
            ${t.sections.join('<hr class="detail-nav-divider">')}
        </div>
    `).join('');
    return `
    <div class="detail-sidecard-inner detail-sidecard-inner--tabs">
        <div class="detail-sidecard__header">
            <h3 class="detail-sidecard__title">${title}</h3>
        </div>
        ${tabBar}
        <div class="detail-sidecard__body">
            ${panels}
        </div>
    </div>
    `;
};

/**
 * Helper: Build a single section inside the side card body
 * @param {Object} config
 * @param {string} [config.title] - Optional section title
 * @param {string} config.content - Inner HTML content
 * @returns {string} HTML string
 */
export const sideCardSection = ({ title, content }) => `
    <div class="detail-nav-section">
        ${title ? `<p class="detail-nav-section__title">${title}</p>` : ''}
        ${content}
    </div>
`;

/**
 * Helper: Render loading state in main-content
 * @param {string} message
 */
export const renderDetailLoading = (message = 'Wird geladen...') => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="detail-loading">
                <p>${message}</p>
            </div>
        `;
    }
};

/**
 * Helper: Render error state in main-content
 * @param {string} message
 * @param {Function} onBack
 */
export const renderDetailError = (message, onBack) => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="detail-error">
                <h3>Fehler</h3>
                <p>${message}</p>
                <button class="btn btn-primary" id="detail-error-back">Zurück</button>
            </div>
        `;
        if (onBack) {
            document.getElementById('detail-error-back')?.addEventListener('click', onBack);
        }
    }
};
