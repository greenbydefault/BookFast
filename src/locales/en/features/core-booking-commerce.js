/**
 * Core feature translations: bookings, payments, invoices
 */
export const coreBookingCommerceEn = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Manage Webflow appointment bookings',
      description: 'Centralize Webflow bookings: status tabs, approve and decline, manual bookings, and a magic link to the customer portal in one dashboard.',
    },
    hero: {
      headline: 'Every booking in one place, not scattered across five inboxes.',
      subheadline: 'Status tabs, approve and decline, manual bookings with a magic link. One dashboard instead of email, phone, and spreadsheets.',
      demoModule: 'buchungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
      trustClaims: ['No credit card required', 'Live in under 5 minutes'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="bk-inbox"]',
      '[data-demo-section="bk-magic-link"]',
      '[data-demo-section="bk-review"]',
    ],
    problem: {
      text: 'Scattered bookings cost you hours every week. Requests get lost, status is unclear, and customers wait.',
      bullets: [
        'One list with every booking. New requests show up without reloading.',
        'Tabs by status: Awaiting approval, Open payments, Confirmed, Completed, Cancelled.',
        'Approve or decline in one click. Stripe handles the refund.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How booking management works',
    interactiveHowItWorksHeadline: 'What happens to a booking in BookFast.',
    steps: [
      {
        title: 'Booking comes in',
        icon: 'list',
        bullets: [
          { title: 'Widget and manual bookings', description: 'Bookings arrive via the widget, or you create them in the dashboard.' },
          { title: 'Tabs by status', description: 'Awaiting approval, Open payments, Confirmed, Active, Completed, Declined, No-show, Cancelled.' },
          { title: 'Details in the sidebar', description: 'Customer, resource, service, time, extras, and amount at a glance.' },
        ],
        reverse: false,
      },
      {
        title: 'Manual booking & magic link',
        icon: 'key',
        bullets: [
          { title: 'Create bookings for phone or email requests', description: 'Enter customer, resource, service, staff, time, guests, and extras.' },
          { title: 'Confirmation email with one checkbox', description: 'The email includes the magic link and PIN for the customer portal.' },
          { title: 'Customer pays in the portal', description: 'Once paid, the booking switches to Confirmed.' },
        ],
        reverse: true,
      },
      {
        title: 'Review & confirm',
        icon: 'check',
        bullets: [
          { title: 'Approve or decline', description: 'You review each request and decide.' },
          { title: 'Refund on decline', description: 'For paid bookings, Stripe refunds the full amount.' },
          { title: 'Completed after the appointment', description: 'Once the end time has passed, BookFast shows the booking as completed.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Review bookings and keep stays under control.', link: '/features' },
      { icon: '🧘', title: 'Yoga studios', description: 'Class spots with capacity-based booking in one place.', link: '/features' },
      { icon: '💇', title: 'Salons', description: 'Every booking with its staff member, no spreadsheet chaos.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'analytics', 'kundenportal', 'services'],
    tags: ['buchungen', 'workflow', 'status', 'operations', 'approval', 'email-templates'],
    cta: {
      headline: 'Try booking management for free.',
      primaryCTA: 'Start free',
    },
    faq: [
      { question: 'Can I create bookings manually?', answer: 'Yes. Tick "Send confirmation email" and the customer gets a magic link and PIN. They pay by card in the portal, then the booking is confirmed.' },
      { question: 'What happens when I decline?', answer: 'For paid or partly paid bookings, Stripe refunds everything that came in. BookFast does not send a decline email yet.' },
      { question: 'Is there a calendar view?', answer: 'Not yet. Bookings show as a list with status tabs. When you create a booking manually, a calendar shows which days are free.' },
      { question: 'Can I reschedule a booking?', answer: 'Not yet. Cancel it and create a new one.' },
      { question: 'Are confirmation emails sent automatically?', answer: 'Yes, when you approve a paid widget booking and for manual bookings with the checkbox ticked. The email includes the magic link and PIN.' },
    ],
  },
  zahlungen: {
    slug: 'zahlungen',
    meta: {
      title: 'Webflow online booking, payments',
      description: 'Webflow booking with pay-before-appointment: Stripe Connect, card payment in the widget, refunds on decline.',
    },
    hero: {
      headline: 'Money in your account before the appointment starts.',
      subheadline: 'Stripe Connect live in under 5 minutes. Customers pay by card when they book, payouts run through your Stripe account.',
      demoModule: 'zahlungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
      trustClaims: ['No credit card required', 'Live in under 5 minutes'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="pay-connect"]',
      '[data-demo-section="pay-checkout"]',
      '[data-demo-section="pay-payouts"]',
    ],
    problem: {
      text: 'Without prepayment, slots stay empty and you only notice when nobody shows up. Manual invoices and bank transfers eat your time.',
      bullets: [
        'Stripe Connect onboarding in three steps.',
        'Customers pay at booking, including cleaning fee, extras, and voucher.',
        'Automatic refunds when you decline.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up payments',
    interactiveHowItWorksHeadline: 'Three steps to automated payments.',
    steps: [
      {
        title: 'Connect Stripe',
        icon: 'bank-card',
        bullets: [
          { title: 'Onboarding under Settings → Integration', description: 'Start Stripe Connect there with "Start setup".' },
          { title: 'Create and verify your account', description: 'Stripe asks for your details, BookFast shows the status.' },
          { title: 'Ready after verification', description: 'From then on, card payment in the widget is live.' },
        ],
        reverse: false,
      },
      {
        title: 'Amount at checkout',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Price from the service', description: 'Per hour, day, or night, per person or total.' },
          { title: 'Cleaning fee and extras included', description: 'BookFast adds add-ons and vouchers automatically.' },
          { title: 'In full or as a deposit', description: 'By card in Stripe Checkout, optionally just a percentage per service. The slot is held for 30 minutes meanwhile.' },
        ],
        reverse: true,
      },
      {
        title: 'Get paid',
        icon: 'money-hand',
        bullets: [
          { title: 'Payouts through Stripe', description: 'On the payout schedule of your Stripe account.' },
          { title: 'Automatic refund on decline', description: 'No manual work.' },
          { title: 'Payments in Insights', description: 'Started and successful payments, success rate, and refunds.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Deposit at booking, the rest before arrival in the customer portal.', link: '/features' },
      { icon: '🎨', title: 'Tattoo studios', description: 'A paid booking is a serious booking.', link: '/features' },
      { icon: '🔐', title: 'Escape rooms', description: 'Full payment at booking, nothing to chase on the day.', link: '/features' },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'services'],
    tags: ['zahlungen', 'stripe', 'checkout', 'refund', 'gutscheine'],
    faq: [
      { question: 'Which payment methods are supported?', answer: 'Currently card (Visa, Mastercard, Amex) via Stripe. Klarna and PayPal are planned.' },
      { question: 'Is there a fee per booking?', answer: 'No. BookFast does not take a cut per booking. Only standard Stripe processing fees for your Stripe pricing apply.' },
      { question: 'Can I ask for a deposit?', answer: 'Yes, as a percentage per service. Customers pay only that share by card at booking. They pay the rest later through the link in the customer portal.' },
      { question: 'What about cancellations?', answer: 'If you decline a paid or partly paid booking, Stripe refunds everything that came in automatically. If the customer cancels in the portal, there is no automatic refund. Trigger one in Stripe if needed.' },
      { question: 'When do I receive payouts?', answer: 'Payouts run automatically through Stripe. Timing depends on your Stripe account and payout settings.' },
    ],
  },
  rechnungen: {
    slug: 'rechnungen',
    meta: {
      title: 'Automatic invoices',
      description: 'An invoice PDF for every booking, with line items, add-ons, discount, and your company details. In the dashboard and the customer portal.',
    },
    hero: {
      headline: 'Every booking already has its invoice.',
      subheadline: 'Line items, add-ons, discount, your company details. As a PDF in the dashboard and the customer portal.',
      demoModule: 'rechnungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="inv-created"]',
      '[data-demo-section="inv-portal"]',
      '[data-demo-section="inv-dashboard"]',
    ],
    problem: {
      text: 'Invoicing every booking by hand costs hours. Line items get missed, customers chase you, and you spend weekends on paperwork.',
      bullets: [
        'The invoice builds itself from the booking. You type nothing.',
        'Service, cleaning fee, add-ons, and voucher discount are on it.',
        'Company data, tax ID, and bank details from your settings.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How automatic invoices work',
    interactiveHowItWorksHeadline: 'How an invoice gets made without you writing it.',
    steps: [
      {
        title: 'Built from the booking',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Every booking has its invoice', description: 'Nothing to create or release.' },
          { title: 'Enter company details once', description: 'Under Settings → Account: tax number, VAT ID, bank, managing director.' },
          { title: 'Add-ons and vouchers listed correctly', description: 'With quantity, unit price, discount, and included VAT.' },
        ],
        reverse: false,
      },
      {
        title: 'In the customer portal',
        icon: 'blocks-integration',
        bullets: [
          { title: 'View invoice and download PDF', description: 'Customers open the portal with magic link and PIN.' },
          { title: '"Pay now" for open balances', description: 'By card, no chasing.' },
          { title: 'No invoice emails from you', description: 'Customers grab the PDF themselves.' },
        ],
        reverse: true,
      },
      {
        title: 'In the dashboard & download',
        icon: 'download-file',
        bullets: [
          { title: 'Invoice on the booking detail', description: 'Everything in one place.' },
          { title: 'PDF download', description: 'For your files or your accountant.' },
          { title: 'Number format RE-year-number', description: 'For example RE-2026-0042.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Invoice with nights, cleaning fee, and extras.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Invoice per booked room, with projector and catering as add-ons.', link: '/features' },
      { icon: '🏥', title: 'Therapists', description: 'Per-session invoice with tax details.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'buchungen', 'analytics'],
    tags: ['rechnungen', 'billing', 'tax', 'documents', 'accounting'],
    faq: [
      { question: 'Can I customize invoice design?', answer: 'No. Invoices use the BookFast layout with your company details. Custom templates are planned.' },
      { question: 'Are vouchers reflected on the invoice?', answer: 'Yes, the discount shows as its own line.' },
      { question: 'What format is the invoice?', answer: 'PDF. You download it from the booking detail, your customer from the portal.' },
      { question: 'Does the customer get the invoice by email?', answer: 'Not as an attachment. The confirmation email contains the magic link, and the customer downloads the PDF in the portal.' },
      { question: 'Does it work for small businesses without VAT?', answer: 'Not yet. There is no invoice mode without VAT under German § 19 UStG right now.' },
    ],
  },
};
