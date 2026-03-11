/**
 * Feature Page Template
 * Renders ANY feature page based on config data from featurePages.js
 * All feature pages use FeatureHero + interactiveHowItWorks (when steps exist).
 */
import { createFeatureHero } from '../../../components/landing/FeatureHero.js';
import { getDemoModule } from '../../../components/landing/featureDemos/index.js';
import { createFeatureSection } from '../../../components/landing/FeatureSection.js';
import { createHowItWorksInteractive, initHowItWorksInteractive } from '../../../components/landing/HowItWorksInteractive.js';
import { createFAQSection, initFAQAccordion } from '../../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../../components/landing/FeatureRelatedSlider.js';
import { setPageMeta, setFAQSchema } from '../../../lib/seoHelper.js';
import { escapeHtml } from '../../../lib/sanitize.js';
import { svgAssetUrl } from '../../../lib/landingAssets.js';
import { featurePages } from '../../../data/features/index.js';
import { getRelatedFeaturesFor } from '../../../data/features/relatedFeatures.js';

/**
 * Render a feature page by slug
 * @param {string} slug - Feature slug (e.g. 'buchungen')
 */
export const renderFeaturePage = (slug) => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const page = featurePages[slug];
  if (!page) {
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container landing-hero-centered">
          <h1 class="landing-h1">Feature nicht gefunden</h1>
          <p class="landing-text-lg">Das Feature "${escapeHtml(slug)}" existiert noch nicht.</p>
          <div class="landing-hero-ctas" style="justify-content: center;">
            <a href="/features" class="landing-btn landing-btn-secondary" data-landing-link title="Alle Features anzeigen">Alle Features</a>
          </div>
        </div>
      </section>`;
    return;
  }

  setPageMeta(page.meta.title, page.meta.description);
  setFAQSchema(page.faq || []);

  // Build journey sections (alternating left/right like Integrations page)
  const journeyHTML = page.journey?.length ? page.journey.map((step, i) => `
    <section class="landing-section ${i % 2 === 0 ? 'landing-section-alt' : ''}">
      <div class="landing-container">
        ${createFeatureSection({
          title: step.title,
          description: step.description,
          bullets: step.bullets || [],
          reverse: !!step.reverse,
        })}
      </div>
    </section>
  `).join('') : '';

  // Fallback: Steps when no journey
  const hasInteractiveHowItWorks = Boolean(page.interactiveHowItWorks && page.steps?.length);
  const interactiveHowItWorksHTML = hasInteractiveHowItWorks
    ? createHowItWorksInteractive({
        label: page.interactiveHowItWorksLabel || "So funktioniert's",
        headline: page.interactiveHowItWorksHeadline || `${page.meta.title} in ${page.steps.length} Schritten.`,
        steps: page.steps,
        previewHTML: '',
      })
    : '';

  const fallbackHTML = !page.journey?.length ? `
    <!-- 2. So funktioniert's (alternierendes links-rechts Layout) -->
    ${page.steps?.length && !hasInteractiveHowItWorks ? `
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">So funktioniert's</p>
        <h2 class="landing-h2">${page.meta.title} in ${page.steps.length} Schritten.</h2>
      </div>
    </section>
    ${page.steps.map((step, i) => `
    <section class="landing-section ${i % 2 === 1 ? 'landing-section-alt' : ''}">
      <div class="landing-container">
        ${createFeatureSection({
          title: step.title?.startsWith(String(i + 1) + '.') ? step.title : `${i + 1}. ${step.title}`,
          description: step.description,
          bullets: step.bullets || [],
          imageHTML: `<div class="landing-feature-image" style="height: 200px; display:flex; align-items:center; justify-content:center; background: var(--color-stone-100); border-radius: 12px;"><span style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-vulcan-900); color: white; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center;">${i + 1}</span></div>`,
          reverse: step.reverse !== undefined ? step.reverse : (i % 2 === 1),
        })}
      </div>
    </section>`).join('')}` : ''}
  ` : '';

  // Build hero: FeatureHero for all feature pages (demo module or illustration)
  const demoMod = page.hero.demoModule ? getDemoModule(page.hero.demoModule) : null;
  const defaultIllustration = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');
  const heroHTML = createFeatureHero({
    headline: page.hero.headline,
    subheadline: page.hero.subheadline,
    illustrationSrc: page.hero.illustration || defaultIllustration,
    illustrationAlt: `Illustration zum Feature ${page.meta.title} in BookFast`,
    breadcrumb: ['Home', 'Features', page.meta.title],
    demoModuleHTML: demoMod ? demoMod.create() : '',
    demoHint: demoMod ? "Tippe, klicke & probier's aus — ganz ohne Account." : '',
  });
  const relatedFeatures = getRelatedFeaturesFor(slug, { limit: 5 });
  const relatedFeaturesHTML = createFeatureRelatedSlider({
    currentTitle: page.meta.title,
    features: relatedFeatures,
  });

  content.innerHTML = `
    <!-- 1. Hero -->
    ${heroHTML}

    ${hasInteractiveHowItWorks ? `
    <!-- 2. So funktioniert's (interactive) -->
    ${interactiveHowItWorksHTML}
    ` : ''}

    ${page.journey?.length ? `
    <!-- 2. Journey (alternating sections) -->
    ${journeyHTML}
    ` : fallbackHTML}

    <!-- 5. CTA -->
    ${createCTASection({
      headline: page.cta?.headline ?? `${page.meta.title} kostenlos testen.`,
      subheadline: page.cta && 'subheadline' in page.cta ? page.cta.subheadline : '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}

    <!-- 6. Related Features Slider -->
    ${relatedFeaturesHTML}

    <!-- 8. FAQ (nur Feature-spezifisch, kein allgemeines FAQ) -->
    ${createFAQSection({
      pageFaq: page.faq || [],
      pageTitle: page.meta.title,
      featureOnly: true,
    })}
  `;

  // Init interactive demo module (if present)
  if (demoMod) demoMod.init(content);

  // Init interactive "How it works" section (currently enabled for objekte)
  if (hasInteractiveHowItWorks) {
    initHowItWorksInteractive(content, {
      renderPreview: () => {
        const heroPreview = content.querySelector('#feature-hero-demo .feature-hero__card-frame');
        if (!heroPreview) return '';
        const clone = heroPreview.cloneNode(true);
        clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
        return clone.outerHTML;
      },
    });
  }

  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};
