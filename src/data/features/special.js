/**
 * Special features: Workspaces (remaining after consolidation)
 * Previously: Verfügbarkeit, Buffer, Zeitfenster, Approval, Overnight, Kaution, Urlaub, Email-Templates
 * These have been absorbed into their parent feature pages (objekte, buchungen, services, zahlungen).
 */
export const special = {
  workspaces: {
    slug: 'workspaces',
    meta: { title: 'Multi-Workspace', description: 'Mehrere Standorte oder Marken in einem Account verwalten – jeder mit eigenen Einstellungen.' },
    hero: {
      headline: 'Mehrere Standorte, ein Login.',
      subheadline: 'Jeder Workspace hat eigene Objekte, Services, Buchungen und Einstellungen. Du wechselst per Klick – ohne separate Accounts oder doppelte Kosten.',
      demoModule: 'workspaces',
      illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
    },
    problem: { text: 'Andere Tools brauchen pro Standort ein eigenes Abo. Bei drei Standorten zahlst du dreimal – und verwaltest alles getrennt.', bullets: ['Workspace pro Standort oder Marke.', 'Eigene Objekte, Services und Einstellungen pro Workspace.', 'Ein Login für alles.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Workspaces ein',
    interactiveHowItWorksHeadline: 'Neuen Workspace anlegen und sofort loslegen.',
    steps: [
      {
        title: 'Workspace erstellen',
        icon: 'building-comapny',
        bullets: [
          { title: 'Neuer Workspace mit Name anlegen', description: 'z.B. für zweiten Standort oder eigene Marke.' },
          { title: 'Jeder Workspace völlig getrennt', description: 'Eigene Objekte, Services, Buchungen.' },
          { title: 'Ideal für Standorte oder Marken', description: 'Ein Account, mehrere Umgebungen.' },
        ],
        reverse: false
      },
      {
        title: 'Setup konfigurieren',
        icon: 'gear',
        bullets: [
          { title: 'Objekte, Services, Preise pro Workspace', description: 'Alles unabhängig voneinander.' },
          { title: 'Mitarbeiter und Add-ons getrennt', description: 'Pro Workspace individuell.' },
          { title: 'Buchungen und Kunden pro Workspace', description: 'Derselbe oder getrennter Stripe-Account.' },
        ],
        reverse: true
      },
      {
        title: 'Wechseln',
        icon: 'arrow-up-down',
        bullets: [
          { title: 'Wechsel per Dropdown oder Liste', description: 'Sidebar zeigt aktuellen Workspace.' },
          { title: 'Ein Login für alle Workspaces', description: 'Keine separaten Accounts nötig.' },
          { title: 'Schneller Kontextwechsel', description: 'Mit einem Klick wechseln.' },
        ],
        reverse: false
      }
    ],
    howItWorksPreviewSlices: [
      '[data-demo-section="ws-create"]',
      '[data-demo-section="ws-setup"]',
      '[data-demo-section="ws-switch"]',
    ],
    useCases: [
      { icon: '🏠', title: 'Mehrere Standorte', description: 'Ferienwohnungen in verschiedenen Regionen.', link: '/features' },
      { icon: '💇', title: 'Salon-Ketten', description: 'Mehrere Filialen zentral verwalten.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'integration', 'analytics'],
    tags: ['workspaces', 'multi-location', 'teams', 'permissions', 'organization'],
    faq: [
      { question: 'Haben Workspaces separate Daten?', answer: 'Ja, jeder Workspace hat eigene Objekte, Services, Buchungen und Einstellungen.' },
      { question: 'Kann ich Mitarbeiter einem Workspace zuordnen?', answer: 'Ja, Mitarbeiter werden pro Workspace verwaltet.' },
      { question: 'Brauche ich pro Workspace ein separates Stripe-Konto?', answer: 'Nein. Du kannst denselben Stripe-Account für alle Workspaces nutzen oder separate Accounts verbinden.' },
      { question: 'Wie viele Workspaces sind in meinem Plan enthalten?', answer: 'Basic: 1, Team: 3, Agentur: 10 Workspaces. Alle Features sind in jedem Plan enthalten.' },
      { question: 'Kann ich Workspaces nachträglich hinzufügen?', answer: 'Ja. Du erstellst neue Workspaces jederzeit im Dashboard – bis zum Limit deines Plans. Ein Upgrade erweitert das Limit sofort.' },
    ],
  },
};
