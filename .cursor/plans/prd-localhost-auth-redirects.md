# PRD: Localhost Auth Redirects

## Problem Statement

Auth-Redirect-URLs in der BookFast-App sind an zahlreichen Stellen hart auf `https://app.book-fast.de` bzw. `https://book-fast.de` kodiert. Wenn ein Entwickler die App lokal auf `localhost:5173` startet und sich einloggen will, wird er nach dem Login (Email+Password oder Google OAuth) direkt auf die Produktions-Domain umgeleitet statt auf der lokalen Umgebung zu bleiben. Dasselbe passiert bei Logout, Password-Reset und OAuth-Callbacks.

Das macht lokales Testen aller Auth-Flows unmöglich.

## Solution

Eine zentrale URL-Helper-Datei (`src/lib/urlHelpers.js`) einführen, die den aktuellen Kontext (localhost vs. Produktion) erkennt und die richtige Base-URL liefert. Alle hardkodierten Auth- und App-URLs im Frontend-Code werden durch Aufrufe dieser Helpers ersetzt.

Auf localhost zeigen alle URLs automatisch auf `http://localhost:5173`, auf Produktion weiterhin auf die jeweiligen Domains (`app.book-fast.de` / `book-fast.de`).

## User Stories

1. Als Entwickler will ich mich auf localhost per Email+Password einloggen können, damit ich Dashboard-Features lokal testen kann, ohne auf die Produktions-Domain weitergeleitet zu werden.
2. Als Entwickler will ich mich auf localhost per Google OAuth einloggen können, damit ich den OAuth-Flow lokal testen kann.
3. Als Entwickler will ich mich auf localhost registrieren können (Google OAuth), damit ich den Registrierungs-Flow lokal testen kann.
4. Als Entwickler will ich auf localhost "Passwort vergessen" nutzen können, damit der Reset-Link auf meine lokale Umgebung zeigt.
5. Als Entwickler will ich mich auf localhost ausloggen können und auf der lokalen Landing-Seite (`/`) landen, statt auf `book-fast.de`.
6. Als Entwickler will ich, dass Embed-Code-Snippets auf localhost auf `localhost:5173` zeigen, damit ich Embed-Integrationen lokal testen kann.
7. Als Entwickler will ich, dass Preview-Links in Email-Templates auf localhost auf die lokale Umgebung zeigen.
8. Als Entwickler will ich, dass `VITE_EMBED_BASE_URL` in `.env.example` dokumentiert ist, damit neue Entwickler wissen, dass diese Variable existiert.
9. Als Entwickler will ich, dass die URL-Logik in einer zentralen Datei liegt, damit bei Domain-Änderungen nur eine Stelle angepasst werden muss.
10. Als Entwickler will ich Unit-Tests für die URL-Helpers haben, damit Regressionen bei zukünftigen Änderungen sofort auffallen.
11. Als Entwickler will ich, dass der volle Flow (Landing -> Login -> Dashboard -> Logout -> Landing) auf localhost funktioniert, genau wie auf Produktion mit zwei Domains.
12. Als Entwickler will ich, dass die bestehende Routing-Logik in `main.js` (isAppSubdomain, Landing vs. Dashboard) nicht verändert wird, damit kein Produktions-Risiko entsteht.

## Implementation Decisions

1. **Neue Datei `src/lib/urlHelpers.js`** mit vier Exports:
   - `isLocalDev()` -- prüft ob `hostname === 'localhost' || '127.0.0.1'`
   - `getAppUrl(path)` -- gibt auf localhost `window.location.origin + path` zurück, auf Produktion `https://app.book-fast.de + path`
   - `getLandingUrl(path)` -- gibt auf localhost `window.location.origin + path` zurück, auf Produktion `https://book-fast.de + path`
   - `getEmbedBaseUrl()` -- nutzt `VITE_EMBED_BASE_URL` env-var mit Fallback auf `getAppUrl()`

2. **Zwei separate Funktionen** (`getAppUrl` vs `getLandingUrl`), weil auf Produktion App und Landing auf verschiedenen Domains laufen (`app.book-fast.de` vs `book-fast.de`), auf localhost aber auf derselben.

3. **`isAppSubdomain()` in `main.js` bleibt unverändert.** Auf localhost ist `isAppSubdomain() === false`, und der else-Branch in `main.js` handhabt den Flow korrekt: mit Session -> Dashboard, ohne Session -> Landing. Es gibt keinen Grund, localhost als App-Subdomain zu behandeln.

4. **Auth-Redirect-URLs** (`redirectTo` in OAuth/Password-Reset) nutzen `getAppUrl()`, weil Supabase eine absolute URL braucht (relative URLs funktionieren bei OAuth nicht, da der Redirect über Supabase-Server läuft).

5. **Login nach signInWithPassword** nutzt einen relativen Pfad (`/dashboard/bookings`), weil wir nach dem Email-Login bereits auf der richtigen Domain sind.

6. **Logout-Redirect in Dashboard.js** nutzt `getLandingUrl('/')`, weil auf Produktion der Logout von `app.book-fast.de` auf `book-fast.de` weiterleiten soll, auf localhost aber auf `localhost:5173/`.

7. **Embed-Base-URLs** in `SitesPage.js` und `WorkspaceSection.js` nutzen `getEmbedBaseUrl()` statt einer inline `VITE_EMBED_BASE_URL || 'https://app.book-fast.de'` Fallback-Kette.

8. **Nicht angefasst werden:** SEO-URLs (`seoHelper.js`, `index.html`, `robots.txt`, `sitemap.xml`), Edge Functions (nutzen `APP_URL` env-var auf Supabase-Infrastruktur), CORS-Config (localhost ist bereits enthalten), `supabase/config.toml` (site_url ist bereits `localhost:5173`).

9. **`.env.example`** wird um `VITE_EMBED_BASE_URL` ergänzt (auskommentiert, mit Erklärung).

## Testing Decisions

- **Unit-Tests für `urlHelpers.js`** in `src/lib/urlHelpers.test.js`, vitest-basiert
- Tests sollen externes Verhalten prüfen (Return-Werte der Funktionen), nicht Implementierungsdetails
- Testfälle:
  - `isLocalDev()` gibt `true` für localhost/127.0.0.1, `false` für andere Hostnames
  - `getAppUrl()` gibt korrekten Origin + Path für localhost und Produktion
  - `getLandingUrl()` gibt korrekten Origin + Path für localhost und Produktion
  - `getEmbedBaseUrl()` nutzt env-var wenn gesetzt, fällt auf `getAppUrl()` zurück
  - Edge-Cases: leerer Pfad, Pfad mit/ohne führenden Slash
- Prior Art: `src/lib/sanitize.test.js` (gleicher Stil: describe/it/expect, vitest)

## Out of Scope

- SEO-URLs und statische Assets (sitemap.xml, robots.txt, index.html Schema-Markup)
- Edge Function URLs (laufen auf Supabase-Infrastruktur, nutzen `APP_URL` env-var)
- CORS-Konfiguration (localhost ist bereits in `_shared/cors.ts` enthalten)
- Supabase config.toml (site_url ist bereits korrekt)
- Google Cloud Console OAuth-Konfiguration (bereits korrekt: localhost:5173 als Origin)
- Änderungen an der Routing-Logik in `main.js`
- Änderungen an `seoHelper.js` BASE_URL

## Further Notes

- Google OAuth auf localhost funktioniert, weil `http://localhost:5173` bereits als autorisierte JavaScript-Quelle in der Google Cloud Console konfiguriert ist, und der OAuth-Callback über `supabase.co/auth/v1/callback` läuft.
- `supabase/config.toml` hat bereits `site_url = "http://localhost:5173"` und `additional_redirect_urls = ["http://localhost:5173"]` konfiguriert.
