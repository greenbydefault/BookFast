/**
 * Settings - Integration Section (Google Calendar Placeholder)
 */

export const renderIntegrationContent = () => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  container.innerHTML = `
    <div class="settings-section">
      <div class="settings-card" style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; background: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.1"/>
              <path d="M16 10V8C16 7.44772 15.5523 7 15 7H9C8.44772 7 8 7.44772 8 8V10" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 10V14" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 10V14" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 14V16C8 16.5523 8.44772 17 9 17H15C15.5523 17 16 16.5523 16 16V14" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 10V14" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 12H16" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 style="margin: 0 0 0.25rem 0;">Google Kalender</h3>
            <p style="color: var(--color-stone-500); font-size: 0.9rem; margin: 0;">Synchronisiere deine Buchungen automatisch mit Google Kalender.</p>
          </div>
        </div>
        <button class="btn btn-secondary" disabled>Bald verfügbar</button>
      </div>
    </div>
  `;
};
