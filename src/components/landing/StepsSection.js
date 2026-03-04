/**
 * Steps Section Component
 * Numbered steps with icon, title, description.
 *
 * @param {Array<{title: string, description: string, icon?: string}>} steps
 * @returns {string} HTML
 */
export const createStepsSection = (steps) => {
  if (!steps || steps.length === 0) return '';

  const stepsHTML = steps.map((step, i) => `
    <div class="landing-step">
      <div class="landing-step-number">${step.icon || (i + 1)}</div>
      <h3 class="landing-h4">${step.title}</h3>
      <p class="landing-text-sm">${step.description}</p>
    </div>
  `).join('');

  return `<div class="landing-steps">${stepsHTML}</div>`;
};
