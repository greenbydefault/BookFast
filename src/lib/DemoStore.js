/**
 * DemoStore — Session-only state for the landing page demo.
 * No Supabase calls, no database writes.
 * Data lives only in memory and optionally in sessionStorage.
 */

const SESSION_KEY = 'demo_workspace_name';

let _demoState = {
    workspaceName: '',
    activeView: 'home', // 'home', 'bookings', 'objects', etc.
};

/**
 * Set the demo active view
 */
export const setDemoView = (viewId) => {
    _demoState.activeView = viewId;
    // Dispatch a custom event so UI can react (simple primitive reactivity)
    window.dispatchEvent(new CustomEvent('demo:view-changed', { detail: { view: viewId } }));
};

/**
 * Get the demo active view
 */
export const getDemoView = () => _demoState.activeView;

/**
 * Set the demo workspace name
 */
export const setDemoWorkspaceName = (name) => {
    _demoState.workspaceName = name;
};

/**
 * Get the demo workspace name
 */
export const getDemoWorkspaceName = () => _demoState.workspaceName;

/**
 * Save demo data to sessionStorage so it survives navigation to /register.html
 */
export const saveDemoToSession = () => {
    if (_demoState.workspaceName) {
        sessionStorage.setItem(SESSION_KEY, _demoState.workspaceName);
    }
};

/**
 * Read demo workspace name from sessionStorage (called in Onboarding after registration)
 */
export const getDemoFromSession = () => {
    return sessionStorage.getItem(SESSION_KEY) || '';
};

/**
 * Clear demo data from sessionStorage
 */
export const clearDemoSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
};
