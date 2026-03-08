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
 * @returns {string} HTML string
 */
export const createFAQSection = ({ sharedFaq = [], pageFaq = [], pageTitle = '', featureOnly = false }) => {
  const col1 = createFAQAccordion(sharedFaq);
  const col2 = createFAQAccordion(pageFaq);
  const pageHeading = (pageTitle && pageFaq?.length) ? `<h3 class="landing-faq-col-heading">Fragen zu ${pageTitle}</h3>` : '';

  if (featureOnly) {
    return `
    <section class="landing-section landing-section-alt landing-section--centered">
      <div class="landing-container">
        <div class="text-center landing-faq-section-header">
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu ${pageTitle || 'BookFast'}.</h2>
        </div>
        <div class="landing-faq-grid landing-faq-grid--single">
          <div class="landing-faq-col">
            ${pageHeading}
            ${col2 || '<p class="landing-faq-empty">Keine Fragen für dieses Feature.</p>'}
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
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu BookFast.</h2>
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
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu BookFast.</h2>
        </div>
        <div class="landing-faq-grid">
          <div class="landing-faq-col">
            <h3 class="landing-faq-col-heading">Häufige Fragen</h3>
            ${col1}
          </div>
          <div class="landing-faq-col">
            ${pageHeading}
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

  const itemsHTML = items.map((item, i) => `
    <div class="landing-faq-item" data-faq-index="${i}">
      <button class="landing-faq-question">
        <span>${item.question}</span>
        <span class="landing-faq-chevron" aria-hidden="true"></span>
      </button>
      <div class="landing-faq-answer">
        <div class="landing-faq-answer-inner">
          <p>${item.answer}</p>
        </div>
      </div>
    </div>
  `).join('');

  return `<div class="landing-faq-list">${itemsHTML}</div>`;
};

/**
 * Initialize FAQ accordion interactions (call after DOM insertion)
 * @param {HTMLElement} container - Container with .landing-faq-list
 */
export const initFAQAccordion = (container) => {
  const items = container.querySelectorAll('.landing-faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.landing-faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
};
