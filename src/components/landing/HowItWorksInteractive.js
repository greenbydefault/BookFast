import { escapeHtml } from '../../lib/sanitize.js';
import { getIconString } from '../Icons/Icon.js';
import './HowItWorksInteractive.css';

const PREVIEW_TRANSITION_MS = 280;

const createBulletsHTML = (bullets = []) => {
  if (!Array.isArray(bullets) || !bullets.length) return '';
  return `
    <ul class="how-it-works__bullets">
      ${bullets.map((bullet) => {
        const item = typeof bullet === 'object' && bullet !== null
          ? { title: bullet.title ?? bullet.label ?? '', description: bullet.description ?? bullet.detail ?? '' }
          : { title: String(bullet), description: '' };
        return `
          <li class="how-it-works__bullet">
            <span class="how-it-works__bullet-title-wrap">
              <span class="how-it-works__bullet-title">${escapeHtml(item.title)}</span>
            </span>
            ${item.description ? `<span class="how-it-works__bullet-desc">${escapeHtml(item.description)}</span>` : ''}
          </li>
        `;
      }).join('')}
    </ul>
  `;
};

const createStepIconHTML = (iconName) => {
  if (!iconName) return '';
  return `<span class="how-it-works__step-icon" aria-hidden="true">${getIconString(iconName)}</span>`;
};

export const createHowItWorksInteractive = ({
  label = "So funktioniert's",
  headline = '',
  steps = [],
  previewHTML = '',
  activeIndex = 0,
} = {}) => {
  if (!Array.isArray(steps) || !steps.length) return '';

  const safeActiveIndex = Math.min(Math.max(activeIndex, 0), steps.length - 1);
  const uid = `how-it-works-${Math.random().toString(36).slice(2, 8)}`;

  return `
    <section class="landing-section how-it-works" data-how-it-works data-active-index="${safeActiveIndex}">
      <div class="landing-container">
        <div class="how-it-works__header">
          <p class="landing-label landing-label--pill">${escapeHtml(label)}</p>
          <h2 class="landing-h2">${escapeHtml(headline)}</h2>
        </div>

        <div class="how-it-works__layout">
          <div class="how-it-works__accordion" role="tablist" aria-label="${escapeHtml(label)}">
            ${steps.map((step, index) => {
              const isActive = index === safeActiveIndex;
              const panelId = `${uid}-panel-${index}`;
              const triggerId = `${uid}-trigger-${index}`;
              return `
                <article class="how-it-works__item ${isActive ? 'is-active' : ''}" data-how-step-item>
                  <button
                    type="button"
                    class="how-it-works__trigger"
                    id="${triggerId}"
                    data-how-step-trigger
                    data-step-index="${index}"
                    aria-expanded="${isActive ? 'true' : 'false'}"
                    aria-controls="${panelId}"
                  >
                    <span class="how-it-works__title-wrap">
                      ${createStepIconHTML(step.icon)}
                      <span class="how-it-works__title">${escapeHtml(step.title || '')}</span>
                    </span>
                    <span class="how-it-works__chevron" aria-hidden="true"></span>
                  </button>
                  <div
                    id="${panelId}"
                    class="how-it-works__panel"
                    data-how-step-panel
                    role="region"
                    aria-labelledby="${triggerId}"
                    ${isActive ? '' : 'hidden'}
                  >
                    ${createBulletsHTML(step.bullets)}
                  </div>
                </article>
              `;
            }).join('')}
          </div>

          <div class="how-it-works__preview-shell">
            <div class="how-it-works__preview is-entering" data-how-preview>
              ${previewHTML}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

const updateAccordionState = (root, activeIndex) => {
  const items = root.querySelectorAll('[data-how-step-item]');
  const triggers = root.querySelectorAll('[data-how-step-trigger]');
  const panels = root.querySelectorAll('[data-how-step-panel]');

  items.forEach((item, index) => {
    item.classList.toggle('is-active', index === activeIndex);
  });
  triggers.forEach((trigger, index) => {
    trigger.setAttribute('aria-expanded', index === activeIndex ? 'true' : 'false');
  });
  panels.forEach((panel, index) => {
    panel.hidden = index !== activeIndex;
  });
};

export const initHowItWorksInteractive = (
  container,
  {
    renderPreview,
    onPreviewRendered,
    transitionMs = PREVIEW_TRANSITION_MS,
  } = {},
) => {
  if (!container) return;
  const roots = container.querySelectorAll('[data-how-it-works]');
  if (!roots.length) return;

  roots.forEach((root) => {
    const triggers = Array.from(root.querySelectorAll('[data-how-step-trigger]'));
    const previewNode = root.querySelector('[data-how-preview]');
    if (!triggers.length || !previewNode) return;

    let activeIndex = Number.parseInt(root.dataset.activeIndex || '0', 10);
    if (!Number.isFinite(activeIndex) || activeIndex < 0 || activeIndex >= triggers.length) {
      activeIndex = 0;
    }

    let leaveTimer = null;
    let enterTimer = null;

    const renderCurrentPreview = (nextIndex, { animate = true } = {}) => {
      if (typeof renderPreview !== 'function') {
        if (typeof onPreviewRendered === 'function') {
          onPreviewRendered(previewNode, nextIndex, root);
        }
        return;
      }

      const nextHTML = renderPreview(nextIndex);
      if (typeof nextHTML !== 'string') return;

      if (leaveTimer) window.clearTimeout(leaveTimer);
      if (enterTimer) window.clearTimeout(enterTimer);

      const swapContent = () => {
        previewNode.innerHTML = nextHTML;
        if (typeof onPreviewRendered === 'function') {
          onPreviewRendered(previewNode, nextIndex, root);
        }
      };

      if (!animate) {
        previewNode.classList.remove('is-leaving');
        previewNode.classList.remove('is-entering');
        swapContent();
        return;
      }

      previewNode.classList.remove('is-entering');
      previewNode.classList.add('is-leaving');

      leaveTimer = window.setTimeout(() => {
        swapContent();
        previewNode.classList.remove('is-leaving');
        previewNode.classList.add('is-entering');
        enterTimer = window.setTimeout(() => {
          previewNode.classList.remove('is-entering');
        }, transitionMs);
      }, Math.round(transitionMs * 0.55));
    };

    const setActiveStep = (nextIndex, { animatePreview = true } = {}) => {
      if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= triggers.length) return;
      activeIndex = nextIndex;
      root.dataset.activeIndex = String(nextIndex);
      updateAccordionState(root, activeIndex);
      renderCurrentPreview(activeIndex, { animate: animatePreview });
    };

    updateAccordionState(root, activeIndex);
    if (typeof renderPreview === 'function') {
      renderCurrentPreview(activeIndex, { animate: false });
    } else if (typeof onPreviewRendered === 'function') {
      onPreviewRendered(previewNode, activeIndex, root);
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const nextIndex = Number.parseInt(trigger.dataset.stepIndex || '', 10);
        if (!Number.isFinite(nextIndex)) return;
        setActiveStep(nextIndex, { animatePreview: true });
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        const nextIndex = Number.parseInt(trigger.dataset.stepIndex || '', 10);
        if (!Number.isFinite(nextIndex)) return;
        setActiveStep(nextIndex, { animatePreview: true });
      });
    });
  });
};
