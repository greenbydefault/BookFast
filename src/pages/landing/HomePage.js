/**
 * Homepage - New Hero Design
 */
import { createHeroNew, initHeroNew, createHeroLogoImg } from '../../components/landing/HeroNew.js';
import { createHowItWorksInteractive, initHowItWorksInteractive } from '../../components/landing/HowItWorksInteractive.js';
import {
  createIntegrationStatusPreviewCard,
  initIntegrationStatusPreviewCard,
} from '../../components/landing/featureDemos/IntegrationStatusPreviewCard.js';
import { createObjectPreviewCard, initObjectPreviewCard } from '../../components/landing/featureDemos/ObjectPreviewCard.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { getLocaleFromPath, normalizeLandingPath } from '../../lib/landingLocale.js';
import { getFeatureDemoModuleContent } from '../../lib/getLocaleDemoModule.js';
import * as homeDe from '../../data/homePage.js';
import * as homeEn from '../../locales/en/homePage.js';

const getHomeCopy = (locale) => {
  if (locale === 'en') {
    return {
      HOME_META: homeEn.HOME_META,
      HERO: homeEn.HERO,
      HOW_IT_WORKS: homeEn.HOW_IT_WORKS,
      CTA: homeEn.CTA,
      HOME_FEATURES_STEPS: homeEn.HOME_FEATURES_STEPS_EN,
      FAQ: homeEn.FAQ_EN,
    };
  }
  return {
    HOME_META: homeDe.HOME_META,
    HERO: homeDe.HERO,
    HOW_IT_WORKS: homeDe.HOW_IT_WORKS,
    CTA: homeDe.CTA,
    HOME_FEATURES_STEPS: homeDe.HOME_FEATURES_STEPS,
    FAQ: homeDe.FAQ,
  };
};

const createObjectPreviewHTML = (locale) => {
  const content = getFeatureDemoModuleContent('objekte', locale);
  return `<div class="landing-frosted-frame feature-hero__card-frame">${createObjectPreviewCard(content ? { content } : {})}</div>`;
};

const createIntegrationPreviewHTML = (locale) => {
  const content = getFeatureDemoModuleContent('integration', locale);
  return `<div class="landing-frosted-frame feature-hero__card-frame">${createIntegrationStatusPreviewCard(content ? { content } : {})}</div>`;
};

export const renderHomePage = (localeArg) => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const locale = localeArg === 'en' || localeArg === 'de'
    ? localeArg
    : getLocaleFromPath(normalizeLandingPath(window.location.pathname));
  const { HOME_META, HERO, HOW_IT_WORKS, CTA, HOME_FEATURES_STEPS, FAQ } = getHomeCopy(locale);
  const logoHtml = createHeroLogoImg(HERO.logoAlt);
  const headline = (HERO.headline || '').replace('{logo}', logoHtml);

  setPageMeta(HOME_META.title, HOME_META.description, { locale });
  setHreflangAlternates([
    { hreflang: 'de', path: '/' },
    { hreflang: 'en', path: '/en' },
  ]);
  setFAQSchema(FAQ);

  const featuresSectionHTML = createHowItWorksInteractive({
    label: HOW_IT_WORKS.label,
    headline: HOW_IT_WORKS.headline,
    steps: HOME_FEATURES_STEPS,
    previewHTML: createIntegrationPreviewHTML(locale),
  });

  content.innerHTML = `
    ${createHeroNew({
      tagline: HERO.tagline,
      headline,
      subheadline: HERO.subheadline,
      illustrationAlt: HERO.illustrationAlt,
      formLabel: HERO.formLabel,
      formPlaceholder: HERO.formPlaceholder,
      formButtonText: HERO.formButtonText,
      formHint: HERO.formHint,
      trustClaims: HERO.trustClaims,
    })}

    ${featuresSectionHTML}

    ${createCTASection({
      locale,
      headline: CTA.headline,
      subheadline: CTA.subheadline,
      primaryHref: '#hero-new-workspace-name',
    })}

    ${createFAQSection({ locale, sharedFaq: FAQ, pageFaq: [] })}
  `;

  initHeroNew();
  initHowItWorksInteractive(content, {
    renderPreview: (nextIndex) => (
      nextIndex === 0 ? createIntegrationPreviewHTML(locale) : createObjectPreviewHTML(locale)
    ),
    onPreviewRendered: (previewNode, nextIndex) => {
      const demoContent = getFeatureDemoModuleContent(nextIndex === 0 ? 'integration' : 'objekte', locale);
      const opts = demoContent ? { content: demoContent } : {};
      if (nextIndex === 0) initIntegrationStatusPreviewCard(previewNode, opts);
      else initObjectPreviewCard(previewNode, opts);
    },
  });
  initFAQAccordion(content);
};
