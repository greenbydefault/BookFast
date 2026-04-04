/**
 * Core feature translations: bookings, payments, invoices
 */
export const coreBookingCommerceEn = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Manage Webflow appointment bookings',
      description: 'Centralize Webflow bookings: status, calendar, approve and decline — one dashboard.',
    },
    hero: {
      headline: 'Every booking in one place — not scattered across five inboxes.',
      subheadline: 'Status filters, calendar and list views, approve and decline — one dashboard instead of email, phone, and spreadsheets.',
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
        'One live overview with real-time status — no missed requests.',
        'Filter by status: Pending, Confirmed, Completed, Declined.',
        'Calendar and list views — pick what fits your workflow.',
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
          { title: 'Widget and manual bookings', description: 'Bookings arrive via the widget or you create them manually.' },
          { title: 'Filter by status', description: 'Pending, Confirmed, Completed, Declined — at a glance.' },
          { title: 'Calendar and list views', description: 'Choose the view that fits your workflow.' },
        ],
        reverse: false,
      },
      {
        title: 'Manual booking & magic link',
        icon: 'key',
        bullets: [
          { title: 'Magic link sent automatically by email', description: 'For manually created bookings, the confirmation email goes out automatically.' },
          { title: 'Customer pays in the portal or sees the invoice', description: 'Self-service without back-and-forth.' },
          { title: 'No manual sending', description: 'Everything runs automatically.' },
        ],
        reverse: true,
      },
      {
        title: 'Review & confirm',
        icon: 'check',
        bullets: [
          { title: 'Approve or decline', description: 'You review each request and decide.' },
          { title: 'Automatic refund on decline', description: 'For paid bookings via Stripe.' },
          { title: 'Auto-complete after the appointment', description: 'The booking is marked completed.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Review bookings and keep stays under control.', link: '/features' },
      { icon: '🧘', title: 'Yoga studios', description: 'Class spots and waitlists in one place.', link: '/features' },
      { icon: '💇', title: 'Salons', description: 'Daily view per stylist — no spreadsheet chaos.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'analytics', 'kundenportal', 'services'],
    tags: ['buchungen', 'workflow', 'status', 'calendar', 'operations', 'approval', 'email-templates'],
    cta: {
      headline: 'Try booking management for free.',
      primaryCTA: 'Start free',
    },
    faq: [
      { question: 'Can I create bookings manually?', answer: 'Yes. In the dashboard you add bookings manually. The confirmation email with a magic link to the customer portal is sent automatically — customers can pay there or view the invoice.' },
      { question: 'What happens when I decline?', answer: 'For paid bookings, BookFast triggers an automatic Stripe refund. The customer is notified by email.' },
      { question: 'Is there a calendar view?', answer: 'Yes — switch between calendar and list view.' },
      { question: 'Can I filter by customer or service?', answer: 'Yes. The booking list filters by customer, service, resource, and date.' },
      { question: 'Are confirmation emails sent automatically?', answer: 'Yes. On confirm and decline, automated emails go to the customer. Further system emails follow where needed, e.g. for refunds.' },
    ],
  },
  zahlungen: {
    slug: 'zahlungen',
    meta: {
      title: 'Webflow online booking — payments',
      description: 'Webflow booking with pay-before-appointment: Stripe Connect, deposits, refunds — 0% platform fee from BookFast.',
    },
    hero: {
      headline: 'Money in your account before the appointment starts.',
      subheadline: 'Stripe Connect live in under 5 minutes. Customers pay at booking; payouts land automatically — with no BookFast commission.',
      demoModule: 'zahlungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
      trustClaims: ['No credit card required', 'Live in under 5 minutes'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="pay-connect"]',
      '[data-demo-section="pay-deposit"]',
      '[data-demo-section="pay-payouts"]',
    ],
    problem: {
      text: 'Without prepayment, roughly one in five no-shows. Manual invoices and bank transfers eat your time.',
      bullets: [
        'Stripe Connect onboarding in three steps.',
        'Configurable deposits (e.g. 30% at booking).',
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
          { title: 'Onboarding link in BookFast settings', description: 'Under Integrations you start Stripe Connect onboarding.' },
          { title: 'Create or connect an account', description: 'Same flow as Stripe directly.' },
          { title: 'Ready right after verification', description: 'BookFast charges no platform fee.' },
        ],
        reverse: false,
      },
      {
        title: 'Configure deposit',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Per service under Services → detail', description: 'Percentage or fixed amount — your choice.' },
          { title: 'Percentage or fixed amount', description: 'e.g. 30% at booking.' },
          { title: 'Calculated automatically at checkout', description: 'Customer pays when they book.' },
        ],
        reverse: true,
      },
      {
        title: 'Get paid',
        icon: 'money-hand',
        bullets: [
          { title: 'Payout ~24h after confirmation', description: 'Funds reach your bank account.' },
          { title: 'Automatic refund on decline', description: 'No manual work.' },
          { title: 'All payments in the dashboard', description: 'Every transaction in one place.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: '30% deposit at booking, balance at check-in.', link: '/features' },
      { icon: '🎨', title: 'Tattoo studios', description: 'Deposit secures the slot — fewer no-shows.', link: '/features' },
      { icon: '🔐', title: 'Escape rooms', description: 'Full payment at booking — nothing to chase on the day.', link: '/features' },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'services'],
    tags: ['zahlungen', 'stripe', 'checkout', 'deposit', 'refund', 'kaution', 'gutscheine'],
    faq: [
      { question: 'Which payment methods are supported?', answer: 'Currently card (Visa, Mastercard, Amex) via Stripe. Klarna and PayPal are planned.' },
      { question: 'Is there a fee per booking?', answer: 'No. BookFast does not take a cut per booking. Only standard Stripe processing fees for your Stripe pricing apply.' },
      { question: 'How do deposits work?', answer: 'You set a percentage per service (e.g. 30%). The customer pays that at booking; the rest is due at the appointment.' },
      { question: 'What about cancellations?', answer: 'If you decline, we refund automatically. Customer cancellations follow your cancellation policy.' },
      { question: 'When do I receive payouts?', answer: 'Payouts run automatically through Stripe. Timing depends on your Stripe account and payout settings.' },
    ],
  },
  rechnungen: {
    slug: 'rechnungen',
    meta: {
      title: 'Automatic invoices',
      description: 'Invoices generated after confirmation or completion — the feature many booking tools skip.',
    },
    hero: {
      headline: 'Invoices that write themselves.',
      subheadline: 'After confirmation or completion, the invoice is created automatically — with every line item, add-on, and your company details. The capability other systems often lack.',
      demoModule: 'rechnungen',
      illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="inv-created"]',
      '[data-demo-section="inv-portal"]',
      '[data-demo-section="inv-dashboard"]',
    ],
    problem: {
      text: 'Invoicing every booking by hand costs hours. Line items get missed, customers chase you — and you spend weekends on paperwork.',
      bullets: [
        'Auto-generation on confirm or completion.',
        'All booking details, add-ons, and discounts listed correctly.',
        'Company data and tax IDs from your settings.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How automatic invoices work',
    interactiveHowItWorksHeadline: 'How an invoice is created — automatically.',
    steps: [
      {
        title: 'Automatically on confirmation',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Invoice created on confirm', description: 'As soon as you confirm or the booking completes.' },
          { title: 'Enter company details once', description: 'Tax ID, bank details — saved in settings.' },
          { title: 'Add-ons and vouchers on the invoice', description: 'Every line appears automatically.' },
        ],
        reverse: false,
      },
      {
        title: 'In the customer portal',
        icon: 'blocks-integration',
        bullets: [
          { title: 'View invoice and download PDF', description: 'Customer gets a magic link by email.' },
          { title: '“Pay now” for open balances', description: 'Pay online — no chasing.' },
          { title: 'No manual email blasts', description: 'Handled automatically.' },
        ],
        reverse: true,
      },
      {
        title: 'In the dashboard & download',
        icon: 'download-file',
        bullets: [
          { title: 'Invoice on the booking detail', description: 'Everything in one place.' },
          { title: 'PDF download', description: 'For your files or to forward.' },
          { title: 'Email to customers when needed', description: 'Send manually if you want.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Invoice with nights, cleaning fee, and extras.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Monthly invoice for booked rooms and hours.', link: '/features' },
      { icon: '🏥', title: 'Therapists', description: 'Per-session invoice with tax details.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'buchungen', 'analytics'],
    tags: ['rechnungen', 'billing', 'tax', 'documents', 'accounting'],
    faq: [
      { question: 'Can I customize invoice design?', answer: 'Invoices include your company data and BookFast’s default layout. Custom templates are planned for Enterprise.' },
      { question: 'Are vouchers reflected on the invoice?', answer: 'Yes — redeemed vouchers and discounts show correctly.' },
      { question: 'What format is the invoice?', answer: 'PDF. Customers can view and download it in the portal.' },
      { question: 'Can I configure invoice numbers?', answer: 'Numbers are generated sequentially. Custom formats are planned.' },
      { question: 'Can customers see the invoice themselves?', answer: 'Yes. Via the customer portal and magic link they can view, download PDF, and pay open amounts.' },
    ],
  },
};
