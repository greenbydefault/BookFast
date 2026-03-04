import { supabase } from '../supabaseClient.js';
import { invokeFunction } from './functionClient.js';

export const fetchWorkspaceBookingCount = async (workspaceId) => {
    if (!workspaceId) return 0;
    const { count, error } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);
    if (error) throw error;
    return count || 0;
};

export const approveBooking = async (bookingId) => {
    return invokeFunction('booking-approve', { booking_id: bookingId });
};

export const declineBooking = async (bookingId, reason) => {
    return invokeFunction('booking-decline', {
        booking_id: bookingId,
        reason: reason || undefined,
    });
};

export const fetchBookingCustomers = async (workspaceId) => {
    if (!workspaceId) return [];
    const { data, error } = await supabase
        .from('bookings')
        .select('customer_email, customer_name, customer_phone')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const fetchBookingModalData = async (workspaceId) => {
    if (!workspaceId) {
        return { objects: [], services: [], addons: [], staff: [] };
    }

    const [objs, svcs, adds, stf] = await Promise.all([
        supabase.from('objects').select('*').eq('workspace_id', workspaceId).eq('status', 'active'),
        supabase.from('services').select('*').eq('workspace_id', workspaceId).eq('status', 'active'),
        supabase
            .from('addons')
            .select('*, addon_services(service_id), addon_items(id, name, quantity, selection_mode, applicability, addon_item_variants(id, name))')
            .eq('workspace_id', workspaceId)
            .eq('status', 'active'),
        supabase.from('staff').select('*').eq('workspace_id', workspaceId).eq('status', 'active'),
    ]);

    return {
        objects: objs.data || [],
        services: svcs.data || [],
        addons: adds.data || [],
        staff: stf.data || [],
    };
};

export const fetchAvailabilityForRange = async (objectId, startDate, endDate) => {
    const { data, error } = await supabase.rpc('get_availability_for_range', {
        p_object_id: objectId,
        p_start_date: startDate,
        p_end_date: endDate,
    });
    if (error) throw error;
    return data || { blocked_dates: [], bookings: [] };
};

export const checkAvailabilityForBooking = async (payload) => {
    const { data, error } = await supabase.rpc('check_availability', payload);
    if (error) throw error;
    return !!data;
};

export const createManualBooking = async (payload) => {
    return invokeFunction('manual-booking-create', payload);
};
