import { invokeFunction } from './functionClient.js';

export const startStripeConnect = async ({ workspaceId, returnUrl, refreshUrl }) => {
    return invokeFunction('connect-start', {
        workspace_id: workspaceId,
        return_url: returnUrl,
        refresh_url: refreshUrl,
    });
};

export const fetchStripeConnectStatus = async (workspaceId) => {
    return invokeFunction('connect-status', { workspace_id: workspaceId });
};
