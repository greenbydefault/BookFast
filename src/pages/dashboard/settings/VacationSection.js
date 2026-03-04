/**
 * Settings - Vacation Section
 * Redirects to the dedicated Urlaub page for full vacation management.
 */
import { getIconString } from '../../../components/Icons/Icon.js';
import { navigate } from '../../../lib/router.js';

/**
 * Render Vacation Content – Link to dedicated Urlaub page
 */
export const renderVacationContent = async () => {
    const container = document.getElementById('settings-content');
    if (!container) return;

    container.innerHTML = `
        <div class="settings-card" style="max-width: 560px;">
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div style="color: var(--color-stone-400);">${getIconString('calender-days-date')}</div>
                <div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem;">Urlaub verwalten</h3>
                    <p style="margin: 0 0 1rem 0; color: var(--color-stone-600); font-size: 0.95rem;">
                        Urlaub blockiert Slots automatisch – für das ganze Workspace, einzelne Objekte, Mitarbeiter oder Services.
                    </p>
                    <a href="#" class="btn btn-primary" id="vacation-settings-link">Urlaub verwalten</a>
                </div>
            </div>
        </div>
    `;

    const link = document.getElementById('vacation-settings-link');
    if (link) {
        link.onclick = (e) => {
            e.preventDefault();
            navigate('vacations');
        };
    }
};
