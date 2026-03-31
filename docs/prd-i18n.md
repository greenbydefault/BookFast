# PRD: Vollständiges i18n-System für BookFast Landing Pages

## Problem Statement

Die BookFast Landing Page hat ein halb-fertiges Übersetzungssystem. Englische URLs existieren (`/en/...`), aber fast alle Inhalte werden weiterhin auf Deutsch angezeigt – Feature-Seiten, Pricing, Navigation, CTAs, SEO-Meta, Demo-Karten, Legal-Seiten. Der Sprachwechsel auf Unterseiten leitet zur Startseite zurück statt zur entsprechenden EN/DE-Unterseite. Nur die Homepage und der Footer-Chrome sind bisher zweisprachig.

Das System muss so erweitert werden, dass:
- Alle Module auf allen Seiten korrekt übersetzt werden
- Der Sprachwechsel die aktuelle Seite beibehält
- EN-Texte einfach wartbar und editierbar sind (strukturierte Objekte, keine riesigen Dateien)
- Performance und Bundlegröße nicht leiden

## Solution

Das bestehende pfad-basierte Locale-System wird vervollständigt:
- Locale wird als expliziter Parameter vom Router an alle Renderer durchgereicht
- EN-Texte werden als vollständige, strukturierte Objekte in `src/locales/en/` gepflegt (Mirror-Struktur zu den DE-Daten)
- Deutsch bleibt als Default im Code, nur EN wird separat gepflegt
- Kein i18n-Framework – passt nicht zur Vanilla-JS/innerHTML-Architektur
- Ein kleiner `getLocaleContent()`-Helper lädt das richtige Locale-Objekt mit DE-Fallback
- Alle 21 Feature-Seiten, 8 Marketing-Seiten, 3 Legal-Seiten, Navigation, Footer, Demo-Karten werden komplett übersetzt
- EN-Texte werden per AI-Übersetzung erstellt und manuell nachbearbeitet

## User Stories

1. Als EN-sprechender Besucher will ich alle Feature-Seiten auf Englisch lesen, damit ich das Produkt verstehe
2. Als EN-sprechender Besucher will ich die Navigation, Menü-Labels und CTAs auf Englisch sehen, damit die gesamte UX konsistent ist
3. Als EN-sprechender Besucher will ich die Pricing-Seite auf Englisch sehen, damit ich die Preisstruktur verstehe
4. Als EN-sprechender Besucher will ich die Produkt-, Integrations-, About- und Kontakt-Seiten auf Englisch lesen
5. Als EN-sprechender Besucher will ich Legal-Seiten (Imprint, Privacy, Terms) auf Englisch lesen
6. Als EN-sprechender Besucher will ich die Feature-Demo-Karten (Analytics, Buffer, Zeitfenster etc.) mit englischen Labels sehen
7. Als EN-sprechender Besucher will ich die 404-Seite und Waitlist-Bestätigung auf Englisch sehen
8. Als Besucher auf einer Unterseite will ich die Sprache wechseln und auf der äquivalenten Seite der anderen Sprache landen (nicht auf der Startseite)
9. Als Besucher will ich, dass SEO-Meta (Title, Description, OG-Tags) zur angezeigten Sprache passen
10. Als Besucher will ich, dass Breadcrumbs und JSON-LD Schema zur aktuellen Sprache passen
11. Als Besucher will ich, dass der FeatureRelatedSlider auf EN-Seiten zu EN-Feature-URLs verlinkt
12. Als Besucher will ich, dass die FAQ-Sektion auf EN-Feature-Seiten englische Fragen/Antworten zeigt
13. Als Besucher will ich, dass CTA-Buttons ("Live Demo starten", "Kostenlos testen") auf EN-Seiten englisch sind
14. Als Besucher will ich, dass das Mega-Menü auf EN-Seiten englische Feature-Titel und -Beschreibungen zeigt
15. Als Besucher will ich, dass der Footer auf EN-Seiten englische Feature-Link-Texte zeigt
16. Als Entwickler will ich EN-Texte in übersichtlichen Dateien (<600 Zeilen) pflegen, die die gleiche Struktur wie die DE-Daten haben
17. Als Entwickler will ich, dass fehlende EN-Übersetzungen automatisch auf DE zurückfallen, statt Fehler zu werfen
18. Als Entwickler will ich, dass die Routen-Konfiguration (Landing-Pfade, Locale-Switch-Pfade) an einer Stelle definiert ist, nicht doppelt gepflegt werden muss
19. Als Entwickler will ich, dass neue Feature-Seiten ohne Änderung der Routing-Infrastruktur hinzugefügt werden können
20. Als Suchmaschine will ich korrekte hreflang-Tags auf allen Seiten sehen, die DE- und EN-Versionen verknüpfen
21. Als Suchmaschine will ich, dass `og:locale` korrekt für jede Sprachversion gesetzt ist

## Implementation Decisions

### Architektur

- **Kein i18n-Framework**: Strukturierte Objekte pro Seite/Bereich. Passt zur Vanilla-JS/innerHTML-Architektur, kein Bundle-Overhead
- **DE als Default im Code**: Deutsche Texte bleiben wo sie sind (data/features/, Komponenten, Pages). Nur EN wird in `src/locales/en/` extrahiert
- **Vollständige EN-Objekte**: EN-Locale-Dateien enthalten komplette Objekte (nicht nur Text-Deltas zum Mergen mit DE). Vermeidet Merge-Bugs, ist leichter lesbar
- **Mirror-Dateistruktur**: EN-Dateien spiegeln die DE-Dateistruktur (z.B. `locales/en/features/core.js` spiegelt `data/features/core.js`)
- **Nur DE + EN**: Kein generisches Multi-Language-System, `'de'|'en'` reicht
- **Max 500-600 Zeilen pro Datei**

### Locale-Passing

- **Locale als expliziter Parameter**: Router erkennt Locale aus Pfad, reicht sie als `locale`-Parameter an `render*(locale)` weiter
- Alle Render-Funktionen in `registry.js` erhalten `(locale)` bzw. `(slug, locale)`
- Komponenten wie Navigation, Footer, CTASection erhalten Locale als Parameter oder lesen sie aus dem Pfad

### Locale-Content-Loading

- Neuer Helper `getLocaleContent(locale, page)`: gibt das richtige Locale-Objekt zurück, Fallback auf DE wenn EN fehlt
- Speziell für Features: `getFeaturePage(slug, locale)` liefert EN-Feature-Objekt oder DE-Fallback

### Routen-Konsolidierung

- `DE_TO_EN_PATH` (in `landingLocaleRoutes.js`) und `LANDING_EXACT_PATHS` (in `landingRoutesConfig.js`) werden aus einer gemeinsamen Quelle abgeleitet, um Sync-Probleme zu vermeiden
- Redirect-Bug-Fix: `getLocaleSwitchTarget` bekommt vollständige Pfad-Map, kein Fallback auf Home mehr

### EN-Locale-Dateistruktur (Ziel)

```
src/locales/en/
  homePage.js          (existiert)
  navigation.js        (Nav-Labels, Kategorien, CTAs, ARIA)
  shared.js            (CTA-Defaults, Breadcrumb-Labels, Fehler-Texte)
  features/
    core.js            (6 Features: buchungen, zahlungen, rechnungen, analytics, objekte, services)
    special.js         (9 Features: verfuegbarkeit, buffer, zeitfenster, approval, overnight, workspaces, urlaub, email-templates, kaution)
    management.js      (4 Features: mitarbeiter, addons, gutscheine, kunden)
    platform.js        (2 Features: integration, kundenportal)
  featuresHub.js
  pricing.js
  product.js
  integrations.js
  about.js
  contact.js
  notFound.js
  waitlistConfirm.js
  legal/
    impressum.js
    datenschutz.js
    agb.js
src/locales/
  footerChrome.js      (existiert, DE+EN in einer Datei)
```

### SEO

- Meta-Titel und -Description kommen aus den gleichen Locale-Objekten wie der Seiten-Content (`meta.title`, `meta.description`)
- `seoHelper.js` wird locale-aware: `DEFAULT_TITLE`, `setProductSchema`, `setContactPageSchema`, Breadcrumb-Schema
- hreflang-Alternates werden für alle Seiten gesetzt

### Betroffene Dateien (Änderungen)

- `src/lib/landingRouter.js` – Locale an Render-Callbacks weiterreichen
- `src/pages/landing/registry.js` – Alle Registrierungen: Locale-Parameter
- `src/lib/landingLocaleRoutes.js` – Vollständige Pfad-Map, kein Home-Fallback
- `src/lib/landingRoutesConfig.js` – Aus gemeinsamer Quelle ableiten
- `src/lib/seoHelper.js` – Locale-Parameter, EN-Defaults
- `src/components/landing/Navigation.js` – EN-Labels, Feature-Titel
- `src/components/landing/Footer.js` – EN-Feature-Link-Texte
- `src/components/landing/CTASection.js` – EN-Defaults
- `src/pages/landing/features/FeaturePageTemplate.js` – Locale-Content-Loading, EN-Breadcrumbs
- `src/pages/landing/FeaturesHubPage.js` – EN-Kategorien, Links
- Alle Page-Renderer (HomePage, PricingPage, ProductPage, etc.)
- 6+ Feature-Demo-Karten (AnalyticsPreviewCard, BufferPreviewCard, etc.)
- `src/components/landing/HeroNew.js` – EN-Default-Headline, alert-Text
- `src/components/landing/FeatureRelatedSlider.js` – EN-Feature-URLs

### Betroffene Dateien (Neu)

- `src/lib/getLocaleContent.js` – Locale-Loader-Helper
- `src/lib/routeConfig.js` – Gemeinsame Pfad-Konfiguration
- 15+ EN-Locale-Dateien (siehe Dateistruktur oben)

## Testing Decisions

### Philosophie

Tests prüfen Verhalten durch öffentliche Interfaces, nicht Implementierungsdetails. Ein Test liest sich wie eine Spezifikation: "Locale-Switch auf /preise führt zu /en/pricing" – nicht "DE_TO_EN_PATH hat 12 Einträge".

### Was getestet wird

1. **Routing/Locale-Logik** (kritischster Pfad):
   - `getLocaleSwitchTarget` liefert für JEDE registrierte Route die korrekte Schwester-URL
   - `getLocaleFromPath` erkennt DE/EN korrekt für alle Pfad-Varianten
   - Konsolidierte Routen-Config ist konsistent (jede Registry-Route hat einen Switch-Target)

2. **Locale-Content-Loading**:
   - `getFeaturePage(slug, 'en')` liefert EN-Objekt mit allen erwarteten Feldern
   - `getFeaturePage(slug, 'en')` fällt auf DE zurück wenn EN fehlt
   - `getFeaturePage(unknownSlug, 'en')` gibt null/undefined zurück (kein Crash)
   - Analog für `getLocaleContent` bei Marketing-Seiten

### Was NICHT getestet wird

- Inhaltliche Korrektheit der Übersetzungen (Content-Review, kein Code-Test)
- Rendering-Output der Seiten (innerHTML-Strings zu testen wäre Implementation-Testing)
- Individuelle Komponenten-Internals

### Bestehende Test-Patterns

Tests nutzen Vitest (`describe`/`it`/`expect`), eine Datei pro Modul (`*.test.js`). Bestehende Tests in `landingLocale.test.js`, `landingLocaleRoutes.test.js`, `featureSlugLocale.test.js`, `landingRoutesConfig.test.js` dienen als Vorlage.

## Out of Scope

- **Weitere Sprachen** (FR, ES etc.) – nur DE + EN
- **Dashboard/App-Übersetzung** – nur Landing Pages
- **Juristische Prüfung** der Legal-Übersetzungen – die AI-Übersetzung ist ein Startpunkt, rechtliche Validierung ist separater Prozess
- **Automatische Spracherkennung** (Browser-Language, GeoIP) – Sprache kommt aus der URL
- **Locale-Persistenz** (Cookie/localStorage) – nicht nötig, URL ist Source of Truth
- **CMS/Backend für Übersetzungen** – Texte werden als Code-Dateien gepflegt

## Further Notes

- Die 21 Feature-Seiten sind der größte Content-Block (~400-600 Zeilen pro Kategorie-Datei)
- Feature-Demo-Karten (AnalyticsPreviewCard etc.) haben 200-400 Zeilen UI-Mock-Text – signifikanter Aufwand
- Legal-Übersetzungen (Impressum, Datenschutz, AGB) sollten vor Veröffentlichung juristisch geprüft werden
- Die PricingPage ist mit 317 Zeilen die komplexeste Marketing-Seite (eigene Plan-Definitionen, Feature-Listen, FAQ)
- `seoHelper.js` hat 301 Zeilen mit mehreren Schema-Generatoren die locale-aware werden müssen
- Die Implementierung folgt der Reihenfolge: Infrastruktur → Shared/Chrome → Seiten einzeln → SEO/Cleanup → Tests

### Metriken

- 21 Feature-Slugs (6 core, 9 special, 4 management, 2 platform)
- 12 statische Marketing-Routen pro Sprache
- 21 DE→EN Slug-Mappings für Feature-URLs
- ~15 neue EN-Locale-Dateien zu erstellen
- ~20 bestehende Dateien anzupassen
