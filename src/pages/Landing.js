/**
 * Landing Page - Pre-login view
 */

import { createButton } from '../components/Button/Button.js';

const app = document.querySelector('#app');

/**
 * Render the landing page
 */
export const renderLanding = () => {
    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: radial-gradient(circle at center, #2a2a2a, #1a1a1a);">
      <div style="text-align: center; max-width: 600px; padding: 2rem;">
        <h1 style="font-size: 3.5rem; background: linear-gradient(45deg, #fff, #a8a29e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">BookFast</h1>
        <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 3rem;">Experience the future of booking. Fast, secure, and beautiful.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <a href="/login.html" id="login-btn-container"></a>
          <a href="/register.html" id="register-btn-container"></a>
        </div>
      </div>
    </div>
  `;

    const loginBtn = createButton('Log In', () => window.location.href = '/login.html', 'btn-primary');
    document.querySelector('#login-btn-container').appendChild(loginBtn);

    const registerBtn = createButton('Sign Up', () => window.location.href = '/register.html', 'btn-primary');
    registerBtn.style.background = 'transparent';
    registerBtn.style.border = '1px solid rgba(255,255,255,0.2)';
    document.querySelector('#register-btn-container').appendChild(registerBtn);
};
