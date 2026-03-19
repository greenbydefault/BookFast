const DASHBOARD_ORIGINS = [
  'https://book-fast.de',
  'https://www.book-fast.de',
  'https://app.book-fast.de',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getAllowedOrigin(req: Request): string {
  const origin = req.headers.get('origin') ?? '';
  if (DASHBOARD_ORIGINS.includes(origin)) return origin;
  // SECURITY NOTE: Origin reflection for embed widgets on customer domains.
  // Safe because auth uses apikey/JWT headers, NOT cookies — browsers won't
  // attach cross-origin cookies, so CSRF is not possible. If cookie-based
  // auth is ever added, this MUST be changed to a strict allowlist.
  if (origin) return origin;
  return DASHBOARD_ORIGINS[0];
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': DASHBOARD_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

export function getCorsHeaders(req: Request): Record<string, string> {
  return { ...corsHeaders, 'Access-Control-Allow-Origin': getAllowedOrigin(req) };
}

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }
  return null;
}
