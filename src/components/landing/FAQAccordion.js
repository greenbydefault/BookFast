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
