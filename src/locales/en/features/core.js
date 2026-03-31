/**
 * Core features — English copy (slugs, icons, tags unchanged from DE)
 */
export const coreEn = {
  buchungen: {
    slug: 'buchungen',
    meta: {
      title: 'Manage Webflow appointment bookings',
      description: 'Centralize Webflow bookings: status, calendar, approve and decline — one dashboard.',
    },
    hero: {
      headline: 'Every booking in one place — not scattered across five inboxes.',
      subheadline: 'Status filters, calendar and list views, approve and decline — one dashboard instead of email, phone, and spreadsheets.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
      trustClaims: ['No credit card required', 'Live in under 5 minutes'],
    },
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
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Review bookings and keep stays under control.', link: '/features' },
      { icon: '🧘', title: 'Yoga studios', description: 'Class spots and waitlists in one place.', link: '/features' },
      { icon: '💇', title: 'Salons', description: 'Daily view per stylist — no spreadsheet chaos.', link: '/features' },
    ],
    sections: [
      {
        id: 'approval',
        title: 'Approval Flow',
        subtitle: 'Pay first, then you approve—full control over every booking.',
        steps: [
          {
            title: 'Customer books',
            icon: 'list',
            bullets: [
              { title: 'All new bookings in the dashboard', description: 'Status "Pending"—you see them instantly.' },
              { title: 'Funds secured before you confirm', description: 'Customer pays in the widget.' },
              { title: 'No missed requests', description: 'Everything in one place.' },
            ],
            reverse: false,
          },
          {
            title: 'You approve or decline',
            icon: 'check',
            bullets: [
              { title: 'One click', description: 'Customer, date, service, amount—all visible.' },
              { title: 'No manual transfers on decline', description: 'Handled automatically in Stripe.' },
              { title: 'Decide on your timeline', description: 'Full control per request.' },
            ],
            reverse: true,
          },
          {
            title: 'What happens next',
            icon: 'key',
            bullets: [
              { title: 'Magic link sent automatically', description: 'On approval—customer opens the portal.' },
              { title: 'Self-serve in the portal', description: 'Booking, invoice, pay balance.' },
              { title: 'Refund without your manual work', description: 'On decline—credit in 5–10 business days.' },
            ],
            reverse: false,
          },
        ],
        faq: [
          { question: 'What happens to payment if I decline?', answer: 'BookFast triggers a full refund in Stripe. Timing depends on the payment method—often 5–10 business days.' },
          { question: 'Can I enable approval per service?', answer: 'Yes. Toggle it per service.' },
          { question: 'How long do I have to confirm?', answer: 'There is no auto-timeout yet—you set the pace. Auto-decline after X days is planned.' },
        ],
      },
      {
        id: 'email-templates',
        title: 'Email Templates',
        subtitle: 'Seven booking emails—in your voice, not ours.',
        steps: [
          {
            title: 'Review templates',
            icon: 'mails',
            bullets: [
              { title: 'All seven types at a glance', description: 'Received, confirmed, declined, cancelled, changed, reminder, refund.' },
              { title: 'Default copy as starting point', description: 'Every type has a baseline.' },
              { title: 'Click a card to open the editor', description: 'Dashboard → Email templates.' },
            ],
            reverse: false,
          },
          {
            title: 'Edit subject and body',
            icon: 'pencil',
            bullets: [
              { title: 'Subject and body per template', description: 'Edit as needed.' },
              { title: 'Placeholders auto-replaced', description: '{{customer_name}}, {{booking_number}}, {{portal_link}}.' },
              { title: 'Placeholder list in the editor', description: 'See everything available.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Which placeholders can I use?', answer: 'e.g. {{customer_name}}, {{booking_number}}, {{service_name}}, {{object_name}}, {{start_date}}, {{end_date}}, {{total_price}}, {{company_name}}, {{portal_link}}, {{pin_code}}. Full list in the editor.' },
          { question: 'Revert to default?', answer: 'Yes. Delete your custom version and the default applies again.' },
          { question: 'Which emails send automatically?', answer: 'Seven types: received, confirmed, declined, cancelled, changed, reminder, refund—each fires on the matching event.' },
        ],
      },
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
      illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
      trustClaims: ['No credit card required', 'Live in under 5 minutes'],
    },
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
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: '30% deposit at booking, balance at check-in.', link: '/features' },
      { icon: '🎨', title: 'Tattoo studios', description: 'Deposit secures the slot — fewer no-shows.', link: '/features' },
      { icon: '🔐', title: 'Escape rooms', description: 'Full payment at booking — nothing to chase on the day.', link: '/features' },
    ],
    sections: [
      {
        id: 'anzahlung',
        title: 'Deposits',
        subtitle: '30% at booking—the rest at the appointment.',
        steps: [
          {
            title: 'Enable deposit',
            icon: 'bank-card',
            bullets: [
              { title: 'Per service in detail settings', description: 'Turn on in service settings.' },
              { title: 'Percent or fixed', description: 'e.g. 30% or €50 deposit.' },
              { title: 'Charged at booking', description: 'Balance at appointment or after completion.' },
            ],
            reverse: false,
          },
          {
            title: 'Charged automatically',
            icon: 'money-hand',
            bullets: [
              { title: 'Stripe charges at booking', description: 'No manual collection.' },
              { title: 'Funds to your account', description: 'No chasing payment on site.' },
              { title: 'Refund on your decline', description: 'Automatic when you reject.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Shown on the invoice?', answer: 'Yes. Deposit and balance are itemized.' },
          { question: 'Percentage deposits?', answer: 'Yes—percent (e.g. 30%) or fixed (e.g. €50), per service.' },
          { question: 'Do deposits reduce no-shows?', answer: 'Often yes. Money down increases commitment and typically lowers no-show rates.' },
        ],
      },
      {
        id: 'gutscheine',
        title: 'Vouchers & Discount Codes',
        subtitle: 'Discount codes that drive bookings—not just clicks.',
        steps: [
          {
            title: 'Create the code',
            icon: 'ticket-percent',
            bullets: [
              { title: 'Percentage or fixed amount per code', description: 'e.g. YOGA25 for 25% off or a €10 discount.' },
              { title: 'Optional usage limit and expiry', description: 'Set it up under "Vouchers" in the dashboard.' },
              { title: 'Active immediately after creation', description: 'No waiting period.' },
            ],
            reverse: false,
          },
          {
            title: 'Distribute & Track',
            icon: 'chart',
            bullets: [
              { title: 'Entered in the widget checkout step', description: 'Customers type the code when booking.' },
              { title: 'Automatic checks for validity and limits', description: 'Must be valid, under the cap, and inside the date range.' },
              { title: 'Redemptions per code in the dashboard', description: 'See how often each code was used.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Can vouchers be limited to specific services?', answer: 'Today vouchers apply across services. Service-specific rules are planned.' },
          { question: 'Does the invoice show the discount?', answer: 'Yes. Redeemed vouchers appear as a discount line on the invoice.' },
          { question: 'Can I cap how many times a code is used?', answer: 'Yes. Set a maximum number of redemptions—e.g. 50 uses total.' },
        ],
      },
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
      illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
    },
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

  analytics: {
    slug: 'analytics',
    meta: {
      title: 'Analytics & insights',
      description: 'Conversion funnel, drop-off, traffic, and payment stats — data most booking tools never show.',
    },
    hero: {
      headline: 'See exactly where customers drop off.',
      subheadline: 'Funnel, drop-off analysis, and traffic — understand why visitors don’t finish booking and where to improve.',
      demoModule: 'analytics',
      illustration: '/src/svg/illustrations/empty-state-analytics.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="an-overview"]',
      '[data-demo-section="an-funnel"]',
      '[data-demo-section="an-optimize"]',
    ],
    problem: {
      text: 'Other tools show booking counts — not why 70% of visitors never complete checkout.',
      bullets: [
        'Funnel: widget loaded → booking started → checkout → payment.',
        'Drop-off shows where people leave.',
        'Traffic: browser, device, country, city.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to use analytics',
    interactiveHowItWorksHeadline: 'From widget view to conversion — all visible.',
    steps: [
      {
        title: 'Embed the widget',
        icon: 'globe',
        bullets: [
          { title: 'Tracking starts with the embed', description: 'Widget views, booking starts, checkouts, and payments.' },
          { title: 'No extra setup', description: 'Tracking begins on first load.' },
          { title: 'GDPR-friendly — no third-party analytics cookies', description: 'Privacy built in.' },
        ],
        reverse: false,
      },
      {
        title: 'Open insights',
        icon: 'chart',
        bullets: [
          { title: 'Funnel shows every step', description: 'Widget loaded → booking started → checkout → payment.' },
          { title: 'Drop-off highlights weak spots', description: 'Where do people abandon?' },
          { title: 'Traffic and payment metrics at a glance', description: 'Browser, device, countries, cities.' },
        ],
        reverse: true,
      },
      {
        title: 'Optimize',
        icon: 'target',
        bullets: [
          { title: 'Fix funnel bottlenecks', description: 'Where do most people drop?' },
          { title: 'Prioritize A/B tests or tweaks', description: 'Data over gut feel.' },
          { title: 'Compare time ranges', description: 'Last month, 3, 6, or 12 months.' },
        ],
        reverse: false,
      },
    ],
    useCases: [
      { icon: '📈', title: 'Improve conversion', description: 'Find where people quit the booking flow.', link: '/features/buchungen' },
      { icon: '💰', title: 'Track revenue', description: 'Monitor revenue, payment success, and refunds.', link: '/features/zahlungen' },
      { icon: '🌍', title: 'Understand your audience', description: 'Browser, device, countries, and cities.', link: '/features/analytics#kunden' },
    ],
    sections: [
      {
        id: 'kunden',
        title: 'Customer Management',
        subtitle: 'Who books, when, how often—without a separate CRM.',
        steps: [
          {
            title: 'Captured automatically',
            icon: 'user',
            bullets: [
              { title: 'Stored on every booking', description: 'Name and email—widget or manually created bookings alike.' },
              { title: 'Returning customers are recognized', description: 'They appear as existing profiles with full history.' },
              { title: 'No manual entry required', description: 'The system keeps records up to date.' },
            ],
            reverse: false,
          },
          {
            title: 'Review history & nurture',
            icon: 'list',
            bullets: [
              { title: 'All bookings listed per customer', description: 'See who booked what and when.' },
              { title: 'Payment and invoice history', description: 'Spot open balances quickly.' },
              { title: 'Internal notes per customer', description: 'Capture preferences or special requests.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Are customer records created automatically?', answer: 'Yes. Each booking saves contact data into your customer database.' },
          { question: 'Do repeat bookings link to the same profile?', answer: 'Yes. BookFast matches returning customers by email and attaches every booking to the same profile.' },
          { question: 'Is this GDPR-friendly?', answer: 'Data is hosted on EU servers. You can delete customer data on request.' },
        ],
      },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'integration'],
    tags: ['analytics', 'tracking', 'reports', 'conversion', 'insights', 'kunden', 'crm'],
    faq: [
      { question: 'Is data shown in real time?', answer: 'Yes — analytics update live in the dashboard.' },
      { question: 'Which date ranges can I pick?', answer: 'Last month, last 3, 6, or 12 months, with comparison to the previous period.' },
      { question: 'Do I need external analytics?', answer: 'No — BookFast has built-in analytics. You can still use Google Analytics or Plausible in parallel.' },
      { question: 'What gets tracked?', answer: 'Widget views, booking starts, checkouts, payments, browser, OS, device, countries, and cities — GDPR-conscious.' },
      { question: 'Is tracking GDPR-compliant?', answer: 'Yes — no external analytics cookies; data is processed on EU infrastructure.' },
    ],
  },

  objekte: {
    slug: 'objekte',
    meta: {
      title: 'Resource management',
      description: 'Rooms, apartments, studios — every bookable resource with capacity, photos, and availability.',
    },
    hero: {
      headline: 'Rooms, apartments, slots — managed in one place.',
      subheadline: 'Each resource with capacity, photos, bookable days, and its own rules. Set up once, stay in control.',
      demoModule: 'objekte',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up resources',
    interactiveHowItWorksHeadline: 'How to configure your bookable resources.',
    problem: {
      text: 'Every resource has its own rules, capacity, and hours. Without a system you lose track — and customers book what isn’t available.',
      bullets: [
        'Set capacity and bookable days per resource.',
        'Booking window: how far ahead can customers book?',
        'Turnover buffer between bookings.',
      ],
    },
    steps: [
      {
        title: 'Create a resource',
        icon: 'package',
        bullets: [
          { title: 'Name, description, and capacity required', description: 'So customers know exactly what they book.' },
          { title: 'Photos drive choice', description: 'Images build trust and cut pre-booking questions.' },
          { title: 'Per-resource settings', description: 'Hours, buffers, overnight — configurable per resource, anytime.' },
        ],
        reverse: false,
      },
      {
        title: 'Set availability',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Bookable days and times per resource', description: 'e.g. Mon–Fri 8–20 — per resource.' },
          { title: 'Booking window, e.g. max 3 months ahead', description: 'You decide how far out bookings open.' },
          { title: 'Buffer between bookings for cleaning or turnover', description: 'Time between slots — for cleaning or setup.' },
        ],
        reverse: true,
      },
      {
        title: 'Assign services',
        icon: 'spark-magic',
        bullets: [
          { title: 'Map services in resource detail', description: 'Attach the right services to each resource.' },
          { title: 'One resource, multiple services', description: 'e.g. hourly and daily rental for the same room.' },
          { title: 'No service → no booking', description: 'At least one service per resource is required.' },
        ],
        reverse: false,
      },
      {
        title: 'Preview in the widget',
        icon: 'spark-magic',
        bullets: [
          { title: 'See the resource as customers do', description: 'Check before you go live.' },
          { title: 'Adjust copy and settings', description: 'Tune until everything is clear.' },
          { title: 'Walk through the flow before launch', description: 'Test end-to-end, then ship.' },
        ],
        reverse: true,
      },
    ],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Each unit as its own resource.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Manage rooms and desks.', link: '/features' },
    ],
    sections: [
      {
        id: 'verfuegbarkeit',
        title: 'Availability & Collision Check',
        subtitle: 'Never get double-booked again.',
        steps: [
          {
            title: 'Customer books',
            icon: 'check',
            bullets: [
              { title: 'Hold on checkout start', description: 'The slot is reserved immediately.' },
              { title: 'Real-time block during booking', description: 'Others cannot take the slot.' },
              { title: 'No race for the same slot', description: 'Double bookings are ruled out from the start.' },
            ],
            reverse: false,
          },
          {
            title: 'No conflict',
            icon: 'lock',
            bullets: [
              { title: 'Reserved slots hidden for others', description: 'Live updates—no lag.' },
              { title: 'Available again right after cancellation', description: 'The slot is released.' },
              { title: 'No slot is assigned twice', description: 'The system guarantees it.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'What if two customers book at the same time?', answer: 'Whoever starts checkout first holds the slot. The second customer sees it as unavailable.' },
          { question: 'How fast does availability update?', answer: 'In real time. As soon as checkout starts, the slot is blocked for others.' },
        ],
      },
      {
        id: 'buffer',
        title: 'Cleaning Buffer',
        subtitle: 'Time between appointments—blocked automatically.',
        steps: [
          {
            title: 'Set the buffer',
            icon: 'clean',
            bullets: [
              { title: 'Buffer duration per service', description: 'e.g. 30 minutes for changeover or 4 hours for cleaning.' },
              { title: 'Minutes or hours', description: 'Set in service settings.' },
              { title: 'Customers only see bookable slots', description: 'Buffer is applied behind the scenes.' },
            ],
            reverse: false,
          },
          {
            title: 'Blocked automatically',
            icon: 'lock',
            bullets: [
              { title: 'Auto block after every booking', description: '10–12 with 30 min buffer: next slot from 12:30.' },
              { title: 'Included in availability math', description: 'Slots adjust automatically.' },
              { title: 'No manual calendar entries', description: 'Everything runs in the background.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Do customers see the buffer?', answer: 'No. They only see bookable slots; the buffer is calculated in the background.' },
          { question: 'Different buffers per service?', answer: 'Yes. Each service has its own buffer settings.' },
        ],
      },
      {
        id: 'zeitfenster',
        title: 'Time Slots & Booking Rules',
        subtitle: 'Bookings only when you allow them.',
        steps: [
          {
            title: 'Set windows',
            icon: 'calender-days-date',
            bullets: [
              { title: 'Bookable hours per day and property', description: 'e.g. Mon–Fri 8–6 or Sat 9–1.' },
              { title: 'Different windows per weekday', description: 'Configure each day.' },
              { title: 'No booking outside those hours', description: 'Customers book only when you allow it.' },
            ],
            reverse: false,
          },
          {
            title: 'Set lead time',
            icon: 'clock-check',
            bullets: [
              { title: 'Max booking horizon (e.g. 3 months)', description: 'How far ahead can they book?' },
              { title: 'Minimum lead time (e.g. 24h)', description: 'No last-minute surprises.' },
              { title: 'Fits your business model', description: 'Fully configurable.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Different hours per weekday?', answer: 'Yes. Configure time windows per day.' },
          { question: 'What is minimum lead time?', answer: 'It blocks too-soon bookings—e.g. at least 24 hours ahead. Slots inside that window are hidden.' },
          { question: 'Per property or per service?', answer: 'Per property. Each has its own bookable days and hours. Services inherit the linked property\'s availability.' },
        ],
      },
      {
        id: 'sperrzeiten',
        title: 'Vacation & Blocked Times',
        subtitle: 'Closed means closed—without hand-maintaining slots.',
        steps: [
          {
            title: 'Choose scope',
            icon: 'funnel',
            bullets: [
              { title: 'Workspace = all bookings off', description: 'Whole business closed.' },
              { title: 'Property = only that asset', description: 'e.g. one unit under renovation.' },
              { title: 'Staff or service', description: 'Only their slots or only that offering blocked.' },
            ],
            reverse: false,
          },
          {
            title: 'Set the period',
            icon: 'calender-days-date',
            bullets: [
              { title: 'Start and end required', description: 'Define the window.' },
              { title: 'Optional description', description: 'e.g. company closure, renovation.' },
              { title: 'Slots blocked immediately', description: 'Customers no longer see them as available.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Vacation for a single property?', answer: 'Yes. Pick scope: whole workspace, property, staff, or service—only what you need is blocked.' },
          { question: 'Affects existing bookings?', answer: 'No. Blocks apply to new bookings only. Existing ones stay.' },
          { question: 'Shown in the widget?', answer: 'No. Blocked days simply are not available. No public reason is displayed.' },
        ],
      },
    ],
    relatedFeatures: ['services', 'workspaces', 'buchungen'],
    tags: ['objekte', 'resources', 'availability', 'capacity', 'locations', 'buffer', 'zeitfenster', 'verfuegbarkeit', 'urlaub'],
    faq: [
      { question: 'How many resources can I create?', answer: 'Resources live inside workspaces. How many workspaces you get depends on your plan.' },
      { question: 'Can I upload images?', answer: 'Yes — photos and descriptions per resource; customers see them in the booking widget.' },
      { question: 'Can I set bookable days and times per resource?', answer: 'Yes — e.g. Mon–Fri 8–20 per resource. Outside those windows, nothing is bookable.' },
      { question: 'What is a turnover buffer?', answer: 'Configurable time between bookings — e.g. 2 hours for cleaning. Customers don’t see it; it’s applied in scheduling.' },
      { question: 'Can I edit resources later?', answer: 'Yes, anytime — name, description, capacity, photos, availability. Existing bookings stay as booked.' },
    ],
  },

  services: {
    slug: 'services',
    meta: {
      title: 'Service configuration',
      description: 'Hourly, daily, or overnight bookings — configure services flexibly.',
    },
    hero: {
      headline: 'Hours, days, nights — one system for every booking type.',
      subheadline: 'Set prices, durations, buffers, and rules per service. From 30-minute slots to week-long stays — BookFast matches how you sell.',
      demoModule: 'services',
      illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
    },
    problem: {
      text: 'Hourly, daily, overnight — each needs different logic. A rigid tool forces your offer to fit the software instead of the other way around.',
      bullets: [
        'Three service types: hourly, daily, overnight.',
        'Custom prices, durations, and time windows.',
        'Link resources, staff, and add-ons per service.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up services',
    interactiveHowItWorksHeadline: 'Create a service, set rules, go live.',
    steps: [
      {
        title: 'Choose service type',
        icon: 'gear',
        bullets: [
          { title: 'Three types: hourly, daily, overnight', description: 'Type drives booking logic and pricing.' },
          { title: 'Type-specific options', description: 'e.g. check-in/out for stays or minimum duration.' },
          { title: 'Customers book in the widget', description: 'What you configure is what they see.' },
        ],
        reverse: false,
      },
      {
        title: 'Set price & duration',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Price per unit and optional minimum', description: '€/hour, €/day, or €/night.' },
          { title: 'Time windows and rules per service', description: 'Availability comes from resource settings.' },
          { title: 'Deposit, approval, buffer per service', description: 'Configure each service independently.' },
        ],
        reverse: true,
      },
      {
        title: 'Assignments',
        icon: 'spark-magic',
        bullets: [
          { title: 'Resources: at least one per service', description: 'No assignment → no booking.' },
          { title: 'Staff: optional, for provider selection', description: 'Customers can pick a person when booking.' },
          { title: 'Add-ons: optional extras per service', description: 'e.g. yoga mat or projector.' },
        ],
        reverse: false,
      },
    ],
    useCases: [
      { icon: '🧘', title: 'Yoga classes', description: 'Hourly sessions with different instructors.', link: '/features' },
      { icon: '🏠', title: 'Vacation rentals', description: 'Overnight with check-in/out.', link: '/features' },
    ],
    sections: [
      {
        id: 'overnight',
        title: 'Overnight Booking',
        subtitle: 'Check-in/out, minimum stay, and cleaning buffer for accommodations.',
        steps: [
          {
            title: 'Create overnight service',
            icon: 'date-cog',
            bullets: [
              { title: 'Choose "Overnight" service type', description: 'Built for accommodations.' },
              { title: 'Check-in/out and minimum stay', description: 'Per service.' },
              { title: 'Price per night, auto calculation', description: 'Assign to a property.' },
            ],
            reverse: false,
          },
          {
            title: 'Check-in/out & night booking',
            icon: 'calender-days-date',
            bullets: [
              { title: 'Configurable check-in and check-out', description: 'e.g. check-in 3:00 PM, out 10:00 AM.' },
              { title: 'Buffer after checkout blocked automatically', description: 'e.g. 4 hours for cleaning.' },
              { title: 'Calendar view of available nights', description: 'Pick arrival and departure.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Different prices per night?', answer: 'Today: one nightly rate per service. Seasonal pricing is planned.' },
          { question: 'Is cleaning buffer after checkout respected?', answer: 'Yes. Configure the buffer blocked automatically after checkout.' },
          { question: 'Minimum stay?', answer: 'Yes—set minimum nights per service, e.g. at least 2 nights.' },
        ],
      },
      {
        id: 'addons',
        title: 'Add-ons & Extras',
        subtitle: 'Extras at checkout—higher revenue per booking.',
        steps: [
          {
            title: 'Create & map add-ons',
            icon: 'package',
            bullets: [
              { title: 'Name and description help customers decide', description: 'Clear copy lifts conversion.' },
              { title: 'Price per unit—quantity allowed', description: 'e.g. yoga mat, projector, cleaning.' },
              { title: 'Edit mapping per add-on in its details', description: 'Which extra goes with which service.' },
            ],
            reverse: false,
          },
          {
            title: 'Grow revenue',
            icon: 'receipt-euro',
            bullets: [
              { title: 'Extras show in the checkout step', description: 'Customers opt in when it makes sense.' },
              { title: 'Surcharges flow into invoice and payment', description: 'Calculated and displayed automatically.' },
              { title: 'No manual work after setup', description: 'Configure once; it runs itself.' },
            ],
            reverse: true,
          },
        ],
        faq: [
          { question: 'Do add-ons appear on the invoice?', answer: 'Yes. Each booked add-on is listed as its own line item.' },
          { question: 'Can one add-on apply to multiple services?', answer: 'Yes. One add-on (e.g. cleaning) can be attached to as many services as you need.' },
          { question: 'Are add-ons included in the total automatically?', answer: 'Yes. Totals include add-ons and are passed through to Stripe.' },
        ],
      },
    ],
    relatedFeatures: ['objekte', 'zahlungen', 'mitarbeiter'],
    tags: ['services', 'pricing', 'duration', 'configuration', 'catalog', 'overnight', 'addons'],
    faq: [
      { question: 'Can services have different prices?', answer: 'Yes — each service has its own price.' },
      { question: 'Can one resource have several services?', answer: 'Yes — e.g. hourly and daily rental on the same room.' },
      { question: 'What’s the difference between hourly, daily, and overnight?', answer: 'Hourly: time slots. Daily: full days. Overnight: check-in/out with night logic and optional minimum stay.' },
      { question: 'Can I attach add-ons to a service?', answer: 'Yes — optional extras customers can add in the flow, e.g. mat or projector.' },
      { question: 'Can I assign staff to a service?', answer: 'Yes — customers can pick a staff member when you enable staff assignment for that service.' },
    ],
  },
};
