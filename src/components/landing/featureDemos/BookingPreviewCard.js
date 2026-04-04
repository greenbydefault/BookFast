/**
 * BookingPreviewCard – Landing-only mirror of the bookings inbox + decision flow.
 * Keeps the interaction focused: queue, magic link handoff, review actions.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const FILTERS = [
  { id: 'pending_approval', label: 'Wartend' },
  { id: 'confirmed', label: 'Bestätigt' },
  { id: 'completed', label: 'Abgeschlossen' },
];

const INITIAL_BOOKINGS = [
  {
    id: 'bk-1',
    customer: 'Lena M.',
    object: 'Studio Nordlicht',
    service: 'Portrait Shooting',
    slot: 'Heute, 14:00-15:30',
    amount: '198 EUR',
    status: 'pending_approval',
    paymentStatus: 'paid',
    source: 'Widget',
  },
  {
    id: 'bk-2',
    customer: 'Tom B.',
    object: 'Meetingraum A',
    service: 'Strategieberatung',
    slot: 'Morgen, 09:30-11:00',
    amount: '199 EUR',
    status: 'pending_approval',
    paymentStatus: 'unpaid',
    source: 'Manuell',
  },
  {
    id: 'bk-3',
    customer: 'Sara K.',
    object: 'Podcast Studio',
    service: 'Podcast Aufnahme',
    slot: 'Freitag, 16:00-17:00',
    amount: '89 EUR',
    status: 'confirmed',
    paymentStatus: 'paid',
    source: 'Widget',
  },
];

const STATUS_META = {
  pending_approval: { label: 'Wartend', tone: 'pending' },
  confirmed: { label: 'Bestätigt', tone: 'confirmed' },
  completed: { label: 'Abgeschlossen', tone: 'completed' },
  cancelled: { label: 'Abgelehnt', tone: 'cancelled' },
};

const PAYMENT_META = {
  paid: { label: 'Bezahlt', tone: 'confirmed' },
  unpaid: { label: 'Offen', tone: 'pending' },
  refunded: { label: 'Erstattet', tone: 'cancelled' },
};

const cloneBookings = () => INITIAL_BOOKINGS.map((booking) => ({ ...booking }));

const renderBookingRow = (booking, selectedId) => {
  const status = STATUS_META[booking.status] || STATUS_META.pending_approval;
  return `
    <button
      type="button"
      class="booking-demo__row ${booking.id === selectedId ? 'is-active' : ''}"
      data-booking-id="${booking.id}"
    >
      <div class="booking-demo__row-main">
        <div>
          <p class="booking-demo__row-title">${booking.customer}</p>
          <p class="booking-demo__row-subtitle">${booking.service} · ${booking.object}</p>
        </div>
        <span class="booking-demo__badge booking-demo__badge--${status.tone}">${status.label}</span>
      </div>
      <div class="booking-demo__row-meta">
        <span>${booking.slot}</span>
        <span>${booking.amount}</span>
      </div>
    </button>
  `;
};

export const createBookingPreviewCard = () => `
  <div class="feature-demo-card" id="booking-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Buchungen</h3>
        <p class="feature-demo-card__subtitle">Wie im Dashboard: Eingang, Freigabe und Portal-Handoff in einem Flow.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="feature-demo-card__body" id="booking-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">Später prüfen</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">Neue Buchung</button>
    </div>
  </div>
`;

export const initBookingPreviewCard = (heroContainer) => {
  const body = heroContainer.querySelector('#booking-preview-body');
  if (!body) return;

  const state = {
    activeFilter: 'pending_approval',
    selectedId: INITIAL_BOOKINGS[0].id,
    sentMagicLink: false,
    bookings: cloneBookings(),
  };

  const getVisibleBookings = () => state.bookings.filter((booking) => booking.status === state.activeFilter);

  const getSelectedBooking = () => {
    const visible = getVisibleBookings();
    const selectedVisible = visible.find((booking) => booking.id === state.selectedId);
    if (selectedVisible) return selectedVisible;
    const fallback = visible[0] || state.bookings[0];
    state.selectedId = fallback?.id || '';
    return fallback;
  };

  const render = () => {
    const visible = getVisibleBookings();
    const selected = getSelectedBooking();
    const status = STATUS_META[selected?.status] || STATUS_META.pending_approval;
    const payment = PAYMENT_META[selected?.paymentStatus] || PAYMENT_META.unpaid;

    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="bk-inbox">
        <p class="bk-preview-section-label">${getIconString('list')} Eingang & Status</p>
        <div class="booking-demo__filter-row">
          ${FILTERS.map((filter) => `
            <button
              type="button"
              class="booking-demo__filter ${state.activeFilter === filter.id ? 'is-active' : ''}"
              data-booking-filter="${filter.id}"
            >${filter.label}</button>
          `).join('')}
        </div>
        <div class="booking-demo__rows">
          ${visible.length
            ? visible.map((booking) => renderBookingRow(booking, state.selectedId)).join('')
            : `<div class="booking-demo__empty">Keine Buchungen in diesem Status.</div>`}
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="bk-magic-link">
        <p class="bk-preview-section-label">${getIconString('key')} Manuell anlegen & Magic Link</p>
        <div class="booking-demo__handoff">
          <div class="booking-demo__handoff-card">
            <span class="booking-demo__mini-label">Auslöser</span>
            <strong>${selected?.source === 'Manuell' ? 'Manuelle Buchung' : 'Widget-Buchung'}</strong>
            <p>${selected?.source === 'Manuell'
              ? 'Nach dem Anlegen geht die Mail direkt raus.'
              : 'Auch Widget-Buchungen landen im selben Flow.'}</p>
          </div>
          <div class="booking-demo__handoff-arrow" aria-hidden="true">${getIconString('arrow-down')}</div>
          <div class="booking-demo__handoff-card booking-demo__handoff-card--accent">
            <span class="booking-demo__mini-label">Kundenportal</span>
            <strong>${state.sentMagicLink ? 'Magic Link versendet' : 'Magic Link bereit'}</strong>
            <p>${state.sentMagicLink
              ? 'Kunde sieht Rechnung, Zahlung und Status sofort im Portal.'
              : 'Ein Klick reicht, damit der Kunde selbst weiterkommt.'}</p>
          </div>
        </div>
        <button type="button" class="booking-demo__link-btn" id="booking-demo-send-link">
          ${state.sentMagicLink ? 'Erneut senden' : 'Magic Link senden'}
        </button>
      </div>

      <div class="modal-content-section" data-demo-section="bk-review">
        <p class="bk-preview-section-label">${getIconString('check')} Prüfen & Entscheiden</p>
        <div class="booking-demo__detail-card">
          <div class="booking-demo__detail-top">
            <div>
              <p class="booking-demo__detail-title">${selected?.customer || 'Keine Buchung ausgewählt'}</p>
              <p class="booking-demo__detail-subtitle">${selected?.slot || ''}</p>
            </div>
            <div class="booking-demo__detail-badges">
              <span class="booking-demo__badge booking-demo__badge--${status.tone}">${status.label}</span>
              <span class="booking-demo__badge booking-demo__badge--${payment.tone}">${payment.label}</span>
            </div>
          </div>
          <div class="booking-demo__detail-grid">
            <div><span>Objekt</span><strong>${selected?.object || '-'}</strong></div>
            <div><span>Service</span><strong>${selected?.service || '-'}</strong></div>
            <div><span>Betrag</span><strong>${selected?.amount || '-'}</strong></div>
            <div><span>Quelle</span><strong>${selected?.source || '-'}</strong></div>
          </div>
          <div class="booking-demo__detail-actions">
            <button type="button" class="booking-demo__action" id="booking-demo-decline">Ablehnen</button>
            <button type="button" class="booking-demo__action booking-demo__action--primary" id="booking-demo-approve">Bestätigen</button>
          </div>
          <p class="booking-demo__detail-note">
            ${selected?.paymentStatus === 'refunded'
              ? 'Refund wurde automatisch angestoßen.'
              : 'Nach Bestätigung läuft Mail + Portal-Handoff automatisch weiter.'}
          </p>
        </div>
      </div>
    `;

    body.querySelectorAll('[data-booking-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        state.activeFilter = button.dataset.bookingFilter || 'pending_approval';
        render();
      });
    });

    body.querySelectorAll('[data-booking-id]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedId = button.dataset.bookingId || '';
        render();
      });
    });

    body.querySelector('#booking-demo-send-link')?.addEventListener('click', () => {
      state.sentMagicLink = true;
      render();
    });

    body.querySelector('#booking-demo-approve')?.addEventListener('click', () => {
      const selectedBooking = state.bookings.find((booking) => booking.id === state.selectedId);
      if (!selectedBooking) return;
      selectedBooking.status = 'confirmed';
      if (selectedBooking.paymentStatus === 'unpaid') {
        selectedBooking.paymentStatus = 'paid';
      }
      state.sentMagicLink = true;
      state.activeFilter = 'confirmed';
      render();
    });

    body.querySelector('#booking-demo-decline')?.addEventListener('click', () => {
      const selectedBooking = state.bookings.find((booking) => booking.id === state.selectedId);
      if (!selectedBooking) return;
      selectedBooking.status = 'cancelled';
      selectedBooking.paymentStatus = selectedBooking.paymentStatus === 'paid' ? 'refunded' : 'unpaid';
      state.activeFilter = 'pending_approval';
      render();
    });
  };

  render();
};
