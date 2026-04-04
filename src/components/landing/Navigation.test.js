/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import { renderNavigation, syncLandingNavigationChrome } from './Navigation.js';

const renderNavAt = (path) => {
  history.replaceState({}, '', path);
  document.body.innerHTML = '<div id="app"></div>';
  const app = document.getElementById('app');
  renderNavigation(app);
  return app.querySelector('.landing-nav');
};

describe('landing language switch', () => {
  beforeEach(() => {
    history.replaceState({}, '', '/');
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('keeps product as a direct link and restores the features mega menu', () => {
    const nav = renderNavAt('/en');
    const links = Array.from(nav.querySelectorAll('.landing-nav-links .landing-nav-link'));

    expect(links.map((link) => link.textContent?.trim())).toEqual(['Product', 'Features', 'Pricing']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/en/product', '/en/features', '/en/pricing']);
    expect(nav.querySelector('.landing-nav-links > .landing-nav-link')?.getAttribute('href')).toBe('/en/product');
    expect(nav.querySelector('.landing-nav-mega-wrap')).not.toBeNull();
    expect(nav.querySelector('#mega-features')).not.toBeNull();
  });

  it('updates EN switch target after client-side navigation from home to pricing', () => {
    const nav = renderNavAt('/');

    history.pushState({}, '', '/preise');
    syncLandingNavigationChrome();

    const deLink = nav.querySelector('.landing-lang-link[lang="de"]');
    const enLink = nav.querySelector('.landing-lang-link[lang="en"]');
    const logoLink = nav.querySelector('.landing-nav-logo');

    expect(deLink?.getAttribute('href')).toBe('/preise');
    expect(enLink?.getAttribute('href')).toBe('/en/pricing');
    expect(enLink?.classList.contains('is-active')).toBe(false);
    expect(deLink?.classList.contains('is-active')).toBe(true);
    expect(logoLink?.getAttribute('href')).toBe('/');
  });

  it('updates DE switch target after client-side navigation from EN home to EN product', () => {
    const nav = renderNavAt('/en');

    history.pushState({}, '', '/en/product');
    syncLandingNavigationChrome();

    const deLink = nav.querySelector('.landing-lang-link[lang="de"]');
    const enLink = nav.querySelector('.landing-lang-link[lang="en"]');
    const logoLink = nav.querySelector('.landing-nav-logo');

    expect(deLink?.getAttribute('href')).toBe('/produkt');
    expect(enLink?.getAttribute('href')).toBe('/en/product');
    expect(enLink?.classList.contains('is-active')).toBe(true);
    expect(deLink?.classList.contains('is-active')).toBe(false);
    expect(logoLink?.getAttribute('href')).toBe('/en');
  });
});
