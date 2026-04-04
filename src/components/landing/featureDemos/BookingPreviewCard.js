/**
 * BookingPreviewCard – Landing-only mirror of the bookings inbox + decision flow.
 * Keeps the interaction focused: queue, magic link handoff, review actions.
 */
import { getIconString } from '../../Icons/Icon.js';
import './featureDemos.css';

const DEFAULT_CONTENT = {
  card: {
    title: 'Buchungen',
    subtitle: 'Wie im Dashboard: Eingang, Freigabe und Portal-Handoff in einem Flow.',
    closeLabel: 'Schließen',
    footerSecondary: 'Später prüfen',
    footerPrimary: 'Neue Buchung',
  },
  filters: [
    { id: 'pending_approval', label: 'Wartend' },
    { id: 'confirmed', label: 'Bestätigt' },
    { id: 'completed', label: 'Abgeschlossen' },
  ],
  bookings: [],
  statuses: {
    pending_approval: { label: 'Wartend', tone: 'pending' },
    confirmed: { label: 'Bestätigt', tone: 'confirmed' },
    completed: { label: 'Abgeschlossen', tone: 'completed' },
    cancelled: { label: 'Abgelehnt', tone: 'cancelled' },
  },
  paymentStatuses: {
    paid: { label: 'Bezahlt', tone: 'confirmed' },
    unpaid: { label: 'Offen', tone: 'pending' },
    refunded: { label: 'Erstattet', tone: 'cancelled' },
  },
  sections: {
    inbox: 'Eingang & Status',
    magicLink: 'Manuell anlegen & Magic Link',
    review: 'Prüfen & Entscheiden',
  },
  emptyState: 'Keine Buchungen in diesem Status.',
  labels: {
    trigger: 'Auslöser',
    portal: 'Kundenportal',
    object: 'Objekt',
    service: 'Service',
    amount: 'Betrag',
    source: 'Quelle',
    noSelection: 'Keine Buchung ausgewählt',
  },
  sourceLabels: {
    manual: 'Manuelle Buchung',
    widget: 'Widget-Buchung',
  },
  magicLinkState: {
    ready: 'Magic Link bereit',
    sent: 'Magic Link versendet',
    actionReady: 'Magic Link senden',
    actionSent: 'Erneut senden',
    manualDescription: 'Nach dem Anlegen geht die Mail direkt raus.',
    widgetDescription: 'Auch Widget-Buchungen landen im selben Flow.',
    portalReady: 'Ein Klick reicht, damit der Kunde selbst weiterkommt.',
    portalSent: 'Kunde sieht Rechnung, Zahlung und Status sofort im Portal.',
  },
  actions: {
    decline: 'Ablehnen',
    approve: 'Bestätigen',
  },
  notes: {
    default: 'Nach Bestätigung läuft Mail + Portal-Handoff automatisch weiter.',
    refunded: 'Refund wurde automatisch angestoßen.',
  },
};

const cloneBookings = (content) => (content.bookings || []).map((booking) => ({ ...booking }));

const renderBookingRow = (booking, selectedId, content) => {
  const statusMeta = content.statuses || DEFAULT_CONTENT.statuses;
  const status = statusMeta[booking.status] || statusMeta.pending_approval;
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

export const createBookingPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => `
  <div class="feature-demo-card" id="booking-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="${content.card.closeLabel}">×</button>
    </div>
    <div class="feature-demo-card__body" id="booking-preview-body"></div>
    <div class="feature-demo-card__footer">
      <button type="button" class="feature-demo-card__footer-btn">${content.card.footerSecondary}</button>
      <button type="button" class="feature-demo-card__footer-btn feature-demo-card__footer-btn--primary">${content.card.footerPrimary}</button>
    </div>
  </div>
`;

export const initBookingPreviewCard = (heroContainer, { content = DEFAULT_CONTENT } = {}) => {
  const body = heroContainer.querySelector('#booking-preview-body');
  if (!body) return;
  const statusMeta = content.statuses || DEFAULT_CONTENT.statuses;
  const paymentMeta = content.paymentStatuses || DEFAULT_CONTENT.paymentStatuses;

  const state = {
    activeFilter: 'pending_approval',
    selectedId: content.bookings?.[0]?.id || '',
    sentMagicLink: false,
    bookings: cloneBookings(content),
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
    const status = statusMeta[selected?.status] || statusMeta.pending_approval;
    const payment = paymentMeta[selected?.paymentStatus] || paymentMeta.unpaid;
    const sourceKey = selected?.source || 'widget';

    body.innerHTML = `
      <div class="modal-content-section" data-demo-section="bk-inbox">
        <p class="bk-preview-section-label">${getIconString('list')} ${content.sections.inbox}</p>
        <div class="booking-demo__filter-row">
          ${(content.filters || []).map((filter) => `
            <button
              type="button"
              class="booking-demo__filter ${state.activeFilter === filter.id ? 'is-active' : ''}"
              data-booking-filter="${filter.id}"
            >${filter.label}</button>
          `).join('')}
        </div>
        <div class="booking-demo__rows">
          ${visible.length
            ? visible.map((booking) => renderBookingRow(booking, state.selectedId, content)).join('')
            : `<div class="booking-demo__empty">${content.emptyState}</div>`}
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="bk-magic-link">
        <p class="bk-preview-section-label">${getIconString('key')} ${content.sections.magicLink}</p>
        <div class="booking-demo__handoff">
          <div class="booking-demo__handoff-card">
            <span class="booking-demo__mini-label">${content.labels.trigger}</span>
            <strong>${content.sourceLabels[sourceKey] || sourceKey}</strong>
            <p>${sourceKey === 'manual'
              ? content.magicLinkState.manualDescription
              : content.magicLinkState.widgetDescription}</p>
          </div>
          <div class="booking-demo__handoff-arrow" aria-hidden="true">${getIconString('arrow-down')}</div>
          <div class="booking-demo__handoff-card booking-demo__handoff-card--accent">
            <span class="booking-demo__mini-label">${content.labels.portal}</span>
            <strong>${state.sentMagicLink ? content.magicLinkState.sent : content.magicLinkState.ready}</strong>
            <p>${state.sentMagicLink
              ? content.magicLinkState.portalSent
              : content.magicLinkState.portalReady}</p>
          </div>
        </div>
        <button type="button" class="booking-demo__link-btn" id="booking-demo-send-link">
          ${state.sentMagicLink ? content.magicLinkState.actionSent : content.magicLinkState.actionReady}
        </button>
      </div>

      <div class="modal-content-section" data-demo-section="bk-review">
        <p class="bk-preview-section-label">${getIconString('check')} ${content.sections.review}</p>
        <div class="booking-demo__detail-card">
          <div class="booking-demo__detail-top">
            <div>
              <p class="booking-demo__detail-title">${selected?.customer || content.labels.noSelection}</p>
              <p class="booking-demo__detail-subtitle">${selected?.slot || ''}</p>
            </div>
            <div class="booking-demo__detail-badges">
              <span class="booking-demo__badge booking-demo__badge--${status.tone}">${status.label}</span>
              <span class="booking-demo__badge booking-demo__badge--${payment.tone}">${payment.label}</span>
            </div>
          </div>
          <div class="booking-demo__detail-grid">
            <div><span>${content.labels.object}</span><strong>${selected?.object || '-'}</strong></div>
            <div><span>${content.labels.service}</span><strong>${selected?.service || '-'}</strong></div>
            <div><span>${content.labels.amount}</span><strong>${selected?.amount || '-'}</strong></div>
            <div><span>${content.labels.source}</span><strong>${content.sourceLabels[sourceKey] || '-'}</strong></div>
          </div>
          <div class="booking-demo__detail-actions">
            <button type="button" class="booking-demo__action" id="booking-demo-decline">${content.actions.decline}</button>
            <button type="button" class="booking-demo__action booking-demo__action--primary" id="booking-demo-approve">${content.actions.approve}</button>
          </div>
          <p class="booking-demo__detail-note">
            ${selected?.paymentStatus === 'refunded'
              ? content.notes.refunded
              : content.notes.default}
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
