/**
 * Homepage - All 12 conversion sections
 */
// Hero variants — switch between classic and interactive
// import { createHero } from '../../components/landing/Hero.js';
import { createHeroInteractive, initHeroInteractive } from '../../components/landing/HeroInteractive.js';
import { createStepsSection } from '../../components/landing/StepsSection.js';
import { createFeatureGrid } from '../../components/landing/FeatureCard.js';
import { createIntegrationCard } from '../../components/landing/IntegrationCard.js';
import { createTestimonialSlider } from '../../components/landing/TestimonialSlider.js';
import { createPricingCard } from '../../components/landing/PricingCard.js';
import { createFAQAccordion, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { setPageMeta, setFAQSchema } from '../../lib/seoHelper.js';

// ── Data ──────────────────────────────────────

const FEATURES = [
  { icon: '<img src="/src/svg/ICON/list.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', title: 'Buchungsverwaltung', description: 'Status-Filter, Kalender, Listenansicht – Bestätigen und Ablehnen in einem Dashboard.', link: '/features/buchungen' },
  { icon: '<img src="/src/svg/ICON/Bank-card.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', title: 'Online-Zahlungen', description: 'Stripe Connect. Anzahlungen, Refunds – Zahlung vor Termin, Geld direkt auf dein Konto.', link: '/features/zahlungen' },
  { icon: '<img src="/src/svg/ICON/receipt-euro.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', title: 'Automatische Rechnungen', description: 'Rechnung wird automatisch generiert – nach Bestätigung oder Abschluss.', link: '/features/rechnungen' },
  { icon: '<img src="/src/svg/ICON/lock.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', title: 'Verfügbarkeitsprüfung', description: 'Echtzeit-Slot-Reservierung – damit keine Doppelbuchungen entstehen.', link: '/features/verfuegbarkeit' },
  { icon: '<img src="/src/svg/ICON/chart.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', title: 'Analytics & Insights', description: 'Conversion-Funnel, Drop-off-Raten – Entscheidungen mit Zahlen stützen.', link: '/features/analytics' },
  { icon: '<img src="/src/svg/ICON/Building-comapny.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', title: 'Multi-Workspace', description: 'Mehrere Standorte oder Marken in einem Account – klare Zuständigkeiten.', link: '/features/workspaces' },
];

const INTEGRATIONS = [
  { icon: '<img src="/src/svg/ICON/Globe.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', name: 'Webflow', description: 'Native Integration per Embed-Script oder Template – in wenigen Klicks.', status: 'active' },
  { icon: '<img src="/src/svg/ICON/Bank-card.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', name: 'Stripe', description: 'Connect-Onboarding, Anzahlungen, Refunds. Auszahlungen direkt auf dein Konto.', status: 'active' },
  { icon: '<img src="/src/svg/ICON/calender-days-date.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', name: 'Google Calendar', description: 'Kalender-Sync für deine Buchungen – bald verfügbar.', status: 'coming-soon' },
  { icon: '<img src="/src/svg/ICON/blocks-integration.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" />', name: 'Webhooks', description: 'Events für Automatisierungen – verbinde deine bestehenden Tools.', status: 'active' },
];

const TESTIMONIALS = [
  { quote: 'Endlich ein Buchungstool, das in mein Webflow-Projekt passt, ohne wie ein Fremdkörper auszusehen.', name: 'Lisa M.', role: 'Webflow-Designerin', company: 'Studio Nordlicht' },
  { quote: 'Die automatischen Rechnungen sparen mir jede Woche mehrere Stunden. Absoluter Game-Changer.', name: 'Thomas K.', role: 'Geschäftsführer', company: 'Alpine Chalets' },
  { quote: 'Drop-off Analytics haben mir gezeigt, wo Kunden abspringen. Conversion um 40% verbessert.', name: 'Sarah W.', role: 'Marketing Managerin', company: 'FitSpace Berlin' },
];

const FAQ_ITEMS = [
  { question: 'Was kostet BookFast?', answer: 'BookFast startet ab 9,49 €/Monat (Solo, 1 Workspace). Plus (3 Workspaces) 16,49 €/Monat, Agency (10 Workspaces) 29,49 €/Monat. Alle Pläne enthalten dieselben Features – nur die Anzahl der Workspaces unterscheidet sich. 0% Provision pro Buchung.' },
  { question: 'Funktioniert BookFast nur mit Webflow?', answer: 'BookFast ist für Webflow optimiert und funktioniert auf jeder Website per Embed-Script. Die Webflow-Integration bietet zusätzlich Template-Copy und native Datenattribute.' },
  { question: 'Wie funktioniert die Zahlung?', answer: 'Über Stripe Connect. Deine Kund:innen zahlen direkt – das Geld geht auf dein Stripe-Konto. Volle Kontrolle über Auszahlungen.' },
  { question: 'Kann ich BookFast für Übernachtungen nutzen?', answer: 'Ja. Stundenbuchungen, Tagesbuchungen und Übernachtungen mit Check-in/Check-out, Mindestaufenthalt und Reinigungspuffer.' },
  { question: 'Gibt es Doppelbuchungen?', answer: 'Nein. Die Echtzeit-Slot-Reservierung blockiert den Zeitraum, sobald ein:e Kund:in den Checkout startet. Konfliktlogik verhindert Überschneidungen.' },
  { question: 'Brauche ich technisches Wissen?', answer: 'Nein. Script-Tag in deine Website kopieren oder Webflow-Template nutzen. Einrichtung unter 5 Minuten.' },
  { question: 'Kann ich mehrere Standorte verwalten?', answer: 'Ja. Mit Multi-Workspace verwaltest du mehrere Standorte, Marken oder Projekte in einem Account – jeweils mit eigenen Einstellungen.' },
  { question: 'Welche Zahlungsmethoden werden unterstützt?', answer: 'Aktuell Kreditkarte (Visa, Mastercard, Amex) über Stripe. Klarna und PayPal sind in Planung.' },
];

// ── Render ──────────────────────────────────────

export const renderHomePageSecondary = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta(null, 'BookFast – Buchungen auf deiner Website. 0% Provision, Zahlung vor Termin. Webflow-native, in 5 Minuten eingerichtet.');
  setFAQSchema(FAQ_ITEMS);

  content.innerHTML = `
    <!-- 1. Hero (Interactive Variant) -->
    ${createHeroInteractive({
    headline: 'BookFast jetzt testen – ohne Anmeldung.',
    subheadline: 'Workspace-Name eingeben und direkt loslegen.',
    formLabel: 'Workspace-Name',
    formPlaceholder: 'z.B. Alpine Chalets, Studio Nordlicht…',
    formButtonText: 'Jetzt testen →',
    formHint: 'Keine E-Mail. Keine Kreditkarte. Kein Abo.',
    trustClaims: ['0% Provision', 'Webflow-native', 'Zahlung vor Termin'],
  })}

    <!-- 2. Problem → Lösung -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container text-center">
        <p class="landing-label">Warum Buchungen in Webflow oft nerven</p>
        <h2 class="landing-h2 text-balance">Redirects, iFrames, fehlende Daten – das muss nicht sein.</h2>
        <div class="landing-grid landing-grid-3" style="margin-top: 2.5rem;">
          <div style="padding: 1.5rem;">
            <h3 class="landing-h4">Externe Redirects</h3>
            <p class="landing-text-sm">Kunden springen zu Calendly, Acuity oder anderen Tools – weg von deiner Website.</p>
          </div>
          <div style="padding: 1.5rem;">
            <h3 class="landing-h4">Keine Kontrolle</h3>
            <p class="landing-text-sm">iFrames, die nicht zu deinem Design passen. Kein Einfluss auf den Booking-Flow.</p>
          </div>
          <div style="padding: 1.5rem;">
            <h3 class="landing-h4">Fehlende Daten</h3>
            <p class="landing-text-sm">Keine Conversion-Daten, keine Drop-off-Analyse. Du weißt nicht, wo Kunden abspringen.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. So funktioniert's -->
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">So funktioniert's</p>
        <h2 class="landing-h2">In 3 Schritten startklar.</h2>
        <div style="margin-top: 2.5rem;">
          ${createStepsSection([
    { title: 'Angebot anlegen', description: 'Lege Objekte, Services und Preise im Dashboard an. Stunden-, Tages- oder Übernachtungsmiete – du entscheidest.' },
    { title: 'Payment verbinden', description: 'Stripe Connect in unter 5 Minuten verbunden. Kunden zahlen direkt – das Geld geht auf dein Konto.' },
    { title: 'Widget einbetten', description: 'Script-Tag in deine Webflow-Seite kopieren oder Template nutzen. Fertig.' },
  ])}
        </div>
      </div>
    </section>

    <!-- 4. Feature-Highlights -->
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">Features</p>
        <h2 class="landing-h2">Alles an einem Ort – ohne Tool-Wildwuchs.</h2>
        <div style="margin-top: 2.5rem;">
          ${createFeatureGrid(FEATURES)}
        </div>
        <div style="margin-top: 2rem;">
          <a href="/features" class="landing-btn landing-btn-secondary" data-landing-link>Funktionen vergleichen →</a>
        </div>
      </div>
    </section>

    <!-- 6. Integrationen -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center">
          <p class="landing-label">Integrationen</p>
          <h2 class="landing-h2">Tools verbinden statt wechseln.</h2>
        </div>
        <div class="landing-grid landing-grid-2" style="margin-top: 2.5rem; max-width: 800px; margin-left: auto; margin-right: auto;">
          ${INTEGRATIONS.map(i => createIntegrationCard(i)).join('')}
        </div>
        <div class="text-center" style="margin-top: 2rem;">
          <a href="/integrationen" class="landing-btn landing-btn-secondary" data-landing-link>Integrationen ansehen →</a>
        </div>
      </div>
    </section>

    <!-- 8. Social Proof -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="landing-label">Kundenstimmen</p>
          <h2 class="landing-h2">Was Kund:innen über BookFast sagen.</h2>
        </div>
        ${createTestimonialSlider(TESTIMONIALS)}
      </div>
    </section>

    <!-- 9. Pricing-Teaser -->
    <section class="landing-section">
      <div class="landing-container text-center">
        <p class="landing-label">Preise</p>
        <h2 class="landing-h2">Pläne, die mitwachsen.</h2>
        <p class="landing-text" style="max-width: 500px; margin: 0 auto 2.5rem;">Alle Features in jedem Plan. Der einzige Unterschied: die Anzahl der Workspaces. Keine Provision pro Buchung.</p>
        <div class="landing-grid landing-grid-3 landing-pricing-grid" style="max-width: 960px; margin: 0 auto;">
          ${createPricingCard({ name: 'Solo', price: '9,49', priceAnnual: '91,10', priceEffectiveMonthly: '7,59', workspaces: 1, description: 'Ideal für Einzelunternehmer.', highlighted: true, cta: 'Jetzt starten' })}
          ${createPricingCard({ name: 'Plus', price: '16,49', priceAnnual: '158,30', priceEffectiveMonthly: '13,19', workspaces: 3, description: 'Für kleine Teams.', cta: 'Jetzt starten' })}
          ${createPricingCard({ name: 'Agency', price: '29,49', priceAnnual: '283,10', priceEffectiveMonthly: '23,59', workspaces: 10, description: 'Für Agenturen.', cta: 'Jetzt starten' })}
        </div>
        <div style="margin-top: 2rem;">
          <a href="/preise" class="landing-btn landing-btn-ghost" data-landing-link>Plan vergleichen →</a>
        </div>
      </div>
    </section>

    <!-- 10. FAQ -->
    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <p class="hero-new__tagline">FAQ</p>
          <h2 class="landing-h2">Häufige Fragen zu BookFast.</h2>
        </div>
        ${createFAQAccordion(FAQ_ITEMS)}
      </div>
    </section>

    <!-- 11. Final CTA -->
    ${createCTASection({
    headline: 'Buchungen auf deiner Website – in 5 Minuten eingerichtet.',
    subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. Jederzeit kündbar.',
  })}
  `;

  // Initialize interactive elements
  initHeroInteractive();

  const faqContainer = content.querySelector('.landing-faq-list');
  if (faqContainer) initFAQAccordion(content);
};
