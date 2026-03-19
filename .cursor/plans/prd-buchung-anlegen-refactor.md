# PRD: Buchung Anlegen — Refactor & Bug-Fix

## Problem Statement

Das Dashboard-Modal "Buchung Anlegen" — genutzt wenn Kunden per Telefon oder E-Mail buchen — ist als einzelne 1206-Zeilen-Datei implementiert. Das macht Weiterentwicklung, Debugging und Code-Reviews aufwändig. Gleichzeitig gibt es zwei aktive Bugs: (1) ein nicht verfügbarer Termin blockiert die Buchung nicht wirklich, sondern zeigt nur eine stumme Warnung — Staff kann trotzdem auf "Weiter" klicken. (2) Fehlermeldungen erscheinen als `window.alert()`-Dialoge, die den Browser blockieren und weit weg vom Fokus aufpoppen.

## Solution

Das Modal wird in kleine, verantwortungsklare Module aufgeteilt. Gleichzeitig wird der Availability-Check hart geblockt (kein Weiter bei nicht verfügbarem Termin), und `alert()`-Dialoge werden durch kontextnahes Inline-Feedback ersetzt — kein separates Toast-System, sondern Fehlermeldungen direkt neben dem betroffenen Element.

## User Stories

1. Als Dashboard-Nutzer möchte ich beim Anlegen einer Buchung, dass ich keinen nicht-verfügbaren Termin bestätigen kann, damit ich keine doppelten Buchungen anlege.
2. Als Dashboard-Nutzer möchte ich bei einem nicht verfügbaren Termin eine klare Fehlermeldung direkt unter dem Kalender sehen, damit ich sofort verstehe was ich tun muss.
3. Als Dashboard-Nutzer möchte ich, dass der "Weiter"-Button bei Step 4 (Termin) deaktiviert ist wenn der gewählte Termin nicht verfügbar ist, damit keine versehentlichen Klicks möglich sind.
4. Als Dashboard-Nutzer möchte ich Validierungsfehler direkt neben dem betroffenen Feld/Bereich sehen (nicht als `alert()`-Dialog), damit ich ohne Browser-Dialog-Unterbrechung weiterarbeiten kann.
5. Als Dashboard-Nutzer möchte ich beim Absenden der Buchung einen Lade-Indikator am Submit-Button sehen, damit ich weiß dass etwas passiert.
6. Als Dashboard-Nutzer möchte ich nach erfolgreicher Buchungsanlage, dass das Modal sich schließt und die Buchungsliste automatisch aktualisiert, ohne separaten "Erfolg"-Dialog.
7. Als Dashboard-Nutzer möchte ich bei einem Server-Fehler beim Submit eine Fehlermeldung direkt im Modal (nicht als Alert), damit ich reagieren kann ohne den Browser-Dialog wegklicken zu müssen.
8. Als Entwickler möchte ich, dass die Preisberechnung als eigenständiges Modul existiert, damit ich sie isoliert testen kann ohne das gesamte Modal zu laden.
9. Als Entwickler möchte ich, dass Addon-Logik (State + Rendering) als eigenständiges Modul existiert, damit Änderungen an Addons nicht das gesamte Modal betreffen.
10. Als Entwickler möchte ich, dass Step-Rendering als eigenständiges Modul existiert, damit neue Steps hinzugefügt werden können ohne die Haupt-Modal-Datei anzufassen.
11. Als Entwickler möchte ich, dass Submit-Logik und Validierung als eigenständiges Modul existiert, damit diese unabhängig getestet werden kann.
12. Als Entwickler möchte ich, dass das Haupt-Modal-File nach dem Refactor maximal ~200 Zeilen hat (nur Orchestrierung: `renderModal`, `bindEvents`, `openModal`, `closeModal`), damit ich schnell den Einstiegspunkt finde.
13. Als Entwickler möchte ich, dass toter Code (`loadData()`) entfernt ist, damit keine Verwirrung über nicht-aufgerufene Funktionen entsteht.
14. Als Entwickler möchte ich, dass duplizierter Code in `renderAddonItemControl` dedupliziert ist, damit Änderungen an Addon-Controls nur an einer Stelle gemacht werden müssen.

## Implementation Decisions

### Module die erstellt/verändert werden

**Neues Modul: `createBookingPricing.js`**
- Kapselt die gesamte Preisberechnung (derzeit inline im SUMMARY-Step von `getStepContent`)
- Interface: `calculateBookingPrice(state)` → `{ subtotal, cleaningFee, addonTotal, total, breakdown[] }`
- Pure Funktion, keine Seiteneffekte, kein DOM-Zugriff
- Wiederverwendbar für zukünftige Preisvorschau in früheren Steps

**Neues Modul: `createBookingAddons.js`**
- Kapselt: `buildDefaultItem`, `buildBookingItems`, `buildGuestItems`, `getAddonSelection`, `toggleAddonSelection`, `syncAddonGuestsToGuestCount`, `updateAddonItemSelection`, `renderAddonItemControl`, `renderAddonConfiguration`, `buildAddonSelectionsPayload`
- State-Mutations arbeiten auf dem `modalState`-Objekt das per Referenz übergeben wird

**Neues Modul: `createBookingSteps.js`**
- Kapselt: `getStepContent(state)` — der 198-Zeilen-Switch über alle 6 Steps
- Importiert `createBookingPricing.js` für den SUMMARY-Step
- Importiert `createBookingAddons.js` für den ADDONS-Step

**Neues Modul: `createBookingSubmit.js`**
- Kapselt: `handleNext(state, callbacks)`, `handleSubmit(state, callbacks)`, Validierungslogik
- `callbacks`: `{ onStepChange, onError, onSuccess, onLoading }` — damit keine direkte DOM-Manipulation im Submit-Modul
- Availability-Hard-Block: `handleNext` bei Step 4 prüft `state.availabilityStatus === 'unavailable'` und ruft `callbacks.onError` auf statt weiterzumachen

**Verändert: `CreateBookingModal.js`**
- Wird auf ~200 Zeilen reduziert
- Enthält nur noch: `renderModal()`, `bindEvents()`, `openCreateBookingModal()`, `closeModal()`
- Importiert alle neuen Module
- `showToast` (alert-Stub) wird entfernt
- `loadData()` (toter Code) wird entfernt

**Unverändertes: `createBookingState.js`, `createBookingAvailability.js`**
- Bereits sauber, keine Änderung nötig

### Feedback-System (kein Toast)

Kernprinzip (nach Max Schmitt "Toasts are Bad UX"): Feedback erscheint dort wo der User hinschaut, nicht in einer Ecke.

- **Validierungsfehler** → Inline unter dem betroffenen Bereich per `.modal-form-error.visible`-Klasse (existiert bereits in `Modal.css`)
- **Submit-Loading** → Submit-Button zeigt Spinner + `disabled`-Attribut (analog zu Settings Auto-Save Pattern)
- **Submit-Erfolg** → Modal schließt sich, `bookings:refresh` Custom Event löst Listenaktualisierung aus — die verschwundene Buchung aus dem "Neu"-Status und ihr Erscheinen in der Liste ist die Bestätigung
- **Submit-Fehler** → Inline-Fehler-Banner am oberen Rand des Modal-Body, sichtbar bis zur nächsten Aktion
- **Availability-Fehler** → Inline direkt unter dem Kalender/Datumswähler

### Availability Hard-Block

- Wenn `checkAvailability()` `false` zurückgibt: `modalState.availabilityStatus = 'unavailable'`
- `renderModal()` rendert dann den "Weiter"-Button mit `disabled`-Attribut
- Inline-Fehlermeldung erscheint direkt unter dem Kalender: "Dieser Termin ist nicht verfügbar."
- Kein Umweg über Toast oder alert()
- Wenn Nutzer ein anderes Datum wählt und dieses verfügbar ist: Status wird `available`, Button wird wieder aktiv

### State Management

- Module-Level Singleton `modalState` bleibt (Vanilla JS Pattern)
- `initialModalState()` wird in `openCreateBookingModal()` aufgerufen — sichert vollständiges Reset
- Kein Framework-Wechsel

## Testing Decisions

**Was gute Tests ausmacht:** Tests prüfen ausschließlich externes Verhalten (Output bei gegebenem Input), nicht interne Implementierungsdetails wie Funktionsnamen oder Dateistruktur.

**Module die getestet werden:**

- `createBookingPricing.js` — Pure Funktionen mit numerischen Inputs/Outputs. Testfälle: `per_total` vs `per_person` Pricing, Nächte-Berechnung, Addon-Summen, Reinigungsgebühr-Logik. Kein DOM nötig.
- `createBookingSubmit.js` — Validierungslogik per Step. Testfälle: fehlende Pflichtfelder, unavailable-Block bei Step 4, erfolgreicher Submit-Flow mit gemockten callbacks.
- `createBookingAvailability.js` — Bereits isoliert, bereits gut geeignet. Testfälle: Slot-Generierung, Fenster-Auflösung, Überlappungsprüfung.

**Nicht getestet (DOM-abhängig):**
- `createBookingSteps.js` (HTML-Generierung) — kein sinnvoller Isolated-Test möglich ohne DOM
- `createBookingAddons.js` (State-Mutations + Rendering) — State-Mutations könnten getestet werden, aber geringer ROI

## Out of Scope

- Kein Framework-Wechsel (React, Vue, etc.)
- Keine Änderung am 6-Step-Flow oder an der UX-Struktur der einzelnen Steps
- Keine Änderung an der Edge Function `manual-booking-create`
- Keine Änderung an `bookingService.js`
- Kein globales Toast/Notification-System für den Rest des Dashboards — nur das Buchungs-Modal
- Keine Einführung von Serien-/Wiederkehrenden-Buchungen
- Kein Draft/Entwurf-Status für Buchungen
- Keine Änderung an RLS-Policies oder Datenbankschema

## Further Notes

- Der `alert()`-Einsatz zieht sich durch das gesamte Dashboard (nicht nur dieses Modal). Das Inline-Feedback-Pattern das hier eingeführt wird sollte als Referenz-Implementierung dienen für zukünftige Modals.
- `createBookingAvailability.js` ist bereits ein gutes Beispiel für ein tiefes Modul (pure Funktionen, komplexe Logik, simples Interface) — die neuen Module sollten dem gleichen Muster folgen.
- Die Preisberechnung findet aktuell sowohl im Frontend (SUMMARY-Step) als auch in der Edge Function statt. Langfristig sollte die Edge Function die einzige Quelle der Wahrheit für Preise sein (Sicherheitsrelevant — aber out of scope für dieses PRD).
