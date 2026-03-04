export const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const getFunctionsUrl = (path = '') => {
    if (!path) return FUNCTIONS_URL;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${FUNCTIONS_URL}/${normalizedPath}`;
};
