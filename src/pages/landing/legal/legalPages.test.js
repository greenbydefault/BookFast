/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import { renderDatenschutzPage } from './DatenschutzPage.js';
import { renderAGBPage } from './AGBPage.js';

describe('legal pages EN', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main id="landing-content"></main>';
  });

  it('renders an English privacy body with binding notice', () => {
    history.replaceState({}, '', '/en/privacy');
    renderDatenschutzPage('en');
    const text = document.getElementById('landing-content')?.textContent || '';
    expect(text).toContain('The German version is legally binding.');
    expect(text).toContain('Controller');
    expect(text).not.toContain('Verantwortlicher');
  });

  it('renders English terms with binding notice', () => {
    history.replaceState({}, '', '/en/terms');
    renderAGBPage('en');
    const text = document.getElementById('landing-content')?.textContent || '';
    expect(text).toContain('The German version is legally binding.');
    expect(text).toContain('Scope');
    expect(text).not.toContain('Geltungsbereich');
  });
});
