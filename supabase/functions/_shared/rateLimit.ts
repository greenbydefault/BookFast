interface RateLimitOptions {
  bucket: string;
  maxRequests: number;
  windowMs: number;
}

type RateLimitStore = Map<string, number[]>;

const store: RateLimitStore = (globalThis as { __bookfastRateLimitStore?: RateLimitStore }).__bookfastRateLimitStore ||
  new Map<string, number[]>();

if (!(globalThis as { __bookfastRateLimitStore?: RateLimitStore }).__bookfastRateLimitStore) {
  (globalThis as { __bookfastRateLimitStore?: RateLimitStore }).__bookfastRateLimitStore = store;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

function nowMs(): number {
  return Date.now();
}

export function checkRateLimit(req: Request, options: RateLimitOptions): { allowed: boolean; retryAfterSeconds: number } {
  const current = nowMs();
  const windowStart = current - options.windowMs;
  const ip = getClientIp(req);
  const key = `${options.bucket}:${ip}`;

  const existing = store.get(key) || [];
  const recent = existing.filter((ts) => ts > windowStart);

  if (recent.length >= options.maxRequests) {
    const oldest = recent[0] || current;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - current) / 1000));
    store.set(key, recent);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(current);
  store.set(key, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}
