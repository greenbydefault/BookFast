/**
 * Create Workspace Modal Component
 * Allows users to create a new workspace with validation for the 25 workspace limit
 */
import { supabase } from '../../lib/supabaseClient.js';
import { getState, setState } from '../../lib/store.js';
import { createModal } from '../Modal/Modal.js';
import { createButton } from '../Button/Button.js';

/**
 * Opens a modal to create a new workspace
 * @returns {Promise<Object|null>} The created workspace or null if cancelled
 */
export const openCreateWorkspaceModal = () => {
    return new Promise((resolve) => {
        const state = getState();
        const currentWorkspaceCount = state.workspaces?.length || 0;

        // Check workspace limit
        if (currentWorkspaceCount >= 25) {
            alert('Workspace-Limit erreicht: Sie können maximal 25 Workspaces erstellen.');
            resolve(null);
            return;
        }

        // Create form content
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
            <div class="modal-content-section">
                <div class="modal-form-field">
                    <label for="workspace-name-input" class="modal-form-label">Workspace-Name *</label>
                    <input 
                        type="text" 
                        id="workspace-name-input" 
                        class="modal-form-input" 
                        placeholder="z.B. Salon München"
                        required
                        autocomplete="off"
                    />
                    <small id="workspace-error" class="modal-form-error"></small>
                </div>
                <div class="modal-info-box">
                    <small class="modal-info-text">
                        <strong>Hinweis:</strong> Jeder Workspace ist komplett isoliert mit eigenen Services, Buchungen und Einstellungen. 
                        Sie können maximal ${25 - currentWorkspaceCount} weitere Workspace(s) erstellen.
                    </small>
                </div>
            </div>
        `;

        // Create buttons
        const cancelBtn = createButton('Abbrechen', () => {
            modal.close();
            resolve(null);
        }, 'btn-outline');

        const createBtn = createButton('Workspace erstellen', async () => {
            const input = document.getElementById('workspace-name-input');
            const errorEl = document.getElementById('workspace-error');
            const name = input.value.trim();

            // Validation
            if (!name) {
                errorEl.textContent = 'Bitte geben Sie einen Namen ein.';
                errorEl.classList.add('visible');
                input.focus();
                return;
            }

            if (name.length < 2) {
                errorEl.textContent = 'Der Name muss mindestens 2 Zeichen lang sein.';
                errorEl.classList.add('visible');
                input.focus();
                return;
            }

            if (name.length > 100) {
                errorEl.textContent = 'Der Name darf maximal 100 Zeichen lang sein.';
                errorEl.classList.add('visible');
                input.focus();
                return;
            }

            // Clear error
            errorEl.classList.remove('visible');

            try {
                // Create workspace in database
                const { data, error } = await supabase
                    .from('workspaces')
                    .insert({ name })
                    .select()
                    .single();

                if (error) {
                    console.error('Error creating workspace:', error);
                    errorEl.textContent = 'Fehler beim Erstellen: ' + error.message;
                    errorEl.classList.add('visible');
                    return;
                }

                // Update state
                const updatedWorkspaces = [...state.workspaces, data];
                setState({
                    workspaces: updatedWorkspaces,
                    currentWorkspace: data
                });

                modal.close();
                resolve(data);
            } catch (err) {
                console.error('Unexpected error:', err);
                errorEl.textContent = 'Ein unerwarteter Fehler ist aufgetreten.';
                errorEl.classList.add('visible');
            }
        }, 'btn-primary');

        // Create footer container
        const footerRight = document.createElement('div');
        footerRight.className = 'footer-actions-container';
        footerRight.appendChild(cancelBtn);
        footerRight.appendChild(createBtn);

        // Create modal
        const modal = createModal({
            title: 'Neuer Workspace',
            subtitle: `Erstellen Sie einen neuen Workspace (${currentWorkspaceCount}/25)`,
            content: formContainer,
            footerRight: footerRight,
            onClose: () => resolve(null)
        });

        // Auto-focus input when modal opens
        modal.open();
        setTimeout(() => {
            const input = document.getElementById('workspace-name-input');
            if (input) input.focus();
        }, 100);

        // Allow Enter key to submit
        formContainer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                createBtn.click();
            }
        });
    });
};
