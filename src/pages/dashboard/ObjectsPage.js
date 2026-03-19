import { createListPage } from '../../lib/ListPageController.js';
import { openCreateObjectModal } from './modals/CreateObjectModal.js';
import { renderLinkedItems } from '../../lib/uiHelpers.js';

export const renderObjectsPage = createListPage({
  entity: 'objects',
  openCreateModal: openCreateObjectModal,
  filterButtons: ['Kapazität ▾', 'Status ▾'],
  rowClass: 'clickable-row',
  emptyState: {
    title: 'Noch keine Objekte vorhanden.',
    description: 'Erstellen Sie Ihr erstes Objekt, damit Gäste buchen können. Kapazität, Ausstattung und verknüpfte Services können Sie später anpassen.',
    primaryLabel: '+ Objekt erstellen',
    secondaryLabel: 'Mehr über Objekte erfahren',
  },
  columns: [
    { label: 'Name', render: (item) => item.name || 'Unbenannt' },
    { label: 'Kapazität', render: (item) => item.capacity || '-' },
    { label: 'Status', render: (item) => `<span class="status-badge status-${item.status}">${item.status || 'draft'}</span>` },
    { label: 'Beschreibung', sortable: false, render: (item) => `${item.description?.substring(0, 50) || '-'}${item.description?.length > 50 ? '...' : ''}` },
    { label: 'Verknüpfte Services', sortable: false, render: (item) => renderLinkedItems(item.services, 'service') },
  ],
});
