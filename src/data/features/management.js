/**
 * Management features: Mitarbeiter, Addons, Gutscheine, Kunden
 */
export const management = {
  mitarbeiter: {
    slug: 'mitarbeiter',
    meta: { title: 'Mitarbeiterverwaltung', description: 'Ordne Mitarbeiter Services zu. Kunden wählen ihren Wunsch-Mitarbeiter bei der Buchung.' },
    hero: {
      headline: 'Kunden buchen den richtigen Mitarbeiter – automatisch.',
      subheadline: 'Mitarbeiter anlegen, Services zuordnen, fertig. Deine Kunden sehen im Widget die Verfügbarkeit pro Teammitglied und buchen direkt.',
      demoModule: 'mitarbeiter',
      illustration: '/src/svg/illustrations/landingpage/features/ft_mitarbeiterverwaltung.svg',
      trustClaims: ['Kostenlos testen', 'Keine Kreditkarte nötig', 'In unter 5 Minuten startklar'],
    },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Mitarbeiter ein',
    interactiveHowItWorksHeadline: 'Team anlegen, Services zuordnen, fertig.',
    problem: { text: 'Wer ist wann verfügbar? Wer macht welchen Service? Ohne klare Zuordnung endet Terminplanung im Hin-und-Her zwischen Telefon und Kalender.', bullets: ['Mitarbeiterprofile mit Bild und Name.', 'Zuordnung zu Services: Wer bietet was an.', 'Kunden sehen Verfügbarkeit pro Mitarbeiter.'] },
    steps: [
      {
        title: 'Team anlegen',
        icon: 'users-2',
        bullets: [
          { title: 'Name und optional Bild pro Mitarbeiter', description: 'Name und optional Bild – damit Kunden sofort sehen, wen sie buchen.' },
          { title: 'Profile im Dashboard pflegen', description: 'Einmal anlegen, jederzeit aktualisieren – ohne Aufwand.' },
          { title: 'Unbegrenzt viele Mitarbeiter in Pro und Enterprise', description: 'Team wächst – keine Limits in Pro und Enterprise.' },
        ],
        reverse: false
      },
      {
        title: 'Services zuordnen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Services pro Mitarbeiter im Detail zuordnen', description: 'Im Mitarbeiter-Detail ordnest du die passenden Services zu.' },
          { title: 'Ein Mitarbeiter kann mehrere Services anbieten', description: 'Schnitt und Bart – ein Friseur, mehrere Services möglich.' },
          { title: 'Kunden sehen nur Mitarbeiter mit passenden Services', description: 'Relevante Auswahl – keine unnötigen Optionen im Widget.' },
        ],
        reverse: true
      },
      {
        title: 'Kunden buchen',
        icon: 'check',
        bullets: [
          { title: 'Mitarbeiter-Auswahl im Widget sichtbar', description: 'Kunden wählen direkt – Lieblingsfriseur oder beliebig.' },
          { title: 'Slots pro Mitarbeiter angezeigt', description: 'Verfügbarkeit automatisch – kein doppelter Kalender nötig.' },
          { title: 'Kein zusätzlicher Aufwand – alles automatisch', description: 'Einmal eingerichtet – alles läuft von selbst.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Kunden buchen ihren Lieblingsfriseur.', link: '/features' },
      { icon: '🧘', title: 'Yoga Studios', description: 'Trainer-Auswahl pro Kurstyp.', link: '/features' },
      { icon: '🏥', title: 'Physiotherapie', description: 'Therapeuten-Buchung mit Fachgebiet.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'zeitfenster', 'services'],
    tags: ['mitarbeiter', 'team', 'staffing', 'scheduling', 'roles'],
    faq: [
      { question: 'Wie viele Mitarbeiter kann ich anlegen?', answer: 'Unbegrenzt in Pro und Enterprise.' },
      { question: 'Können Mitarbeiter eigene Verfügbarkeiten haben?', answer: 'Aktuell werden Verfügbarkeiten über die Objekt-Einstellungen gesteuert. Mitarbeiter-eigene Kalender sind in Planung.' },
      { question: 'Sehen Kunden die Mitarbeiter im Widget?', answer: 'Ja. Kunden sehen Name und optional Bild und wählen ihren Wunsch-Mitarbeiter direkt bei der Buchung aus.' },
      { question: 'Kann ein Mitarbeiter mehrere Services anbieten?', answer: 'Ja. Du ordnest einem Mitarbeiter beliebig viele Services zu – z. B. Schnitt und Bart beim Friseur.' },
      { question: 'Gibt es ein Limit für Mitarbeiter?', answer: 'In Pro und Enterprise kannst du unbegrenzt viele Mitarbeiter anlegen. Im Free-Plan ist die Anzahl limitiert.' },
    ],
  },

  addons: {
    slug: 'addons',
    meta: { title: 'Add-ons & Extras', description: 'Upsells bei der Buchung – Yogamatte, Beamer, Reinigung und mehr als buchbare Extras.' },
    hero: {
      headline: 'Extras im Checkout – mehr Umsatz pro Buchung.',
      subheadline: 'Yogamatte, Beamer, Reinigung, Frühstück – biete Extras an, die Kunden im Buchungsflow dazuwählen. Automatisch berechnet, auf der Rechnung ausgewiesen.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_addons.svg',
    },
    problem: { text: 'Bei der Buchung sind Kunden bereit, mehr auszugeben. Ohne Add-on-Option im Checkout verschenkst du durchschnittlich 15-25% Zusatzumsatz.', bullets: ['Add-ons pro Service konfigurierbar.', 'Preis pro Add-on separat festlegbar.', 'Auf der Rechnung korrekt ausgewiesen.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Add-ons ein',
    interactiveHowItWorksHeadline: 'Add-on erstellen, zuordnen, Umsatz steigern.',
    steps: [
      {
        title: 'Add-ons erstellen',
        icon: 'package',
        bullets: [
          { title: 'Name und Beschreibung helfen Kunden bei der Entscheidung', description: 'Klare Angaben steigern die Buchungsrate.' },
          { title: 'Preis pro Einheit – auch Mehrfachbuchung möglich', description: 'z.B. Yogamatte, Beamer, Reinigung.' },
          { title: 'Add-on erscheint erst nach Service-Zuordnung im Widget', description: 'Im Dashboard unter "Add-ons" anlegen.' },
        ],
        reverse: false
      },
      {
        title: 'Services zuordnen',
        icon: 'spark-magic',
        bullets: [
          { title: 'Zuordnung pro Add-on in den Details bearbeiten', description: 'Welches Extra bei welchem Service.' },
          { title: 'Ein Add-on kann vielen Services zugeordnet werden', description: 'z.B. Yogamatte nur bei Yoga-Kursen.' },
          { title: 'Feine Steuerung', description: 'Beamer nur bei Meeting-Raum-Buchungen.' },
        ],
        reverse: true
      },
      {
        title: 'Umsatz steigern',
        icon: 'receipt-euro',
        bullets: [
          { title: 'Extras erscheinen im Checkout-Schritt', description: 'Kunden wählen optional dazu.' },
          { title: 'Mehrpreis automatisch in Rechnung und Zahlung', description: 'Korrekt berechnet und ausgewiesen.' },
          { title: 'Kein manueller Aufwand – alles automatisch', description: 'Einmal eingerichtet, fertig.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💼', title: 'Coworking', description: 'Beamer, Whiteboard, Catering als Extras.', link: '/features' },
      { icon: '🧘', title: 'Yoga', description: 'Yogamatte, Handtuch, Tee.', link: '/features' },
    ],
    relatedFeatures: ['gutscheine', 'zahlungen', 'rechnungen'],
    tags: ['addons', 'upsell', 'extras', 'checkout', 'revenue'],
    faq: [
      { question: 'Werden Add-ons auf der Rechnung angezeigt?', answer: 'Ja, jedes gebuchte Add-on wird als separate Position auf der Rechnung aufgelistet.' },
      { question: 'Kann ich Add-ons als Pflicht markieren?', answer: 'Aktuell sind Add-ons optional. Pflicht-Add-ons sind in Planung.' },
      { question: 'Kann ein Add-on mehreren Services zugeordnet werden?', answer: 'Ja. Ein Add-on (z. B. Reinigung) kann beliebig vielen Services zugeordnet werden.' },
      { question: 'Wie sieht der Kunde die Add-ons?', answer: 'Im Checkout-Schritt des Widgets erscheinen die verfügbaren Extras mit Name, Beschreibung und Preis. Der Kunde wählt optional aus.' },
      { question: 'Werden Add-ons im Preis automatisch berechnet?', answer: 'Ja. Der Gesamtpreis wird inklusive Add-ons automatisch berechnet und an Stripe übergeben.' },
    ],
  },

  gutscheine: {
    slug: 'gutscheine',
    meta: { title: 'Gutscheine & Rabattcodes', description: 'Erstelle Rabattcodes mit Prozent- oder Festbetrag-Rabatt, Nutzungslimits und Gültigkeitszeitraum.' },
    hero: {
      headline: 'Rabattcodes, die Buchungen bringen – nicht nur Klicks.',
      subheadline: 'Prozent oder Festbetrag, Nutzungslimit und Gültigkeitszeitraum. Erstelle Codes in Sekunden und tracke, welche tatsächlich konvertieren.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_rabattcodes.svg',
    },
    problem: { text: 'Rabatte ohne System führen zu doppelt eingelösten Codes, vergessenen Ablaufdaten und fehlender Nachverfolgung. Du weißt nicht, was funktioniert.', bullets: ['Prozent- oder Festbetrag-Rabatt.', 'Nutzungslimit pro Code.', 'Gültigkeitszeitraum konfigurierbar.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So richtest du Gutscheine ein',
    interactiveHowItWorksHeadline: 'Code erstellen, verteilen, Ergebnisse tracken.',
    steps: [
      {
        title: 'Code erstellen',
        icon: 'ticket-percent',
        bullets: [
          { title: 'Prozent oder Festbetrag pro Code', description: 'z.B. YOGA25 für 25% oder 10€ Rabatt.' },
          { title: 'Nutzungslimit und Gültigkeitsdatum optional', description: 'Im Dashboard unter "Gutscheine" anlegen.' },
          { title: 'Code sofort nach Erstellung gültig', description: 'Keine Wartezeit.' },
        ],
        reverse: false
      },
      {
        title: 'Verteilen',
        icon: 'copy',
        bullets: [
          { title: 'Eingabe im Checkout-Schritt des Widgets', description: 'Kunden geben den Code ein.' },
          { title: 'Automatische Prüfung von Gültigkeit und Limit', description: 'Gültig, Limit nicht erreicht, Zeitraum ok.' },
          { title: 'Rabatt sofort sichtbar im Buchungsprozess', description: 'Direkt angezeigt und auf der Rechnung ausgewiesen.' },
        ],
        reverse: true
      },
      {
        title: 'Tracking',
        icon: 'chart',
        bullets: [
          { title: 'Einsätze pro Code im Dashboard sichtbar', description: 'Wie oft wurde der Code eingelöst?' },
          { title: 'Rabatt auf Rechnung korrekt ausgewiesen', description: 'Transparent für Sie und den Kunden.' },
          { title: 'Beliebte Codes leicht identifizierbar', description: 'Verlängern oder neue erstellen.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '🧘', title: 'Yoga Studios', description: 'YOGA25 für 25% auf die erste Stunde.', link: '/features' },
      { icon: '🎉', title: 'Saisonaktionen', description: 'SOMMER2025 für saisonale Rabatte.', link: '/features/buchungen' },
    ],
    relatedFeatures: ['addons', 'zahlungen', 'buchungen'],
    tags: ['gutscheine', 'discounts', 'promo', 'marketing', 'campaigns'],
    faq: [
      { question: 'Können Gutscheine auf bestimmte Services beschränkt werden?', answer: 'Aktuell gelten Gutscheine für alle Services. Servicespezifische Einschränkung ist in Planung.' },
      { question: 'Wird der Rabatt auf der Rechnung angezeigt?', answer: 'Ja, eingelöste Gutscheine werden als Rabatt auf der Rechnung ausgewiesen.' },
      { question: 'Kann ich ein Nutzungslimit pro Code setzen?', answer: 'Ja. Du legst fest, wie oft ein Code eingelöst werden kann – z. B. maximal 50 Mal.' },
      { question: 'Kann ich Gutscheine zeitlich begrenzen?', answer: 'Ja. Du setzt ein Start- und Enddatum. Nach Ablauf wird der Code automatisch ungültig.' },
      { question: 'Sehe ich, wie oft ein Code eingelöst wurde?', answer: 'Ja. Im Dashboard siehst du pro Code die Anzahl der Einlösungen und den kumulierten Rabattbetrag.' },
    ],
  },

  kunden: {
    slug: 'kunden',
    meta: { title: 'Kundenverwaltung', description: 'Übersicht aller Kunden mit Buchungshistorie, Kontaktdaten und Notizen.' },
    hero: {
      headline: 'Wer bucht, wann, wie oft – Kundendaten ohne CRM.',
      subheadline: 'Jede Buchung füllt automatisch deine Kundendatenbank. Buchungshistorie, Kontaktdaten und Umsatz pro Kunde – ohne manuellen Eintrag.',
      illustration: '/src/svg/illustrations/landingpage/features/ft_kundenverwaltung.svg',
    },
    problem: { text: 'Ohne Kundenübersicht erkennst du Stammkunden nicht, verpasst Wiederbuchungen und beantwortest Support-Anfragen ohne Kontext.', bullets: ['Automatische Kundendatenbank aus Buchungen.', 'Buchungshistorie pro Kunde einsehen.', 'Kontaktdaten und Umsatzübersicht.'] },
    interactiveHowItWorks: true,
    interactiveHowItWorksLabel: 'So funktioniert die Kundenverwaltung',
    interactiveHowItWorksHeadline: 'Kundendaten, die sich von selbst füllen.',
    steps: [
      {
        title: 'Automatisch erfasst',
        icon: 'user',
        bullets: [
          { title: 'Speicherung bei jeder Buchung automatisch', description: 'Name, E-Mail – ob Widget oder manuell angelegt.' },
          { title: 'Wiederbucher werden erkannt', description: 'Erscheinen als bestehende Kunden mit Historie.' },
          { title: 'Kein manueller Eintrag nötig', description: 'Alles läuft automatisch.' },
        ],
        reverse: false
      },
      {
        title: 'Historie einsehen',
        icon: 'list',
        bullets: [
          { title: 'Alle Buchungen pro Kunde aufgelistet', description: 'Wer hat wann was gebucht?' },
          { title: 'Zahlungs- und Rechnungshistorie', description: 'Welche Beträge sind offen?' },
          { title: 'Schnelle Antworten bei Kundenanfragen', description: 'Überblick im Kunden-Detail.' },
        ],
        reverse: true
      },
      {
        title: 'Beziehungen pflegen',
        icon: 'pencil',
        bullets: [
          { title: 'Notizen pro Kunde hinterlegen', description: 'Präferenzen oder besondere Wünsche.' },
          { title: 'Stammkunden an Historie erkennbar', description: 'Personalisierter Service ohne externe CRM-Tools.' },
          { title: 'Export geplant für weitere Auswertung', description: 'CSV-Export in Planung.' },
        ],
        reverse: false
      }
    ],
    useCases: [
      { icon: '💇', title: 'Friseure', description: 'Stammkunden und ihre Vorlieben im Blick.', link: '/features' },
      { icon: '🏥', title: 'Therapeuten', description: 'Patientenhistorie und Behandlungsverläufe.', link: '/features' },
    ],
    relatedFeatures: ['buchungen', 'rechnungen', 'analytics'],
    tags: ['kunden', 'crm', 'history', 'profiles', 'retention'],
    faq: [
      { question: 'Werden Kundendaten automatisch gespeichert?', answer: 'Ja, bei jeder Buchung werden Kontaktdaten automatisch in der Kundendatenbank hinterlegt.' },
      { question: 'Kann ich Kunden exportieren?', answer: 'Export als CSV ist in Planung.' },
      { question: 'Werden Wiederbuchungen erkannt?', answer: 'Ja. BookFast erkennt wiederkehrende Kunden anhand der E-Mail-Adresse und ordnet alle Buchungen dem gleichen Kundenprofil zu.' },
      { question: 'Kann ich Notizen zu Kunden hinterlegen?', answer: 'Ja. Im Kunden-Detail kannst du interne Notizen speichern – z. B. Präferenzen oder besondere Wünsche.' },
      { question: 'Ist die Kundenverwaltung DSGVO-konform?', answer: 'Ja. Alle Daten werden auf EU-Servern gespeichert. Du kannst Kundendaten auf Anfrage löschen.' },
    ],
  },
};
