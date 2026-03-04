export const buildBookingsConfig = (getIconString) => ({
    STATUS_MAP: {
        pending: { label: 'Ausstehend', icon: getIconString('clock') },
        pending_approval: { label: 'Wartet', icon: getIconString('clock') },
        payment_pending: { label: 'Zahlung offen', icon: getIconString('receipt-euro') },
        confirmed: { label: 'Bestätigt', icon: getIconString('check') },
        active: { label: 'Aktiv', icon: getIconString('activity') },
        completed: { label: 'Abgeschlossen', icon: getIconString('doulbe-check') },
        rejected: { label: 'Abgelehnt', icon: getIconString('thumb-down') },
        failed: { label: 'Fehlgeschlagen', icon: getIconString('stop') },
        no_show: { label: 'Nicht erschienen', icon: getIconString('eye-off') },
        cancelled: { label: 'Storniert', icon: getIconString('banknote-x') }
    },
    PAYMENT_STATUS_MAP: {
        unpaid: { label: 'Unbezahlt', color: '#666' },
        paid: { label: 'Bezahlt', color: '#10b981' },
        refunded: { label: 'Erstattet', color: '#f59e0b' },
        partial_refunded: { label: 'Teilweise erstattet', color: '#f59e0b' },
        failed: { label: 'Fehlgeschlagen', color: '#ef4444' },
    },
    FILTER_TABS: [
        { id: 'all', label: 'Alle', icon: getIconString('list') },
        { id: 'unpaid', label: 'Offene Zahlungen', icon: getIconString('receipt-euro') },
        { id: 'pending_approval', label: 'Wartet', icon: getIconString('clock') },
        { id: 'confirmed', label: 'Bestätigt', icon: getIconString('check') },
        { id: 'active', label: 'Aktiv', icon: getIconString('activity') },
        { id: 'completed', label: 'Abgeschlossen', icon: getIconString('doulbe-check') },
        { id: 'rejected', label: 'Abgelehnt', icon: getIconString('thumb-down') },
        { id: 'failed', label: 'Fehlgeschlagen', icon: getIconString('stop'), hidden: true },
        { id: 'no_show', label: 'Nicht erschienen', icon: getIconString('eye-off') },
        { id: 'cancelled', label: 'Storniert', icon: getIconString('banknote-x') }
    ],
    EMPTY_STATE_CONFIG: {
        title: 'Noch keine Buchungen vorhanden.',
        description: 'Sobald Ihre Kunden über das Buchungswidget buchen, erscheinen sie hier. Alternativ können Sie Buchungen auch manuell anlegen.',
        primaryLabel: '+ Buchung anlegen',
        illustrationSrc: 'empty-state-buchungen.svg',
        secondaryLabel: 'Mehr über Buchungen erfahren',
        secondaryHref: '#'
    }
});
