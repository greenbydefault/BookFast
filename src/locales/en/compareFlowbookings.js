/**
 * English marketing copy for /en/compare/flowbookings.
 */
export const COMPARE_FLOWBOOKINGS_EN = {
  meta: {
    title: 'BookFast vs FlowBookings: portal, Stripe Connect, no caps',
    description:
      'FlowBookings collects bookings via a form. BookFast adds the portal, Stripe Connect, invoices, rooms, and staff. From €9.49, no booking cap.',
  },
  hero: {
    headline: 'Booking captured, the rest is manual? Not with BookFast.',
    subheadline: 'Portal, payments, invoices, rooms, staff. From €9.49 with no booking cap.',
    illustrationAlt: 'Illustration of the BookFast customer portal after a booking',
    primaryCTA: 'Start live demo',
    secondaryCTA: 'Pricing',
    trustClaims: ['0% commission', 'EU servers', 'No secret key'],
  },
  table: {
    label: 'At a glance',
    headline: 'What is left after the form submits.',
    columns: ['Feature', 'BookFast', 'FlowBookings'],
    rows: [
      { feature: 'Staff pick in the widget', values: [true, 'not documented'] },
      { feature: 'Objects / rooms', values: [true, 'not documented'] },
      { feature: 'Hours, days, nights', values: ['all three', 'duration on the service'] },
      { feature: 'Add-ons', values: [true, 'not documented'] },
      { feature: 'Auto-refund on decline', values: [true, 'No'] },
      { feature: 'Stripe setup', values: ['Connect', 'secret key in the dashboard'] },
      { feature: 'Invoice PDF', values: [true, 'not documented'] },
      { feature: 'Customer portal (magic link)', values: [true, 'not documented'] },
      { feature: 'Funnel per step', values: [true, 'totals only'] },
      { feature: 'Workspaces / multiple sites', values: ['1 / 3 / 10', '1 account per client'] },
      { feature: 'Booking caps', values: ['none', '1,000 / 5,000 / unlimited'] },
      { feature: 'Monthly price', values: ['from €9.49', 'from $24'] },
      { feature: 'EU servers / GDPR', values: [true, 'no claim'] },
    ],
    footnote:
      'Based on public FlowBookings docs and BookFast feature pages. "Not documented" means it is not described in their docs or feature pages. Not an invented gap. Prices exclude Stripe fees. BookFast in EUR, FlowBookings in USD. Caps from their pricing FAQ: over the limit, new bookings stay hidden. BookFast is not affiliated with FlowBookings.',
  },
  sliders: [
    {
      label: 'After the booking',
      headline: 'Customer portal and invoices',
      intro:
        'Magic link plus PIN. View the invoice, pay open amounts, cancel. Every booking has its PDF. No customer account that kills checkout.',
      cards: [
        {
          title: 'One link per booking.',
          subtext: 'PIN in front. No password nobody stores.',
          slug: 'kundenportal',
          illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
        },
        {
          title: 'PDF and payment in the portal.',
          subtext: 'Not a screenshot in WhatsApp.',
          slug: 'rechnungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
        },
        {
          title: 'Cancel without you typing it.',
          subtext: 'Fewer mails that only say please cancel.',
          slug: 'kundenportal',
          illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
        },
        {
          title: 'Every booking has its invoice.',
          subtext: 'PDF with line items, add-ons, your company details. In the portal and the dashboard.',
          slug: 'rechnungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
        },
        {
          title: 'The guest downloads the PDF.',
          subtext: 'The magic link is enough.',
          slug: 'kundenportal',
          illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
        },
        {
          title: 'Same company details as checkout.',
          subtext: 'No second tool for the same job.',
          slug: 'rechnungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
        },
      ],
    },
    {
      label: 'Payments',
      headline: 'Stripe Connect and checkout',
      intro:
        'Stripe Connect. The customer pays at booking. A decline triggers the refund. No secret key in our dashboard.',
      cards: [
        {
          title: 'Connect onboarding.',
          subtext: 'Link the account. No key paste.',
          slug: 'zahlungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
        },
        {
          title: 'Everything in one checkout.',
          subtext: 'Service, cleaning fee, extras, voucher.',
          slug: 'zahlungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
        },
        {
          title: 'Decline refunds automatically.',
          subtext: 'Through Stripe, no manual payback.',
          slug: 'zahlungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
        },
      ],
    },
    {
      label: 'What gets booked',
      headline: 'Objects, services, staff',
      intro:
        'Rooms are their own thing. Three booking types. Guests book the person. Availability is not a bare service name.',
      cards: [
        {
          title: 'One object, several services.',
          subtext: 'Hour and day in the same room.',
          slug: 'objekte',
          illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
        },
        {
          title: 'Cleaning buffer between bookings.',
          subtext: 'Set on the service. Guests do not see the buffer.',
          slug: 'services',
          illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
        },
        {
          title: 'Hours, days, nights.',
          subtext: 'Three types, each with its own logic. Not one duration in minutes for an apartment, a class, and a slot.',
          slug: 'services',
          illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
        },
        {
          title: 'Add-ons on the service.',
          subtext: 'Projector, mat, breakfast. No dummy extra service.',
          slug: 'services',
          illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
        },
        {
          title: 'Preferred staff in the widget.',
          subtext: 'Customers pick the person or "Any". Bookable only on their working days.',
          slug: 'mitarbeiter',
          illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
        },
        {
          title: 'One person, several services.',
          subtext: 'Cut and beard, one profile. Staff-owned calendars are not live.',
          slug: 'mitarbeiter',
          illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
        },
      ],
    },
    {
      label: 'Operations',
      headline: 'Inbox, mail, funnel',
      intro:
        'One inbox, a confirmation email with portal link. You see where the funnel breaks. No third-party cookies.',
      cards: [
        {
          title: 'Pay first, then confirm.',
          subtext: 'The money sits before you approve.',
          slug: 'buchungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
        },
        {
          title: 'Confirmation in your voice.',
          subtext: 'With portal link and PIN. Subject and text in the editor.',
          slug: 'buchungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
        },
        {
          title: 'Tabs by status.',
          subtext: 'One inbox, not five mailboxes.',
          slug: 'buchungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
        },
        {
          title: 'Drop-off per step.',
          subtext: 'Widget loaded, booking started, checkout, payment. Not only total bookings.',
          slug: 'analytics',
          illustration: '/src/svg/illustrations/empty-state-analytics.svg',
        },
        {
          title: 'Browser, OS, device.',
          subtext: 'Traffic that happens on the page.',
          slug: 'analytics',
          illustration: '/src/svg/illustrations/empty-state-analytics.svg',
        },
        {
          title: 'Last month, 3, 6, or 12 months.',
          subtext: 'Pick a range, see the trend.',
          slug: 'analytics',
          illustration: '/src/svg/illustrations/empty-state-analytics.svg',
        },
      ],
    },
    {
      label: 'Agency',
      headline: 'Workspaces and widget',
      intro:
        'Basic 1, Team 3, Agency 10 workspaces. Template copy plus script tag. No iframe. You pay for workspaces, not booking count.',
      cards: [
        {
          title: 'Own objects, services, Stripe per workspace.',
          subtext: 'The client stays separate.',
          slug: 'workspaces',
          illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
        },
        {
          title: 'No second subscription per client.',
          subtext: 'One account, dropdown, next site.',
          slug: 'workspaces',
          illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
        },
        {
          title: 'No cap that hides bookings.',
          subtext: 'On FlowBookings, new bookings over the limit stay hidden until the plan goes up.',
          slug: 'workspaces',
          illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
        },
        {
          title: 'Webflow elements, not a box.',
          subtext: 'The template brings real elements, the script fills them with live data.',
          slug: 'integration',
          illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
        },
        {
          title: 'Styles from the page.',
          subtext: 'No extra theme that overwrites type. You style it in the Designer.',
          slug: 'integration',
          illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is BookFast an alternative to FlowBookings?',
      answer:
        'Yes, if you need operations after the form submits. FlowBookings is the native Webflow form. BookFast is the widget plus portal, payments, objects, staff.',
    },
    {
      question: 'How does the embed differ?',
      answer:
        'FlowBookings uses native Webflow form elements. BookFast is a widget plus template copy.',
    },
    {
      question: 'When is a form enough?',
      answer:
        'If you collect one timed service on a Webflow page, a form is often enough. Once a room, a person, prepayment, or guest self-serve shows up, you need the operations behind it.',
    },
    {
      question: 'Do deposits work?',
      answer:
        'Yes, as a percentage per service. Customers pay that share at booking and the rest later in the customer portal. A decline refunds through Stripe automatically.',
    },
    {
      question: 'Why Connect instead of a secret key?',
      answer:
        'Stripe Connect onboards the account. Secret keys do not belong in a third-party dashboard.',
    },
    {
      question: 'Is there a booking cap?',
      answer:
        'No. Plans differ by workspace count. FlowBookings caps services and bookings. Over the limit, new bookings stay hidden on their side.',
    },
    {
      question: 'Do staff members have their own calendars?',
      answer:
        'No. Staff have bookable weekdays, the hours come from the service or object. Own calendars are not live.',
    },
    {
      question: 'Is BookFast Webflow-only?',
      answer:
        'Built for Webflow. The script needs the markup from the Webflow template. On other platforms you would have to rebuild it yourself.',
    },
  ],
  cta: {
    headline: 'Run a test booking on a Webflow page.',
    subheadline: '3 days. No card. Under 5 minutes if the site is ready.',
  },
};
