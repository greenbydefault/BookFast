/**
 * Settings - Payments Section (Stripe Connect)
 */
import { getState } from '../../../lib/store.js';
import { updateEntity } from '../../../lib/dataLayer.js';
import { createActionButton } from '../../../components/Button/Button.js';
import { refreshWorkspace } from './settingsHelpers.js';
import { startStripeConnect, fetchStripeConnectStatus } from '../../../lib/services/stripeConnectService.js';

/**
 * Handle Stripe Connect start
 */
const handleConnectStripe = async () => {
  const state = getState();
  const ws = state.currentWorkspace;

  if (!ws?.id) {
    alert('Kein Workspace ausgewählt');
    return;
  }

  try {
    const result = await startStripeConnect({
      workspaceId: ws.id,
      returnUrl: window.location.href,
      refreshUrl: window.location.href,
    });

    if (result.onboarding_url) {
      window.location.href = result.onboarding_url;
    }
  } catch (error) {
    console.error('Connect error:', error);
    alert('Fehler beim Verbinden: ' + error.message);
  }
};

/**
 * Handle Stripe status check (silent - no alerts)
 */
export const handleCheckStripeStatusSilent = async () => {
  const state = getState();
  const ws = state.currentWorkspace;

  if (!ws?.id || !ws.stripe_connected_account_id) return null;

  try {
    const result = await fetchStripeConnectStatus(ws.id);

    await refreshWorkspace();
    return result;
  } catch (error) {
    console.error('Status check error:', error);
    return null;
  }
};

/**
 * Handle Stripe status check (with user feedback)
 */
const handleCheckStripeStatus = async () => {
  const state = getState();
  const ws = state.currentWorkspace;

  if (!ws?.id) {
    alert('Kein Workspace ausgewählt');
    return;
  }

  try {
    const result = await fetchStripeConnectStatus(ws.id);

    await refreshWorkspace();
    renderPaymentsContent();

    const statusMessages = {
      active: 'Dein Stripe-Konto ist vollständig eingerichtet!',
      pending: 'Stripe prüft noch deine Angaben. Dies kann einige Minuten dauern.',
      requires_action: 'Bitte vervollständige dein Stripe-Profil, um Zahlungen zu empfangen.',
      inactive: 'Verbinde dein Stripe-Konto, um loszulegen.',
    };

    alert(statusMessages[result.payout_status] || 'Status aktualisiert.');
  } catch (error) {
    console.error('Status check error:', error);
    alert('Fehler beim Prüfen: ' + error.message);
  }
};

/**
 * Handle Stripe disconnect
 */
const handleDisconnectStripe = async () => {
  const state = getState();
  const ws = state.currentWorkspace;

  if (!ws?.id) {
    alert('Kein Workspace ausgewählt');
    return;
  }

  const confirmed = confirm(
    'Stripe-Verbindung trennen?\n\n' +
    'Dies entfernt die Stripe-Verbindung aus diesem Workspace. ' +
    'Du kannst danach das Onboarding erneut durchführen.\n\n' +
    'Hinweis: Der Stripe Account selbst bleibt bestehen.'
  );

  if (!confirmed) return;

  try {
    await updateEntity('workspaces', ws.id, {
      stripe_connected_account_id: null,
      payout_status: 'inactive',
      connect_mode: null,
    });

    await refreshWorkspace();
    renderPaymentsContent();
    alert('Stripe-Verbindung wurde getrennt. Du kannst das Onboarding jetzt erneut durchführen.');
  } catch (error) {
    console.error('Disconnect error:', error);
    alert('Fehler beim Trennen: ' + error.message);
  }
};

/**
 * Render Payments Content (Stripe Connect)
 */
export const renderPaymentsContent = async () => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const state = getState();
  const ws = state.currentWorkspace || {};

  const statusConfig = {
    inactive: { label: 'Nicht eingerichtet', color: 'var(--color-stone-500)', bg: 'var(--color-stone-100)' },
    pending: { label: 'In Prüfung', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    requires_action: { label: 'Aktion erforderlich', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    active: { label: 'Aktiv', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  };

  const status = statusConfig[ws.payout_status] || statusConfig.inactive;
  const isConnected = ws.stripe_connected_account_id;
  const isActive = ws.payout_status === 'active';
  const isPending = ws.payout_status === 'pending';
  const requiresAction = ws.payout_status === 'requires_action';

  const step1Done = isConnected;
  const step2Done = isActive;
  const step2Active = isConnected && !isActive;

  container.innerHTML = `
    <div style="max-width: 800px;">
      ${!isActive ? `
      <div class="settings-card" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1.25rem 0;">Stripe Einrichtung</h3>
        <div style="display: flex; gap: 1rem;">
          <div style="flex: 1; padding: 1rem; border-radius: 8px; background: ${step1Done ? 'rgba(16, 185, 129, 0.06)' : 'var(--color-stone-50)'}; border: 1px solid ${step1Done ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-stone-200)'};">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; ${step1Done ? 'background: #10b981; color: white;' : 'background: var(--color-stone-200); color: var(--color-stone-500);'}">
                ${step1Done ? '✓' : '1'}
              </span>
              <span style="font-weight: 500; ${step1Done ? 'color: #10b981;' : 'color: var(--color-stone-700);'}">Konto erstellen</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: var(--color-stone-500);">
              ${step1Done ? 'Stripe-Konto verbunden' : 'Verbinde dein Stripe-Konto'}
            </p>
          </div>

          <div style="flex: 1; padding: 1rem; border-radius: 8px; background: ${step2Done ? 'rgba(16, 185, 129, 0.06)' : step2Active ? 'rgba(245, 158, 11, 0.06)' : 'var(--color-stone-50)'}; border: 1px solid ${step2Done ? 'rgba(16, 185, 129, 0.2)' : step2Active ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-stone-200)'};">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; ${step2Done ? 'background: #10b981; color: white;' : step2Active ? 'background: #f59e0b; color: white;' : 'background: var(--color-stone-200); color: var(--color-stone-500);'}">
                ${step2Done ? '✓' : '2'}
              </span>
              <span style="font-weight: 500; ${step2Done ? 'color: #10b981;' : step2Active ? 'color: #f59e0b;' : 'color: var(--color-stone-700);'}">Verifizierung</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: var(--color-stone-500);">
              ${step2Done ? 'Verifizierung abgeschlossen' : isPending ? 'Stripe prüft deine Angaben...' : requiresAction ? 'Identität verifizieren' : 'Identität bestätigen'}
            </p>
          </div>

          <div style="flex: 1; padding: 1rem; border-radius: 8px; background: ${isActive ? 'rgba(16, 185, 129, 0.06)' : 'var(--color-stone-50)'}; border: 1px solid ${isActive ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-stone-200)'};">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; ${isActive ? 'background: #10b981; color: white;' : 'background: var(--color-stone-200); color: var(--color-stone-500);'}">
                ${isActive ? '✓' : '3'}
              </span>
              <span style="font-weight: 500; ${isActive ? 'color: #10b981;' : 'color: var(--color-stone-700);'}">Bereit</span>
            </div>
            <p style="margin: 0; font-size: 0.85rem; color: var(--color-stone-500);">
              ${isActive ? 'Zahlungen aktiviert!' : 'Zahlungen empfangen'}
            </p>
          </div>
        </div>

        ${requiresAction ? `
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 6px;">
          <p style="margin: 0; font-size: 0.9rem; color: #dc2626;">
            <strong>Aktion erforderlich:</strong> Bitte vervollständige dein Stripe-Profil, um Zahlungen empfangen zu können.
          </p>
        </div>
        ` : ''}

        ${isPending ? `
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.15); border-radius: 6px;">
          <p style="margin: 0; font-size: 0.9rem; color: #d97706;">
            <strong>In Prüfung:</strong> Stripe prüft deine Angaben. Dies dauert normalerweise nur wenige Minuten.
          </p>
        </div>
        ` : ''}

        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
          <div id="connect-stripe-actions" style="display: flex; gap: 1rem; flex-wrap: wrap;"></div>
        </div>
      </div>
      ` : `
      <div class="settings-card" style="margin-bottom: 1.5rem; border-color: rgba(16, 185, 129, 0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="width: 40px; height: 40px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">✓</span>
            <div>
              <h3 style="margin: 0 0 0.25rem 0;">Stripe Connect aktiv</h3>
              <p style="color: var(--color-stone-500); margin: 0; font-size: 0.9rem;">
                Dein Konto ist vollständig eingerichtet. Du kannst Online-Zahlungen empfangen.
              </p>
            </div>
          </div>
          <span style="font-size: 0.9rem; background: ${status.bg}; color: ${status.color}; padding: 0.4rem 0.8rem; border-radius: 16px; font-weight: 500;">
            ${status.label}
          </span>
        </div>
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="color: var(--color-stone-500); font-size: 0.75rem; text-transform: uppercase; margin: 0 0 0.25rem 0;">Stripe Account ID</p>
              <code style="font-size: 0.85rem; color: var(--color-stone-700);">${ws.stripe_connected_account_id}</code>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <div id="refresh-status-container"></div>
              <div id="disconnect-container"></div>
            </div>
          </div>
        </div>
      </div>
      `}

      ${isActive ? `
      <div class="settings-card" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0;">Akzeptierte Zahlungsarten</h3>
        <div style="display: grid; gap: 0.75rem;">
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
            <input type="checkbox" checked disabled style="width: 18px; height: 18px;">
            <span>Kreditkarte (Visa, Mastercard, Amex)</span>
            <span style="margin-left: auto; font-size: 0.8rem; color: var(--color-stone-500);">Standard</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: not-allowed; opacity: 0.5;">
            <input type="checkbox" disabled style="width: 18px; height: 18px;">
            <span>Klarna (Pay Later)</span>
            <span style="margin-left: auto; font-size: 0.8rem; color: var(--color-stone-500);">Coming soon</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: not-allowed; opacity: 0.5;">
            <input type="checkbox" disabled style="width: 18px; height: 18px;">
            <span>PayPal</span>
            <span style="margin-left: auto; font-size: 0.8rem; color: var(--color-stone-500);">Coming soon</span>
          </label>
        </div>
      </div>

      <div class="settings-card">
        <h3 style="margin: 0 0 1rem 0;">Auszahlungen</h3>
        <div class="settings-info-box">
          <strong>Hinweis:</strong> Auszahlungen werden 24 Stunden nach Bestätigung einer Buchung automatisch an dein Bankkonto überwiesen.
          Du kannst die Auszahlungseinstellungen direkt in deinem Stripe Dashboard verwalten.
        </div>
        <div style="margin-top: 1rem;">
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer"
             style="color: var(--color-stone-700); text-decoration: underline; font-size: 0.9rem;">
            Stripe Dashboard öffnen
          </a>
        </div>
      </div>
      ` : ''}
    </div>
  `;

  // Inject action buttons
  const actionsContainer = document.getElementById('connect-stripe-actions');
  if (actionsContainer) {
    const { element: connectBtn } = createActionButton({
      text: isConnected ? 'Onboarding fortsetzen' : 'Mit Stripe verbinden',
      loadingText: 'Verbinde...',
      className: 'btn-primary',
      onClick: handleConnectStripe,
    });
    actionsContainer.appendChild(connectBtn);

    if (isConnected) {
      const { element: statusBtn } = createActionButton({
        text: 'Status prüfen',
        loadingText: 'Prüfe...',
        className: 'btn-secondary',
        onClick: handleCheckStripeStatus,
      });
      actionsContainer.appendChild(statusBtn);
    }
  }

  const refreshContainer = document.getElementById('refresh-status-container');
  if (refreshContainer) {
    const { element: refreshBtn } = createActionButton({
      text: 'Status aktualisieren',
      loadingText: 'Lade...',
      className: 'btn-secondary',
      onClick: handleCheckStripeStatus,
    });
    refreshBtn.style.padding = '0.5rem 1rem';
    refreshBtn.style.fontSize = '0.85rem';
    refreshContainer.appendChild(refreshBtn);
  }

  const disconnectContainer = document.getElementById('disconnect-container');
  if (disconnectContainer) {
    const { element: disconnectBtn } = createActionButton({
      text: 'Trennen',
      loadingText: 'Trenne...',
      className: 'btn-secondary',
      onClick: handleDisconnectStripe,
    });
    disconnectBtn.style.padding = '0.5rem 1rem';
    disconnectBtn.style.fontSize = '0.85rem';
    disconnectBtn.style.color = '#ef4444';
    disconnectBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    disconnectContainer.appendChild(disconnectBtn);
  }
};
