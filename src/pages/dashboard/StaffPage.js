import { createListPage } from '../../lib/ListPageController.js';
import { openCreateStaffModal } from './modals/CreateStaffModal.js';
import { renderLinkedItems } from '../../lib/uiHelpers.js';

export const renderStaffPage = createListPage({
  entity: 'staff',
  openCreateModal: openCreateStaffModal,
  filterButtons: ['Arbeitstage ▾', 'Services ▾'],
  emptyState: {
    title: 'Noch keine Mitarbeiter vorhanden.',
    description: 'Fügen Sie Ihre ersten Mitarbeiter hinzu und verknüpfen Sie sie mit Services. Arbeitszeiten und Verfügbarkeit können Sie jederzeit anpassen.',
    primaryLabel: '+ Mitarbeiter hinzufügen',
    secondaryLabel: 'Mehr über Mitarbeiter erfahren',
  },
  columns: [
    { label: 'Name', render: (item) => `<div style="display:flex;align-items:center;gap:0.5rem;"><div class="user-avatar-small">${(item.name || '?').charAt(0).toUpperCase()}</div>${item.name || 'Unbenannt'}</div>` },
    { label: 'Status', render: (item) => `<span class="status-badge status-${item.status}">${item.status || 'draft'}</span>` },
    { label: 'Arbeitstage', sortable: false, render: (item) => Array.isArray(item.bookable_days) ? item.bookable_days.join(', ') : '-' },
    { label: 'Services', sortable: false, render: (item) => renderLinkedItems(item.linked_services, 'service') },
  ],
});
