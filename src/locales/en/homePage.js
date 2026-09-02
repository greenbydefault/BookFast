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
  headline: 'Try Book {logo} Fast now.<br>No sign-up.',
  logoAlt: 'BookFast plus logo',
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
  headline: 'What BookFast actually does on a Webflow page.',
};

export const CTA = {
  headline: 'Bookings on your site. Set up in 5 minutes.',
  subheadline: '3-day free trial. No credit card required.\nReady to go in under 5 minutes.',
};

/** Mirrors structure of HOME_FEATURES_STEPS (EN). */
export const HOME_FEATURES_STEPS_EN = [
  {
    title: 'Webflow-native',
    icon: 'globe',
    bullets: [
      { title: 'Add embed script, copy template in Webflow', description: 'Both are required. Then the widget is live.' },
      { title: 'No iframe. Full design control', description: 'The widget lives on your page, not in a box.' },
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
      { title: 'Deposits configurable', description: 'Percentage or fixed per service. Charged at booking. Useful for larger rentals or expensive services.' },
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
      'A booking system for Webflow with Stripe. Guests book on your page. No redirect, no iframe, no BookFast commission per booking.',
  },
  {
    question: 'How does setup work?',
    answer:
      'Create objects and services, connect Stripe Connect, add the script tag and the Webflow template. Often under 5 minutes if the site is ready.',
  },
  {
    question: 'What does BookFast cost?',
    answer:
      'From €9.49/month (Basic, 1 workspace). Same features on every plan. You pay for workspace count. 0% commission per booking.',
  },
  {
    question: 'Does BookFast only work with Webflow?',
    answer:
      'Built for Webflow. The embed script also runs on other sites. Template copy is Webflow only.',
  },
  {
    question: 'Do I need technical skills?',
    answer: 'No. Paste a script tag and import the template. No custom code.',
  },
  {
    question: 'Which payment methods are supported?',
    answer: 'Card (Visa, Mastercard, Amex) via Stripe Connect. Klarna and PayPal are planned.',
  },
];
