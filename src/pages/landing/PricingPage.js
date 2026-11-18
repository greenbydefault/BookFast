/**
 * Pricing Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createPricingCard } from '../../components/landing/PricingCard.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../components/landing/FeatureRelatedSlider.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { getAllFeaturesForSlider } from '../../data/features/relatedFeatures.js';
import { setPageMeta, setFAQSchema, setProductSchema, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { createNumberReel } from '../../lib/animation/numberReel.js';

const FOUNDER_DEAL_ACTIVE = false;
const PRICING_REEL_CONFIG = Object.freeze({
  price: {
    durationMs: 520,
    settleDurationMs: 180,
    spinSteps: 16,
    spinCycles: 2.8,
    overshootStrength: 0.14,
    precision: 2,
  },
  workspace: {
    durationMs: 420,
    settleDurationMs: 150,
    spinSteps: 12,
    spinCycles: 2.2,
    overshootStrength: 0.09,
    precision: 0,
  },
});

const PLANS = [
  {
    name: 'Basic',
    price: '9,49',
    priceAnnual: '91,10',
    priceEffectiveMonthly: '7,59',
    workspaces: 1,
    description: 'Einzelbetreiber, 1 Website. Ein Workspace reicht zum Start.',
    cta: 'Mit Basic starten',
  },
  {
    name: 'Team',
    price: '16,49',
    priceAnnual: '158,30',
    priceEffectiveMonthly: '13,19',
    workspaces: 3,
    description: 'Mehrere Angebote, 2–3 Websites.',
    cta: 'Mit Team starten',
  },
  {
    name: 'Agentur',
    price: '29,49',
    priceAnnual: '283,10',
    priceEffectiveMonthly: '23,59',
    workspaces: 10,
    description: 'Agenturen, Franchise, Portfolio-Betreiber, viele Websites.',
    cta: 'Mit Agentur starten',
  },
];

const PLANS_EN = [
  { name: 'Basic', price: '9,49', priceAnnual: '91,10', priceEffectiveMonthly: '7,59', workspaces: 1, description: 'Solo operator, 1 website. One workspace is enough to start.', cta: 'Start with Basic' },
  { name: 'Team', price: '16,49', priceAnnual: '158,30', priceEffectiveMonthly: '13,19', workspaces: 3, description: 'Several offers, 2–3 websites.', cta: 'Start with Team' },
  { name: 'Agency', price: '29,49', priceAnnual: '283,10', priceEffectiveMonthly: '23,59', workspaces: 10, description: 'Agencies, franchise, many sites.', cta: 'Start with Agency' },
];

const SECURITY_BADGES = [
  { label: 'DSGVO-konform', icon: 'check.svg' },
  { label: 'SSL-Verschlüsselung', icon: 'lock.svg' },
  { label: 'Sichere Daten', icon: 'check.svg' },
  { label: 'EU-Server', icon: 'Globe.svg' },
];

const PLAN_FEATURES = [
  { label: 'Keine Provision pro Buchung', icon: 'money-hand.svg' },
  { label: 'Monatlich 1 kg Plastik aus dem Meer', icon: 'clean.svg' },
  { label: 'Voller Analytics-Umfang inklusive', icon: 'chart.svg' },
  { label: 'Mehrere Websites pro Account', icon: 'Building-comapny.svg' },
  { label: 'DSGVO-konform', icon: 'check.svg' },
  { label: 'SSL-Verschlüsselung', icon: 'lock.svg' },
  { label: 'Sichere Daten', icon: 'key.svg' },
  { label: 'EU-Server', icon: 'Globe.svg' },
];

const PLAN_FEATURES_EN = [
  { label: 'No commission per booking', icon: 'money-hand.svg' },
  { label: '1 kg ocean plastic removed monthly', icon: 'clean.svg' },
  { label: 'Full analytics included', icon: 'chart.svg' },
  { label: 'Multiple websites per account', icon: 'Building-comapny.svg' },
  { label: 'GDPR compliant', icon: 'check.svg' },
  { label: 'SSL encryption', icon: 'lock.svg' },
  { label: 'Secure data', icon: 'key.svg' },
  { label: 'EU servers', icon: 'Globe.svg' },
];

const PAGE_FAQ = [
  { question: 'Was ist ein Workspace?', answer: 'Ein Workspace ist ein Setup: eine Website oder ein Projekt mit eigenen Objekten, Services und Buchungen.' },
  { question: 'Ist Analytics in jedem Plan gleich?', answer: 'Ja. Funnel und Traffic sind in Basic, Team und Agentur dieselben. Du zahlst für Workspaces, nicht für Zahlen.' },
  { question: 'Gibt es Buchungsgebühren oder Provision?', answer: 'Nein. BookFast nimmt keine Provision pro Buchung. Stripe-Gebühren bleiben.' },
  { question: 'Kann ich später upgraden?', answer: 'Ja. Wechsel auf Team oder Agentur geht jederzeit.' },
  { question: 'Was bedeutet 1 kg Plastik?', answer: 'Pro Monat fließt ein Teil des Plans in 1 kg Plastik, das aus dem Meer geholt wird. Kein Extra-Produkt, das du buchen musst.' },
  { question: 'Was bringt der Jahresplan?', answer: '20 % weniger, entspricht 2 Monate gratis. Dieselben Features.' },
  { question: 'Gibt es einen Founder Deal?', answer: 'Gerade nicht. Wenn einer läuft, stehen Laufzeit und Bedingungen hier.' },
];

const PAGE_FAQ_EN = [
  { question: 'What is a workspace?', answer: 'A workspace is one setup: a website or project with its own objects, services, and bookings.' },
  { question: 'Is analytics the same on every plan?', answer: 'Yes. Funnel and traffic are identical on Basic, Team, and Agency. You pay for workspaces, not for numbers.' },
  { question: 'Are there booking fees or commissions?', answer: 'No. BookFast takes no cut per booking. Stripe fees still apply.' },
  { question: 'Can I upgrade later?', answer: 'Yes. Switch to Team or Agency anytime.' },
  { question: 'What does 1 kg of plastic mean?', answer: 'Each month, part of the plan funds 1 kg of ocean plastic removal. Not a separate product you have to buy.' },
  { question: 'What does the annual plan change?', answer: '20% off, equal to 2 months free. Same features.' },
  { question: 'Is there a Founder Deal?', answer: 'Not right now. If one is live, duration and terms will be on this page.' },
];

const SECURITY_BADGES_EN = [
  { label: 'GDPR compliant', icon: 'check.svg' },
  { label: 'SSL encryption', icon: 'lock.svg' },
  { label: 'Secure data', icon: 'check.svg' },
  { label: 'EU servers', icon: 'Globe.svg' },
];

function getPlanByWorkspaces(workspaceCount, plans) {
  if (workspaceCount <= 1) return plans[0];
  if (workspaceCount <= 3) return plans[1];
  return plans[2];
}

function renderActivePricingCard(workspaceCount, isAnnual, { plans, planFeatures, securityBadges, locale = 'de' }) {
  const activePlan = getPlanByWorkspaces(workspaceCount, plans);
  return createPricingCard({
    ...activePlan,
    workspaces: workspaceCount,
    isAnnual,
    planFeatures,
    securityBadges,
    locale,
  });
}

function getPriceDisplay(plan, isAnnual) {
  if (isAnnual && plan.priceAnnual) return `${plan.priceAnnual.replace('.', ',')} €`;
  return `${plan.price.replace('.', ',')} €`;
}

function getPriceNumericValue(plan, isAnnual) {
  const raw = isAnnual && plan.priceAnnual ? plan.priceAnnual : plan.price;
  return Number(String(raw).replace(',', '.')) || 0;
}

function getPeriodDisplay(plan, isAnnual, isEn) {
  if (!(isAnnual && plan.priceAnnual)) return isEn ? '/month' : '/Monat';
  return isEn ? '/year' : '/Jahr';
}

function getAnnualHintDisplay(plan, isAnnual, isEn) {
  if (isAnnual && plan.priceEffectiveMonthly) {
    return isEn
      ? `≈ ${plan.priceEffectiveMonthly.replace('.', ',')} €/month, 2 months free`
      : `≈ ${plan.priceEffectiveMonthly.replace('.', ',')} €/Monat, 2 Monate gratis`;
  }
  return '';
}

export const renderPricingPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const plans = isEn ? PLANS_EN : PLANS;
  const planFeatures = isEn ? PLAN_FEATURES_EN : PLAN_FEATURES;
  const securityBadges = isEn ? SECURITY_BADGES_EN : SECURITY_BADGES;
  const pageFaq = isEn ? PAGE_FAQ_EN : PAGE_FAQ;
  const sliderFeatures = getAllFeaturesForSlider(locale);
  const pricingCardOpts = { plans, planFeatures, securityBadges, locale };

  setPageMeta(
    isEn ? 'Pricing. Webflow booking system' : 'Preise. Webflow Buchungssystem',
    isEn
      ? 'From €9.49/month. Same features on every plan. 0% commission. You pay for workspace count.'
      : 'Ab 9,49 €/Monat. Dieselben Features in jedem Plan. 0 % Provision. Du zahlst für die Anzahl Workspaces.',
    { locale },
  );
  setFAQSchema(pageFaq);
  setProductSchema(plans, { locale });
  setBreadcrumbSchema([
    { name: 'Home', url: isEn ? '/en' : '/' },
    { name: isEn ? 'Pricing' : 'Preise', url: isEn ? '/en/pricing' : '/preise' },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/preise' },
    { hreflang: 'en', path: '/en/pricing' },
  ]);

  const founderNoteHTML = FOUNDER_DEAL_ACTIVE
    ? `<div class="landing-pricing-founder-note">
        <span class="landing-pricing-founder-badge">Founder Deal, limitiert</span>
        <span class="landing-pricing-founder-text">25% im ersten Jahr für Early Access Nutzer.</span>
      </div>`
    : '';

  const pricingSlotContent = `
    ${founderNoteHTML}
    <div class="landing-pricing-module-shell">
      <div class="landing-frosted-frame landing-pricing-module-frame">
        <div class="landing-pricing-single-card" id="pricing-cards-container">
          ${renderActivePricingCard(1, false, pricingCardOpts)}
        </div>
      </div>
    </div>
  `;

  content.innerHTML = `
    ${createHero({
      headline: isEn ? 'Pricing. Booking for Webflow.' : 'Preise. Buchungssystem für Webflow.',
      subheadline: isEn
        ? 'Hours, day rentals, nights. Stripe in the widget. Same features on Basic, Team, and Agency.'
        : 'Stunden, Tagesmieten, Nächte. Stripe im Widget. Dieselben Features in Basic, Team und Agentur.',
      illustrationAlt: isEn
        ? 'Pricing overview and analytics illustration for BookFast workspaces'
        : 'Preisübersicht und Analytics-Illustration für BookFast Workspaces',
      primaryCTA: '',
      secondaryCTA: '',
      trustClaims: [],
      slotContent: pricingSlotContent,
    })}

    ${createFAQSection({ locale, pageFaq, pageTitle: isEn ? 'Pricing' : 'Preise', featureOnly: true })}

    ${createFeatureRelatedSlider({
      features: sliderFeatures,
      locale,
      label: isEn ? 'Included in all plans' : 'In allen Plänen enthalten',
      headline: isEn ? 'Always in the plan you pick.' : 'Immer im Plan, den du nimmst.',
    })}
  `;

  const cleanupPricingControls = initPricingControls(content, { isEn, ...pricingCardOpts });
  initFeatureRelatedSlider(content);
  initFAQAccordion(content);

  return () => {
    if (typeof cleanupPricingControls === 'function') {
      cleanupPricingControls();
    }
  };
};

function initPricingControls(content, { isEn, plans, planFeatures, securityBadges, locale = 'de' }) {
  const container = content.querySelector('#pricing-cards-container');
  if (!container) return;

  const pricingCardOpts = { plans, planFeatures, securityBadges, locale };

  const state = {
    isAnnual: false,
    workspaceCount: 1,
  };

  let previousSliderStep = state.workspaceCount;
  let rafToken = null;

  const syncSliderClass = (slider, value) => {
    const nextStep = Number(value) || 1;
    if (previousSliderStep !== nextStep) {
      slider.classList.remove(`is-step-${previousSliderStep}`);
      slider.classList.add(`is-step-${nextStep}`);
      previousSliderStep = nextStep;
    }
  };

  container.innerHTML = renderActivePricingCard(state.workspaceCount, state.isAnnual, pricingCardOpts);

  const nodes = {
    nameEl: container.querySelector('.landing-pricing-card__name'),
    descEl: container.querySelector('.landing-pricing-card__desc'),
    workspaceValueEl: container.querySelector('.landing-pricing-card__metric-value'),
    priceEl: container.querySelector('.landing-pricing-price'),
    periodEl: container.querySelector('.landing-pricing-period'),
    annualHintEl: container.querySelector('.landing-pricing-annual-hint'),
    ctaEl: container.querySelector('.landing-pricing-card__btn'),
    sliderEl: container.querySelector('#pricing-workspace-slider'),
    toggleButtons: [...container.querySelectorAll('[data-period]')],
  };

  const reels = {
    workspace: nodes.workspaceValueEl
      ? createNumberReel(nodes.workspaceValueEl, {
        ...PRICING_REEL_CONFIG.workspace,
        formatter: (value) => String(Math.round(value)),
      })
      : null,
    price: nodes.priceEl
      ? createNumberReel(nodes.priceEl, {
        ...PRICING_REEL_CONFIG.price,
        formatter: (value) => `${value.toFixed(2).replace('.', ',')} €`,
      })
      : null,
  };

  const applyStateToCard = (animateReel = true) => {
    const activePlan = getPlanByWorkspaces(state.workspaceCount, plans);
    const priceNumeric = getPriceNumericValue(activePlan, state.isAnnual);
    const periodText = getPeriodDisplay(activePlan, state.isAnnual, isEn);
    const annualHintText = getAnnualHintDisplay(activePlan, state.isAnnual, isEn);

    if (nodes.nameEl && nodes.nameEl.textContent !== activePlan.name) {
      nodes.nameEl.textContent = activePlan.name;
    }
    if (nodes.descEl && nodes.descEl.textContent !== activePlan.description) {
      nodes.descEl.textContent = activePlan.description;
    }
    if (nodes.periodEl && nodes.periodEl.textContent !== periodText) {
      nodes.periodEl.textContent = periodText;
    }
    if (nodes.annualHintEl) {
      nodes.annualHintEl.textContent = annualHintText;
      nodes.annualHintEl.style.display = annualHintText ? '' : 'none';
    }
    if (nodes.ctaEl && nodes.ctaEl.textContent !== activePlan.cta) {
      nodes.ctaEl.textContent = activePlan.cta;
    }
    if (nodes.sliderEl instanceof HTMLInputElement) {
      nodes.sliderEl.value = String(state.workspaceCount);
      syncSliderClass(nodes.sliderEl, state.workspaceCount);
    }

    nodes.toggleButtons.forEach((btn) => {
      const isActive = (btn.dataset.period === 'annual') === state.isAnnual;
      btn.classList.toggle('is-active', isActive);
    });

    if (reels.workspace) {
      reels.workspace.setValue(state.workspaceCount, { animate: animateReel });
    } else if (nodes.workspaceValueEl) {
      nodes.workspaceValueEl.textContent = String(state.workspaceCount);
    }

    if (reels.price) {
      reels.price.setValue(priceNumeric, { animate: animateReel });
    } else if (nodes.priceEl) {
      nodes.priceEl.textContent = getPriceDisplay(activePlan, state.isAnnual);
    }

  };

  const scheduleApplyState = () => {
    if (rafToken !== null) return;
    rafToken = requestAnimationFrame(() => {
      rafToken = null;
      applyStateToCard(true);
    });
  };

  const onClick = (event) => {
    const toggleButton = event.target.closest('#pricing-cards-container [data-period]');
    if (!toggleButton) return;
    state.isAnnual = toggleButton.dataset.period === 'annual';
    applyStateToCard(true);
  };

  const onInput = (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (event.target.id !== 'pricing-workspace-slider') return;
    state.workspaceCount = Number(event.target.value) || 1;
    scheduleApplyState();
  };

  content.addEventListener('click', onClick);
  content.addEventListener('input', onInput);
  applyStateToCard(false);

  return () => {
    content.removeEventListener('click', onClick);
    content.removeEventListener('input', onInput);
    if (rafToken !== null) {
      cancelAnimationFrame(rafToken);
      rafToken = null;
    }
    reels.workspace?.destroy();
    reels.price?.destroy();
  };
}
