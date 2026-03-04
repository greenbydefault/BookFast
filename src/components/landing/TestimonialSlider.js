/**
 * Testimonial Slider Component
 *
 * @param {Array<{quote: string, name: string, role: string, company?: string}>} testimonials
 * @returns {string} HTML
 */
export const createTestimonialSlider = (testimonials) => {
  if (!testimonials || testimonials.length === 0) return '';

  const cardsHTML = testimonials.map(t => {
    const initials = t.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `
      <div class="landing-testimonial-card">
        <p class="landing-testimonial-quote">"${t.quote}"</p>
        <div class="landing-testimonial-author">
          <div class="landing-testimonial-avatar">${initials}</div>
          <div>
            <div class="landing-testimonial-name">${t.name}</div>
            <div class="landing-testimonial-role">${t.role}${t.company ? `, ${t.company}` : ''}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  const cols = testimonials.length >= 3 ? 3 : testimonials.length;
  return `<div class="landing-grid landing-grid-${cols}">${cardsHTML}</div>`;
};
