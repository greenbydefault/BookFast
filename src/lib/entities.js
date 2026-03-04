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
        select: '*, booking_number, objects(name), services(name, service_type), booking_addons(addon_id, addons(name)), booking_staff(staff_id, staff(name)), vouchers(code, name), payment_status, transfer_status, amount_deposit, amount_refunded',
        orderBy: 'created_at',
        orderDirection: 'desc',
        filterColumn: 'status',
        filterOverrides: {
            unpaid: { column: 'payment_status', value: 'unpaid' },
            active: { custom: 'active' },
            confirmed: { custom: 'confirmed' },
            completed: { custom: 'completed' }
        },
        displayColumns: ['customer_name', 'objects.name', 'services.name', 'start_time', 'total_price'],
        searchColumns: ['customer_name', 'customer_email'],
        statusField: 'status',
        statusOptions: ['pending', 'pending_approval', 'payment_pending', 'confirmed', 'completed', 'rejected', 'failed', 'no_show', 'cancelled']
    },

    objects: {
        table: 'objects',
        select: '*, services(id, name)',
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
        select: '*, objects(id, name), addons:addon_services(addon_id, addons(id, name)), staff:staff_services(staff_id, staff(id, name, image_url))',
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
        select: '*, linked_services:addon_services(service_id, services(id, name)), addon_items(id, name, quantity, description, selection_mode, applicability, addon_item_variants(id, name))',
        orderBy: 'name',
        orderDirection: 'asc',
        filterColumn: 'status',
        displayColumns: ['name', 'price', 'pricing_type', 'status'],
        searchColumns: ['name', 'description'],
        statusField: 'status',
        statusOptions: ['draft', 'active', 'inactive', 'archived']
    },

    addon_items: {
        table: 'addon_items',
        select: '*',
        orderBy: 'id',
        orderDirection: 'asc',
        skipWorkspaceId: true
    },

    addon_item_variants: {
        table: 'addon_item_variants',
        select: '*',
        orderBy: 'id',
        orderDirection: 'asc',
        skipWorkspaceId: true
    },

    staff: {
        table: 'staff',
        select: '*, linked_services:staff_services(service_id, services(id, name))',
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
        select: '*, bookings(customer_name), linked_services:voucher_services(service_id, services(id, name))',
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
    },

    customers: {
        table: 'bookings', // Aggregated from bookings
        aggregated: true,  // Flag for custom handling
        orderBy: 'created_at',
        orderDirection: 'desc',
        displayColumns: ['customer_email', 'customer_name', 'customer_phone', 'booking_count', 'last_booking'],
        searchColumns: ['customer_name', 'customer_email', 'customer_phone']
    },

    email_templates: {
        table: 'email_templates',
        select: '*',
        orderBy: 'template_type',
        orderDirection: 'asc',
        filterColumn: 'template_type',
        displayColumns: ['template_type', 'subject'],
        searchColumns: ['template_type', 'subject'],
        statusField: null,
        statusOptions: []
    },

    workspaces: {
        table: 'workspaces',
        select: '*',
        orderBy: 'created_at',
        orderDirection: 'desc',
        filterColumn: null,
        displayColumns: ['name', 'company_name'],
        searchColumns: ['name', 'company_name'],
        statusField: null,
        statusOptions: []
    },

    vacations: {
        table: 'vacations',
        select: '*, objects(id, name), staff(id, name), services(id, name)',
        orderBy: 'start_date',
        orderDirection: 'asc',
        filterColumn: null,
        displayColumns: ['start_date', 'end_date', 'scope', 'description'],
        searchColumns: ['description'],
        statusField: null,
        statusOptions: []
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
