import { supabase } from '../supabaseClient.js';
import { getFunctionsUrl } from '../config.js';

const parseJsonSafe = async (response) => {
    const text = await response.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
};

export const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) return session.access_token;

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshed?.session?.access_token) {
        throw new Error('Sitzung abgelaufen. Bitte neu einloggen.');
    }
    return refreshed.session.access_token;
};

export const invokeFunction = async (path, body, options = {}) => {
    const {
        retryOnUnauthorized = true,
        method = 'POST',
    } = options;

    let accessToken = await getAccessToken();
    let response = await fetch(getFunctionsUrl(path), {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body || {}),
    });

    let result = await parseJsonSafe(response);

    if (retryOnUnauthorized && response.status === 401) {
        const { data: refreshed, error } = await supabase.auth.refreshSession();
        if (!error && refreshed?.session?.access_token) {
            accessToken = refreshed.session.access_token;
            response = await fetch(getFunctionsUrl(path), {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body || {}),
            });
            result = await parseJsonSafe(response);
        }
    }

    if (!response.ok) {
        const errorMessage = result?.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
    }

    if (result?.error) {
        throw new Error(result.error);
    }

    return result;
};
