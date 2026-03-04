import { getState } from '../../../lib/store.js';
import { updateEntity, invalidateCache } from '../../../lib/dataLayer.js';
import { createActionMenu } from '../../../components/ActionMenu/ActionMenu.js';
import { approveBooking, declineBooking } from '../../../lib/services/bookingService.js';

const confirmBooking = async ({ bookingId, paymentStatus, onRefresh }) => {
    const state = getState();
    if (state.isDemoMode) {
        await updateEntity('bookings', bookingId, { status: 'confirmed' });
        invalidateCache('bookings');
        await onRefresh();
        return;
    }

    try {
        if (paymentStatus === 'paid') {
            await approveBooking(bookingId);
        } else {
            await updateEntity('bookings', bookingId, { status: 'confirmed' });
        }
        invalidateCache('bookings');
        await onRefresh();
    } catch (error) {
        console.error('Failed to confirm booking:', error);
        alert(`Fehler beim Bestätigen der Buchung: ${error.message}`);
    }
};

const rejectBooking = ({ booking, openRejectBookingModal, onRefresh }) => {
    const state = getState();
    if (state.isDemoMode) {
        openRejectBookingModal({
            booking,
            onConfirm: async () => {
                await updateEntity('bookings', booking.id, { status: 'rejected' });
                invalidateCache('bookings');
                await onRefresh();
            },
        });
        return;
    }

    const paymentStatus = booking.payment_status || 'unpaid';
    openRejectBookingModal({
        booking,
        onConfirm: async (reason) => {
            try {
                if (paymentStatus === 'paid') {
                    await declineBooking(booking.id, reason);
                } else {
                    await updateEntity('bookings', booking.id, { status: 'rejected' });
                }
                invalidateCache('bookings');
                await onRefresh();
            } catch (error) {
                console.error('Failed to reject booking:', error);
                alert(`Fehler beim Ablehnen der Buchung: ${error.message}`);
            }
        },
    });
};

const cancelBooking = async ({ bookingId, onRefresh }) => {
    const state = getState();
    if (state.isDemoMode) {
        await updateEntity('bookings', bookingId, { status: 'cancelled' });
        invalidateCache('bookings');
        await onRefresh();
        return;
    }

    try {
        await updateEntity('bookings', bookingId, { status: 'cancelled' });
        await onRefresh();
    } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert('Fehler beim Stornieren der Buchung. Bitte versuchen Sie es erneut.');
    }
};

const noShowBooking = async ({ bookingId, onRefresh }) => {
    const state = getState();
    if (state.isDemoMode) {
        await updateEntity('bookings', bookingId, { status: 'no_show' });
        invalidateCache('bookings');
        await onRefresh();
        return;
    }

    try {
        await updateEntity('bookings', bookingId, { status: 'no_show' });
        await onRefresh();
    } catch (error) {
        console.error('Failed to set no-show status:', error);
        alert('Fehler beim Setzen des Status "Nicht erschienen". Bitte versuchen Sie es erneut.');
    }
};

export const openBookingActionsMenu = ({
    bookingId,
    bookingStatus,
    paymentStatus,
    buttonElement,
    bookings,
    onRefresh,
    openRejectBookingModal,
}) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const actions = [];

    if (bookingStatus === 'pending' || bookingStatus === 'pending_approval') {
        actions.push(
            {
                label: 'Buchung bestätigen',
                iconName: 'check',
                action: () => confirmBooking({ bookingId, paymentStatus, onRefresh }),
                variant: 'success',
            },
            {
                label: 'Buchung ablehnen',
                iconName: 'thumb-down',
                action: () => rejectBooking({ booking, openRejectBookingModal, onRefresh }),
                variant: 'danger',
            },
        );
    }

    if (bookingStatus === 'completed') {
        actions.push({
            label: 'Nicht erschienen',
            iconName: 'eye-off',
            action: () => noShowBooking({ bookingId, onRefresh }),
        });
    }

    if (bookingStatus !== 'cancelled' && bookingStatus !== 'rejected') {
        if (!(bookingStatus === 'pending_approval' && paymentStatus === 'paid')) {
            actions.push({
                label: 'Buchung stornieren',
                iconName: 'banknote-x',
                action: () => cancelBooking({ bookingId, onRefresh }),
                variant: 'danger',
            });
        }
    }

    createActionMenu({
        trigger: buttonElement,
        actions,
    });
};
