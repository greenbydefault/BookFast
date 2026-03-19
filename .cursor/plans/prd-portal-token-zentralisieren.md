# PRD: Portal-Token-Erzeugung zentralisieren

## Problem Statement

Portal-Tokens (Magic Links für Kunden-Portal-Zugang) werden an drei verschiedenen Stellen im Codebase erzeugt: beim Bestätigen einer Buchung, beim manuellen Anlegen einer Buchung, und beim expliziten Erstellen eines neuen Tokens. Die Logik (Token generieren, hashen, PIN erzeugen, Expiry berechnen, alte Tokens revoken, in DB schreiben) ist in allen drei Edge Functions nahezu identisch — aber mit subtilen Abweichungen:

- `booking-approve` behandelt Token-Fehler als non-blocking (loggt und macht weiter), die anderen beiden brechen ab
- `manual-booking-create` revoked keine alten Tokens, die anderen zwei schon
- Response-Shapes sind inkonsistent: `booking-approve` gibt nur `portal_path` zurück, die anderen geben `token` + `pin` zurück

Jede Änderung an der Token-Logik (z.B. Expiry-Dauer, PIN-Format, Revoke-Strategie) muss an drei Stellen gepflegt werden — und sie driften bereits auseinander.

## Solution

Eine einzelne `createPortalToken()` Funktion in `_shared/portalToken.ts`, die von allen drei Edge Functions aufgerufen wird. Sie kapselt den gesamten Token-Lifecycle (Revoke → Generate → Hash → Insert) hinter einer einfachen Funktion mit Dependency Injection für den DB-Client.

## User Stories

1. Als Entwickler möchte ich eine einzige Funktion zum Erzeugen von Portal-Tokens aufrufen, damit ich Token-Logik nicht an drei Stellen pflegen muss.
2. Als Entwickler möchte ich, dass die Expiry-Berechnung (end_time + 60 Tage) an genau einer Stelle definiert ist, damit sich die Expiry-Dauer konsistent über alle Buchungstypen ändert.
3. Als Entwickler möchte ich, dass alte Tokens immer vor dem Erstellen neuer Tokens revoked werden, damit nie versehentlich mehrere aktive Tokens pro Buchung existieren.
4. Als Entwickler möchte ich, dass Token-Fehler immer zum Abbruch führen, damit keine Buchung ohne Portal-Zugang in der DB steht.
5. Als Entwickler möchte ich, dass die Funktion den DB-Client als Parameter bekommt (Dependency Injection), damit ich sie in Tests mit einem Mock-Client aufrufen kann.
6. Als Entwickler möchte ich, dass das Ergebnis alle relevanten Felder enthält (plainToken, pinCode, portalPath, expiresAt), damit jeder Caller nur die Felder nimmt die er braucht.
7. Als Betreiber möchte ich sicherstellen, dass bei einer manuellen Buchung genau ein aktiver Token existiert, damit Kunden nicht mit abgelaufenen/veralteten Links arbeiten.
8. Als Betreiber möchte ich sicherstellen, dass beim Bestätigen einer Buchung der neue Token den alten ersetzt, damit der alte Magic Link nicht mehr funktioniert.
9. Als Betreiber möchte ich sicherstellen, dass die PIN-Codes einheitlich im gleichen Format (5-stellig, 10000–99999) erzeugt werden, egal über welchen Weg die Buchung läuft.

## Implementation Decisions

### Neues Modul: `_shared/portalToken.ts`

Interface:

```
createPortalToken({
  bookingId: string,
  workspaceId: string,
  endTime: string | null,
  startTime: string,
  adminClient: SupabaseClient,
}) → Promise<{
  plainToken: string,
  pinCode: string,
  portalPath: string,   // "/b/{token}" — Caller baut volle URL selbst
  expiresAt: string,    // ISO-String
}>
```

Internes Verhalten:
1. Revoke alle bestehenden aktiven Tokens für diese Booking (`UPDATE ... SET is_revoked = true WHERE booking_id = X AND is_revoked = false`) — ist ein No-Op bei neuen Buchungen
2. Token generieren via bestehender `generateToken()` aus `tokenUtils.ts`
3. Hash berechnen via bestehender `hashToken()`
4. PIN generieren via bestehender `generatePin()`
5. Expiry: `new Date(endTime || startTime) + 60 Tage`
6. INSERT in `booking_access_tokens` mit `booking_id`, `workspace_id`, `token_hash`, `pin_code`, `expires_at`
7. Bei Fehler in Schritt 1, 6: throw (immer, nie non-blocking)
8. Return: `{ plainToken, pinCode, portalPath: '/b/' + plainToken, expiresAt }`

### Änderungen an bestehenden Callern

**`booking-approve`**: Token-Block (ca. 30 Zeilen) wird durch einen `createPortalToken()`-Call ersetzt. Die bestehende non-blocking try/catch Behandlung wird entfernt — Token-Fehler propagieren jetzt. `portalPath` wird aus dem Result genommen.

**`manual-booking-create`**: Token-Block (ca. 20 Zeilen) wird durch einen `createPortalToken()`-Call ersetzt. `plainToken` wird aus dem Result genommen für die E-Mail. Portal-URL für die E-Mail: `${APP_URL}${result.portalPath}`.

**`portal-token-create`**: Token-Block (ca. 50 Zeilen, inkl. Revoke) wird durch einen `createPortalToken()`-Call ersetzt. Response nutzt `result.plainToken`, `result.pinCode`, `result.portalPath`, `result.expiresAt`.

### Dependency Injection

Der `supabaseAdmin` Client wird als Parameter übergeben (`adminClient`), nicht direkt importiert. Das ermöglicht:
- Testbarkeit mit Mock-Client
- Keine versteckte Abhängigkeit auf Environment-Variablen im Modul selbst

### Portal-Path vs. volle URL

Das Modul gibt nur den relativen Path zurück (`/b/{token}`), nicht die volle URL. Die volle URL (`https://app.book-fast.de/b/{token}`) wird vom Caller gebaut, weil `APP_URL` eine Environment-Variable ist die nicht ins Token-Modul gehört.

## Testing Decisions

**Was gute Tests ausmacht:** Tests prüfen nur Verhalten über das öffentliche Interface. Interne Implementierung (welche Hilfsfunktion aufgerufen wird, in welcher Reihenfolge DB-Calls passieren) wird nicht getestet.

**Getestet wird: `createPortalToken()`** mit einem gemockten `adminClient` (`vi.fn()`-basiert).

Testfälle:
- Expiry-Berechnung: Bei `endTime = "2026-03-20"` ist `expiresAt` 60 Tage später
- Expiry-Fallback: Bei `endTime = null` wird `startTime` als Basis genommen
- Revoke wird aufgerufen: Mock prüft dass `.update({ is_revoked: true })` aufgerufen wird
- Insert wird aufgerufen: Mock prüft dass `.insert()` mit korrekten Feldern aufgerufen wird
- Fehler bei Insert → throw: Mock lässt Insert fehlschlagen, Test erwartet throw
- Result-Shape: Prüft dass `plainToken`, `pinCode`, `portalPath`, `expiresAt` vorhanden und korrekt formatiert sind

**Prior Art:** Bestehende Tests in `src/lib/sanitize.test.js` und `src/lib/staffDays.test.js` nutzen das gleiche Pattern (Vitest, `describe`/`it`/`expect`).

## Out of Scope

- Keine Änderung am Token-Format selbst (weiterhin 64-Hex-Zeichen)
- Keine Änderung am PIN-Format (weiterhin 5-stellig, 10000–99999)
- Keine Änderung an der Expiry-Dauer (weiterhin 60 Tage)
- Keine Änderung an der Portal-Verify-Logik (`portal-verify` Edge Function)
- Kein Rate Limiting auf Token-Erzeugung (separates Thema)
- Keine Änderung am `booking_access_tokens`-Schema

## Further Notes

- Das Revoke-Pattern (`UPDATE ... SET is_revoked = true`) ist bewusst soft-delete — alte Token-Hashes bleiben in der DB für Audit-Zwecke. Das ändert sich nicht.
- `tokenUtils.ts` bleibt unverändert — `generateToken()`, `hashToken()`, `generatePin()` werden weiterhin von dort importiert, jetzt aber nur noch indirekt über `portalToken.ts`.
- Langfristig könnte auch die E-Mail-Logik (die in `booking-approve` und `manual-booking-create` dupliziert ist) in ein ähnliches Shared-Modul extrahiert werden — das ist aber ein separates PRD.
