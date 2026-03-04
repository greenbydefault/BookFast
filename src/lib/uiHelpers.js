/**
 * UI Helper Functions
 */

/**
 * Render a list of linked items as pill tags
 * @param {Array} items - List of items (e.g. services, addons)
 * @param {string} type - Type of item ('service', 'object', 'staff', 'addon')
 * @param {number} limit - Max items to show before +N tag
 * @returns {string} HTML string
 */
export const renderLinkedItems = (items, type = 'item', limit = 3) => {
    if (!items) return '<span class="text-muted">-</span>';

    // Ensure items is an array (handle single objects like Many-to-One relations)
    const itemsArray = Array.isArray(items) ? items : [items];

    // Normalize input: sometimes items are directly the entity, sometimes wrapped (e.g. { service_id: ..., services: {...} })
    const normalizedItems = itemsArray.map(item => {
        // If it's a join table result (e.g. addon_services), try to find the nested entity
        if (item.services) return item.services;
        if (item.objects) return item.objects;
        if (item.addons) return item.addons;
        if (item.staff) return item.staff;
        return item; // Fallback or direct entity
    }).filter(Boolean); // Remove nulls

    const displayItems = normalizedItems.slice(0, limit);
    const hasMore = normalizedItems.length > limit;
    const moreCount = normalizedItems.length - limit;

    const pills = displayItems.map(item => `
        <span class="pill-tag pill-${type}">
            ${getInitials(item.name || '?')}
            <span class="tooltip">${item.name}</span>
        </span>
    `).join('');

    const moreTag = hasMore ? `
        <span class="pill-tag pill-more" title="${normalizedItems.slice(limit).map(i => i.name).join(', ')}">
            +${moreCount}
        </span>
    ` : '';

    return `<div class="linked-items-container">${pills}${moreTag}</div>`;
};

/**
 * Get initials from a name (e.g. "Hot Stone Massage" -> "HSM", "Massage" -> "Ma")
 */
const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 1) return parts[0].substring(0, 2);
    return parts.map(p => p[0]).join('').substring(0, 3);
};

/**
 * Global configuration for entity status tabs (Objects, Services, Staff, Addons)
 */
export const ENTITY_STATUS_TABS = [
    { id: 'all', label: 'Alle', icon: 'list' },
    { id: 'active', label: 'Aktiv', icon: 'check' },
    { id: 'draft', label: 'Entwurf', icon: 'square-pen' },
    { id: 'inactive', label: 'Inaktiv', icon: 'stop' }
];

/**
 * Initialize filter toggle functionality
 * Toggles visibility of .zone-filters when clicking #filter-toggle-btn
 */
export const initFilterToggle = () => {
    const btn = document.getElementById('filter-toggle-btn');
    const filters = document.querySelector('.zone-filters');

    if (!btn || !filters) return;
    if (btn.dataset.filterToggleInitialized === 'true') return;
    btn.dataset.filterToggleInitialized = 'true';

    let isAnimating = false;
    let fallbackTimer = null;

    const finishTransition = (isOpening) => {
        if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = null;
        }

        if (isOpening) {
            filters.style.height = 'auto';
            filters.classList.add('is-visible');
        } else {
            filters.style.height = '0px';
            filters.classList.remove('is-visible');
        }

        filters.style.willChange = '';
        isAnimating = false;
    };

    const startTransition = (isOpening) => {
        isAnimating = true;
        filters.style.willChange = 'height';

        if (isOpening) {
            filters.classList.add('is-visible');
            const targetHeight = filters.scrollHeight;
            filters.style.height = '0px';
            filters.offsetHeight;
            filters.style.height = `${targetHeight}px`;
        } else {
            const currentHeight = filters.getBoundingClientRect().height;
            filters.style.height = `${currentHeight}px`;
            filters.offsetHeight;
            filters.classList.remove('is-visible');
            filters.style.height = '0px';
        }

        const onTransitionEnd = (event) => {
            if (event.propertyName !== 'height') return;
            filters.removeEventListener('transitionend', onTransitionEnd);
            finishTransition(isOpening);
        };

        filters.addEventListener('transitionend', onTransitionEnd);

        // Fallback in case transitionend does not fire (e.g. interrupted layout updates).
        fallbackTimer = setTimeout(() => {
            filters.removeEventListener('transitionend', onTransitionEnd);
            finishTransition(isOpening);
        }, 420);
    };

    btn.addEventListener('click', () => {
        if (isAnimating) return;

        const isOpening = !filters.classList.contains('is-visible');
        btn.classList.toggle('active', isOpening);
        startTransition(isOpening);
    });
};
