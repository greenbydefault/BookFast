/**
 * English marketing copy for the landing homepage only (Slice 1).
 */
export const HOME_META = {
  title: 'Webflow booking system',
  description:
    'The Webflow booking system for appointments and online payments. 0% commission, pay before the appointment. Live in 5 minutes.',
};

export const HERO = {
  tagline: 'Booking for Webflow',
  subheadline: 'Enter a workspace name and start the live demo.',
  illustrationAlt: 'Homepage illustration with BookFast demo, bookings, and pay-before-appointment',
  formLabel: 'Workspace name',
  formPlaceholder: 'e.g. Alpine Chalets, Studio Nordlicht…',
  formButtonText: 'Start live demo',
  formHint: 'Try the live demo without an account.',
  trustClaims: ['0% commission', 'Webflow-native', 'Pay before appointment'],
};

export const HOW_IT_WORKS = {
  label: 'Main features',
  headline: 'The booking system for Webflow — the essentials.',
};

export const CTA = {
  headline: 'Bookings on your site — set up in 5 minutes.',
  subheadline: '3-day free trial. No credit card required.\nReady to go in under 5 minutes.',
};

/** Mirrors structure of HOME_FEATURES_STEPS (EN). */
export const HOME_FEATURES_STEPS_EN = [
  {
    title: 'Webflow-native',
    icon: 'globe',
    bullets: [
      { title: 'Add embed script, copy template in Webflow', description: 'Both are required — then the widget is live.' },
      { title: 'No iframe — full design control', description: 'The widget lives natively on your page.' },
      { title: 'Set up in under 5 minutes', description: 'Copy, paste, live.' },
    ],
  },
  {
    title: '0% commission',
    icon: 'bank-card',
    bullets: [
      { title: 'No BookFast commission', description: 'You only pay Stripe transaction fees.' },
      { title: 'Stripe Connect in minutes', description: 'Onboarding from settings.' },
      { title: 'Payout 24 hours after confirmation', description: 'Money lands in your account.' },
    ],
  },
  {
    title: 'Pay before appointment',
    icon: 'money-hand',
    bullets: [
      { title: 'Money in your account before the slot starts', description: 'Fewer no-shows with prepayment.' },
      { title: 'Deposits configurable', description: 'Percentage or fixed per service. Charged at booking — ideal for larger rentals or premium services.' },
      { title: 'Automatic refund on decline', description: 'No manual busywork.' },
    ],
  },
  {
    title: 'Booking management',
    icon: 'list',
    bullets: [
      { title: 'All bookings in one place', description: 'Status, calendar, list view.' },
      { title: 'Confirm or decline', description: 'One click.' },
      { title: 'No scattered requests', description: 'Central overview instead of email chaos.' },
    ],
  },
  {
    title: 'Customer portal',
    icon: 'key',
    bullets: [
      { title: 'Magic link per booking', description: 'No account, no password.' },
      { title: 'View invoice, pay, cancel', description: 'Self-service for your guests.' },
      { title: 'Book without signing up', description: 'Fewer hurdles, more bookings.' },
    ],
  },
];

export const FAQ_EN = [
  {
    question: 'What is BookFast?',
    answer:
      'BookFast is a Webflow booking system with payments. You offer bookings on your own site — no redirects, no iframes, no commission per booking.',
  },
  {
    question: 'How does setup work?',
    answer:
      'Create objects and services in the dashboard, connect Stripe Connect, and embed the widget via script tag and Webflow template. You can go live in under 5 minutes.',
  },
  {
    question: 'What does BookFast cost?',
    answer:
      'From €9.49/month (Basic, 1 workspace). All plans include the same features — only workspace count differs. 0% commission per booking.',
  },
  {
    question: 'Does BookFast only work with Webflow?',
    answer:
      'Yes. BookFast is built for Webflow and currently does not run on other site builders.',
  },
  {
    question: 'Do I need technical skills?',
    answer: 'No. Add the script tag and Webflow template — done. No coding required.',
  },
  {
    question: 'Which payment methods are supported?',
    answer: 'Currently card (Visa, Mastercard, Amex) via Stripe Connect. Klarna and PayPal are planned.',
  },
];
