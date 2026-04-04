/**
 * EN copy for platform features (slugs and structure mirror DE data).
 */
export const platformEn = {
  integration: {
    slug: 'integration',
    meta: {
      title: 'Webflow Integration',
      description:
        'Webflow booking widget: embed script or template copy. BookFast sits natively inside your Webflow site—no iframe.',
    },
    hero: {
      headline: 'Your booking widget lives inside Webflow—not in an iframe.',
      subheadline:
        'One script tag or a template import, and the widget is part of your page. Full design control, no redirect, no conversion leak.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
      demoModule: 'integration',
    },
    problem: {
      text: 'Iframes feel foreign; redirects kill conversion. Visitors feel the break—and they bounce.',
      bullets: [
        'Embed script: drop one tag in the body, done.',
        'Template copy: import the widget into the Webflow Designer.',
        'Data attributes instead of an iframe—full styling control.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How to integrate BookFast',
    interactiveHowItWorksHeadline: 'Embed the widget in under five minutes.',
    steps: [
      {
        title: 'Pick your method',
        icon: 'puzzle',
        bullets: [
          {
            title: 'Embed script: one tag, done',
            description: 'Works on any website.',
          },
          {
            title: 'Template copy: built for Webflow',
            description: 'Full control inside the Webflow Designer.',
          },
          {
            title: 'No iframe—true embed',
            description: 'The widget lives inside your page.',
          },
        ],
        reverse: false,
      },
      {
        title: 'Drop in the code',
        icon: 'copy',
        bullets: [
          {
            title: 'Script tag in the body or Webflow custom code',
            description: 'Place it before </body>.',
          },
          {
            title: 'Template copy: import inside the Designer',
            description: 'Bring in the exported template.',
          },
          {
            title: 'Asynchronous loading',
            description: 'Minimal impact on performance.',
          },
        ],
        reverse: true,
      },
      {
        title: 'Tune it',
        icon: 'gear',
        bullets: [
          {
            title: 'Data attributes for workspace, objects, services',
            description: 'e.g. data-bookfast-workspace, data-bookfast-objects.',
          },
          {
            title: 'Inherits styling from your site',
            description: 'Webflow styles flow through automatically.',
          },
          {
            title: 'No separate widget theme required',
            description: 'Native embed keeps everything cohesive.',
          },
        ],
        reverse: false,
      },
    ],
    useCases: [
      {
        icon: '🌐',
        title: 'Webflow designers',
        description: 'Ideal for agencies and freelancers shipping client sites.',
        link: '/produkt',
      },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'workspaces'],
    tags: ['integration', 'website', 'widget', 'embed', 'api'],
    faq: [
      {
        question: 'Is this Webflow-only?',
        answer:
          'No. The embed script works on any site. Template copy is exclusive to Webflow.',
      },
      {
        question: 'Will it slow down my page?',
        answer: 'The script loads asynchronously and is built to keep performance impact small.',
      },
      {
        question: 'Can I style the widget?',
        answer:
          'Template copy gives you full control in the Webflow Designer. The embed script inherits your page styles automatically.',
      },
      {
        question: 'Do I need to code?',
        answer:
          'No. Embed script is copy-paste. Template copy is a Designer import. Neither requires custom engineering.',
      },
      {
        question: 'Can I embed multiple widgets?',
        answer:
          'Yes. Target different objects or services with data attributes—e.g. one widget per room.',
      },
    ],
  },

  kundenportal: {
    slug: 'kundenportal',
    meta: {
      title: 'Customer Portal',
      description:
        'Magic link for invoices, payments, and cancellations. Book and manage without an account—less friction, more conversion.',
    },
    hero: {
      headline: 'No login, no account—customers still book and self-serve.',
      subheadline:
        'One magic link per booking: view details, pay, cancel. Customers handle everything themselves—no passwords, no back-and-forth with you.',
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
      text: 'Every signup is friction. Research shows up to 30% of people abandon flows that force account creation.',
      bullets: [
        'Book and manage instantly—no account required.',
        'Magic link per booking—view, pay, cancel.',
        'Less friction, fewer drop-offs, more completed bookings.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'How the customer portal works',
    interactiveHowItWorksHeadline: 'Book, manage, pay—without an account.',
    steps: [
      {
        title: 'Frictionless booking',
        icon: 'blocks-integration',
        bullets: [
          {
            title: 'Checkout completes inside the widget',
            description: 'No password wall, no forced registration.',
          },
          {
            title: 'Customers never need an account',
            description: 'Less friction means more conversions.',
          },
          {
            title: 'More completions with fewer steps',
            description: 'They book straight through the widget.',
          },
        ],
        reverse: false,
      },
      {
        title: 'Magic link—view and manage everything',
        icon: 'key',
        bullets: [
          {
            title: 'Unique magic link per booking, PIN-protected',
            description: 'Customers open the email, enter the PIN, and they are in.',
          },
          {
            title: 'View invoices, download PDF, pay online',
            description: 'Self-service without pinging your inbox.',
          },
          {
            title: 'Cancel in self-service when you allow it',
            description: 'Fewer “how do I cancel?” tickets for you.',
          },
        ],
        reverse: true,
      },
      {
        title: 'Value for both sides',
        icon: 'check',
        bullets: [
          {
            title: 'Customers stay in control',
            description: 'No extra apps or logins to remember.',
          },
          {
            title: 'Less support, more bookings',
            description: 'No password-reset emails or account administration.',
          },
          {
            title: 'Unique link + PIN per booking',
            description: 'Simple for customers, structured for you.',
          },
        ],
        reverse: false,
      },
    ],
    useCases: [
      {
        icon: '🏠',
        title: 'Vacation rentals',
        description: 'Guests book and pay—invoice and cancellation live in the portal.',
        link: '/features',
      },
      {
        icon: '💇',
        title: 'Salons',
        description: 'Appointments booked online—invoice and changes via the magic link.',
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
        answer: 'No—not to book and not to view the booking. The magic link plus PIN is enough.',
      },
      {
        question: 'Is the link sent automatically?',
        answer:
          'Yes. After a booking is confirmed—and for manual bookings when enabled—BookFast emails the magic link.',
      },
      {
        question: 'Can customers pay from the portal?',
        answer:
          'Yes. Unpaid bookings show a “Pay now” button. Payment runs through Stripe.',
      },
      {
        question: 'How is access secured?',
        answer:
          'Each link is unique to a booking. A PIN adds a second factor—only someone with both can open the portal.',
      },
      {
        question: 'Can customers cancel there?',
        answer:
          'Yes, when you allow self-service cancellations. They cancel via the magic link; payment handling follows your booking status and cancellation rules.',
      },
    ],
  },
};
