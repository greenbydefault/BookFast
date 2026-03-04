/**
 * Staff Detail Page - Orchestrator
 * 2-column layout: Center (preview card) | Side Card (edit fields + meta + actions)
 */
import { fetchEntity, fetchEntities, updateEntity, invalidateCache, syncJunctionTable } from '../../lib/dataLayer.js';
import { createMultiSelectTags } from '../../components/MultiSelectTags/MultiSelectTags.js';
import { navigate, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { createActionButton } from '../../components/Button/Button.js';
import {
    renderDetailLayout,
    updateCenter,
    navField,
    buildSideCardWithTabs,
    sideCardSection,
    renderDetailLoading,
    renderDetailError,
} from '../../components/DetailLayout/DetailLayout.js';
import { debounce } from '../../lib/utils.js';

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DAY_IDS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAYS_LONG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const KEY_TO_SHORT = Object.fromEntries(DAY_KEYS.map((k, i) => [k, DAY_IDS[i]]));
const SHORT_TO_KEY = Object.fromEntries(DAY_IDS.map((s, i) => [s, DAY_KEYS[i]]));

// ── Center Preview Card ──

const buildCenterPreview = (staff) => {
    const bookableDays = staff.bookable_days || {};
    const activeDays = DAY_KEYS.filter(k => bookableDays[k]).map(k => DAYS_LONG[DAY_KEYS.indexOf(k)]);
    const linkedServices = staff.linked_services || [];

    return `
        <div class="detail-preview-card">
            <div class="detail-preview-card__header">
                <h2 class="detail-preview-card__title">${esc(staff.name) || 'Neuer Mitarbeiter'}</h2>
                <div style="margin-left: auto; display: flex; align-items: center; gap: 12px;">
                    <div class="autosave-status" id="autosave-status"></div>
                </div>
            </div>

            ${staff.image_url ? `
                <div style="margin-bottom: var(--space-24); text-align: center;">
                    <img src="${esc(staff.image_url)}" alt="${esc(staff.name)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);">
                </div>
            ` : ''}

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Arbeitstage</p>
                <div class="detail-preview-item">
                    <span class="detail-preview-label">Verfügbar</span>
                    <span class="detail-preview-value">${activeDays.length > 0 ? activeDays.join(', ') : '—'}</span>
                </div>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Verknüpfte Services</p>
                ${linkedServices.length > 0 ? linkedServices.map(ls => `
                    <div class="detail-preview-row">
                        <span class="detail-preview-value">${esc(ls.services?.name || '—')}</span>
                    </div>
                `).join('') : '<p style="color: var(--color-stone-400); font-size: 0.85rem;">Keine Services verknüpft</p>'}
            </div>
        </div>
    `;
};

// ── Side Card (edit fields + meta + actions) ──

const renderSideCard = (staff) => {
    const bookableDays = staff.bookable_days || {};

    return buildSideCardWithTabs({
        title: 'Mitarbeiter Details',
        tabs: [
            {
                id: 'details',
                label: 'Details',
                sections: [
                    sideCardSection({
                        title: 'Allgemein',
                        content: `
                            ${navField({ label: 'Name', name: 'name', value: esc(staff.name), placeholder: 'Mitarbeiter-Name' })}
                            ${navField({ label: 'Bild-URL', name: 'image_url', value: esc(staff.image_url), placeholder: 'https://...' })}
                        `
                    }),
                    sideCardSection({
                        title: 'Arbeitstage',
                        content: `
                            <div class="detail-nav-field">
                                <label>Verfügbare Tage</label>
                                <div class="day-toggles" id="day-toggles-container">
                                    ${DAY_IDS.map((day, i) => `
                                        <button class="day-toggle ${bookableDays[DAY_KEYS[i]] ? 'active' : ''}" data-day="${day}" type="button">${day}</button>
                                    `).join('')}
                                </div>
                            </div>
                        `
                    }),
                ],
            },
            {
                id: 'verknuepfungen',
                label: 'Verknüpfungen',
                sections: [
                    sideCardSection({
                        title: 'Verknüpfungen',
                        content: '<div id="link-services-container"></div>'
                    }),
                ],
            },
        ],
    });
};

// ── Collect form values ──

const collectFormValues = () => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return {};

    const activeToggles = [...card.querySelectorAll('#day-toggles-container .day-toggle.active')].map(btn => btn.dataset.day);
    const bookable_days = {};
    DAY_KEYS.forEach((key, i) => {
        bookable_days[key] = activeToggles.includes(DAY_IDS[i]);
    });

    return {
        name: card.querySelector('[name="name"]')?.value || '',
        image_url: card.querySelector('[name="image_url"]')?.value || '',
        bookable_days,
    };
};

// ── Live Preview ──

const setupLivePreview = (staffId, staff, signal) => {
    const card = document.getElementById('detail-sidecard');
    if (!card) return;

    // Initialize debounced save
    const debouncedSave = debounce(() => saveStaff(staffId, staff), 1000);

    const handler = (e) => {
        const values = collectFormValues();
        const merged = { ...staff, ...values };

        // Debounced save
        debouncedSave();

        updateCenter(buildCenterPreview(merged));
    };

    card.addEventListener('input', handler, { signal });
    card.addEventListener('change', handler, { signal });

    card.querySelectorAll('.day-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            handler();
        }, { signal });
    });
};

const saveStaff = async (staffId, staffContext) => {
    const statusEl = document.getElementById('autosave-status');
    if (statusEl) {
        statusEl.innerHTML = '<div class="autosave-spinner"></div><span>Speichert...</span>';
        statusEl.classList.add('visible');
    }

    try {
        const updates = collectFormValues();
        await updateEntity('staff', staffId, updates);
        invalidateCache('staff');

        // Update context object in place
        Object.assign(staffContext, updates);

        if (statusEl) {
            statusEl.innerHTML = '<span>Gespeichert</span>';
            setTimeout(() => {
                statusEl.classList.remove('visible');
            }, 2000);
        }
    } catch (err) {
        console.error(err);
        if (statusEl) statusEl.innerHTML = '<span style="color:var(--color-red-600)">Fehler!</span>';
    }
};

// ── Main Render ──

export const renderStaffDetailPage = (params = {}) => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const staffId = params.id;
    if (!staffId) {
        renderDetailError('Keine Mitarbeiter-ID angegeben.', () => navigate('staff'));
        return;
    }

    const ac = new AbortController();
    const gen = getNavigationGeneration();

    renderDetailLoading('Mitarbeiter wird geladen...');
    loadAndRender(staffId, gen, ac.signal);

    return () => ac.abort();
};

const loadAndRender = async (staffId, gen, signal) => {
    const staff = await fetchEntity('staff', staffId);

    if (gen !== getNavigationGeneration()) return;

    if (!staff) {
        renderDetailError('Mitarbeiter nicht gefunden.', () => navigate('staff'));
        return;
    }

    renderDetailLayout({
        centerContent: buildCenterPreview(staff),
        sideCardContent: renderSideCard(staff),
        breadcrumbHtml: `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('user')} <a href="#" class="breadcrumb-link" data-nav="staff">Mitarbeiter</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('user')} ${esc(staff.name)}</span>
        `,
    });

    setupLivePreview(staffId, staff, signal);

    // Load all services for link selector
    const servicesResult = await fetchEntities('services', { perPage: 999 });
    const allServices = servicesResult.items;

    const serviceContainer = document.getElementById('link-services-container');
    if (serviceContainer) {
        const serviceSelect = createMultiSelectTags({
            label: 'Services', icon: 'list',
            placeholder: 'Service hinzufügen...',
            options: allServices.map(s => ({ value: s.id, label: s.name })),
            selectedValues: (staff.linked_services || []).map(ls => ls.service_id),
            onChange: async (ids) => {
                await syncJunctionTable('staff_services', 'staff_id', staffId, 'service_id', ids);
                staff.linked_services = ids.map(id => {
                    const found = allServices.find(s => s.id === id);
                    return { service_id: id, services: found ? { id: found.id, name: found.name } : { id, name: '—' } };
                });
                const values = collectFormValues();
                updateCenter(buildCenterPreview({ ...staff, ...values }));
                // Trigger save on link change
                saveStaff(staffId, staff);
            }
        });
        serviceContainer.appendChild(serviceSelect.element);
    }

    // Breadcrumb nav
    document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        navigate(link.dataset.nav === 'home' ? 'bookings' : 'staff');
    }, { signal });

    // Footer actions removed (auto-save)

};
