/**
 * PortalPage - Customer Booking Portal (Magic Link)
 * 
 * Public page at /b/{token} — no authentication required.
 * Verifies token via Edge Function and renders booking details.
 */

import './portal.css';
import { renderPortalBookingInfo } from './PortalBookingInfo.js';
import { renderPortalInvoice } from './PortalInvoiceView.js';
import { renderPortalActions, initPortalActions } from './PortalActions.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Extract token from URL path /b/{token}
 */
const getTokenFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/b\/([a-f0-9]{64})$/);
    return match ? match[1] : null;
};

/**
 * Call portal-verify Edge Function (2-step: token → PIN → data)
 */
const verifyToken = async (token, pinCode = null) => {
    const body = { token };
    if (pinCode) body.pin_code = pinCode;

    const res = await fetch(`${SUPABASE_URL}/functions/v1/portal-verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || `Fehler ${res.status}`);
    }

    return data;
};

/**
 * Render loading state
 */
const renderLoading = () => `
    <div class="portal-wrapper">
        <div class="portal-loading">
            <div class="portal-loading-spinner"></div>
            <p>Buchung wird geladen...</p>
        </div>
    </div>
`;

/**
 * Render error state
 */
const renderError = (message) => `
    <div class="portal-wrapper">
        <div class="portal-error">
            <div class="portal-error-icon">!</div>
            <h2>Link nicht gültig</h2>
            <p>${message}</p>
        </div>
    </div>
`;

/**
 * Render PIN entry screen
 */
const renderPinScreen = () => `
    <div class="portal-wrapper">
        <div class="portal-pin-screen">
            <div class="portal-pin-card">
                <div class="portal-pin-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <h2 class="portal-pin-title">Zugangscode eingeben</h2>
                <p class="portal-pin-desc">Bitte geben Sie den 5-stelligen Code ein, den Sie per E-Mail erhalten haben.</p>
                <form id="portal-pin-form" class="portal-pin-form">
                    <div class="portal-pin-inputs" id="portal-pin-inputs">
                        <input type="text" inputmode="numeric" maxlength="1" class="portal-pin-digit" data-idx="0" autocomplete="off" />
                        <input type="text" inputmode="numeric" maxlength="1" class="portal-pin-digit" data-idx="1" autocomplete="off" />
                        <input type="text" inputmode="numeric" maxlength="1" class="portal-pin-digit" data-idx="2" autocomplete="off" />
                        <input type="text" inputmode="numeric" maxlength="1" class="portal-pin-digit" data-idx="3" autocomplete="off" />
                        <input type="text" inputmode="numeric" maxlength="1" class="portal-pin-digit" data-idx="4" autocomplete="off" />
                    </div>
                    <p id="portal-pin-error" class="portal-pin-error" style="display:none;"></p>
                    <button type="submit" class="portal-btn portal-btn-secondary portal-pin-submit" id="portal-pin-submit" disabled>
                        Bestätigen
                    </button>
                </form>
            </div>
        </div>
    </div>
`;

/**
 * Render the full portal page
 */
const renderPortalContent = (booking, workspace, token) => {
    const companyName = workspace?.company_name || workspace?.name || 'BookFast';

    return `
        <div class="portal-wrapper">
            <header class="portal-header">
                <div class="portal-header-inner">
                    <span class="portal-brand">${companyName}</span>
                    <span class="portal-header-label">Buchungsübersicht</span>
                </div>
            </header>

            <main class="portal-main">
                <div class="portal-grid">
                    <div class="portal-col-main">
                        ${renderPortalInvoice(booking, workspace)}
                    </div>
                    <div class="portal-col-side">
                        ${renderPortalBookingInfo(booking)}
                        ${renderPortalActions(booking, workspace)}
                    </div>
                </div>
            </main>

            <footer class="portal-footer">
                <p>Powered by BookFast</p>
            </footer>
        </div>
    `;
};

/**
 * Set security meta tags
 */
const setSecurityMeta = () => {
    // noindex
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
};

/**
 * Initialize PIN input field behavior (auto-focus, paste support)
 */
const initPinInputs = (token) => {
    const inputs = document.querySelectorAll('.portal-pin-digit');
    const form = document.getElementById('portal-pin-form');
    const submitBtn = document.getElementById('portal-pin-submit');
    const errorEl = document.getElementById('portal-pin-error');

    const getPin = () => Array.from(inputs).map(i => i.value).join('');

    const updateSubmitState = () => {
        const pin = getPin();
        submitBtn.disabled = pin.length !== 5 || !/^\d{5}$/.test(pin);
    };

    // Focus first input
    inputs[0]?.focus();

    inputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val.slice(0, 1);
            if (val && idx < 4) inputs[idx + 1].focus();
            updateSubmitState();
            errorEl.style.display = 'none';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                inputs[idx - 1].focus();
                inputs[idx - 1].value = '';
                updateSubmitState();
            }
        });

        // Paste support — fill all 5 fields
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 5);
            paste.split('').forEach((char, i) => {
                if (inputs[i]) inputs[i].value = char;
            });
            if (paste.length > 0) inputs[Math.min(paste.length, 4)].focus();
            updateSubmitState();
        });
    });

    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pin = getPin();
        if (pin.length !== 5) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird überprüft...';
        errorEl.style.display = 'none';

        try {
            const data = await verifyToken(token, pin);

            if (data.booking && data.workspace) {
                const app = document.getElementById('app');
                app.innerHTML = renderPortalContent(data.booking, data.workspace, token);
                initPortalActions(data.booking, data.workspace, token);
            }
        } catch (err) {
            errorEl.textContent = err.message || 'Falscher Code. Bitte versuchen Sie es erneut.';
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Bestätigen';
            // Clear inputs
            inputs.forEach(i => { i.value = ''; });
            inputs[0].focus();
        }
    });
};

/**
 * Main entry point — called from main.js
 */
export const renderPortalPage = async () => {
    const app = document.getElementById('app');
    if (!app) return;

    // Security meta
    setSecurityMeta();

    // Add portal body class
    document.body.classList.add('portal-active');

    // Show loading
    app.innerHTML = renderLoading();

    // Extract token
    const token = getTokenFromUrl();
    if (!token) {
        app.innerHTML = renderError('Ungültiger Link. Bitte überprüfen Sie die URL.');
        return;
    }

    try {
        // Step 1: Validate token (no PIN yet)
        const data = await verifyToken(token);

        if (data.requires_pin) {
            // Show PIN entry screen
            app.innerHTML = renderPinScreen();
            initPinInputs(token);
            return;
        }

        // No PIN required (fallback for tokens without PIN)
        if (data.booking && data.workspace) {
            app.innerHTML = renderPortalContent(data.booking, data.workspace, token);
            initPortalActions(data.booking, data.workspace, token);
        }

    } catch (err) {
        console.error('Portal verify failed:', err);

        const messages = {
            'This link has been revoked': 'Dieser Link wurde widerrufen und ist nicht mehr gültig.',
            'This link has expired': 'Dieser Link ist abgelaufen.',
            'Invalid or expired link': 'Ungültiger oder abgelaufener Link.',
        };

        const msg = messages[err.message] || err.message || 'Ein Fehler ist aufgetreten.';
        app.innerHTML = renderError(msg);
    }
};
