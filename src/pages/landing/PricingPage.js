/**
 * Pricing Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createPricingCard } from '../../components/landing/PricingCard.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../components/landing/FeatureRelatedSlider.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { featurePages } from '../../data/features/index.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';

const FOUNDER_DEAL_ACTIVE = false;

const PLANS = [
  {
    name: 'Starter',
    price: '9,49',
    priceAnnual: '91,10',
    priceEffectiveMonthly: '7,59',
    workspaces: 1,
    description: 'Einzelbetreiber, 1 Website. Ein Setup – alles, was du zum Start brauchst.',
    cta: 'Mit Starter starten',
  },
  {
    name: 'Growth',
    price: '16,49',
    priceAnnual: '158,30',
    priceEffectiveMonthly: '13,19',
    workspaces: 3,
    description: 'Mehrere Angebote/Setups, 2–3 Websites, Wachstum.',
    cta: 'Growth wählen',
  },
  {
    name: 'Scale',
    price: '29,49',
    priceAnnual: '283,10',
    priceEffectiveMonthly: '23,59',
    workspaces: 10,
    description: 'Agenturen, Franchise, Portfolio-Betreiber, viele Websites.',
    cta: 'Scale wählen',
  },
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

const PAGE_FAQ = [
  { question: 'Was ist ein Workspace?', answer: 'Ein Workspace ist ein eigenes Setup – z.B. eine Website oder ein Projekt mit eigenen Angeboten, Regeln und Buchungen.' },
  { question: 'Ist Analytics in jedem Plan gleich?', answer: 'Ja. Du bekommst den vollen Analytics-Umfang in jedem Plan – damit du sofort siehst, was funktioniert.' },
  { question: 'Gibt es Buchungsgebühren oder Provision?', answer: 'Nein. BookFast nimmt keine Provision pro Buchung.' },
  { question: 'Kann ich später upgraden?', answer: 'Ja. Du kannst jederzeit auf Growth oder Scale wechseln.' },
  { question: 'Was bedeutet Nachhaltigkeits-Impact?', answer: 'Ein Teil deines Plans fließt in einen nachhaltigen Impact – messbar, transparent, ohne Extra-Aufwand für dich.' },
  { question: 'Was ist der Vorteil vom Jahresplan?', answer: 'Du sparst 20% (entspricht 2 Monaten gratis) und hast volle Planbarkeit.' },
  { question: 'Founder Deal – wie lange gilt der?', answer: 'Der Founder Deal ist limitiert (z.B. auf die ersten X Kunden oder bis Datum Y) und gilt für das erste Jahr.' },
];

function getPlanByWorkspaces(workspaceCount) {
  if (workspaceCount <= 1) return PLANS[0];
  if (workspaceCount <= 3) return PLANS[1];
  return PLANS[2];
}

function renderActivePricingCard(workspaceCount, isAnnual) {
  const activePlan = getPlanByWorkspaces(workspaceCount);
  return createPricingCard({
    ...activePlan,
    workspaces: workspaceCount,
    isAnnual,
    planFeatures: PLAN_FEATURES,
    securityBadges: SECURITY_BADGES,
  });
}

function getPriceDisplay(plan, isAnnual) {
  if (isAnnual && plan.priceAnnual) return `${plan.priceAnnual.replace('.', ',')} €`;
  return `${plan.price.replace('.', ',')} €`;
}

function getPeriodDisplay(plan, isAnnual) {
  return isAnnual && plan.priceAnnual ? '/Jahr' : '/Monat';
}

function getAnnualHintDisplay(plan, isAnnual) {
  if (isAnnual && plan.priceEffectiveMonthly) {
    return `≈ ${plan.priceEffectiveMonthly.replace('.', ',')} €/Monat, 2 Monate gratis`;
  }
  return '2 Monate gratis';
}

export const renderPricingPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Preise', 'BookFast Preise – Mit jedem Plan bekommst du alles. Der einzige Unterschied: die Anzahl der Workspaces.');
  setFAQSchema(PAGE_FAQ);

  const founderNoteHTML = FOUNDER_DEAL_ACTIVE
    ? `<div class="landing-pricing-founder-note">
        <span class="landing-pricing-founder-badge">Founder Deal – limitiert</span>
        <span class="landing-pricing-founder-text">25% im ersten Jahr für Early Access Nutzer.</span>
      </div>`
    : '';

  const pricingSlotContent = `
    ${founderNoteHTML}
    <div class="landing-pricing-module-shell">
      <div class="landing-frosted-frame landing-pricing-module-frame">
        <div class="landing-pricing-single-card" id="pricing-cards-container">
          ${renderActivePricingCard(1, false)}
        </div>
      </div>
    </div>
  `;

  content.innerHTML = `
    ${createHero({
      headline: 'Buchen lassen. Bezahlen lassen. Verstehen, was wirkt.',
      subheadline: 'BookFast verbindet Buchungen, Online-Zahlungen und Analytics in einem System – für Services, Tagesmieten und Übernachtungen.',
      primaryCTA: '',
      secondaryCTA: '',
      trustClaims: [],
      slotContent: pricingSlotContent,
    })}

    ${createFAQSection({ pageFaq: PAGE_FAQ, pageTitle: 'Preise', featureOnly: true })}

    ${createFeatureRelatedSlider({ features: Object.values(featurePages), label: 'In allen Plänen enthalten', headline: 'Immer dabei.' })}
  `;

  initPricingControls(content);
  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};

function initPricingControls(content) {
  const container = content.querySelector('#pricing-cards-container');
  if (!container) return;

  const state = {
    isAnnual: false,
    workspaceCount: 1,
  };

  const syncSliderClass = (slider, value) => {
    for (let i = 1; i <= 10; i += 1) {
      slider.classList.remove(`is-step-${i}`);
    }
    slider.classList.add(`is-step-${value}`);
  };

  const applyStateToCard = () => {
    const activePlan = getPlanByWorkspaces(state.workspaceCount);
    const nameEl = container.querySelector('.landing-pricing-card__name');
    const descEl = container.querySelector('.landing-pricing-card__desc');
    const workspaceValueEl = container.querySelector('.landing-pricing-card__metric-value');
    const priceEl = container.querySelector('.landing-pricing-price');
    const periodEl = container.querySelector('.landing-pricing-period');
    const annualHintEl = container.querySelector('.landing-pricing-annual-hint');
    const ctaEl = container.querySelector('.landing-pricing-card__btn');
    const sliderEl = container.querySelector('#pricing-workspace-slider');
    const toggleButtons = container.querySelectorAll('[data-period]');

    if (nameEl) nameEl.textContent = activePlan.name;
    if (descEl) descEl.textContent = activePlan.description;
    if (workspaceValueEl) workspaceValueEl.textContent = String(state.workspaceCount);
    if (priceEl) priceEl.textContent = getPriceDisplay(activePlan, state.isAnnual);
    if (periodEl) periodEl.textContent = getPeriodDisplay(activePlan, state.isAnnual);
    if (annualHintEl) annualHintEl.textContent = getAnnualHintDisplay(activePlan, state.isAnnual);
    if (ctaEl) ctaEl.textContent = activePlan.cta;
    if (sliderEl instanceof HTMLInputElement) {
      sliderEl.value = String(state.workspaceCount);
      syncSliderClass(sliderEl, state.workspaceCount);
    }

    toggleButtons.forEach((btn) => {
      const isActive = (btn.dataset.period === 'annual') === state.isAnnual;
      btn.classList.toggle('is-active', isActive);
    });
  };

  content.addEventListener('click', (event) => {
    const toggleButton = event.target.closest('#pricing-cards-container [data-period]');
    if (!toggleButton) return;
    state.isAnnual = toggleButton.dataset.period === 'annual';
    applyStateToCard();
  });

  content.addEventListener('input', (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (event.target.id !== 'pricing-workspace-slider') return;
    state.workspaceCount = Number(event.target.value) || 1;
    applyStateToCard();
  });

  container.innerHTML = renderActivePricingCard(state.workspaceCount, state.isAnnual);
  applyStateToCard();
}
