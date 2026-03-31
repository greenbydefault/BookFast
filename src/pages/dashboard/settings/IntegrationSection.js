/**
 * Settings - Integration Section (Stripe Connect)
 */
import { getState } from '../../../lib/store.js';
import { createActionButton } from '../../../components/Button/Button.js';
import { getIconString } from '../../../components/Icons/Icon.js';
import { refreshWorkspace } from './settingsHelpers.js';
import { startStripeConnect, fetchStripeConnectStatus } from '../../../lib/services/stripeConnectService.js';
import { mapStripeWorkspaceStatus } from '../../../lib/integration/statusMapping.js';

const integrationUiState = {
  setupOpen: true,
  paymentMethods: {
    paypal: false,
    card: true,
    klarna: false,
  },
};

const getStepConfig = (ws) => {
  const stripe = mapStripeWorkspaceStatus({
    stripeConnectedAccountId: ws?.stripe_connected_account_id,
    payoutStatus: ws?.payout_status,
  });
  const isConnected = stripe.connected;
  const isActive = stripe.ready;

  return [
    {
      index: 1,
      title: 'Stripe Konto erstellen',
      subtitle: 'Verbinde dein Stripe-Konto',
      done: isConnected,
    },
    {
      index: 2,
      title: 'Verifizierung',
      subtitle: 'Identität bestätigen',
      done: isActive,
    },
    {
      index: 3,
      title: 'Bereit',
      subtitle: 'Zahlungen empfangen',
      done: isActive,
    },
  ];
};

const paymentMethodConfig = [
  {
    key: 'paypal',
    title: 'PayPal',
    subtitle: 'Digitale Wallet-Zahlung für einen schnellen Checkout.',
    icon: 'money-hand',
  },
  {
    key: 'card',
    title: 'Kreditkarte (Visa, Mastercard, Amex)',
    subtitle: 'Akzeptieren Sie Kartenzahlungen direkt über Stripe.',
    icon: 'bank-card',
  },
  {
    key: 'klarna',
    title: 'Klarna (Pay Later)',
    subtitle: 'Später bezahlen mit Klarna, sofern in Stripe verfügbar.',
    icon: 'clock',
  },
];

const getProgressSegments = (completed, total) => {
  const totalSegments = 48;
  const filledSegments = Math.round((completed / total) * totalSegments);
  return Array.from({ length: totalSegments }, (_, idx) =>
    `<div class="integration-progress-segment ${idx < filledSegments ? 'is-active' : ''}"></div>`
  ).join('');
};

const handleConnectStripe = async () => {
  const state = getState();
  const ws = state.currentWorkspace;

  if (!ws?.id) {
    alert('Kein Workspace ausgewählt');
    return;
  }

  const popup = window.open('', '_blank');

  try {
    if (popup && !popup.closed) {
      popup.document.title = 'Stripe wird geöffnet...';
      popup.document.body.innerHTML = '<p style="font-family: sans-serif; padding: 16px;">Stripe wird vorbereitet...</p>';
    }

    const result = await startStripeConnect({
      workspaceId: ws.id,
      returnUrl: window.location.href,
      refreshUrl: window.location.href,
    });

    if (result.onboarding_url) {
      if (popup && !popup.closed) {
        popup.location.href = result.onboarding_url;
      } else {
        window.location.href = result.onboarding_url;
      }
      return;
    }

    throw new Error('Keine Onboarding-URL erhalten.');
  } catch (error) {
    if (popup && !popup.closed) {
      popup.close();
    }
    console.error('Connect error:', error);
    alert(`Fehler beim Verbinden: ${error.message}`);
  }
};

const handleCheckIntegrationStatus = async () => {
  const state = getState();
  const ws = state.currentWorkspace;

  if (!ws?.id || !ws.stripe_connected_account_id) {
    return;
  }

  try {
    await fetchStripeConnectStatus(ws.id);
    await refreshWorkspace();
    await renderIntegrationContent();
  } catch (error) {
    console.error('Status check error:', error);
    alert(`Fehler beim Prüfen: ${error.message}`);
  }
};

export const renderIntegrationContent = async () => {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const state = getState();
  const ws = state.currentWorkspace || {};
  const stripe = mapStripeWorkspaceStatus({
    stripeConnectedAccountId: ws.stripe_connected_account_id,
    payoutStatus: ws.payout_status,
  });
  const steps = getStepConfig(ws);
  const completedSteps = steps.filter(step => step.done).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const isConnected = stripe.connected;
  const isReady = stripe.ready;
  const canShowPaymentMethods = isReady;
  const primaryButtonText = isReady
    ? 'Stripe-Angaben bearbeiten'
    : isConnected
      ? 'Einrichtung fortsetzen'
      : 'Einrichtung starten';

  container.innerHTML = `
    <div class="integration-setup">
      <section class="workspace-visual-card">
        <div class="integration-setup__header">
          <div>
            <h2 class="workspace-visual-card__title">Stripe Einrichtung</h2>
            <p class="workspace-visual-card__subtitle">${completedSteps} von ${totalSteps} erforderlichen Schritten abgeschlossen</p>
          </div>
          <span class="integration-setup__percent">${progressPercent} / 100%</span>
        </div>
        <div class="integration-progress">${getProgressSegments(completedSteps, totalSteps)}</div>

        <div class="workspace-checklist">
          <article class="workspace-checklist-item">
            <div class="workspace-checklist-item__left">
              <span class="workspace-checklist-item__icon workspace-checklist-item__icon--secondary">
                ${getIconString('check')}
              </span>
              <div>
                <h3 class="workspace-checklist-item__title">Stripe Connect ${isConnected ? 'aktiv' : 'inaktiv'}</h3>
                <p class="workspace-checklist-item__subtitle">
                  ${isConnected ? 'Dein Konto ist vollständig eingerichtet. Du kannst Online-Zahlungen empfangen.' : 'Verbinde dein Konto, um die Einrichtung zu starten.'}
                </p>
              </div>
            </div>
            <div class="workspace-checklist-item__actions">
              <span class="integration-status-tag ${isConnected ? 'is-connected' : 'is-disconnected'}">
                ${stripe.label}
              </span>
              <button type="button" class="workspace-accordion-btn ${integrationUiState.setupOpen ? 'is-open' : ''}" data-integration-toggle-setup aria-expanded="${integrationUiState.setupOpen ? 'true' : 'false'}">
                ${getIconString('arrow-down')}
              </button>
            </div>
          </article>
          ${integrationUiState.setupOpen ? steps.map((step) => `
            <article class="workspace-checklist-item">
              <div class="workspace-checklist-item__left">
                <span class="integration-step-index">${step.done ? '✓' : step.index}</span>
                <div>
                  <h3 class="workspace-checklist-item__title">${step.title}</h3>
                  <p class="workspace-checklist-item__subtitle">${step.subtitle}</p>
                </div>
              </div>
              <div class="workspace-checklist-item__actions">
                <span class="integration-status-tag ${step.done ? 'is-connected' : 'is-disconnected'}">
                  ${step.done ? 'Verbunden' : 'Nicht verbunden'}
                </span>
              </div>
            </article>
          `).join('') : ''}
        </div>

        <div class="integration-setup__actions" id="integration-actions"></div>
      </section>

      <section class="workspace-visual-card integration-payment-methods ${canShowPaymentMethods ? '' : 'is-locked'}">
        <h2 class="workspace-visual-card__title">Akzeptierte Zahlungsarten</h2>
        <p class="workspace-visual-card__subtitle">Legen Sie fest, welche Zahlungsarten Ihre Kunden beim Checkout sehen.</p>

        <div class="workspace-settings-list integration-payment-methods__list">
          ${paymentMethodConfig.map((method) => `
            <article class="workspace-settings-item integration-payment-methods__item">
              <div class="workspace-settings-item__left">
                <span class="workspace-settings-item__icon">${getIconString(method.icon)}</span>
                <div>
                  <h3 class="workspace-settings-item__title">${method.title}</h3>
                  <p class="workspace-settings-item__subtitle">${method.subtitle}</p>
                </div>
              </div>
              <label class="workspace-toggle" aria-label="${method.title} aktivieren">
                <input type="checkbox" data-payment-toggle="${method.key}" ${integrationUiState.paymentMethods[method.key] ? 'checked' : ''} ${canShowPaymentMethods ? '' : 'disabled'} />
                <span class="workspace-toggle__slider"></span>
              </label>
            </article>
          `).join('')}
        </div>

        ${canShowPaymentMethods ? '' : `
          <div class="integration-payment-methods__lock">
            Zahlungsarten werden nach abgeschlossener Einrichtung freigeschaltet.
          </div>
        `}
      </section>
    </div>
  `;

  const setupToggleBtn = container.querySelector('[data-integration-toggle-setup]');
  if (setupToggleBtn) {
    setupToggleBtn.addEventListener('click', () => {
      integrationUiState.setupOpen = !integrationUiState.setupOpen;
      renderIntegrationContent();
    });
  }

  const actionsContainer = document.getElementById('integration-actions');
  if (actionsContainer) {
    const { element: connectBtn } = createActionButton({
      text: primaryButtonText,
      loadingText: 'Verbinde...',
      className: 'btn-primary',
      onClick: handleConnectStripe,
    });
    actionsContainer.appendChild(connectBtn);

    if (isConnected && !isReady) {
      const { element: statusBtn } = createActionButton({
        text: 'Status prüfen',
        loadingText: 'Prüfe...',
        className: 'btn-secondary',
        onClick: handleCheckIntegrationStatus,
      });
      actionsContainer.appendChild(statusBtn);
    }
  }

  const paymentToggles = container.querySelectorAll('[data-payment-toggle]');
  paymentToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const key = e.target.dataset.paymentToggle;
      integrationUiState.paymentMethods[key] = e.target.checked;
    });
  });
};
