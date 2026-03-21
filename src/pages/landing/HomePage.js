/**
 * Homepage - New Hero Design
 */
import { createHeroNew, initHeroNew } from '../../components/landing/HeroNew.js';
import { createHowItWorksInteractive, initHowItWorksInteractive } from '../../components/landing/HowItWorksInteractive.js';
import {
  createIntegrationStatusPreviewCard,
  initIntegrationStatusPreviewCard,
} from '../../components/landing/featureDemos/IntegrationStatusPreviewCard.js';
import { createObjectPreviewCard, initObjectPreviewCard } from '../../components/landing/featureDemos/ObjectPreviewCard.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';
import { SHARED_FAQ } from '../../data/faq.js';
import { HOME_FEATURES_STEPS } from '../../data/homeFeatures.js';

const createObjectPreviewHTML = () =>
  `<div class="landing-frosted-frame feature-hero__card-frame">${createObjectPreviewCard()}</div>`;

const createIntegrationPreviewHTML = () =>
  `<div class="landing-frosted-frame feature-hero__card-frame">${createIntegrationStatusPreviewCard()}</div>`;

export const renderHomePage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta(null, 'Das Webflow Buchungssystem für Terminbuchung & Online-Zahlungen. 0 % Provision, Zahlung vor Termin. In 5 Min. live.');
  setFAQSchema(SHARED_FAQ);

  const featuresSectionHTML = createHowItWorksInteractive({
    label: 'Hauptfeatures',
    headline: 'Das Buchungssystem für Webflow – die wichtigsten Vorteile.',
    steps: HOME_FEATURES_STEPS,
    previewHTML: createIntegrationPreviewHTML(),
  });

  content.innerHTML = `
    ${createHeroNew({
      tagline: 'Buchungssystem für Webflow',
      subheadline: 'Workspace-Name eingeben und Live-Demo starten.',
      illustrationAlt: 'Startseiten-Illustration mit BookFast Demo, Buchungen und Zahlung vor Termin',
      formLabel: 'Workspace-Name',
      formPlaceholder: 'z.B. Alpine Chalets, Studio Nordlicht…',
      formButtonText: 'Live-Demo starten',
      formHint: 'Ohne Account Live Demo testen.',
      trustClaims: ['0% Provision', 'Webflow-native', 'Zahlung vor Termin'],
    })}

    ${featuresSectionHTML}

    ${createCTASection({
      headline: 'Buchungen auf deiner Website – in 5 Minuten eingerichtet.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig.\nIn unter 5 Minuten startklar.',
    })}

    ${createFAQSection({ sharedFaq: SHARED_FAQ, pageFaq: [] })}
  `;

  initHeroNew();
  initHowItWorksInteractive(content, {
    renderPreview: (nextIndex) => (nextIndex === 0 ? createIntegrationPreviewHTML() : createObjectPreviewHTML()),
    onPreviewRendered: (previewNode, nextIndex) => {
      if (nextIndex === 0) initIntegrationStatusPreviewCard(previewNode);
      else initObjectPreviewCard(previewNode);
    },
  });
  initFAQAccordion(content);
};
