/**
 * Special features, English copy (remaining after consolidation: workspaces only)
 * Previously: verfuegbarkeit, buffer, zeitfenster, approval, overnight, urlaub, email-templates, kaution
 * These have been absorbed into their parent feature pages.
 */
export const specialEn = {
  workspaces: {
    slug: 'workspaces',
    meta: { title: 'Multi-Workspace', description: 'Multiple locations or brands in one account, each with its own resources, services, and settings.' },
    hero: {
      headline: 'Multiple locations, one login.',
      subheadline: 'Each workspace has its own properties, services, bookings, and settings. Switch in one click, no second account.',
      demoModule: 'workspaces',
      illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
    },
    problem: {
      text: 'Other tools charge per location. Three sites means three subscriptions, and three silos.',
      bullets: ['Workspace per location or brand.', 'Own properties, services, and settings each.', 'One login for everything.'],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to set up workspaces',
    interactiveHowItWorksHeadline: 'Create a workspace and get started.',
    steps: [
      { title: 'Create workspace', icon: 'building-comapny', bullets: [
        { title: 'New workspace with a name', description: 'e.g. second site or separate brand.' },
        { title: 'Fully separated', description: 'Own properties, services, bookings.' },
        { title: 'Great for locations or brands', description: 'One account, multiple environments.' },
      ], reverse: false },
      { title: 'Configure setup', icon: 'gear', bullets: [
        { title: 'Properties, services, pricing per workspace', description: 'Independent of each other.' },
        { title: 'Staff and add-ons per workspace', description: 'Each its own setup.' },
        { title: 'Bookings, customers, and Stripe per workspace', description: 'Each workspace connects its own Stripe account.' },
      ], reverse: true },
      { title: 'Switch', icon: 'arrow-up-down', bullets: [
        { title: 'Switch via dropdown', description: 'The sidebar shows the active workspace.' },
        { title: 'One login for all workspaces', description: 'No extra accounts.' },
        { title: 'Keyboard shortcuts', description: '⌘1 to ⌘9 jumps straight into a workspace.' },
      ], reverse: false },
    ],
    howItWorksPreviewSlices: ['[data-demo-section="ws-create"]', '[data-demo-section="ws-setup"]', '[data-demo-section="ws-switch"]'],
    useCases: [
      { icon: '🏠', title: 'Multiple sites', description: 'Rentals in different regions.', link: '/features' },
      { icon: '💇', title: 'Salon chains', description: 'Run branches from one place.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'integration', 'analytics'],
    tags: ['workspaces', 'multi-location', 'organization'],
    faq: [
      { question: 'Is data separate per workspace?', answer: 'Yes. Each has its own properties, services, bookings, and settings.' },
      { question: 'Can I assign staff to a workspace?', answer: 'Yes. Staff are managed per workspace.' },
      { question: 'Separate Stripe per workspace?', answer: 'Yes. Each workspace runs its own Stripe onboarding, so payments and payouts stay separate per location.' },
      { question: 'Can I invite team members to a workspace?', answer: 'Not yet. A workspace currently belongs to one login.' },
      { question: 'How many workspaces in my plan?', answer: 'Basic: 1, Team: 3, Agency: 10. Features are the same on every plan.' },
      { question: 'Add workspaces later?', answer: 'Yes. Create new ones anytime in the dashboard, up to your plan limit.' },
    ],
  },
};
