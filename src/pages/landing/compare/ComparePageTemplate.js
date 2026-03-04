/**
 * Compare Page Template
 * Renders comparison pages from comparePages.js config.
 */
import { createHero } from '../../../components/landing/Hero.js';
import { createCompareTable } from '../../../components/landing/CompareTable.js';
import { createFAQAccordion, initFAQAccordion } from '../../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema } from '../../../lib/seoHelper.js';
import { escapeHtml } from '../../../lib/sanitize.js';
import { comparePages } from '../../../data/comparePages.js';

/**
 * Render a compare page by slug
 */
export const renderComparePage = (slug) => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const page = comparePages[slug];
  if (!page) {
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container landing-hero-centered">
          <h1 class="landing-h1">Vergleich nicht gefunden</h1>
          <p class="landing-text-lg">Der Vergleich "${escapeHtml(slug)}" existiert noch nicht.</p>
        </div>
      </section>`;
    return;
  }

  setPageMeta(page.meta.title, page.meta.description);
  if (page.faq) setFAQSchema(page.faq);

  const differencesHTML = page.keyDifferences.map((d, i) => `
    <div style="padding: 1.5rem; background: ${i % 2 === 0 ? 'white' : 'var(--color-stone-50)'}; border-radius: 12px; border: 1px solid var(--color-stone-200);">
      <h3 class="landing-h4">${d.title}</h3>
      <p class="landing-text-sm">${d.description}</p>
    </div>
  `).join('');

  content.innerHTML = `
    ${createHero({
      headline: page.hero.headline,
      subheadline: page.hero.subheadline,
      secondaryCTA: '',
    })}

    <!-- Key Differences -->
    <section class="landing-section">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="landing-label">Die wichtigsten Unterschiede</p>
          <h2 class="landing-h2">Was BookFast anders macht.</h2>
        </div>
        <div class="landing-grid landing-grid-3" style="max-width: 960px; margin: 0 auto;">
          ${differencesHTML}
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 class="landing-h2">Feature-Vergleich im Detail</h2>
        </div>
        ${createCompareTable(page.comparison)}
      </div>
    </section>

    <!-- For Whom -->
    <section class="landing-section">
      <div class="landing-container-narrow text-center">
        <h2 class="landing-h2">Für wen ist was besser?</h2>
        <p class="landing-text" style="margin-top: 1rem;">${page.forWhom}</p>
      </div>
    </section>

    <!-- Migration hint -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container-narrow text-center">
        <h2 class="landing-h2">Von ${page.name} zu BookFast wechseln</h2>
        <p class="landing-text">Der Wechsel ist einfach: Account erstellen, Angebote einrichten, Widget einbetten. Deine bisherigen Buchungen bleiben bei ${page.name} – neue Buchungen laufen über BookFast.</p>
        <div style="margin-top: 2rem;">
          <a href="/login.html" class="landing-btn landing-btn-primary">Jetzt wechseln – kostenlos starten</a>
        </div>
      </div>
    </section>

    ${page.faq?.length ? `
    <section class="landing-section">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu BookFast vs. ${escapeHtml(page.name)}.</h2>
        </div>
        ${createFAQAccordion(page.faq)}
      </div>
    </section>` : ''}

    ${createCTASection({
      headline: 'Teste BookFast selbst.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. Ohne Verpflichtung.',
    })}
  `;

  if (page.faq?.length) initFAQAccordion(content);
};
