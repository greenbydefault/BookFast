const STRIPE_STATUS_META = {
  active: { label: 'Aktiv', tone: 'connected' },
  pending: { label: 'In Prüfung', tone: 'pending' },
  requires_action: { label: 'Aktion nötig', tone: 'warning' },
  inactive: { label: 'Nicht verbunden', tone: 'disconnected' },
};

const FALLBACK_STATUS_META = {
  active: { label: 'Aktiv', tone: 'connected' },
  inactive: { label: 'Nicht verbunden', tone: 'disconnected' },
  'coming-soon': { label: 'Coming Soon', tone: 'coming-soon' },
};

const toStripeKey = (payoutStatus) => {
  if (payoutStatus === 'active') return 'active';
  if (payoutStatus === 'pending') return 'pending';
  if (payoutStatus === 'requires_action') return 'requires_action';
  return 'inactive';
};

export const mapStripeWorkspaceStatus = ({ stripeConnectedAccountId, payoutStatus }) => {
  const connected = Boolean(stripeConnectedAccountId);
  if (!connected) {
    return {
      key: 'inactive',
      connected: false,
      ready: false,
      ...STRIPE_STATUS_META.inactive,
    };
  }

  const key = toStripeKey(payoutStatus);
  return {
    key,
    connected: true,
    ready: key === 'active',
    ...STRIPE_STATUS_META[key],
  };
};

export const getStripeStatusMeta = (statusKey) => STRIPE_STATUS_META[statusKey] || STRIPE_STATUS_META.inactive;

export const getFallbackStatusMeta = (statusKey) => FALLBACK_STATUS_META[statusKey] || FALLBACK_STATUS_META.inactive;
