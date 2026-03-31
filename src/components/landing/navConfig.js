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
  workspaces: 'home',
};

export const DISABLED_FEATURE_SLUGS = new Set();

export const MEGA_FEATURE_CATEGORIES = [
  { label: 'Buchung & Verwaltung', slugs: ['buchungen', 'objekte', 'services', 'mitarbeiter', 'workspaces'] },
  { label: 'Zahlung & Plattform', slugs: ['zahlungen', 'rechnungen', 'analytics', 'integration', 'kundenportal'] },
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
