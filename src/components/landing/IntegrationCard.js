/**
 * Integration Card Component
 *
 * @param {Object} config
 * @param {string} config.icon - Emoji or HTML
 * @param {string} config.name
 * @param {string} config.description
 * @param {'active'|'coming-soon'} [config.status]
 * @returns {string} HTML
 */
export const createIntegrationCard = ({ icon, name, description, status = 'active' }) => {
  const statusLabel = status === 'active' ? 'Verfügbar' : 'Coming Soon';

  return `
    <div class="landing-integration-card">
      <div class="landing-integration-logo">${icon}</div>
      <div style="flex:1; min-width:0;">
        <div class="landing-h4" style="margin-bottom:0.25rem;">${name}</div>
        <p class="landing-text-sm" style="margin:0;">${description}</p>
      </div>
      <span class="landing-integration-badge ${status}">${statusLabel}</span>
    </div>`;
};
