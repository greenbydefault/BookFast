/**
 * Core features: analytics, objects, services
 */
export const coreResources = {
  analytics: {
    slug: 'analytics',
    meta: {
      title: 'Analytics & Insights',
      description: 'Conversion-Funnel, Drop-off, Traffic nach Browser, OS und Gerät sowie Zahlungs-Statistiken direkt im Buchungs-Dashboard.',
    },
    hero: {
      headline: 'Sieh genau, wo Kunden abspringen.',
      subheadline: 'Conversion-Funnel, Drop-off und Traffic-Daten. Du siehst, warum Besucher nicht buchen und wo du nachbessern kannst.',
      demoModule: 'analytics',
      illustration: '/src/svg/illustrations/empty-state-analytics.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="an-overview"]',
      '[data-demo-section="an-funnel"]',
      '[data-demo-section="an-optimize"]',
    ],
    problem: {
      text: 'Andere Buchungssysteme zeigen dir, wie viele Buchungen reinkamen. Aber nicht, wie viele Besucher den Checkout abbrechen und an welcher Stelle.',
      bullets: [
        'Conversion-Funnel: Widget geladen, Buchung gestartet, Checkout gestartet, Zahlung erfolgreich.',
        'Drop-off pro Schritt zeigt, wo Kunden abspringen.',
        'Traffic-Daten: Browser, Betriebssystem, Gerät.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So nutzt du Analytics',
    interactiveHowItWorksHeadline: 'Vom Widget-Aufruf bis zur Zahlung, alles sichtbar.',
    steps: [
      {
        title: 'Widget einbetten',
        icon: 'globe',
        bullets: [
          { title: 'Tracking startet mit der Widget-Einbindung', description: 'Widget-Aufrufe, Buchungsstarts, Checkouts und Zahlungen.' },
          { title: 'Keine zusätzliche Konfiguration nötig', description: 'Das Tracking läuft ab dem ersten Aufruf.' },
          { title: 'Ohne Google Analytics und Drittanbieter-Cookies', description: 'Die Events landen nur in deinem BookFast-Workspace.' },
        ],
        reverse: false
      },
      {
        title: 'Insights öffnen',
        icon: 'chart',
        bullets: [
          { title: 'Funnel zeigt jeden Schritt', description: 'Widget geladen, Buchung gestartet, Checkout, Zahlung.' },
          { title: 'Drop-off pro Schritt', description: 'Wo springen Kunden ab?' },
          { title: 'Traffic und Zahlungen in eigenen Tabs', description: 'Browser, OS, Gerät. Dazu gestartete und erfolgreiche Zahlungen.' },
        ],
        reverse: true
      },
      {
        title: 'Optimieren',
        icon: 'target',
        bullets: [
          { title: 'Engpässe im Funnel gezielt angehen', description: 'Wo springen die meisten Kunden ab?' },
          { title: 'Änderungen nach Daten priorisieren', description: 'Zum Beispiel weniger Pflichtfelder, wenn viele im Checkout abbrechen.' },
          { title: 'Zeiträume wechseln', description: 'Letzter Monat, 3, 6 oder 12 Monate.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '📈', title: 'Conversion verbessern', description: 'Finde heraus, wo Kunden im Buchungsprozess abspringen.', link: '/features/buchungen' },
      { icon: '💰', title: 'Umsatz verfolgen', description: 'Umsatz, Zahlungserfolgsrate und Erstattungen.', link: '/features/zahlungen' },
      { icon: '📱', title: 'Geräte verstehen', description: 'Siehst du viel Mobile-Traffic, testest du das Widget zuerst auf dem Handy.', link: '/features/analytics' },
    ],
    sections: [],
    relatedFeatures: ['buchungen', 'zahlungen', 'integration'],
    tags: ['analytics', 'tracking', 'reports', 'conversion', 'insights'],
    faq: [
      { question: 'Werden die Daten in Echtzeit angezeigt?', answer: 'Ja, jedes Widget-Event landet sofort in Insights.' },
      { question: 'Welche Zeiträume kann ich auswählen?', answer: 'Letzter Monat, letzte 3, 6 oder 12 Monate.' },
      { question: 'Brauche ich ein externes Analytics-Tool?', answer: 'Nein, BookFast hat eigene Analytics. Google Analytics oder Plausible kannst du parallel weiter nutzen.' },
      { question: 'Welche Daten werden erfasst?', answer: 'Widget-Aufrufe, Buchungsstarts, Checkouts, Zahlungen sowie Browser, Betriebssystem und Gerätetyp. Länder und Städte erfasst BookFast aktuell nicht.' },
      { question: 'Setzt das Tracking Cookies?', answer: 'Keine Cookies von Drittanbietern. Das Widget speichert eine zufällige Session-ID im Browser, damit ein Besuch als ein Funnel zählt. Erwähne das in deiner Datenschutzerklärung.' },
    ],
  },
  objekte: {
    slug: 'objekte',
    meta: { title: 'Objektverwaltung', description: 'Räume, Wohnungen, Studios: alle buchbaren Objekte mit Kapazität, buchbaren Tagen, Zeiten und verknüpften Services.' },
    hero: {
      headline: 'Räume, Wohnungen, Plätze. An einem Ort verwaltet.',
      subheadline: 'Jedes Objekt mit Kapazität, buchbaren Tagen, Zeitfenster und Zeiten pro Wochentag. Einmal einrichten, dann läuft es.',
      demoModule: 'objekte',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="obj-basics"]',
      '[data-demo-section="obj-availability"]',
      '[data-demo-section="obj-services"]',
    ],
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Objekte ein',
    interactiveHowItWorksHeadline: 'So richtest du deine Objekte ein.',
    problem: { text: 'Jedes Objekt hat eigene Zeiten und Kapazitäten. Ohne System verlierst du den Überblick, und Kunden buchen, was gar nicht frei ist.', bullets: ['Kapazität und buchbare Tage pro Objekt.', 'Zeitfenster und eigene Zeiten pro Wochentag.', 'Belegte Zeiten sind im Widget nicht mehr buchbar.'] },
    steps: [
      {
        title: 'Objekt erstellen',
        icon: 'package',
        bullets: [
          { title: 'Name ist Pflicht, der Rest optional', description: 'Name, Beschreibung, Kapazität. Kunden sehen sofort, was sie buchen.' },
          { title: 'Kapazität für Gruppen', description: 'Wie viele Personen passen rein? Zum Beispiel 8 für einen Seminarraum.' },
          { title: 'Als Entwurf speichern', description: 'Erst fertig einrichten, dann veröffentlichen.' },
        ],
        reverse: false
      },
      {
        title: 'Verfügbarkeit setzen',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Buchbare Tage pro Objekt', description: 'Zum Beispiel Montag bis Freitag.' },
          { title: 'Zeitfenster und Zeiten pro Wochentag', description: 'Etwa 10 bis 18 Uhr, samstags nur bis 14 Uhr.' },
          { title: 'Service-Zeiten haben Vorrang', description: 'Hat ein Service eigene Zeiten, gelten die. Sonst die vom Objekt.' },
        ],
        reverse: true
      },
      {
        title: 'Services verknüpfen',
        icon: 'list',
        bullets: [
          { title: 'Verknüpfte Services im Objekt', description: 'Du siehst, welche Services auf dieses Objekt laufen, und entfernst sie mit einem Klick.' },
          { title: 'Ein Objekt kann mehrere Services haben', description: 'Ein Raum mit Stunden- und Tagesmiete, alles möglich.' },
          { title: 'Ohne Service keine Buchung', description: 'Kunden buchen immer einen Service auf einem Objekt.' },
        ],
        reverse: false
      },
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Jede Wohnung als eigenes Objekt.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Räume und Schreibtische verwalten.', link: '/features' },
    ],
    sections: [],
    relatedFeatures: ['services', 'workspaces', 'buchungen'],
    tags: ['objekte', 'resources', 'availability', 'capacity', 'locations', 'zeitfenster', 'verfuegbarkeit'],
    faq: [
      { question: 'Wie viele Objekte kann ich anlegen?', answer: 'So viele du brauchst. Objekte gehören zu einem Workspace.' },
      { question: 'Kann ich Bilder hochladen?', answer: 'Noch nicht. Objekte haben Name, Beschreibung und Kapazität, aber noch kein Bildfeld.' },
      { question: 'Kann ich buchbare Tage und Zeiten pro Objekt setzen?', answer: 'Ja. Buchbare Tage, ein Zeitfenster und auf Wunsch eigene Zeiten pro Wochentag. Hat der Service eigene Zeiten, gelten die vorrangig.' },
      { question: 'Wo stelle ich den Reinigungspuffer ein?', answer: 'Am Objekt und am Service, jeweils Minuten davor und danach. Es gilt der größere Wert. Der Objekt-Puffer ist also die Mindestzeit für die Reinigung, ein Service kann mehr verlangen. Kunden sehen den Puffer nicht.' },
      { question: 'Kann ich Objekte nachträglich bearbeiten?', answer: 'Ja, jederzeit im Objekt-Detail. Änderungen speichern automatisch. Bestehende Buchungen bleiben unverändert.' },
    ],
  },
  services: {
    slug: 'services',
    meta: { title: 'Service-Konfiguration', description: 'Stunden-, Tages- oder Übernachtungsbuchungen mit Preis, Dauer, Zeitfenster, Reinigungsgebühr und Puffer pro Service.' },
    hero: {
      headline: 'Stunden, Tage, Nächte. Ein System für jeden Buchungstyp.',
      subheadline: 'Preis, Dauer, Puffer und Regeln pro Service. Ob Massage-Termin oder Wochenbuchung im Ferienhaus.',
      demoModule: 'services',
      illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
    },
    howItWorksPreviewSlices: [
      '[data-demo-section="svc-type"]',
      '[data-demo-section="svc-pricing"], [data-demo-section="svc-rules"], [data-demo-section="svc-cleaning"]',
      '[data-demo-section="svc-assign"]',
    ],
    problem: { text: 'Stundenmiete, Tagesmiete, Übernachtung: Jeder Typ braucht eigene Logik. Mit einem starren System biegst du dein Angebot zurecht, statt es abzubilden.', bullets: ['Drei Service-Typen: Stunden, Tagesmiete, Übernachtung.', 'Eigene Preise, Dauern und Zeitfenster.', 'Objekte, Mitarbeiter und Add-ons pro Service zuordnen.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Services ein',
    interactiveHowItWorksHeadline: 'Service anlegen, Regeln setzen, loslegen.',
    steps: [
      {
        title: 'Service-Typ wählen',
        icon: 'gear',
        bullets: [
          { title: 'Drei Typen: Stunden, Tagesmiete, Übernachtung', description: 'Der Typ bestimmt Buchungslogik und Preisberechnung.' },
          { title: 'Pro Typ eigene Optionen', description: 'Zum Beispiel Check-in und Check-out samt Mindestnächten bei Übernachtungen.' },
          { title: 'Kunden buchen im Widget', description: 'Wie du den Typ wählst, so buchen deine Kunden.' },
        ],
        reverse: false
      },
      {
        title: 'Preis & Dauer setzen',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Preis pro Stunde, Tag oder Nacht', description: 'Pro Person oder gesamt. Dazu die Dauer bei Stunden-Services.' },
          { title: 'Zeitfenster, Tage und Mindestvorlauf', description: 'Eigene Zeiten pro Wochentag, kapazitätsbasiert buchbar oder feste Startzeiten.' },
          { title: 'Reinigungsgebühr und Puffer', description: 'Gebühr in Euro, Puffer in Minuten davor und danach.' },
        ],
        reverse: true
      },
      {
        title: 'Zuordnungen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Objekte: mindestens eins pro Service', description: 'Ohne Zuordnung keine Buchung möglich.' },
          { title: 'Mitarbeiter: optional', description: 'Der Kunde wählt beim Buchen einen Mitarbeiter oder "Egal".' },
          { title: 'Add-ons: optionale Extras', description: 'Zum Beispiel Yogamatte oder Beamer, zugeordnet im Service-Detail.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🧘', title: 'Yoga-Kurse', description: 'Stündliche Sessions mit verschiedenen Trainern.', link: '/features' },
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Übernachtung mit Check-in, Check-out und Mindestnächten.', link: '/features' },
    ],
    sections: [],
    relatedFeatures: ['objekte', 'zahlungen', 'mitarbeiter'],
    tags: ['services', 'pricing', 'duration', 'configuration', 'catalog', 'overnight', 'addons'],
    faq: [
      { question: 'Kann ich verschiedene Preise pro Service haben?', answer: 'Ja, jeder Service hat seinen eigenen Preis.' },
      { question: 'Kann ein Objekt mehrere Services haben?', answer: 'Ja, einem Raum kannst du z.B. Stundenmiete und Tagesmiete zuordnen.' },
      { question: 'Was ist der Unterschied zwischen stündlich, täglich und Übernachtung?', answer: 'Stunden: Buchung in Slots nach Dauer. Tagesmiete: Buchung ganzer Tage im Zeitfenster. Übernachtung: Check-in und Check-out mit Nachtlogik und optionalen Mindestnächten.' },
      { question: 'Kann ich Add-ons einem Service zuordnen?', answer: 'Ja. Im Service-Detail ordnest du Extras zu, die Kunden im Widget dazubuchen, zum Beispiel Yogamatte oder Beamer.' },
      { question: 'Kann ich Mitarbeiter einem Service zuordnen?', answer: 'Ja. Ordnest du dem Service Mitarbeiter zu, wählt der Kunde im Widget einen davon oder lässt BookFast den nächsten freien nehmen.' },
      { question: 'Kann ich eine Anzahlung pro Service festlegen?', answer: 'Ja. Im Service-Detail schaltest du die Anzahlung ein und legst den Prozentsatz fest. Den Rest zahlt der Kunde im Kundenportal.' },
    ],
  },
};
