/**
 * FAQ Section – Zwei-Spalten-Layout (oder einspaltig bei featureOnly)
 * Spalte 1: Häufige Fragen (shared)
 * Spalte 2: Individueller Part für die jeweilige Landingpage
 *
 * @param {Object} opts
 * @param {Array<{question: string, answer: string}>} [opts.sharedFaq]
 * @param {Array<{question: string, answer: string}>} [opts.pageFaq]
 * @param {string} [opts.pageTitle] – z.B. "Buchungsverwaltung" für Spalte-2-Überschrift
 * @param {boolean} [opts.featureOnly] – nur pageFaq anzeigen (kein shared FAQ), für Feature-Seiten
 * @param {'de'|'en'} [opts.locale]
 * @returns {string} HTML string
 */
import { getUiChrome } from '../../locales/uiChrome.js';

export const createFAQSection = ({
  sharedFaq = [],
  pageFaq = [],
  pageTitle = '',
  featureOnly = false,
  locale = 'de',
} = {}) => {
  const chrome = getUiChrome(locale);
  const col1 = createFAQAccordion(sharedFaq);
  const col2 = createFAQAccordion(pageFaq);
  const heading = featureOnly
    ? chrome.faq.headingFeature(pageTitle)
    : chrome.faq.headingBookfast;

  if (featureOnly) {
    return `
    <section class="landing-section landing-section-alt landing-section--centered">
      <div class="landing-container">
        <div class="text-center landing-faq-section-header">
          <p class="hero-new__tagline">${chrome.faq.tagline}</p>
          <h2 class="landing-h2">${heading}</h2>
        </div>
        <div class="landing-faq-grid landing-faq-grid--single">
          <div class="landing-faq-col">
            ${col2 || `<p class="landing-faq-empty">${chrome.faq.empty}</p>`}
          </div>
        </div>
      </div>
    </section>
  `;
  }

  const hasPageFaq = pageFaq && pageFaq.length > 0;

  if (!hasPageFaq) {
    return `
    <section class="landing-section landing-section-alt landing-section--centered">
      <div class="landing-container">
        <div class="text-center landing-faq-section-header">
          <p class="hero-new__tagline">${chrome.faq.tagline}</p>
          <h2 class="landing-h2">${heading}</h2>
        </div>
        <div class="landing-faq-grid landing-faq-grid--single">
          <div class="landing-faq-col">
            ${col1}
          </div>
        </div>
      </div>
    </section>
  `;
  }

  return `
    <section class="landing-section landing-section-alt landing-section--centered">
      <div class="landing-container">
        <div class="text-center landing-faq-section-header">
          <p class="hero-new__tagline">${chrome.faq.tagline}</p>
          <h2 class="landing-h2">${heading}</h2>
        </div>
        <div class="landing-faq-grid">
          <div class="landing-faq-col">
            <h3 class="landing-faq-col-heading">${chrome.faq.colHeading}</h3>
            ${col1}
          </div>
          <div class="landing-faq-col">
            ${col2}
          </div>
        </div>
      </div>
    </section>
  `;
};

/**
 * FAQ Accordion Component
 *
 * @param {Array<{question: string, answer: string}>} items
 * @returns {string} HTML string
 */
export const createFAQAccordion = (items) => {
  if (!items || items.length === 0) return '';

  const uid = `landing-faq-${Math.random().toString(36).slice(2, 8)}`;
  const itemsHTML = items.map((item, i) => {
    const answerId = `${uid}-answer-${i}`;
    const questionId = `${uid}-question-${i}`;
    return `
    <div class="landing-faq-item" data-faq-index="${i}">
      <h3 class="landing-faq-question-heading">
        <button type="button" class="landing-faq-question" id="${questionId}" aria-expanded="false" aria-controls="${answerId}">
          <span class="landing-faq-question-text">${item.question}</span>
          <span class="landing-faq-chevron" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="landing-faq-answer" id="${answerId}" role="region" aria-labelledby="${questionId}">
        <div class="landing-faq-answer-inner">
          <p>${item.answer}</p>
        </div>
      </div>
    </div>
  `;
  }).join('');

  return `<div class="landing-faq-list">${itemsHTML}</div>`;
};

/**
 * Initialize FAQ accordion interactions (call after DOM insertion)
 * @param {HTMLElement} container - Container with .landing-faq-list
 */
export const initFAQAccordion = (container) => {
  const items = container.querySelectorAll('.landing-faq-item');
  const closeItem = (item) => {
    item.classList.remove('open');
    const btn = item.querySelector('.landing-faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  };

  const openItem = (item) => {
    item.classList.add('open');
    const btn = item.querySelector('.landing-faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  };

  items.forEach((item) => {
    const btn = item.querySelector('.landing-faq-question');
    const answer = item.querySelector('.landing-faq-answer');
    if (!btn || !answer) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((entry) => closeItem(entry));
      if (!isOpen) openItem(item);
    });
  });
};
