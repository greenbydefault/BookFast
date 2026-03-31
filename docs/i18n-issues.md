# i18n Issues – Vertical Slices

Parent PRD: `docs/prd-i18n.md`

---

## Issue 1: Routen-Konsolidierung + Redirect-Bug-Fix

### Parent PRD
docs/prd-i18n.md

### What to build

Die Routen-Konfiguration ist aktuell auf mehrere Dateien verteilt (`DE_TO_EN_PATH` in `landingLocaleRoutes.js`, `LANDING_EXACT_PATHS` in `landingRoutesConfig.js`), die manuell synchron gehalten werden müssen. Außerdem fällt `getLocaleSwitchTarget` auf `/en` bzw. `/` zurück wenn eine Seite nicht in der Map steht – das verursacht den Redirect-zur-Startseite-Bug beim Sprachwechsel.

End-to-End: Eine gemeinsame `routeConfig.js` erstellen, aus der beide Listen abgeleitet werden. `getLocaleSwitchTarget` liefert für jede registrierte Route die korrekte Schwester-URL, kein Home-Fallback mehr.

### Acceptance criteria

- [ ] Neue `src/lib/routeConfig.js` mit allen DE↔EN Pfad-Paaren als Single Source of Truth
- [ ] `landingLocaleRoutes.js` importiert `DE_TO_EN_PATH` aus `routeConfig.js`
- [ ] `landingRoutesConfig.js` leitet `LANDING_EXACT_PATHS` aus `routeConfig.js` ab
- [ ] `getLocaleSwitchTarget` hat keinen Home-Fallback mehr – unbekannte Pfade behalten den aktuellen Pfad bei
- [ ] Test: jede Route in der Registry hat ein definiertes Switch-Target
- [ ] Test: Konsistenz-Check – alle `routeConfig`-Pfade sind in der Registry registriert
- [ ] Bestehende Tests in `landingLocaleRoutes.test.js` und `landingRoutesConfig.test.js` passen weiterhin

### Blocked by

None – kann sofort starten.

### User stories addressed

- User Story 8: Sprachwechsel auf Unterseiten
- User Story 18: Routen-Config an einer Stelle
- User Story 19: Neue Seiten ohne Routing-Infrastruktur-Änderung

---

## Issue 2: Locale-Parameter durch Router + Registry + Content-Loader

### Parent PRD
docs/prd-i18n.md

### What to build

Der Router (`landingRouter.js`) erkennt die Locale bereits aus dem Pfad, reicht sie aber nicht an Render-Funktionen weiter. Alle Renderer bekommen jetzt `locale` als Parameter. Ein neuer `getLocaleContent`-Helper lädt das richtige Locale-Objekt mit DE-Fallback.

End-to-End: Als Tracer-Bullet wird die HomePage mit dem neuen Locale-Parameter gerendert (Verhalten bleibt identisch, weil sie schon EN-Support hat). Alle anderen Renderer akzeptieren den Parameter, ignorieren ihn aber vorerst.

### Acceptance criteria

- [ ] `landingRouter.js`: Render-Callback erhält `locale` als Parameter
- [ ] `registry.js`: Alle `register*`-Aufrufe übergeben `locale` an Render-Funktionen
- [ ] Neuer `src/lib/getLocaleContent.js` mit `getFeaturePage(slug, locale)` und generischem `getLocaleContent(locale, pageKey)`
- [ ] Fallback: `getFeaturePage('buchungen', 'en')` gibt DE-Objekt zurück wenn kein EN vorhanden
- [ ] `getFeaturePage('unbekannt', 'en')` gibt `null`/`undefined` zurück (kein Crash)
- [ ] Alle bestehenden Seiten rendern weiterhin korrekt (kein Breaking Change)
- [ ] Tests für `getLocaleContent`/`getFeaturePage`: EN-Objekt, DE-Fallback, unbekannter Slug

### Blocked by

- Blocked by Issue 1 (konsolidierte Routen-Config)

### User stories addressed

- User Story 16: Wartbare EN-Texte
- User Story 17: Automatischer DE-Fallback

---

## Issue 3: Shared Strings + Navigation EN

### Parent PRD
docs/prd-i18n.md

### What to build

Navigation und wiederkehrende UI-Strings (CTAs, Breadcrumbs) werden auf EN-Seiten ins Englische übersetzt.

End-to-End: `locales/en/shared.js` mit CTA-Defaults und Breadcrumb-Labels. `locales/en/navigation.js` mit Nav-Labels, Mega-Menü-Kategorien, CTAs, ARIA-Texten. `Navigation.js` nutzt die Locale um die richtigen Strings anzuzeigen, inklusive englischer Feature-Titel im Mega-Menü.

### Acceptance criteria

- [ ] `src/locales/en/shared.js` existiert mit CTA-Defaults ("Start free trial", "Start live demo"), Breadcrumb-Labels ("Home", "Features"), Fehler-Texten
- [ ] `src/locales/en/navigation.js` existiert mit Nav-Labels, Kategorien ("Product" statt "Produkt"), CTA-Buttons, ARIA-Labels
- [ ] `Navigation.js` zeigt auf `/en/...` englische Labels, Kategorien, Feature-Titel und CTAs
- [ ] Mega-Menü Feature-Beschreibungen sind auf EN-Seiten englisch
- [ ] Mobile-Menü ist ebenfalls übersetzt
- [ ] Demobar: Navigation auf `/en` ist komplett englisch

### Blocked by

- Blocked by Issue 2 (Locale-Parameter)

### User stories addressed

- User Story 2: EN Navigation und CTAs
- User Story 13: EN CTA-Buttons
- User Story 14: EN Mega-Menü Feature-Titel

---

## Issue 4: Footer EN

### Parent PRD
docs/prd-i18n.md

### What to build

Footer zeigt auf EN-Seiten englische Feature-Link-Texte. `footerChrome.js` (Spaltenüberschriften, Legal-Labels) ist schon zweisprachig – es fehlen nur die Feature-Titel und -Links.

End-to-End: `Footer.js` liest Feature-Titel aus EN-Feature-Daten wenn `locale === 'en'`. Links zeigen auf `/en/features/...`.

### Acceptance criteria

- [ ] Footer auf `/en` zeigt englische Feature-Link-Texte (nicht deutsche `meta.title`)
- [ ] Footer-Links auf EN-Seiten zeigen auf `/en/features/:enSlug`
- [ ] Footer-Chrome (Spaltenüberschriften, Legal) funktioniert weiterhin korrekt (schon implementiert)
- [ ] Demobar: Footer auf `/en` ist komplett englisch

### Blocked by

- Blocked by Issue 2 (Locale-Parameter)

### User stories addressed

- User Story 15: EN Footer Feature-Links

---

## Issue 5: Feature-Seiten EN – Core (6 Features)

### Parent PRD
docs/prd-i18n.md

### What to build

Die 6 Core-Features (buchungen, zahlungen, rechnungen, analytics, objekte, services) werden komplett ins Englische übersetzt. Das `FeaturePageTemplate` wird locale-aware.

End-to-End: `locales/en/features/core.js` mit 6 vollständigen Feature-Objekten (Meta, Hero, Steps, FAQ, CTA, Journey etc.). `FeaturePageTemplate.js` lädt per `getFeaturePage(slug, locale)` das richtige Objekt. Breadcrumbs, Related-Slider-Links, FAQ-Sektion zeigen EN-Content.

### Acceptance criteria

- [ ] `src/locales/en/features/core.js` existiert mit 6 vollständigen Feature-Objekten
- [ ] Datei ist unter 600 Zeilen
- [ ] `FeaturePageTemplate.js` nutzt `getFeaturePage(slug, locale)` für Content
- [ ] Breadcrumbs auf EN-Seiten: "Home > Features > Bookings" (nicht "Home > Features > Buchungen")
- [ ] Breadcrumb-URLs auf EN-Seiten: `/en` und `/en/features`
- [ ] FAQ-Sektion zeigt englische Fragen/Antworten
- [ ] CTA-Sektion zeigt englischen Text
- [ ] `FeatureRelatedSlider.js` verlinkt auf `/en/features/:enSlug` auf EN-Seiten
- [ ] SEO-Meta (Title, Description, OG) kommen aus dem EN-Objekt
- [ ] Demobar: `/en/features/bookings` zeigt komplett englischen Content
- [ ] Test: `getFeaturePage('buchungen', 'en')` liefert Objekt mit `meta.title`, `hero.headline`, `faq`, `cta`

### Blocked by

- Blocked by Issue 2 (Locale-Parameter + Content-Loader)
- Blocked by Issue 3 (Breadcrumb-Labels aus shared.js)

### User stories addressed

- User Story 1: EN Feature-Seiten
- User Story 9: EN SEO-Meta
- User Story 10: EN Breadcrumbs
- User Story 11: EN Related-Slider-Links
- User Story 12: EN FAQ

---

## Issue 6: Feature-Seiten EN – Special (9 Features)

### Parent PRD
docs/prd-i18n.md

### What to build

Die 9 Special-Features (verfuegbarkeit, buffer, zeitfenster, approval, overnight, workspaces, urlaub, email-templates, kaution) werden komplett ins Englische übersetzt.

### Acceptance criteria

- [ ] `src/locales/en/features/special.js` existiert mit 9 vollständigen Feature-Objekten
- [ ] Datei ist unter 600 Zeilen (ggf. aufteilen)
- [ ] Alle 9 EN-Feature-Seiten rendern korrekt unter `/en/features/:enSlug`
- [ ] Demobar: `/en/features/time-slots` zeigt komplett englischen Content

### Blocked by

- Blocked by Issue 5 (FeaturePageTemplate ist schon locale-aware)

### User stories addressed

- User Story 1: EN Feature-Seiten
- User Story 12: EN FAQ

---

## Issue 7: Feature-Seiten EN – Management + Platform (6 Features)

### Parent PRD
docs/prd-i18n.md

### What to build

Die 4 Management-Features (mitarbeiter, addons, gutscheine, kunden) und 2 Platform-Features (integration, kundenportal) werden komplett ins Englische übersetzt.

### Acceptance criteria

- [ ] `src/locales/en/features/management.js` existiert mit 4 vollständigen Feature-Objekten
- [ ] `src/locales/en/features/platform.js` existiert mit 2 vollständigen Feature-Objekten
- [ ] Beide Dateien unter 600 Zeilen
- [ ] Alle 6 EN-Feature-Seiten rendern korrekt
- [ ] Demobar: `/en/features/staff` zeigt komplett englischen Content

### Blocked by

- Blocked by Issue 5 (FeaturePageTemplate ist schon locale-aware)

### User stories addressed

- User Story 1: EN Feature-Seiten
- User Story 12: EN FAQ

---

## Issue 8: Feature-Demo-Karten EN

### Parent PRD
docs/prd-i18n.md

### What to build

Die Feature-Demo-Karten (AnalyticsPreviewCard, BufferPreviewCard, OvernightPreviewCard, UrlaubPreviewCard, WorkspacesPreviewCard, ZeitfensterPreviewCard und ggf. weitere) enthalten hardcoded deutsche UI-Mock-Texte. Diese werden locale-aware gemacht.

### Acceptance criteria

- [ ] Alle Feature-Demo-Karten akzeptieren `locale` als Parameter
- [ ] Tabellen-Header, Button-Labels, Platzhalter-Daten sind auf EN-Seiten englisch
- [ ] Mock-UI sieht auf beiden Sprachen korrekt aus (kein Layout-Bruch durch längere/kürzere Texte)
- [ ] Demobar: Demo-Karte auf `/en/features/analytics` zeigt englische Labels

### Blocked by

- Blocked by Issue 5 (Feature-Template muss locale-aware sein)

### User stories addressed

- User Story 6: EN Demo-Karten

---

## Issue 9: Features-Hub EN

### Parent PRD
docs/prd-i18n.md

### What to build

Die Features-Übersichtsseite (`/en/features`) wird ins Englische übersetzt.

End-to-End: `locales/en/featuresHub.js` mit Hero, Kategorien, CTA. `FeaturesHubPage.js` zeigt auf EN: englische Kategorie-Namen, Feature-Karten mit EN-Titeln, Links auf `/en/features/:enSlug`.

### Acceptance criteria

- [ ] `src/locales/en/featuresHub.js` existiert mit Hero, Kategorien, CTA-Texten
- [ ] Feature-Karten auf `/en/features` zeigen englische Titel und Beschreibungen
- [ ] Karten-Links zeigen auf `/en/features/:enSlug` (nicht auf `/features/:deSlug`)
- [ ] SEO-Meta für `/en/features` ist englisch
- [ ] Demobar: `/en/features` ist komplett englisch

### Blocked by

- Blocked by Issue 5 (braucht EN-Feature-Daten für Karten-Titel)

### User stories addressed

- User Story 1: EN Feature-Seiten
- User Story 9: EN SEO-Meta

---

## Issue 10: Pricing EN

### Parent PRD
docs/prd-i18n.md

### What to build

Die Pricing-Seite wird komplett ins Englische übersetzt, inklusive Plan-Definitionen, Feature-Listen, FAQ und PricingCard-Labels.

### Acceptance criteria

- [ ] `src/locales/en/pricing.js` existiert mit Plans, Feature-Listen, FAQ, Badges, Founder-Text
- [ ] `PricingPage.js` nutzt Locale-Parameter für Content
- [ ] `PricingCard.js` zeigt englische Labels ("Monthly"/"Yearly", "Workspaces", "2 months free" etc.)
- [ ] SEO-Meta für `/en/pricing` ist englisch
- [ ] Demobar: `/en/pricing` ist komplett englisch

### Blocked by

- Blocked by Issue 2 (Locale-Parameter)

### User stories addressed

- User Story 3: EN Pricing
- User Story 9: EN SEO-Meta

---

## Issue 11: Produkt + Integrationen + About + Kontakt EN

### Parent PRD
docs/prd-i18n.md

### What to build

Die 4 Marketing-Seiten (Produkt, Integrationen, Über uns, Kontakt) werden ins Englische übersetzt.

### Acceptance criteria

- [ ] `src/locales/en/product.js`, `integrations.js`, `about.js`, `contact.js` existieren
- [ ] Alle 4 Dateien unter 600 Zeilen
- [ ] Jeweilige Page-Renderer nutzen Locale-Parameter
- [ ] SEO-Meta für alle 4 EN-Seiten ist englisch
- [ ] Kontakt-Formular-Labels sind englisch
- [ ] Demobar: `/en/product`, `/en/integrations`, `/en/about`, `/en/contact` sind komplett englisch

### Blocked by

- Blocked by Issue 2 (Locale-Parameter)

### User stories addressed

- User Story 4: EN Marketing-Seiten
- User Story 9: EN SEO-Meta

---

## Issue 12: Legal-Seiten EN (HITL)

### Parent PRD
docs/prd-i18n.md

### What to build

Impressum, Datenschutz und AGB werden ins Englische übersetzt. **HITL**: AI-Übersetzung als Startpunkt, juristische Prüfung vor Go-Live erforderlich.

### Acceptance criteria

- [ ] `src/locales/en/legal/impressum.js`, `datenschutz.js`, `agb.js` existieren
- [ ] Page-Renderer nutzen Locale-Parameter
- [ ] Demobar: `/en/imprint`, `/en/privacy`, `/en/terms` zeigen englischen Content
- [ ] HITL: Juristische Prüfung der Übersetzungen vor Veröffentlichung abgeschlossen

### Blocked by

- Blocked by Issue 2 (Locale-Parameter)

### User stories addressed

- User Story 5: EN Legal-Seiten

---

## Issue 13: 404 + Waitlist-Confirm EN

### Parent PRD
docs/prd-i18n.md

### What to build

404-Seite und Waitlist-Bestätigungsseite werden ins Englische übersetzt.

### Acceptance criteria

- [ ] `src/locales/en/notFound.js` und `waitlistConfirm.js` existieren
- [ ] 404 auf EN zeigt englischen Text, Home-Link zeigt auf `/en`
- [ ] Waitlist-Confirm auf EN zeigt englischen Bestätigungstext
- [ ] Demobar: `/en/nonexistent` zeigt englische 404, `/en/waitlist/confirm` zeigt englische Bestätigung

### Blocked by

- Blocked by Issue 2 (Locale-Parameter)

### User stories addressed

- User Story 7: EN 404 + Waitlist

---

## Issue 14: SEO locale-aware + hreflang

### Parent PRD
docs/prd-i18n.md

### What to build

`seoHelper.js` wird vollständig locale-aware. hreflang-Tags werden auf allen Seiten gesetzt.

### Acceptance criteria

- [ ] `DEFAULT_TITLE` hat EN-Variante
- [ ] `setProductSchema` generiert englische Offer-Namen für EN-Seiten
- [ ] `setContactPageSchema` generiert EN-URL und EN-Name für EN-Seiten
- [ ] `setBreadcrumbSchema` generiert Locale-korrekte URLs und Labels
- [ ] hreflang-Alternates (`de` + `en`) auf allen Seiten gesetzt
- [ ] `og:locale` ist `de_DE` auf DE und `en_US` auf EN
- [ ] `HeroNew.js`: EN-Default-Headline und englischer Fehler-Text statt `alert('Die Demo konnte nicht gestartet werden…')`
- [ ] Demobar: View-Source auf EN-Seiten zeigt korrekte Meta-Tags, hreflang, JSON-LD

### Blocked by

- Blocked by Issue 2 (Locale-Parameter überall verfügbar)

### User stories addressed

- User Story 9: EN SEO-Meta
- User Story 10: EN Breadcrumb-Schema
- User Story 20: hreflang-Tags
- User Story 21: og:locale korrekt

---

## Dependency Graph

```
Issue 1 (Routen-Konsolidierung)
  └── Issue 2 (Locale-Parameter + Content-Loader)
        ├── Issue 3 (Navigation EN)
        ├── Issue 4 (Footer EN)
        ├── Issue 5 (Features Core EN)
        │     ├── Issue 6 (Features Special EN)
        │     ├── Issue 7 (Features Management+Platform EN)
        │     ├── Issue 8 (Feature-Demo-Karten EN)
        │     └── Issue 9 (Features-Hub EN)
        ├── Issue 10 (Pricing EN)
        ├── Issue 11 (Produkt+Integrationen+About+Kontakt EN)
        ├── Issue 12 (Legal EN) [HITL]
        ├── Issue 13 (404+Waitlist EN)
        └── Issue 14 (SEO + hreflang)
```

Issues 3-14 können nach Issue 2 **parallel** bearbeitet werden (außer 6, 7, 8, 9 brauchen Issue 5).
