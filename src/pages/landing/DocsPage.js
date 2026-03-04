/**
 * Documentation Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createStepsSection } from '../../components/landing/StepsSection.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { setPageMeta } from '../../lib/seoHelper.js';
import { docsHubCategories, docsPopularArticles } from '../../data/docs/index.js';

const ICON_MAP = {
  Spark: '✨',
  Globe: '🌐',
  Card: '💳',
  Gear: '⚙️',
};

export const renderDocsPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Dokumentation', 'BookFast Dokumentation - Schnellstart, Webflow-Integration, Zahlungen und Konfiguration.');

  const categoriesHTML = docsHubCategories.map(cat => `
    <article class="docs-category-card">
      <div class="docs-category-icon" aria-hidden="true">${ICON_MAP[cat.icon] || '📘'}</div>
      <h3 class="landing-h3">${cat.title}</h3>
      <ul class="docs-category-list">
        ${cat.articles.map(a => `
          <li class="docs-category-item">
            <a href="${a.href}" data-landing-link class="docs-category-link">
              <span class="docs-category-link-title">${a.title}</span>
              <span class="docs-category-link-description">${a.description}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');

  content.innerHTML = `
    ${createHero({
      headline: 'In 3 Schritten startklar - mit unserer Dokumentation.',
      subheadline: 'Schnellstart, Webflow-Integration, Zahlungen und Konfiguration. Alles was du brauchst, um BookFast einzurichten und zu nutzen.',
      primaryCTA: 'Kostenlos starten',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">Schnellstart</p>
        <h2 class="landing-h2">In 3 Schritten startklar.</h2>
        <div class="docs-step-wrap">
          ${createStepsSection([
            { title: 'Registrieren', description: 'Erstelle deinen kostenlosen Account in unter 2 Minuten.' },
            { title: 'Einrichten', description: 'Objekt, Service und Preise anlegen. Stripe verbinden.' },
            { title: 'Widget einbetten', description: 'Script-Tag in deine Website kopieren – fertig.' },
          ])}
        </div>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center docs-heading-block">
          <p class="landing-label">Kategorien</p>
          <h2 class="landing-h2">Dokumentation nach Thema</h2>
        </div>
        <div class="landing-grid landing-grid-2">${categoriesHTML}</div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container-narrow">
        <div class="text-center docs-heading-block-sm">
          <p class="landing-label">Beliebte Artikel</p>
          <h2 class="landing-h2">Häufig gesucht</h2>
        </div>
        <ul class="docs-popular-list">
          ${docsPopularArticles.map(a => `
            <li class="docs-popular-item">
              <a href="${a.href}" data-landing-link class="docs-popular-link">
                <div>
                  <div class="docs-popular-title">${a.question}</div>
                  <div class="docs-popular-description">${a.description}</div>
                </div>
                <span class="docs-popular-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    </section>

    ${createCTASection({
      headline: 'Frage nicht beantwortet?',
      subheadline: 'Kontaktiere unser Support-Team – wir helfen dir gerne weiter.',
      primaryCTA: 'Kontakt aufnehmen',
      primaryHref: '/kontakt',
      secondaryCTA: '',
    })}
  `;
};
