# urlHelpers.js Modul + Unit-Tests

## Parent PRD

Lokales PRD: `.cursor/plans/prd-localhost-auth-redirects.md`

## What to build

Neue Datei `src/lib/urlHelpers.js` mit vier Exports, die den aktuellen Kontext (localhost vs. Produktion) erkennen und die richtige Base-URL liefern:

- `isLocalDev()` — prüft `hostname === 'localhost' || '127.0.0.1'`
- `getAppUrl(path)` — auf localhost: `window.location.origin + path`, auf Produktion: `https://app.book-fast.de + path`
- `getLandingUrl(path)` — auf localhost: `window.location.origin + path`, auf Produktion: `https://book-fast.de + path`
- `getEmbedBaseUrl()` — nutzt `VITE_EMBED_BASE_URL` env-var mit Fallback auf `getAppUrl()`

Dazu `src/lib/urlHelpers.test.js` mit vitest-Tests (Stil wie `sanitize.test.js`):
- `isLocalDev()` für localhost, 127.0.0.1, und Produktions-Hostnames
- `getAppUrl()` mit und ohne Pfad, localhost vs. Produktion
- `getLandingUrl()` mit und ohne Pfad, localhost vs. Produktion
- `getEmbedBaseUrl()` mit und ohne env-var
- Edge-Cases: leerer Pfad, Pfad mit/ohne führenden Slash

## Acceptance criteria

- [ ] `src/lib/urlHelpers.js` existiert mit allen vier Exports
- [ ] `src/lib/urlHelpers.test.js` existiert und alle Tests sind grün (`npm test`)
- [ ] Auf localhost: `getAppUrl('/dashboard/bookings')` gibt `http://localhost:5173/dashboard/bookings`
- [ ] Auf Produktion: `getAppUrl('/dashboard/bookings')` gibt `https://app.book-fast.de/dashboard/bookings`
- [ ] `getEmbedBaseUrl()` respektiert `VITE_EMBED_BASE_URL` wenn gesetzt

## Blocked by

None — kann sofort gestartet werden.

## User stories addressed

- User story 9 (zentrale URL-Logik)
- User story 10 (Unit-Tests)
