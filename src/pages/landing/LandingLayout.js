/**
 * Landing Layout
 * Wraps every landing page with Navigation + Content + Footer.
 */
import { renderNavigation } from '../../components/landing/Navigation.js';
import { renderFooter } from '../../components/landing/Footer.js';
import { initLandingRouter } from '../../lib/landingRouter.js';
import { registerAllLandingPages } from './registry.js';
import '../../locales/en/features/index.js';
import '../../locales/en/featureDemoModules/index.js';

const setLandingClasses = () => {
  document.documentElement.classList.add('landing-active');
  document.body.classList.add('landing-active');
};

const createNavigationElement = ({ isLoggedIn = false } = {}) => {
  const container = document.createElement('div');
  renderNavigation(container, { isLoggedIn });
  return container.firstElementChild;
};

const createFooterElement = () => {
  const container = document.createElement('div');
  renderFooter(container);
  return container.firstElementChild;
};

const ensureLandingContent = (existingContent) => {
  const content = existingContent || document.createElement('main');
  content.id = 'landing-content';
  content.style.minHeight = '60vh';
  return content;
};

const ensureLandingShell = (app, { isLoggedIn = false } = {}) => {
  const navigation = createNavigationElement({ isLoggedIn });
  const content = ensureLandingContent(app.querySelector('#landing-content'));
  const footer = app.querySelector('.landing-footer') || createFooterElement();

  if (!navigation || !footer) return;
  app.replaceChildren(navigation, content, footer);
};

/**
 * Initialize the landing page system.
 * Called from main.js when user is not logged in (or on public routes).
 */
export const initLandingPages = ({ isLoggedIn = false } = {}) => {
  const app = document.querySelector('#app');
  if (!app) return;
  setLandingClasses();
  ensureLandingShell(app, { isLoggedIn });

  registerAllLandingPages();
  initLandingRouter();
};

export const updateLandingAuthState = ({ isLoggedIn = false } = {}) => {
  const app = document.querySelector('#app');
  if (!app) return;
  setLandingClasses();
  ensureLandingShell(app, { isLoggedIn });
};

/**
 * Cleanup when switching away from landing
 */
export const cleanupLandingPages = () => {
  document.documentElement.classList.remove('landing-active');
  document.body.classList.remove('landing-active');
};
