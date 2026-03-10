import { mapStripeWorkspaceStatus, getFallbackStatusMeta } from '../integration/statusMapping.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FALLBACK_SITE_ID = import.meta.env.VITE_LANDING_INTEGRATION_SITE_ID || '';

const DEFAULT_POLL_INTERVAL_MS = 15000;

const STATIC_FALLBACK = {
  stripe: { key: 'inactive', label: 'Nicht verbunden', tone: 'disconnected' },
  webflow_embed: { key: 'inactive', label: 'Nicht verbunden', tone: 'disconnected' },
  webhooks: { key: 'active', label: 'Aktiv', tone: 'connected' },
  google_calendar: { key: 'coming-soon', label: 'Coming Soon', tone: 'coming-soon' },
};

const getSiteIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('site_id') || params.get('bf_site_id') || '';
};

const resolveSiteId = () => getSiteIdFromUrl() || FALLBACK_SITE_ID;

const getFunctionUrl = (siteId) => `${SUPABASE_URL}/functions/v1/public-integration-status?site_id=${encodeURIComponent(siteId)}`;

const toFallbackResponse = ({ reason, previous }) => ({
  siteId: previous?.siteId || resolveSiteId() || '',
  fetchedAt: new Date().toISOString(),
  stale: Boolean(previous),
  reason,
  integrations: previous?.integrations || STATIC_FALLBACK,
});

const normalizePayload = (payload) => {
  const stripe = mapStripeWorkspaceStatus({
    stripeConnectedAccountId: payload?.integrations?.stripe?.connected ? 'connected' : '',
    payoutStatus: payload?.integrations?.stripe?.payout_status,
  });
  const webflow = payload?.integrations?.webflow_embed?.connected
    ? { key: 'active', ...getFallbackStatusMeta('active') }
    : { key: 'inactive', ...getFallbackStatusMeta('inactive') };
  const webhooksKey = payload?.integrations?.webhooks?.status === 'active' ? 'active' : 'coming-soon';
  const calendarKey = payload?.integrations?.google_calendar?.status === 'active' ? 'active' : 'coming-soon';

  return {
    siteId: payload?.site_id || '',
    fetchedAt: payload?.fetched_at || new Date().toISOString(),
    stale: false,
    integrations: {
      stripe: { key: stripe.key, label: stripe.label, tone: stripe.tone },
      webflow_embed: { key: webflow.key, label: webflow.label, tone: webflow.tone },
      webhooks: { key: webhooksKey, ...getFallbackStatusMeta(webhooksKey) },
      google_calendar: { key: calendarKey, ...getFallbackStatusMeta(calendarKey) },
    },
  };
};

export const fetchIntegrationStatus = async ({ previous = null, timeoutMs = 6500 } = {}) => {
  const siteId = resolveSiteId();
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return toFallbackResponse({ reason: 'missing-supabase-env', previous });
  }
  if (!siteId) {
    return toFallbackResponse({ reason: 'missing-site-id', previous });
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(getFunctionUrl(siteId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      return toFallbackResponse({ reason: `http-${res.status}`, previous });
    }

    const payload = await res.json();
    if (!payload?.success) {
      return toFallbackResponse({ reason: 'invalid-response', previous });
    }

    return normalizePayload(payload);
  } catch (_error) {
    return toFallbackResponse({ reason: 'request-failed', previous });
  } finally {
    window.clearTimeout(timeout);
  }
};

export const createIntegrationStatusPoller = (
  onData,
  { intervalMs = DEFAULT_POLL_INTERVAL_MS } = {},
) => {
  let intervalId = null;
  let inflight = false;
  let latest = null;
  let destroyed = false;

  const tick = async () => {
    if (inflight || destroyed) return;
    inflight = true;
    try {
      latest = await fetchIntegrationStatus({ previous: latest });
      onData(latest);
    } finally {
      inflight = false;
    }
  };

  const start = () => {
    if (intervalId) return;
    tick();
    intervalId = window.setInterval(tick, intervalMs);
  };

  const stop = () => {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    intervalId = null;
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      tick();
      start();
      return;
    }
    stop();
  };

  document.addEventListener('visibilitychange', handleVisibility);
  start();

  return {
    stop: () => {
      destroyed = true;
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    },
    refresh: tick,
  };
};
