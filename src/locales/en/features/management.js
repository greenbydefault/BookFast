/**
 * EN copy for management features (remaining after consolidation: mitarbeiter only)
 * Previously: addons, gutscheine, kunden — absorbed into services, zahlungen, analytics.
 */
export const managementEn = {
  mitarbeiter: {
    slug: 'mitarbeiter',
    meta: { title: 'Staff Management', description: 'Assign staff to services. Customers pick their preferred team member when booking.' },
    hero: {
      headline: 'Customers book the right team member—automatically.',
      subheadline: 'Add staff, map services, done. In the widget, customers see availability per person and book straight away.',
      demoModule: 'mitarbeiter',
      illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
      trustClaims: ['Free trial', 'No credit card required', 'Live in under 5 minutes'],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up staff',
    interactiveHowItWorksHeadline: 'Add your team, map services, done.',
    problem: {
      text: 'Who is available when? Who offers which service? Without clear mapping, scheduling turns into endless phone tag and calendar ping-pong.',
      bullets: ['Staff profiles with name and optional photo.', 'Service mapping: who offers what.', 'Customers see availability per staff member.'],
    },
    steps: [
      {
        title: 'Build your team',
        icon: 'users-2',
        bullets: [
          { title: 'Name and optional photo per staff member', description: 'So customers immediately know who they are booking.' },
          { title: 'Maintain profiles in the dashboard', description: 'Set up once, update anytime—no busywork.' },
          { title: 'Unlimited staff on Pro and Enterprise', description: 'Your team grows—no artificial caps on Pro and Enterprise.' },
        ],
        reverse: false,
      },
      {
        title: 'Map services',
        icon: 'spark-magic',
        bullets: [
          { title: 'Assign services per staff in detail', description: 'In each staff profile, attach the services they actually provide.' },
          { title: 'One person can offer multiple services', description: 'Cut and beard—one stylist, several bookable services.' },
          { title: 'Customers only see staff who match the service', description: 'Relevant choices—no clutter in the widget.' },
        ],
        reverse: true,
      },
      {
        title: 'Customers book',
        icon: 'check',
        bullets: [
          { title: 'Staff selection visible in the widget', description: 'Customers pick a favorite or leave it open.' },
          { title: 'Time slots shown per staff member', description: 'Availability stays in sync—no duplicate calendars.' },
          { title: 'No extra effort once configured', description: 'Set it up once; the rest runs on autopilot.' },
        ],
        reverse: false,
      },
    ],
    useCases: [
      { icon: '💇', title: 'Salons', description: 'Clients book their go-to stylist.', link: '/features' },
      { icon: '🧘', title: 'Yoga studios', description: 'Choose an instructor by class type.', link: '/features' },
      { icon: '🏥', title: 'Physiotherapy', description: 'Book a therapist with the right specialty.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'services', 'objekte'],
    tags: ['mitarbeiter', 'team', 'staffing', 'scheduling', 'roles'],
    faq: [
      { question: 'How many staff members can I add?', answer: 'You manage staff per workspace. How many workspaces you can use depends on your plan.' },
      { question: 'Can each staff member have their own availability?', answer: 'Availability is currently controlled via object settings. Per-staff calendars are on the roadmap.' },
      { question: 'Do customers see staff in the widget?', answer: 'Yes. They see name and optional photo and pick their preferred staff member during booking.' },
      { question: 'Can one staff member offer several services?', answer: 'Yes. You can attach as many services as you need—e.g. cut and beard for a single stylist.' },
      { question: 'Is there a limit on staff?', answer: 'Staff are managed inside your workspaces. Practical limits follow from how many workspaces your plan includes.' },
    ],
  },
};
