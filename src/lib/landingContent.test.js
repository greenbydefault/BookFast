import { beforeEach, describe, expect, it } from 'vitest';
import {
  finishLandingContentHydration,
  prepareLandingContentHydration,
  setLandingContent,
} from './landingContent.js';

describe('landingContent hydration', () => {
  let content;

  beforeEach(() => {
    document.body.innerHTML = '<main id="landing-content"><h1>Prerendered</h1></main>';
    content = document.getElementById('landing-content');
    finishLandingContentHydration();
  });

  it('writes markup when the content was not prerendered', () => {
    prepareLandingContentHydration(content, '/produkt');
    expect(setLandingContent(content, '<h1>Client</h1>')).toBe(true);
    expect(content.textContent).toBe('Client');
  });

  it('keeps prerendered markup once and clears the marker', () => {
    content.setAttribute('data-prerendered', '/produkt');
    prepareLandingContentHydration(content, '/produkt');

    expect(content.hasAttribute('data-prerendered')).toBe(false);
    expect(setLandingContent(content, '<h1>Client</h1>')).toBe(false);
    expect(content.textContent).toBe('Prerendered');

    expect(setLandingContent(content, '<h1>Client</h1>')).toBe(true);
    expect(content.textContent).toBe('Client');
  });

  it('renders normally when the client path differs from the prerendered path', () => {
    content.setAttribute('data-prerendered', '/produkt');
    prepareLandingContentHydration(content, '/');

    expect(content.hasAttribute('data-prerendered')).toBe(false);
    expect(setLandingContent(content, '<h1>Home</h1>')).toBe(true);
    expect(content.textContent).toBe('Home');
  });

  it('does not leak the hydration flag into the next route', () => {
    content.setAttribute('data-prerendered', '/produkt');
    prepareLandingContentHydration(content, '/produkt');
    finishLandingContentHydration();

    expect(setLandingContent(content, '<h1>Next</h1>')).toBe(true);
    expect(content.textContent).toBe('Next');
  });

  it('ignores the marker on an empty element', () => {
    content.innerHTML = '';
    content.setAttribute('data-prerendered', '/produkt');
    prepareLandingContentHydration(content, '/produkt');

    expect(setLandingContent(content, '<h1>Client</h1>')).toBe(true);
  });
});
