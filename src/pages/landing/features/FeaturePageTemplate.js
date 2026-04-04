/**
 * Feature Page Template
 * Renders ANY feature page based on config data from featurePages.js
 * All feature pages use FeatureHero + interactiveHowItWorks (when steps exist).
 */
import { createFeatureHero } from '../../../components/landing/FeatureHero.js';
import { getDemoModule } from '../../../components/landing/featureDemos/index.js';
import { createHowItWorksInteractive, initHowItWorksInteractive } from '../../../components/landing/HowItWorksInteractive.js';
import { createFAQSection, initFAQAccordion } from '../../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../../components/landing/CTASection.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../../components/landing/FeatureRelatedSlider.js';
import { setPageMeta, setFAQSchema, setBreadcrumbSchema, setHreflangAlternates } from '../../../lib/seoHelper.js';
import { escapeHtml } from '../../../lib/sanitize.js';
import { svgAssetUrl, resolveSvgAssetUrl } from '../../../lib/landingAssets.js';
import { getRelatedFeaturesFor } from '../../../data/features/relatedFeatures.js';
import { getHowItWorksPreviewHtml } from '../../../lib/howItWorksPreviewSlice.js';
import { getFeaturePage } from '../../../lib/getLocaleContent.js';
import { deFeatureSlugToEn } from '../../../lib/featureSlugLocale.js';

/**
 * Render a feature page by slug
 * @param {string} slug - DE feature slug (e.g. 'buchungen')
 * @param {'de'|'en'} [locale='de']
 */
export const renderFeaturePage = (slug, locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const page = getFeaturePage(slug, locale);
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

  const enSlug = deFeatureSlugToEn(slug);
  const featurePath = locale === 'en' && enSlug ? `/en/features/${enSlug}` : `/features/${slug}`;
  const homePath = locale === 'en' ? '/en' : '/';
  const featuresPath = locale === 'en' ? '/en/features' : '/features';

  setPageMeta(page.meta.title, page.meta.description, { locale });
  setBreadcrumbSchema([
    { name: 'Home', url: homePath },
    { name: 'Features', url: featuresPath },
    { name: page.meta.title, url: featurePath },
  ]);
  const dePath = `/features/${slug}`;
  const enPath = enSlug ? `/en/features/${enSlug}` : null;
  if (enPath) {
    setHreflangAlternates([
      { hreflang: 'de', path: dePath },
      { hreflang: 'en', path: enPath },
    ]);
  }

  const hasInteractiveHowItWorks = Boolean(page.interactiveHowItWorks && page.steps?.length);
  const interactiveHowItWorksHTML = hasInteractiveHowItWorks
    ? createHowItWorksInteractive({
        label: page.interactiveHowItWorksLabel || "So funktioniert's",
        headline: page.interactiveHowItWorksHeadline || `${page.meta.title} in ${page.steps.length} Schritten.`,
        steps: page.steps,
        previewHTML: '',
      })
    : '';

  // Build hero: FeatureHero for all feature pages (demo module or illustration)
  const demoMod = page.hero.demoModule ? getDemoModule(page.hero.demoModule) : null;
  const defaultIllustration = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');
  const heroHTML = createFeatureHero({
    headline: page.hero.headline,
    subheadline: page.hero.subheadline,
    illustrationSrc: resolveSvgAssetUrl(page.hero.illustration) || defaultIllustration,
    illustrationAlt: `Illustration zum Feature ${page.meta.title} in BookFast`,
    breadcrumb: ['Home', 'Features', page.meta.title],
    demoModuleHTML: demoMod ? demoMod.create() : '',
    demoHint: demoMod ? "Tippe, klicke & probier's aus — ganz ohne Account." : '',
  });
  const relatedFeatures = getRelatedFeaturesFor(slug, { limit: 5, locale });
  const relatedFeaturesHTML = createFeatureRelatedSlider({
    currentTitle: page.meta.title,
    features: relatedFeatures,
    locale,
  });

  setFAQSchema(page.faq || []);

  content.innerHTML = `
    <!-- 1. Hero -->
    ${heroHTML}

    ${hasInteractiveHowItWorks ? `
    <!-- 2. So funktioniert's (interactive) -->
    ${interactiveHowItWorksHTML}
    ` : ''}

    <!-- 5. CTA -->
    ${createCTASection({
      headline: page.cta?.headline ?? (locale === 'en'
        ? `Try ${page.meta.title} for free.`
        : `${page.meta.title} kostenlos testen.`),
      subheadline: page.cta && 'subheadline' in page.cta
        ? page.cta.subheadline
        : (locale === 'en'
          ? '3-day free trial. No credit card required. Ready in under 5 minutes.'
          : '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.'),
      ...(locale === 'en' ? {
        primaryCTA: 'Start live demo',
        secondaryCTA: 'Try for free',
      } : {}),
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
      renderPreview: (stepIndex) => getHowItWorksPreviewHtml(content, stepIndex, {
        sliceSelectors: page.howItWorksPreviewSlices,
      }),
    });
  }

  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};
