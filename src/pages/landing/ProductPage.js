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
import { setPageMeta, setFAQSchema, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { deFeatureSlugToEn } from '../../lib/featureSlugLocale.js';

const SHARED_FAQ_EN = [
  { question: 'What is BookFast?', answer: 'BookFast is a Webflow booking system with payments. You offer bookings directly on your own site — no redirects, no iframes, no commission per booking.' },
  { question: 'How does setup work?', answer: 'You create objects and services in the dashboard, connect Stripe Connect, and embed the widget via script tag and Webflow template. You can be live in under 5 minutes.' },
  { question: 'What does BookFast cost?', answer: 'From €9.49/month (Basic, 1 workspace). All plans include the same features — only the number of workspaces differs. 0% commission per booking.' },
  { question: 'Does BookFast work only with Webflow?', answer: 'Yes. BookFast currently works only with Webflow — it is optimized for Webflow and does not run on other sites today.' },
  { question: 'Do I need technical skills?', answer: 'No. Add the script tag and Webflow template — done. No programming required.' },
  { question: 'Which payment methods are supported?', answer: 'Currently credit card (Visa, Mastercard, Amex) via Stripe Connect. Klarna and PayPal are planned.' },
];

const PAGE_FAQ = [
  { question: 'Was genau ist das BookFast-Widget?', answer: 'Ein Buchungsformular, das nativ in deiner Website lebt – kein iFrame, kein Redirect. Deine Kunden bleiben auf deiner Seite und buchen direkt dort.' },
  { question: 'Wie unterscheidet sich BookFast von Calendly oder Acuity?', answer: 'BookFast ist speziell für Webflow gebaut. Es lebt nativ in deiner Seite, erhebt keine Provision und bietet Analytics, automatische Rechnungen und Multi-Workspace – Features, die klassische Scheduling-Tools nicht haben.' },
  { question: 'Kann ich Stunden-, Tages- und Übernachtungsbuchungen anbieten?', answer: 'Ja. Du konfigurierst pro Service, ob es sich um eine Stundenbuchung, Tagesbuchung oder Übernachtung handelt – inklusive Check-in/Check-out, Mindestaufenthalt und Reinigungspuffer.' },
  { question: 'Werden Rechnungen automatisch erstellt?', answer: 'Ja. Nach Bestätigung oder Abschluss einer Buchung generiert BookFast automatisch eine Rechnung mit deinen Firmendaten. Deine Kunden können sie im Kundenportal einsehen.' },
  { question: 'Wie erhalte ich meine Zahlungen?', answer: 'Über Stripe Connect. Deine Kunden zahlen direkt – das Geld wird automatisch auf dein Bankkonto ausgezahlt. Du hast volle Kontrolle über Auszahlungen und Rückerstattungen.' },
];

const PAGE_FAQ_EN = [
  { question: 'What exactly is the BookFast widget?', answer: 'A booking form that lives natively on your site — no iframe, no redirect. Your customers stay on your page and book right there.' },
  { question: 'How is BookFast different from Calendly or Acuity?', answer: 'BookFast is built specifically for Webflow. It lives natively in your site, charges no commission, and offers analytics, automatic invoices, and multi-workspace — features classic scheduling tools do not have.' },
  { question: 'Can I offer hourly, daily, and overnight bookings?', answer: 'Yes. You configure each service as hourly, daily, or overnight — including check-in/check-out, minimum stay, and cleaning buffer.' },
  { question: 'Are invoices created automatically?', answer: 'Yes. After a booking is confirmed or completed, BookFast generates an invoice with your business details. Customers can view it in the customer portal.' },
  { question: 'How do I get paid?', answer: 'Via Stripe Connect. Customers pay directly — funds are paid out to your bank account automatically. You keep full control over payouts and refunds.' },
];

function featurePath(isEn, deSlug) {
  if (!isEn) return `/features/${deSlug}`;
  const en = deFeatureSlugToEn(deSlug);
  return en ? `/en/features/${en}` : '/en/features';
}

export const renderProductPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const sharedFaq = isEn ? SHARED_FAQ_EN : SHARED_FAQ;
  const pageFaq = isEn ? PAGE_FAQ_EN : PAGE_FAQ;

  setPageMeta(
    isEn ? 'Booking for Webflow – Product' : 'Buchungssystem für Webflow – Produkt',
    isEn
      ? 'Booking for Webflow: widget + dashboard for bookings, online payments, invoices, and analytics.'
      : 'Buchungssystem für Webflow: Widget + Dashboard für Buchungen, Online-Zahlungen, Rechnungen und Analytics.',
    { locale },
  );
  setFAQSchema([...sharedFaq, ...pageFaq]);
  setBreadcrumbSchema([
    { name: 'Home', url: isEn ? '/en' : '/' },
    { name: isEn ? 'Product' : 'Produkt', url: isEn ? '/en/product' : '/produkt' },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/produkt' },
    { hreflang: 'en', path: '/en/product' },
  ]);

  content.innerHTML = `
    ${createHero({
      headline: isEn
        ? 'Booking for Webflow — bookings, payments, invoices.'
        : 'Buchungssystem für Webflow – Buchungen, Zahlungen, Rechnungen.',
      subheadline: isEn
        ? 'BookFast is booking widget + dashboard in one. For Webflow users who want online booking and payments without iframes or commission.'
        : 'BookFast ist Booking-Widget + Dashboard in einem. Für Webflow-Nutzer, die Online-Buchung und Zahlungen ohne iFrame und Provision verwalten wollen.',
      illustrationAlt: isEn
        ? 'Product illustration: bookings, payments, and invoices in BookFast'
        : 'Produkt-Illustration mit Buchungen, Zahlungen und Rechnungen in BookFast',
      variant: 'split',
      imageHTML: `<div style="background: var(--color-stone-100); border-radius: 16px; height: 400px; display: flex; align-items: center; justify-content: center; font-size: 4rem;">${iconImg('calender-days-date.svg')}</div>`,
    })}

    <section class="landing-section landing-section-alt">
      <div class="landing-container text-center">
        <p class="landing-label">${isEn ? 'The problem' : 'Das Problem'}</p>
        <h2 class="landing-h2 text-balance">${isEn ? 'Redirects, iframes, missing data — it does not have to be that way.' : 'Redirects, iFrames, fehlende Daten – das muss nicht sein.'}</h2>
        <p class="landing-text" style="max-width: 700px; margin: 1rem auto 0;">
          ${isEn
            ? 'External scheduling tools redirect customers away from your site. Iframes break your design. You lose control of the booking flow and data on where people drop off. Most tools also charge a commission per booking.'
            : `Externe Scheduling-Tools redirecten deine Kunden weg von deiner Website. iFrames passen nicht ins Design. 
          Du hast keine Kontrolle über den Booking-Flow und keine Daten darüber, wo Kunden abspringen.
          Die meisten Tools nehmen dazu noch eine Provision pro Buchung.`}
        </p>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? 'The solution: everything in one place.' : 'Die Lösung: Alles an einem Ort.',
          description: isEn
            ? 'BookFast gives you full control over bookings, payments, and customer data — right inside your Webflow site.'
            : 'BookFast gibt dir die volle Kontrolle über Buchungen, Zahlungen und Kundendaten – direkt in deiner Webflow-Seite.',
          bullets: isEn
            ? [
                'Webflow-native widget — no iframe or redirect.',
                'Pay before the appointment with Stripe Connect.',
                'Automatic invoices after confirmation.',
                'Analytics dashboard with conversion funnel and drop-off data.',
              ]
            : [
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
        <p class="landing-label">${isEn ? 'Features' : 'Features'}</p>
        <h2 class="landing-h2">${isEn ? 'Everything you need.' : 'Alles was du brauchst.'}</h2>
        <div style="margin-top: 2.5rem;">
          ${createFeatureGrid([
            { icon: iconImg('list.svg'), title: isEn ? 'Bookings' : 'Buchungen', description: isEn ? 'Status filters, calendar/list, confirm, reject, approval flow.' : 'Status-Filter, Kalender/Liste, Bestätigen, Ablehnen, Approval-Flow.', link: featurePath(isEn, 'buchungen') },
            { icon: iconImg('home.svg'), title: isEn ? 'Resources' : 'Objekte', description: isEn ? 'Rooms, availability, time slots, buffers, and blocked times.' : 'Räume, Verfügbarkeit, Zeitfenster, Puffer und Sperrzeiten.', link: featurePath(isEn, 'objekte') },
            { icon: iconImg('list.svg'), title: 'Services', description: isEn ? 'Hourly, daily, overnight bookings, and add-ons.' : 'Stunden-, Tages-, Übernachtungsbuchungen und Add-ons.', link: featurePath(isEn, 'services') },
            { icon: iconImg('Bank-card.svg'), title: isEn ? 'Payments' : 'Zahlungen', description: isEn ? 'Stripe Connect, deposits, vouchers, refunds.' : 'Stripe Connect, Anzahlung, Gutscheine, Refunds.', link: featurePath(isEn, 'zahlungen') },
            { icon: iconImg('receipt-euro.svg'), title: isEn ? 'Invoices' : 'Rechnungen', description: isEn ? 'Auto-generated after confirmation or completion.' : 'Automatisch generiert nach Bestätigung oder Abschluss.', link: featurePath(isEn, 'rechnungen') },
            { icon: iconImg('chart.svg'), title: isEn ? 'Analytics & Customers' : 'Analytics & Kunden', description: isEn ? 'Funnel, drop-offs, customer database, revenue tracking.' : 'Funnel, Drop-offs, Kundendatenbank, Revenue-Tracking.', link: featurePath(isEn, 'analytics') },
            { icon: iconImg('blocks-integration.svg'), title: isEn ? 'Webflow Integration' : 'Webflow Integration', description: isEn ? 'Widget embed, template copy, no iframe.' : 'Widget-Einbettung, Template-Copy, kein iFrame.', link: featurePath(isEn, 'integration') },
            { icon: iconImg('spark-magic.svg'), title: isEn ? 'Customer Portal' : 'Kundenportal', description: isEn ? 'Magic link, self-service, no account required.' : 'Magic Link, Self-Service, kein Konto nötig.', link: featurePath(isEn, 'kundenportal') },
            { icon: iconImg('users-2.svg'), title: isEn ? 'Staff' : 'Mitarbeiter', description: isEn ? 'Assign to services, availability per person.' : 'Zuordnung zu Services, Verfügbarkeit pro Person.', link: featurePath(isEn, 'mitarbeiter') },
            { icon: iconImg('Building-comapny.svg'), title: isEn ? 'Multi-Workspace' : 'Multi-Workspace', description: isEn ? 'Multiple locations or brands in one account.' : 'Mehrere Standorte oder Marken in einem Account.', link: featurePath(isEn, 'workspaces') },
          ])}
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? 'What BookFast does differently.' : 'Was BookFast anders macht.',
          description: isEn ? 'Compared to other Webflow booking tools, BookFast offers:' : 'Im Vergleich zu anderen Webflow-Booking-Tools bietet BookFast:',
          bullets: isEn
            ? [
                'Multi-workspace as a core concept — not bolted on later.',
                'Analytics for drop-offs and payment completion — data others do not show.',
                'Rule engine for buffer, overnight, and approval flow — clearly configurable.',
                'Webflow-first UX: template copy instead of an iframe feel.',
              ]
            : [
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
        <h2 class="landing-h2">${isEn ? 'Typical scenarios' : 'Typische Szenarien'}</h2>
        <div class="landing-grid landing-grid-2" style="margin-top: 2rem; max-width: 800px; margin-left: auto; margin-right: auto; text-align: left;">
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('home.svg')} ${isEn ? 'Rent a vacation rental' : 'Ferienwohnung vermieten'}</h3>
            <p class="landing-text-sm">${isEn ? 'Overnight stays with check-in/out, cleaning buffer, deposit, and automatic invoice.' : 'Übernachtungen mit Check-in/out, Reinigungspuffer, Anzahlung und automatischer Rechnung.'}</p>
          </div>
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('sprout.svg')} ${isEn ? 'Run yoga classes' : 'Yoga-Kurse anbieten'}</h3>
            <p class="landing-text-sm">${isEn ? 'Class bookings with trainer selection, vouchers, and add-ons like mats.' : 'Kursbuchungen mit Trainer-Auswahl, Gutscheinen und Add-ons wie Yogamatten.'}</p>
          </div>
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('luggage.svg')} ${isEn ? 'Book coworking space' : 'Coworking-Räume buchen'}</h3>
            <p class="landing-text-sm">${isEn ? 'Hourly or day rental for meeting rooms and desks.' : 'Stunden- oder Tagesmiete für Meeting-Rooms und Schreibtische.'}</p>
          </div>
          <div style="padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--color-stone-200);">
            <h3 class="landing-h4">${iconImg('user.svg')} ${isEn ? 'Hair salon appointments' : 'Friseur-Termine buchen'}</h3>
            <p class="landing-text-sm">${isEn ? 'Service selection, staff booking, different time slots.' : 'Service-Auswahl, Mitarbeiter-Buchung, verschiedene Zeitslots.'}</p>
          </div>
        </div>
      </div>
    </section>

    ${createCTASection({
      headline: isEn ? 'Bookings on your site — set up in 5 minutes.' : 'Buchungen auf deiner Website – in 5 Minuten eingerichtet.',
      subheadline: isEn ? '3-day free trial. No credit card. Live in under 5 minutes.' : '3 Tage kostenlos testen. Keine Kreditkarte nötig. In unter 5 Minuten startklar.',
    })}

    ${createFAQSection({ sharedFaq, pageFaq, pageTitle: isEn ? 'Product' : 'Produkt' })}
  `;

  initFAQAccordion(content);
};
