/**
 * BookFast vs FlowBookings comparison page.
 */
import { createHero } from '../../components/landing/Hero.js';
import { createCompareTable } from '../../components/landing/CompareTable.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../components/landing/FeatureRelatedSlider.js';
import { COMPARE_FLOWBOOKINGS_DE } from '../../data/compareFlowbookings.js';
import { COMPARE_FLOWBOOKINGS_EN } from '../../locales/en/compareFlowbookings.js';
import { resolveSvgAssetUrl } from '../../lib/landingAssets.js';
import { escapeHtml } from '../../lib/sanitize.js';
import { setPageMeta, setFAQSchema, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { setLandingContent } from '../../lib/landingContent.js';

const getCopy = (locale) => (locale === 'en' ? COMPARE_FLOWBOOKINGS_EN : COMPARE_FLOWBOOKINGS_DE);

export const renderCompareFlowbookingsPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const copy = getCopy(locale);
  const homeHref = isEn ? '/en' : '/';
  const pricingHref = isEn ? '/en/pricing' : '/preise';
  const pagePath = isEn ? '/en/compare/flowbookings' : '/vergleich/flowbookings';

  setPageMeta(copy.meta.title, copy.meta.description, { locale });
  setFAQSchema(copy.faq);
  setBreadcrumbSchema([
    { name: 'Home', url: homeHref },
    { name: isEn ? 'Compare' : 'Vergleich', url: pagePath },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/vergleich/flowbookings' },
    { hreflang: 'en', path: '/en/compare/flowbookings' },
  ]);

  const slidersHTML = (copy.sliders || []).map((slider) => createFeatureRelatedSlider({
    label: slider.label,
    headline: slider.headline,
    intro: slider.intro,
    cards: slider.cards,
    locale,
  })).join('');

  setLandingContent(content, `
    ${createHero({
      headline: copy.hero.headline,
      subheadline: copy.hero.subheadline,
      illustrationSrc: resolveSvgAssetUrl('/src/svg/illustrations/landingpage/features/ft_kundenportal.svg'),
      illustrationAlt: copy.hero.illustrationAlt,
      primaryCTA: copy.hero.primaryCTA,
      primaryHref: homeHref,
      secondaryCTA: copy.hero.secondaryCTA,
      secondaryHref: pricingHref,
      trustClaims: copy.hero.trustClaims,
    })}

    <section class="landing-section">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2rem;">
          <p class="hero-new__tagline">${escapeHtml(copy.table.label)}</p>
          <h2 class="landing-h2">${escapeHtml(copy.table.headline)}</h2>
        </div>
        ${createCompareTable({
          columns: copy.table.columns,
          rows: copy.table.rows,
          wide: true,
          caption: copy.table.headline,
        })}
        <p class="landing-text-sm landing-compare-footnote">${escapeHtml(copy.table.footnote)}</p>
      </div>
    </section>

    ${slidersHTML}

    ${createCTASection({
      locale,
      headline: copy.cta.headline,
      subheadline: copy.cta.subheadline,
    })}

    ${createFAQSection({
      pageFaq: copy.faq,
      featureOnly: true,
      pageTitle: 'BookFast vs FlowBookings',
      locale,
    })}
  `);

  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};
