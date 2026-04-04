/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import './Footer.js';
import '../../locales/en/features/index.js';
import { renderFooter, syncLandingFooterChrome } from './Footer.js';
import { getFeaturePage } from '../../lib/getLocaleContent.js';

const renderFooterAt = (path) => {
  history.replaceState({}, '', path);
  document.body.innerHTML = '<div id="app"></div>';
  const app = document.getElementById('app');
  renderFooter(app);
  return app.querySelector('.landing-footer');
};

describe('landing footer localization', () => {
  beforeEach(() => {
    history.replaceState({}, '', '/');
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('renders German footer content on German routes', () => {
    const footer = renderFooterAt('/');

    expect(footer.querySelector('.landing-footer-heading')?.textContent?.trim()).toBe('Buchungen & Workspaces');
    expect(footer.querySelector('.landing-footer-legal a')?.textContent?.trim()).toBe('Kontakt');
    expect(Array.from(footer.querySelectorAll('.landing-footer-badge')).map((el) => el.textContent?.trim())).toContain('DSGVO-konform');
  });

  it('updates headings, links, legal labels, and badges after client-side switch to EN', () => {
    const footer = renderFooterAt('/');
    const expectedFeatureTitle = getFeaturePage('buchungen', 'en')?.meta?.title;

    history.pushState({}, '', '/en/product');
    syncLandingFooterChrome();

    const heading = footer.querySelector('.landing-footer-heading');
    const firstFeatureLink = footer.querySelector('.landing-footer-links a');
    const legalLabels = Array.from(footer.querySelectorAll('.landing-footer-legal a')).map((el) => el.textContent?.trim());
    const badges = Array.from(footer.querySelectorAll('.landing-footer-badge')).map((el) => el.textContent?.trim());

    expect(heading?.textContent?.trim()).toBe('Bookings & Workspaces');
    expect(firstFeatureLink?.textContent?.trim()).toBe(expectedFeatureTitle);
    expect(firstFeatureLink?.getAttribute('href')).toBe('/en/features/bookings');
    expect(legalLabels).toEqual(['Contact', 'Imprint', 'Privacy', 'Terms']);
    expect(badges).toContain('GDPR-compliant');
    expect(badges).toContain('Made with love in Berlin');
  });
});
