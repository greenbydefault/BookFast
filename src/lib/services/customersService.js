import { supabase } from '../supabaseClient.js';

export const fetchAggregatedCustomers = async ({ workspaceId, limit, offset }) => {
    const { data, error } = await supabase.rpc('get_customers_aggregated', {
        p_workspace_id: workspaceId,
        p_limit: limit,
        p_offset: offset,
    });
    if (error) throw error;
    return data || [];
};

export const fetchCustomerEmailCount = async (workspaceId) => {
    const { count, error } = await supabase
        .from('bookings')
        .select('customer_email', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);
    if (error) throw error;
    return count || 0;
};

export const fetchBookingsForCustomerAggregation = async (workspaceId) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('customer_email, customer_name, customer_phone, created_at')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};
