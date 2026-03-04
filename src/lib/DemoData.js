/**
 * DemoData — Realistic dummy data for the landing page interactive demo.
 * Matches the exact schema expected by all dashboard pages.
 * Dates are generated relative to today so the demo always looks fresh.
 */

const now = new Date();
const iso = (daysOffset, hours = 10, minutes = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
};
const dateOnly = (daysOffset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
};

// ── Objects ──────────────────────────────────────────────────────────────────

const OBJECTS = [
    {
        id: 'o-1', name: 'Studio Nordlicht', capacity: 4, status: 'active',
        description: 'Helles Tageslichtstudio mit Nordfenstern, perfekt für Portrait- und Produktshootings.',
        services: [{ id: 's-1', name: 'Portrait Shooting' }, { id: 's-2', name: 'Produkt Fotografie' }, { id: 's-7', name: 'Video Dreh' }]
    },
    {
        id: 'o-2', name: 'Meetingraum A', capacity: 8, status: 'active',
        description: 'Konferenzraum mit 65" Screen, Whiteboard und Videokonferenz-Setup.',
        services: [{ id: 's-3', name: 'Team Workshop' }, { id: 's-8', name: 'Strategieberatung' }]
    },
    {
        id: 'o-3', name: 'Podcast Studio', capacity: 3, status: 'active',
        description: 'Schallisolierte Kabine mit Rode-Setup, 3 Mikrofone, Mischpult.',
        services: [{ id: 's-4', name: 'Podcast Aufnahme' }, { id: 's-9', name: 'Voice-Over Recording' }]
    },
    {
        id: 'o-4', name: 'Event Space', capacity: 40, status: 'active',
        description: 'Offener Bereich für Events, Vernissagen und Workshops mit Bühne und Technik.',
        services: [{ id: 's-5', name: 'Event Miete' }, { id: 's-10', name: 'Workshop Raum' }]
    },
    {
        id: 'o-5', name: 'Co-Working Area', capacity: 12, status: 'active',
        description: '12 Flex-Desks mit Monitor, Strom und schnellem WLAN.',
        services: [{ id: 's-6', name: 'Tagespass' }, { id: 's-11', name: 'Wochenpass' }]
    },
    {
        id: 'o-6', name: 'Meetingraum B', capacity: 4, status: 'active',
        description: 'Kleiner Besprechungsraum für 1:1-Gespräche und Telefonate.',
        services: [{ id: 's-8', name: 'Strategieberatung' }]
    },
    {
        id: 'o-7', name: 'Dachterrasse', capacity: 25, status: 'active',
        description: 'Begrünte Dachterrasse mit Blick über die Stadt – für Sommervents und Empfänge.',
        services: [{ id: 's-5', name: 'Event Miete' }]
    },
    {
        id: 'o-8', name: 'Dunkelkammer', capacity: 2, status: 'maintenance',
        description: 'Analoge Dunkelkammer mit Vergrößerer und Chemie-Setup. Aktuell in Renovierung.',
        services: [{ id: 's-12', name: 'Dunkelkammer Miete' }]
    }
];

// ── Services ─────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        id: 's-1', name: 'Portrait Shooting', service_type: 'appointment', price: 149, duration_minutes: 90, status: 'active',
        objects: [{ id: 'o-1', name: 'Studio Nordlicht' }],
        addons: [{ addon_id: 'a-1', addons: { id: 'a-1', name: 'Kaffee-Flatrate' } }, { addon_id: 'a-5', addons: { id: 'a-5', name: 'Bildbearbeitung' } }],
        staff: [{ staff_id: 'st-1', staff: { id: 'st-1', name: 'Sarah Kraft' } }, { staff_id: 'st-4', staff: { id: 'st-4', name: 'Mira Stein' } }]
    },
    {
        id: 's-2', name: 'Produkt Fotografie', service_type: 'appointment', price: 249, duration_minutes: 120, status: 'active',
        objects: [{ id: 'o-1', name: 'Studio Nordlicht' }],
        addons: [{ addon_id: 'a-5', addons: { id: 'a-5', name: 'Bildbearbeitung' } }],
        staff: [{ staff_id: 'st-1', staff: { id: 'st-1', name: 'Sarah Kraft' } }]
    },
    {
        id: 's-3', name: 'Team Workshop', service_type: 'appointment', price: 299, duration_minutes: 180, status: 'active',
        objects: [{ id: 'o-2', name: 'Meetingraum A' }],
        addons: [{ addon_id: 'a-2', addons: { id: 'a-2', name: 'Beamer' } }, { addon_id: 'a-3', addons: { id: 'a-3', name: 'Catering Lunch' } }],
        staff: [{ staff_id: 'st-2', staff: { id: 'st-2', name: 'Tom Berg' } }]
    },
    {
        id: 's-4', name: 'Podcast Aufnahme', service_type: 'appointment', price: 89, duration_minutes: 60, status: 'active',
        objects: [{ id: 'o-3', name: 'Podcast Studio' }],
        addons: [{ addon_id: 'a-1', addons: { id: 'a-1', name: 'Kaffee-Flatrate' } }],
        staff: [{ staff_id: 'st-3', staff: { id: 'st-3', name: 'Lisa Neumann' } }]
    },
    {
        id: 's-5', name: 'Event Miete', service_type: 'rental', price: 450, duration_minutes: 240, status: 'active',
        objects: [{ id: 'o-4', name: 'Event Space' }, { id: 'o-7', name: 'Dachterrasse' }],
        addons: [{ addon_id: 'a-2', addons: { id: 'a-2', name: 'Beamer' } }, { addon_id: 'a-3', addons: { id: 'a-3', name: 'Catering Lunch' } }, { addon_id: 'a-4', addons: { id: 'a-4', name: 'Parkplatz' } }],
        staff: [{ staff_id: 'st-2', staff: { id: 'st-2', name: 'Tom Berg' } }, { staff_id: 'st-5', staff: { id: 'st-5', name: 'Jan Richter' } }]
    },
    {
        id: 's-6', name: 'Tagespass', service_type: 'ticket', price: 29, duration_minutes: 480, status: 'active',
        objects: [{ id: 'o-5', name: 'Co-Working Area' }],
        addons: [{ addon_id: 'a-1', addons: { id: 'a-1', name: 'Kaffee-Flatrate' } }],
        staff: []
    },
    {
        id: 's-7', name: 'Video Dreh', service_type: 'appointment', price: 349, duration_minutes: 180, status: 'active',
        objects: [{ id: 'o-1', name: 'Studio Nordlicht' }],
        addons: [{ addon_id: 'a-5', addons: { id: 'a-5', name: 'Bildbearbeitung' } }, { addon_id: 'a-6', addons: { id: 'a-6', name: 'Drohnen-Aufnahme' } }],
        staff: [{ staff_id: 'st-4', staff: { id: 'st-4', name: 'Mira Stein' } }]
    },
    {
        id: 's-8', name: 'Strategieberatung', service_type: 'appointment', price: 199, duration_minutes: 90, status: 'active',
        objects: [{ id: 'o-2', name: 'Meetingraum A' }, { id: 'o-6', name: 'Meetingraum B' }],
        addons: [],
        staff: [{ staff_id: 'st-2', staff: { id: 'st-2', name: 'Tom Berg' } }]
    },
    {
        id: 's-9', name: 'Voice-Over Recording', service_type: 'appointment', price: 129, duration_minutes: 60, status: 'active',
        objects: [{ id: 'o-3', name: 'Podcast Studio' }],
        addons: [],
        staff: [{ staff_id: 'st-3', staff: { id: 'st-3', name: 'Lisa Neumann' } }]
    },
    {
        id: 's-10', name: 'Workshop Raum', service_type: 'rental', price: 199, duration_minutes: 240, status: 'active',
        objects: [{ id: 'o-4', name: 'Event Space' }],
        addons: [{ addon_id: 'a-2', addons: { id: 'a-2', name: 'Beamer' } }, { addon_id: 'a-3', addons: { id: 'a-3', name: 'Catering Lunch' } }],
        staff: []
    },
    {
        id: 's-11', name: 'Wochenpass', service_type: 'ticket', price: 119, duration_minutes: 2400, status: 'active',
        objects: [{ id: 'o-5', name: 'Co-Working Area' }],
        addons: [{ addon_id: 'a-1', addons: { id: 'a-1', name: 'Kaffee-Flatrate' } }],
        staff: []
    },
    {
        id: 's-12', name: 'Dunkelkammer Miete', service_type: 'rental', price: 39, duration_minutes: 120, status: 'draft',
        objects: [{ id: 'o-8', name: 'Dunkelkammer' }],
        addons: [],
        staff: []
    }
];

// ── Staff ────────────────────────────────────────────────────────────────────

const STAFF = [
    {
        id: 'st-1', name: 'Sarah Kraft', status: 'active', email: 'sarah@example.com',
        bookable_days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
        linked_services: [{ service_id: 's-1', services: { id: 's-1', name: 'Portrait Shooting' } }, { service_id: 's-2', services: { id: 's-2', name: 'Produkt Fotografie' } }]
    },
    {
        id: 'st-2', name: 'Tom Berg', status: 'active', email: 'tom@example.com',
        bookable_days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
        linked_services: [{ service_id: 's-3', services: { id: 's-3', name: 'Team Workshop' } }, { service_id: 's-5', services: { id: 's-5', name: 'Event Miete' } }, { service_id: 's-8', services: { id: 's-8', name: 'Strategieberatung' } }]
    },
    {
        id: 'st-3', name: 'Lisa Neumann', status: 'active', email: 'lisa@example.com',
        bookable_days: ['Mo', 'Mi', 'Fr'],
        linked_services: [{ service_id: 's-4', services: { id: 's-4', name: 'Podcast Aufnahme' } }, { service_id: 's-9', services: { id: 's-9', name: 'Voice-Over Recording' } }]
    },
    {
        id: 'st-4', name: 'Mira Stein', status: 'active', email: 'mira@example.com',
        bookable_days: ['Di', 'Mi', 'Do', 'Fr', 'Sa'],
        linked_services: [{ service_id: 's-1', services: { id: 's-1', name: 'Portrait Shooting' } }, { service_id: 's-7', services: { id: 's-7', name: 'Video Dreh' } }]
    },
    {
        id: 'st-5', name: 'Jan Richter', status: 'active', email: 'jan@example.com',
        bookable_days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        linked_services: [{ service_id: 's-5', services: { id: 's-5', name: 'Event Miete' } }, { service_id: 's-10', services: { id: 's-10', name: 'Workshop Raum' } }]
    },
    {
        id: 'st-6', name: 'Nina Weiß', status: 'invited', email: 'nina@example.com',
        bookable_days: [],
        linked_services: []
    }
];

// ── Addons ───────────────────────────────────────────────────────────────────

const ADDONS = [
    {
        id: 'a-1', name: 'Kaffee-Flatrate', price: 9, pricing_type: 'flat', status: 'active',
        description: 'Unbegrenzt Kaffee, Tee und Wasser während der Buchung.',
        linked_services: [{ service_id: 's-1', services: { id: 's-1', name: 'Portrait Shooting' } }, { service_id: 's-4', services: { id: 's-4', name: 'Podcast Aufnahme' } }, { service_id: 's-6', services: { id: 's-6', name: 'Tagespass' } }]
    },
    {
        id: 'a-2', name: 'Beamer', price: 15, pricing_type: 'per_booking', status: 'active',
        description: 'Full-HD Beamer mit HDMI und USB-C Anschluss.',
        linked_services: [{ service_id: 's-3', services: { id: 's-3', name: 'Team Workshop' } }, { service_id: 's-5', services: { id: 's-5', name: 'Event Miete' } }, { service_id: 's-10', services: { id: 's-10', name: 'Workshop Raum' } }]
    },
    {
        id: 'a-3', name: 'Catering Lunch', price: 25, pricing_type: 'per_person', status: 'active',
        description: 'Frisches Mittagessen-Buffet inkl. vegetarischer Option.',
        linked_services: [{ service_id: 's-3', services: { id: 's-3', name: 'Team Workshop' } }, { service_id: 's-5', services: { id: 's-5', name: 'Event Miete' } }]
    },
    {
        id: 'a-4', name: 'Parkplatz', price: 12, pricing_type: 'per_booking', status: 'active',
        description: 'Reservierter Stellplatz in der Tiefgarage.',
        linked_services: [{ service_id: 's-5', services: { id: 's-5', name: 'Event Miete' } }]
    },
    {
        id: 'a-5', name: 'Bildbearbeitung', price: 49, pricing_type: 'per_booking', status: 'active',
        description: 'Professionelle Nachbearbeitung aller Bilder innerhalb von 48h.',
        linked_services: [{ service_id: 's-1', services: { id: 's-1', name: 'Portrait Shooting' } }, { service_id: 's-2', services: { id: 's-2', name: 'Produkt Fotografie' } }, { service_id: 's-7', services: { id: 's-7', name: 'Video Dreh' } }]
    },
    {
        id: 'a-6', name: 'Drohnen-Aufnahme', price: 89, pricing_type: 'per_booking', status: 'active',
        description: 'Luftaufnahmen mit DJI Mavic 3 Pro (nur bei gutem Wetter).',
        linked_services: [{ service_id: 's-7', services: { id: 's-7', name: 'Video Dreh' } }]
    }
];

// ── Bookings (35+) ──────────────────────────────────────────────────────────

const BOOKINGS = [
    // --- Heute ---
    {
        id: 'b-101', booking_number: 1047, customer_name: 'Lena Müller', customer_email: 'lena.m@example.com', customer_phone: '+49 171 1234567',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Portrait Shooting', service_type: 'appointment', price: 149 },
        start_time: iso(0, 14, 0), end_time: iso(0, 15, 30), total_price: 198, service_price: 149,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-2, 9, 14), invoice_number: 1047,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }],
        booking_staff: [{ staff_id: 'st-1', staff: { name: 'Sarah Kraft' } }]
    },
    {
        id: 'b-102', booking_number: 1048, customer_name: 'Max Mustermann', customer_email: 'max.m@example.com', customer_phone: '+49 170 9876543',
        objects: { name: 'Meetingraum A' }, services: { name: 'Team Workshop', service_type: 'appointment', price: 299 },
        start_time: iso(0, 9, 0), end_time: iso(0, 12, 0), total_price: 339, service_price: 299,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-5, 16, 30), invoice_number: 1048,
        booking_addons: [{ addon_id: 'a-2', quantity: 1, price_per_unit: 15, total_price: 15, addons: { name: 'Beamer' } }, { addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 25, addons: { name: 'Catering Lunch' } }],
        booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },
    {
        id: 'b-103', booking_number: 1049, customer_name: 'Julia Weber', customer_email: 'julia.w@example.com', customer_phone: '+49 176 5551234',
        objects: { name: 'Podcast Studio' }, services: { name: 'Podcast Aufnahme', service_type: 'appointment', price: 89 },
        start_time: iso(0, 10, 0), end_time: iso(0, 11, 0), total_price: 98, service_price: 89,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-3, 11, 0), invoice_number: 1049,
        booking_addons: [{ addon_id: 'a-1', quantity: 1, price_per_unit: 9, total_price: 9, addons: { name: 'Kaffee-Flatrate' } }],
        booking_staff: [{ staff_id: 'st-3', staff: { name: 'Lisa Neumann' } }]
    },
    {
        id: 'b-104', booking_number: 1050, customer_name: 'Oliver Braun', customer_email: 'oliver.b@example.com', customer_phone: '+49 151 7778899',
        objects: { name: 'Co-Working Area' }, services: { name: 'Tagespass', service_type: 'ticket', price: 29 },
        start_time: iso(0, 8, 0), end_time: iso(0, 18, 0), total_price: 29, service_price: 29,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 20, 15), invoice_number: 1050,
        booking_addons: [], booking_staff: []
    },

    // --- Morgen ---
    {
        id: 'b-105', booking_number: 1051, customer_name: 'Sophie Fischer', customer_email: 'sophie.f@example.com', customer_phone: '+49 172 3344556',
        objects: { name: 'Event Space' }, services: { name: 'Event Miete', service_type: 'rental', price: 450 },
        start_time: iso(1, 18, 0), end_time: iso(1, 22, 0), total_price: 537, service_price: 450,
        status: 'pending_approval', payment_status: 'unpaid', created_at: iso(0, 8, 45), invoice_number: 1051,
        booking_addons: [{ addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 75, addons: { name: 'Catering Lunch' } }, { addon_id: 'a-4', quantity: 1, price_per_unit: 12, total_price: 12, addons: { name: 'Parkplatz' } }],
        booking_staff: [{ staff_id: 'st-5', staff: { name: 'Jan Richter' } }]
    },
    {
        id: 'b-106', booking_number: 1052, customer_name: 'Anna Schmidt', customer_email: 'anna.s@example.com', customer_phone: '+49 160 1122334',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Produkt Fotografie', service_type: 'appointment', price: 249 },
        start_time: iso(1, 10, 0), end_time: iso(1, 12, 0), total_price: 298, service_price: 249,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 14, 20), invoice_number: 1052,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }],
        booking_staff: [{ staff_id: 'st-1', staff: { name: 'Sarah Kraft' } }]
    },
    {
        id: 'b-107', booking_number: 1053, customer_name: 'Tim Krause', customer_email: 'tim.k@example.com', customer_phone: '+49 157 6677889',
        objects: { name: 'Meetingraum B' }, services: { name: 'Strategieberatung', service_type: 'appointment', price: 199 },
        start_time: iso(1, 14, 0), end_time: iso(1, 15, 30), total_price: 199, service_price: 199,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 10, 5), invoice_number: 1053,
        booking_addons: [], booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },

    // --- Nächste Tage ---
    {
        id: 'b-108', booking_number: 1054, customer_name: 'Petra Hoffmann', customer_email: 'petra.h@example.com', customer_phone: '+49 173 9988776',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Video Dreh', service_type: 'appointment', price: 349 },
        start_time: iso(2, 9, 0), end_time: iso(2, 12, 0), total_price: 487, service_price: 349,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-3, 13, 45), invoice_number: 1054,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }, { addon_id: 'a-6', quantity: 1, price_per_unit: 89, total_price: 89, addons: { name: 'Drohnen-Aufnahme' } }],
        booking_staff: [{ staff_id: 'st-4', staff: { name: 'Mira Stein' } }]
    },
    {
        id: 'b-109', booking_number: 1055, customer_name: 'Markus Lang', customer_email: 'markus.l@example.com', customer_phone: '+49 176 2233445',
        objects: { name: 'Co-Working Area' }, services: { name: 'Wochenpass', service_type: 'ticket', price: 119 },
        start_time: iso(2, 8, 0), end_time: iso(6, 18, 0), total_price: 128, service_price: 119,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 18, 0), invoice_number: 1055,
        booking_addons: [{ addon_id: 'a-1', quantity: 1, price_per_unit: 9, total_price: 9, addons: { name: 'Kaffee-Flatrate' } }],
        booking_staff: []
    },
    {
        id: 'b-110', booking_number: 1056, customer_name: 'Sandra Koch', customer_email: 'sandra.k@example.com', customer_phone: '+49 162 5566778',
        objects: { name: 'Podcast Studio' }, services: { name: 'Voice-Over Recording', service_type: 'appointment', price: 129 },
        start_time: iso(3, 11, 0), end_time: iso(3, 12, 0), total_price: 129, service_price: 129,
        status: 'pending_approval', payment_status: 'unpaid', created_at: iso(0, 7, 30), invoice_number: 1056,
        booking_addons: [], booking_staff: [{ staff_id: 'st-3', staff: { name: 'Lisa Neumann' } }]
    },
    {
        id: 'b-111', booking_number: 1057, customer_name: 'Christian Bauer', customer_email: 'christian.b@example.com', customer_phone: '+49 175 1144225',
        objects: { name: 'Event Space' }, services: { name: 'Workshop Raum', service_type: 'rental', price: 199 },
        start_time: iso(4, 9, 0), end_time: iso(4, 13, 0), total_price: 239, service_price: 199,
        status: 'pending_approval', payment_status: 'unpaid', created_at: iso(0, 11, 15), invoice_number: 1057,
        booking_addons: [{ addon_id: 'a-2', quantity: 1, price_per_unit: 15, total_price: 15, addons: { name: 'Beamer' } }, { addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 25, addons: { name: 'Catering Lunch' } }],
        booking_staff: []
    },
    {
        id: 'b-112', booking_number: 1058, customer_name: 'Monika Lehmann', customer_email: 'monika.l@example.com', customer_phone: '+49 171 8899001',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Portrait Shooting', service_type: 'appointment', price: 149 },
        start_time: iso(5, 15, 0), end_time: iso(5, 16, 30), total_price: 149, service_price: 149,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-2, 17, 0), invoice_number: 1058,
        booking_addons: [], booking_staff: [{ staff_id: 'st-4', staff: { name: 'Mira Stein' } }]
    },
    {
        id: 'b-113', booking_number: 1059, customer_name: 'Felix Wagner', customer_email: 'felix.w@example.com', customer_phone: '+49 152 3344556',
        objects: { name: 'Dachterrasse' }, services: { name: 'Event Miete', service_type: 'rental', price: 450 },
        start_time: iso(7, 17, 0), end_time: iso(7, 22, 0), total_price: 462, service_price: 450,
        status: 'pending', payment_status: 'unpaid', created_at: iso(0, 6, 0), invoice_number: 1059,
        booking_addons: [{ addon_id: 'a-4', quantity: 1, price_per_unit: 12, total_price: 12, addons: { name: 'Parkplatz' } }],
        booking_staff: [{ staff_id: 'st-5', staff: { name: 'Jan Richter' } }]
    },
    {
        id: 'b-114', booking_number: 1060, customer_name: 'Lena Müller', customer_email: 'lena.m@example.com', customer_phone: '+49 171 1234567',
        objects: { name: 'Podcast Studio' }, services: { name: 'Podcast Aufnahme', service_type: 'appointment', price: 89 },
        start_time: iso(6, 14, 0), end_time: iso(6, 15, 0), total_price: 89, service_price: 89,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 12, 0), invoice_number: 1060,
        booking_addons: [], booking_staff: [{ staff_id: 'st-3', staff: { name: 'Lisa Neumann' } }]
    },

    // --- Vergangene Buchungen (completed) ---
    {
        id: 'b-115', booking_number: 1030, customer_name: 'Klaus Wagner', customer_email: 'klaus.w@example.com', customer_phone: '+49 170 4455667',
        objects: { name: 'Co-Working Area' }, services: { name: 'Tagespass', service_type: 'ticket', price: 29 },
        start_time: iso(-1, 8, 0), end_time: iso(-1, 18, 0), total_price: 29, service_price: 29,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-3, 10, 0), invoice_number: 1030,
        booking_addons: [], booking_staff: []
    },
    {
        id: 'b-116', booking_number: 1031, customer_name: 'Firma GreenTech GmbH', customer_email: 'kontakt@greentech.de', customer_phone: '030 9876543',
        objects: { name: 'Meetingraum A' }, services: { name: 'Team Workshop', service_type: 'appointment', price: 299 },
        start_time: iso(-2, 9, 0), end_time: iso(-2, 12, 0), total_price: 339, service_price: 299,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-7, 14, 0), invoice_number: 1031,
        booking_addons: [{ addon_id: 'a-2', quantity: 1, price_per_unit: 15, total_price: 15, addons: { name: 'Beamer' } }, { addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 25, addons: { name: 'Catering Lunch' } }],
        booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },
    {
        id: 'b-117', booking_number: 1032, customer_name: 'Lena Müller', customer_email: 'lena.m@example.com', customer_phone: '+49 171 1234567',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Produkt Fotografie', service_type: 'appointment', price: 249 },
        start_time: iso(-3, 10, 0), end_time: iso(-3, 12, 0), total_price: 298, service_price: 249,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-8, 9, 30), invoice_number: 1032,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }],
        booking_staff: [{ staff_id: 'st-1', staff: { name: 'Sarah Kraft' } }]
    },
    {
        id: 'b-118', booking_number: 1033, customer_name: 'Anna Schmidt', customer_email: 'anna.s@example.com', customer_phone: '+49 160 1122334',
        objects: { name: 'Event Space' }, services: { name: 'Event Miete', service_type: 'rental', price: 450 },
        start_time: iso(-4, 18, 0), end_time: iso(-4, 22, 0), total_price: 487, service_price: 450,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-10, 11, 0), invoice_number: 1033,
        booking_addons: [{ addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 25, addons: { name: 'Catering Lunch' } }, { addon_id: 'a-4', quantity: 1, price_per_unit: 12, total_price: 12, addons: { name: 'Parkplatz' } }],
        booking_staff: [{ staff_id: 'st-5', staff: { name: 'Jan Richter' } }]
    },
    {
        id: 'b-119', booking_number: 1034, customer_name: 'Max Mustermann', customer_email: 'max.m@example.com', customer_phone: '+49 170 9876543',
        objects: { name: 'Podcast Studio' }, services: { name: 'Podcast Aufnahme', service_type: 'appointment', price: 89 },
        start_time: iso(-5, 15, 0), end_time: iso(-5, 16, 0), total_price: 89, service_price: 89,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-9, 8, 45), invoice_number: 1034,
        booking_addons: [], booking_staff: [{ staff_id: 'st-3', staff: { name: 'Lisa Neumann' } }]
    },
    {
        id: 'b-120', booking_number: 1035, customer_name: 'Petra Hoffmann', customer_email: 'petra.h@example.com', customer_phone: '+49 173 9988776',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Portrait Shooting', service_type: 'appointment', price: 149 },
        start_time: iso(-5, 10, 0), end_time: iso(-5, 11, 30), total_price: 198, service_price: 149,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-10, 15, 0), invoice_number: 1035,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }],
        booking_staff: [{ staff_id: 'st-4', staff: { name: 'Mira Stein' } }]
    },
    {
        id: 'b-121', booking_number: 1036, customer_name: 'Tim Krause', customer_email: 'tim.k@example.com', customer_phone: '+49 157 6677889',
        objects: { name: 'Meetingraum B' }, services: { name: 'Strategieberatung', service_type: 'appointment', price: 199 },
        start_time: iso(-6, 14, 0), end_time: iso(-6, 15, 30), total_price: 199, service_price: 199,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-12, 9, 0), invoice_number: 1036,
        booking_addons: [], booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },
    {
        id: 'b-122', booking_number: 1037, customer_name: 'Firma GreenTech GmbH', customer_email: 'kontakt@greentech.de', customer_phone: '030 9876543',
        objects: { name: 'Co-Working Area' }, services: { name: 'Wochenpass', service_type: 'ticket', price: 119 },
        start_time: iso(-12, 8, 0), end_time: iso(-8, 18, 0), total_price: 128, service_price: 119,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-14, 10, 0), invoice_number: 1037,
        booking_addons: [{ addon_id: 'a-1', quantity: 1, price_per_unit: 9, total_price: 9, addons: { name: 'Kaffee-Flatrate' } }],
        booking_staff: []
    },
    {
        id: 'b-123', booking_number: 1038, customer_name: 'Sandra Koch', customer_email: 'sandra.k@example.com', customer_phone: '+49 162 5566778',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Video Dreh', service_type: 'appointment', price: 349 },
        start_time: iso(-7, 9, 0), end_time: iso(-7, 12, 0), total_price: 398, service_price: 349,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-14, 16, 0), invoice_number: 1038,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }],
        booking_staff: [{ staff_id: 'st-4', staff: { name: 'Mira Stein' } }]
    },
    {
        id: 'b-124', booking_number: 1039, customer_name: 'Oliver Braun', customer_email: 'oliver.b@example.com', customer_phone: '+49 151 7778899',
        objects: { name: 'Co-Working Area' }, services: { name: 'Tagespass', service_type: 'ticket', price: 29 },
        start_time: iso(-8, 8, 0), end_time: iso(-8, 18, 0), total_price: 38, service_price: 29,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-10, 22, 0), invoice_number: 1039,
        booking_addons: [{ addon_id: 'a-1', quantity: 1, price_per_unit: 9, total_price: 9, addons: { name: 'Kaffee-Flatrate' } }],
        booking_staff: []
    },
    {
        id: 'b-125', booking_number: 1040, customer_name: 'Firma GreenTech GmbH', customer_email: 'kontakt@greentech.de', customer_phone: '030 9876543',
        objects: { name: 'Meetingraum A' }, services: { name: 'Team Workshop', service_type: 'appointment', price: 299 },
        start_time: iso(-9, 9, 0), end_time: iso(-9, 12, 0), total_price: 299, service_price: 299,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-15, 11, 0), invoice_number: 1040,
        booking_addons: [], booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },
    {
        id: 'b-126', booking_number: 1041, customer_name: 'Monika Lehmann', customer_email: 'monika.l@example.com', customer_phone: '+49 171 8899001',
        objects: { name: 'Podcast Studio' }, services: { name: 'Podcast Aufnahme', service_type: 'appointment', price: 89 },
        start_time: iso(-10, 10, 0), end_time: iso(-10, 11, 0), total_price: 89, service_price: 89,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-16, 13, 0), invoice_number: 1041,
        booking_addons: [], booking_staff: [{ staff_id: 'st-3', staff: { name: 'Lisa Neumann' } }]
    },
    {
        id: 'b-127', booking_number: 1042, customer_name: 'Julia Weber', customer_email: 'julia.w@example.com', customer_phone: '+49 176 5551234',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Portrait Shooting', service_type: 'appointment', price: 149 },
        start_time: iso(-11, 14, 0), end_time: iso(-11, 15, 30), total_price: 149, service_price: 149,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-18, 17, 0), invoice_number: 1042,
        booking_addons: [], booking_staff: [{ staff_id: 'st-1', staff: { name: 'Sarah Kraft' } }]
    },
    {
        id: 'b-128', booking_number: 1043, customer_name: 'Markus Lang', customer_email: 'markus.l@example.com', customer_phone: '+49 176 2233445',
        objects: { name: 'Meetingraum A' }, services: { name: 'Strategieberatung', service_type: 'appointment', price: 199 },
        start_time: iso(-12, 14, 0), end_time: iso(-12, 15, 30), total_price: 199, service_price: 199,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-18, 9, 0), invoice_number: 1043,
        booking_addons: [], booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },

    // --- Storniert / Abgelehnt ---
    {
        id: 'b-129', booking_number: 1044, customer_name: 'Robert Schwarz', customer_email: 'robert.s@example.com', customer_phone: '+49 155 6677001',
        objects: { name: 'Event Space' }, services: { name: 'Event Miete', service_type: 'rental', price: 450 },
        start_time: iso(-3, 18, 0), end_time: iso(-3, 22, 0), total_price: 450, service_price: 450,
        status: 'cancelled', payment_status: 'refunded', created_at: iso(-14, 8, 0), invoice_number: 1044,
        booking_addons: [], booking_staff: [{ staff_id: 'st-5', staff: { name: 'Jan Richter' } }]
    },
    {
        id: 'b-130', booking_number: 1045, customer_name: 'Laura Engel', customer_email: 'laura.e@example.com', customer_phone: '+49 163 5544332',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Portrait Shooting', service_type: 'appointment', price: 149 },
        start_time: iso(-2, 10, 0), end_time: iso(-2, 11, 30), total_price: 149, service_price: 149,
        status: 'rejected', payment_status: 'unpaid', created_at: iso(-6, 19, 0), invoice_number: 1045,
        booking_addons: [], booking_staff: []
    },
    {
        id: 'b-131', booking_number: 1046, customer_name: 'Firma Digital GmbH', customer_email: 'hello@digital-gmbh.de', customer_phone: '040 1234567',
        objects: { name: 'Meetingraum A' }, services: { name: 'Team Workshop', service_type: 'appointment', price: 299 },
        start_time: iso(-6, 9, 0), end_time: iso(-6, 12, 0), total_price: 299, service_price: 299,
        status: 'cancelled', payment_status: 'refunded', created_at: iso(-12, 14, 0), invoice_number: 1046,
        booking_addons: [], booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    },

    // --- Weitere Zukunfts-Buchungen ---
    {
        id: 'b-132', booking_number: 1061, customer_name: 'Firma GreenTech GmbH', customer_email: 'kontakt@greentech.de', customer_phone: '030 9876543',
        objects: { name: 'Event Space' }, services: { name: 'Workshop Raum', service_type: 'rental', price: 199 },
        start_time: iso(8, 9, 0), end_time: iso(8, 13, 0), total_price: 239, service_price: 199,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 9, 0), invoice_number: 1061,
        booking_addons: [{ addon_id: 'a-2', quantity: 1, price_per_unit: 15, total_price: 15, addons: { name: 'Beamer' } }, { addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 25, addons: { name: 'Catering Lunch' } }],
        booking_staff: []
    },
    {
        id: 'b-133', booking_number: 1062, customer_name: 'Oliver Braun', customer_email: 'oliver.b@example.com', customer_phone: '+49 151 7778899',
        objects: { name: 'Co-Working Area' }, services: { name: 'Wochenpass', service_type: 'ticket', price: 119 },
        start_time: iso(9, 8, 0), end_time: iso(13, 18, 0), total_price: 119, service_price: 119,
        status: 'confirmed', payment_status: 'paid', created_at: iso(0, 12, 0), invoice_number: 1062,
        booking_addons: [], booking_staff: []
    },
    {
        id: 'b-134', booking_number: 1063, customer_name: 'Julia Weber', customer_email: 'julia.w@example.com', customer_phone: '+49 176 5551234',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Video Dreh', service_type: 'appointment', price: 349 },
        start_time: iso(10, 10, 0), end_time: iso(10, 13, 0), total_price: 438, service_price: 349,
        status: 'pending', payment_status: 'unpaid', created_at: iso(0, 15, 0), invoice_number: 1063,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }, { addon_id: 'a-6', quantity: 1, price_per_unit: 89, total_price: 89, addons: { name: 'Drohnen-Aufnahme' } }],
        booking_staff: [{ staff_id: 'st-4', staff: { name: 'Mira Stein' } }]
    },
    {
        id: 'b-135', booking_number: 1064, customer_name: 'Anna Schmidt', customer_email: 'anna.s@example.com', customer_phone: '+49 160 1122334',
        objects: { name: 'Podcast Studio' }, services: { name: 'Podcast Aufnahme', service_type: 'appointment', price: 89 },
        start_time: iso(11, 11, 0), end_time: iso(11, 12, 0), total_price: 98, service_price: 89,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 16, 0), invoice_number: 1064,
        booking_addons: [{ addon_id: 'a-1', quantity: 1, price_per_unit: 9, total_price: 9, addons: { name: 'Kaffee-Flatrate' } }],
        booking_staff: [{ staff_id: 'st-3', staff: { name: 'Lisa Neumann' } }]
    },
    {
        id: 'b-136', booking_number: 1065, customer_name: 'Firma Digital GmbH', customer_email: 'hello@digital-gmbh.de', customer_phone: '040 1234567',
        objects: { name: 'Dachterrasse' }, services: { name: 'Event Miete', service_type: 'rental', price: 450 },
        start_time: iso(14, 16, 0), end_time: iso(14, 21, 0), total_price: 537, service_price: 450,
        status: 'pending_approval', payment_status: 'unpaid', created_at: iso(0, 10, 0), invoice_number: 1065,
        booking_addons: [{ addon_id: 'a-3', quantity: 1, price_per_unit: 25, total_price: 75, addons: { name: 'Catering Lunch' } }, { addon_id: 'a-4', quantity: 1, price_per_unit: 12, total_price: 12, addons: { name: 'Parkplatz' } }],
        booking_staff: [{ staff_id: 'st-5', staff: { name: 'Jan Richter' } }]
    },
    {
        id: 'b-137', booking_number: 1066, customer_name: 'Lena Müller', customer_email: 'lena.m@example.com', customer_phone: '+49 171 1234567',
        objects: { name: 'Studio Nordlicht' }, services: { name: 'Portrait Shooting', service_type: 'appointment', price: 149 },
        start_time: iso(12, 14, 0), end_time: iso(12, 15, 30), total_price: 198, service_price: 149,
        status: 'confirmed', payment_status: 'paid', created_at: iso(-1, 8, 0), invoice_number: 1066,
        booking_addons: [{ addon_id: 'a-5', quantity: 1, price_per_unit: 49, total_price: 49, addons: { name: 'Bildbearbeitung' } }],
        booking_staff: [{ staff_id: 'st-1', staff: { name: 'Sarah Kraft' } }]
    },

    // --- No-Show ---
    {
        id: 'b-138', booking_number: 1029, customer_name: 'Thomas Meier', customer_email: 'thomas.m@example.com', customer_phone: '+49 156 4433221',
        objects: { name: 'Meetingraum B' }, services: { name: 'Strategieberatung', service_type: 'appointment', price: 199 },
        start_time: iso(-7, 10, 0), end_time: iso(-7, 11, 30), total_price: 199, service_price: 199,
        status: 'no_show', payment_status: 'paid', created_at: iso(-14, 14, 0), invoice_number: 1029,
        booking_addons: [], booking_staff: [{ staff_id: 'st-2', staff: { name: 'Tom Berg' } }]
    }
];

// ── Customers (aggregated from bookings) ────────────────────────────────────

const CUSTOMERS = [
    { customer_name: 'Lena Müller', customer_email: 'lena.m@example.com', customer_phone: '+49 171 1234567', booking_count: 5, last_booking: iso(0, 14, 0) },
    { customer_name: 'Max Mustermann', customer_email: 'max.m@example.com', customer_phone: '+49 170 9876543', booking_count: 3, last_booking: iso(0, 9, 0) },
    { customer_name: 'Julia Weber', customer_email: 'julia.w@example.com', customer_phone: '+49 176 5551234', booking_count: 3, last_booking: iso(10, 10, 0) },
    { customer_name: 'Firma GreenTech GmbH', customer_email: 'kontakt@greentech.de', customer_phone: '030 9876543', booking_count: 4, last_booking: iso(8, 9, 0) },
    { customer_name: 'Anna Schmidt', customer_email: 'anna.s@example.com', customer_phone: '+49 160 1122334', booking_count: 3, last_booking: iso(11, 11, 0) },
    { customer_name: 'Oliver Braun', customer_email: 'oliver.b@example.com', customer_phone: '+49 151 7778899', booking_count: 3, last_booking: iso(9, 8, 0) },
    { customer_name: 'Petra Hoffmann', customer_email: 'petra.h@example.com', customer_phone: '+49 173 9988776', booking_count: 2, last_booking: iso(2, 9, 0) },
    { customer_name: 'Tim Krause', customer_email: 'tim.k@example.com', customer_phone: '+49 157 6677889', booking_count: 2, last_booking: iso(1, 14, 0) },
    { customer_name: 'Sophie Fischer', customer_email: 'sophie.f@example.com', customer_phone: '+49 172 3344556', booking_count: 1, last_booking: iso(1, 18, 0) },
    { customer_name: 'Sandra Koch', customer_email: 'sandra.k@example.com', customer_phone: '+49 162 5566778', booking_count: 2, last_booking: iso(3, 11, 0) },
    { customer_name: 'Markus Lang', customer_email: 'markus.l@example.com', customer_phone: '+49 176 2233445', booking_count: 2, last_booking: iso(2, 8, 0) },
    { customer_name: 'Christian Bauer', customer_email: 'christian.b@example.com', customer_phone: '+49 175 1144225', booking_count: 1, last_booking: iso(4, 9, 0) },
    { customer_name: 'Monika Lehmann', customer_email: 'monika.l@example.com', customer_phone: '+49 171 8899001', booking_count: 2, last_booking: iso(5, 15, 0) },
    { customer_name: 'Felix Wagner', customer_email: 'felix.w@example.com', customer_phone: '+49 152 3344556', booking_count: 1, last_booking: iso(7, 17, 0) },
    { customer_name: 'Klaus Wagner', customer_email: 'klaus.w@example.com', customer_phone: '+49 170 4455667', booking_count: 1, last_booking: iso(-1, 8, 0) },
    { customer_name: 'Firma Digital GmbH', customer_email: 'hello@digital-gmbh.de', customer_phone: '040 1234567', booking_count: 2, last_booking: iso(14, 16, 0) },
    { customer_name: 'Robert Schwarz', customer_email: 'robert.s@example.com', customer_phone: '+49 155 6677001', booking_count: 1, last_booking: iso(-3, 18, 0) },
    { customer_name: 'Laura Engel', customer_email: 'laura.e@example.com', customer_phone: '+49 163 5544332', booking_count: 1, last_booking: iso(-2, 10, 0) },
    { customer_name: 'Thomas Meier', customer_email: 'thomas.m@example.com', customer_phone: '+49 156 4433221', booking_count: 1, last_booking: iso(-7, 10, 0) }
];

// ── Vouchers ─────────────────────────────────────────────────────────────────

const VOUCHERS = [
    {
        id: 'v-1', name: 'Willkommensrabatt', code: 'WELCOME20', discount_type: 'percentage', discount_value: 20,
        status: 'active', valid_until: dateOnly(60), max_uses_total: 50, times_used: 18,
        linked_services: [{ service_id: 's-1', services: { id: 's-1', name: 'Portrait Shooting' } }, { service_id: 's-4', services: { id: 's-4', name: 'Podcast Aufnahme' } }]
    },
    {
        id: 'v-2', name: 'Sommer-Special', code: 'SUMMER10', discount_type: 'fixed', discount_value: 10,
        status: 'expired', valid_until: dateOnly(-30), max_uses_total: null, times_used: 34,
        linked_services: []
    },
    {
        id: 'v-3', name: 'Team Event Rabatt', code: 'TEAM15', discount_type: 'percentage', discount_value: 15,
        status: 'active', valid_until: dateOnly(90), max_uses_total: 30, times_used: 7,
        linked_services: [{ service_id: 's-3', services: { id: 's-3', name: 'Team Workshop' } }, { service_id: 's-5', services: { id: 's-5', name: 'Event Miete' } }]
    },
    {
        id: 'v-4', name: 'Treue-Gutschein', code: 'LOYAL25', discount_type: 'fixed', discount_value: 25,
        status: 'active', valid_until: dateOnly(180), max_uses_total: 100, times_used: 42,
        linked_services: []
    },
    {
        id: 'v-5', name: 'Black Friday', code: 'BF2025', discount_type: 'percentage', discount_value: 30,
        status: 'expired', valid_until: dateOnly(-90), max_uses_total: 200, times_used: 187,
        linked_services: []
    }
];

// ── Vacations ────────────────────────────────────────────────────────────────

const VACATIONS = [
    {
        id: 'vac-1', start_date: dateOnly(14), end_date: dateOnly(28), scope: 'workspace',
        description: 'Betriebsferien Ostern',
        objects: null, staff: null, services: null
    },
    {
        id: 'vac-2', start_date: dateOnly(5), end_date: dateOnly(8), scope: 'staff',
        description: 'Kurzurlaub',
        objects: null, staff: { id: 'st-1', name: 'Sarah Kraft' }, services: null
    },
    {
        id: 'vac-3', start_date: dateOnly(10), end_date: dateOnly(12), scope: 'object',
        description: 'Renovierungsarbeiten',
        objects: { id: 'o-3', name: 'Podcast Studio' }, staff: null, services: null
    },
    {
        id: 'vac-4', start_date: dateOnly(30), end_date: dateOnly(35), scope: 'staff',
        description: 'Fortbildung Videografie',
        objects: null, staff: { id: 'st-4', name: 'Mira Stein' }, services: null
    },
    {
        id: 'vac-5', start_date: dateOnly(-5), end_date: dateOnly(-2), scope: 'object',
        description: 'Wartung Klimaanlage',
        objects: { id: 'o-4', name: 'Event Space' }, staff: null, services: null
    }
];

// ── Sites ────────────────────────────────────────────────────────────────────

const SITES = [
    { id: 'site-1', name: 'Hauptseite', domain: 'studio-nordlicht.de', url: 'https://studio-nordlicht.de', is_active: true },
    { id: 'site-2', name: 'Staging', domain: 'staging.studio-nordlicht.de', url: 'https://staging.studio-nordlicht.de', is_active: false }
];

// ── Email Templates ──────────────────────────────────────────────────────────

const EMAIL_TEMPLATES = [
    { id: 'tmpl-1', template_type: 'booking_confirmation', subject: 'Ihre Buchung wurde bestätigt' },
    { id: 'tmpl-2', template_type: 'booking_reminder', subject: 'Erinnerung: Ihre Buchung ist morgen' },
    { id: 'tmpl-3', template_type: 'booking_cancelled', subject: 'Ihre Buchung wurde storniert' },
    { id: 'tmpl-4', template_type: 'payment_received', subject: 'Zahlung erhalten – Vielen Dank!' }
];

// ── Demo Workspace ───────────────────────────────────────────────────────────

export const DEMO_WORKSPACE = {
    id: 'demo-workspace',
    name: 'Studio Nordlicht',
    company_name: 'Studio Nordlicht GmbH',
    company_address: 'Kastanienallee 42',
    company_zip: '10435',
    company_city: 'Berlin',
    company_country: 'Deutschland',
    tax_id: 'DE312456789',
    iban: 'DE89 3704 0044 0532 0130 00',
    bank_name: 'Commerzbank',
    tax_rate: 19,
    stripe_connected_account_id: 'acct_demo_1234',
    payout_status: 'active'
};

// ── Insights Mock Data ───────────────────────────────────────────────────────

const generateInsightsChartData = () => {
    const labels = [];
    const conversionData = [];
    const cancellationData = [];
    const visitorData = [];
    const successTrend = [];

    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
        labels.push(label);

        const baseViews = 30 + Math.floor(Math.random() * 25);
        const weekday = d.getDay();
        const weekdayFactor = (weekday === 0 || weekday === 6) ? 0.5 : 1;
        const views = Math.round(baseViews * weekdayFactor);

        visitorData.push({ label, value: views });
        conversionData.push({ label, value: Math.round((22 + Math.random() * 14) * 10) / 10 });
        cancellationData.push({ label, value: Math.round((2 + Math.random() * 6) * 10) / 10 });
        successTrend.push({ label, value: Math.round(88 + Math.random() * 10) });
    }

    return { conversionData, cancellationData, visitorData, successTrend };
};

const chartData = generateInsightsChartData();

export const DEMO_INSIGHTS = {
    kpis: {
        widgetViews: 1247,
        widgetViewsUnique: 982,
        revenue: 14860,
        bookings: 347,
        bookingsUnique: 298,
        cancellationRate: 4.2
    },
    funnel: {
        widgetLoaded: { total: 1247, unique: 982 },
        bookingStarted: { total: 584, unique: 471 },
        checkoutStarted: { total: 412, unique: 358 },
        paymentCompleted: { total: 347, unique: 298 }
    },
    charts: {
        conversion: chartData.conversionData,
        cancellation: chartData.cancellationData
    },
    traffic: {
        dailyVisitors: chartData.visitorData,
        browsers: [
            { name: 'Chrome', count: 512 },
            { name: 'Safari', count: 289 },
            { name: 'Firefox', count: 98 },
            { name: 'Edge', count: 64 },
            { name: 'Samsung Internet', count: 19 }
        ],
        os: [
            { name: 'macOS', count: 402 },
            { name: 'Windows', count: 287 },
            { name: 'iOS', count: 198 },
            { name: 'Android', count: 82 },
            { name: 'Linux', count: 13 }
        ],
        devices: [
            { name: 'Desktop', count: 689 },
            { name: 'Mobile', count: 258 },
            { name: 'Tablet', count: 35 }
        ],
        countries: [
            { name: 'Deutschland', count: 812 },
            { name: 'Österreich', count: 89 },
            { name: 'Schweiz', count: 54 },
            { name: 'Niederlande', count: 14 },
            { name: 'UK', count: 13 }
        ],
        cities: [
            { name: 'Berlin', count: 423 },
            { name: 'Hamburg', count: 98 },
            { name: 'München', count: 87 },
            { name: 'Köln', count: 56 },
            { name: 'Wien', count: 48 },
            { name: 'Frankfurt', count: 42 },
            { name: 'Zürich', count: 31 }
        ]
    },
    payments: {
        checkoutStarted: 412,
        paymentCompleted: 347,
        successRate: 84.2,
        refundRate: 2.1,
        successTrend: chartData.successTrend
    },
    changes: {
        widgetViews: 13.4,
        revenue: 8.7,
        bookings: 11.2,
        cancellationRate: -1.8
    }
};

// ── Export ────────────────────────────────────────────────────────────────────

export const DEMO_DATA = {
    bookings: BOOKINGS,
    objects: OBJECTS,
    services: SERVICES,
    staff: STAFF,
    addons: ADDONS,
    customers: CUSTOMERS,
    vouchers: VOUCHERS,
    vacations: VACATIONS,
    sites: SITES,
    email_templates: EMAIL_TEMPLATES,
    settings: []
};
