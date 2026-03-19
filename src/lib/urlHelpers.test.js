import { describe, it, expect, afterEach, vi } from 'vitest';
import { isLocalDev, getAppUrl, getLandingUrl, getEmbedBaseUrl } from './urlHelpers.js';

function stubLocation(overrides) {
  const original = window.location;
  delete window.location;
  window.location = { ...original, ...overrides };
  return () => { window.location = original; };
}

describe('isLocalDev', () => {
  let restore;
  afterEach(() => restore?.());

  it('returns true when hostname is localhost', () => {
    restore = stubLocation({ hostname: 'localhost', origin: 'http://localhost:5173' });
    expect(isLocalDev()).toBe(true);
  });

  it('returns true when hostname is 127.0.0.1', () => {
    restore = stubLocation({ hostname: '127.0.0.1', origin: 'http://127.0.0.1:5173' });
    expect(isLocalDev()).toBe(true);
  });

  it('returns false when hostname is a production domain', () => {
    restore = stubLocation({ hostname: 'app.book-fast.de', origin: 'https://app.book-fast.de' });
    expect(isLocalDev()).toBe(false);
  });
});

describe('getAppUrl', () => {
  let restore;
  afterEach(() => restore?.());

  it('returns origin on localhost when called without path', () => {
    restore = stubLocation({ hostname: 'localhost', origin: 'http://localhost:5173' });
    expect(getAppUrl()).toBe('http://localhost:5173');
  });

  it('returns origin + path on localhost', () => {
    restore = stubLocation({ hostname: 'localhost', origin: 'http://localhost:5173' });
    expect(getAppUrl('/dashboard/bookings')).toBe('http://localhost:5173/dashboard/bookings');
  });

  it('returns production app origin + path on production', () => {
    restore = stubLocation({ hostname: 'app.book-fast.de', origin: 'https://app.book-fast.de' });
    expect(getAppUrl('/dashboard/bookings')).toBe('https://app.book-fast.de/dashboard/bookings');
  });

  it('returns production app origin without path on production', () => {
    restore = stubLocation({ hostname: 'app.book-fast.de', origin: 'https://app.book-fast.de' });
    expect(getAppUrl()).toBe('https://app.book-fast.de');
  });
});

describe('getLandingUrl', () => {
  let restore;
  afterEach(() => restore?.());

  it('returns origin on localhost', () => {
    restore = stubLocation({ hostname: 'localhost', origin: 'http://localhost:5173' });
    expect(getLandingUrl('/')).toBe('http://localhost:5173/');
  });

  it('returns production landing origin on production', () => {
    restore = stubLocation({ hostname: 'app.book-fast.de', origin: 'https://app.book-fast.de' });
    expect(getLandingUrl('/')).toBe('https://book-fast.de/');
  });

  it('returns production landing origin without path', () => {
    restore = stubLocation({ hostname: 'book-fast.de', origin: 'https://book-fast.de' });
    expect(getLandingUrl()).toBe('https://book-fast.de');
  });
});

describe('getEmbedBaseUrl', () => {
  let restore;
  afterEach(() => {
    restore?.();
    vi.unstubAllEnvs();
  });

  it('falls back to getAppUrl() when env var is not set', () => {
    restore = stubLocation({ hostname: 'localhost', origin: 'http://localhost:5173' });
    expect(getEmbedBaseUrl()).toBe('http://localhost:5173');
  });

  it('uses VITE_EMBED_BASE_URL when set', () => {
    restore = stubLocation({ hostname: 'localhost', origin: 'http://localhost:5173' });
    vi.stubEnv('VITE_EMBED_BASE_URL', 'https://custom-embed.example.com');
    expect(getEmbedBaseUrl()).toBe('https://custom-embed.example.com');
  });

  it('falls back to production app URL on production', () => {
    restore = stubLocation({ hostname: 'app.book-fast.de', origin: 'https://app.book-fast.de' });
    expect(getEmbedBaseUrl()).toBe('https://app.book-fast.de');
  });
});
