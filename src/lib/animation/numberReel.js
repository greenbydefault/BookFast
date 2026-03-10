const DEFAULT_REEL_CONFIG = Object.freeze({
  durationMs: 460,
  settleDurationMs: 90,
  startDelayMs: 18,
  digitStaggerMs: 20,
  spinCycles: 2,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  alternateDirectionByDigit: true,
  firstDigitDirection: 'up',
  reducedMotionMediaQuery: '(prefers-reduced-motion: reduce)',
});

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const isDigit = (char) => /\d/.test(char);
const asDigit = (char) => Number.parseInt(char, 10);

const buildDigitFrames = (fromDigit, toDigit, direction, spinCycles) => {
  const steps = [];
  const cycles = Math.max(1, Math.round(spinCycles));
  const distance = direction === 'up'
    ? (toDigit - fromDigit + 10) % 10
    : (fromDigit - toDigit + 10) % 10;
  const totalMoves = distance + (cycles * 10);
  let current = fromDigit;

  steps.push(current);
  for (let i = 0; i < totalMoves; i += 1) {
    current = direction === 'up' ? (current + 1) % 10 : (current + 9) % 10;
    steps.push(current);
  }

  return steps;
};

export const createNumberReel = (element, options = {}) => {
  if (!element) {
    return {
      setValue: () => {},
      destroy: () => {},
    };
  }

  const config = {
    ...DEFAULT_REEL_CONFIG,
    ...options,
  };

  const formatter = typeof config.formatter === 'function'
    ? config.formatter
    : (value) => String(value);

  const reducedMotionMedia = window.matchMedia(config.reducedMotionMediaQuery);

  const root = element;
  const initialText = (root.textContent || '').trim();
  root.textContent = '';
  root.classList.add('bf-number-reel');

  const charsHost = document.createElement('span');
  charsHost.className = 'bf-number-reel__chars';
  root.appendChild(charsHost);

  let currentValue = null;
  let isDestroyed = false;
  let animationCleanups = [];
  let settleTimer = null;
  let lockTimer = null;

  const stopPendingTransition = () => {
    animationCleanups.forEach((cleanup) => cleanup());
    animationCleanups = [];
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
    if (lockTimer) {
      clearTimeout(lockTimer);
      lockTimer = null;
    }
  };

  const renderStatic = (value) => {
    const text = formatter(value);
    charsHost.innerHTML = text
      .split('')
      .map((char) => {
        const safeChar = char === ' ' ? '&nbsp;' : escapeHtml(char);
        return `<span class="bf-number-reel__char bf-number-reel__char--static">${safeChar}</span>`;
      })
      .join('');
    currentValue = value;
  };

  const renderAnimatedChars = (fromText, toText) => {
    const paddedLength = Math.max(fromText.length, toText.length);
    const fromChars = fromText.padStart(paddedLength, ' ').split('');
    const toChars = toText.padStart(paddedLength, ' ').split('');
    let digitIndex = 0;
    const animatedTracks = [];

    charsHost.innerHTML = '';

    for (let i = 0; i < paddedLength; i += 1) {
      const fromChar = fromChars[i];
      const toChar = toChars[i];
      const charWrapper = document.createElement('span');
      charWrapper.className = 'bf-number-reel__char';

      if (isDigit(fromChar) && isDigit(toChar)) {
        const direction = config.alternateDirectionByDigit
          ? (digitIndex % 2 === 0 ? config.firstDigitDirection : (config.firstDigitDirection === 'up' ? 'down' : 'up'))
          : config.firstDigitDirection;
        digitIndex += 1;

        const frames = buildDigitFrames(asDigit(fromChar), asDigit(toChar), direction, config.spinCycles);
        const viewport = document.createElement('span');
        const track = document.createElement('span');
        viewport.className = 'bf-number-reel__viewport';
        track.className = 'bf-number-reel__track';

        const orderedFrames = direction === 'up' ? frames : [...frames].reverse();
        const startIndex = direction === 'up' ? 0 : orderedFrames.length - 1;
        const targetIndex = direction === 'up' ? orderedFrames.length - 1 : 0;

        track.innerHTML = orderedFrames
          .map((digit) => `<span class="bf-number-reel__row">${digit}</span>`)
          .join('');
        track.dataset.startIndex = String(startIndex);
        track.dataset.targetIndex = String(targetIndex);

        viewport.appendChild(track);
        charWrapper.appendChild(viewport);
        animatedTracks.push(track);
      } else {
        const staticChar = document.createElement('span');
        staticChar.className = 'bf-number-reel__char bf-number-reel__char--static';
        staticChar.innerHTML = toChar === ' ' ? '&nbsp;' : escapeHtml(toChar);
        charWrapper.appendChild(staticChar);
      }

      charsHost.appendChild(charWrapper);
    }

    return animatedTracks;
  };

  const animateTo = (nextValue) => {
    const startValue = currentValue;
    if (startValue === null || Number.isNaN(startValue)) {
      renderStatic(nextValue);
      return;
    }

    const fromText = formatter(startValue);
    const toText = formatter(nextValue);
    if (fromText === toText) {
      renderStatic(nextValue);
      return;
    }

    stopPendingTransition();
    const animatedTracks = renderAnimatedChars(fromText, toText);
    if (!animatedTracks.length) {
      renderStatic(nextValue);
      return;
    }

    let pendingTransitions = animatedTracks.length;
    let didFinish = false;
    const finishAnimation = () => {
      if (didFinish) return;
      didFinish = true;
      stopPendingTransition();
      lockTimer = setTimeout(() => {
        renderStatic(nextValue);
      }, config.settleDurationMs);
    };

    animatedTracks.forEach((track, index) => {
      const startIndex = Number(track.dataset.startIndex || 0);
      const targetIndex = Number(track.dataset.targetIndex || 0);
      const rowHeight = track.firstElementChild?.getBoundingClientRect().height || root.getBoundingClientRect().height || 16;
      const startOffset = startIndex * rowHeight;
      const targetOffset = targetIndex * rowHeight;
      const delayMs = config.startDelayMs + (index * config.digitStaggerMs);

      track.style.transition = 'none';
      track.style.transform = `translate3d(0, -${startOffset}px, 0)`;
      // Reflow to arm transition.
      track.offsetHeight;
      track.style.transition = `transform ${config.durationMs}ms ${config.easing} ${delayMs}ms`;
      track.style.transform = `translate3d(0, -${targetOffset}px, 0)`;

      const onTransitionEnd = (event) => {
        if (event.target !== track || event.propertyName !== 'transform') return;
        track.removeEventListener('transitionend', onTransitionEnd);
        pendingTransitions -= 1;
        if (pendingTransitions <= 0) {
          finishAnimation();
        }
      };

      track.addEventListener('transitionend', onTransitionEnd);
      animationCleanups.push(() => track.removeEventListener('transitionend', onTransitionEnd));
    });

    settleTimer = setTimeout(
      finishAnimation,
      config.durationMs + config.startDelayMs + (Math.max(0, animatedTracks.length - 1) * config.digitStaggerMs) + 120,
    );
  };

  const setValue = (value, setOptions = {}) => {
    if (isDestroyed) return;
    const { animate = true, force = false } = setOptions;

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      renderStatic(value);
      return;
    }

    if (!force && currentValue === numericValue) return;

    if (!animate || reducedMotionMedia.matches || currentValue === null) {
      renderStatic(numericValue);
      return;
    }

    animateTo(numericValue);
  };

  if (initialText) {
    const parsedInitial = Number(initialText.replace(',', '.').replace(/[^\d.-]/g, ''));
    if (Number.isFinite(parsedInitial)) {
      renderStatic(parsedInitial);
    } else {
      charsHost.innerHTML = `<span class="bf-number-reel__char bf-number-reel__char--static">${escapeHtml(initialText)}</span>`;
    }
  }

  const destroy = () => {
    if (isDestroyed) return;
    isDestroyed = true;
    stopPendingTransition();
    const fallbackText = charsHost.textContent || '';
    root.textContent = fallbackText;
    root.classList.remove('bf-number-reel');
  };

  return {
    setValue,
    destroy,
  };
};

export const NUMBER_REEL_DEFAULTS = DEFAULT_REEL_CONFIG;
