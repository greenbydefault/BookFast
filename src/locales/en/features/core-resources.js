/**
 * Core feature translations: analytics, objects, services
 */
export const coreResourcesEn = {
  analytics: {
    slug: 'analytics',
    meta: {
      title: 'Analytics & insights',
      description: 'Conversion funnel, drop-off, traffic by browser, OS, and device, plus payment stats right inside your booking dashboard.',
    },
    hero: {
      headline: 'See exactly where customers drop off.',
      subheadline: 'Funnel, drop-off, and traffic data. See why visitors don\'t finish booking and where to improve.',
      demoModule: 'analytics',
      illustration: '/src/svg/illustrations/empty-state-analytics.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="an-overview"]',
      '[data-demo-section="an-funnel"]',
      '[data-demo-section="an-optimize"]',
    ],
    problem: {
      text: 'Other tools show how many bookings came in. Not how many visitors abandon checkout, or at which step.',
      bullets: [
        'Funnel: widget loaded, booking started, checkout started, payment succeeded.',
        'Drop-off per step shows where people leave.',
        'Traffic: browser, operating system, device.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to use analytics',
    interactiveHowItWorksHeadline: 'From widget view to payment, all visible.',
    steps: [
      {
        title: 'Embed the widget',
        icon: 'globe',
        bullets: [
          { title: 'Tracking starts with the embed', description: 'Widget views, booking starts, checkouts, and payments.' },
          { title: 'No extra setup', description: 'Tracking runs from the first load.' },
          { title: 'No Google Analytics, no third-party cookies', description: 'Events only land in your BookFast workspace.' },
        ],
        reverse: false,
      },
      {
        title: 'Open insights',
        icon: 'chart',
        bullets: [
          { title: 'Funnel shows every step', description: 'Widget loaded, booking started, checkout, payment.' },
          { title: 'Drop-off per step', description: 'Where do people abandon?' },
          { title: 'Traffic and payments in their own tabs', description: 'Browser, OS, device. Plus started and successful payments.' },
        ],
        reverse: true,
      },
      {
        title: 'Optimize',
        icon: 'target',
        bullets: [
          { title: 'Fix funnel bottlenecks', description: 'Where do most people drop?' },
          { title: 'Prioritize changes by data', description: 'For example fewer required fields if many abandon at checkout.' },
          { title: 'Switch time ranges', description: 'Last month, 3, 6, or 12 months.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '📈', title: 'Improve conversion', description: 'Find where people quit the booking flow.', link: '/features/buchungen' },
      { icon: '💰', title: 'Track revenue', description: 'Revenue, payment success rate, and refunds.', link: '/features/zahlungen' },
      { icon: '📱', title: 'Understand devices', description: 'Lots of mobile traffic? Test the widget on a phone first.', link: '/features/analytics' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'integration'],
    tags: ['analytics', 'tracking', 'reports', 'conversion', 'insights'],
    faq: [
      { question: 'Is data shown in real time?', answer: 'Yes, every widget event shows up in Insights right away.' },
      { question: 'Which date ranges can I pick?', answer: 'Last month, last 3, 6, or 12 months.' },
      { question: 'Do I need external analytics?', answer: 'No, BookFast has built-in analytics. You can keep Google Analytics or Plausible running in parallel.' },
      { question: 'What gets tracked?', answer: 'Widget views, booking starts, checkouts, payments, plus browser, operating system, and device type. BookFast does not track countries or cities right now.' },
      { question: 'Does tracking set cookies?', answer: 'No third-party cookies. The widget stores a random session ID in the browser so one visit counts as one funnel. Mention it in your privacy policy.' },
    ],
  },
  objekte: {
    slug: 'objekte',
    meta: {
      title: 'Resource management',
      description: 'Rooms, apartments, studios: every bookable resource with capacity, bookable days, hours, and linked services.',
    },
    hero: {
      headline: 'Rooms, apartments, slots. Managed in one place.',
      subheadline: 'Each resource with capacity, bookable days, a time window, and hours per weekday. Set up once and it runs.',
      demoModule: 'objekte',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="obj-basics"]',
      '[data-demo-section="obj-availability"]',
      '[data-demo-section="obj-services"]',
    ],
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up resources',
    interactiveHowItWorksHeadline: 'How to configure your bookable resources.',
    problem: {
      text: 'Every resource has its own hours and capacity. Without a system you lose track, and customers book what isn\'t free.',
      bullets: [
        'Capacity and bookable days per resource.',
        'Time window and custom hours per weekday.',
        'Booked times can no longer be booked in the widget.',
      ],
    },
    steps: [
      {
        title: 'Create a resource',
        icon: 'package',
        bullets: [
          { title: 'Name is required, the rest optional', description: 'Name, description, capacity. Customers see right away what they book.' },
          { title: 'Capacity for groups', description: 'How many people fit? For example 8 for a seminar room.' },
          { title: 'Save as draft', description: 'Finish setting it up, then publish.' },
        ],
        reverse: false,
      },
      {
        title: 'Set availability',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Bookable days per resource', description: 'For example Monday to Friday.' },
          { title: 'Time window and hours per weekday', description: 'Say 10 to 6, Saturdays only until 2.' },
          { title: 'Service hours take priority', description: 'If a service has its own hours, those apply. Otherwise the resource\'s.' },
        ],
        reverse: true,
      },
      {
        title: 'Link services',
        icon: 'list',
        bullets: [
          { title: 'Linked services on the resource', description: 'See which services run on this resource and remove them in one click.' },
          { title: 'One resource, multiple services', description: 'Hourly and daily rental for the same room.' },
          { title: 'No service, no booking', description: 'Customers always book a service on a resource.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🏠', title: 'Vacation rentals', description: 'Each unit as its own resource.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Manage rooms and desks.', link: '/features' },
    ],
    relatedFeatures: ['services', 'workspaces', 'buchungen'],
    tags: ['objekte', 'resources', 'availability', 'capacity', 'locations', 'zeitfenster', 'verfuegbarkeit'],
    faq: [
      { question: 'How many resources can I create?', answer: 'As many as you need. Resources belong to a workspace.' },
      { question: 'Can I upload images?', answer: 'Not yet. Resources have name, description, and capacity, but no image field yet.' },
      { question: 'Can I set bookable days and times per resource?', answer: 'Yes. Bookable days, a time window, and optional hours per weekday. If the service has its own hours, those take priority.' },
      { question: 'Where do I set the cleaning buffer?', answer: 'On the resource and on the service, in minutes before and after. The larger value wins, so the resource buffer is the minimum cleaning time and a service can ask for more. Customers don\'t see it.' },
      { question: 'Can I edit resources later?', answer: 'Yes, anytime in the resource detail. Changes save automatically. Existing bookings stay as booked.' },
    ],
  },
  services: {
    slug: 'services',
    meta: {
      title: 'Service configuration',
      description: 'Hourly, daily, or overnight bookings with price, duration, time window, cleaning fee, and buffer per service.',
    },
    hero: {
      headline: 'Hours, days, nights. One system for every booking type.',
      subheadline: 'Price, duration, buffer, and rules per service. From a massage slot to a week in a holiday home.',
      demoModule: 'services',
      illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="svc-type"]',
      '[data-demo-section="svc-pricing"], [data-demo-section="svc-rules"], [data-demo-section="svc-cleaning"]',
      '[data-demo-section="svc-assign"]',
    ],
    problem: {
      text: 'Hourly, daily, overnight: each needs different logic. A rigid tool forces your offer to fit the software instead of the other way around.',
      bullets: [
        'Three service types: hourly, daily rental, overnight.',
        'Your own prices, durations, and time windows.',
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
          { title: 'Three types: hourly, daily rental, overnight', description: 'The type drives booking logic and pricing.' },
          { title: 'Type-specific options', description: 'For example check-in, check-out, and minimum nights for stays.' },
          { title: 'Customers book in the widget', description: 'What you configure is what they see.' },
        ],
        reverse: false,
      },
      {
        title: 'Set price & rules',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Price per hour, day, or night', description: 'Per person or total. Plus duration for hourly services.' },
          { title: 'Time window, days, and minimum notice', description: 'Custom hours per weekday, capacity-based booking, or fixed start times.' },
          { title: 'Cleaning fee and buffer', description: 'Fee in euros, buffer in minutes before and after.' },
        ],
        reverse: true,
      },
      {
        title: 'Assignments',
        icon: 'spark-magic',
        bullets: [
          { title: 'Resources: at least one per service', description: 'No resource, no booking.' },
          { title: 'Staff: optional', description: 'Customers pick a staff member or "Any" when booking.' },
          { title: 'Add-ons: optional extras', description: 'For example yoga mat or projector, assigned in the service detail.' },
        ],
        reverse: false,
      },
    ],
    sections: [],
    useCases: [
      { icon: '🧘', title: 'Yoga classes', description: 'Hourly sessions with different instructors.', link: '/features' },
      { icon: '🏠', title: 'Vacation rentals', description: 'Overnight with check-in, check-out, and minimum nights.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'zahlungen', 'mitarbeiter'],
    tags: ['services', 'pricing', 'duration', 'configuration', 'catalog', 'overnight', 'addons'],
    faq: [
      { question: 'Can services have different prices?', answer: 'Yes, each service has its own price.' },
      { question: 'Can one resource have several services?', answer: 'Yes, for example hourly and daily rental on the same room.' },
      { question: 'What\'s the difference between hourly, daily, and overnight?', answer: 'Hourly: slots based on duration. Daily rental: full days within the time window. Overnight: check-in and check-out with night logic and optional minimum nights.' },
      { question: 'Can I attach add-ons to a service?', answer: 'Yes. In the service detail you assign extras customers can add in the widget, for example a mat or projector.' },
      { question: 'Can I assign staff to a service?', answer: 'Yes. Assign staff to the service and customers pick one in the widget, or let BookFast take the next free one.' },
      { question: 'Can I set a deposit per service?', answer: 'Yes. Turn on the deposit in the service detail and set the percentage. Customers pay the rest in the customer portal.' },
    ],
  },
};
