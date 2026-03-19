/**
 * Create Staff Modal
 * Uses shared StaffFormFields for the form body.
 */
import { createModal } from '../../../components/Modal/Modal.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { createButton, createActionButton } from '../../../components/Button/Button.js';
import { createEntity, fetchEntities } from '../../../lib/dataLayer.js';
import { supabase } from '../../../lib/supabaseClient.js';
import { createStaffFormFields } from '../../../components/forms/StaffFormFields.js';
import { toBookableDaysObject } from '../../../lib/staffDays.js';

export const openCreateStaffModal = async (onSuccess) => {
    let modalInstance = null;
    let formFields = null;
    let isDraft = false;

    // Fetch available services
    let availableServices = [];
    try {
        const result = await fetchEntities('services', { perPage: 100, filter: 'active' });
        availableServices = (result.items || []).map(svc => ({ value: svc.id, label: svc.name }));
    } catch (error) {
        console.error('Failed to load services for staff creation:', error);
    }

    const handleSave = async () => {
        const state = formFields.getState();

        if (!state.name) {
            alert('Bitte geben Sie einen Namen ein.');
            throw new Error('Validierungsfehler');
        }

        const newStaff = await createEntity('staff', {
            name: state.name,
            image_url: state.imageUrl || null,
            bookable_days: toBookableDaysObject(state.bookableDays),
            status: isDraft ? 'draft' : 'active'
        });

        if (state.serviceIds.length > 0 && newStaff?.id) {
            const rows = state.serviceIds.map(sid => ({ staff_id: newStaff.id, service_id: sid }));
            const { error: serviceError } = await supabase.from('staff_services').insert(rows);

            if (serviceError) {
                console.error('Error saving service associations:', serviceError);
                alert('Mitarbeiter wurde erstellt, aber die Service-Zuordnung ist fehlgeschlagen. Bitte im Detail bearbeiten.');
            }
        }

        modalInstance.close();
        if (onSuccess) onSuccess();
    };

    const renderContent = () => {
        formFields = createStaffFormFields({
            state: { bookableDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] },
            options: {
                services: availableServices,
                showImage: false,
                showDescription: true,
                showTimeWindows: false,
            },
        });

        return formFields.element;
    };

    const renderFooterLeft = () => {
        const div = document.createElement('div');
        div.className = 'draft-toggle';
        div.innerHTML = `${getIconString('folder')} Als Entwurf speichern`;
        div.onclick = () => {
            isDraft = !isDraft;
            div.classList.toggle('active', isDraft);
        };
        return div;
    };

    const renderFooterRight = () => {
        const container = document.createElement('div');
        container.className = 'footer-actions-container';

        const cancelBtn = createButton('Abbrechen', () => modalInstance.close(), 'btn-secondary');
        const saveBtn = createActionButton({
            text: 'Mitarbeiter Speichern',
            loadingText: 'wird angelegt...',
            onClick: handleSave,
            className: 'btn-primary'
        });

        container.appendChild(cancelBtn);
        container.appendChild(saveBtn.element);
        return container;
    };

    modalInstance = createModal({
        title: 'Mitarbeiter Anlegen',
        subtitle: 'Lege einen Mitarbeiter an.',
        content: renderContent(),
        footerLeft: renderFooterLeft(),
        footerRight: renderFooterRight(),
        onClose: () => { if (formFields) formFields.destroy(); }
    });

    modalInstance.open();
};
