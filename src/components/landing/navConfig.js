/**
 * Navigation configuration constants for landing nav and mega menus.
 */

export const FEATURE_ICON_MAP = {
  buchungen: 'calender-days-date',
  objekte: 'package',
  services: 'list',
  zahlungen: 'receipt-euro',
  rechnungen: 'recipe',
  analytics: 'chart',
  integration: 'blocks-integration',
  kundenportal: 'spark-magic',
  mitarbeiter: 'users-2',
  addons: 'blocks-integration',
  gutscheine: 'ticket-percent',
  kunden: 'user-square',
  verfuegbarkeit: 'target',
  buffer: 'clean',
  zeitfenster: 'clock',
  approval: 'check',
  overnight: 'clock',
  workspaces: 'home',
  kaution: 'bank-card',
  urlaub: 'calender-days-date',
  'email-templates': 'mails',
};

export const DISABLED_FEATURE_SLUGS = new Set(['kaution']);

export const MEGA_FEATURE_CATEGORIES = [
  { label: 'Setup & Struktur', slugs: ['objekte', 'services', 'zeitfenster', 'integration', 'workspaces'] },
  { label: 'Buchungen & Verfügbarkeit', slugs: ['buchungen', 'verfuegbarkeit', 'buffer', 'urlaub', 'overnight'] },
  { label: 'Zahlung & Umsatz', slugs: ['zahlungen', 'kaution', 'addons', 'gutscheine', 'rechnungen'] },
  { label: 'Kunden, Team & Insights', slugs: ['kunden', 'kundenportal', 'mitarbeiter', 'email-templates', 'analytics'] },
];

export const MEGA_PRODUCT_ITEMS = [
  {
    label: 'Übersicht',
    href: '/produkt',
    icon: 'target',
    description: 'Buchungssystem für Webflow. Widget, Dashboard, Zahlungen und Rechnungen.',
  },
  {
    label: 'Integrationen',
    href: '/integrationen',
    icon: 'blocks-integration',
    description: 'Webflow, Stripe, Google Calendar und Webhooks – nahtlos verbunden.',
  },
];

export const NAV_ITEMS = [
  { label: 'Produkt', mega: 'product', href: '/produkt' },
  { label: 'Features', mega: 'features', href: '/features' },
  { label: 'Preise', href: '/preise' },
];
