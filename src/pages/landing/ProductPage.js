/**
 * Product Overview Page
 */
import { createHero } from '../../components/landing/Hero.js';
import { createFeatureGrid } from '../../components/landing/FeatureCard.js';
import { createFeatureSection } from '../../components/landing/FeatureSection.js';
import { createFAQSection, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { SHARED_FAQ } from '../../data/faq.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setFAQSchema, setBreadcrumbSchema } from '../../lib/seoHelper.js';

const PAGE_FAQ = [
  { question: 'Was genau ist das BookFast-Widget?', answer: 'Ein Buchungsformular, das nativ in deiner Website lebt – kein iFrame, kein Redirect. Deine Kunden bleiben auf deiner Seite und buchen direkt dort.' },
  { question: 'Wie unterscheidet sich BookFast von Calendly oder Acuity?', answer: 'BookFast ist speziell für Webflow gebaut. Es lebt nativ in deiner Seite, erhebt keine Provision und bietet Analytics, automatische Rechnungen und Multi-Workspace – Features, die klassische Scheduling-Tools nicht haben.' },
  { question: 'Kann ich Stunden-, Tages- und Übernachtungsbuchungen anbieten?', answer: 'Ja. Du konfigurierst pro Service, ob es sich um eine Stundenbuchung, Tagesbuchung oder Übernachtung handelt – inklusive Check-in/Check-out, Mindestaufenthalt und Reinigungspuffer.' },
  { question: 'Werden Rechnungen automatisch erstellt?', answer: 'Ja. Nach Bestätigung oder Abschluss einer Buchung generiert BookFast automatisch eine Rechnung mit deinen Firmendaten. Deine Kunden können sie im Kundenportal einsehen.' },
  { question: 'Wie erhalte ich meine Zahlungen?', answer: 'Über Stripe Connect. Deine Kunden zahlen direkt – das Geld wird automatisch auf dein Bankkonto ausgezahlt. Du hast volle Kontrolle über Auszahlungen und Rückerstattungen.' },
];

export const renderProductPage = () => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  setPageMeta('Buchungstool für Webflow – Produkt', 'Buchungstool für Webflow: Widget + Dashboard für Buchungen, Online-Zahlungen, Rechnungen und Analytics.');
  setFAQSchema([...SHARED_FAQ, ...PAGE_FAQ]);
  setBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Produkt', url: '/produkt' },
  ]);

  content.innerHTML = `
    ${createHero({
      headline: 'Buchungstool für Webflow – Buchungen, Zahlungen, Rechnungen.',
      subheadline: 'BookFast ist Booking-Widget + Dashboard in einem. Für Webflow-Nutzer, die Online-Buchung und Zahlungen ohne iFrame und Provision verwalten wollen.',
      illustrationAlt: 'Produkt-Illustration mit Buchungen, Zahlungen und Rechnungen in BookFast',
      variant: 'split',
      imageHTML: `<div style="background: var(--color-stone-100); border-radius: 16px; height: 400px; display: flex; align-items: center; justify-content: center; font-size: 4rem;">${iconImg('calender-days-date.svg')}</div>`,
    })}

    <section class="landing-section landing-section-alt">
      <div class="landing-container text-center">
        <p class="landing-label">Das Problem</p>
        <h2 class="landing-h2 text-balance">Redirects, iFrames, fehlende Daten – das muss nicht sein.</h2>
        <p class="landing-text" style="max-width: 700px; margin: 1rem auto 0;">
          Externe Scheduling-Tools redirecten deine Kunden weg von deiner Website. iFrames passen nicht ins Design. 
          Du hast keine Kontrolle über den Booking-Flow und keine Daten darüber, wo Kunden abspringen.
          Die meisten Tools nehmen dazu noch eine Provision pro Buchung.
        </p>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: 'Die Lösung: Alles an einem Ort.',
          description: 'BookFast gibt dir die volle Kontrolle über Buchungen, Zahlungen und Kundendaten – direkt in deiner Webflow-Seite.',
          bullets: [
            'Webflow-natives Widget, kein iFrame oder Redirect.',
            'Zahlung vor Termin mit Stripe Connect.',
            'Automatische Rechnungen nach Bestätigung.',
            'Analytics-Dashboard mit Conversion-Funnel und Drop-off-Daten.',
          ],
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container text-center">
        <p class="landing-label">Features</p>
        <h2 class="landing-h2">Alles was du brauchst.</h2>
        <div style="margin-top: 2.5rem;">
          ${createFeatureGrid([
            { icon: iconImg('list.svg'), title: 'Buchungen', description: 'Status-Filter, Kalender/Liste, Bestätigen, Ablehnen, Stornieren.', link: '/features/buchungen' },
            { icon: iconImg('Bank-card.svg'), title: 'Zahlungen', description: 'Stripe Connect, Anzahlung, Refunds, automatische Auszahlungen.', link: '/features/zahlungen' },
            { icon: iconImg('receipt-euro.svg'), title: 'Rechnungen', description: 'Automatisch generiert nach Bestätigung oder Abschluss.', link: '/features/rechnungen' },
            { icon: iconImg('chart.svg'), title: 'Analytics', description: 'Funnel, Drop-offs, Conversion-Rates, Revenue-Tracking.', link: '/features/analytics' },
            { icon: iconImg('home.svg'), title: 'Objekte & Services', description: 'Räume, Stunden-/Tages-/Übernachtungsbuchungen.', link: '/features/objekte' },
            { icon: iconImg('users-2.svg'), title: 'Mitarbeiter', description: 'Zuordnung zu Services, Verfügbarkeiten, Kalender.', link: '/features/mitarbeiter' },
            { icon: iconImg('ticket-percent.svg'), title: 'Add-ons & Gutscheine', description: 'Upsells, Rabattcodes, Nutzungslimits.', link: '/features/addons' },
            { icon: iconImg('Building-comapny.svg'), title: 'Multi-Workspace', description: 'Mehrere Standorte oder Marken in einem Account.', link: '/features/workspaces' },
            { icon: iconImg('lock.svg'), title: 'Approval-Flow', description: 'Erst zahlen, dann bestätigen. Du behältst die Kontrolle.', link: '/features/approval' },
          ])}
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: 'Was BookFast anders macht.',
          description: 'Im Vergleich zu anderen Webflow-Booking-Tools bietet BookFast:',
          bullets: [
            'Multi-Workspace als Kernkonzept – nicht nachträglich drangeklatscht.',
            'Analytics für Drop-offs und Payment-Completion – Daten die andere nicht zeigen.',
            'Regel-Engine für Buffer, Overnight und Approval-Flow – klar konfigurierbar.',
            'Webflow-first UX: Template-Copy statt iFrame-Gefühl.',
          ],
          reverse: true,
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container text-center">
        <h2 class="landing-h2">Typische Szenarien</h2>
        <div class="landing-grid landing-grid-2" style="margin-top: 2rem; max-width: 800px; margin-left: auto; margin-right: auto; text-align: left;">
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('home.svg')} Ferienwohnung vermieten</h3>
            <p class="landing-text-sm">Übernachtungen mit Check-in/out, Reinigungspuffer, Anzahlung und automatischer Rechnung.</p>
          </div>
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('sprout.svg')} Yoga-Kurse anbieten</h3>
            <p class="landing-text-sm">Kursbuchungen mit Trainer-Auswahl, Gutscheinen und Add-ons wie Yogamatten.</p>
          </div>
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('luggage.svg')} Coworking-Räume buchen</h3>
            <p class="landing-text-sm">Stunden- oder Tagesmiete für Meeting-Rooms und Schreibtische.</p>
          </div>
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('user.svg')} Friseur-Termine buchen</h3>
            <p class="landing-text-sm">Service-Auswahl, Mitarbeiter-Buchung, verschiedene Zeitslots.</p>
          </div>
        </div>
      </div>
    </section>

    ${createCTASection({
      headline: 'Buchungen auf deiner Website – in 5 Minuten eingerichtet.',
      subheadline: '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}

    ${createFAQSection({ sharedFaq: SHARED_FAQ, pageFaq: PAGE_FAQ, pageTitle: 'Produkt' })}
  `;

  initFAQAccordion(content);
};
