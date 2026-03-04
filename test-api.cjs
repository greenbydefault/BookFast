const fetch = require('node-fetch');

async function main() {
    const API = 'https://yolidffzpvkizdqqcolk.supabase.co';
    const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbGlkZmZ6cHZraXpkcXFjb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODU4OTMsImV4cCI6MjA4NTI2MTg5M30._V6ZbzwIZvTKkBTUVNbDLWmcDvBrKOJuKUlT2N5q0Fs';
    const HDR = { 'Content-Type': 'application/json', 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };

    const sitesRes = await fetch(API + '/rest/v1/sites?select=*', { headers: HDR });
    const sites = await sitesRes.json();
    console.log('Sites:', sites.length > 0 ? sites[0].id : 'No sites found');

    if (sites.length === 0) return;

    const widgetRes = await fetch(`${API}/rest/v1/rpc/get_widget_data`, {
        method: 'POST', headers: HDR,
        body: JSON.stringify({ p_site_id: sites[0].id })
    });

    const widget = await widgetRes.json();
    if (!widget.objects || widget.objects.length === 0) {
        console.log('No objects for site', sites[0].id);
        return;
    }

    const objId = widget.objects[0].id;
    console.log('Using object:', widget.objects[0].name);

    const availRes = await fetch(`${API}/rest/v1/rpc/get_availability_for_range`, {
        method: 'POST', headers: HDR,
        body: JSON.stringify({
            p_object_id: objId,
            p_start_date: '2026-02-01',
            p_end_date: '2026-03-01'
        })
    });

    const avail = await availRes.json();
    console.log('Availability bookings structure:', JSON.stringify(avail.bookings[0], null, 2));
    console.log('Feb 25 bookings:', avail.bookings.filter(b => b.date === '2026-02-25'));
}

main().catch(console.error);
