/**
 * Home Page - Dashboard Landing with Setup Checklist
 */

import './HomePage.css';
import { getState } from '../../lib/store.js';
import { fetchEntities } from '../../lib/dataLayer.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { navigate } from '../../lib/router.js';

export const renderHomePage = async () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const state = getState();
    const workspace = state.currentWorkspace;

    // Update top bar breadcrumb
    const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
    if (topBarBreadcrumb) {
        topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} Home</span>`;
    }

    // Clear top bar actions
    const topBarActions = document.getElementById('top-bar-actions');
    if (topBarActions) {
        topBarActions.innerHTML = '';
    }

    // Show loading state
    mainContent.innerHTML = `
    <div class="home-page">
        <h1 class="home-page__title">Willkommen zurück, ${state.user?.user_metadata?.full_name || 'User'}! 👋</h1>
        <p class="home-page__subtitle">Ihr aktueller Einrichtungsstatus im Überblick.</p>
        <div class="home-page__loading">Wird geladen...</div>
    </div>
  `;

    // Fetch all necessary data to check status
    const [services, addons, staff, objects, sites, templates, vouchers] = await Promise.all([
        fetchEntities('services', { perPage: 1 }),
        fetchEntities('addons', { perPage: 1 }),
        fetchEntities('staff', { perPage: 1 }),
        fetchEntities('objects', { perPage: 1 }),
        fetchEntities('sites', { perPage: 1 }),
        fetchEntities('email_templates', { perPage: 1 }),
        fetchEntities('vouchers', { perPage: 1 })
    ]);

    // Check Status
    const hasBasicInfo = workspace?.company_name && workspace?.company_address && workspace?.tax_id && (workspace?.iban || workspace?.bank_name);
    const hasServices = services.total > 0;
    const hasAddons = addons.total > 0;
    const hasStaff = staff.total > 0;
    const hasObjects = objects.total > 0;
    const hasStripe = workspace?.stripe_connected_account_id && workspace?.payout_status === 'active';
    const hasSites = sites.items.some(s => s.is_active);
    const hasTemplates = templates.total > 0;
    const hasVouchers = vouchers.total > 0;

    // Define Steps
    const steps = [
        // ESSENTIAL
        {
            id: 'basics',
            label: 'Unternehmensdaten einrichten',
            subtext: 'Hinterlegen Sie Name, Adresse, Steuernummer und Bankverbindung Ihres Unternehmens.',
            done: hasBasicInfo,
            link: 'settings',
            linkParams: '?tab=account',
            icon: 'bank',
            required: true
        },
        {
            id: 'objects',
            label: 'Objekte anlegen',
            subtext: 'Erstellen Sie Räume oder Ressourcen, die gebucht werden können.',
            done: hasObjects,
            link: 'objects',
            icon: 'package',
            required: true
        },
        {
            id: 'services',
            label: 'Services erstellen',
            subtext: 'Legen Sie Services an, die Ihre Gäste buchen können.',
            done: hasServices,
            link: 'services',
            icon: 'list',
            required: true
        },
        {
            id: 'stripe',
            label: 'Zahlungen verbinden',
            subtext: 'Verbinden Sie Ihren Stripe Account für Online-Zahlungen.',
            done: hasStripe,
            link: 'settings',
            linkParams: '?tab=payments',
            icon: 'bank-card',
            required: true
        },

        // OPTIONAL
        {
            id: 'staff',
            label: 'Team einladen',
            subtext: 'Fügen Sie Mitglieder hinzu und weisen Sie diese Services zu.',
            done: hasStaff,
            link: 'staff',
            icon: 'user',
            required: false
        },
        {
            id: 'addons',
            label: 'Add-ons hinzufügen',
            subtext: 'Bieten Sie optionale Zusatzoptionen zu Ihren Services an.',
            done: hasAddons,
            link: 'addons',
            icon: 'blocks-integration',
            required: false
        },
        {
            id: 'vouchers',
            label: 'Gutscheine erstellen',
            subtext: 'Erstellen Sie Rabattcodes für Aktionen und Sonderangebote.',
            done: hasVouchers,
            link: 'vouchers',
            icon: 'ticket-percent',
            required: false
        },
        {
            id: 'website',
            label: 'Webseite verbinden',
            subtext: 'Integrieren Sie das Buchungs-Widget auf Ihrer Webseite.',
            done: hasSites,
            link: 'settings',
            linkParams: '?tab=workspace',
            icon: 'globe',
            required: true
        },
        {
            id: 'templates',
            label: 'E-Mail-Vorlagen anpassen',
            subtext: 'Personalisieren Sie Bestätigungen und Benachrichtigungen.',
            done: hasTemplates,
            link: 'settings',
            linkParams: '?tab=email-templates',
            icon: 'mail',
            required: false
        }
    ];

    const requiredSteps = steps.filter(s => s.required);
    const completedRequired = requiredSteps.filter(s => s.done).length;
    const progressPercent = Math.round((completedRequired / requiredSteps.length) * 100);

    // Provide N granular segments for the bar (e.g. 50 segments = 2% per segment)
    const TOTAL_SEGMENTS = 50;
    const filledSegments = Math.round((progressPercent / 100) * TOTAL_SEGMENTS);

    const renderStep = (step) => {
        const isDone = step.done;

        // Icon box style
        const iconBoxClass = '';
        const icon = getIconString(step.icon);

        // Status badge
        const badgeClass = isDone ? 'status-badge--done' : 'status-badge--open';
        const badgeText = isDone ? 'Erledigt' : 'Offen';

        return `
        <div class="home-checklist-step next-step-btn" data-link="${step.link}" data-params="${step.linkParams || ''}">
            <div class="home-checklist-step__icon-box ${iconBoxClass}">
                ${icon}
            </div>
            <div class="home-checklist-step__content">
                <div class="home-checklist-step__text-group">
                    <h3 class="home-checklist-step__label">${step.label}</h3>
                    <p class="home-checklist-step__subtext">${step.subtext}</p>
                </div>
                <span class="status-badge ${badgeClass}">${badgeText}</span>
            </div>
        </div>
    `;
    };

    mainContent.innerHTML = `
    <div class="home-page">
        <h1 class="home-page__title">Willkommen zurück, ${state.user?.user_metadata?.full_name || 'User'}! 👋</h1>
        <p class="home-page__subtitle">Ihr aktueller Einrichtungsstatus für <strong>${workspace?.name || 'Ihren Workspace'}</strong>.</p>

        <!-- Essential Steps Card -->
        <div class="home-checklist-card">
            <div class="home-checklist-header">
                <div class="home-checklist-header__row">
                    <div>
                        <h2 class="home-checklist-header__title">Setup Checkliste</h2>
                        <p class="home-checklist-header__subtitle">${completedRequired} von ${requiredSteps.length} erforderlichen Schritten abgeschlossen</p>
                    </div>
                    <span class="home-checklist-header__percent">${progressPercent} / 100%</span>
                </div>

                <!-- Granular Segmented Progress Bar -->
                <div class="home-checklist-progress-segments">
                    ${(() => {
            // Single color based on overall progress: 0% → red (0°), 100% → green (130°)
            const hue = Math.round((progressPercent / 100) * 130);
            const progressColor = `hsl(${hue}, 75%, 45%)`;
            return Array(TOTAL_SEGMENTS).fill(0).map((_, i) => {
                const isActive = i < filledSegments;
                if (!isActive) return `<div class="progress-segment"></div>`;
                return `<div class="progress-segment active" style="background-color: ${progressColor}"></div>`;
            }).join('');
        })()}
                </div>
            </div>

            <div class="checklist-steps">
                ${steps.filter(s => s.required).map(step => renderStep(step)).join('')}
            </div>
        </div>

        <!-- Optional Steps Card -->
        <div class="checklist-group-title">Optional</div>
        <div class="home-checklist-card">
            <div class="home-checklist-header">
                <div class="home-checklist-header__row">
                     <div>
                        <p class="home-checklist-header__subtitle">${steps.filter(s => !s.required && s.done).length} von ${steps.filter(s => !s.required).length} optionalen Schritten abgeschlossen</p>
                    </div>
                </div>
            </div>
            <div class="checklist-steps">
                ${steps.filter(s => !s.required).map(step => renderStep(step)).join('')}
            </div>
        </div>

        <div style="height: 100px;"></div> <!-- Spacer so content isn't hidden by fade -->
    </div>
    <div class="dashboard-scroll-fade"></div>
  `;

    // Add click handlers
    mainContent.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const step = e.currentTarget;
            const link = step.dataset.link;
            const params = step.dataset.params;
            if (link) navigate(link, params);
        });
    });
};
