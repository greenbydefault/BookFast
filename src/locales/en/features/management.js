/**
 * EN copy for management features (remaining after consolidation: mitarbeiter only)
 * Previously: addons, gutscheine, kunden, absorbed into services, zahlungen, analytics.
 */
export const managementEn = {
  mitarbeiter: {
    slug: 'mitarbeiter',
    meta: { title: 'Staff management', description: 'Assign staff to services and set their working days. Customers pick their preferred team member when booking.' },
    hero: {
      headline: 'Customers book the right team member, no back-and-forth.',
      subheadline: 'Add staff, map services, set working days. In the widget, customers choose who they book.',
      demoModule: 'mitarbeiter',
      illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
      trustClaims: ['Free trial', 'No credit card required', 'Live in under 5 minutes'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="staff-profile"]',
      '[data-demo-section="staff-services"]',
      '[data-demo-section="staff-availability"]',
    ],
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up staff',
    interactiveHowItWorksHeadline: 'Add your team, map services, done.',
    problem: {
      text: 'Who works when? Who offers which service? Without clear mapping, scheduling turns into endless phone tag and calendar ping-pong.',
      bullets: ['Staff profiles with name and photo.', 'Service mapping: who offers what.', 'Bookable days per staff member.'],
    },
    steps: [
      {
        title: 'Build your team',
        icon: 'users-2',
        bullets: [
          { title: 'Name per staff member', description: 'Add a photo by URL in the staff detail.' },
          { title: 'Maintain profiles in the dashboard', description: 'Changes save automatically.' },
          { title: 'As many staff as you need', description: 'There is no limit per workspace.' },
        ],
        reverse: false,
      },
      {
        title: 'Map services',
        icon: 'gear',
        bullets: [
          { title: 'Assign services per staff member', description: 'When you create them or later in the staff detail.' },
          { title: 'One person, multiple services', description: 'Cut and beard: one stylist, both services.' },
          { title: 'Customers only see matching staff', description: 'The widget only lists staff who offer the chosen service.' },
        ],
        reverse: true,
      },
      {
        title: 'Customers book',
        icon: 'check',
        bullets: [
          { title: 'Staff selection in the widget', description: 'Customers pick a favorite or "Any".' },
          { title: 'Only on bookable days', description: 'If Jennifer doesn\'t work Mondays, nobody can book her on a Monday.' },
          { title: 'Staff shown on the booking', description: 'The dashboard shows who takes the appointment.' },
        ],
        reverse: false,
      },
    ],
    useCases: [
      { icon: '💇', title: 'Salons', description: 'Clients book their go-to stylist.', link: '/features' },
      { icon: '🧘', title: 'Yoga studios', description: 'Choose an instructor by class type.', link: '/features' },
      { icon: '🏥', title: 'Physiotherapy', description: 'Map therapists to treatment types.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'services', 'objekte'],
    tags: ['mitarbeiter', 'team', 'staffing', 'scheduling', 'roles'],
    faq: [
      { question: 'How many staff members can I add?', answer: 'As many as you need. Staff belong to a workspace.' },
      { question: 'Can each staff member have their own availability?', answer: 'Yes, as bookable weekdays. Add time off under Vacation in the dashboard and those days are blocked for them in the widget. Per-staff hours or breaks don\'t exist yet, hours come from the service or resource.' },
      { question: 'Do customers see staff in the widget?', answer: 'Yes. They see the staff who offer the chosen service and pick one or choose "Any".' },
      { question: 'Can one staff member offer several services?', answer: 'Yes. Attach as many services as you need, for example cut and beard for a single stylist.' },
      { question: 'Does BookFast prevent double bookings per staff member?', answer: 'Availability is checked per resource. If two staff members share a room, the slot is gone after the first booking. A separate conflict check per staff member is still missing.' },
    ],
  },
};
