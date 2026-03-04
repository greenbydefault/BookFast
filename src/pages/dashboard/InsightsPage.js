/**
 * Insights Page - Analytics Dashboard View
 */

import { supabase } from '../../lib/supabaseClient.js';
import { getState, setNestedState } from '../../lib/store.js';
import { getIconString } from '../../components/Icons/Icon.js';
import { renderLineChart } from '../../components/Charts/LineChart.js';
import { renderEmptyState, renderPageLoading } from '../../components/EmptyState/EmptyState.js';
import { getNavigationGeneration } from '../../lib/router.js';
import { navigate } from '../../lib/router.js';
import { DEMO_INSIGHTS } from '../../lib/DemoData.js';

// Tab configuration
const INSIGHT_TABS = [
  { id: 'overview', label: 'Überblick', icon: 'overview' },
  { id: 'funnel', label: 'Funnel', icon: 'funnel' },
  { id: 'traffic', label: 'Traffic & Zielgruppen', icon: 'globe' },
  { id: 'payments', label: 'Zahlungen', icon: 'bank-card' }
];

// Time period options
const TIME_PERIODS = [
  { id: '1', label: 'Letzter Monat' },
  { id: '3', label: 'Letzte 3 Monate' },
  { id: '6', label: 'Letzte 6 Monate' },
  { id: '12', label: 'Letzte 12 Monate' }
];

/**
 * Calculate date range based on time period
 */
const getDateRange = (months) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - parseInt(months));
  return { start, end };
};

/**
 * Format number with locale
 */
const formatNumber = (num) => {
  return new Intl.NumberFormat('de-DE').format(num);
};

/**
 * Format currency
 */
const formatCurrency = (num) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num);
};

/**
 * Fetch analytics data
 */
const fetchInsightsData = async () => {
  const state = getState();

  if (state.isDemoMode) {
    return DEMO_INSIGHTS;
  }

  const { timePeriod } = state.insights;
  const { start, end } = getDateRange(timePeriod);
  const workspace = state.currentWorkspace;

  if (!workspace) return null;

  // Get sites for this workspace
  const { data: sites } = await supabase
    .from('sites')
    .select('id')
    .eq('workspace_id', workspace.id);

  if (!sites || sites.length === 0) return null;

  const siteIds = sites.map(s => s.id);

  // Fetch analytics events
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .in('site_id', siteIds)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }

  if (!events || events.length === 0) {
    return null;
  }

  // Helper to count unique sessions
  const countUnique = (eventType) => {
    const sessions = new Set();
    events.filter(e => e.event_type === eventType).forEach(e => sessions.add(e.session_id));
    return sessions.size;
  };

  // Helper to count total events
  const countTotal = (eventType) => events.filter(e => e.event_type === eventType).length;

  // Funnel data (total and unique sessions per stage)
  const funnel = {
    widgetLoaded: {
      total: countTotal('widget_view'),
      unique: countUnique('widget_view')
    },
    bookingStarted: {
      total: countTotal('widget_start'),
      unique: countUnique('widget_start')
    },
    checkoutStarted: {
      total: countTotal('checkout_started'),
      unique: countUnique('checkout_started')
    },
    paymentCompleted: {
      total: countTotal('payment_completed'),
      unique: countUnique('payment_completed')
    }
  };

  // Calculate KPIs with unique sessions
  const widgetViews = funnel.widgetLoaded.total;
  const widgetViewsUnique = funnel.widgetLoaded.unique;
  const bookings = countTotal('booking_completed');
  const bookingsUnique = countUnique('booking_completed');
  const widgetStarts = funnel.bookingStarted.total;
  const cancellations = countTotal('booking_cancelled');

  // Calculate revenue from both legacy (booking_completed) and Stripe (payment_completed) events
  const revenue = events
    .filter(e => ['booking_completed', 'payment_completed'].includes(e.event_type) && e.metadata?.total_price)
    .reduce((sum, e) => sum + (Number(e.metadata.total_price) || 0), 0);

  // Calculate conversion rate
  const conversionRate = widgetStarts > 0 ? (bookings / widgetStarts) * 100 : 0;
  const cancellationRate = bookings > 0 ? (cancellations / bookings) * 100 : 0;

  // Group events by day for charts
  const dailyData = {};
  events.forEach(e => {
    const date = new Date(e.created_at).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { views: 0, starts: 0, bookings: 0, cancellations: 0 };
    }
    if (e.event_type === 'widget_view') dailyData[date].views++;
    if (e.event_type === 'widget_start') dailyData[date].starts++;
    if (e.event_type === 'booking_completed') dailyData[date].bookings++;
    if (e.event_type === 'booking_cancelled') dailyData[date].cancellations++;
  });

  // Convert to chart data
  const chartLabels = Object.keys(dailyData).sort();
  const conversionChartData = chartLabels.map(date => {
    const d = dailyData[date];
    const rate = d.starts > 0 ? (d.bookings / d.starts) * 100 : 0;
    return { label: formatChartDate(date), value: Math.round(rate * 10) / 10 };
  });

  const cancellationChartData = chartLabels.map(date => {
    const d = dailyData[date];
    const rate = d.bookings > 0 ? (d.cancellations / d.bookings) * 100 : 0;
    return { label: formatChartDate(date), value: Math.round(rate * 10) / 10 };
  });

  // Traffic data: daily visitors and device stats
  const dailyVisitors = chartLabels.map(date => ({
    label: formatChartDate(date),
    value: dailyData[date].views
  }));

  // Aggregate browser/OS/device from metadata
  const browserCounts = {};
  const osCounts = {};
  const deviceCounts = {};
  const countryCounts = {};
  const cityCounts = {};

  events.filter(e => e.event_type === 'widget_view').forEach(e => {
    const meta = e.metadata || {};
    if (meta.browser) browserCounts[meta.browser] = (browserCounts[meta.browser] || 0) + 1;
    if (meta.os) osCounts[meta.os] = (osCounts[meta.os] || 0) + 1;
    if (meta.device) deviceCounts[meta.device] = (deviceCounts[meta.device] || 0) + 1;
    if (meta.country) countryCounts[meta.country] = (countryCounts[meta.country] || 0) + 1;
    if (meta.city) cityCounts[meta.city] = (cityCounts[meta.city] || 0) + 1;
  });

  // Convert to sorted arrays
  const sortByCount = (obj) => Object.entries(obj)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    kpis: {
      widgetViews,
      widgetViewsUnique,
      revenue,
      bookings,
      bookingsUnique,
      cancellationRate: Math.round(cancellationRate * 100) / 100
    },
    funnel,
    charts: {
      conversion: conversionChartData.length > 0 ? conversionChartData : generateSampleData(),
      cancellation: cancellationChartData.length > 0 ? cancellationChartData : generateSampleData()
    },
    traffic: {
      dailyVisitors: dailyVisitors.length > 0 ? dailyVisitors : generateSampleData(),
      browsers: sortByCount(browserCounts),
      os: sortByCount(osCounts),
      devices: sortByCount(deviceCounts),
      countries: sortByCount(countryCounts),
      cities: sortByCount(cityCounts)
    },
    payments: (() => {
      const checkoutStarted = countTotal('checkout_started');
      const paymentCompleted = countTotal('payment_completed');
      const refunds = countTotal('payment_refunded');
      const successRate = checkoutStarted > 0 ? (paymentCompleted / checkoutStarted) * 100 : 0;
      const refundRate = paymentCompleted > 0 ? (refunds / paymentCompleted) * 100 : 0;

      // Daily success rate for chart
      const dailyPaymentData = {};
      events.forEach(e => {
        const date = new Date(e.created_at).toISOString().split('T')[0];
        if (!dailyPaymentData[date]) {
          dailyPaymentData[date] = { started: 0, completed: 0 };
        }
        if (e.event_type === 'checkout_started') dailyPaymentData[date].started++;
        if (e.event_type === 'payment_completed') dailyPaymentData[date].completed++;
      });

      const successTrend = Object.keys(dailyPaymentData).sort().map(date => {
        const d = dailyPaymentData[date];
        const rate = d.started > 0 ? (d.completed / d.started) * 100 : 0;
        return { label: formatChartDate(date), value: Math.round(rate) };
      });

      return {
        checkoutStarted,
        paymentCompleted,
        successRate: Math.round(successRate * 10) / 10,
        refundRate: Math.round(refundRate * 10) / 10,
        successTrend: successTrend.length > 0 ? successTrend : generateSampleData()
      };
    })(),
    // Placeholder change percentages (would need previous period data)
    changes: {
      widgetViews: 13,
      revenue: 5.1,
      bookings: 1.25,
      cancellationRate: 0.34
    }
  };
};

/**
 * Format date for chart labels
 */
const formatChartDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString('de-DE', { month: 'short' });
  return `${month} ${day}`;
};

/**
 * Generate sample data for empty charts
 */
const generateSampleData = () => {
  const data = [];
  for (let i = 1; i <= 6; i++) {
    data.push({
      label: `Jan ${i}`,
      value: 10 + Math.random() * 10
    });
  }
  return data;
};

/**
 * Render KPI cards
 */
const renderKPICards = (data) => {
  const kpis = data?.kpis || { widgetViews: 0, revenue: 0, bookings: 0, cancellationRate: 0 };
  const changes = data?.changes || { widgetViews: 0, revenue: 0, bookings: 0, cancellationRate: 0 };

  return `
    <div class="insights-kpi-grid">
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Buchungswidget-Aufrufe</span>
              ${getIconString('eye')}
            </div>
            <div class="kpi-value">${formatNumber(kpis.widgetViews)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${changes.widgetViews >= 0 ? 'positive' : 'negative'}">
          ${changes.widgetViews >= 0 ? '+' : ''}${changes.widgetViews}% vs letzter Monat
        </div>
      </div>

      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Umsatz</span>
              ${getIconString('credit-card')}
            </div>
            <div class="kpi-value">${formatCurrency(kpis.revenue)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('money-hand')}</div>
        </div>
        <div class="kpi-change ${changes.revenue >= 0 ? 'positive' : 'negative'}">
          ${changes.revenue >= 0 ? '+' : ''}${changes.revenue}% vs letzter Monat
        </div>
      </div>

      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
          <div class="kpi-header">
            <span class="kpi-label">Buchungen</span>
          </div>
            <div class="kpi-value">${formatNumber(kpis.bookings)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${changes.bookings >= 0 ? 'positive' : 'negative'}">
          ${changes.bookings >= 0 ? '+' : ''}${changes.bookings}% vs letzter Monat
        </div>
      </div>

      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Abbrüche</span>
              ${getIconString('x-circle')}
            </div>
            <div class="kpi-value">${kpis.cancellationRate}%</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change ${changes.cancellationRate >= 0 ? 'positive' : 'negative'}">
          ${changes.cancellationRate >= 0 ? '+' : ''}${changes.cancellationRate}% vs letzter Monat
        </div>
      </div>
    </div>
  `;
};

/**
 * Render charts section
 */
const renderCharts = () => {
  return `
    <div class="insights-chart-grid">
      <div class="insights-chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Conversion-Rate</h3>
          <p class="chart-subtitle">Lege einen Service an und ordne ihn einem Objekt zu.</p>
        </div>
        <div class="chart-container" id="conversion-chart"></div>
      </div>

      <div class="insights-chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Abbruchquote</h3>
          <p class="chart-subtitle">Lege einen Service an und ordne ihn einem Objekt zu.</p>
        </div>
        <div class="chart-container" id="cancellation-chart"></div>
      </div>
    </div>
  `;
};

/**
 * Render overview tab content
 */
const renderOverviewTab = (data) => {
  return `
    ${renderKPICards(data)}
    ${renderCharts()}
  `;
};

/**
 * Render funnel tab content
 */
const renderFunnelTab = (data) => {
  const funnel = data?.funnel || {
    widgetLoaded: { total: 0, unique: 0 },
    bookingStarted: { total: 0, unique: 0 },
    checkoutStarted: { total: 0, unique: 0 },
    paymentCompleted: { total: 0, unique: 0 }
  };

  // Calculate rates and drop-offs
  const stages = [
    {
      label: 'Widget geladen',
      total: funnel.widgetLoaded.unique,
      unique: funnel.widgetLoaded.unique,
      rateLabel: funnel.widgetLoaded.total > 0
        ? `${((funnel.widgetLoaded.unique / funnel.widgetLoaded.total) * 100).toFixed(1)}% (${funnel.widgetLoaded.unique}/${funnel.widgetLoaded.total})`
        : '0%',
      dropOff: null,
      width: 100
    },
    {
      label: 'Buchung gestartet',
      total: funnel.bookingStarted.unique,
      rateLabel: funnel.widgetLoaded.unique > 0
        ? `${((funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100).toFixed(1)} % Start-Rate`
        : '0 % Start-Rate',
      dropOff: funnel.widgetLoaded.unique > 0
        ? (100 - (funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100).toFixed(1)
        : 0,
      width: funnel.widgetLoaded.unique > 0
        ? Math.max(10, (funnel.bookingStarted.unique / funnel.widgetLoaded.unique) * 100)
        : 10
    },
    {
      label: 'Checkout gestartet',
      total: funnel.checkoutStarted.unique,
      rateLabel: funnel.bookingStarted.unique > 0
        ? `${((funnel.checkoutStarted.unique / funnel.bookingStarted.unique) * 100).toFixed(1)} % Checkout-Rate`
        : '0 % Checkout-Rate',
      dropOff: funnel.bookingStarted.unique > 0
        ? (100 - (funnel.checkoutStarted.unique / funnel.bookingStarted.unique) * 100).toFixed(1)
        : 0,
      width: funnel.widgetLoaded.unique > 0
        ? Math.max(10, (funnel.checkoutStarted.unique / funnel.widgetLoaded.unique) * 100)
        : 10
    },
    {
      label: 'Zahlung erfolgreich',
      total: funnel.paymentCompleted.unique,
      rateLabel: funnel.checkoutStarted.unique > 0
        ? `${((funnel.paymentCompleted.unique / funnel.checkoutStarted.unique) * 100).toFixed(1)} % Payment-Rate`
        : '0 % Payment-Rate',
      dropOff: funnel.checkoutStarted.unique > 0
        ? (100 - (funnel.paymentCompleted.unique / funnel.checkoutStarted.unique) * 100).toFixed(1)
        : 0,
      width: funnel.widgetLoaded.unique > 0
        ? Math.max(10, (funnel.paymentCompleted.unique / funnel.widgetLoaded.unique) * 100)
        : 10
    }
  ];

  // Calculate heights for SVG funnel - use MAXIMUM of all stages
  const maxSessions = Math.max(...stages.map(s => s.total)) || 1;

  // Calculate height for each stage (as percentage of max, higher sessions = more fill)
  // Heights array: [100, 85, 60, 40] means stage 1 is 100%, stage 2 is 85%, etc.
  const heights = stages.map(s => Math.max(2, (s.total / maxSessions) * 100));

  // For each stage, we need: left height (from previous stage) and right height (current stage)
  // This creates the "slide" effect where each stage starts where the previous ended
  const getStagePolygon = (index) => {
    const leftHeight = index === 0 ? 100 : heights[index - 1];
    const rightHeight = heights[index];

    // SVG viewBox is 0-100, y=0 is top, y=100 is bottom
    // So we need to invert: topY = 100 - height
    const topLeftY = 100 - leftHeight;
    const topRightY = 100 - rightHeight;

    // Polygon points: top-left, top-right, bottom-right, bottom-left
    return `0,${topLeftY} 100,${topRightY} 100,100 0,100`;
  };

  // Get fill color for each stage (darker to lighter)
  const getFillColor = (index) => {
    const colors = [
      'var(--color-majorelle-blue-300)',
      'var(--color-majorelle-blue-200)',
      'var(--color-majorelle-blue-100)',
      'var(--color-majorelle-blue-50)'
    ];
    return colors[index] || colors[colors.length - 1];
  };

  return `
    <div class="funnel-container">
      <div class="funnel-grid">
        ${stages.map((stage, index) => `
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
        `).join('')}
      </div>
    </div>
    ${funnel.paymentCompleted.total === 0 ? `
      <div class="funnel-notice">
        <p>💳 Zahlungen werden nach Aktivierung der Stripe-Integration getrackt.</p>
      </div>
    ` : ''}
  `;
};

/**
 * Render traffic tab content
 */
const renderTrafficTab = (data) => {
  const traffic = data?.traffic || {
    dailyVisitors: [],
    browsers: [],
    os: [],
    devices: [],
    countries: [],
    cities: []
  };

  const maxVisitors = Math.max(...traffic.dailyVisitors.map(d => d.value), 1);
  const totalVisitors = traffic.dailyVisitors.reduce((sum, d) => sum + d.value, 0);

  // Render stat list with horizontal bars
  const renderStatList = (items, maxCount) => {
    if (!items.length) return '<p class="traffic-no-data">Keine Daten verfügbar</p>';
    const max = maxCount || Math.max(...items.map(i => i.count), 1);
    return items.map(item => `
            <div class="traffic-stat-row">
                <span class="traffic-stat-name">${item.name}</span>
                <div class="traffic-stat-bar-container">
                    <div class="traffic-stat-bar" style="width: ${(item.count / max) * 100}%"></div>
                </div>
                <span class="traffic-stat-value">${formatNumber(item.count)}</span>
            </div>
        `).join('');
  };

  return `
    <div class="traffic-visitors-card">
      <div class="traffic-visitors-header">
        <h3>Besucher</h3>
        <span class="traffic-period-badge">↳ 14 Tage</span>
      </div>
      <div class="traffic-visitors-chart">
        ${traffic.dailyVisitors.map(day => `
          <div class="traffic-bar-col" title="${day.label}: ${formatNumber(day.value)} Besucher">
            <div class="traffic-bar" style="height: ${(day.value / maxVisitors) * 100}%"></div>
            <span class="traffic-bar-label">${day.label}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="traffic-stats-grid">
      <div class="traffic-stat-card">
        <div class="traffic-stat-tabs">
          <button class="traffic-stat-tab active" data-traffic-tab="browsers">Browser</button>
          <button class="traffic-stat-tab" data-traffic-tab="os">OS</button>
          <button class="traffic-stat-tab" data-traffic-tab="devices">Device</button>
        </div>
        <div class="traffic-stat-header">
          <span></span>
          <span>Visitors</span>
        </div>
        <div class="traffic-stat-content" id="traffic-browsers">
          ${renderStatList(traffic.browsers, totalVisitors)}
        </div>
        <div class="traffic-stat-content" id="traffic-os" style="display: none;">
          ${renderStatList(traffic.os, totalVisitors)}
        </div>
        <div class="traffic-stat-content" id="traffic-devices" style="display: none;">
          ${renderStatList(traffic.devices, totalVisitors)}
        </div>
      </div>

      <div class="traffic-stat-card">
        <div class="traffic-stat-tabs">
          <button class="traffic-stat-tab active" data-traffic-tab="countries">Länder</button>
          <button class="traffic-stat-tab" data-traffic-tab="cities">Städte</button>
        </div>
        <div class="traffic-stat-header">
          <span></span>
          <span>Visitors</span>
        </div>
        <div class="traffic-stat-content" id="traffic-countries">
          ${traffic.countries.length ? renderStatList(traffic.countries, totalVisitors) : '<p class="traffic-no-data">Geo-Daten werden nach Aktivierung der Edge-Function erfasst.</p>'}
        </div>
        <div class="traffic-stat-content" id="traffic-cities" style="display: none;">
          ${traffic.cities.length ? renderStatList(traffic.cities, totalVisitors) : '<p class="traffic-no-data">Geo-Daten werden nach Aktivierung der Edge-Function erfasst.</p>'}
        </div>
      </div>
    </div>
  `;
};

/**
 * Render payments tab content
 */
const renderPaymentsTab = (data) => {
  const payments = data?.payments || {
    checkoutStarted: 0,
    paymentCompleted: 0,
    successRate: 0,
    refundRate: 0,
    successTrend: []
  };
  const changes = data?.changes || {};

  // Generate SVG path for line chart
  const generateLinePath = (chartData) => {
    if (!chartData.length) return '';
    const width = 900;
    const height = 180;
    const padding = 40;
    const maxValue = Math.max(...chartData.map(d => d.value), 100);
    const minValue = Math.min(...chartData.map(d => d.value), 0);
    const range = maxValue - minValue || 1;

    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1 || 1)) * (width - padding * 2);
      const y = height - padding - ((d.value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Generate area path for gradient fill
  const generateAreaPath = (chartData) => {
    if (!chartData.length) return '';
    const width = 900;
    const height = 180;
    const padding = 40;
    const maxValue = Math.max(...chartData.map(d => d.value), 100);
    const minValue = Math.min(...chartData.map(d => d.value), 0);
    const range = maxValue - minValue || 1;
    const baseY = height - padding;

    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1 || 1)) * (width - padding * 2);
      const y = height - padding - ((d.value - minValue) / range) * (height - padding * 2);
      return { x, y };
    });

    let path = `M ${points[0].x} ${baseY} L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ` L ${points[points.length - 1].x} ${baseY} Z`;
    return path;
  };

  const chartData = payments.successTrend;
  const linePath = generateLinePath(chartData);
  const areaPath = generateAreaPath(chartData);
  const maxY = Math.max(...chartData.map(d => d.value), 100);
  const minY = Math.min(...chartData.map(d => d.value), 0);

  return `
    <div class="insights-kpi-grid">
      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Zahlungen gestartet</span>
            </div>
            <div class="kpi-value">${formatNumber(payments.checkoutStarted)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change positive">+${changes.widgetViews || 0}% vs letzter Monat</div>
      </div>

      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Zahlungen erfolgreich</span>
            </div>
            <div class="kpi-value">${formatNumber(payments.paymentCompleted)}</div>
          </div>
          <div class="kpi-icon-box">${getIconString('chart')}</div>
        </div>
        <div class="kpi-change positive">+${changes.revenue || 0}% vs letzter Monat</div>
      </div>

      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Payment Success Rate</span>
            </div>
            <div class="kpi-value">${payments.successRate}%</div>
          </div>
          <div class="kpi-icon-box">${getIconString('payment-success')}</div>
        </div>
        <div class="kpi-change positive">+${changes.bookings || 0}% vs letzter Monat</div>
      </div>

      <div class="insights-kpi-card">
        <div class="kpi-card-top">
          <div class="kpi-main">
            <div class="kpi-header">
              <span class="kpi-label">Refunds</span>
            </div>
            <div class="kpi-value">${payments.refundRate}%</div>
          </div>
          <div class="kpi-icon-box">${getIconString('rotate-ccw')}</div>
        </div>
        <div class="kpi-change ${payments.refundRate > 5 ? 'negative' : 'positive'}">+${changes.cancellationRate || 0}% vs letzter Monat</div>
      </div>
    </div>

    <div class="payments-chart-card">
      <div class="payments-chart-header">
        <div>
          <h3>Payment-Success-Trend</h3>
          <p class="payments-chart-subtitle">Erfolgsrate der Zahlungen über Zeit</p>
        </div>
      </div>
      <div class="payments-line-chart">
        <svg viewBox="0 0 900 220" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="paymentsAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--color-majorelle-blue-50)"/>
              <stop offset="100%" stop-color="#fff"/>
            </linearGradient>
          </defs>
          <!-- Y-Axis labels -->
          <text x="30" y="50" class="chart-label">${Math.round(maxY)}%</text>
          <text x="30" y="110" class="chart-label">${Math.round((maxY + minY) / 2)}%</text>
          <text x="30" y="170" class="chart-label">${Math.round(minY)}%</text>
          
          <!-- Grid lines -->
          <line x1="40" y1="50" x2="860" y2="50" class="chart-grid" />
          <line x1="40" y1="110" x2="860" y2="110" class="chart-grid" />
          <line x1="40" y1="170" x2="860" y2="170" class="chart-grid" />
          
          <!-- Area fill (gradient) -->
          <path d="${areaPath}" fill="url(#paymentsAreaGradient)" />
          
          <!-- Line path -->
          <path d="${linePath}" class="chart-line" fill="none" stroke="var(--color-majorelle-blue-600)" stroke-width="2" />
          
          <!-- X-Axis labels -->
          ${chartData.map((d, i) => {
    const x = 40 + (i / (chartData.length - 1 || 1)) * 820;
    return `<text x="${x}" y="200" class="chart-label">${d.label}</text>`;
  }).join('')}
        </svg>
      </div>
    </div>
  `;
};

/**
 * Render tab content based on active tab
 */
const renderTabContent = (tab, data) => {
  switch (tab) {
    case 'overview':
      return renderOverviewTab(data);
    case 'funnel':
      return renderFunnelTab(data);
    case 'traffic':
      return renderTrafficTab(data);
    case 'payments':
      return renderPaymentsTab(data);
    default:
      return renderOverviewTab(data);
  }
};

/**
 * Handle tab click
 */
const handleTabClick = async (tabId) => {
  setNestedState('insights', { activeTab: tabId });

  // Update active tab UI
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-tab[data-tab="${tabId}"]`)?.classList.add('active');

  // Re-render content
  const state = getState();
  const contentEl = document.getElementById('insights-content');
  if (contentEl) {
    contentEl.innerHTML = renderTabContent(tabId, state.insights.data);
    if (tabId === 'overview') {
      initCharts(state.insights.data);
    }
  }
};

/**
 * Handle time period change
 */
const handleTimePeriodChange = async (period) => {
  setNestedState('insights', { timePeriod: period });

  // Update dropdown button text
  const btn = document.getElementById('time-period-btn');
  const selected = TIME_PERIODS.find(p => p.id === period);
  if (btn && selected) {
    btn.innerHTML = `${getIconString('insights')} ${selected.label}`;
  }

  // Close dropdown
  const dropdown = document.getElementById('time-period-dropdown');
  if (dropdown) dropdown.style.display = 'none';

  // Reload data
  await loadInsightsData();
};

/**
 * Initialize charts
 */
const initCharts = (data) => {
  const chartData = data?.charts || {
    conversion: generateSampleData(),
    cancellation: generateSampleData()
  };

  setTimeout(() => {
    renderLineChart({
      containerId: 'conversion-chart',
      data: chartData.conversion,
      unit: '%',
      autoScale: true,
      showGrid: true,
      showGradient: true,
      height: 220
    });

    renderLineChart({
      containerId: 'cancellation-chart',
      data: chartData.cancellation,
      unit: '%',
      autoScale: true,
      showGrid: true,
      showGradient: true,
      height: 220
    });
  }, 50);
};

const EMPTY_STATE_CONFIG = {
  title: 'Noch keine Insights vorhanden.',
  description: 'Sobald Gäste Ihr Buchungswidget nutzen, sehen Sie hier Aufrufe, Buchungen und Conversion-Raten.',
  primaryLabel: 'Buchungen anzeigen',
  illustrationSrc: 'empty-state-analytics.svg',
  secondaryLabel: 'Mehr über Insights erfahren',
  secondaryHref: '#'
};

/**
 * Render full insights layout (tabs, time period, content area). Called only when we have data.
 */
const renderInsightsLayout = (mainContent, data) => {
  const state = getState();
  const { activeTab, timePeriod } = state.insights;
  const selectedPeriod = TIME_PERIODS.find(p => p.id === timePeriod) || TIME_PERIODS[0];

  mainContent.innerHTML = `
    <div class="zone-tabs">
      <div class="tabs-list">
        ${INSIGHT_TABS.map(tab => `
          <button class="filter-tab ${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
            ${tab.label}
          </button>
        `).join('')}
      </div>
      <div class="time-period-wrapper">
        <button class="time-period-btn" id="time-period-btn">
          ${getIconString('insights')} ${selectedPeriod.label}
        </button>
        <div class="time-period-dropdown" id="time-period-dropdown">
          ${TIME_PERIODS.map(p => `
            <button class="time-period-option ${p.id === timePeriod ? 'active' : ''}" data-period="${p.id}">
              ${p.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="data-table-wrapper" id="insights-content">
      ${data === null ? '' : renderTabContent(activeTab, data)}
    </div>
  `;

  if (activeTab === 'overview') {
    initCharts(data);
  }
};

/**
 * Load insights data
 */
const loadInsightsData = async () => {
  const mainContent = document.getElementById('main-content');
  const topBarActions = document.getElementById('top-bar-actions');
  const navGen = getNavigationGeneration();

  const data = await fetchInsightsData();

  if (getNavigationGeneration() !== navGen) return;

  setNestedState('insights', { data });

  if (topBarActions) topBarActions.innerHTML = '';

  if (data === null) {
    renderEmptyState(mainContent, {
      ...EMPTY_STATE_CONFIG,
      onPrimaryClick: () => navigate('bookings')
    });
    return;
  }

  renderInsightsLayout(mainContent, data);
};

/**
 * Main render function for insights page
 */
export const renderInsightsPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const topBarBreadcrumb = document.getElementById('top-bar-breadcrumb');
  if (topBarBreadcrumb) {
    topBarBreadcrumb.innerHTML = `<span class="breadcrumb-item">${getIconString('home')} <a href="#" class="breadcrumb-link" data-nav="home">Home</a></span> <span class="breadcrumb-separator">${getIconString('arrow-down')}</span> <span class="breadcrumb-item">${getIconString('insights')} Insights</span>`;
  }

  const topBarActions = document.getElementById('top-bar-actions');
  if (topBarActions) topBarActions.innerHTML = '';

  renderPageLoading(mainContent);

  const handleMainContentClick = (e) => {
    const tab = e.target.closest('.filter-tab');
    if (tab) {
      handleTabClick(tab.dataset.tab);
      return;
    }
    const timePeriodBtn = e.target.closest('#time-period-btn');
    if (timePeriodBtn) {
      const dropdown = document.getElementById('time-period-dropdown');
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      }
      return;
    }
    const periodOption = e.target.closest('.time-period-option');
    if (periodOption) {
      handleTimePeriodChange(periodOption.dataset.period);
      return;
    }
    const trafficTab = e.target.closest('.traffic-stat-tab');
    if (trafficTab) {
      const tabId = trafficTab.dataset.trafficTab;
      const card = trafficTab.closest('.traffic-stat-card');
      if (card) {
        card.querySelectorAll('.traffic-stat-tab').forEach(t => t.classList.remove('active'));
        trafficTab.classList.add('active');
        card.querySelectorAll('.traffic-stat-content').forEach(c => c.style.display = 'none');
        const content = card.querySelector(`#traffic-${tabId}`);
        if (content) content.style.display = 'block';
      }
      return;
    }
    const dropdown = document.getElementById('time-period-dropdown');
    if (dropdown && !e.target.closest('.time-period-wrapper')) {
      dropdown.style.display = 'none';
    }
  };

  mainContent.addEventListener('click', handleMainContentClick);

  loadInsightsData();

  return () => {
    if (mainContent) {
      mainContent.removeEventListener('click', handleMainContentClick);
    }
  };
};
