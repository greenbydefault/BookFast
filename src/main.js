/**
 * BookFast - Main Entry Point
 * 
 * This file is intentionally kept minimal.
 * All page logic is in the /pages directory.
 * Shared utilities are in the /lib directory.
 */

import './styles/base.css';
import './styles/layout.css';
import { supabase } from './lib/supabaseClient.js';
import { loadSprite } from './components/Icons/sprite.js';
import { renderLanding } from './pages/Landing.js';
import { renderDashboard } from './pages/Dashboard.js';

/**
 * Initialize the application
 */
const init = async () => {
  // Load SVG sprite
  loadSprite();

  // Check for existing session
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    renderDashboard(session);
  } else {
    renderLanding();
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      renderDashboard(session);
    } else {
      renderLanding();
    }
  });
};

// Start the app
init();
