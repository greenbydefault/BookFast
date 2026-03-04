/**
 * Docs article template.
 */
import { createCTASection } from '../../../components/landing/CTASection.js';
import { createFAQAccordion, initFAQAccordion } from '../../../components/landing/FAQAccordion.js';
import { setPageMeta, setFAQSchema } from '../../../lib/seoHelper.js';
import { escapeHtml } from '../../../lib/sanitize.js';
import { docsArticles } from '../../../data/docs/index.js';

export const renderDocPage = (slug) => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const article = docsArticles[slug];
  if (!article) {
    content.innerHTML = `
      <section class="landing-section">
        <div class="landing-container-narrow docs-article-not-found">
          <p class="landing-label">Dokumentation</p>
          <h1 class="landing-h1">Artikel nicht gefunden</h1>
          <p class="landing-text">Der Artikel "${escapeHtml(slug)}" ist nicht vorhanden.</p>
          <div class="docs-inline-links">
            <a href="/docs" data-landing-link class="landing-btn landing-btn-secondary">Zur Dokumentation</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  setPageMeta(article.title, article.description);
  if (article.faq?.length) setFAQSchema(article.faq);

  const tocHTML = (article.toc || []).map(item => `
    <li>
      <a href="#${item.id}" class="docs-anchor-link">${item.label}</a>
    </li>
  `).join('');

  const sectionsHTML = (article.sections || []).map(section => `
    <article class="docs-article-section" id="${section.id}">
      <h2 class="landing-h2">${section.title}</h2>
      ${(section.paragraphs || []).map(text => `<p class="landing-text">${text}</p>`).join('')}
      ${(section.bullets && section.bullets.length) ? `
        <ul class="docs-bullet-list">
          ${section.bullets.map(point => `<li>${point}</li>`).join('')}
        </ul>
      ` : ''}
    </article>
  `).join('');

  content.innerHTML = `
    <section class="landing-section landing-section-sm docs-article-hero">
      <div class="landing-container-narrow">
        <a href="/docs" data-landing-link class="docs-back-link">← Zurueck zur Dokumentation</a>
        <p class="landing-label">${article.category}</p>
        <h1 class="landing-h1">${article.title}</h1>
        <p class="landing-text">${article.intro}</p>
        <div class="docs-meta-row">
          <span>Aktualisiert: ${article.updatedAt}</span>
          <span>Lesezeit: ${article.readTime}</span>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section-alt docs-article-layout">
      <div class="landing-container docs-article-grid">
        <aside class="docs-toc-card">
          <p class="landing-label">Inhalt</p>
          <ul class="docs-toc-list">${tocHTML}</ul>
        </aside>
        <div class="docs-article-content">
          ${sectionsHTML}
        </div>
      </div>
    </section>

    ${(article.faq && article.faq.length) ? `
      <section class="landing-section">
        <div class="landing-container">
          <div class="text-center docs-heading-block">
            <p class="hero-new__tagline">FAQ</p>
            <h2 class="landing-h2">Häufige Fragen zum Artikel</h2>
          </div>
          ${createFAQAccordion(article.faq)}
        </div>
      </section>
    ` : ''}

    ${createCTASection({
      headline: 'Noch Fragen zum Setup?',
      subheadline: 'Unser Team hilft dir bei Tracking, Integrationen und der optimalen Konfiguration deines Widgets.',
      primaryCTA: 'Support kontaktieren',
      primaryHref: '/kontakt',
      secondaryCTA: 'Zur Dokumentation',
      secondaryHref: '/docs',
    })}
  `;

  const faqContainer = content.querySelector('.landing-faq-list');
  if (faqContainer) initFAQAccordion(content);
};

