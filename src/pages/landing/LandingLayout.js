/**
 * Landing Layout
 * Wraps every landing page with Navigation + Content + Footer.
 */
import '../../styles/landing.css';
import { renderNavigation } from '../../components/landing/Navigation.js';
import { renderFooter } from '../../components/landing/Footer.js';
import { initLandingRouter } from '../../lib/landingRouter.js';
import { registerAllLandingPages } from './registry.js';

const app = document.querySelector('#app');

/**
 * Initialize the landing page system.
 * Called from main.js when user is not logged in (or on public routes).
 */
export const initLandingPages = ({ isLoggedIn = false } = {}) => {
  document.body.classList.add('landing-active');

  app.innerHTML = '';

  renderNavigation(app, { isLoggedIn });

  const content = document.createElement('main');
  content.id = 'landing-content';
  content.style.minHeight = '60vh';
  app.appendChild(content);

  renderFooter(app);

  registerAllLandingPages();
  initLandingRouter();
};

/**
 * Cleanup when switching away from landing
 */
export const cleanupLandingPages = () => {
  document.body.classList.remove('landing-active');
};
