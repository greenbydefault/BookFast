/**
 * Core feature translations: analytics, objects, services
 */
export const coreResourcesEn = {
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
    sections: [],
    useCases: [
      { icon: '📈', title: 'Improve conversion', description: 'Find where people quit the booking flow.', link: '/features/buchungen' },
      { icon: '💰', title: 'Track revenue', description: 'Monitor revenue, payment success, and refunds.', link: '/features/zahlungen' },
      { icon: '🌍', title: 'Understand your audience', description: 'Browser, device, countries, and cities.', link: '/features/analytics' },
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
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Each unit as its own resource.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Manage rooms and desks.', link: '/features' },
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
    sections: [],
    useCases: [
      { icon: '🧘', title: 'Yoga classes', description: 'Hourly sessions with different instructors.', link: '/features' },
      { icon: '🏠', title: 'Vacation rentals', description: 'Overnight with check-in/out.', link: '/features' },
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
