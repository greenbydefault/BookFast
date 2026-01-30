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

// In-memory cache
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

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
    if (filter && filter !== 'all' && config.filterColumn) {
        query = query.eq(config.filterColumn, filter);
    }

    // Apply search
    if (search && config.searchColumns?.length > 0) {
        const searchFilters = config.searchColumns.map(col => `${col}.ilike.%${search}%`);
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
 * Fetch single entity by ID
 */
export const fetchEntity = async (entityType, id) => {
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
    const config = getEntityConfig(entityType);
    const state = getState();

    const { data, error } = await supabase
        .from(config.table)
        .insert({ ...entityData, workspace_id: state.currentWorkspace.id })
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
