/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerAllLandingPages } from './registry.js';
import { initLandingRouter } from '../../lib/landingRouter.js';

describe('landing registry redirects', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      cb();
      return 1;
    });
    document.body.innerHTML = '<div id="app"><main id="landing-content"></main></div>';
  });

  it('redirects /integrationen to /produkt on initial load', () => {
    history.replaceState({}, '', '/integrationen');

    registerAllLandingPages();
    initLandingRouter();

    expect(window.location.pathname).toBe('/produkt');
  });

  it('redirects /en/integrations to /en/product on initial load', () => {
    history.replaceState({}, '', '/en/integrations');

    registerAllLandingPages();
    initLandingRouter();

    expect(window.location.pathname).toBe('/en/product');
  });

  it('marks placeholder routes as noindex in english', () => {
    history.replaceState({}, '', '/en/resources');

    registerAllLandingPages();
    initLandingRouter();

    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow');
    expect(document.title).toBe('Resources | BookFast');
    expect(document.querySelector('#landing-content')?.textContent).toContain('This page will be available soon.');
  });
});
