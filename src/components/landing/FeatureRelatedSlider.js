import { escapeAttr, escapeHtml } from '../../lib/sanitize.js';
import { resolveSvgAssetUrl, svgAssetUrl } from '../../lib/landingAssets.js';
import { deFeatureSlugToEn } from '../../lib/featureSlugLocale.js';
import './FeatureRelatedSlider.css';

const FALLBACK_ILLUSTRATION = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');

const getSliderCopy = (locale = 'de') => {
  if (locale === 'en') {
    return {
      featureFallback: 'Feature',
      buttonLabel: 'View feature',
      buttonTitle: (title) => `View ${title}`,
      illustrationAlt: (title) => `Illustration for ${title} feature`,
      titleLabelFallback: 'this feature',
      headlineFallback: (title) => `More features around ${title}.`,
      prevSlideLabel: 'Previous slide',
      prevSlideTitle: 'Show previous slide',
      nextSlideLabel: 'Next slide',
      nextSlideTitle: 'Show next slide',
      bubbleLabel: (index) => `Go to slide ${index}`,
    };
  }

  return {
    featureFallback: 'Feature',
    buttonLabel: 'Ansehen',
    buttonTitle: (title) => `${title} ansehen`,
    illustrationAlt: (title) => `Illustration zum Feature ${title}`,
    titleLabelFallback: 'dieses Feature',
    headlineFallback: (title) => `Weitere Funktionen rund um ${title}.`,
    prevSlideLabel: 'Vorheriger Slide',
    prevSlideTitle: 'Vorherigen Slide anzeigen',
    nextSlideLabel: 'Nächster Slide',
    nextSlideTitle: 'Nächsten Slide anzeigen',
    bubbleLabel: (index) => `Zu Slide ${index} wechseln`,
  };
};

const getFeatureHref = (slug, locale) => {
  if (!slug) return locale === 'en' ? '/en/features' : '/features';
  if (locale === 'en') {
    const enSlug = deFeatureSlugToEn(slug);
    return enSlug ? `/en/features/${enSlug}` : '/en/features';
  }
  return `/features/${slug}`;
};

const createCardHTML = (feature, locale = 'de') => {
  const copy = getSliderCopy(locale);
  const title = feature?.meta?.title || feature?.hero?.headline || copy.featureFallback;
  const subtext = feature?.hero?.subheadline || '';
  const rawIllustration = feature?.hero?.illustration || FALLBACK_ILLUSTRATION;
  const resolvedIllustration = resolveSvgAssetUrl(rawIllustration);
  const illustration = resolvedIllustration || FALLBACK_ILLUSTRATION;
  const href = getFeatureHref(feature?.slug, locale);
  const buttonLabel = copy.buttonLabel;
  const buttonTitle = copy.buttonTitle(title);

  return `
    <article class="feature-related-slider__card">
      <div class="feature-related-slider__text">
        <h3 class="feature-related-slider__card-title">${escapeHtml(title)}</h3>
        <p class="feature-related-slider__card-subtext">${escapeHtml(subtext)}</p>
      </div>
      <div class="feature-related-slider__footer">
        <a href="${escapeAttr(href)}" class="landing-btn landing-btn-primary feature-related-slider__card-btn" data-landing-link data-related-card-link title="${escapeAttr(buttonTitle)}">${escapeHtml(buttonLabel)}</a>
        <div class="feature-related-slider__media">
          <img src="${escapeAttr(illustration)}" alt="${escapeAttr(copy.illustrationAlt(title))}" loading="eager" decoding="async" />
        </div>
      </div>
    </article>
  `;
};

export const createFeatureRelatedSlider = ({
  currentTitle = '',
  features = [],
  label = 'Mehr entdecken',
  headline = '',
  locale = 'de',
} = {}) => {
  if (!Array.isArray(features) || !features.length) return '';
  const copy = getSliderCopy(locale);
  const titleLabel = currentTitle || copy.titleLabelFallback;
  const headlineText = headline || copy.headlineFallback(escapeHtml(titleLabel));

  return `
    <section class="landing-section feature-related-slider-section">
      <div class="landing-container">
        <div class="feature-related-slider__header">
          <div>
            <p class="landing-label landing-label--pill">${escapeHtml(label)}</p>
            <h2 class="landing-h2">${headlineText}</h2>
          </div>
        </div>

        <div class="feature-related-slider" data-feature-related-slider data-related-locale="${escapeAttr(locale)}">
          <div class="feature-related-slider__viewport" data-related-viewport>
            <div class="feature-related-slider__track" data-related-track>
              ${features.map((feature, index) => `
                <div class="feature-related-slider__slide" data-related-slide-original data-original-index="${index}">
                  ${createCardHTML(feature, locale)}
                </div>
              `).join('')}
            </div>
          </div>
          <div class="feature-related-slider__controls">
            <button type="button" class="feature-related-slider__arrow" data-related-prev aria-label="${escapeAttr(copy.prevSlideLabel)}" title="${escapeAttr(copy.prevSlideTitle)}">‹</button>
            <div class="feature-related-slider__bubbles" data-related-bubbles></div>
            <button type="button" class="feature-related-slider__arrow" data-related-next aria-label="${escapeAttr(copy.nextSlideLabel)}" title="${escapeAttr(copy.nextSlideTitle)}">›</button>
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
    const locale = root.dataset.relatedLocale === 'en' ? 'en' : 'de';
    const copy = getSliderCopy(locale);

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
      `<button type="button" class="feature-related-slider__bubble" data-related-bubble data-bubble-index="${index}" aria-label="${escapeAttr(copy.bubbleLabel(index + 1))}"></button>`
    )).join('');
    const bubbleButtons = Array.from(bubbles.querySelectorAll('[data-related-bubble]'));

    if (count === 1) {
      bubbleButtons[0]?.classList.add('is-active');
      viewport.classList.add('is-static');
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    // Clone ALL originals to both sides for a seamless infinite loop,
    // even when multiple slides are visible simultaneously.
    const clonesBefore = originals.map((el) => {
      const clone = el.cloneNode(true);
      clone.removeAttribute('data-related-slide-original');
      clone.dataset.clone = 'true';
      return clone;
    });
    const clonesAfter = originals.map((el) => {
      const clone = el.cloneNode(true);
      clone.removeAttribute('data-related-slide-original');
      clone.dataset.clone = 'true';
      return clone;
    });
    // Prepend full set in order (so last clones appear before first original)
    clonesBefore.reverse().forEach((clone) => track.insertBefore(clone, originals[0]));
    clonesAfter.forEach((clone) => track.append(clone));

    let slideWidth = 0;
    let slideGap = 0;
    let stride = 0;
    let index = count; // first original now sits at offset `count`
    let currentTranslate = 0;
    let isAnimating = false;
    let hasShiftedToBothEdges = false;
    const getOriginalIndex = () => ((index - count) % count + count) % count;

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

    const enableBothEdgeBleed = () => {
      if (hasShiftedToBothEdges) return;
      hasShiftedToBothEdges = true;
      viewport.classList.add('is-bleed-both');
      measure();
    };

    const jumpIfLoopBoundary = () => {
      // If we scrolled into the clone zone, teleport back to the matching original.
      if (index >= count && index < count + count) {
        isAnimating = false;
        return;
      }
      if (index < count) {
        index = index + count;
      } else {
        index = index - count;
      }
      track.style.transition = 'none';
      setTransform(-index * stride);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isAnimating = false;
        });
      });
    };

    const goTo = (nextIndex, { animate = true } = {}) => {
      if (animate && isAnimating) return;
      const maxIndex = count + count; // last clone set starts here
      const targetIndex = clampIndex(nextIndex, maxIndex);
      if (targetIndex === index) return;
      enableBothEdgeBleed();
      index = targetIndex;
      setActiveBubble(); // update dot immediately on click
      if (animate) {
        isAnimating = true;
        track.style.transition = 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)';
      } else {
        track.style.transition = 'none';
      }
      setTransform(-index * stride);
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
        goTo(bubbleIndex + count, { animate: true });
      });
    });

    measure();
    setActiveBubble();

    root.dataset.relatedSliderReady = 'true';
    root.relatedSliderCleanup = () => {
      window.removeEventListener('resize', measure);
    };

    window.requestAnimationFrame(measure);
  });
};
