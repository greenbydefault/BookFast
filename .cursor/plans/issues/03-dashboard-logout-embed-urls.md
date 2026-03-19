# Dashboard-Logout + Embed-URLs dynamisch machen

## Parent PRD

Lokales PRD: `.cursor/plans/prd-localhost-auth-redirects.md`

## What to build

Logout-Redirect und Embed-Base-URLs in Dashboard-Komponenten auf die zentralen URL-Helpers umstellen:

**`src/pages/Dashboard.js`** (1 Stelle):
- Logout-Redirect: `window.location.href = 'https://book-fast.de/'` → `window.location.href = getLandingUrl('/')`

**`src/pages/dashboard/SitesPage.js`** (1 Stelle):
- `const EMBED_BASE_URL = import.meta.env.VITE_EMBED_BASE_URL || 'https://app.book-fast.de'` → Import von `getEmbedBaseUrl()` aus `urlHelpers.js`

**`src/pages/dashboard/settings/WorkspaceSection.js`** (1 Stelle):
- Identische Änderung wie SitesPage.js

**`src/pages/dashboard/settings/EmailTemplatesSection.js`** (1 Stelle):
- Portal-Link Preview: `'https://app.book-fast.de/b/abc123'` → `` `${getAppUrl('/b/abc123')}` ``

**`.env.example`**:
- `VITE_EMBED_BASE_URL` als auskommentierten Eintrag mit Erklärung ergänzen

## Acceptance criteria

- [ ] `Dashboard.js` importiert `getLandingUrl` und nutzt es für Logout-Redirect
- [ ] `SitesPage.js` importiert `getEmbedBaseUrl` statt inline Fallback-Kette
- [ ] `WorkspaceSection.js` importiert `getEmbedBaseUrl` statt inline Fallback-Kette
- [ ] `EmailTemplatesSection.js` importiert `getAppUrl` für Portal-Link Preview
- [ ] `.env.example` enthält `VITE_EMBED_BASE_URL` mit Erklärung
- [ ] Kein hardkodierter `app.book-fast.de`- oder `book-fast.de`-String mehr in diesen Dateien (außer ggf. Kommentare)
- [ ] Manueller Test: Logout auf localhost leitet auf `localhost:5173/` weiter
- [ ] Manueller Test: Embed-Code auf localhost zeigt `localhost:5173`-URLs

## Blocked by

- Issue 01 (urlHelpers.js Modul + Unit-Tests)

## User stories addressed

- User story 5 (Logout auf localhost bleibt lokal)
- User story 6 (Embed-Code auf localhost)
- User story 7 (Preview-Links in Email-Templates)
- User story 8 (VITE_EMBED_BASE_URL dokumentiert)
- User story 12 (keine Änderung an main.js Routing)
