/**
 * AnalyticsPreviewCard – Landing demo aligned with dashboard Insights (InsightsPage).
 * Local state only; uses DEMO_INSIGHTS + same CSS classes as the dashboard.
 */
import { getIconString } from '../../Icons/Icon.js';
import { renderLineChart } from '../../Charts/LineChart.js';
import { DEMO_INSIGHTS } from '../../../lib/DemoData.js';
import { escapeAttr } from '../../../lib/sanitize.js';
import '../../../styles/insights-panels.css';
import './featureDemos.css';

const INSIGHT_TABS = [
  { id: 'overview', label: 'Überblick' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'traffic', label: 'Traffic & Zielgruppen' },
  { id: 'payments', label: 'Zahlungen' },
];

const TIME_PERIODS = [
  { id: '1', label: 'Letzter Monat' },
  { id: '3', label: 'Letzte 3 Monate' },
  { id: '6', label: 'Letzte 6 Monate' },
  { id: '12', label: 'Letzte 12 Monate' },
];

const formatNumber = (num) => new Intl.NumberFormat('de-DE').format(num);
const formatCurrency = (num) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num);

const renderKPICards = (data) => {
  const kpis = data?.kpis || {};
  const changes = data?.changes || {};
  return `
    <div class="insights-kpi-grid">
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Buchungswidget-Aufrufe</span>
            </div>
            <div class="kpi-value">${formatNumber(kpis.widgetViews ?? 0)}</div>
          </div>
        </div>
        <div class="kpi-change ${(changes.widgetViews ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.widgetViews ?? 0) >= 0 ? '+' : ''}${changes.widgetViews ?? 0}% vs letzter Monat
        </div>
      </div>
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Umsatz</span>
              ${getIconString('credit-card')}
            </div>
            <div class="kpi-value">${formatCurrency(kpis.revenue ?? 0)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('money-hand')}</div>
        </div>
        <div class="kpi-change ${(changes.revenue ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.revenue ?? 0) >= 0 ? '+' : ''}${changes.revenue ?? 0}% vs letzter Monat
        </div>
      </div>
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Buchungen</span>
            </div>
            <div class="kpi-value">${formatNumber(kpis.bookings ?? 0)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${(changes.bookings ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.bookings ?? 0) >= 0 ? '+' : ''}${changes.bookings ?? 0}% vs letzter Monat
        </div>
      </div>
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Abbrüche</span>
              ${getIconString('x-circle')}
            </div>
            <div class="kpi-value">${kpis.cancellationRate ?? 0}%</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${(changes.cancellationRate ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.cancellationRate ?? 0) >= 0 ? '+' : ''}${changes.cancellationRate ?? 0}% vs letzter Monat
        </div>
      </div>
    </div>
  `;
};

const renderFunnelSection = (data) => {
  const funnel = data?.funnel || {
    widgetLoaded: { total: 0, unique: 0 },
    bookingStarted: { total: 0, unique: 0 },
    checkoutStarted: { total: 0, unique: 0 },
    paymentCompleted: { total: 0, unique: 0 },
  };

  const stages = [
    {
      label: 'Widget geladen',
      total: funnel.widgetLoaded.unique,
      rateLabel:
        funnel.widgetLoaded.total > 0
          ? `${((funnel.widgetLoaded.unique / funnel.widgetLoaded.total) * 100).toFixed(1)}% (${funnel.widgetLoaded.unique}/${funnel.widgetLoaded.total})`
          : '0%',
      dropOff: null,
      width: 100,
    },
    {
      label: 'Buchung gestartet',
      total: funnel.bookingStarted.unique,
      rateLabel:
        funnel.widgetLoaded.unique > 0
          ? `${((funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100).toFixed(1)} % Start-Rate`
          : '0 % Start-Rate',
      dropOff:
        funnel.widgetLoaded.unique > 0
          ? (100 - (funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100).toFixed(1)
          : 0,
      width:
        funnel.widgetLoaded.unique > 0
          ? Math.max(10, (funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100)
          : 10,
    },
    {
      label: 'Checkout gestartet',
      total: funnel.checkoutStarted.unique,
      rateLabel:
        funnel.bookingStarted.unique > 0
          ? `${((funnel.checkoutStarted.unique / funnel.bookingStarted.unique) * 100).toFixed(1)} % Checkout-Rate`
          : '0 % Checkout-Rate',
      dropOff:
        funnel.bookingStarted.unique > 0
          ? (100 - (funnel.checkoutStarted.unique / funnel.bookingStarted.unique) * 100).toFixed(1)
          : 0,
      width:
        funnel.widgetLoaded.unique > 0
          ? Math.max(10, (funnel.checkoutStarted.unique / funnel.widgetLoaded.unique) * 100)
          : 10,
    },
    {
      label: 'Zahlung erfolgreich',
      total: funnel.paymentCompleted.unique,
      rateLabel:
        funnel.checkoutStarted.unique > 0
          ? `${((funnel.paymentCompleted.unique / funnel.checkoutStarted.unique) * 100).toFixed(1)} % Payment-Rate`
          : '0 % Payment-Rate',
      dropOff:
        funnel.checkoutStarted.unique > 0
          ? (100 - (funnel.paymentCompleted.unique / funnel.checkoutStarted.unique) * 100).toFixed(1)
          : 0,
      width:
        funnel.widgetLoaded.unique > 0
          ? Math.max(10, (funnel.paymentCompleted.unique / funnel.widgetLoaded.unique) * 100)
          : 10,
    },
  ];

  const maxSessions = Math.max(...stages.map((s) => s.total)) || 1;
  const heights = stages.map((s) => Math.max(2, (s.total / maxSessions) * 100));

  const getStagePolygon = (index) => {
    const leftHeight = index === 0 ? 100 : heights[index - 1];
    const rightHeight = heights[index];
    const topLeftY = 100 - leftHeight;
    const topRightY = 100 - rightHeight;
    return `0,${topLeftY} 100,${topRightY} 100,100 0,100`;
  };

  const getFillColor = (index) => {
    const colors = [
      'var(--color-majorelle-blue-300)',
      'var(--color-majorelle-blue-200)',
      'var(--color-majorelle-blue-100)',
      'var(--color-majorelle-blue-50)',
    ];
    return colors[index] || colors[colors.length - 1];
  };

  return `
    <div class="funnel-container">
      <div class="funnel-grid">
        ${stages
          .map(
            (stage, index) => `
          <div class="funnel-stage">
            <div class="funnel-content">
              <div class="funnel-header">
                <span class="funnel-label">${stage.label}</span>
                <span class="funnel-rate-badge">${stage.rateLabel}</span>
              </div>
              <div class="funnel-value">${formatNumber(stage.total)} <span class="funnel-sessions">Sessions</span></div>
              ${stage.dropOff !== null ? `<div class="funnel-dropoff">Drop-off: ${stage.dropOff} %</div>` : ''}
            </div>
            <div class="funnel-stage-chart">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="funnel-stage-svg">
                <polygon points="${getStagePolygon(index)}" fill="${getFillColor(index)}" />
              </svg>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    ${
      funnel.paymentCompleted.total === 0
        ? `
      <div class="funnel-notice">
        <p>Zahlungen werden nach Aktivierung der Stripe-Integration getrackt.</p>
      </div>
    `
        : ''
    }
  `;
};

const renderTrafficRows = (items) => {
  const list = items || [];
  const maxCount = Math.max(...list.map((i) => i.count), 1);
  if (!list.length) return '<p class="traffic-no-data">Keine Daten verfügbar</p>';
  return list
    .map(
      (item) => `
    <div class="traffic-stat-row">
      <span class="traffic-stat-name">${item.name}</span>
      <div class="traffic-stat-bar-container">
        <div class="traffic-stat-bar" style="width: ${(item.count / maxCount) * 100}%"></div>
      </div>
      <span class="traffic-stat-value">${formatNumber(item.count)}</span>
    </div>
  `
    )
    .join('');
};

export const createAnalyticsPreviewCard = () => {
  const data = DEMO_INSIGHTS;
  const defaultPeriod = TIME_PERIODS[0];
  const tabsRow = INSIGHT_TABS.map((tab, i) => {
    const active = i === 0;
    const disabled = !active;
    return `
      <button
        type="button"
        class="filter-tab ${active ? 'active' : ''}"
        data-analytics-tab="${escapeAttr(tab.id)}"
        ${disabled ? 'disabled' : ''}
      >${tab.label}</button>
    `;
  }).join('');

  const periodOptions = TIME_PERIODS.map(
    (p) => `
    <button type="button" class="time-period-option ${p.id === defaultPeriod.id ? 'active' : ''}" data-analytics-period="${escapeAttr(p.id)}">
      ${p.label}
    </button>
  `
  ).join('');

  return `
  <div class="feature-demo-card" id="analytics-preview-card">
    <div class="feature-demo-card__header">
      <div class="feature-demo-card__title-group">
        <h3 class="feature-demo-card__title">Insights</h3>
        <p class="feature-demo-card__subtitle">Wie im Dashboard unter Analytics – Demo-Daten.</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="Schließen">×</button>
    </div>
    <div class="zone-tabs">
      <div class="tabs-list">
        ${tabsRow}
      </div>
      <div class="time-period-wrapper">
        <button type="button" class="time-period-btn" id="analytics-demo-time-btn">
          ${getIconString('insights')} ${defaultPeriod.label}
        </button>
        <div class="time-period-dropdown" id="analytics-demo-time-dropdown">
          ${periodOptions}
        </div>
      </div>
    </div>
    <div class="analytics-demo-body" id="analytics-demo-body">
      <div class="modal-content-section" data-demo-section="an-overview">
        ${renderKPICards(data)}
        <div class="insights-chart-grid">
          <div class="insights-chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Conversion-Rate</h3>
              <p class="chart-subtitle">Buchungen relativ zu Buchungsstarts im Zeitraum</p>
            </div>
            <div class="chart-container" id="analytics-demo-conversion-chart"></div>
          </div>
          <div class="insights-chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Abbruchquote</h3>
              <p class="chart-subtitle">Stornierungen relativ zu abgeschlossenen Buchungen</p>
            </div>
            <div class="chart-container" id="analytics-demo-cancellation-chart"></div>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="an-funnel" style="margin-top: var(--space-md);">
        ${renderFunnelSection(data)}
      </div>

      <div class="modal-content-section" data-demo-section="an-optimize" style="margin-top: var(--space-md);">
        <div class="traffic-stat-card">
          <div class="traffic-stat-tabs">
            <button type="button" class="traffic-stat-tab active" data-analytics-traffic="browsers">Browser</button>
            <button type="button" class="traffic-stat-tab" data-analytics-traffic="countries">Länder</button>
          </div>
          <div class="traffic-stat-header">
            <span></span>
            <span>Visitors</span>
          </div>
          <div class="traffic-stat-content" id="analytics-traffic-browsers">
            ${renderTrafficRows(data.traffic?.browsers)}
          </div>
          <div class="traffic-stat-content" id="analytics-traffic-countries" style="display: none;">
            ${renderTrafficRows(data.traffic?.countries)}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};

const initCharts = () => {
  const charts = DEMO_INSIGHTS.charts || {};
  setTimeout(() => {
    renderLineChart({
      containerId: 'analytics-demo-conversion-chart',
      data: charts.conversion || [],
      unit: '%',
      autoScale: true,
      showGrid: true,
      showGradient: true,
      height: 168,
    });
    renderLineChart({
      containerId: 'analytics-demo-cancellation-chart',
      data: charts.cancellation || [],
      unit: '%',
      autoScale: true,
      showGrid: true,
      showGradient: true,
      height: 168,
    });
  }, 50);
};

export const initAnalyticsPreviewCard = (root) => {
  const card = root.querySelector('#analytics-preview-card');
  if (!card) return;

  const btn = card.querySelector('#analytics-demo-time-btn');
  const dropdown = card.querySelector('#analytics-demo-time-dropdown');

  const closeDropdown = () => {
    if (dropdown) dropdown.style.display = 'none';
  };

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!dropdown) return;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  dropdown?.querySelectorAll('.time-period-option').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = opt.dataset.analyticsPeriod;
      const selected = TIME_PERIODS.find((p) => p.id === id);
      if (selected && btn) {
        btn.innerHTML = `${getIconString('insights')} ${selected.label}`;
      }
      dropdown.querySelectorAll('.time-period-option').forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      closeDropdown();
    });
  });

  document.addEventListener('click', (e) => {
    if (!card.contains(e.target)) closeDropdown();
  });

  card.querySelectorAll('.traffic-stat-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.analyticsTraffic;
      const wrap = tab.closest('.traffic-stat-card');
      if (!wrap) return;
      wrap.querySelectorAll('.traffic-stat-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      wrap.querySelectorAll('.traffic-stat-content').forEach((c) => {
        c.style.display = 'none';
      });
      const show =
        id === 'countries' ? wrap.querySelector('#analytics-traffic-countries') : wrap.querySelector('#analytics-traffic-browsers');
      if (show) show.style.display = 'block';
    });
  });

  initCharts();
};
