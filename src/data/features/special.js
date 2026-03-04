/**
 * Special features: Verfügbarkeit, Buffer, Zeitfenster, Approval, Overnight, Workspaces, Kaution
 */
export const special = {
  verfuegbarkeit: {
    slug: 'verfuegbarkeit',
    meta: { title: 'Verfügbarkeitsprüfung', description: 'Echtzeit-Slot-Reservierung verhindert Doppelbuchungen automatisch.' },
    hero: {
      headline: 'Nie wieder doppelt gebucht.',
      subheadline: 'Sobald ein Kunde den Checkout startet, ist der Slot für andere blockiert. Echtzeit-Reservierung verhindert Konflikte, bevor sie entstehen.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    problem: { text: 'Eine Doppelbuchung reicht, um einen Kunden zu verlieren. Ohne Echtzeit-Prüfung sind sie bei parallelen Buchungen unvermeidlich.', bullets: ['Sofortige Slot-Reservierung bei Checkout-Start.', 'Konfliktlogik prüft Überschneidungen.', 'Buchbare Tage und Zeitfenster pro Objekt.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert die Verfügbarkeitsprüfung',
    interactiveHowItWorksHeadline: 'So verhindert BookFast Doppelbuchungen.',
    steps: [
      {
        title: 'Objekt konfigurieren',
        icon: 'home',
        bullets: [
          { title: 'Buchbare Tage und Zeitfenster pro Objekt', description: 'An welchen Tagen und Uhrzeiten kann gebucht werden?' },
          { title: 'Buchungsfenster und Puffer konfigurierbar', description: 'Wie weit im Voraus? Puffer zwischen Buchungen?' },
          { title: 'Regeln bestimmen die verfügbaren Slots', description: 'Ohne Konfiguration sind standardmäßig alle Slots offen.' },
        ],
        reverse: false
      },
      {
        title: 'Kunde bucht',
        icon: 'check',
        bullets: [
          { title: 'Reservierung beim Checkout-Start', description: 'Slot wird sofort reserviert.' },
          { title: 'Echtzeit-Blockierung während der Buchung', description: 'Slot ist für andere blockiert.' },
          { title: 'Kein Wettlauf um denselben Slot', description: 'Doppelbuchungen von vornherein verhindert.' },
        ],
        reverse: true
      },
      {
        title: 'Kein Konflikt',
        icon: 'lock',
        bullets: [
          { title: 'Reservierte Slots für andere ausgeblendet', description: 'Live-Aktualisierung – keine Verzögerung.' },
          { title: 'Bei Stornierung sofort wieder buchbar', description: 'Slot wird freigegeben.' },
          { title: 'Kein Slot wird doppelt vergeben', description: 'Das System garantiert es.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Keine Überlappung von Aufenthalten.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Meeting-Rooms nicht doppelt belegt.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'buffer', 'zeitfenster'],
    faq: [
      { question: 'Was passiert wenn zwei Kunden gleichzeitig buchen?', answer: 'Der erste der den Checkout startet, reserviert den Slot. Der zweite sieht den Slot als nicht mehr verfügbar.' },
      { question: 'Wie schnell wird die Verfügbarkeit aktualisiert?', answer: 'In Echtzeit. Sobald ein Checkout gestartet wird, ist der Slot für andere blockiert.' },
      { question: 'Was passiert bei einer Stornierung?', answer: 'Der Slot wird sofort wieder freigegeben und ist für andere Kunden buchbar.' },
      { question: 'Funktioniert die Prüfung auch bei Übernachtungen?', answer: 'Ja. Egal ob Stunden-, Tages- oder Übernachtungsbuchung – die Konfliktlogik prüft alle Buchungstypen in Echtzeit.' },
      { question: 'Kann ich Slots manuell sperren?', answer: 'Ja, über die Urlaub- und Sperrzeiten-Funktion. Gesperrte Zeiträume werden bei der Verfügbarkeitsprüfung berücksichtigt.' },
    ],
  },

  buffer: {
    slug: 'buffer',
    meta: { title: 'Reinigungspuffer', description: 'Automatische Pufferzeit zwischen Buchungen für Reinigung, Auf-/Abbau oder Vorbereitung.' },
    hero: {
      headline: 'Zeit zwischen Terminen – automatisch blockiert.',
      subheadline: 'Reinigung, Umbau, Vorbereitung: Definiere Pufferzeiten pro Service, die automatisch in die Verfügbarkeit eingerechnet werden.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    problem: { text: 'Rücken an Rücken gebucht: Kein Raum zum Lüften, kein Umbau, keine Reinigung. Dein Team ist gestresst, die Qualität leidet.', bullets: ['Pufferzeit in Minuten oder Stunden.', 'Pro Service individuell konfigurierbar.', 'Automatisch in die Verfügbarkeit eingerechnet.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du den Reinigungspuffer ein',
    interactiveHowItWorksHeadline: 'Puffer einrichten – einmal konfiguriert, immer aktiv.',
    steps: [
      {
        title: 'Puffer festlegen',
        icon: 'clean',
        bullets: [
          { title: 'Pufferzeit pro Service konfigurierbar', description: 'z.B. 30 Minuten für Umbau oder 4 Stunden für Reinigung.' },
          { title: 'In Minuten oder Stunden', description: 'In den Service-Einstellungen festlegen.' },
          { title: 'Kunden sehen nur die buchbaren Slots', description: 'Puffer im Hintergrund eingerechnet.' },
        ],
        reverse: false
      },
      {
        title: 'Automatisch blockiert',
        icon: 'lock',
        bullets: [
          { title: 'Blockierung automatisch nach jeder Buchung', description: '10–12 Uhr mit 30min Puffer: nächster Slot ab 12:30 Uhr.' },
          { title: 'Puffer in Verfügbarkeitsberechnung eingerechnet', description: 'Slots werden automatisch angepasst.' },
          { title: 'Kein manueller Kalender-Eintrag nötig', description: 'Alles läuft im Hintergrund.' },
        ],
        reverse: true
      },
      {
        title: 'Kein Stress',
        icon: 'check',
        bullets: [
          { title: 'Genug Zeit zwischen Terminen', description: 'Für Reinigung, Umbau oder Vorbereitung.' },
          { title: 'Pro Service individuell einstellbar', description: 'Flexibel anpassbar.' },
          { title: 'Ruhe zwischen den Buchungen', description: 'Sie konzentrieren sich auf Ihr Business.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: '4h Reinigungspuffer nach Check-out.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: '15min für Raum-Umbau.', link: '/features' },
    ],
    relatedFeatures: ['verfuegbarkeit', 'objekte', 'overnight'],
    faq: [
      { question: 'Sehen Kunden den Puffer?', answer: 'Nein, Kunden sehen nur die verfügbaren Zeitslots. Der Puffer ist im Hintergrund eingerechnet.' },
      { question: 'Kann ich verschiedene Puffer pro Service haben?', answer: 'Ja, jeder Service hat seine eigene Pufferzeit-Konfiguration.' },
      { question: 'In welchen Einheiten kann ich den Puffer angeben?', answer: 'In Minuten oder Stunden – je nach Bedarf. Für einen Friseursalon reichen 15 Minuten, für eine Ferienwohnung sind 4 Stunden sinnvoll.' },
      { question: 'Wird der Puffer auch bei Übernachtungen berücksichtigt?', answer: 'Ja. Der Puffer wird nach dem Check-out automatisch blockiert – z. B. 4 Stunden für Reinigung vor dem nächsten Check-in.' },
      { question: 'Kann ich den Puffer nachträglich ändern?', answer: 'Ja, jederzeit. Änderungen gelten für neue Buchungen. Bestehende Buchungen bleiben unverändert.' },
    ],
  },

  zeitfenster: {
    slug: 'zeitfenster',
    meta: { title: 'Zeitfenster & Buchungsregeln', description: 'Definiere buchbare Zeiten, Mindestvorlaufzeit und maximales Buchungsfenster.' },
    hero: {
      headline: 'Gebucht wird nur, wenn du es erlaubst.',
      subheadline: 'Öffnungszeiten, Mindestvorlaufzeit und maximales Buchungsfenster – pro Objekt konfigurierbar. Kunden sehen nur Slots, die für dich passen.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_zeitfenster.svg',
    },
    problem: { text: 'Sonntagabend um 23 Uhr eine Buchung für morgen früh? Ohne Zeitregeln passiert genau das.', bullets: ['Buchbare Zeitfenster pro Tag definieren.', 'Mindestvorlaufzeit (z.B. 24h im Voraus).', 'Maximaler Buchungszeitraum (z.B. 3 Monate im Voraus).'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Zeitfenster ein',
    interactiveHowItWorksHeadline: 'Buchbare Zeiten definieren – pro Tag und Objekt.',
    steps: [
      {
        title: 'Zeitfenster setzen',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Buchbare Zeiten pro Tag und Objekt', description: 'z.B. Mo–Fr 8–18 Uhr oder Sa 9–13 Uhr.' },
          { title: 'Unterschiedliche Fenster pro Wochentag möglich', description: 'Pro Tag individuell konfigurierbar.' },
          { title: 'Außerhalb der Zeiten keine Buchung', description: 'Kunden können nur buchen, wenn Sie es erlauben.' },
        ],
        reverse: false
      },
      {
        title: 'Vorlauf definieren',
        icon: 'clock-check',
        bullets: [
          { title: 'Maximaler Buchungszeitraum (z.B. 3 Monate)', description: 'Wie weit im Voraus können Kunden buchen?' },
          { title: 'Mindestvorlaufzeit (z.B. 24h)', description: 'Keine last-minute Buchungen.' },
          { title: 'Flexible Anpassung an Ihr Geschäftsmodell', description: 'Individuell konfigurierbar.' },
        ],
        reverse: true
      },
      {
        title: 'Regeln aktiv',
        icon: 'check',
        bullets: [
          { title: 'Nur gültige Slots im Widget sichtbar', description: 'Keine Buchung außerhalb der Öffnungszeiten.' },
          { title: 'Regeln greifen automatisch', description: 'Keine zu kurzfristigen Termine.' },
          { title: 'Keine manuelle Kontrolle nötig', description: 'Das System prüft für Sie.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Termine nur während Öffnungszeiten.', link: '/features' },
      { icon: '💼', title: 'Coworking', description: 'Meeting-Rooms 08:00-20:00.', link: '/features' },
    ],
    relatedFeatures: ['verfuegbarkeit', 'objekte', 'buffer'],
    faq: [
      { question: 'Kann ich verschiedene Zeiten pro Wochentag setzen?', answer: 'Ja, du kannst pro Tag unterschiedliche Zeitfenster konfigurieren.' },
      { question: 'Können Kunden auch am Wochenende buchen?', answer: 'Ja, du konfigurierst die buchbaren Tage individuell.' },
      { question: 'Was ist eine Mindestvorlaufzeit?', answer: 'Die Mindestvorlaufzeit verhindert kurzfristige Buchungen – z. B. mindestens 24 Stunden im Voraus. Slots, die zu kurzfristig sind, werden ausgeblendet.' },
      { question: 'Kann ich ein maximales Buchungsfenster setzen?', answer: 'Ja. Du legst fest, wie weit im Voraus Kunden buchen können – z. B. maximal 3 Monate. Slots außerhalb des Fensters sind nicht sichtbar.' },
      { question: 'Gelten Zeitfenster pro Objekt oder pro Service?', answer: 'Pro Objekt. Jedes Objekt hat eigene buchbare Tage und Uhrzeiten. Services übernehmen die Verfügbarkeit des zugeordneten Objekts.' },
    ],
  },

  approval: {
    slug: 'approval',
    meta: { title: 'Approval-Flow', description: 'Erst zahlen, dann bestätigen – du behältst die volle Kontrolle über jede Buchung.' },
    hero: {
      headline: 'Du entscheidest, wer bucht – erst nach Zahlung.',
      subheadline: 'Kunden zahlen bei der Anfrage, du prüfst und bestätigst. Bei Ablehnung wird automatisch rückerstattet. Volle Kontrolle, null Risiko.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
      trustClaims: ['Keine Kreditkarte nötig', 'Refund automatisch über Stripe'],
    },
    problem: {
      text: 'Nicht jede Anfrage passt. Aber ohne Vorauszahlung fehlt die Verbindlichkeit – und bei Absage hast du nichts in der Hand.',
      bullets: ['Buchungen kommen als »Wartend« rein', 'Zahlung wird direkt eingezogen', 'Du entscheidest – bei Ablehnung volle Rückerstattung über Stripe'],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert der Approval-Flow',
    interactiveHowItWorksHeadline: 'Anfrage rein, prüfen, entscheiden – so läuft der Approval-Flow.',
    steps: [
      {
        title: 'Kunde bucht',
        icon: 'list',
        bullets: [
          { title: 'Alle neuen Buchungen im Dashboard sichtbar', description: 'Status »Wartend« – Sie sehen sie sofort.' },
          { title: 'Geld ist sicher, bevor Sie bestätigen', description: 'Kunde zahlt direkt im Widget.' },
          { title: 'Keine verpassten Anfragen', description: 'Alles an einem Ort.' },
        ],
        reverse: false
      },
      {
        title: 'Sie bestätigen oder lehnen ab',
        icon: 'check',
        bullets: [
          { title: 'Ein Klick reicht', description: 'Kunde, Datum, Service, Betrag – alle Details sichtbar.' },
          { title: 'Keine manuelle Rücküberweisung nötig', description: 'Bei Ablehnung automatisch über Stripe.' },
          { title: 'Entscheiden Sie in Ruhe', description: 'Volle Kontrolle über jede Anfrage.' },
        ],
        reverse: true
      },
      {
        title: 'Was danach passiert',
        icon: 'key',
        bullets: [
          { title: 'Magic Link automatisch versendet', description: 'Bei Bestätigung – Kunde öffnet Portal.' },
          { title: 'Kunde selbstständig im Portal', description: 'Buchung, Rechnung, Restbetrag zahlen.' },
          { title: 'Refund ohne Ihr Zutun', description: 'Bei Ablehnung – Gutschrift in 5–10 Werktagen.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Gäste-Check vor Buchungsbestätigung.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Motivabsprache vor dem Termin.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'zahlungen', 'rechnungen'],
    faq: [
      { question: 'Was passiert mit der Zahlung bei Ablehnung?', answer: 'BookFast löst automatisch die volle Rückerstattung über Stripe aus. Die Gutschrift kann je nach Zahlungsart 5–10 Werktage dauern.' },
      { question: 'Kann ich den Approval-Flow pro Service aktivieren?', answer: 'Ja, du kannst ihn individuell pro Service ein- oder ausschalten.' },
      { question: 'Wie lange habe ich Zeit, eine Anfrage zu bestätigen?', answer: 'Aktuell gibt es kein automatisches Timeout. Du entscheidest in deinem Tempo. Automatische Ablehnung nach X Tagen ist in Planung.' },
      { question: 'Bekommt der Kunde eine E-Mail bei Bestätigung?', answer: 'Ja. Bei Bestätigung erhält der Kunde automatisch eine E-Mail mit Magic Link zum Kundenportal – für Rechnung, Zahlung und Details.' },
      { question: 'Kann ich einen Ablehnungsgrund angeben?', answer: 'Ja. Beim Ablehnen kannst du einen Grund eingeben, der in der Ablehnungsmail an den Kunden erscheint.' },
    ],
  },

  overnight: {
    slug: 'overnight',
    meta: { title: 'Übernachtungsbuchungen', description: 'Check-in/Check-out-Zeiten, Mindestaufenthalt und Reinigungspuffer für Unterkünfte.' },
    hero: {
      headline: 'Übernachtungen buchen – mit Check-in, Nachtpreis und Puffer.',
      subheadline: 'Service-Typ „Übernachtung“ mit Check-in/out-Zeiten, Mindestaufenthalt, Preis pro Nacht und Reinigungspuffer. Gäste buchen Nächte, du kassierst automatisch.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_uebernachtungensvg.svg',
    },
    problem: { text: 'Stundenbuchungs-Tools können keine Nächte. Dir fehlen Check-in-Zeiten, Mindestaufenthalte und der Reinigungspuffer dazwischen.', bullets: ['Check-in und Check-out Zeiten konfigurierbar.', 'Mindestaufenthalt in Nächten.', 'Preis pro Nacht, automatische Berechnung.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Übernachtungsbuchungen ein',
    interactiveHowItWorksHeadline: 'Overnight-Service einrichten – Schritt für Schritt.',
    steps: [
      {
        title: 'Overnight-Service erstellen',
        icon: 'date-cog',
        bullets: [
          { title: 'Service-Typ "Übernachtung" wählen', description: 'Eigene Optionen für Unterkünfte.' },
          { title: 'Check-in/out und Mindestaufenthalt', description: 'Konfigurierbar pro Service.' },
          { title: 'Preis pro Nacht, automatische Berechnung', description: 'Service einem Objekt zuordnen.' },
        ],
        reverse: false
      },
      {
        title: 'Check-in/out setzen',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Check-in und Check-out Zeiten konfigurierbar', description: 'z.B. 15:00 Einchecken, 10:00 Auschecken.' },
          { title: 'Puffer nach Check-out automatisch blockiert', description: 'z.B. 4 Stunden für Reinigung.' },
          { title: 'Zeiten in Bestätigung und Portal sichtbar', description: 'Für Ihre Gäste transparent.' },
        ],
        reverse: true
      },
      {
        title: 'Kunden buchen Nächte',
        icon: 'home',
        bullets: [
          { title: 'Kalender-Ansicht mit verfügbaren Nächten', description: 'An- und Abreisedatum wählen.' },
          { title: 'Automatische Preisberechnung', description: 'Gesamtzahl der Nächte und Preis.' },
          { title: 'Keine Überlappungen möglich', description: 'Verfügbarkeit in Echtzeit geprüft.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Komplette Übernachtungsverwaltung.', link: '/features' },
      { icon: '🚐', title: 'Wohnmobil-Vermietung', description: 'Mietdauer in Nächten.', link: '/features' },
    ],
    relatedFeatures: ['buffer', 'verfuegbarkeit', 'kaution'],
    faq: [
      { question: 'Kann ich verschiedene Preise pro Nacht setzen?', answer: 'Aktuell ein Preis pro Nacht pro Service. Saisonpreise sind in Planung.' },
      { question: 'Wird der Reinigungspuffer nach Check-out berücksichtigt?', answer: 'Ja, du konfigurierst den Buffer der nach dem Check-out automatisch blockiert wird.' },
      { question: 'Kann ich einen Mindestaufenthalt festlegen?', answer: 'Ja. Pro Service legst du die minimale Anzahl an Nächten fest – z. B. mindestens 2 Nächte.' },
      { question: 'Wie wählt der Kunde An- und Abreise?', answer: 'Im Widget per Kalender-Ansicht. Der Kunde wählt An- und Abreisedatum, und der Preis wird automatisch berechnet.' },
      { question: 'Kann ich Übernachtungen auch ohne Vorauszahlung anbieten?', answer: 'Ja. Du kannst den Service ohne Stripe nutzen – reine Buchungsverwaltung ohne Zahlungsfunktion.' },
    ],
  },

  workspaces: {
    slug: 'workspaces',
    meta: { title: 'Multi-Workspace', description: 'Mehrere Standorte oder Marken in einem Account verwalten – jeder mit eigenen Einstellungen.' },
    hero: {
      headline: 'Mehrere Standorte, ein Login.',
      subheadline: 'Jeder Workspace hat eigene Objekte, Services, Buchungen und Einstellungen. Du wechselst per Klick – ohne separate Accounts oder doppelte Kosten.',
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
    useCases: [
      { icon: '🏠', title: 'Mehrere Standorte', description: 'Ferienwohnungen in verschiedenen Regionen.', link: '/features' },
      { icon: '💇', title: 'Salon-Ketten', description: 'Mehrere Filialen zentral verwalten.', link: '/features' },
    ],
    relatedFeatures: ['objekte', 'integration', 'analytics'],
    faq: [
      { question: 'Haben Workspaces separate Daten?', answer: 'Ja, jeder Workspace hat eigene Objekte, Services, Buchungen und Einstellungen.' },
      { question: 'Kann ich Mitarbeiter einem Workspace zuordnen?', answer: 'Ja, Mitarbeiter werden pro Workspace verwaltet.' },
      { question: 'Brauche ich pro Workspace ein separates Stripe-Konto?', answer: 'Nein. Du kannst denselben Stripe-Account für alle Workspaces nutzen oder separate Accounts verbinden.' },
      { question: 'Wie viele Workspaces sind in meinem Plan enthalten?', answer: 'Solo: 1, Plus: 3, Agency: 10 Workspaces. Alle Features sind in jedem Plan enthalten.' },
      { question: 'Kann ich Workspaces nachträglich hinzufügen?', answer: 'Ja. Du erstellst neue Workspaces jederzeit im Dashboard – bis zum Limit deines Plans. Ein Upgrade erweitert das Limit sofort.' },
    ],
  },

  urlaub: {
    slug: 'urlaub',
    meta: { title: 'Urlaub & Sperrzeiten', description: 'Urlaub blockiert Slots automatisch – für Objekte, Mitarbeiter oder Services. Keine Buchungen in Sperrzeiten.' },
    hero: {
      headline: 'Geschlossen heißt geschlossen – ohne manuelle Slot-Pflege.',
      subheadline: 'Sperrzeiten für Workspace, Objekte, Mitarbeiter oder Services. Ein Klick auf „Urlaub“ blockiert alle betroffenen Slots automatisch.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    problem: {
      text: 'Du machst Urlaub, aber dein Buchungssystem weiß das nicht. Ergebnis: Anfragen in der Abwesenheit, enttäuschte Kunden, Stornierungsaufwand.',
      bullets: [
        'Scope wählbar: Workspace, Objekt, Mitarbeiter oder Service.',
        'Zeitraum definieren – Slots werden automatisch blockiert.',
        'Beschreibung optional (z.B. Betriebsferien, Renovierung).',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Urlaub & Sperrzeiten ein',
    interactiveHowItWorksHeadline: 'Sperrzeit anlegen – ein Klick, alle Slots blockiert.',
    steps: [
      {
        title: 'Scope wählen',
        icon: 'funnel',
        bullets: [
          { title: 'Workspace = alle Buchungen aus', description: 'Ganzes Business geschlossen.' },
          { title: 'Objekt = nur dieses Objekt blockiert', description: 'z.B. Renovierung einer Wohnung.' },
          { title: 'Mitarbeiter oder Service', description: 'Nur seine Slots oder nur dieser Service blockiert.' },
        ],
        reverse: false
      },
      {
        title: 'Zeitraum festlegen',
        icon: 'calender-days-date',
        bullets: [
          { title: 'Start- und Enddatum verpflichtend', description: 'Zeitraum definieren.' },
          { title: 'Beschreibung optional', description: 'z.B. Betriebsferien, Renovierung.' },
          { title: 'Slots sofort blockiert', description: 'Kunden sehen sie nicht mehr als verfügbar.' },
        ],
        reverse: true
      },
      {
        title: 'Keine Buchungen in Sperrzeiten',
        icon: 'lock',
        bullets: [
          { title: 'Verfügbarkeitsprüfung inkl. Urlaub', description: 'Automatisch berücksichtigt.' },
          { title: 'Kein manueller Kalender-Aufwand', description: 'Keine verpassten Sperrzeiten.' },
          { title: 'Klarheit für Sie und Ihre Kunden', description: 'Das System sorgt für die Einhaltung.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Objekt in Renovierung – keine Buchungen möglich.', link: '/features' },
      { icon: '💇', title: 'Friseure', description: 'Mitarbeiter im Urlaub – seine Slots blockiert.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Studio geschlossen – ganze Workspace sperren.', link: '/features' },
    ],
    relatedFeatures: ['verfuegbarkeit', 'zeitfenster', 'buffer', 'objekte'],
    faq: [
      { question: 'Kann ich Urlaub für einzelne Objekte setzen?', answer: 'Ja, du wählst den Scope: Ganzes Workspace, Objekt, Mitarbeiter oder Service. So blockierst du nur den Bereich, den du sperren möchtest.' },
      { question: 'Werden bestehende Buchungen beeinflusst?', answer: 'Nein, Urlaub blockiert nur neue Buchungen. Bestehende Buchungen bleiben unverändert.' },
      { question: 'Kann ich wiederkehrende Sperrzeiten setzen?', answer: 'Aktuell legst du Sperrzeiten einmalig mit Start- und Enddatum an. Wiederkehrende Sperrzeiten sind in Planung.' },
      { question: 'Kann ich eine Beschreibung hinterlegen?', answer: 'Ja. Optional kannst du einen Grund angeben – z. B. Betriebsferien oder Renovierung. Die Beschreibung ist nur intern sichtbar.' },
      { question: 'Wird der Urlaub im Widget angezeigt?', answer: 'Nein. Kunden sehen gesperrte Tage einfach nicht als verfügbar. Es erscheint kein Hinweis auf den Grund der Sperrung.' },
    ],
  },

  'email-templates': {
    slug: 'email-templates',
    meta: { title: 'E-Mail Vorlagen', description: 'Passe die 7 Buchungs-E-Mails an – Betreff, Text und Platzhalter. Von Bestätigung bis Rückerstattung.' },
    hero: {
      headline: '7 Buchungs-Mails – in deinem Ton, nicht in unserem.',
      subheadline: 'Bestätigung, Ablehnung, Erinnerung, Rückerstattung und mehr: Passe Betreff und Text an. Platzhalter wie {{customer_name}} werden automatisch ersetzt.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    problem: {
      text: 'Generische System-E-Mails wirken unpersönlich. Deine Kunden merken den Unterschied zwischen „Ihre Buchung wurde bestätigt“ und einer Nachricht, die nach dir klingt.',
      bullets: [
        '7 Vorlagentypen: Buchung eingegangen, bestätigt, abgelehnt, storniert, geändert, Erinnerung, Rückerstattung.',
        'Platzhalter wie {{customer_name}}, {{booking_number}} – automatisch ersetzt.',
        'Standard-Vorlagen als Fallback – du überschreibst nur, was du willst.',
      ],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So passen Sie E-Mail Vorlagen an',
    interactiveHowItWorksHeadline: 'Vorlagen anpassen – Betreff, Text, Platzhalter.',
    steps: [
      {
        title: 'Vorlagen einsehen',
        icon: 'mails',
        bullets: [
          { title: '7 Vorlagentypen auf einen Blick', description: 'Buchung eingegangen, bestätigt, abgelehnt, storniert, geändert, Erinnerung, Rückerstattung.' },
          { title: 'Standard-Texte als Startpunkt', description: 'Jede hat einen Standard-Text.' },
          { title: 'Klick auf Karte öffnet Editor', description: 'Im Dashboard unter "E-Mail Vorlagen".' },
        ],
        reverse: false
      },
      {
        title: 'Betreff und Text bearbeiten',
        icon: 'pencil',
        bullets: [
          { title: 'Betreff und Text pro Vorlage', description: 'Bearbeiten Sie nach Bedarf.' },
          { title: 'Platzhalter werden automatisch ersetzt', description: '{{customer_name}}, {{booking_number}}, {{portal_link}}.' },
          { title: 'Liste der Platzhalter im Editor', description: 'Alle verfügbaren Platzhalter sichtbar.' },
        ],
        reverse: true
      },
      {
        title: 'Kunde erhält Ihre Mails',
        icon: 'mail',
        bullets: [
          { title: 'Absender mit Ihrem Firmennamen', description: '"Ihr Firmenname via BookFast".' },
          { title: 'Antworten an Ihre Kontakt-E-Mail', description: 'Sie bleiben erreichbar.' },
          { title: 'Kein Setup eigener SMTP nötig', description: 'BookFast übernimmt die Zustellung.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: 'Bestätigungsmail mit Check-in-Infos anpassen.', link: '/features' },
      { icon: '💇', title: 'Friseure', description: 'Persönlicher Ton in Erinnerungs- und Bestätigungsmails.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Eigene Formulierungen für Buchung und Rückerstattung.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'kundenportal', 'zahlungen'],
    faq: [
      { question: 'Welche Platzhalter kann ich nutzen?', answer: 'Z.B. {{customer_name}}, {{booking_number}}, {{service_name}}, {{object_name}}, {{start_date}}, {{end_date}}, {{total_price}}, {{company_name}}, {{portal_link}}, {{pin_code}}. Die vollständige Liste siehst du im Editor.' },
      { question: 'Kann ich zur Standard-Vorlage zurückkehren?', answer: 'Ja, du kannst angepasste Vorlagen löschen – dann greift wieder die Standard-Vorlage.' },
      { question: 'Kann ich E-Mails in meinem Design versenden?', answer: 'Aktuell nutzt BookFast ein Standard-Layout mit deinem Firmennamen. Komplett eigene HTML-Templates sind in der Enterprise-Version geplant.' },
      { question: 'Wird der Magic Link automatisch eingefügt?', answer: 'Ja. Der Platzhalter {{portal_link}} fügt den Magic Link zum Kundenportal automatisch ein – inklusive PIN-Schutz.' },
      { question: 'Welche E-Mails werden automatisch versendet?', answer: '7 Typen: Buchung eingegangen, bestätigt, abgelehnt, storniert, geändert, Erinnerung und Rückerstattung. Jede wird automatisch bei der entsprechenden Aktion ausgelöst.' },
    ],
  },

  kaution: {
    slug: 'kaution',
    meta: { title: 'Kaution & Anzahlung', description: 'Konfigurierbare Anzahlung oder Kaution pro Service – prozentual oder als Festbetrag.' },
    hero: {
      headline: '30% bei Buchung – der Rest beim Termin.',
      subheadline: 'Konfiguriere prozentuale oder feste Anzahlungen pro Service. Einzug bei Buchung über Stripe, Restbetrag später – automatische Berechnung auf der Rechnung.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
    },
    problem: { text: 'Wer nichts bezahlt hat, kommt oft nicht. Eine Anzahlung reduziert No-Shows um bis zu 60% und sichert deinen Umsatz ab.', bullets: ['Prozentualer Anzahlungsbetrag pro Service.', 'Automatisch bei Buchung eingezogen.', 'Restbetrag bei Termin oder nach Abschluss.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Anzahlung ein',
    interactiveHowItWorksHeadline: 'Anzahlung aktivieren – pro Service konfigurierbar.',
    steps: [
      {
        title: 'Anzahlung aktivieren',
        icon: 'bank-card',
        bullets: [
          { title: 'Einstellung pro Service im Detail', description: 'In den Service-Einstellungen einschalten.' },
          { title: 'Prozent oder Festbetrag wählbar', description: 'z.B. 30% oder 50€ Kaution.' },
          { title: 'Sofortiger Einzug bei Buchung', description: 'Restbetrag bei Termin oder nach Abschluss.' },
        ],
        reverse: false
      },
      {
        title: 'Prozentsatz setzen',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Prozent oder Festbetrag pro Service', description: 'z.B. 30% des Gesamtpreises.' },
          { title: 'Restbetrag auf Rechnung ausgewiesen', description: 'Kann bei Termin bezahlt werden.' },
          { title: 'Individuell pro Service konfigurierbar', description: 'Bei teuren Services höhere Anzahlung.' },
        ],
        reverse: true
      },
      {
        title: 'Automatisch eingezogen',
        icon: 'money-hand',
        bullets: [
          { title: 'Einzug bei Buchung automatisch', description: 'Stripe zieht den Betrag ein.' },
          { title: 'Kein manueller Zahlungseingang nötig', description: 'Geld geht auf Ihr Konto.' },
          { title: 'Rückerstattung bei Ablehnung automatisch', description: 'Bei Ablehnung durch Sie.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🏠', title: 'Ferienwohnungen', description: '30% Anzahlung bei Buchung.', link: '/features' },
      { icon: '🎨', title: 'Tattoo-Studios', description: 'Kaution gegen No-Shows.', link: '/features' },
      { icon: '🚲', title: 'Verleih', description: 'Kaution für Equipment-Schutz.', link: '/features' },
    ],
    relatedFeatures: ['zahlungen', 'approval', 'rechnungen'],
    faq: [
      { question: 'Wird die Anzahlung auf der Rechnung angezeigt?', answer: 'Ja, Anzahlung und Restbetrag werden auf der Rechnung ausgewiesen.' },
      { question: 'Was passiert bei Stornierung?', answer: 'Bei Stornierung durch dich wird die Anzahlung automatisch rückerstattet. Bei Kundenstornierung greift deine Policy.' },
      { question: 'Kann ich die Anzahlung als Prozentsatz konfigurieren?', answer: 'Ja. Du wählst zwischen Prozent (z. B. 30 %) oder Festbetrag (z. B. 50 €) – pro Service individuell.' },
      { question: 'Kann der Kunde den Restbetrag online zahlen?', answer: 'Ja. Über das Kundenportal per Magic Link kann der Kunde offene Beträge direkt online bezahlen.' },
      { question: 'Reduziert eine Anzahlung No-Shows?', answer: 'Ja. Erfahrungswerte zeigen, dass eine Anzahlung No-Shows um bis zu 60 % reduziert – weil Kunden finanziell gebunden sind.' },
    ],
  },
};
