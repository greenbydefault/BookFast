import { describe, it, expect } from 'vitest';
import { isKnownLandingPath } from './landingRoutesConfig.js';
import { ROUTE_PAIRS } from './routeConfig.js';

describe('isKnownLandingPath', () => {
  it('recognises every DE path from routeConfig as landing', () => {
    for (const { de } of ROUTE_PAIRS) {
      expect(isKnownLandingPath(de), `${de} should be landing`).toBe(true);
    }
  });

  it('recognises every EN path from routeConfig as landing', () => {
    for (const { en } of ROUTE_PAIRS) {
      expect(isKnownLandingPath(en), `${en} should be landing`).toBe(true);
    }
  });

  it('treats / and /index.html as landing', () => {
    expect(isKnownLandingPath('/')).toBe(true);
    expect(isKnownLandingPath('/index.html')).toBe(true);
  });

  it('treats /en and /en/ as landing', () => {
    expect(isKnownLandingPath('/en')).toBe(true);
    expect(isKnownLandingPath('/en/')).toBe(true);
  });

  it('treats future /en/... paths as landing', () => {
    expect(isKnownLandingPath('/en/pricing')).toBe(true);
  });

  it('includes legacy German routes', () => {
    expect(isKnownLandingPath('/preise')).toBe(true);
    expect(isKnownLandingPath('/features/foo')).toBe(true);
  });

  it('does not treat /dashboard as landing', () => {
    expect(isKnownLandingPath('/dashboard')).toBe(false);
  });
});
