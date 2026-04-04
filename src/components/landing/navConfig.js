/**
 * Navigation configuration constants for the landing pages.
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

export const FEATURE_GROUPS = [
  {
    id: 'bookings-operations',
    label: 'Buchungen & Workspaces',
    labelEn: 'Bookings & Workspaces',
    footerHeadingKey: 'bookingsOperations',
    slugs: ['buchungen', 'workspaces'],
  },
  {
    id: 'offer-resources',
    label: 'Services, Objekte & Team',
    labelEn: 'Services, Objects & Team',
    footerHeadingKey: 'offerResources',
    slugs: ['objekte', 'services', 'mitarbeiter'],
  },
  {
    id: 'payments-invoices',
    label: 'Zahlungen & Rechnungen',
    labelEn: 'Payments & Invoices',
    footerHeadingKey: 'paymentsInvoices',
    slugs: ['zahlungen', 'rechnungen', 'kundenportal'],
  },
  {
    id: 'website-growth',
    label: 'Integration & Analytics',
    labelEn: 'Integration & Analytics',
    footerHeadingKey: 'websiteGrowth',
    slugs: ['integration', 'analytics'],
  },
];

export const NAV_ITEMS = [
  { label: 'Produkt', labelKey: 'product', href: '/produkt' },
  { label: 'Features', labelKey: 'features', href: '/features' },
  { label: 'Preise', labelKey: 'pricing', href: '/preise' },
];
