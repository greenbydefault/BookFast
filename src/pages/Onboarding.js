/**
 * Onboarding Page - Workspace creation
 */

import { supabase } from '../lib/supabaseClient.js';
import { setState } from '../lib/store.js';
import { createButton } from '../components/Button/Button.js';

const app = document.querySelector('#app');

/**
 * Render the workspace onboarding page
 */
export const renderWorkspaceOnboarding = () => {
    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div style="text-align: center; max-width: 400px; padding: 2rem; background: var(--bg-card); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2>Welcome to BookFast!</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Create your first workspace to get started.</p>
        <form id="workspace-form">
          <input type="text" id="workspace-name" placeholder="Workspace Name (e.g. My Booking App)" required style="width: 100%; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #333; background: #111; color: white;">
          <div id="create-workspace-btn"></div>
        </form>
      </div>
    </div>
  `;

    const handleCreate = async () => {
        const name = document.getElementById('workspace-name').value;
        if (!name) return;

        const { data, error } = await supabase.from('workspaces').insert({ name }).select().single();
        if (error) {
            alert(error.message);
            return;
        }

        setState({
            workspaces: [data],
            currentWorkspace: data
        });

        // Redirect to dashboard - import dynamically to avoid circular dependency
        const { renderDashboard } = await import('./Dashboard.js');
        const { data: { session } } = await supabase.auth.getSession();
        renderDashboard(session);
    };

    const btn = createButton('Create Workspace', handleCreate, 'btn-primary');
    btn.style.width = '100%';
    document.querySelector('#create-workspace-btn').appendChild(btn);
};
