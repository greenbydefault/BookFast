import { createListPage } from '../../lib/ListPageController.js';
import { openCreateVoucherModal } from './modals/CreateVoucherModal.js';
import { renderLinkedItems } from '../../lib/uiHelpers.js';

const formatDiscount = (type, value) => {
  if (!type || !value) return '-';
  return type === 'percentage' ? `${value}%` : `${value} €`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('de-DE');
};

export const renderVouchersPage = createListPage({
  entity: 'vouchers',
  openCreateModal: openCreateVoucherModal,
  filterButtons: ['Rabatt ▾', 'Gültigkeit ▾'],
  filterTabs: [
    { id: 'all', label: 'Alle' },
    { id: 'active', label: 'Aktiv' },
    { id: 'draft', label: 'Entwurf' },
    { id: 'expired', label: 'Abgelaufen' },
  ],
  emptyState: {
    title: 'Noch keine Gutscheine vorhanden.',
    description: 'Erstellen Sie Ihren ersten Gutschein – z. B. für Geschenke oder Marketingaktionen. Code, Rabatt und Gültigkeit können Sie jederzeit anpassen.',
    primaryLabel: '+ Gutschein erstellen',
    secondaryLabel: 'Mehr über Gutscheine erfahren',
  },
  columns: [
    { label: 'Name', render: (item) => item.name || '-' },
    { label: 'Code', sortable: false, render: (item) => `<code class="voucher-code">${item.code || '-'}</code>` },
    { label: 'Rabatt', render: (item) => formatDiscount(item.discount_type, item.discount_value) },
    { label: 'Services', sortable: false, render: (item) => renderLinkedItems(item.linked_services, 'service') },
    { label: 'Nutzung', sortable: false, render: (item) => item.max_uses_total ? `${item.times_used || item.bookings?.length || 0}/${item.max_uses_total}` : '∞' },
    { label: 'Gültig bis', render: (item) => formatDate(item.valid_until) },
    { label: 'Status', render: (item) => `<span class="status-badge status-${item.status}">${item.status}</span>` },
  ],
});
