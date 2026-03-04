/**
 * Onboarding Page - Workspace creation
 * Uses the same light, premium design as auth pages (auth.css)
 */

import { supabase } from '../lib/supabaseClient.js';
import { setState } from '../lib/store.js';
import { getDemoFromSession, clearDemoSession } from '../lib/DemoStore.js';

const app = document.querySelector('#app');

/**
 * Render the workspace onboarding page
 */
export const renderWorkspaceOnboarding = () => {
  // Apply auth-page body styles
  document.body.style.backgroundColor = 'var(--color-stone-50)';
  document.body.style.backgroundImage = 'radial-gradient(circle at 100% 0%, rgba(0,0,0,0.03) 0%, transparent 25%), radial-gradient(circle at 0% 100%, rgba(0,0,0,0.03) 0%, transparent 25%)';

  app.innerHTML = `
    <div class="auth-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; max-width: 460px; margin: 0 auto; padding: 1.5rem;">
      <div class="auth-card" style="width: 100%; background: white; padding: 3rem 2.5rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02); text-align: center;">
        
        <div style="margin-bottom: 2rem;">
          <a href="/" style="font-size: 1.5rem; font-weight: 800; color: var(--color-vulcan-900); text-decoration: none; letter-spacing: -0.03em;">BookFast</a>
        </div>

        <h1 style="margin: 0 0 0.75rem; font-size: 1.75rem; font-weight: 700; color: var(--color-vulcan-900); letter-spacing: -0.02em;">Welcome! 👋</h1>
        <p style="color: var(--color-stone-500); margin: 0 0 2rem; font-size: 0.95rem; line-height: 1.5;">Create your first workspace to get started with BookFast.</p>

        <form id="workspace-form" style="text-align: left;">
          <div style="margin-bottom: 1.25rem;">
            <label for="workspace-name" style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: var(--color-stone-700);">Workspace Name</label>
            <input 
              type="text" 
              id="workspace-name" 
              placeholder="e.g. My Booking App" 
              required
              style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--color-stone-200); background: white; color: var(--color-vulcan-900); font-size: 0.95rem; box-sizing: border-box; outline: none; transition: all 0.2s ease; font-family: inherit;"
            >
          </div>
          
          <button 
            type="submit" 
            id="create-workspace-btn"
            style="background: var(--color-vulcan-900); color: white; border: none; padding: 0.875rem 1.5rem; border-radius: 8px; width: 100%; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; margin-top: 0.5rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem; font-family: inherit;"
          >
            Create Workspace
          </button>

          <div id="errorMessage" style="margin-top: 1rem; padding: 0.75rem; border-radius: 6px; font-size: 0.9rem; line-height: 1.4; text-align: left; display: none; background-color: #fef2f2; color: #991b1b; border: 1px solid #fee2e2;"></div>
        </form>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-stone-100);">
          <p style="font-size: 0.85rem; color: var(--color-stone-400); margin: 0; line-height: 1.5;">
            A workspace is your business profile where you manage bookings, services, and customers.
          </p>
        </div>
      </div>
    </div>
  `;

  // Focus the input and pre-fill from demo session if available
  const nameInput = document.getElementById('workspace-name');
  const demoName = getDemoFromSession();
  if (demoName) {
    nameInput.value = demoName;
  }
  nameInput.focus();

  // Add focus styles dynamically
  nameInput.addEventListener('focus', () => {
    nameInput.style.borderColor = 'var(--color-vulcan-900)';
    nameInput.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.05)';
  });
  nameInput.addEventListener('blur', () => {
    nameInput.style.borderColor = 'var(--color-stone-200)';
    nameInput.style.boxShadow = 'none';
  });

  // Add hover/active styles to button
  const btn = document.getElementById('create-workspace-btn');
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'var(--color-vulcan-900)';
    btn.style.transform = 'translateY(-1px)';
    btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'var(--color-vulcan-900)';
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = 'none';
  });

  // Handle form submission
  const form = document.getElementById('workspace-form');
  const errorMessage = document.getElementById('errorMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;

    // Disable button during creation
    btn.disabled = true;
    btn.textContent = 'Creating...';
    btn.style.background = 'var(--color-stone-400)';
    btn.style.cursor = 'not-allowed';
    errorMessage.style.display = 'none';

    try {
      const { data, error } = await supabase.from('workspaces').insert({ name }).select().single();
      if (error) throw error;

      setState({
        workspaces: [data],
        currentWorkspace: data
      });

      // Clear demo session data
      clearDemoSession();

      // Reset body styles before transitioning to dashboard
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';

      // Redirect to dashboard
      const { renderDashboard } = await import('./Dashboard.js');
      const { data: { session } } = await supabase.auth.getSession();
      renderDashboard(session);
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Create Workspace';
      btn.style.background = 'var(--color-vulcan-900)';
      btn.style.cursor = 'pointer';
    }
  });
};
