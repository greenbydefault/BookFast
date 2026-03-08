/**
 * Pricing Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createPricingCard } from '../../components/landing/PricingCard.js';
import { createCompareTable } from '../../components/landing/CompareTable.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../components/landing/FeatureRelatedSlider.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { iconImg } from '../../lib/landingAssets.js';
import { featurePages } from '../../data/features/index.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';

const FOUNDER_DEAL_ACTIVE = false;

const PLANS = [
  {
    name: 'Solo',
    price: '9,49',
    priceAnnual: '91,10',
    priceEffectiveMonthly: '7,59',
    workspaces: 1,
    description: 'Einzelbetreiber, 1 Website, 1 Setup.',
    highlighted: false,
    badge: '',
    cta: 'Mit Solo starten',
    microcopy: 'Sofort loslegen. Später upgraden.',
  },
  {
    name: 'Plus',
    price: '16,49',
    priceAnnual: '158,30',
    priceEffectiveMonthly: '13,19',
    workspaces: 3,
    description: 'Mehrere Angebote/Setups, 2–3 Websites, Wachstum.',
    highlighted: true,
    badge: 'Am beliebtesten',
    cta: 'Plus wählen',
    microcopy: 'Mehr Workspaces. Gleicher Flow. Mehr Überblick.',
  },
  {
    name: 'Select',
    price: '29,49',
    priceAnnual: '283,10',
    priceEffectiveMonthly: '23,59',
    workspaces: 10,
    description: 'Agenturen, Franchise, Portfolio-Betreiber, viele Websites.',
    highlighted: false,
    badge: '',
    cta: 'Select holen',
    microcopy: 'Für Teams mit mehreren Projekten und Websites.',
  },
];

const COMPARE_TABLE = {
  columns: ['Feature', 'Solo', 'Plus', 'Select'],
  rows: [
    { feature: 'Workspaces', values: ['1', '3', '10'] },
    { feature: 'Analytics', values: [true, true, true] },
    { feature: 'Support', values: ['Standard', 'Standard', 'Priorisiert'] },
  ],
};

const SECURITY_BADGES = [
  { label: 'DSGVO-konform', icon: iconImg('check.svg') },
  { label: 'SSL-Verschlüsselung', icon: iconImg('lock.svg') },
  { label: 'Sichere Daten', icon: iconImg('check.svg') },
  { label: 'EU-Server', icon: iconImg('Globe.svg') },
];

const PAGE_FAQ = [
  { question: 'Was ist ein Workspace?', answer: 'Ein Workspace ist ein eigenes Setup – z.B. eine Website oder ein Projekt mit eigenen Angeboten, Regeln und Buchungen.' },
  { question: 'Ist Analytics in jedem Plan gleich?', answer: 'Ja. Du bekommst den vollen Analytics-Umfang in jedem Plan – damit du sofort siehst, was funktioniert.' },
  { question: 'Gibt es Buchungsgebühren oder Provision?', answer: 'Nein. BookFast nimmt keine Provision pro Buchung.' },
  { question: 'Kann ich später upgraden?', answer: 'Ja. Du kannst jederzeit auf Plus oder Select wechseln.' },
  { question: 'Was bedeutet Nachhaltigkeits-Impact?', answer: 'Ein Teil deines Plans fließt in einen nachhaltigen Impact – messbar, transparent, ohne Extra-Aufwand für dich.' },
  { question: 'Was ist der Vorteil vom Jahresplan?', answer: 'Du sparst 20% (entspricht 2 Monaten gratis) und hast volle Planbarkeit.' },
  { question: 'Founder Deal – wie lange gilt der?', answer: 'Der Founder Deal ist limitiert (z.B. auf die ersten X Kunden oder bis Datum Y) und gilt für das erste Jahr.' },
];

function renderPricingCards(isAnnual) {
  return PLANS.map((p) => createPricingCard({ ...p, isAnnual })).join('');
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

  content.innerHTML = `
    ${createHero({
      headline: 'Buchen lassen. Bezahlen lassen. Verstehen, was wirkt.',
      subheadline: 'BookFast verbindet Buchungen, Online-Zahlungen und Analytics in einem System – für Services, Tagesmieten und Übernachtungen.',
      primaryCTA: 'Mit Solo starten',
      primaryHref: '/register.html',
      secondaryCTA: '',
      trustClaims: ['Keine Provision pro Buchung', 'Zahlung vor Termin', 'Voller Analytics-Umfang inklusive', 'Mehrere Websites pro Account (Workspaces)', 'Nachhaltigkeits-Impact enthalten'],
    })}

    <section class="landing-section">
      <div class="landing-container">
        ${founderNoteHTML}
        <div class="landing-pricing-toggle">
          <div class="landing-pricing-toggle-pill" id="pricing-toggle-pill">
            <button type="button" class="is-active" data-period="monthly">Monatlich</button>
            <button type="button" data-period="annual">Jährlich zahlen & 20% sparen</button>
          </div>
          <span class="landing-pricing-toggle-save">2 Monate gratis</span>
        </div>
        <div class="landing-grid landing-grid-3 landing-pricing-grid" id="pricing-cards-container">
          ${renderPricingCards(false)}
        </div>
        <div class="landing-pricing-security">
          <h3 class="landing-pricing-security-title">Sicherheit & Datenschutz</h3>
          <div class="landing-pricing-security-badges">
            ${SECURITY_BADGES.map(b => `
              <span class="landing-pricing-security-badge">${b.icon} ${b.label}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 class="landing-h2">Workspaces im Vergleich</h2>
        </div>
        ${createCompareTable(COMPARE_TABLE)}
      </div>
    </section>

    ${createFeatureRelatedSlider({ features: Object.values(featurePages), label: 'In allen Plänen enthalten', headline: 'Immer dabei.' })}

    ${createCTASection({
      headline: 'Starte mit Solo – oder wähle Plus.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig.',
    })}

    ${createFAQSection({ pageFaq: PAGE_FAQ, pageTitle: 'Preise', featureOnly: true })}
  `;

  initPricingToggle(content);
  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};

function initPricingToggle(content) {
  const pill = content.querySelector('#pricing-toggle-pill');
  const container = content.querySelector('#pricing-cards-container');
  if (!pill || !container) return;

  pill.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isAnnual = btn.dataset.period === 'annual';
      pill.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      container.innerHTML = renderPricingCards(isAnnual);
    });
  });
}
