/**
 * Central State Store for BookFast
 * Simple pub/sub pattern for shared state management
 */

const createEntitySlice = (filter = 'all') => ({
    items: [],
    filter,
    page: 1,
    perPage: 10,
    totalPages: 1
});

const createEntitySlices = () => ({
    bookings: createEntitySlice('pending_approval'),
    objects: createEntitySlice(),
    services: createEntitySlice(),
    addons: createEntitySlice(),
    staff: createEntitySlice(),
    customers: createEntitySlice(),
    vouchers: createEntitySlice()
});

// Initial state
const initialState = {
    workspaces: [],
    currentWorkspace: null,
    sites: [],
    currentPage: 'bookings',
    user: null,
    ...createEntitySlices(),
    insights: {
        activeTab: 'overview',
        timePeriod: '1',
        data: null
    },
    isDemoMode: false
};

// Create a copy of initial state
let state = { ...initialState };

// Subscribers
const listeners = new Set();

/**
 * Get current state (deep copy for safety)
 */
export const getState = () => structuredClone(state);

/**
 * Update state and notify subscribers
 * @param {Partial<typeof initialState>} updates - Partial state updates
 */
export const setState = (updates) => {
    state = { ...state, ...updates };
    listeners.forEach(fn => fn(state));
};

/**
 * Update nested state (e.g., bookings.filter)
 * @param {string} key - Top-level key
 * @param {object} updates - Nested updates
 */
export const setNestedState = (key, updates) => {
    state = {
        ...state,
        [key]: { ...state[key], ...updates }
    };
    listeners.forEach(fn => fn(state));
};

/**
 * Subscribe to state changes
 * @param {Function} fn - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};

/**
 * Reset state to initial values
 */
export const resetState = () => {
    state = { ...initialState };
    listeners.forEach(fn => fn(state));
};

// Export state reference for direct access (use getState() for safety)
export { state };
