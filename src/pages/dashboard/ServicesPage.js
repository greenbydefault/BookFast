import { createListPage } from '../../lib/ListPageController.js';
import { openCreateServiceModal } from './modals/CreateServiceModal.js';
import { renderLinkedItems } from '../../lib/uiHelpers.js';

export const renderServicesPage = createListPage({
  entity: 'services',
  openCreateModal: openCreateServiceModal,
  filterButtons: ['Typ ▾', 'Preis ▾'],
  emptyState: {
    title: 'Noch keine Services vorhanden.',
    description: 'Erstellen Sie Ihren ersten Service, damit Gäste buchen können. Dauer, Preis und Verfügbarkeit können Sie später jederzeit anpassen.',
    primaryLabel: '+ Service erstellen',
    secondaryLabel: 'Mehr über Services erfahren',
  },
  columns: [
    { label: 'Name', render: (item) => item.name || 'Unbenannt' },
    { label: 'Typ', render: (item) => item.service_type || '-' },
    { label: 'Preis', render: (item) => item.price ? `${item.price} €` : '-' },
    { label: 'Dauer', sortable: false, render: (item) => item.duration_minutes ? `${item.duration_minutes} min` : '-' },
    { label: 'Status', render: (item) => `<span class="status-badge status-${item.status}">${item.status || 'draft'}</span>` },
    { label: 'Objekte', sortable: false, render: (item) => renderLinkedItems(item.objects, 'object') },
    { label: 'Addons', sortable: false, render: (item) => renderLinkedItems(item.addons, 'addon') },
    { label: 'Mitarbeiter', sortable: false, render: (item) => renderLinkedItems(item.staff, 'staff') },
  ],
});
