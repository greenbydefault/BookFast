/**
 * Data Layer - Centralized data fetching with caching
 * 
 * Provides:
 * - In-memory caching with TTL
 * - Generic CRUD operations for all entities
 * - Automatic cache invalidation
 * - Unified error handling
 */

import { supabase } from './supabaseClient.js';
import { getState } from './store.js';
import { getEntityConfig } from './entities.js';
import { DEMO_DATA } from './DemoData.js';
import { bookingMatchesFilter, applyBookingFilterToQuery } from './bookingStatus.js';

// In-memory cache
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Helper to simulate pagination/filtering for Demo Data
 */
const mockFetchEntities = (entityType, options = {}) => {
    const { page = 1, perPage = 10, filter = 'all', search = '' } = options;
    let items = [...(DEMO_DATA[entityType] || [])];

    // Simple Filter (status matches)
    if (filter && filter !== 'all') {
        if (entityType === 'bookings') {
            items = items.filter(item => bookingMatchesFilter(item, filter));
        } else {
            items = items.filter(item => item.status === filter);
        }
    }

    // Simple Search (name matches)
    if (search) {
        const lowerSearch = search.toLowerCase();
        items = items.filter(item =>
            (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
            (item.customer_name && item.customer_name.toLowerCase().includes(lowerSearch))
        );
    }

    // Pagination
    const total = items.length;
    const totalPages = Math.ceil(total / perPage);
    const from = (page - 1) * perPage;
    const to = from + perPage;
    const paginatedItems = items.slice(from, to);

    return {
        items: paginatedItems,
        total,
        totalPages,
        page,
        perPage
    };
};


/**
 * Generate cache key from query params
 */
const getCacheKey = (entityType, workspaceId, options = {}) => {
    const { filter, page, search } = options;
    return `${entityType}:${workspaceId}:${filter || 'all'}:${page || 1}:${search || ''}`;
};

/**
 * Check if cache entry is valid
 */
const isCacheValid = (entry) => {
    return entry && (Date.now() - entry.timestamp < CACHE_TTL);
};

/**
 * Fetch entities with caching and pagination
 * 
 * @param {string} entityType - Entity type from registry
 * @param {Object} options - Query options
 * @param {string} options.filter - Status filter value
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.perPage - Items per page
 * @param {string} options.search - Search text
 * @param {boolean} options.forceRefresh - Skip cache
 * @returns {Promise<{items: Array, total: number, totalPages: number, page: number}>}
 */
export const fetchEntities = async (entityType, options = {}) => {
    const {
        filter = 'all',
        page = 1,
        perPage = 10,
        search = '',
        forceRefresh = false
    } = options;

    const state = getState();
    const workspaceId = state.currentWorkspace?.id;

    if (state.isDemoMode) {
        return mockFetchEntities(entityType, options);
    }

    if (!workspaceId) {
        console.warn('fetchEntities: No workspace selected');
        return { items: [], total: 0, totalPages: 0, page: 1 };
    }

    // Check cache
    const cacheKey = getCacheKey(entityType, workspaceId, options);
    if (!forceRefresh && isCacheValid(cache.get(cacheKey))) {
        return cache.get(cacheKey).data;
    }

    const config = getEntityConfig(entityType);

    // Build query
    let query = supabase
        .from(config.table)
        .select(config.select, { count: 'exact' })
        .eq('workspace_id', workspaceId)
        .order(config.orderBy, { ascending: config.orderDirection === 'asc' });

    // Apply filter (skip 'all')
    if (filter && filter !== 'all') {
        if (entityType === 'bookings') {
            query = applyBookingFilterToQuery(query, filter);
        } else {
            const override = config.filterOverrides?.[filter];
            if (override) {
                query = query.eq(override.column, override.value);
                // Apply extra filters (e.g. exclude certain statuses)
                if (override.extraFilters) {
                    for (const extra of override.extraFilters) {
                        if (extra.type === 'not_in') {
                            query = query.not(extra.column, 'in', `(${extra.values.join(',')})`);
                        }
                    }
                }
            } else if (config.filterColumn) {
                query = query.eq(config.filterColumn, filter);
            }
        }
    }

    // Apply search (escape PostgREST special chars)
    if (search && config.searchColumns?.length > 0) {
        const escaped = search.replace(/[%_\\]/g, '\\$&');
        const searchFilters = config.searchColumns.map(col => `${col}.ilike.%${escaped}%`);
        query = query.or(searchFilters.join(','));
    }

    // Pagination
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    try {
        const { data, count, error } = await query;

        if (error) {
            console.error(`fetchEntities(${entityType}):`, error);
            throw error;
        }

        const result = {
            items: data || [],
            total: count || 0,
            totalPages: Math.ceil((count || 0) / perPage),
            page,
            perPage
        };

        // Store in cache
        cache.set(cacheKey, { data: result, timestamp: Date.now() });

        return result;
    } catch (err) {
        console.error(`fetchEntities(${entityType}) failed:`, err);
        return { items: [], total: 0, totalPages: 0, page: 1 };
    }
};

/**
 * Fetch total count for an entity type (unfiltered).
 * Used to distinguish "no items for this filter" from "no items at all".
 */
export const fetchEntityCount = async (entityType) => {
    const state = getState();
    if (state.isDemoMode) {
        return (DEMO_DATA[entityType] || []).length;
    }
    const workspaceId = state.currentWorkspace?.id;
    if (!workspaceId) return 0;
    const config = getEntityConfig(entityType);
    const { count, error } = await supabase
        .from(config.table)
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);
    if (error) {
        console.error(`fetchEntityCount(${entityType}):`, error);
        return 0;
    }
    return count || 0;
};

/**
 * Fetch single entity by ID
 */
export const fetchEntity = async (entityType, id) => {
    const state = getState();
    if (state.isDemoMode) {
        const items = DEMO_DATA[entityType] || [];
        return items.find(item => item.id === id) || null;
    }

    const config = getEntityConfig(entityType);

    const { data, error } = await supabase
        .from(config.table)
        .select(config.select)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`fetchEntity(${entityType}, ${id}):`, error);
        return null;
    }

    return data;
};

/**
 * Create new entity
 */
export const createEntity = async (entityType, entityData) => {
    const state = getState();
    // Demo Mode: Simulate creation
    if (state.isDemoMode) {
        console.log(`[DEMO] createEntity(${entityType})`, entityData);
        // Add ID and return
        const newEntity = { ...entityData, id: `demo-${Date.now()}` };
        if (DEMO_DATA[entityType]) DEMO_DATA[entityType].unshift(newEntity);
        invalidateCache(entityType);
        return newEntity;
    }

    const config = getEntityConfig(entityType);
    const insertData = config.skipWorkspaceId
        ? { ...entityData }
        : { ...entityData, workspace_id: state.currentWorkspace.id };

    const { data, error } = await supabase
        .from(config.table)
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error(`createEntity(${entityType}):`, error);
        throw error;
    }

    // Invalidate cache
    invalidateCache(entityType);

    return data;
};

/**
 * Update entity
 */
export const updateEntity = async (entityType, id, updates) => {
    const state = getState();
    if (state.isDemoMode) {
        console.log(`[DEMO] updateEntity(${entityType}, ${id})`, updates);
        if (DEMO_DATA[entityType]) {
            const index = DEMO_DATA[entityType].findIndex(i => i.id === id);
            if (index !== -1) {
                DEMO_DATA[entityType][index] = { ...DEMO_DATA[entityType][index], ...updates };
            }
        }
        invalidateCache(entityType);
        return { id, ...updates };
    }

    const config = getEntityConfig(entityType);

    const { data, error } = await supabase
        .from(config.table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`updateEntity(${entityType}, ${id}):`, error);
        throw error;
    }

    // Invalidate cache
    invalidateCache(entityType);

    return data;
};

/**
 * Delete entity
 */
export const deleteEntity = async (entityType, id) => {
    const state = getState();
    if (state.isDemoMode) {
        console.log(`[DEMO] deleteEntity(${entityType}, ${id})`);
        if (DEMO_DATA[entityType]) {
            const index = DEMO_DATA[entityType].findIndex(i => i.id === id);
            if (index !== -1) {
                DEMO_DATA[entityType].splice(index, 1);
            }
        }
        invalidateCache(entityType);
        return;
    }

    const config = getEntityConfig(entityType);

    const { error } = await supabase
        .from(config.table)
        .delete()
        .eq('id', id);

    if (error) {
        console.error(`deleteEntity(${entityType}, ${id}):`, error);
        throw error;
    }

    // Invalidate cache
    invalidateCache(entityType);
};

/**
 * Invalidate cache for entity type (or all if no type specified)
 */
export const invalidateCache = (entityType = null) => {
    if (entityType) {
        for (const key of cache.keys()) {
            if (key.startsWith(entityType + ':')) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
};

/**
 * Sync a junction table: delete all existing rows for localId, then insert new ones.
 * @param {string} table - Junction table name (e.g. 'addon_services')
 * @param {string} localKey - Column for the "owning" entity (e.g. 'service_id')
 * @param {string} localId - UUID of the owning entity
 * @param {string} foreignKey - Column for the linked entity (e.g. 'addon_id')
 * @param {string[]} foreignIds - Array of linked entity UUIDs
 * @param {Object} extraFields - Additional fields to include per inserted row
 */
export const syncJunctionTable = async (table, localKey, localId, foreignKey, foreignIds, extraFields = {}) => {
    const { error: delError } = await supabase.from(table).delete().eq(localKey, localId);
    if (delError) {
        console.error(`syncJunctionTable delete(${table}):`, delError);
        throw delError;
    }

    if (foreignIds.length > 0) {
        const rows = foreignIds.map(fId => ({
            ...extraFields,
            [localKey]: localId,
            [foreignKey]: fId
        }));
        const { error: insError } = await supabase.from(table).insert(rows);
        if (insError) {
            console.error(`syncJunctionTable insert(${table}):`, insError);
            throw insError;
        }
    }
};

/**
 * Keep the legacy services.object_id field aligned with the first linked object.
 * This preserves compatibility while service_objects is the real source of truth.
 *
 * @param {string[]} serviceIds
 */
export const syncServicePrimaryObjectIds = async (serviceIds = []) => {
    const uniqueServiceIds = [...new Set(serviceIds.filter(Boolean))];
    if (uniqueServiceIds.length === 0) return;

    const { data: links, error: linksError } = await supabase
        .from('service_objects')
        .select('service_id, object_id')
        .in('service_id', uniqueServiceIds)
        .order('object_id', { ascending: true });

    if (linksError) {
        console.error('syncServicePrimaryObjectIds fetch(service_objects):', linksError);
        throw linksError;
    }

    const primaryByServiceId = new Map(uniqueServiceIds.map(serviceId => [serviceId, null]));
    (links || []).forEach((link) => {
        if (!primaryByServiceId.has(link.service_id)) return;
        if (primaryByServiceId.get(link.service_id) !== null) return;
        primaryByServiceId.set(link.service_id, link.object_id);
    });

    const updates = uniqueServiceIds.map((serviceId) =>
        supabase
            .from('services')
            .update({ object_id: primaryByServiceId.get(serviceId) || null })
            .eq('id', serviceId)
    );

    const results = await Promise.all(updates);
    const failed = results.find(({ error }) => error);
    if (failed?.error) {
        console.error('syncServicePrimaryObjectIds update(services):', failed.error);
        throw failed.error;
    }
};

/**
 * Preload multiple entity types in parallel
 * Call this on dashboard init for faster page switching
 */
export const preloadEntities = async (entityTypes, options = {}) => {
    const promises = entityTypes.map(type => fetchEntities(type, options));
    return Promise.all(promises);
};

/**
 * Get cache stats (for debugging)
 */
export const getCacheStats = () => ({
    size: cache.size,
    keys: Array.from(cache.keys()),
    ttl: CACHE_TTL
});
