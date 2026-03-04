import { supabase } from '../supabaseClient.js';

export const uploadWorkspaceLogo = async ({ workspaceId, file }) => {
    const ext = (file?.name || '').split('.').pop()?.toLowerCase() || 'png';
    const path = `${workspaceId}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('logos').getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
};

export const removeWorkspaceLogo = async (logoUrl) => {
    if (!logoUrl) return;
    const pathMatch = logoUrl.match(/logos\/(.+?)(?:\?|$)/);
    if (!pathMatch) return;
    await supabase.storage.from('logos').remove([pathMatch[1]]);
};
