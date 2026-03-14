/**
 * Delete Confirm Modal
 * Generic confirmation modal for delete actions.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';

/**
 * Opens a confirmation modal for deleting an entity
 * @param {Object} options
 * @param {string} options.title - Modal title (e.g., "Objekt löschen")
 * @param {string} options.subtitle - Modal subtitle
 * @param {string} options.entityName - Name of the entity to delete (shown in info box)
 * @param {string} options.entityType - Type label (e.g., "Objekt", "Service")
 * @param {Function} options.onConfirm - Callback when delete is confirmed
 * @param {Function} options.onCancel - Optional callback when cancelled
 */
export const openDeleteConfirmModal = ({ 
    title = 'Löschen bestätigen',
    subtitle = 'Möchtest du diesen Eintrag wirklich löschen?',
    entityName,
    entityType = 'Eintrag',
    onConfirm, 
    onCancel 
}) => {
    let modalInstance = null;

    const handleConfirm = async () => {
        try {
            if (onConfirm) {
                await onConfirm();
            }
            modalInstance.close();
        } catch (error) {
            console.error('Delete failed:', error);
            alert(error?.message || 'Fehler beim Löschen.');
        }
    };

    const handleCancel = () => {
        modalInstance.close();
        if (onCancel) onCancel();
    };

    // Build content
    const renderContent = () => {
        const div = document.createElement('div');
        div.className = 'delete-confirm-modal-content';
        
        div.innerHTML = `
            <div class="delete-confirm-info">
                <div class="delete-confirm-info-row">
                    <span class="delete-confirm-label">${getIconString('package')} ${entityType}</span>
                    <span class="delete-confirm-value">${entityName || 'Unbekannt'}</span>
                </div>
            </div>
            
            <p class="delete-confirm-warning">
                ${getIconString('stop')} Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
        `;
        
        return div;
    };

    // Footer buttons
    const renderFooterRight = () => {
        const container = document.createElement('div');
        container.className = 'footer-actions-container';

        const cancelBtn = createButton('Abbrechen', handleCancel, 'btn-secondary');

        const deleteBtn = createActionButton({
            text: 'Löschen',
            loadingText: 'wird gelöscht...',
            onClick: handleConfirm,
            className: 'btn-danger',
            icon: 'trash'
        });

        container.appendChild(cancelBtn);
        container.appendChild(deleteBtn.element);
        return container;
    };

    // Create and open modal
    modalInstance = createModal({
        title,
        subtitle,
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
