/**
 * Pricing Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createPricingCard } from '../../components/landing/PricingCard.js';
import { createCompareTable } from '../../components/landing/CompareTable.js';
import { createFAQAccordion, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';

const PLANS = [
  {
    name: 'Solo',
    price: '9,49',
    priceAnnual: '91,10',
    priceEffectiveMonthly: '7,59',
    workspaces: 1,
    description: 'Ideal für Einzelunternehmer.',
    highlighted: true,
    cta: 'Jetzt starten'
  },
  {
    name: 'Plus',
    price: '16,49',
    priceAnnual: '158,30',
    priceEffectiveMonthly: '13,19',
    workspaces: 3,
    description: 'Für kleine Teams und mehrere Projekte.',
    cta: 'Jetzt starten'
  },
  {
    name: 'Agency',
    price: '29,49',
    priceAnnual: '283,10',
    priceEffectiveMonthly: '23,59',
    workspaces: 10,
    description: 'Für Agenturen und wachsende Businesses.',
    cta: 'Jetzt starten'
  }
];

// Feature-Titel aus der Hauptnavigation (featurePages.js / MEGA_FEATURE_CATEGORIES)
const COMPARE_TABLE = {
  columns: ['Feature', 'Solo', 'Plus', 'Agency'],
  rows: [
    { feature: 'Workspaces', values: ['1', '3', '10'] },
    { feature: 'Buchungsverwaltung', values: [true, true, true] },
    { feature: 'Objektverwaltung', values: [true, true, true] },
    { feature: 'Service-Konfiguration', values: [true, true, true] },
    { feature: 'Online-Zahlungen', values: [true, true, true] },
    { feature: 'Automatische Rechnungen', values: [true, true, true] },
    { feature: 'Analytics & Insights', values: [true, true, true] },
    { feature: 'Webflow-Integration', values: [true, true, true] },
    { feature: 'Kundenportal', values: [true, true, true] },
    { feature: 'Mitarbeiterverwaltung', values: [true, true, true] },
    { feature: 'Add-ons & Extras', values: [true, true, true] },
    { feature: 'Gutscheine & Rabattcodes', values: [true, true, true] },
    { feature: 'Kundenverwaltung', values: [true, true, true] },
    { feature: 'Verfügbarkeitsprüfung', values: [true, true, true] },
    { feature: 'Reinigungspuffer', values: [true, true, true] },
    { feature: 'Zeitfenster & Buchungsregeln', values: [true, true, true] },
    { feature: 'Approval-Flow', values: [true, true, true] },
    { feature: 'Übernachtungsbuchungen', values: [true, true, true] },
    { feature: 'Multi-Workspace', values: [true, true, true] },
    { feature: 'Kaution & Anzahlung', values: [true, true, true] },
  ]
};

const SECURITY_BADGES = [
  { label: 'DSGVO-konform', icon: '<img src="/src/svg/ICON/check.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />' },
  { label: 'SSL-Verschlüsselung', icon: '<img src="/src/svg/ICON/lock.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />' },
  { label: 'Sichere Daten', icon: '<img src="/src/svg/ICON/check.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />' },
  { label: 'EU-Server', icon: '<img src="/src/svg/ICON/Globe.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />' },
];

const FAQ = [
  { question: 'Was unterscheidet die Pläne?', answer: 'Nur die Anzahl der Workspaces. Solo hat 1, Plus 3 und Agency 10 Workspaces. Alle weiteren Features sind in jedem Plan enthalten.' },
  { question: 'Enthält jeder Plan alle Features?', answer: 'Ja. Egal welchen Plan du wählst – du bekommst immer alles: Analytics, automatische Rechnungen, Add-ons, Gutscheine, Embed-Widget, Mitarbeiterverwaltung und mehr. Keine Reduzierung, nichts fehlt dir.' },
  { question: 'Was bedeutet Founder Early Access?', answer: 'Als Dank an unsere frühen Nutzer bieten wir reduzierte Preise an. Sobald 200 Nutzer registriert sind, werden die Preise leicht angehoben. Wer sich früh registriert, profitiert dauerhaft von den aktuellen Konditionen.' },
  { question: 'Kann ich jederzeit kündigen?', answer: 'Ja, du kannst monatliche Pläne jederzeit kündigen. Keine Vertragsbindung, keine versteckten Kosten.' },
  { question: 'Kann ich zwischen Plänen wechseln?', answer: 'Jederzeit. Upgrades werden sofort aktiv, Downgrades zum nächsten Abrechnungszeitraum.' },
  { question: 'Gibt es eine Provision pro Buchung?', answer: 'Nein. BookFast erhebt keine Provision. Du zahlst nur den monatlichen Festpreis.' },
  { question: 'Welche Zahlungsmethoden werden akzeptiert?', answer: 'Wir akzeptieren Kreditkarte (Visa, Mastercard, Amex) und SEPA-Lastschrift für die Plangebühren.' },
  { question: 'Gibt es Rabatt bei jährlicher Zahlung?', answer: 'Ja, bei jährlicher Zahlung sparst du 20% – das entspricht 2 Monaten gratis.' },
];

export const renderPricingPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Preise', 'BookFast Preise – Mit jedem Plan bekommst du alles. Der einzige Unterschied: die Anzahl der Workspaces.');
  setFAQSchema(FAQ);

  content.innerHTML = `
    ${createHero({
      headline: 'Transparente Preise.<br>Keine versteckten Kosten.',
      subheadline: 'Mit jedem Plan bekommst du alles – nur die Anzahl der Workspaces unterscheidet sich. Keine Provision pro Buchung.',
      secondaryCTA: '',
    })}

    <section class="landing-section">
      <div class="landing-container">
        <div class="landing-pricing-founder-note">
          <span class="landing-pricing-founder-badge">Founder Early Access</span>
          <span class="landing-pricing-founder-text">Preise steigen nach 200 Registrierungen – als Dank für frühe Nutzer.</span>
        </div>
        <div class="landing-grid landing-grid-3 landing-pricing-grid">
          ${PLANS.map(p => createPricingCard(p)).join('')}
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
        <div class="landing-pricing-callout">
          <h2 class="landing-h2">Ein Plan – alle Features.</h2>
          <p class="landing-text">Alle Pläne enthalten dieselben Features: Analytics & Insights, automatische Rechnungen, Add-ons & Gutscheine, Embed-Widget, Mitarbeiterverwaltung und mehr. Der einzige Unterschied ist die Anzahl der Workspaces. Mehr Workspaces = höherer Plan.</p>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 class="landing-h2">Workspaces im Vergleich</h2>
        </div>
        ${createCompareTable(COMPARE_TABLE)}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="landing-grid landing-grid-3" style="max-width: 960px; margin: 0 auto;">
          <div class="landing-pricing-info-box">
            <h3 class="landing-h4">Brauchst du mehr als 10 Workspaces?</h3>
            <p class="landing-text-sm">Kontaktiere uns für ein individuelles Angebot, das genau zu deinen Anforderungen passt.</p>
          </div>
          <div class="landing-pricing-info-box">
            <h3 class="landing-h4">Gibt es eine Testphase?</h3>
            <p class="landing-text-sm">Du kannst BookFast 3 Tage lang kostenlos testen – ohne Kreditkarte.</p>
          </div>
          <div class="landing-pricing-info-box">
            <h3 class="landing-h4">Kann ich wechseln?</h3>
            <p class="landing-text-sm">Jederzeit. Upgrades sofort, Downgrades zum nächsten Abrechnungszeitraum. Keine Hürden.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufig gestellte Fragen</h2>
        </div>
        ${createFAQAccordion(FAQ)}
      </div>
    </section>

    ${createCTASection({
      headline: 'Starte jetzt.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}
  `;

  const faqContainer = content.querySelector('.landing-faq-list');
  if (faqContainer) initFAQAccordion(content);
};
