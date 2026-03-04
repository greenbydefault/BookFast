/**
 * PortalActions - Customer actions (PDF download, cancel booking)
 *
 * Cancel requires step-up verification via email confirmation.
 * PDF download lazy-loads the pdfExport module on demand.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Statuses that allow customer cancellation
const CANCELLABLE = ['confirmed', 'pending_approval', 'pending'];

/**
 * Render the actions card
 */
export const renderPortalActions = (booking, workspace) => {
    const canCancel = CANCELLABLE.includes(booking.status);
    const canPayOnline = booking.payment_status === 'unpaid' && workspace?.payout_status === 'active';
    const showPaymentUnavailable = booking.payment_status === 'unpaid' && !canPayOnline;

    return `
        <div class="portal-card portal-actions-card">
            <h3 class="portal-card-title">Aktionen</h3>

            <button class="portal-btn portal-btn-secondary" id="portal-download-pdf">
                Rechnung als PDF herunterladen
            </button>

            ${canCancel ? `
            <div class="portal-cancel-section" id="portal-cancel-section">
                <div class="portal-cancel-form" id="portal-cancel-form">
                    <p class="portal-cancel-warning">
                        Ihre Buchung wird unwiderruflich storniert.
                        Eine Rückerstattung erfolgt je nach Stornierungsbedingungen des Anbieters.
                    </p>
                    <label class="portal-form-label" for="portal-cancel-email">
                        Zur Bestätigung geben Sie bitte Ihre E-Mail-Adresse ein:
                    </label>
                    <input
                        type="email"
                        id="portal-cancel-email"
                        class="portal-input"
                        placeholder="ihre@email.de"
                        autocomplete="email"
                    />
                    <button class="portal-btn portal-btn-danger-outline" id="portal-cancel-confirm">
                        Buchung stornieren
                    </button>
                    <p class="portal-cancel-error" id="portal-cancel-error" hidden></p>
                </div>
            </div>` : ''}

            ${canPayOnline ? `
            <div class="portal-pay-section mt-6 border-t pt-6">
                <h4 class="font-bold mb-2">Zahlung offen</h4>
                <p class="mb-4 text-sm">Bitte begleichen Sie den offenen Betrag von <strong>${Number(booking.total_price).toFixed(2)} €</strong>.</p>
                <button class="portal-btn portal-btn-primary w-full" id="portal-pay-now">
                    Jetzt online bezahlen
                </button>
                <p id="portal-pay-error" class="text-red-600 text-sm mt-2 hidden"></p>
            </div>
            ` : ''}

            ${showPaymentUnavailable ? `
            <div class="portal-pay-section mt-6 border-t pt-6">
                <h4 class="font-bold mb-2">Zahlung offen</h4>
                <p class="mb-4 text-sm">Online-Zahlung ist derzeit nicht verfügbar. Bitte kontaktieren Sie den Anbieter für eine alternative Zahlungsart.</p>
            </div>
            ` : ''}
        </div>
    `;
};

/**
 * Initialize event handlers for portal actions
 */
export const initPortalActions = (booking, workspace, token) => {
    // PDF Download
    const downloadBtn = document.getElementById('portal-download-pdf');
    if (downloadBtn) {
        const initialLabel = downloadBtn.textContent;
        downloadBtn.addEventListener('click', async () => {
            if (downloadBtn.disabled) return;

            downloadBtn.disabled = true;
            downloadBtn.textContent = 'PDF wird erstellt...';

            try {
                const { generateInvoicePDF } = await import('../dashboard/booking-detail/pdfExport.js');
                generateInvoicePDF(booking, workspace);
            } catch (error) {
                console.error('PDF export failed:', error);
                alert('Fehler beim PDF-Export: ' + error.message);
            } finally {
                downloadBtn.disabled = false;
                downloadBtn.textContent = initialLabel;
            }
        });
    }

    // Cancel flow
    const cancelConfirm = document.getElementById('portal-cancel-confirm');
    const cancelEmail = document.getElementById('portal-cancel-email');
    const cancelError = document.getElementById('portal-cancel-error');

    if (cancelConfirm) {
        cancelConfirm.addEventListener('click', async () => {
            const email = cancelEmail?.value?.trim();
            if (!email) {
                showError('Bitte geben Sie Ihre E-Mail-Adresse ein.');
                return;
            }

            cancelConfirm.disabled = true;
            cancelConfirm.textContent = 'Wird storniert...';
            if (cancelError) cancelError.hidden = true;

            try {
                const res = await fetch(`${SUPABASE_URL}/functions/v1/portal-action`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify({
                        token,
                        action: 'cancel',
                        verification_email: email,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Stornierung fehlgeschlagen');
                }

                // Success — replace cancel section with confirmation
                const section = document.getElementById('portal-cancel-section');
                if (section) {
                    section.innerHTML = `
                        <div class="portal-cancel-success">
                            <p class="portal-cancel-success-text">
                                Ihre Buchung wurde erfolgreich storniert.
                            </p>
                        </div>
                    `;
                }

                // Update status badge
                updateStatusBadge('cancelled');

            } catch (err) {
                showError(err.message);
                cancelConfirm.disabled = false;
                cancelConfirm.textContent = 'Buchung stornieren';
            }
        });
    }

    function showError(msg) {
        if (cancelError) {
            cancelError.textContent = msg;
            cancelError.hidden = false;
        }
    }

    // Payment Flow
    const payBtn = document.getElementById('portal-pay-now');
    const payError = document.getElementById('portal-pay-error');

    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            payBtn.disabled = true;
            payBtn.textContent = 'Leite zu Stripe weiter...';
            if (payError) payError.classList.add('hidden');

            try {
                const res = await fetch(`${SUPABASE_URL}/functions/v1/checkout-pay-booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify({
                        booking_id: booking.id,
                        token: token
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Zahlung konnte nicht initiiert werden.');
                }

                if (data.checkout_url) {
                    window.location.href = data.checkout_url;
                } else {
                    throw new Error('Keine Checkout-URL erhalten.');
                }

            } catch (err) {
                console.error(err);
                if (payError) {
                    payError.textContent = err.message;
                    payError.classList.remove('hidden');
                }
                payBtn.disabled = false;
                payBtn.textContent = 'Jetzt online bezahlen';
            }
        });
    }
};

/**
 * Update status badge after cancellation
 */
function updateStatusBadge(newStatus) {
    const badge = document.querySelector('.portal-status');
    if (badge) {
        badge.className = 'portal-status portal-status--cancelled';
        badge.textContent = 'Storniert';
    }
}
