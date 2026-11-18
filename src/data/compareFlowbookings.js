/**
 * German marketing copy for /vergleich/flowbookings.
 */
export const COMPARE_FLOWBOOKINGS_DE = {
  meta: {
    title: 'BookFast vs FlowBookings: Portal, Stripe Connect, keine Caps',
    description:
      'FlowBookings sammelt Buchungen per Formular. BookFast liefert Portal, Stripe Connect, Rechnungen, Räume und Mitarbeiter dazu. Ab 9,49 €, kein Booking-Cap.',
  },
  hero: {
    headline: 'Buchung drin, der Rest ist Handarbeit? Nicht mit BookFast.',
    subheadline: 'Portal, Zahlung, Rechnung, Räume, Mitarbeiter. Ab 9,49 € ohne Booking-Cap.',
    illustrationAlt: 'Illustration zum BookFast Kundenportal nach der Buchung',
    primaryCTA: 'Live-Demo starten',
    secondaryCTA: 'Preise',
    trustClaims: ['0% Provision', 'EU-Server', 'Kein Secret Key'],
  },
  table: {
    label: 'Auf einen Blick',
    headline: 'Was nach dem Formular übrig bleibt.',
    columns: ['Funktion', 'BookFast', 'FlowBookings'],
    rows: [
      { feature: 'Mitarbeiter-Auswahl im Widget', values: [true, 'nicht dokumentiert'] },
      { feature: 'Objekte / Räume', values: [true, 'nicht dokumentiert'] },
      { feature: 'Stunden, Tage, Nächte', values: ['alle drei', 'Dauer am Service'] },
      { feature: 'Add-ons', values: [true, 'nicht dokumentiert'] },
      { feature: 'Auto-Refund bei Ablehnung', values: [true, 'Nein'] },
      { feature: 'Stripe-Anbindung', values: ['Connect', 'Secret Key im Dashboard'] },
      { feature: 'Rechnung als PDF', values: [true, 'nicht dokumentiert'] },
      { feature: 'Kundenportal (Magic Link)', values: [true, 'nicht dokumentiert'] },
      { feature: 'Funnel pro Schritt', values: [true, 'nur Totals'] },
      { feature: 'Workspaces / mehrere Sites', values: ['1 / 3 / 10', '1 Account pro Client'] },
      { feature: 'Booking-Caps', values: ['keine', '1.000 / 5.000 / unbegrenzt'] },
      { feature: 'Preis monatlich', values: ['ab 9,49 €', 'ab $24'] },
      { feature: 'EU-Server / DSGVO', values: [true, 'kein Claim'] },
    ],
    footnote:
      'Stand laut öffentlicher FlowBookings-Dokumentation und den BookFast-Feature-Pages. "Nicht dokumentiert" heißt: in ihren Docs und Feature-Pages nicht beschrieben. Kein erfundenes Fehlen. Preise ohne Stripe-Gebühren. BookFast in Euro, FlowBookings in USD. Caps laut deren Pricing-FAQ: über dem Limit bleiben neue Buchungen unsichtbar. BookFast ist nicht mit FlowBookings verbunden.',
  },
  sliders: [
    {
      label: 'Nach der Buchung',
      headline: 'Kundenportal und Rechnung',
      intro:
        'Magic Link plus PIN. Rechnung ansehen, offenen Betrag zahlen, stornieren. Das PDF gibt es zu jeder Buchung. Kein Kundenkonto, das den Checkout killt.',
      cards: [
        {
          title: 'Ein Link pro Buchung.',
          subtext: 'PIN davor. Kein Passwort, das niemand speichert.',
          slug: 'kundenportal',
          illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
        },
        {
          title: 'PDF und Zahlung im Portal.',
          subtext: 'Nicht als Screenshot in WhatsApp.',
          slug: 'rechnungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
        },
        {
          title: 'Storno ohne deine Tipparbeit.',
          subtext: 'Weniger Mails, die nur "bitte stornieren" heißen.',
          slug: 'kundenportal',
          illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
        },
        {
          title: 'Zu jeder Buchung gibt es die Rechnung.',
          subtext: 'PDF mit Positionen, Add-ons, Firmendaten. Im Portal und im Dashboard.',
          slug: 'rechnungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
        },
        {
          title: 'Gast lädt das PDF selbst.',
          subtext: 'Magic Link reicht.',
          slug: 'kundenportal',
          illustration: '/src/svg/illustrations/landingpage/features/ft_kundenportal.svg',
        },
        {
          title: 'Dieselben Firmendaten wie im Checkout.',
          subtext: 'Kein zweites Tool für denselben Vorgang.',
          slug: 'rechnungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_automatische_rechnung.svg',
        },
      ],
    },
    {
      label: 'Zahlungen',
      headline: 'Stripe Connect und Checkout',
      intro:
        'Stripe Connect. Der Kunde zahlt bei der Buchung. Ablehnung löst die Erstattung aus. Kein Secret Key in unserem Dashboard.',
      cards: [
        {
          title: 'Connect-Onboarding.',
          subtext: 'Konto verbinden, fertig. Kein Key-Paste.',
          slug: 'zahlungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
        },
        {
          title: 'Alles in einem Checkout.',
          subtext: 'Service, Reinigungsgebühr, Extras, Gutschein.',
          slug: 'zahlungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
        },
        {
          title: 'Ablehnen erstattet automatisch.',
          subtext: 'Über Stripe, ohne manuelle Auszahlung zurück.',
          slug: 'zahlungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_zahlungen.svg',
        },
      ],
    },
    {
      label: 'Was gebucht wird',
      headline: 'Objekte, Services, Mitarbeiter',
      intro:
        'Räume sind eigene Dinge. Drei Buchungstypen. Kunden buchen den Menschen. Verfügbarkeit hängt nicht an einem nackten Service-Namen.',
      cards: [
        {
          title: 'Ein Objekt, mehrere Services.',
          subtext: 'Stunde und Tag im selben Raum.',
          slug: 'objekte',
          illustration: '/src/svg/illustrations/landingpage/features/ft_objektverwaltung.svg',
        },
        {
          title: 'Reinigungspuffer zwischen Buchungen.',
          subtext: 'Am Service eingestellt. Kunden sehen den Puffer nicht.',
          slug: 'services',
          illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
        },
        {
          title: 'Stunden, Tage, Nächte.',
          subtext: 'Drei Typen, eigene Logik. Nicht eine Dauer in Minuten für Wohnung, Kurs und Termin.',
          slug: 'services',
          illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
        },
        {
          title: 'Add-ons am Service.',
          subtext: 'Beamer, Matte, Frühstück. Kein zweiter Dummy-Service.',
          slug: 'services',
          illustration: '/src/svg/illustrations/landingpage/features/ft_service_konfi.svg',
        },
        {
          title: 'Wunsch-Mitarbeiter im Widget.',
          subtext: 'Kunden wählen die Person oder "Egal". Gebucht wird nur an ihren Arbeitstagen.',
          slug: 'mitarbeiter',
          illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
        },
        {
          title: 'Ein Mensch, mehrere Services.',
          subtext: 'Schnitt und Bart, ein Profil. Eigene Mitarbeiter-Kalender sind nicht live.',
          slug: 'mitarbeiter',
          illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
        },
      ],
    },
    {
      label: 'Betrieb',
      headline: 'Inbox, Mails, Funnel',
      intro:
        'Eine Inbox, Bestätigungsmail mit Portal-Link. Du siehst, wo der Funnel reißt. Ohne Drittanbieter-Cookies.',
      cards: [
        {
          title: 'Erst zahlen, dann bestätigen.',
          subtext: 'Geld sitzt, bevor du freigibst.',
          slug: 'buchungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
        },
        {
          title: 'Bestätigung in deinem Ton.',
          subtext: 'Mit Portal-Link und PIN. Betreff und Text im Editor.',
          slug: 'buchungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
        },
        {
          title: 'Tabs nach Status.',
          subtext: 'Eine Inbox, nicht fünf Postfächer.',
          slug: 'buchungen',
          illustration: '/src/svg/illustrations/landingpage/features/ft_buchungsverwaltung.svg',
        },
        {
          title: 'Drop-off pro Schritt.',
          subtext: 'Widget geladen, Buchung gestartet, Checkout, Zahlung. Nicht nur "Buchungen gesamt".',
          slug: 'analytics',
          illustration: '/src/svg/illustrations/empty-state-analytics.svg',
        },
        {
          title: 'Browser, OS, Gerät.',
          subtext: 'Traffic, der auf der Seite passiert.',
          slug: 'analytics',
          illustration: '/src/svg/illustrations/empty-state-analytics.svg',
        },
        {
          title: 'Letzter Monat, 3, 6 oder 12 Monate.',
          subtext: 'Zeitraum wählen, Entwicklung sehen.',
          slug: 'analytics',
          illustration: '/src/svg/illustrations/empty-state-analytics.svg',
        },
      ],
    },
    {
      label: 'Agentur',
      headline: 'Workspaces und Widget',
      intro:
        'Basic 1, Team 3, Agentur 10 Workspaces. Template-Copy plus Script-Tag. Kein iFrame. Du zahlst Workspaces, nicht Buchungsstückzahl.',
      cards: [
        {
          title: 'Eigene Objekte, Services, Stripe pro Workspace.',
          subtext: 'Mandant bleibt getrennt.',
          slug: 'workspaces',
          illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
        },
        {
          title: 'Kein zweites Abo pro Client.',
          subtext: 'Ein Account, Dropdown, weiter.',
          slug: 'workspaces',
          illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
        },
        {
          title: 'Kein Cap, der Buchungen versteckt.',
          subtext: 'Bei FlowBookings bleiben neue Buchungen über dem Limit unsichtbar, bis der Plan steigt.',
          slug: 'workspaces',
          illustration: '/src/svg/illustrations/landingpage/features/ft_multi_workspace.svg',
        },
        {
          title: 'Webflow-Elemente statt Box.',
          subtext: 'Das Template liefert echte Elemente, das Script füllt sie mit Live-Daten.',
          slug: 'integration',
          illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
        },
        {
          title: 'Styles von der Seite.',
          subtext: 'Kein Extra-Theme, das die Schrift überschreibt. Du gestaltest im Designer.',
          slug: 'integration',
          illustration: '/src/svg/illustrations/landingpage/features/ft_integrationen.svg',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Ist BookFast eine Alternative zu FlowBookings?',
      answer:
        'Ja, wenn nach der Buchung Betrieb anfällt. FlowBookings ist das native Webflow-Formular. BookFast ist Widget plus Portal, Zahlung, Objekte, Mitarbeiter.',
    },
    {
      question: 'Wie unterscheidet sich der Einbau?',
      answer:
        'FlowBookings setzt native Webflow-Form-Elemente. BookFast ein Widget plus Template-Copy.',
    },
    {
      question: 'Wann reicht ein Formular?',
      answer:
        'Wenn du einen Service mit Dauer auf einer Webflow-Seite einsammeln willst, reicht oft ein Formular. Sobald ein Raum, ein Mensch, eine Vorauszahlung oder Self-Service dazukommt, brauchst du den Betrieb dahinter.',
    },
    {
      question: 'Geht Anzahlung?',
      answer:
        'Ja, in Prozent pro Service. Der Kunde zahlt bei der Buchung den Anteil, den Rest später im Kundenportal. Bei Ablehnung erstattet Stripe automatisch.',
    },
    {
      question: 'Warum Connect statt Secret Key?',
      answer:
        'Stripe Connect onboardet das Konto. Secret Keys gehören nicht in ein Drittanbieter-Dashboard.',
    },
    {
      question: 'Gibt es ein Buchungslimit?',
      answer:
        'Nein. Die Pläne unterscheiden Workspaces. FlowBookings deckelt Services und Buchungen. Über dem Limit bleiben neue Buchungen bei denen unsichtbar.',
    },
    {
      question: 'Haben Mitarbeiter eigene Kalender?',
      answer:
        'Nein. Mitarbeiter haben buchbare Wochentage, die Uhrzeiten kommen vom Service oder Objekt. Eigene Kalender sind nicht live.',
    },
    {
      question: 'Läuft BookFast nur mit Webflow?',
      answer:
        'Gebaut für Webflow. Das Script braucht das Markup aus dem Webflow-Template. Auf anderen Systemen müsstest du es selbst nachbauen.',
    },
  ],
  cta: {
    headline: 'Testbuchung auf einer Webflow-Seite durchklicken.',
    subheadline: '3 Tage. Keine Karte. Unter 5 Minuten, wenn die Seite steht.',
  },
};
