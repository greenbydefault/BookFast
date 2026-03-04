/**
 * Docs data registry.
 * Source of truth for docs hub + article pages.
 */

export const docsArticles = {
  'tracking-embed-js': {
    slug: 'tracking-embed-js',
    title: 'Tracking im embed.js',
    description: 'Wie BookFast Events im Widget erfasst, warum das cookielos funktioniert und welchen Einfluss das auf Performance und Script-Groesse hat.',
    category: 'Webflow-Integration',
    updatedAt: 'Februar 2026',
    readTime: '7 Min.',
    intro: 'Dieser Leitartikel beschreibt den aktuellen Tracking-Flow im Widget: welche Events wir senden, wie Session-Zuordnung ohne Cookies funktioniert und was sich aendert, wenn Tracking deaktiviert ist.',
    toc: [
      { id: 'was-tracken-wir', label: 'Was tracken wir?' },
      { id: 'wie-funktioniert-es', label: 'Wie funktioniert das Tracking technisch?' },
      { id: 'warum-cookielos', label: 'Warum ist das cookielos?' },
      { id: 'vorteile', label: 'Welche Vorteile hat das?' },
      { id: 'deaktivieren', label: 'Tracking deaktivieren: Auswirkungen' },
      { id: 'performance', label: 'Performance und Script-Impact' },
    ],
    sections: [
      {
        id: 'was-tracken-wir',
        title: 'Was tracken wir?',
        paragraphs: [
          'Das Widget nutzt ein event-basiertes Funnel-Tracking. So wird sichtbar, wie Nutzer vom ersten Laden bis zum Abschluss durch den Buchungsprozess gehen.',
          'Aus dem aktuellen `embed.js` werden unter anderem folgende Events gesendet: `widget_view`, `widget_start`, `step_3`, `step_4`, `checkout_started`, `booking_completed`, `payment_completed` und `checkout_cancelled`.'
        ],
        bullets: [
          'Funnel-Schritte: Einstieg, Auswahl, Termin, Checkout, Abschluss.',
          'Fach-Metadaten pro Event: z. B. Objektname, Servicetyp, Datum, Preis und Waehrung.',
          'Technische Metadaten: Browser, Device und Betriebssystem aus dem User-Agent.'
        ]
      },
      {
        id: 'wie-funktioniert-es',
        title: 'Wie funktioniert das Tracking technisch?',
        paragraphs: [
          'Die Funktionen `track()` und `trackWithSid()` senden Events per `fetch` an die RPC `track_event`. Die Requests laufen fire-and-forget und werden nicht awaited.',
          'Fuer Redirect-Flows (z. B. Stripe Return) wird die Session-ID ueber `bf_sid` in der URL weitergegeben, damit die Session nach Rueckkehr korrekt fortgesetzt werden kann.'
        ],
        bullets: [
          'Transport: POST auf `/rest/v1/rpc/track_event`.',
          'Option `keepalive: true`, damit Events auch bei Navigation noch rausgehen.',
          'Session-Zuordnung ueber `p_session_id`.',
          'Speicherung serverseitig in `analytics_events`.'
        ]
      },
      {
        id: 'warum-cookielos',
        title: 'Warum ist das cookielos?',
        paragraphs: [
          'Die Session-ID wird in `localStorage` unter `bf_session_<siteId>` gespeichert. Es werden keine Tracking-Cookies gesetzt und es ist kein Third-Party-Cookie-Mechanismus noetig.',
          'Falls `localStorage` nicht verfuegbar ist, generiert das Script trotzdem eine UUID fuer die laufende Session. Dadurch bleibt das Widget robust, auch in restriktiven Browser-Kontexten.'
        ],
        bullets: [
          'Keine Cookie-ID als technische Voraussetzung.',
          'Keine Third-Party-Tracker im Widget-Trackingpfad.',
          'Site-spezifische Session-Key-Struktur fuer klare Trennung mehrerer Sites.'
        ]
      },
      {
        id: 'vorteile',
        title: 'Welche Vorteile hat das?',
        paragraphs: [
          'Das Tracking liefert verwertbare Funnel- und Umsatzsignale ohne blockierenden Client-Overhead. Damit lassen sich Drop-offs und Conversion-Hebel sauber identifizieren.',
          'Gerade im Betrieb mehrerer Sites hilft die einheitliche Event-Struktur, Reports vergleichbar zu halten.'
        ],
        bullets: [
          'Funnel-Analyse pro Buchungsschritt.',
          'Kontextreiche Auswertung pro Service/Objekt/Preis.',
          'Einfache Korrelation mit Checkout- und Payment-Events.',
          'Asynchrones Senden ohne UI-Blocker.'
        ]
      },
      {
        id: 'deaktivieren',
        title: 'Tracking deaktivieren: Auswirkungen',
        paragraphs: [
          'Wenn Tracking deaktiviert ist, entfallen die Event-Requests an `track_event`. Das reduziert Beobachtbarkeit im Funnel, aber auch Netzwerkaktivitaet durch Analytics-Calls.',
          'Die Deaktivierbarkeit ist vor allem dort sinnvoll, wo nur Kernfunktionalitaet benoetigt wird oder Reporting extern stattfindet.'
        ],
        bullets: [
          'Vorteil: weniger Analytics-Traffic und geringerer externer Request-Anteil.',
          'Trade-off: keine detaillierte Drop-off- und Conversion-Analyse im BookFast-Eventmodell.',
          'Der eigentliche Buchungsflow bleibt funktional erhalten, weil Tracking fire-and-forget entkoppelt ist.'
        ]
      },
      {
        id: 'performance',
        title: 'Performance und Script-Impact (mit vs. ohne Tracking)',
        paragraphs: [
          'Im aktuellen `embed.js` ist der Tracking-Anteil klein (grob im niedrigen einstelligen Prozentbereich der Scriptzeilen). Die Funktionen sind schlank und nicht blockierend.',
          'Der Hauptunterschied entsteht im Netzwerk: mit Tracking werden pro Funnel zusaetzliche Event-POSTs gesendet; ohne Tracking entfallen diese Requests komplett.'
        ],
        bullets: [
          'Mit Tracking: zusaetzliche Analytics-Requests pro Session/Funnel.',
          'Ohne Tracking: weniger Requests, dafuer kein Event-Funnel fuer Insights.',
          'Client-seitig kein `await` auf Tracking-Calls, dadurch kein direkter UI-Wartepfad.'
        ]
      }
    ],
    faq: [
      {
        question: 'Werden im Widget Tracking-Cookies gesetzt?',
        answer: 'Nein. Der aktuelle Flow arbeitet mit einer Session-ID im localStorage und setzt keine Tracking-Cookies.'
      },
      {
        question: 'Beeinflusst Tracking die Ladezeit stark?',
        answer: 'In der Praxis nur gering. Die Calls sind asynchron und werden im Widget nicht awaited; messbarer Unterschied entsteht vor allem durch zusaetzliche Netzwerk-Requests.'
      },
      {
        question: 'Was fehlt mir, wenn Tracking deaktiviert ist?',
        answer: 'Du verlierst Event-basierte Funnel- und Conversion-Insights aus dem BookFast-Tracking, der Buchungsprozess selbst bleibt jedoch erhalten.'
      }
    ]
  }
};

export const docsHubCategories = [
  {
    icon: 'Spark',
    title: 'Schnellstart',
    articles: [
      { title: 'Account erstellen', description: 'Registriere dich in unter 2 Minuten.', href: '/docs' },
      { title: 'Erstes Objekt anlegen', description: 'Erstelle dein erstes buchbares Objekt.', href: '/docs' },
      { title: 'Widget einbetten', description: 'Embed-Script oder Template-Copy in deine Website.', href: '/docs/tracking-embed-js' },
    ]
  },
  {
    icon: 'Globe',
    title: 'Webflow-Integration',
    articles: [
      { title: 'Tracking im embed.js', description: 'Was wir tracken, wie es cookielos laeuft und welche Auswirkungen es hat.', href: '/docs/tracking-embed-js' },
      { title: 'Template-Copy', description: 'Booking-Flow direkt in den Designer importieren.', href: '/docs' },
      { title: 'Datenattribute', description: 'Custom Attributes fuer die Widget-Konfiguration.', href: '/docs' },
    ]
  },
  {
    icon: 'Card',
    title: 'Zahlungen',
    articles: [
      { title: 'Stripe Connect einrichten', description: 'Onboarding in 3 Schritten.', href: '/docs' },
      { title: 'Anzahlung konfigurieren', description: 'Prozentualen Deposit festlegen.', href: '/docs' },
      { title: 'Rueckerstattungen', description: 'Automatische und manuelle Refunds.', href: '/docs' },
    ]
  },
  {
    icon: 'Gear',
    title: 'Konfiguration',
    articles: [
      { title: 'Service-Typen', description: 'Stuendlich, taeglich, Uebernachtung.', href: '/docs' },
      { title: 'Mitarbeiter verwalten', description: 'Team anlegen und Services zuordnen.', href: '/docs' },
      { title: 'Add-ons und Gutscheine', description: 'Extras und Rabattcodes einrichten.', href: '/docs' },
    ]
  },
];

export const docsPopularArticles = [
  {
    question: 'Wie funktioniert das Tracking im embed.js?',
    description: 'Event-Funnel, cookielose Session-ID und Auswirkungen auf Performance.',
    href: '/docs/tracking-embed-js',
  },
  {
    question: 'Wie bette ich das Widget in Webflow ein?',
    description: 'Embed-Script oder Template-Copy Schritt fuer Schritt.',
    href: '/docs',
  },
  {
    question: 'Wie richte ich Stripe Connect ein?',
    description: 'Onboarding in 3 Schritten, in unter 5 Minuten.',
    href: '/docs',
  },
  {
    question: 'Wie erstelle ich einen Overnight-Service?',
    description: 'Uebernachtungen mit Check-in/out und Reinigungspuffer.',
    href: '/docs',
  },
];

