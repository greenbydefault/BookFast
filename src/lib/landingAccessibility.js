const normalizeLabel = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const resolveElementLabel = (element) => {
  const ariaLabel = normalizeLabel(element.getAttribute('aria-label'));
  if (ariaLabel) return ariaLabel;

  const text = normalizeLabel(element.textContent);
  if (text) return text;

  if (element instanceof HTMLInputElement) {
    const valueLabel = normalizeLabel(element.value);
    if (valueLabel) return valueLabel;
    const placeholder = normalizeLabel(element.getAttribute('placeholder'));
    if (placeholder) return placeholder;
  }

  if (element instanceof HTMLTextAreaElement) {
    const placeholder = normalizeLabel(element.getAttribute('placeholder'));
    if (placeholder) return placeholder;
  }

  return '';
};

const setMissingTitle = (element, title) => {
  if (!title) return;
  if (element.hasAttribute('title')) return;
  element.setAttribute('title', title);
};

export const applyLandingAccessibilityTitles = (root = document) => {
  if (!root) return;

  root.querySelectorAll('a, button, input, select, textarea').forEach((element) => {
    const label = resolveElementLabel(element);
    setMissingTitle(element, label);
  });

  // Aggressiver Modus: non-dekorative Bilder bekommen denselben title wie alt.
  root.querySelectorAll('img[alt]').forEach((img) => {
    const alt = normalizeLabel(img.getAttribute('alt'));
    if (!alt) return;
    setMissingTitle(img, alt);
  });
};
