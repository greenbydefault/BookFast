/**
 * EN copy for platform features (slugs and structure mirror DE data).
 */
export const platformEn = {
  integration: {
    slug: 'integration',
    meta: {
      title: 'Webflow integration',
      description:
        'Webflow booking widget: paste the template into the Designer, add the script. BookFast sits natively inside your Webflow site, no iframe.',
    },
    hero: {
      headline: 'Your booking widget lives in Webflow, not in an iframe.',
      subheadline: 'Paste the booking flow template into the Designer, add one script tag, done. No redirect, no iframe.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
      demoModule: 'integration',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="int-template"]',
      '[data-demo-section="int-embed"]',
      '[data-demo-section="int-domain"]',
    ],
    problem: {
      text: 'Iframes look foreign, redirects cost conversion. Visitors notice the break and leave.',
      bullets: [
        'The booking flow as real Webflow elements on your page.',
        'One script tag connects those elements to your workspace.',
        'You style everything in the Webflow Designer.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to integrate BookFast',
    interactiveHowItWorksHeadline: 'Embed the widget in under 5 minutes.',
    steps: [
      {
        title: 'Paste the template',
        icon: 'copy',
        bullets: [
          { title: '"Copy template" under Settings → Workspace', description: 'The booking flow is now on your clipboard.' },
          { title: 'Paste into the Webflow Designer', description: 'Cmd+V drops every step onto the page as regular Webflow elements.' },
          { title: 'Every step included', description: 'Resource, service, staff, extras, calendar, time slots, voucher, summary.' },
        ],
        reverse: false,
      },
      {
        title: 'Add the script',
        icon: 'blocks-integration',
        bullets: [
          { title: '"Copy code" and paste before </body>', description: 'In Webflow under Site settings → Custom code.' },
          { title: 'One attribute: data-site-id', description: 'It connects the page to your workspace.' },
          { title: 'No iframe', description: 'The script fills the elements on your page with live data.' },
        ],
        reverse: true,
      },
      {
        title: 'Check the connection',
        icon: 'check',
        bullets: [
          { title: 'Linked domain in the dashboard', description: '"Check connection" shows whether the widget is live.' },
          { title: 'The design stays yours', description: 'Fonts, colors, spacing: set them in the Designer.' },
          { title: 'Tracking runs automatically', description: 'From the first load, events land in Insights.' },
        ],
        reverse: false,
      },
    ],
    useCases: [
      {
        icon: '🌐',
        title: 'Webflow designers',
        description: 'For agencies and freelancers shipping client sites.',
        link: '/produkt',
      },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'workspaces'],
    tags: ['integration', 'website', 'widget', 'embed'],
    faq: [
      {
        question: 'Does it only work with Webflow?',
        answer:
          'The template is for Webflow. The script needs the elements with data-bf attributes on the page. On other platforms you would have to rebuild that markup yourself.',
      },
      {
        question: 'Do I need both the template and the script?',
        answer: 'Yes. The template provides the elements, the script connects them to your workspace.',
      },
      {
        question: 'Can I customize the widget design?',
        answer: 'Yes, fully. The template is made of regular Webflow elements you style in the Designer.',
      },
      {
        question: 'Do I need to code?',
        answer: 'No. Paste the template and copy one script tag. Neither needs code.',
      },
      {
        question: 'Which language does the widget use?',
        answer: 'German. An English widget version does not exist yet.',
      },
    ],
  },

  kundenportal: {
    slug: 'kundenportal',
    meta: {
      title: 'Customer portal',
      description:
        'Magic link with PIN for invoices, payments, and cancellations. Book without an account.',
    },
    hero: {
      headline: 'No login, no account. Guests still book and pay.',
      subheadline:
        'One magic link per booking: view, pay, cancel. Customers handle it themselves, no password, no emails to you.',
      demoModule: 'kundenportal',
      illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
      trustClaims: ['No credit card required', 'Live in under 5 minutes'],
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="cp-frictionless"]',
      '[data-demo-section="cp-magic-link"]',
      '[data-demo-section="cp-self-service"]',
    ],
    problem: {
      text: 'A forced account before checkout is an extra page. A lot of guests never finish it.',
      bullets: [
        'Book without an account.',
        'Magic link per booking: view, pay, cancel.',
        'No password, fewer drop-offs.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How the customer portal works',
    interactiveHowItWorksHeadline: 'Book, manage, pay. No account.',
    steps: [
      {
        title: 'Book without friction',
        icon: 'blocks-integration',
        bullets: [
          { title: 'Checkout completes inside the widget', description: 'No password wall, no registration.' },
          { title: 'Only name, email, and address', description: 'That is all the widget asks for.' },
          { title: 'Payment in the same pass', description: 'By card, right after choosing.' },
        ],
        reverse: false,
      },
      {
        title: 'Magic link with PIN',
        icon: 'key',
        bullets: [
          { title: 'Link and 5-digit PIN by email', description: 'Sent with the confirmation. The customer opens the link and enters the PIN.' },
          { title: 'View invoice and download PDF', description: 'Self-service without pinging your inbox.' },
          { title: 'Pay open amounts', description: 'Unpaid bookings show "Pay now".' },
        ],
        reverse: true,
      },
      {
        title: 'Cancel themselves',
        icon: 'check',
        bullets: [
          { title: 'Cancel with email confirmation', description: 'The customer confirms with their email address.' },
          { title: 'You see it in the dashboard right away', description: 'The booking switches to Cancelled.' },
          { title: 'Link valid until 60 days after the appointment', description: 'Then access expires.' },
        ],
        reverse: false,
      },
    ],
    useCases: [
      {
        icon: '🏠',
        title: 'Vacation rentals',
        description: 'Guests download their invoice and cancel in the portal.',
        link: '/features',
      },
      {
        icon: '💇',
        title: 'Salons',
        description: 'Customers pay manually created appointments via the magic link.',
        link: '/features',
      },
    ],
    relatedFeatures: ['rechnungen', 'buchungen', 'zahlungen'],
    tags: ['kundenportal', 'selfservice', 'magic-link', 'status', 'payments'],
    cta: {
      headline: 'Try the customer portal for free.',
      primaryCTA: 'Start for free',
      subheadline: '',
    },
    faq: [
      {
        question: 'Do customers have to register?',
        answer: 'No, not to book and not to view the booking. Magic link plus PIN is enough.',
      },
      {
        question: 'Is the link sent automatically?',
        answer:
          'Yes, when you approve a paid widget booking, and for manual bookings with "Send confirmation email" ticked.',
      },
      {
        question: 'Can customers pay from the portal?',
        answer: 'Yes. Unpaid bookings show "Pay now". Payment runs by card through Stripe.',
      },
      {
        question: 'How is access secured?',
        answer:
          'Each link is unique to a booking and also protected by a 5-digit PIN. Only someone with both can open the portal.',
      },
      {
        question: 'Do customers get their money back when they cancel?',
        answer:
          'Not automatically. The booking is cancelled, and you trigger a refund in Stripe if needed. Custom cancellation rules with deadlines don\'t exist yet.',
      },
      {
        question: 'Can customers reschedule?',
        answer: 'Not yet. They can cancel and book again.',
      },
    ],
  },
};
