/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import { renderCompareFlowbookingsPage } from './CompareFlowbookingsPage.js';

describe('CompareFlowbookingsPage', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '<main id="landing-content"></main>';
  });

  it('renders the locked German hero, table, and live-only claims', () => {
    history.replaceState({}, '', '/vergleich/flowbookings');
    renderCompareFlowbookingsPage('de');

    const root = document.getElementById('landing-content');
    const text = root?.textContent ?? '';

    expect(document.title).toContain('BookFast vs FlowBookings');
    expect(root?.querySelector('h1')?.textContent).toBe(
      'Buchung drin, der Rest ist Handarbeit? Nicht mit BookFast.',
    );
    expect(text).toContain('Funktion');
    expect(text).toContain('nicht dokumentiert');
    expect(text).toContain('Kundenportal');
    expect(text).toContain('Stunden, Tage, Nächte.');
    expect(text).toContain('FlowBookings setzt native Webflow-Form-Elemente');
    expect(text).not.toContain('Zapier');
    expect(text).not.toContain('Kaution');
    expect(text).not.toContain('passt wenn');
    expect(text).not.toContain('Designer-Form');
  });

  it('renders the English mirror and hreflang targets', () => {
    history.replaceState({}, '', '/en/compare/flowbookings');
    renderCompareFlowbookingsPage('en');

    const root = document.getElementById('landing-content');
    expect(root?.querySelector('h1')?.textContent).toBe(
      'Booking captured, the rest is manual? Not with BookFast.',
    );
    expect(root?.textContent).toContain('not documented');
    expect(root?.textContent).toContain('How does the embed differ?');
    expect(document.querySelector('link[hreflang="de"]')?.getAttribute('href')).toContain(
      '/vergleich/flowbookings',
    );
    expect(document.querySelector('link[hreflang="en"]')?.getAttribute('href')).toContain(
      '/en/compare/flowbookings',
    );
  });
});
