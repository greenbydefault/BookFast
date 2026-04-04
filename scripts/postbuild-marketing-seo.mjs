import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import {
  ALL_STATIC_ROUTES,
  buildSitemapXml,
} from '../src/lib/marketingSeoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const distIndexPath = path.join(distDir, 'index.html');
const distAppShellPath = path.join(distDir, 'app-shell.html');
const dist404Path = path.join(distDir, '404.html');
const distSitemapPath = path.join(distDir, 'sitemap.xml');

const flush = async () => {
  await delay(0);
  await delay(0);
};

const installDomGlobals = (window) => {
  const previous = new Map();
  const globalKeys = [
    'window',
    'document',
    'navigator',
    'history',
    'location',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLTextAreaElement',
    'HTMLSelectElement',
    'HTMLButtonElement',
    'HTMLAnchorElement',
    'HTMLImageElement',
    'Element',
    'Node',
    'Event',
    'CustomEvent',
    'DOMParser',
    'MutationObserver',
    'getComputedStyle',
    'requestAnimationFrame',
    'cancelAnimationFrame',
  ];

  for (const key of globalKeys) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value: window[key],
    });
  }

  return () => {
    for (const [key, descriptor] of previous.entries()) {
      if (!descriptor) {
        delete globalThis[key];
      } else {
        Object.defineProperty(globalThis, key, descriptor);
      }
    }
  };
};

const installNoopTimers = () => {
  const timerKeys = ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'];
  const previous = new Map();

  previous.set('setTimeout', globalThis.setTimeout);
  previous.set('clearTimeout', globalThis.clearTimeout);
  previous.set('setInterval', globalThis.setInterval);
  previous.set('clearInterval', globalThis.clearInterval);

  globalThis.setTimeout = () => 0;
  globalThis.clearTimeout = () => {};
  globalThis.setInterval = () => 0;
  globalThis.clearInterval = () => {};

  return () => {
    for (const key of timerKeys) {
      globalThis[key] = previous.get(key);
    }
  };
};

const setupPrerenderWindow = (window) => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.scrollTo = () => {};
  window.scrollBy = () => {};
  window.setTimeout = () => 0;
  window.clearTimeout = () => {};
  window.setInterval = () => 0;
  window.clearInterval = () => {};
  window.requestAnimationFrame = () => 0;
  window.cancelAnimationFrame = () => {};
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  });
  window.IntersectionObserver = NoopObserver;
  window.ResizeObserver = NoopObserver;

  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = () => {};
  }
};

const renderRouteHtml = async (templateHtml, pathname, initLandingPages, cleanupLandingPages) => {
  const dom = new JSDOM(templateHtml, {
    url: `https://book-fast.de${pathname}`,
    pretendToBeVisual: true,
  });
  const { window } = dom;
  setupPrerenderWindow(window);
  const restoreGlobals = installDomGlobals(window);
  const restoreTimers = installNoopTimers();

  try {
    initLandingPages({ isLoggedIn: false });
    await flush();
    await flush();
    return dom.serialize();
  } finally {
    cleanupLandingPages?.();
    restoreTimers();
    restoreGlobals();
    window.close();
  }
};

const outputPathForRoute = (pathname) => {
  if (pathname === '/') return distIndexPath;
  const routeDir = path.join(distDir, pathname.replace(/^\/+/, ''));
  return path.join(routeDir, 'index.html');
};

const main = async () => {
  const templateHtml = await readFile(distIndexPath, 'utf8');
  await copyFile(distIndexPath, distAppShellPath);

  const vite = await createServer({
    root: projectRoot,
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const landingLayout = await vite.ssrLoadModule('/src/pages/landing/LandingLayout.js');
    const { initLandingPages, cleanupLandingPages } = landingLayout;

    for (const route of ALL_STATIC_ROUTES) {
      const outputPath = outputPathForRoute(route.path);
      await mkdir(path.dirname(outputPath), { recursive: true });
      const html = await renderRouteHtml(templateHtml, route.path, initLandingPages, cleanupLandingPages);
      await writeFile(outputPath, html, 'utf8');
    }

    const notFoundHtml = await renderRouteHtml(templateHtml, '/404', initLandingPages, cleanupLandingPages);
    await writeFile(dist404Path, notFoundHtml, 'utf8');
    await writeFile(distSitemapPath, buildSitemapXml(), 'utf8');
  } finally {
    await vite.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
