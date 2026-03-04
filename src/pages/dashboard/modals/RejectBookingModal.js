/**
 * Reject Booking Modal
 * Modal for rejecting a booking with an optional reason.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { formatDateRange } from '../../../lib/dateUtils.js';

/**
 * Opens a modal for rejecting a booking
 * @param {Object} options
 * @param {Object} options.booking - The booking object with customer_name, start_time, end_time
 * @param {Function} options.onConfirm - Callback with reason when confirmed: (reason) => void
 * @param {Function} options.onCancel - Optional callback when cancelled
 */
export const openRejectBookingModal = ({ booking, onConfirm, onCancel }) => {
    let modalInstance = null;
    let reason = '';

    const handleConfirm = async () => {
        const textarea = document.getElementById('reject-reason-input');
        reason = textarea?.value?.trim() || '';
        
        modalInstance.close();
        if (onConfirm) {
            await onConfirm(reason);
        }
    };

    const handleCancel = () => {
        modalInstance.close();
        if (onCancel) onCancel();
    };

    // Build content
    const renderContent = () => {
        const div = document.createElement('div');
        div.className = 'reject-booking-modal-content';
        
        const customerName = booking.customer_name || 'Unbekannt';
        const dateRange = formatDateRange(booking.start_time, booking.end_time);
        
        div.innerHTML = `
            <div class="reject-booking-info">
                <div class="reject-booking-info-row">
                    <span class="reject-booking-label">${getIconString('user')} Kunde</span>
                    <span class="reject-booking-value">${customerName}</span>
                </div>
                <div class="reject-booking-info-row">
                    <span class="reject-booking-label">${getIconString('calender-days-date')} Zeitraum</span>
                    <span class="reject-booking-value">${dateRange}</span>
                </div>
            </div>
            
            <div class="modal-separator"></div>
            
            <label class="modal-label modal-form-label">
                ${getIconString('message-text')} Grund der Ablehnung 
                <span class="modal-label-optional">(Optional)</span>
            </label>
            <textarea 
                class="modal-form-input modal-textarea" 
                placeholder="z. B. Zeitraum nicht verfügbar, doppelte Buchung, ..." 
                rows="3" 
                id="reject-reason-input"
            ></textarea>
        `;
        
        return div;
    };

    // Footer buttons
    const renderFooterRight = () => {
        const container = document.createElement('div');
        container.className = 'footer-actions-container';

        const cancelBtn = createButton('Abbrechen', handleCancel, 'btn-secondary');

        const rejectBtn = createActionButton({
            text: 'Buchung ablehnen',
            loadingText: 'wird abgelehnt...',
            onClick: handleConfirm,
            className: 'btn-danger'
        });

        container.appendChild(cancelBtn);
        container.appendChild(rejectBtn.element);
        return container;
    };

    // Create and open modal
    modalInstance = createModal({
        title: 'Buchung ablehnen',
        subtitle: 'Möchtest du diese Buchung wirklich ablehnen?',
        content: renderContent(),
        footerLeft: null,
        footerRight: renderFooterRight(),
        onClose: () => {
            if (onCancel) onCancel();
        }
    });

    modalInstance.open();
    
    return modalInstance;
};
