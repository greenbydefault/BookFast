/**
 * Product Page
 */
import { createFeatureHero } from '../../components/landing/FeatureHero.js';
import { createFeatureSection } from '../../components/landing/FeatureSection.js';
import { createFAQAccordion, initFAQAccordion } from '../../components/landing/FAQAccordion.js';
import { createCTASection } from '../../components/landing/CTASection.js';
import { createFeatureRelatedSlider, initFeatureRelatedSlider } from '../../components/landing/FeatureRelatedSlider.js';
import { iconImg } from '../../lib/landingAssets.js';
import { setPageMeta, setFAQSchema, setBreadcrumbSchema, setHreflangAlternates } from '../../lib/seoHelper.js';
import { getFeaturePage } from '../../lib/getLocaleContent.js';
import { escapeHtml } from '../../lib/sanitize.js';

const PRODUCT_FEATURE_SLUGS = ['buchungen', 'objekte', 'services', 'zahlungen', 'integration', 'analytics'];

const PRODUCT_OVERVIEW_DE = [
  {
    question: 'Was muss ich auf einen Blick wissen?',
    answer: 'BookFast verbindet Buchungswidget, Dashboard, Zahlungen, Rechnungen und Analytics in einem Flow. Deine Kunden bleiben auf deiner Website, du behältst Kontrolle über Conversion, Daten und Zahlungseingänge.',
  },
  {
    question: 'Für wen ist BookFast gemacht?',
    answer: 'Für Unternehmen mit Webflow-Website, die Termine, Räume, Kurse, Tagesmieten oder Übernachtungen direkt auf der eigenen Seite verkaufen wollen, statt Leads an externe Tools oder Redirect-Strecken zu verlieren.',
  },
  {
    question: 'Wie schnell bin ich live?',
    answer: 'Typisch in wenigen Minuten: Services und Objekte anlegen, Stripe verbinden, Widget per Embed-Script einbauen oder den Flow per Template-Copy in Webflow einsetzen.',
  },
  {
    question: 'Wo ist der Unterschied zu klassischen Scheduling-Tools?',
    answer: 'Kein iFrame-Gefühl, kein Fremdportal, keine Provision pro Buchung. Stattdessen nativer Einbau, konfigurierbare Zahlungslogik, automatische Rechnungen und echte Funnel-Daten zu Drop-offs und Abschlüssen.',
  },
];

const PRODUCT_OVERVIEW_EN = [
  {
    question: 'What matters at a glance?',
    answer: 'BookFast combines booking widget, dashboard, payments, invoices, and analytics in one flow. Customers stay on your website while you keep control over conversion, data, and payouts.',
  },
  {
    question: 'Who is BookFast for?',
    answer: 'For teams with a Webflow website that want to sell appointments, rooms, classes, day rentals, or overnight stays directly on their own site instead of losing demand to external tools and redirects.',
  },
  {
    question: 'How fast can I go live?',
    answer: 'Usually in a few minutes: create services and resources, connect Stripe, then embed the widget with a script tag or use template copy inside Webflow.',
  },
  {
    question: 'How is this different from classic scheduling tools?',
    answer: 'No iframe feel, no external portal, no commission per booking. Instead you get native embed, configurable payment logic, automatic invoices, and real funnel visibility for drop-offs and completions.',
  },
];

const PRODUCT_FAQ_DE = [
  {
    question: 'Läuft BookFast nur mit Webflow?',
    answer: 'BookFast ist Webflow-first. Das Embed-Script funktioniert grundsätzlich auf jeder Website. Template-Copy, Datenattribute und der schnellste Setup-Weg sind aber klar auf Webflow optimiert.',
  },
  {
    question: 'Welche Zahlungslogik kann ich abbilden?',
    answer: 'Du kannst Stripe Connect anbinden, Anzahlungen definieren, komplette Zahlungen vor Buchung einziehen und Rückerstattungen sauber im Prozess abbilden.',
  },
  {
    question: 'Kann ich verschiedene Buchungsmodelle anbieten?',
    answer: 'Ja. Stundenbuchungen, Tagesmieten, Übernachtungen, Add-ons, Buffer, Zeitfenster, Check-in/out und Freigabe-Workflows lassen sich pro Angebot konfigurieren.',
  },
  {
    question: 'Bekomme ich auch operative Transparenz?',
    answer: 'Ja. Du siehst Buchungsstatus, Conversion-Funnel, Drop-offs, Kundenhistorie sowie Zahlungs- und Rechnungsdaten an einem Ort.',
  },
  {
    question: 'Was ist mit Google Calendar, Zapier oder Make?',
    answer: 'Weitere Integrationen sind geplant. Heute decken Webflow, Stripe und Webhooks bereits den Kern ab, damit du live gehen und eigene Automationen anbinden kannst.',
  },
];

const PRODUCT_FAQ_EN = [
  {
    question: 'Is BookFast Webflow-only?',
    answer: 'BookFast is Webflow-first. The embed script can technically run on any website. Template copy, data attributes, and the fastest setup path are clearly optimized for Webflow.',
  },
  {
    question: 'What payment logic can I support?',
    answer: 'You can connect Stripe Connect, define deposits, collect full payment before booking, and handle refunds cleanly inside the same flow.',
  },
  {
    question: 'Can I support different booking models?',
    answer: 'Yes. Hourly bookings, day rentals, overnight stays, add-ons, buffers, time slots, check-in/out, and approval workflows can be configured per offer.',
  },
  {
    question: 'Do I also get operational visibility?',
    answer: 'Yes. You see booking statuses, conversion funnel, drop-offs, customer history, and payment plus invoice data in one place.',
  },
  {
    question: 'What about Google Calendar, Zapier, or Make?',
    answer: 'More integrations are planned. Today Webflow, Stripe, and webhooks already cover the core setup so you can launch and connect your own automations.',
  },
];

const getProductSliderFeatures = (locale) => PRODUCT_FEATURE_SLUGS
  .map((slug) => {
    const page = getFeaturePage(slug, locale);
    if (!page) return null;
    return { ...page, slug };
  })
  .filter(Boolean);

const createMetricCards = (items) => `
  <div class="landing-grid landing-grid-2" style="gap: 1rem;">
    ${items.map((item) => `
      <div style="padding: 1.25rem; border: 1px solid var(--color-stone-200); border-radius: 16px; background: white;">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem;">
          <span style="display:inline-flex; width:2.5rem; height:2.5rem; align-items:center; justify-content:center; border-radius:999px; background: var(--color-stone-100);">${item.icon}</span>
          <strong style="font-size: 1rem; color: var(--color-vulcan-900);">${escapeHtml(item.title)}</strong>
        </div>
        <p class="landing-text-sm" style="margin:0;">${escapeHtml(item.text)}</p>
      </div>
    `).join('')}
  </div>
`;

const createAccordionSection = ({ label, headline, items }) => `
  <section class="landing-section landing-section-alt landing-section--centered">
    <div class="landing-container" style="max-width: 860px;">
      <div class="text-center landing-faq-section-header">
        <p class="hero-new__tagline">${escapeHtml(label)}</p>
        <h2 class="landing-h2">${escapeHtml(headline)}</h2>
      </div>
      ${createFAQAccordion(items)}
    </div>
  </section>
`;

const createProductFaqSection = ({ label, headline, items }) => `
  <section class="landing-section landing-section-alt landing-section--centered">
    <div class="landing-container" style="max-width: 860px;">
      <div class="text-center landing-faq-section-header">
        <p class="hero-new__tagline">${escapeHtml(label)}</p>
        <h2 class="landing-h2">${escapeHtml(headline)}</h2>
      </div>
      ${createFAQAccordion(items)}
    </div>
  </section>
`;

export const renderProductPage = (locale = 'de') => {
  const content = document.getElementById('landing-content');
  if (!content) return;

  const isEn = locale === 'en';
  const overviewItems = isEn ? PRODUCT_OVERVIEW_EN : PRODUCT_OVERVIEW_DE;
  const pageFaq = isEn ? PRODUCT_FAQ_EN : PRODUCT_FAQ_DE;
  const relatedFeatures = getProductSliderFeatures(locale);

  setPageMeta(
    isEn ? 'Booking for Webflow - Product' : 'Buchungssystem fuer Webflow - Produkt',
    isEn
      ? 'BookFast is the central booking product for Webflow: booking widget, payments, invoices, webhooks, and analytics in one flow.'
      : 'BookFast ist das zentrale Buchungssystem fuer Webflow: Booking-Widget, Zahlungen, Rechnungen, Webhooks und Analytics in einem Flow.',
    { locale },
  );
  setFAQSchema(pageFaq);
  setBreadcrumbSchema([
    { name: 'Home', url: isEn ? '/en' : '/' },
    { name: isEn ? 'Product' : 'Produkt', url: isEn ? '/en/product' : '/produkt' },
  ]);
  setHreflangAlternates([
    { hreflang: 'de', path: '/produkt' },
    { hreflang: 'en', path: '/en/product' },
  ]);

  const heroDemoCards = isEn
    ? [
        { icon: iconImg('Globe.svg'), title: 'On your site', text: 'No redirect or iframe break.' },
        { icon: iconImg('Bank-card.svg'), title: 'Paid online', text: 'Deposits, payments, refunds via Stripe.' },
        { icon: iconImg('chart.svg'), title: 'Visible funnel', text: 'See drop-offs and completions.' },
        { icon: iconImg('receipt-euro.svg'), title: 'Operationally clean', text: 'Invoices and statuses in one place.' },
      ]
    : [
        { icon: iconImg('Globe.svg'), title: 'Auf deiner Website', text: 'Kein Redirect und kein iFrame-Bruch.' },
        { icon: iconImg('Bank-card.svg'), title: 'Online bezahlt', text: 'Anzahlung, Zahlung und Refund via Stripe.' },
        { icon: iconImg('chart.svg'), title: 'Funnel sichtbar', text: 'Drop-offs und Abschluesse messen.' },
        { icon: iconImg('receipt-euro.svg'), title: 'Operativ sauber', text: 'Rechnungen und Status an einem Ort.' },
      ];

  content.innerHTML = `
    ${createFeatureHero({
      headline: isEn
        ? 'The product page for teams that want bookings to close on their own website.'
        : 'Die Produktseite fuer Teams, die Buchungen direkt auf ihrer eigenen Website abschliessen wollen.',
      subheadline: isEn
        ? 'BookFast combines booking widget, dashboard, payments, invoices, and analytics in one Webflow-first system. Customers stay on your site while your team gets operational control.'
        : 'BookFast verbindet Booking-Widget, Dashboard, Zahlungen, Rechnungen und Analytics in einem Webflow-first System. Deine Kunden bleiben auf deiner Seite und dein Team behaelt die Kontrolle.',
      illustrationAlt: isEn
        ? 'Product overview for BookFast with bookings, payments, and analytics'
        : 'Produktueberblick fuer BookFast mit Buchungen, Zahlungen und Analytics',
      breadcrumb: isEn ? ['Home', 'Product'] : ['Home', 'Produkt'],
      breadcrumbHrefs: isEn ? ['/en'] : ['/'],
      demoModuleHTML: createMetricCards(heroDemoCards),
      demoHint: isEn
        ? 'What users need to know first: it closes on your site, gets paid online, and stays measurable.'
        : 'Das Wichtigste zuerst: Es schliesst auf deiner Website ab, kassiert online und bleibt messbar.',
    })}

    ${createAccordionSection({
      label: isEn ? 'At a glance' : 'Auf einen Blick',
      headline: isEn
        ? 'The decision layer before someone dives into features.'
        : 'Die Entscheidungsebene, bevor jemand in einzelne Features eintaucht.',
      items: overviewItems,
    })}

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '1. Webflow-first booking experience.' : '1. Webflow-first Buchungserlebnis.',
          description: isEn
            ? 'The core promise is simple: bookings should feel like part of your website, not like an external tool bolted on afterward.'
            : 'Das Kernversprechen ist einfach: Buchungen sollen sich wie Teil deiner Website anfuehlen und nicht wie ein nachtraeglich aufgesetztes Fremdtool.',
          bullets: isEn
            ? [
                { title: 'Native embed instead of iframe feel.', description: 'Customers stay inside your brand and flow.' },
                { title: 'Two setup paths.', description: 'Embed script for speed, template copy for more design control.' },
                { title: 'Built for Webflow operations.', description: 'Fastest setup and strongest UX live there.' },
              ]
            : [
                { title: 'Nativer Einbau statt iFrame-Gefuehl.', description: 'Kunden bleiben in deiner Marke und in deinem Flow.' },
                { title: 'Zwei Setup-Wege.', description: 'Embed-Script fuer Geschwindigkeit, Template-Copy fuer mehr Designkontrolle.' },
                { title: 'Fuer Webflow-Betrieb gebaut.', description: 'Dort ist Setup und Nutzererlebnis am staerksten.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('Globe.svg'), title: 'Embed script', text: 'Go live fast with one script tag.' },
                  { icon: iconImg('blocks-integration.svg'), title: 'Template copy', text: 'Bring the flow directly into Webflow Designer.' },
                ]
              : [
                  { icon: iconImg('Globe.svg'), title: 'Embed-Script', text: 'Mit einem Script-Tag schnell live gehen.' },
                  { icon: iconImg('blocks-integration.svg'), title: 'Template-Copy', text: 'Den Flow direkt in den Webflow Designer bringen.' },
                ],
          ),
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '2. Payments that support the booking flow.' : '2. Zahlungen, die den Buchungsflow tragen.',
          description: isEn
            ? 'Instead of sending users to separate tools, BookFast keeps payment logic close to the booking decision.'
            : 'Statt Nutzer in getrennte Tools zu schicken, haelt BookFast die Zahlungslogik nah an der eigentlichen Buchungsentscheidung.',
          bullets: isEn
            ? [
                { title: 'Stripe Connect built in.', description: 'Handle payouts, deposits, and refunds in one setup.' },
                { title: 'Configurable commercial rules.', description: 'Charge now, reserve with deposit, or adapt to your model.' },
                { title: 'Automatic invoices.', description: 'Operational follow-up starts without manual busywork.' },
              ]
            : [
                { title: 'Stripe Connect integriert.', description: 'Auszahlungen, Anzahlungen und Refunds in einem Setup.' },
                { title: 'Konfigurierbare Geschaeftslogik.', description: 'Jetzt kassieren, mit Anzahlung reservieren oder an dein Modell anpassen.' },
                { title: 'Automatische Rechnungen.', description: 'Die operative Nacharbeit startet ohne manuelle Fummelei.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('Bank-card.svg'), title: 'Deposits', text: 'Secure high-intent bookings before the appointment.' },
                  { icon: iconImg('receipt-euro.svg'), title: 'Invoices', text: 'Generate follow-up documents automatically.' },
                ]
              : [
                  { icon: iconImg('Bank-card.svg'), title: 'Anzahlungen', text: 'Hochintente Buchungen schon vor dem Termin absichern.' },
                  { icon: iconImg('receipt-euro.svg'), title: 'Rechnungen', text: 'Folgedokumente automatisch erzeugen.' },
                ],
          ),
          reverse: true,
        })}
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '3. Automations and integrations without losing control.' : '3. Automationen und Integrationen ohne Kontrollverlust.',
          description: isEn
            ? 'The point is not “more integrations” as decoration. The point is to connect the few things that directly move revenue and operations.'
            : 'Es geht nicht um moeglichst viele Integrationen als Deko. Es geht darum, genau die Verbindungen zu schaffen, die Umsatz und Betrieb direkt bewegen.',
          bullets: isEn
            ? [
                { title: 'Webhooks for custom workflows.', description: 'React to bookings, confirmations, payments, and refunds.' },
                { title: 'Webflow + Stripe cover the core stack today.', description: 'Enough to launch and run production bookings.' },
                { title: 'More integrations are planned.', description: 'Google Calendar, Zapier, and Make stay on the roadmap.' },
              ]
            : [
                { title: 'Webhooks fuer eigene Workflows.', description: 'Auf Buchungen, Bestaetigungen, Zahlungen und Refunds reagieren.' },
                { title: 'Webflow + Stripe decken heute den Kernstack ab.', description: 'Genug, um produktive Buchungen live zu fahren.' },
                { title: 'Weitere Integrationen sind geplant.', description: 'Google Calendar, Zapier und Make bleiben auf der Roadmap.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('blocks-integration.svg'), title: 'Webhooks', text: 'Trigger your own backend, CRM, or ops workflows.' },
                  { icon: iconImg('gear.svg'), title: 'Roadmap', text: 'Expand only where integrations create real leverage.' },
                ]
              : [
                  { icon: iconImg('blocks-integration.svg'), title: 'Webhooks', text: 'Eigenes Backend, CRM oder Ops-Workflows antriggern.' },
                  { icon: iconImg('gear.svg'), title: 'Roadmap', text: 'Nur dort ausbauen, wo Integrationen echten Hebel schaffen.' },
                ],
          ),
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '4. Operate from one system, not five tabs.' : '4. Operativ aus einem System arbeiten, nicht aus fuenf Tabs.',
          description: isEn
            ? 'When bookings increase, the value is not just the widget. The value is that your team can actually run the operation.'
            : 'Sobald Buchungen skalieren, ist nicht nur das Widget wichtig. Entscheidend ist, dass dein Team den Betrieb wirklich sauber steuern kann.',
          bullets: isEn
            ? [
                { title: 'Booking statuses and approval flows.', description: 'Keep edge cases manageable instead of improvising in inboxes.' },
                { title: 'Customer and conversion visibility.', description: 'Know where users drop and what actually closes.' },
                { title: 'Multi-workspace ready.', description: 'Useful once you run several locations, teams, or brands.' },
              ]
            : [
                { title: 'Buchungsstatus und Freigabe-Workflows.', description: 'Sonderfaelle steuerbar halten statt ueber Postfaecher zu improvisieren.' },
                { title: 'Kunden- und Conversion-Sichtbarkeit.', description: 'Verstehen, wo Nutzer abspringen und was wirklich abschliesst.' },
                { title: 'Multi-Workspace-faehig.', description: 'Sinnvoll, sobald mehrere Standorte, Teams oder Marken laufen.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('chart.svg'), title: 'Analytics', text: 'See funnel quality instead of guessing.' },
                  { icon: iconImg('home.svg'), title: 'Multi-workspace', text: 'Manage several setups inside one account.' },
                ]
              : [
                  { icon: iconImg('chart.svg'), title: 'Analytics', text: 'Funnel-Qualitaet sehen statt raten.' },
                  { icon: iconImg('home.svg'), title: 'Multi-Workspace', text: 'Mehrere Setups in einem Account verwalten.' },
                ],
          ),
          reverse: true,
        })}
      </div>
    </section>

    ${createFeatureRelatedSlider({
      currentTitle: isEn ? 'Product' : 'Produkt',
      features: relatedFeatures,
      locale,
      label: isEn ? 'Explore the core capabilities' : 'Die wichtigsten Funktionen dazu',
      headline: isEn
        ? 'Dive into the features that matter most after the product overview.'
        : 'Steig nach dem Produktueberblick in die Funktionen ein, die wirklich zaehlen.',
    })}

    ${createCTASection({
      locale,
      headline: isEn
        ? 'Put bookings, payments, and operations into one flow.'
        : 'Bring Buchungen, Zahlungen und Betrieb in einen einzigen Flow.',
      subheadline: isEn
        ? 'Start with the product story, then go deeper only where your team actually needs detail.'
        : 'Starte mit der Produkterklaerung und geh nur dort tiefer rein, wo dein Team wirklich Details braucht.',
      ...(isEn ? {
        primaryCTA: 'Start live demo',
      } : {}),
    })}

    ${createProductFaqSection({
      label: 'FAQ',
      headline: isEn
        ? 'Questions that usually decide whether the product fits.'
        : 'Die Fragen, die meistens ueber den Produkt-Fit entscheiden.',
      items: pageFaq,
    })}
  `;

  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};
