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
import { getFeatureDemoModuleContent } from '../../../lib/getLocaleDemoModule.js';
import { deFeatureSlugToEn } from '../../../lib/featureSlugLocale.js';
import { getUiChrome } from '../../../locales/uiChrome.js';
import { setLandingContent } from '../../../lib/landingContent.js';

/**
 * Render a feature page by slug
 * @param {string} slug - DE feature slug (e.g. 'buchungen')
 * @param {'de'|'en'} [locale='de']
 */
export const renderFeaturePage = (slug, locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const chrome = getUiChrome(locale);
  const page = getFeaturePage(slug, locale);
  if (!page) {
    const featuresHref = locale === 'en' ? '/en/features' : '/features';
    content.innerHTML = `
      <section class="landing-hero">
        <div class="landing-container landing-hero-centered">
          <h1 class="landing-h1">${chrome.feature.notFoundTitle}</h1>
          <p class="landing-text-lg">${chrome.feature.notFoundBody(escapeHtml(slug))}</p>
          <div class="landing-hero-ctas" style="justify-content: center;">
            <a href="${featuresHref}" class="landing-btn landing-btn-secondary" data-landing-link title="${chrome.feature.allFeaturesTitle}">${chrome.feature.allFeatures}</a>
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
        label: page.interactiveHowItWorksLabel || chrome.feature.howItWorksLabel,
        headline: page.interactiveHowItWorksHeadline || chrome.feature.howItWorksHeadline(page.meta.title, page.steps.length),
        steps: page.steps,
        previewHTML: '',
      })
    : '';

  // Build hero: FeatureHero for all feature pages (demo module or illustration)
  const demoModuleKey = page.hero.demoModule || null;
  const demoMod = demoModuleKey ? getDemoModule(demoModuleKey) : null;
  const demoModuleContent = demoModuleKey ? getFeatureDemoModuleContent(demoModuleKey, locale) : null;
  const defaultIllustration = svgAssetUrl('illustrations/landingpage/features/ft_objektverwaltung.svg');
  const heroHTML = createFeatureHero({
    headline: page.hero.headline,
    subheadline: page.hero.subheadline,
    illustrationSrc: resolveSvgAssetUrl(page.hero.illustration) || defaultIllustration,
    illustrationAlt: chrome.feature.illustrationAlt(page.meta.title),
    breadcrumb: [chrome.feature.breadcrumbHome, chrome.feature.breadcrumbFeatures, page.meta.title],
    breadcrumbHrefs: [homePath, featuresPath],
    locale,
    demoModuleHTML: demoMod && demoModuleContent ? demoMod.create({ content: demoModuleContent, locale }) : '',
    demoHint: demoMod ? chrome.feature.demoHint : '',
  });
  const relatedFeatures = getRelatedFeaturesFor(slug, { limit: 5, locale });
  const relatedFeaturesHTML = createFeatureRelatedSlider({
    currentTitle: page.meta.title,
    features: relatedFeatures,
    locale,
  });

  setFAQSchema(page.faq || []);

  setLandingContent(content, `
    <!-- 1. Hero -->
    ${heroHTML}

    ${hasInteractiveHowItWorks ? `
    <!-- 2. So funktioniert's (interactive) -->
    ${interactiveHowItWorksHTML}
    ` : ''}

    <!-- 5. CTA -->
    ${createCTASection({
      locale,
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
      } : {}),
    })}

    <!-- 6. Related Features Slider -->
    ${relatedFeaturesHTML}

    <!-- 8. FAQ (nur Feature-spezifisch, kein allgemeines FAQ) -->
    ${createFAQSection({
      locale,
      pageFaq: page.faq || [],
      pageTitle: page.meta.title,
      featureOnly: true,
    })}
  `);

  // Init interactive demo module (if present)
  if (demoMod && demoModuleContent) demoMod.init(content, { content: demoModuleContent, locale });

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
