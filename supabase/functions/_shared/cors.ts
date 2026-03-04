const ALLOWED_ORIGINS = [
  'https://book-fast.de',
  'https://www.book-fast.de',
  'https://app.book-fast.de',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getAllowedOrigin(req: Request): string {
  const origin = req.headers.get('origin') ?? '';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
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
