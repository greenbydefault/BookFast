/**
 * Customer Detail Page - Read-only
 * 2-column layout: Center (booking history) | Side Card (contact info + stats)
 */
import { supabase } from '../../lib/supabaseClient.js';
import { navigate, getNavigationGeneration } from '../../lib/router.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { formatDate } from '../../lib/dateUtils.js';
import {
    renderDetailLayout,
    buildSideCardWithTabs,
    sideCardSection,
    sideCardRow,
    renderDetailLoading,
    renderDetailError,
} from '../../components/DetailLayout/DetailLayout.js';
import { getState } from '../../lib/store.js';
import { DEMO_DATA } from '../../lib/DemoData.js';

const esc = (v) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const STATUS_LABELS = {
    confirmed: 'Bestätigt',
    pending: 'Ausstehend',
    cancelled: 'Storniert',
    rejected: 'Abgelehnt',
};

const STATUS_CLASSES = {
    confirmed: 'badge-success',
    pending: 'badge-warning',
    cancelled: 'badge-danger',
    rejected: 'badge-danger',
};

const buildCenterPreview = (customer, bookings) => {
    const rows = bookings.length > 0
        ? bookings.map(b => `
            <tr class="clickable-row" data-booking-id="${b.id}">
                <td>${b.booking_number || '—'}</td>
                <td>${esc(b.services?.name || '—')}</td>
                <td>${esc(b.objects?.name || '—')}</td>
                <td>${formatDate(b.start_time)}</td>
                <td><span class="badge ${STATUS_CLASSES[b.status] || ''}">${STATUS_LABELS[b.status] || b.status}</span></td>
            </tr>
        `).join('')
        : '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-stone-400);">Keine Buchungen vorhanden</td></tr>';

    return `
        <div class="detail-preview-card">
            <div class="detail-preview-card__header">
                <h2 class="detail-preview-card__title">${esc(customer.customer_name) || 'Unbekannter Kunde'}</h2>
            </div>

            <div class="detail-preview-section">
                <p class="detail-preview-section__title">Buchungshistorie (${bookings.length})</p>
                <div class="data-table-wrapper" style="border: none; box-shadow: none;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nr.</th>
                                <th>Service</th>
                                <th>Objekt</th>
                                <th>Datum</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

const renderSideCard = (customer) => buildSideCardWithTabs({
    title: 'Kunden-Details',
    tabs: [
        {
            id: 'kontakt',
            label: 'Kontakt',
            sections: [
                sideCardSection({
                    title: 'Kontakt',
                    content: `
                        ${sideCardRow('Name', esc(customer.customer_name))}
                        ${sideCardRow('E-Mail', esc(customer.customer_email))}
                        ${sideCardRow('Telefon', esc(customer.customer_phone))}
                    `
                }),
            ],
        },
        {
            id: 'statistik',
            label: 'Statistik',
            sections: [
                sideCardSection({
                    title: 'Statistik',
                    content: `
                        ${sideCardRow('Buchungen', customer.booking_count)}
                        ${sideCardRow('Letzte Buchung', formatDate(customer.last_booking))}
                    `
                }),
            ],
        },
    ],
});

export const renderCustomerDetailPage = (params = {}) => {
    const email = params.id ? decodeURIComponent(params.id) : null;
    if (!email) {
        renderDetailError('Keine Kunden-E-Mail angegeben.', () => navigate('customers'));
        return;
    }

    const ac = new AbortController();
    const gen = getNavigationGeneration();

    renderDetailLoading('Kunde wird geladen...');
    loadAndRender(email, gen, ac.signal);

    return () => ac.abort();
};

const loadAndRender = async (email, gen, signal) => {
    const state = getState();

    let bookings;
    let customer;

    if (state.isDemoMode) {
        bookings = DEMO_DATA.bookings.filter(b => b.customer_email === email)
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        const cust = DEMO_DATA.customers.find(c => c.customer_email === email);
        if (!bookings.length && !cust) {
            renderDetailError('Kunde nicht gefunden.', () => navigate('customers'));
            return;
        }
        const first = bookings[0] || {};
        customer = {
            customer_name: cust?.customer_name || first.customer_name || email,
            customer_email: email,
            customer_phone: cust?.customer_phone || first.customer_phone || '-',
            booking_count: cust?.booking_count || bookings.length,
            last_booking: cust?.last_booking || first.start_time,
        };
    } else {
        const workspaceId = state.currentWorkspace?.id;
        if (!workspaceId) {
            renderDetailError('Kein Workspace ausgewählt.', () => navigate('customers'));
            return;
        }

        const { data, error } = await supabase
            .from('bookings')
            .select('id, booking_number, customer_name, customer_email, customer_phone, start_time, end_time, status, services(name, service_type), objects(name)')
            .eq('workspace_id', workspaceId)
            .eq('customer_email', email)
            .order('start_time', { ascending: false });

        if (gen !== getNavigationGeneration()) return;

        if (error) {
            renderDetailError('Fehler beim Laden der Kundendaten.', () => navigate('customers'));
            return;
        }

        if (!data || data.length === 0) {
            renderDetailError('Kunde nicht gefunden.', () => navigate('customers'));
            return;
        }

        bookings = data;
        const first = bookings[0];
        customer = {
            customer_name: first.customer_name,
            customer_email: first.customer_email,
            customer_phone: first.customer_phone,
            booking_count: bookings.length,
            last_booking: bookings[0].start_time,
        };
    }

    renderDetailLayout({
        centerContent: buildCenterPreview(customer, bookings),
        sideCardContent: renderSideCard(customer),
        breadcrumbHtml: `
            <span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('user-square')} <a href="#" class="breadcrumb-link" data-nav="customers">Kunden</a></span>
            <span class="breadcrumb-separator">${getIconString('arrow-down')}</span>
            <span class="breadcrumb-item">${getIconString('user')} ${esc(customer.customer_name || customer.customer_email)}</span>
        `,
    });

    const sidecard = document.getElementById('detail-sidecard');
    if (sidecard && signal) {
        signal.addEventListener('abort', () => {});
    }

    // Breadcrumb nav
    document.getElementById('top-bar-breadcrumb')?.addEventListener('click', (e) => {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        navigate(link.dataset.nav === 'home' ? 'home' : 'customers');
    }, { signal });

    // Click on booking row -> navigate to booking detail
    document.querySelectorAll('.clickable-row[data-booking-id]').forEach(row => {
        row.addEventListener('click', () => {
            navigate('booking-detail', { id: row.dataset.bookingId });
        }, { signal });
    });
};
