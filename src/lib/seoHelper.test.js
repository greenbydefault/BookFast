/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  setHreflangAlternates,
  setPageMeta,
  setProductSchema,
  clearSEO,
} from './seoHelper.js';

describe('seoHelper', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '<div id="app"></div>';
    history.replaceState({}, '', '/en/pricing');
    clearSEO();
  });

  it('adds x-default when localized alternates are present', () => {
    setHreflangAlternates([
      { hreflang: 'de', path: '/preise' },
      { hreflang: 'en', path: '/en/pricing' },
    ]);

    const hreflangs = Array.from(document.querySelectorAll('link[rel="alternate"]'))
      .map((node) => [node.getAttribute('hreflang'), node.getAttribute('href')]);

    expect(hreflangs).toEqual([
      ['de', 'https://book-fast.de/preise'],
      ['en', 'https://book-fast.de/en/pricing'],
      ['x-default', 'https://book-fast.de/preise'],
    ]);
  });

  it('localizes base schemas and product offer urls for english pages', () => {
    setPageMeta('Pricing', 'Test description', { locale: 'en' });
    setProductSchema([
      { name: 'Basic', price: '9,49', priceAnnual: '91,10', description: 'English plan' },
    ], { locale: 'en' });

    expect(document.getElementById('website-schema')?.textContent).toContain('"inLanguage":"en"');
    expect(document.getElementById('organization-schema')?.textContent).toContain('/en/contact');
    expect(document.getElementById('product-schema')?.textContent).toContain('https://book-fast.de/en/pricing');
    expect(document.getElementById('product-schema')?.textContent).toContain('Basic monthly');
  });
});
