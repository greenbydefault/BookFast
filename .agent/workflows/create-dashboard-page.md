---
description: How to create a new dashboard page using the data layer
---

# Creating a New Dashboard Page

This workflow describes how to add a new page (e.g., ServicesPage, StaffPage) using the established data layer pattern.

## Prerequisites
- Entity must be defined in `src/lib/entities.js`
- Database table must exist in Supabase

---

## Step 1: Add Entity to Registry (if not exists)

Edit `src/lib/entities.js` and add your entity:

```javascript
services: {
  table: 'services',
  select: '*',
  orderBy: 'name',
  orderDirection: 'asc',
  filterColumn: 'status',
  displayColumns: ['name', 'service_type', 'price', 'duration_minutes', 'status'],
  searchColumns: ['name', 'description'],
  statusField: 'status',
  statusOptions: ['draft', 'active', 'inactive', 'archived']
}
```

---

## Step 2: Create Page File

Create `src/pages/dashboard/[EntityName]Page.js`:

```javascript
/**
 * [Entity] Page - Dashboard View
 */
import { getState, setNestedState, setState } from '../../lib/store.js';
import { fetchEntities, createEntity, updateEntity, deleteEntity } from '../../lib/dataLayer.js';
import { getIconString } from '../../components/Icons/Icon.js';

// Status options for filter tabs
const FILTER_TABS = [
  { id: 'all', label: 'Alle', icon: '📋' },
  { id: 'active', label: 'Aktiv', icon: '✓' },
  { id: 'draft', label: 'Entwurf', icon: '📝' },
  { id: 'archived', label: 'Archiviert', icon: '📦' }
];

/**
 * Fetch data using dataLayer
 */
const fetchData = async () => {
  const state = getState();
  const { filter, page, perPage } = state.entityName; // Replace with actual state key
  
  const result = await fetchEntities('entityName', { filter, page, perPage });
  
  setNestedState('entityName', {
    items: result.items,
    totalPages: result.totalPages
  });
  
  renderTable();
};

/**
 * Render table
 */
const renderTable = () => {
  const container = document.getElementById('entity-table-body');
  if (!container) return;
  
  const { items } = getState().entityName;
  
  container.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.price}€</td>
      <td>
        <button class="action-btn" data-id="${item.id}">⋮</button>
      </td>
    </tr>
  `).join('');
};

/**
 * Main render function
 */
export const renderEntityPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb"><a href="#">Home</a> / Entity</div>
      <h1 class="page-title">Entity Name</h1>
    </div>
    
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Preis</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody id="entity-table-body">
          <tr><td colspan="3">Laden...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetchData();
};
```

---

## Step 3: Add State to Store

Edit `src/lib/store.js` and add initial state:

```javascript
const initialState = {
  // ... existing state
  services: {
    items: [],
    filter: 'all',
    page: 1,
    perPage: 10,
    totalPages: 1
  }
};
```

---

## Step 4: Register Page in Dashboard

Edit `src/pages/Dashboard.js`:

```javascript
// Add import
import { renderServicesPage } from './dashboard/ServicesPage.js';

// Register page (in renderDashboard function)
registerPage('services', renderServicesPage);

// Add to preload (optional, for speed)
preloadEntities(['bookings', 'sites', 'services']);
```

---

## Step 5: Verify

1. Run `bun run dev`
2. Navigate to the page via sidebar
3. Check console for errors
4. Verify data loads correctly

---

## CRUD Operations

```javascript
// Create
const newItem = await createEntity('services', { name: 'Haircut', price: 30 });

// Update
const updated = await updateEntity('services', itemId, { price: 35 });

// Delete
await deleteEntity('services', itemId);
```

All CRUD operations automatically invalidate the cache.

---

## Reference Files

- Entity Registry: `src/lib/entities.js`
- Data Layer: `src/lib/dataLayer.js`
- Example Page: `src/pages/dashboard/BookingsPage.js`
