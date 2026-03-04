/**
 * TopBar Component
 * Reusable top bar for Dashboard and Demo.
 */

/**
 * Render the TopBar HTML
 * @returns {string} HTML string
 */
export const renderTopBar = () => {
    return `
    <div class="top-bar">
      <div class="top-bar-breadcrumb" id="top-bar-breadcrumb">
        <!-- Breadcrumb will be updated by pages -->
      </div>
      <div class="top-bar-actions" id="top-bar-actions">
        <!-- Main action button will be injected by pages -->
      </div>
    </div>
  `;
};
