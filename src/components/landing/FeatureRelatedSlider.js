import { escapeAttr, escapeHtml } from '../../lib/sanitize.js';
import { svgAssetUrl } from '../../lib/landingAssets.js';
import './FeatureRelatedSlider.css';

const FALLBACK_ILLUSTRATION = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');

const createCardHTML = (feature) => {
  const title = feature?.meta?.title || feature?.hero?.headline || 'Feature';
  const subtext = feature?.hero?.subheadline || '';
  const illustration = feature?.hero?.illustration || FALLBACK_ILLUSTRATION;
  const href = feature?.slug ? `/features/${feature.slug}` : '/features';

  return `
    <article class="feature-related-slider__card">
      <div class="feature-related-slider__text">
        <h3 class="feature-related-slider__card-title">${escapeHtml(title)}</h3>
        <p class="feature-related-slider__card-subtext">${escapeHtml(subtext)}</p>
      </div>
      <div class="feature-related-slider__footer">
        <a href="${escapeAttr(href)}" class="landing-btn landing-btn-primary feature-related-slider__card-btn" data-landing-link data-related-card-link>Ansehen</a>
        <div class="feature-related-slider__media" aria-hidden="true">
          <img src="${escapeAttr(illustration)}" alt="" loading="eager" decoding="async" />
        </div>
      </div>
    </article>
  `;
};

export const createFeatureRelatedSlider = ({
  currentTitle = '',
  features = [],
} = {}) => {
  if (!Array.isArray(features) || !features.length) return '';
  const titleLabel = currentTitle || 'dieses Feature';

  return `
    <section class="landing-section feature-related-slider-section">
      <div class="landing-container">
        <div class="feature-related-slider__header">
          <div>
            <p class="landing-label landing-label--pill">Mehr entdecken</p>
            <h2 class="landing-h2">Weitere Funktionen rund um ${escapeHtml(titleLabel)}.</h2>
          </div>
          <p class="landing-text feature-related-slider__intro">
            Passend zu ${escapeHtml(titleLabel)}: Entdecke Funktionen, die häufig zusammen eingesetzt werden.
          </p>
        </div>

        <div class="feature-related-slider" data-feature-related-slider>
          <div class="feature-related-slider__viewport" data-related-viewport>
            <div class="feature-related-slider__track" data-related-track>
              ${features.map((feature, index) => `
                <div class="feature-related-slider__slide" data-related-slide-original data-original-index="${index}">
                  ${createCardHTML(feature)}
                </div>
              `).join('')}
            </div>
          </div>
          <div class="feature-related-slider__controls">
            <button type="button" class="feature-related-slider__arrow" data-related-prev aria-label="Vorheriger Slide">‹</button>
            <div class="feature-related-slider__bubbles" data-related-bubbles></div>
            <button type="button" class="feature-related-slider__arrow" data-related-next aria-label="Nächster Slide">›</button>
          </div>
        </div>
      </div>
    </section>
  `;
};

const clampIndex = (index, max) => {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(index, max));
};

export const initFeatureRelatedSlider = (container) => {
  if (!container) return;
  const sliders = container.querySelectorAll('[data-feature-related-slider]');

  sliders.forEach((root) => {
    if (root.dataset.relatedSliderReady === 'true') return;

    const viewport = root.querySelector('[data-related-viewport]');
    const track = root.querySelector('[data-related-track]');
    const bubbles = root.querySelector('[data-related-bubbles]');
    const prevBtn = root.querySelector('[data-related-prev]');
    const nextBtn = root.querySelector('[data-related-next]');
    if (!viewport || !track || !bubbles || !prevBtn || !nextBtn) return;

    const originals = Array.from(track.querySelectorAll('[data-related-slide-original]'));
    const count = originals.length;
    if (!count) return;

    bubbles.innerHTML = originals.map((_, index) => (
      `<button type="button" class="feature-related-slider__bubble" data-related-bubble data-bubble-index="${index}" aria-label="Zu Slide ${index + 1} wechseln"></button>`
    )).join('');
    const bubbleButtons = Array.from(bubbles.querySelectorAll('[data-related-bubble]'));

    if (count === 1) {
      bubbleButtons[0]?.classList.add('is-active');
      viewport.classList.add('is-static');
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const firstClone = originals[0].cloneNode(true);
    firstClone.dataset.clone = 'true';
    const lastClone = originals[count - 1].cloneNode(true);
    lastClone.dataset.clone = 'true';
    track.insertBefore(lastClone, originals[0]);
    track.append(firstClone);

    let slideWidth = 0;
    let slideGap = 0;
    let stride = 0;
    let index = 1;
    let currentTranslate = 0;
    let isAnimating = false;
    const getOriginalIndex = () => ((index - 1) % count + count) % count;

    const setActiveBubble = () => {
      const active = getOriginalIndex();
      bubbleButtons.forEach((btn, idx) => {
        btn.classList.toggle('is-active', idx === active);
      });
    };

    const setTransform = (value) => {
      currentTranslate = value;
      track.style.transform = `translate3d(${Math.round(value)}px, 0, 0)`;
    };

    const measure = () => {
      const firstSlide = track.querySelector('.feature-related-slider__slide');
      if (!firstSlide) return;
      slideWidth = firstSlide.getBoundingClientRect().width;
      slideGap = Number.parseFloat(window.getComputedStyle(track).gap || '0') || 0;
      stride = slideWidth + slideGap;
      track.style.transition = 'none';
      setTransform(-index * stride);
    };

    const jumpIfLoopBoundary = () => {
      const needsReset = index === 0 || index === count + 1;
      if (!needsReset) {
        isAnimating = false;
        setActiveBubble();
        return;
      }
      index = index === 0 ? count : 1;
      track.style.transition = 'none';
      setTransform(-index * stride);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isAnimating = false;
          setActiveBubble();
        });
      });
    };

    const goTo = (nextIndex, { animate = true } = {}) => {
      if (animate && isAnimating) return;
      index = clampIndex(nextIndex, count + 1);
      if (animate) {
        isAnimating = true;
        track.style.transition = 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)';
      } else {
        track.style.transition = 'none';
      }
      setTransform(-index * stride);
      if (!animate) setActiveBubble();
    };

    track.addEventListener('transitionend', (e) => {
      if (e.target !== track) return;
      jumpIfLoopBoundary();
    });
    window.addEventListener('resize', measure);
    prevBtn.addEventListener('click', () => {
      goTo(index - 1, { animate: true });
    });
    nextBtn.addEventListener('click', () => {
      goTo(index + 1, { animate: true });
    });
    bubbleButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const bubbleIndex = Number.parseInt(btn.dataset.bubbleIndex || '', 10);
        if (!Number.isFinite(bubbleIndex)) return;
        goTo(bubbleIndex + 1, { animate: true });
      });
    });

    // Kick off.
    measure();
    setActiveBubble();

    // Keep DOM order stable if this section is rerendered.
    root.dataset.relatedSliderReady = 'true';
    root.relatedSliderCleanup = () => {
      window.removeEventListener('resize', measure);
    };

    // If user lands after CSS loaded slowly, force a post-layout measurement.
    window.requestAnimationFrame(measure);
  });
};
