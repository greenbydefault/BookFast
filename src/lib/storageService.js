const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const getStorageItem = (key, fallback = null) => {
    if (!hasStorage()) return fallback;
    try {
        const value = window.localStorage.getItem(key);
        return value === null ? fallback : value;
    } catch {
        return fallback;
    }
};

export const setStorageItem = (key, value) => {
    if (!hasStorage()) return false;
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
};

export const removeStorageItem = (key) => {
    if (!hasStorage()) return false;
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
};

export const getStorageJson = (key, fallback = null) => {
    const raw = getStorageItem(key);
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const setStorageJson = (key, value) => {
    try {
        return setStorageItem(key, JSON.stringify(value));
    } catch {
        return false;
    }
};
