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

const DEFAULT_CONTENT = {
  card: {
    title: 'Insights',
    subtitle: 'Wie im Dashboard unter Analytics – Demo-Daten.',
    closeLabel: 'Schließen',
  },
  tabs: [
    { id: 'overview', label: 'Überblick' },
    { id: 'funnel', label: 'Funnel' },
    { id: 'traffic', label: 'Traffic & Zielgruppen' },
    { id: 'payments', label: 'Zahlungen' },
  ],
  timePeriods: [
    { id: '1', label: 'Letzter Monat' },
    { id: '3', label: 'Letzte 3 Monate' },
    { id: '6', label: 'Letzte 6 Monate' },
    { id: '12', label: 'Letzte 12 Monate' },
  ],
  kpis: {
    widgetViews: 'Buchungswidget-Aufrufe',
    revenue: 'Umsatz',
    bookings: 'Buchungen',
    cancellationRate: 'Abbrüche',
    vsLastMonth: 'vs letzter Monat',
  },
  charts: {
    conversionTitle: 'Conversion-Rate',
    conversionSubtitle: 'Buchungen relativ zu Buchungsstarts im Zeitraum',
    cancellationTitle: 'Abbruchquote',
    cancellationSubtitle: 'Stornierungen relativ zu abgeschlossenen Buchungen',
  },
  funnel: {
    stages: {
      widgetLoaded: 'Widget geladen',
      bookingStarted: 'Buchung gestartet',
      checkoutStarted: 'Checkout gestartet',
      paymentCompleted: 'Zahlung erfolgreich',
    },
    rateLabels: {
      start: 'Start-Rate',
      checkout: 'Checkout-Rate',
      payment: 'Payment-Rate',
    },
    sessions: 'Sessions',
    dropOff: 'Drop-off',
    trackingNotice: 'Zahlungen werden nach Aktivierung der Stripe-Integration getrackt.',
  },
  traffic: {
    browsers: 'Browser',
    countries: 'Länder',
    visitors: 'Visitors',
    noData: 'Keine Daten verfügbar',
  },
  locale: 'de-DE',
  currency: 'EUR',
};

const formatNumber = (content, num) => new Intl.NumberFormat(content.locale || 'de-DE').format(num);
const formatCurrency = (content, num) =>
  new Intl.NumberFormat(content.locale || 'de-DE', { style: 'currency', currency: content.currency || 'EUR' }).format(num);

const renderKPICards = (content, data) => {
  const kpis = data?.kpis || {};
  const changes = data?.changes || {};
  return `
    <div class="insights-kpi-grid">
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">${content.kpis.widgetViews}</span>
            </div>
            <div class="kpi-value">${formatNumber(content, kpis.widgetViews ?? 0)}</div>
          </div>
        </div>
        <div class="kpi-change ${(changes.widgetViews ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.widgetViews ?? 0) >= 0 ? '+' : ''}${changes.widgetViews ?? 0}% ${content.kpis.vsLastMonth}
        </div>
      </div>
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">${content.kpis.revenue}</span>
              ${getIconString('credit-card')}
            </div>
            <div class="kpi-value">${formatCurrency(content, kpis.revenue ?? 0)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('money-hand')}</div>
        </div>
        <div class="kpi-change ${(changes.revenue ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.revenue ?? 0) >= 0 ? '+' : ''}${changes.revenue ?? 0}% ${content.kpis.vsLastMonth}
        </div>
      </div>
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">${content.kpis.bookings}</span>
            </div>
            <div class="kpi-value">${formatNumber(content, kpis.bookings ?? 0)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${(changes.bookings ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.bookings ?? 0) >= 0 ? '+' : ''}${changes.bookings ?? 0}% ${content.kpis.vsLastMonth}
        </div>
      </div>
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">${content.kpis.cancellationRate}</span>
              ${getIconString('x-circle')}
            </div>
            <div class="kpi-value">${kpis.cancellationRate ?? 0}%</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${(changes.cancellationRate ?? 0) >= 0 ? 'positive' : 'negative'}">
          ${(changes.cancellationRate ?? 0) >= 0 ? '+' : ''}${changes.cancellationRate ?? 0}% ${content.kpis.vsLastMonth}
        </div>
      </div>
    </div>
  `;
};

const renderFunnelSection = (content, data) => {
  const funnel = data?.funnel || {
    widgetLoaded: { total: 0, unique: 0 },
    bookingStarted: { total: 0, unique: 0 },
    checkoutStarted: { total: 0, unique: 0 },
    paymentCompleted: { total: 0, unique: 0 },
  };

  const stages = [
    {
      label: content.funnel.stages.widgetLoaded,
      total: funnel.widgetLoaded.unique,
      rateLabel:
        funnel.widgetLoaded.total > 0
          ? `${((funnel.widgetLoaded.unique / funnel.widgetLoaded.total) * 100).toFixed(1)}% (${funnel.widgetLoaded.unique}/${funnel.widgetLoaded.total})`
          : '0%',
      dropOff: null,
      width: 100,
    },
    {
      label: content.funnel.stages.bookingStarted,
      total: funnel.bookingStarted.unique,
      rateLabel:
        funnel.widgetLoaded.unique > 0
          ? `${((funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100).toFixed(1)} % ${content.funnel.rateLabels.start}`
          : `0 % ${content.funnel.rateLabels.start}`,
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
      label: content.funnel.stages.checkoutStarted,
      total: funnel.checkoutStarted.unique,
      rateLabel:
        funnel.bookingStarted.unique > 0
          ? `${((funnel.checkoutStarted.unique / funnel.bookingStarted.unique) * 100).toFixed(1)} % ${content.funnel.rateLabels.checkout}`
          : `0 % ${content.funnel.rateLabels.checkout}`,
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
      label: content.funnel.stages.paymentCompleted,
      total: funnel.paymentCompleted.unique,
      rateLabel:
        funnel.checkoutStarted.unique > 0
          ? `${((funnel.paymentCompleted.unique / funnel.checkoutStarted.unique) * 100).toFixed(1)} % ${content.funnel.rateLabels.payment}`
          : `0 % ${content.funnel.rateLabels.payment}`,
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
              <div class="funnel-value">${formatNumber(content, stage.total)} <span class="funnel-sessions">${content.funnel.sessions}</span></div>
              ${stage.dropOff !== null ? `<div class="funnel-dropoff">${content.funnel.dropOff}: ${stage.dropOff} %</div>` : ''}
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
        <p>${content.funnel.trackingNotice}</p>
      </div>
    `
        : ''
    }
  `;
};

const renderTrafficRows = (content, items) => {
  const list = items || [];
  const maxCount = Math.max(...list.map((i) => i.count), 1);
  if (!list.length) return `<p class="traffic-no-data">${content.traffic.noData}</p>`;
  return list
    .map(
      (item) => `
    <div class="traffic-stat-row">
      <span class="traffic-stat-name">${item.name}</span>
      <div class="traffic-stat-bar-container">
        <div class="traffic-stat-bar" style="width: ${(item.count / maxCount) * 100}%"></div>
      </div>
      <span class="traffic-stat-value">${formatNumber(content, item.count)}</span>
    </div>
  `
    )
    .join('');
};

export const createAnalyticsPreviewCard = ({ content = DEFAULT_CONTENT } = {}) => {
  const data = DEMO_INSIGHTS;
  const defaultPeriod = (content.timePeriods || DEFAULT_CONTENT.timePeriods)[0];
  const tabsRow = (content.tabs || DEFAULT_CONTENT.tabs).map((tab, i) => {
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

  const periodOptions = (content.timePeriods || DEFAULT_CONTENT.timePeriods).map(
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
        <h3 class="feature-demo-card__title">${content.card.title}</h3>
        <p class="feature-demo-card__subtitle">${content.card.subtitle}</p>
      </div>
      <button type="button" class="feature-demo-card__close" aria-label="${content.card.closeLabel}">×</button>
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
        ${renderKPICards(content, data)}
        <div class="insights-chart-grid">
          <div class="insights-chart-card">
            <div class="chart-header">
              <h3 class="chart-title">${content.charts.conversionTitle}</h3>
              <p class="chart-subtitle">${content.charts.conversionSubtitle}</p>
            </div>
            <div class="chart-container" id="analytics-demo-conversion-chart"></div>
          </div>
          <div class="insights-chart-card">
            <div class="chart-header">
              <h3 class="chart-title">${content.charts.cancellationTitle}</h3>
              <p class="chart-subtitle">${content.charts.cancellationSubtitle}</p>
            </div>
            <div class="chart-container" id="analytics-demo-cancellation-chart"></div>
          </div>
        </div>
      </div>

      <div class="modal-content-section" data-demo-section="an-funnel" style="margin-top: var(--space-md);">
        ${renderFunnelSection(content, data)}
      </div>

      <div class="modal-content-section" data-demo-section="an-optimize" style="margin-top: var(--space-md);">
        <div class="traffic-stat-card">
          <div class="traffic-stat-tabs">
            <button type="button" class="traffic-stat-tab active" data-analytics-traffic="browsers">${content.traffic.browsers}</button>
            <button type="button" class="traffic-stat-tab" data-analytics-traffic="countries">${content.traffic.countries}</button>
          </div>
          <div class="traffic-stat-header">
            <span></span>
            <span>${content.traffic.visitors}</span>
          </div>
          <div class="traffic-stat-content" id="analytics-traffic-browsers">
            ${renderTrafficRows(content, data.traffic?.browsers)}
          </div>
          <div class="traffic-stat-content" id="analytics-traffic-countries" style="display: none;">
            ${renderTrafficRows(content, data.traffic?.countries)}
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

export const initAnalyticsPreviewCard = (root, { content = DEFAULT_CONTENT } = {}) => {
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
      const selected = (content.timePeriods || DEFAULT_CONTENT.timePeriods).find((p) => p.id === id);
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
