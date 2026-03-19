# Auth-Redirects dynamisch machen (Login, Register, Forgot-Password)

## Parent PRD

Lokales PRD: `.cursor/plans/prd-localhost-auth-redirects.md`

## What to build

Alle hardkodierten Auth-Redirect-URLs in den drei Auth-Seiten durch `getAppUrl()` aus `urlHelpers.js` ersetzen:

**`src/login.js`** (2 Stellen):
- OAuth `redirectTo`: `'https://app.book-fast.de/dashboard/bookings'` → `getAppUrl('/dashboard/bookings')`
- Nach Email-Login: `window.location.href = 'https://app.book-fast.de/dashboard/bookings'` → `window.location.href = '/dashboard/bookings'` (relativer Pfad reicht, da wir nach signInWithPassword schon auf der richtigen Domain sind)

**`src/register.js`** (1 Stelle):
- OAuth `redirectTo`: `'https://app.book-fast.de/dashboard/bookings'` → `getAppUrl('/dashboard/bookings')`

**`src/forgot-password.js`** (1 Stelle):
- Password-Reset `redirectTo`: `'https://app.book-fast.de/update-password.html'` → `getAppUrl('/update-password.html')`

## Acceptance criteria

- [ ] `login.js` importiert `getAppUrl` aus `urlHelpers.js`
- [ ] OAuth redirectTo in `login.js` nutzt `getAppUrl('/dashboard/bookings')`
- [ ] Email-Login-Redirect in `login.js` nutzt relativen Pfad `/dashboard/bookings`
- [ ] `register.js` importiert `getAppUrl` und nutzt es für OAuth redirectTo
- [ ] `forgot-password.js` importiert `getAppUrl` und nutzt es für Password-Reset redirectTo
- [ ] Kein hardkodierter `app.book-fast.de`-String mehr in diesen 3 Dateien
- [ ] Manueller Test: Email-Login auf localhost bleibt auf localhost
- [ ] Manueller Test: OAuth-Login auf localhost leitet nach localhost/dashboard/bookings weiter

## Blocked by

- Issue 01 (urlHelpers.js Modul + Unit-Tests)

## User stories addressed

- User story 1 (Email+Password Login auf localhost)
- User story 2 (Google OAuth Login auf localhost)
- User story 3 (Registrierung auf localhost)
- User story 4 (Passwort vergessen auf localhost)
- User story 11 (voller Flow auf localhost)
