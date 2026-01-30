/**
 * Entity Registry - Configuration for all data entities
 * 
 * Each entity defines:
 * - table: Supabase table name
 * - select: Columns to select (with joins)
 * - orderBy: Default sort column
 * - filterColumn: Column used for status filtering
 * - displayColumns: Columns shown in table view
 * - searchColumns: Columns searchable via text input
 */

export const ENTITIES = {
    bookings: {
        table: 'bookings',
        select: '*, objects(name), services(name)',
        orderBy: 'created_at',
        orderDirection: 'desc',
        filterColumn: 'status',
        displayColumns: ['customer_name', 'objects.name', 'services.name', 'start_time', 'total_price'],
        searchColumns: ['customer_name', 'customer_email'],
        statusField: 'status',
        statusOptions: ['new', 'pending', 'confirmed', 'completed', 'rejected', 'failed', 'no_show', 'cancelled']
    },

    objects: {
        table: 'objects',
        select: '*',
        orderBy: 'name',
        orderDirection: 'asc',
        filterColumn: 'status',
        displayColumns: ['name', 'capacity', 'status'],
        searchColumns: ['name', 'description'],
        statusField: 'status',
        statusOptions: ['draft', 'active', 'inactive', 'archived']
    },

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
    },
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
    },

    addons: {
        table: 'addons',
        select: '*, addon_services(service_id)',
        orderBy: 'name',
        orderDirection: 'asc',
        filterColumn: 'status',
        displayColumns: ['name', 'price', 'pricing_type', 'status'],
        searchColumns: ['name', 'description'],
        statusField: 'status',
        statusOptions: ['draft', 'active', 'inactive', 'archived']
    },

    staff: {
        table: 'staff',
        select: '*',
        orderBy: 'name',
        orderDirection: 'asc',
        filterColumn: 'status',
        displayColumns: ['name', 'status', 'bookable_days'],
        searchColumns: ['name'],
        statusField: 'status',
        statusOptions: ['draft', 'active', 'inactive', 'archived']
    },

    vouchers: {
        table: 'vouchers',
        select: '*',
        orderBy: 'created_at',
        orderDirection: 'desc',
        filterColumn: 'status',
        displayColumns: ['name', 'code', 'discount_type', 'discount_value', 'valid_until', 'status'],
        searchColumns: ['name', 'code'],
        statusField: 'status',
        statusOptions: ['draft', 'active', 'expired', 'archived']
    },

    sites: {
        table: 'sites',
        select: '*',
        orderBy: 'name',
        orderDirection: 'asc',
        filterColumn: 'is_active',
        displayColumns: ['name', 'domain', 'is_active'],
        searchColumns: ['name', 'domain'],
        statusField: 'is_active',
        statusOptions: [true, false]
    }
};

/**
 * Get entity configuration
 */
export const getEntityConfig = (entityType) => {
    const config = ENTITIES[entityType];
    if (!config) {
        throw new Error(`Unknown entity type: ${entityType}`);
    }
    return config;
};

/**
 * Get all entity types
 */
export const getEntityTypes = () => Object.keys(ENTITIES);
