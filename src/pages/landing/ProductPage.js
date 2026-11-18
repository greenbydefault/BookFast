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
import { setLandingContent } from '../../lib/landingContent.js';

const PRODUCT_FEATURE_SLUGS = ['buchungen', 'objekte', 'services', 'zahlungen', 'rechnungen', 'integration', 'analytics'];

const PRODUCT_OVERVIEW_DE = [
  {
    question: 'Was muss ich auf einen Blick wissen?',
    answer: 'Widget auf deiner Website, Dashboard für dich, Stripe fürs Geld, Rechnungen und Funnel-Zahlen im selben System. Kunden verlassen deine Domain nicht.',
  },
  {
    question: 'Für wen ist BookFast gemacht?',
    answer: 'Für Webflow-Seiten, die Termine, Räume, Kurse, Tagesmieten oder Nächte verkaufen. Nicht für Leute, die Anfragen in Calendly oder einem fremden Portal versenken wollen.',
  },
  {
    question: 'Wie schnell bin ich live?',
    answer: 'Services und Objekte anlegen, Stripe verbinden, Embed-Script plus Template-Copy in Webflow. Wenn die Seite steht, oft unter 5 Minuten.',
  },
  {
    question: 'Wo ist der Unterschied zu Calendly und Co.?',
    answer: 'Kein iFrame, kein Fremdportal, keine Provision pro Buchung. Zahlung vor dem Termin, Rechnung automatisch, im Dashboard siehst du, wo Leute abspringen.',
  },
];

const PRODUCT_OVERVIEW_EN = [
  {
    question: 'What do I need to know first?',
    answer: 'Widget on your site, dashboard for you, Stripe for money, invoices and funnel numbers in the same system. Customers never leave your domain.',
  },
  {
    question: 'Who is BookFast for?',
    answer: 'Webflow sites that sell appointments, rooms, classes, day rentals, or nights. Not for sending demand into Calendly or a third-party portal.',
  },
  {
    question: 'How fast can I go live?',
    answer: 'Create services and objects, connect Stripe, add the embed script and the Webflow template. If the site is ready, often under 5 minutes.',
  },
  {
    question: 'How is this different from Calendly and the rest?',
    answer: 'No iframe, no third-party portal, no commission per booking. Payment before the slot, invoices generated for you, dashboard shows where people drop off.',
  },
];

const PRODUCT_FAQ_DE = [
  {
    question: 'Läuft BookFast nur mit Webflow?',
    answer: 'Gebaut für Webflow. Das Script braucht das Markup aus dem Webflow-Template. Auf anderen Systemen müsstest du es selbst nachbauen.',
  },
  {
    question: 'Wie kommt das Geld rein?',
    answer: 'Stripe Connect. Der Kunde zahlt bei der Buchung per Karte. Ablehnung löst die Rückerstattung aus.',
  },
  {
    question: 'Kann ich Stunden, Tage und Nächte mischen?',
    answer: 'Ja. Pro Service: Typ, Preis, Dauer, Add-ons, Puffer, Zeitfenster, Check-in und Check-out. Bezahlte Buchungen gibst du vor dem Termin frei.',
  },
  {
    question: 'Sehe ich, wo Buchungen hängen bleiben?',
    answer: 'Ja. Status, Funnel, Absprünge, Kundendaten, Zahlungen und Rechnungen liegen im Dashboard.',
  },
  {
    question: 'Was ist mit Google Calendar, Zapier oder Make?',
    answer: 'Noch nicht. Live sind Webflow und Stripe. Webhooks, Google Calendar, Zapier und Make stehen auf der Liste.',
  },
];

const PRODUCT_FAQ_EN = [
  {
    question: 'Is BookFast Webflow-only?',
    answer: 'Built for Webflow. The script needs the markup from the Webflow template. On other platforms you would have to rebuild it yourself.',
  },
  {
    question: 'How do payments work?',
    answer: 'Stripe Connect. Customers pay by card at booking. A decline triggers the refund.',
  },
  {
    question: 'Can I mix hours, days, and nights?',
    answer: 'Yes. Per service: type, price, duration, add-ons, buffers, time windows, check-in and check-out. You approve paid bookings before the slot.',
  },
  {
    question: 'Can I see where bookings stall?',
    answer: 'Yes. Status, funnel, drop-offs, customer data, payments, and invoices live in the dashboard.',
  },
  {
    question: 'What about Google Calendar, Zapier, or Make?',
    answer: 'Not yet. Live today: Webflow and Stripe. Webhooks, Google Calendar, Zapier, and Make are on the list.',
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
    isEn ? 'Booking for Webflow. Product.' : 'Buchungssystem für Webflow. Produkt.',
    isEn
      ? 'Widget, Stripe, invoices, and funnel numbers. Bookings stay on your Webflow site. 0% BookFast commission.'
      : 'Widget, Stripe, Rechnungen und Funnel-Zahlen. Buchungen bleiben auf deiner Webflow-Seite. 0 % BookFast-Provision.',
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
        { icon: iconImg('Globe.svg'), title: 'On your site', text: 'No redirect. No iframe.' },
        { icon: iconImg('Bank-card.svg'), title: 'Paid online', text: 'Card payment and refunds via Stripe.' },
        { icon: iconImg('chart.svg'), title: 'Funnel', text: 'See drop-offs and completed bookings.' },
        { icon: iconImg('receipt-euro.svg'), title: 'Invoices', text: 'Status and PDFs in one dashboard.' },
      ]
    : [
        { icon: iconImg('Globe.svg'), title: 'Auf deiner Website', text: 'Kein Redirect. Kein iFrame.' },
        { icon: iconImg('Bank-card.svg'), title: 'Online bezahlt', text: 'Kartenzahlung und Erstattung über Stripe.' },
        { icon: iconImg('chart.svg'), title: 'Funnel', text: 'Absprünge und Abschlüsse im Dashboard.' },
        { icon: iconImg('receipt-euro.svg'), title: 'Rechnungen', text: 'Status und PDFs an einem Ort.' },
      ];

  setLandingContent(content, `
    ${createFeatureHero({
      headline: isEn
        ? 'Bookings that finish on your own website.'
        : 'Buchungen, die auf deiner Website zu Ende gehen.',
      subheadline: isEn
        ? 'Widget in Webflow, Stripe at checkout, invoices and funnel in the dashboard. Guests stay on your domain.'
        : 'Widget in Webflow, Stripe im Checkout, Rechnungen und Funnel im Dashboard. Gäste bleiben auf deiner Domain.',
      illustrationAlt: isEn
        ? 'BookFast product: bookings, payments, and analytics'
        : 'BookFast Produkt: Buchungen, Zahlungen und Analytics',
      breadcrumb: isEn ? ['Home', 'Product'] : ['Home', 'Produkt'],
      breadcrumbHrefs: isEn ? ['/en'] : ['/'],
      locale,
      demoModuleHTML: createMetricCards(heroDemoCards),
      demoHint: isEn
        ? 'On your site. Paid before the slot. Visible in the dashboard.'
        : 'Auf deiner Seite. Bezahlt vor dem Termin. Sichtbar im Dashboard.',
    })}

    ${createAccordionSection({
      label: isEn ? 'At a glance' : 'Auf einen Blick',
      headline: isEn
        ? 'Four questions before the feature list.'
        : 'Vier Fragen, bevor die Feature-Liste kommt.',
      items: overviewItems,
    })}

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '1. The widget sits in Webflow.' : '1. Das Widget sitzt in Webflow.',
          description: isEn
            ? 'Guests book on your page. Not on a BookFast URL. Not in a box that ignores your type and color.'
            : 'Gäste buchen auf deiner Seite. Nicht auf einer BookFast-URL. Nicht in einer Box, die deine Schrift ignoriert.',
          bullets: isEn
            ? [
                { title: 'Template plus script.', description: 'The template brings the elements into the Designer, the script connects them to your workspace.' },
                { title: 'Embed, not iframe.', description: 'You style the widget like any other element.' },
                { title: 'Webflow is the path.', description: 'On other platforms you would have to rebuild the markup yourself.' },
              ]
            : [
                { title: 'Template plus Script.', description: 'Das Template bringt die Elemente in den Designer, das Script verbindet sie mit deinem Workspace.' },
                { title: 'Embed, kein iFrame.', description: 'Du gestaltest das Widget wie jedes andere Element.' },
                { title: 'Webflow ist der Weg.', description: 'Auf anderen Systemen müsstest du das Markup selbst nachbauen.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('blocks-integration.svg'), title: 'Template copy', text: 'Paste the flow into the Webflow Designer.' },
                  { icon: iconImg('Globe.svg'), title: 'Embed script', text: 'data-site-id connects the page to your workspace.' },
                ]
              : [
                  { icon: iconImg('blocks-integration.svg'), title: 'Template-Copy', text: 'Den Flow in den Webflow Designer holen.' },
                  { icon: iconImg('Globe.svg'), title: 'Embed-Script', text: 'data-site-id verbindet die Seite mit deinem Workspace.' },
                ],
          ),
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '2. Money moves with the booking.' : '2. Geld läuft mit der Buchung.',
          description: isEn
            ? 'Stripe Connect sits in the same flow. No second checkout tab. No chasing invoices the night before.'
            : 'Stripe Connect sitzt im selben Ablauf. Kein zweiter Checkout-Tab. Kein Rechnungen-hinterherlaufen am Vorabend.',
          bullets: isEn
            ? [
                { title: 'Stripe Connect.', description: 'Card payments, payouts, refunds from one setup.' },
                { title: 'One amount, everything in it.', description: 'Service, cleaning fee, extras, and voucher in one checkout.' },
                { title: 'Invoices without extra software.', description: 'A PDF for every booking.' },
              ]
            : [
                { title: 'Stripe Connect.', description: 'Kartenzahlung, Auszahlung, Erstattung aus einem Setup.' },
                { title: 'Ein Betrag, alles drin.', description: 'Service, Reinigungsgebühr, Extras und Gutschein in einem Checkout.' },
                { title: 'Rechnung ohne Extra-Tool.', description: 'Zu jeder Buchung ein PDF.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('Bank-card.svg'), title: 'Prepayment', text: 'In full or as a deposit, before the slot starts.' },
                  { icon: iconImg('receipt-euro.svg'), title: 'Invoices', text: 'Line items, add-ons, your company details.' },
                ]
              : [
                  { icon: iconImg('Bank-card.svg'), title: 'Vorauszahlung', text: 'Voll oder als Anzahlung, bevor der Termin startet.' },
                  { icon: iconImg('receipt-euro.svg'), title: 'Rechnungen', text: 'Positionen, Add-ons, deine Firmendaten.' },
                ],
          ),
          reverse: true,
        })}
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '3. Webflow and Stripe. No integration bazaar.' : '3. Webflow und Stripe. Kein Integrations-Basar.',
          description: isEn
            ? 'Live today: Webflow and Stripe. Not a marketplace of 40 logos. Webhooks, Google Calendar, Zapier, and Make are next.'
            : 'Live sind Webflow und Stripe. Kein Marktplatz mit 40 Logos. Webhooks, Google Calendar, Zapier und Make kommen als Nächstes.',
          bullets: isEn
            ? [
                { title: 'Webflow for the widget.', description: 'Template elements on your page, connected by one script.' },
                { title: 'Stripe for the money.', description: 'Connect, card payment, refund on decline.' },
                { title: 'Calendar sync is not live.', description: 'Do not promise it to a client this week.' },
              ]
            : [
                { title: 'Webflow für das Widget.', description: 'Template-Elemente auf deiner Seite, verbunden über ein Script.' },
                { title: 'Stripe für das Geld.', description: 'Connect, Kartenzahlung, Erstattung bei Ablehnung.' },
                { title: 'Kalender-Sync ist nicht live.', description: 'Versprich das keinem Kunden für diese Woche.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('blocks-integration.svg'), title: 'Webflow + Stripe', text: 'Covers booking and money today.' },
                  { icon: iconImg('gear.svg'), title: 'Roadmap', text: 'Webhooks, calendar, Zapier, Make.' },
                ]
              : [
                  { icon: iconImg('blocks-integration.svg'), title: 'Webflow + Stripe', text: 'Deckt Buchung und Geld heute ab.' },
                  { icon: iconImg('gear.svg'), title: 'Roadmap', text: 'Webhooks, Kalender, Zapier, Make.' },
                ],
          ),
        })}
      </div>
    </section>

    <section class="landing-section landing-section-alt">
      <div class="landing-container">
        ${createFeatureSection({
          title: isEn ? '4. One dashboard, not five tabs.' : '4. Ein Dashboard, nicht fünf Tabs.',
          description: isEn
            ? 'Once volume goes up, the widget is the easy part. The inbox, the refund, the second location, that is the work.'
            : 'Wenn die Menge steigt, ist das Widget der einfache Teil. Posteingang, Refund, zweiter Standort, das ist die Arbeit.',
          bullets: isEn
            ? [
                { title: 'Approve or decline.', description: 'Pending bookings in one list, not in three inboxes.' },
                { title: 'Funnel numbers.', description: 'Widget view, start, checkout, pay. See the leak.' },
                { title: 'More than one workspace.', description: 'Second site, second brand, same login.' },
              ]
            : [
                { title: 'Bestätigen oder ablehnen.', description: 'Offene Buchungen in einer Liste, nicht in drei Postfächern.' },
                { title: 'Funnel-Zahlen.', description: 'Widget, Start, Checkout, Zahlung. Das Leck siehst du.' },
                { title: 'Mehr als ein Workspace.', description: 'Zweite Seite, zweite Marke, ein Login.' },
              ],
          imageHTML: createMetricCards(
            isEn
              ? [
                  { icon: iconImg('chart.svg'), title: 'Analytics', text: 'Funnel counts, not a vanity dashboard.' },
                  { icon: iconImg('home.svg'), title: 'Workspaces', text: 'Several setups in one account.' },
                ]
              : [
                  { icon: iconImg('chart.svg'), title: 'Analytics', text: 'Funnel-Zahlen, kein Vanity-Dashboard.' },
                  { icon: iconImg('home.svg'), title: 'Workspaces', text: 'Mehrere Setups in einem Account.' },
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
      label: isEn ? 'Open a feature page' : 'Eine Feature-Seite öffnen',
      headline: isEn
        ? 'Widget, payments, objects, services, invoices, analytics.'
        : 'Widget, Zahlungen, Objekte, Services, Rechnungen, Analytics.',
    })}

    ${createCTASection({
      locale,
      headline: isEn
        ? 'Put the widget on a page and take a booking.'
        : 'Widget auf die Seite, eine Buchung durchklicken.',
      subheadline: isEn
        ? '3-day trial. No card. Details live on the feature pages if you need them.'
        : '3 Tage testen. Keine Karte. Details stehen auf den Feature-Seiten, wenn du sie brauchst.',
      ...(isEn ? {
        primaryCTA: 'Start live demo',
      } : {}),
    })}

    ${createProductFaqSection({
      label: 'FAQ',
      headline: isEn
        ? 'Questions that usually kill the deal.'
        : 'Fragen, an denen es meistens hängt.',
      items: pageFaq,
    })}
  `);

  initFeatureRelatedSlider(content);
  initFAQAccordion(content);
};
