import { createListPage } from '../../lib/ListPageController.js';
import { openCreateAddonModal } from './modals/CreateAddonModal.js';
import { renderLinkedItems } from '../../lib/uiHelpers.js';

const getPricingLabel = (type) => {
  const types = { one_time: 'Einmalig', per_night: 'Nacht', per_person: 'Person', per_ticket: 'Ticket' };
  return types[type] || type;
};

export const renderAddonsPage = createListPage({
  entity: 'addons',
  openCreateModal: openCreateAddonModal,
  filterButtons: ['Preis ▾', 'Typ ▾'],
  emptyState: {
    title: 'Noch keine Add-ons vorhanden.',
    description: 'Erstellen Sie Ihr erstes Add-on – z. B. Frühstück, Parkplatz oder Wellness-Optionen. Preise und Verknüpfung mit Services können Sie jederzeit anpassen.',
    primaryLabel: '+ Add-on erstellen',
    secondaryLabel: 'Mehr über Add-ons erfahren',
  },
  columns: [
    { label: 'Name', render: (item) => item.name || 'Unbenannt' },
    { label: 'Preis', render: (item) => `${item.price} € / ${getPricingLabel(item.pricing_type)}` },
    { label: 'Status', render: (item) => `<span class="status-badge status-${item.status}">${item.status || 'draft'}</span>` },
    { label: 'Beschreibung', sortable: false, render: (item) => `${item.description?.substring(0, 50) || '-'}${item.description?.length > 50 ? '...' : ''}` },
    { label: 'Verknüpfte Services', sortable: false, render: (item) => renderLinkedItems(item.linked_services, 'service') },
  ],
});
