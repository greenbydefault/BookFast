/**
 * Builds HTML for the "So funktioniert's" accordion preview panel.
 * Optionally shows only a slice of the hero demo card (data-demo-section) per step.
 */

const HERO_FRAME_SELECTOR = '#feature-hero-demo .feature-hero__card-frame';

const stripIds = (root) => {
  if (!root) return;
  root.removeAttribute('id');
  root.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
};

/**
 * @param {ParentNode} container - Usually #landing-content
 * @param {number} stepIndex - Active accordion step
 * @param {{ sliceSelectors?: string[] }} [options]
 * @returns {string} outerHTML of the frosted frame (or empty string)
 */
export const getHowItWorksPreviewHtml = (container, stepIndex, { sliceSelectors } = {}) => {
  const frame = container.querySelector(HERO_FRAME_SELECTOR);
  if (!frame) return '';

  const cloneFullFrame = () => {
    const c = frame.cloneNode(true);
    stripIds(c);
    return c.outerHTML;
  };

  if (!Array.isArray(sliceSelectors) || sliceSelectors.length === 0) {
    return cloneFullFrame();
  }

  if (!Number.isFinite(stepIndex) || stepIndex < 0 || stepIndex >= sliceSelectors.length) {
    return cloneFullFrame();
  }

  const selector = sliceSelectors[stepIndex];
  if (!selector || typeof selector !== 'string') {
    return cloneFullFrame();
  }

  const sourceCard = frame.querySelector('.feature-demo-card');
  if (!sourceCard) return cloneFullFrame();

  const section = sourceCard.querySelector(selector);
  if (!section) return cloneFullFrame();

  const fullClone = frame.cloneNode(true);
  const sliceCard = fullClone.querySelector('.feature-demo-card');
  const body = sliceCard?.querySelector('.feature-demo-card__body');
  if (!sliceCard || !body) return cloneFullFrame();

  const sectionClone = section.cloneNode(true);
  stripIds(sectionClone);
  body.innerHTML = '';
  body.appendChild(sectionClone);
  stripIds(fullClone);
  return fullClone.outerHTML;
};
