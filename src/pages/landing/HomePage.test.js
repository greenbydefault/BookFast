/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import '../../locales/en/featureDemoModules/index.js';
import { renderHomePage } from './HomePage.js';
import { createHeroNew } from '../../components/landing/HeroNew.js';

describe('HomePage localization', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main id="landing-content"></main>';
  });

  it('names live prepayment Anzahlung on DE, not Kaution', () => {
    renderHomePage('de');

    const titles = Array.from(document.querySelectorAll('.how-it-works__bullet-title')).map(
      (el) => el.textContent,
    );
    expect(titles).toContain('Anzahlung konfigurierbar');
    expect(titles).not.toContain('Kaution konfigurierbar');
  });

  it('names the same live prepayment Deposit on EN', () => {
    history.replaceState({}, '', '/en');
    renderHomePage('en');

    const titles = Array.from(document.querySelectorAll('.how-it-works__bullet-title')).map(
      (el) => el.textContent,
    );
    expect(titles).toContain('Deposits configurable');
    expect(titles.some((title) => /kaution/i.test(title))).toBe(false);
  });

  it('keeps DE hero and CTA free of dash punctuation', () => {
    renderHomePage('de');

    const hero = document.querySelector('.hero-new__headline')?.textContent ?? '';
    const cta = document.querySelector('.landing-cta-section .landing-h2')?.textContent ?? '';
    expect(hero).not.toMatch(/[–—]/);
    expect(cta).not.toMatch(/[–—]/);
  });

  it('keeps EN hero and CTA free of dash punctuation', () => {
    history.replaceState({}, '', '/en');
    renderHomePage('en');

    const hero = document.querySelector('.hero-new__headline')?.textContent ?? '';
    const cta = document.querySelector('.landing-cta-section .landing-h2')?.textContent ?? '';
    expect(hero).not.toMatch(/[–—]/);
    expect(cta).not.toMatch(/[–—]/);
  });

  it('keeps DE accordion copy free of dash punctuation', () => {
    renderHomePage('de');

    const accordion = document.querySelector('.how-it-works__accordion')?.textContent ?? '';
    expect(accordion).not.toMatch(/[–—]/);
  });

  it('uses a dash-free hero fallback when no homepage copy is passed', () => {
    document.body.innerHTML = createHeroNew();

    const hero = document.querySelector('.hero-new__headline')?.textContent ?? '';
    expect(hero).toContain('jetzt testen');
    expect(hero).toContain('Ohne Anmeldung');
    expect(hero).not.toMatch(/[–—]/);
    expect(document.querySelector('.hero-new__tagline')?.textContent).toBe('Buchungssystem für Webflow');
  });

  it('renders English headline, FAQ chrome, and preview copy on /en', () => {
    history.replaceState({}, '', '/en');
    renderHomePage('en');

    const content = document.getElementById('landing-content');
    expect(content.querySelector('.hero-new__headline')?.textContent).toContain('Try Book');
    expect(content.querySelector('.hero-new__headline')?.textContent).not.toContain('jetzt testen');
    expect(content.querySelector('.landing-faq-section-header .landing-h2')?.textContent).toBe(
      'Frequently asked questions about BookFast.',
    );
    expect(content.querySelector('#hero-new-form')).not.toBeNull();
    expect(content.querySelector('.landing-btn-primary')?.getAttribute('href')).toBe('#hero-new-workspace-name');
    expect(content.textContent).toContain('Website integration');
    expect(content.textContent).not.toContain('Website Integration');
  });
});
