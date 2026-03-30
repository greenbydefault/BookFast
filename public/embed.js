(function () {
    const script = document.currentScript;
    const siteId = script?.getAttribute('data-site-id');
    if (!siteId) {
        console.warn('[BookFast embed] Missing data-site-id on script tag.');
        return;
    }

    const API = '__SUPABASE_URL__';
    const KEY = '__SUPABASE_ANON_KEY__';
    const HDR = { 'Content-Type': 'application/json', 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };
    const SESSION_KEY = `bf_session_${siteId}`;
    const sessionId = (() => {
        try { const stored = localStorage.getItem(SESSION_KEY); if (stored) return stored; } catch { }
        const id = crypto.randomUUID();
        try { localStorage.setItem(SESSION_KEY, id); } catch { }
        return id;
    })();
    // Ping sofort beim Load – Domain-Verknuepfung braucht kein Root-Element
    fetch(`${API}/rest/v1/rpc/ping_site`, {
        method: 'POST', keepalive: true, headers: HDR,
        body: JSON.stringify({ site_id: siteId, p_domain: location.hostname })
    }).catch(() => {});

    const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const DAYS_FULL = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    // --- UA einmal parsen, gecachtes Metadata-Objekt ---
    const ua = navigator.userAgent;
    const _meta = {
        browser: /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : /Firefox/.test(ua) ? 'Firefox' : 'Other',
        device: /Mobile|Android/.test(ua) ? 'Mobile' : 'Desktop',
        os: /Win/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : 'Other'
    };

    let root, state = {
        step: 1,
        data: { objects: [], services: [], addons: [], staff: [] },
        sel: { fname: '', lname: '', email: '', phone: '', address: '', city: '', zip: '', object: null, service: null, startDate: null, endDate: null, time: null, addons: [], staff: null, guestCount: 1 },
        cal: { month: new Date(), avail: null, selectingEnd: false },
        slots: [],
        availStatus: null,
        voucher: { code: '', data: null, status: null, error: null }
    };
    let initialized = false;
    let initInFlight = false;
    let hasBoundHandlers = false;
    let initObserver = null;
    let initRetryTimer = null;

    // --- RPC: nur fuer Business-Logic (Buchung, Verfuegbarkeit, Voucher) ---
    const rpc = async (fn, p = {}) => {
        try {
            const r = await fetch(`${API}/rest/v1/rpc/${fn}`, { method: 'POST', headers: HDR, body: JSON.stringify(p) });
            return r.ok ? await r.json() : null;
        } catch { return null; }
    };

    const safeMetadata = (m = {}) => {
        const merged = { ..._meta, ...m };
        const json = JSON.stringify(merged);
        if (json.length <= 2048) return merged;
        return { ..._meta, note: 'metadata_truncated' };
    };

    // --- Tracking: fire-and-forget, keepalive, nie awaiten ---
    const track = (e, m) => {
        fetch(`${API}/rest/v1/rpc/track_event`, {
            method: 'POST', keepalive: true, headers: HDR,
            body: JSON.stringify({ p_site_id: siteId, p_event_type: e, p_session_id: sessionId, p_metadata: safeMetadata(m) })
        }).catch(() => { });
    };

    // Track mit expliziter Session-ID (fuer Stripe-Rueckkehr)
    const trackWithSid = (sid, e, m) => {
        fetch(`${API}/rest/v1/rpc/track_event`, {
            method: 'POST', keepalive: true, headers: HDR,
            body: JSON.stringify({ p_site_id: siteId, p_event_type: e, p_session_id: sid, p_metadata: safeMetadata(m) })
        }).catch(() => { });
    };

    // --- Datum-Utilities ---
    const parseLocal = s => {
        if (!s) return null;
        if (s instanceof Date) return s;
        const [y, m, d] = String(s).split('-').map(Number);
        return new Date(y, m - 1, d);
    };
    const fmtDate = d => {
        if (!d) return '';
        const dt = d instanceof Date ? d : parseLocal(d);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    };
    const fmtDisplay = d => {
        if (!d) return '';
        const dt = parseLocal(d);
        return `${dt.getDate()}. ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
    };
    const dayOfWeek = d => { const dt = parseLocal(d); const day = dt.getDay(); return day === 0 ? 6 : day - 1; };
    const isPast = d => parseLocal(d) < new Date(new Date().setHours(0, 0, 0, 0));
    const sameDay = (a, b) => a && b && fmtDate(a) === fmtDate(b);
    const inRange = (d, s, e) => s && e && parseLocal(d).getTime() > parseLocal(s).getTime() && parseLocal(d).getTime() < parseLocal(e).getTime();
    const nights = (s, e) => s && e ? Math.round((parseLocal(e) - parseLocal(s)) / 864e5) : 0;
    const parseTime = t => {
        if (!t) return 0;
        const parts = t.split(':').map(Number);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
    };
    const fmtTime = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const normDate = d => { if (!d) return ''; const s = typeof d === 'string' ? d : d.toISOString?.() || String(d); return s.slice(0, 10); };

    // --- Slot-Generierung (Kaskade: Service > Objekt, custom_hours > booking_window) ---
    const genSlots = (svc, obj, booked = [], dateStr = null) => {
        if (!svc || svc.service_type !== 'hourly') return [];
        const ds = dateStr || state.sel.startDate;
        const dayAbbr = ds ? DAYS[dayOfWeek(ds)] : null;
        const svcCustom = dayAbbr && svc.custom_hours?.length ? svc.custom_hours.find(h => h.days?.includes(dayAbbr)) : null;
        const objCustom = dayAbbr && !svcCustom && obj?.custom_hours?.length ? obj.custom_hours.find(h => h.days?.includes(dayAbbr)) : null;
        const customH = svcCustom || objCustom;
        const start = parseTime(customH?.from || svc.booking_window_start || obj?.booking_window_start || '09:00');
        const end = parseTime(customH?.to || svc.booking_window_end || obj?.booking_window_end || '18:00');
        const dur = svc.duration_minutes || 60;
        const step = svc.fixed_start_times ? dur + (svc.buffer_after_minutes || 0) : 30;
        const slots = [];
        const bufB = svc.buffer_before_minutes || 0;
        const bufA = svc.buffer_after_minutes || 0;
        for (let c = start; c + dur <= end; c += step) {
            const slotStart = c - bufB;
            const slotEnd = c + dur + bufA;
            const isBooked = booked.some(b => {
                const bStart = parseTime(b.start_time);
                let bEnd = parseTime(b.end_time);
                // Handle past midnight (e.g. 00:00 becomes 24:00)
                if (bEnd <= bStart && bEnd === 0) bEnd = 24 * 60;

                return !(slotEnd <= bStart || slotStart >= bEnd);
            });
            slots.push({ start: fmtTime(c), available: !isBooked });
        }
        return slots;
    };

    const bookable = (d, svc, obj) => {
        if (!svc || !obj || isPast(d)) return false;
        const wd = DAYS_FULL[dayOfWeek(d)];
        const check = arr => !arr?.length || arr.some(x => x.toLowerCase() === wd || x === DAYS[dayOfWeek(d)]);
        const staff = state.sel.staff ? state.data.staff.find(s => s.id === state.sel.staff) : null;
        if (staff?.bookable_days) {
            const dayKey = wd.slice(0, 3);
            if (staff.bookable_days[dayKey] === false) return false;
        } else if (svc.bookable_days?.length) {
            if (!check(svc.bookable_days)) return false;
        } else {
            if (!check(obj.bookable_days)) return false;
        }
        if (svc.min_advance_hours > 0 && new Date(d) < new Date(Date.now() + svc.min_advance_hours * 36e5)) return false;
        return true;
    };

    const hasAvailableSlots = (ds) => {
        const svc = state.sel.service, obj = state.sel.object;
        if (!svc || svc.service_type !== 'hourly') return true;
        const bookings = state.cal.avail?.bookings?.filter(b => normDate(b?.date) === ds) || [];
        const slots = genSlots(svc, obj, bookings, ds);
        return slots.some(s => s.available);
    };

    // --- CSS: Split-Screen Layout + Pseudo-Klassen ---
    const css = () => {
        if (document.getElementById('bf-css')) return;
        const s = document.createElement('style'); s.id = 'bf-css';
        s.textContent = [
            // Split-Screen Layout
            '.bf-split{display:flex;min-height:600px}',
            '.bf-split-left{flex:1;border-right:1px solid #e7e5e4;display:flex;flex-direction:column;overflow-y:auto}',
            '.bf-split-right{flex:1;display:flex;flex-direction:column;padding:24px;opacity:.5;pointer-events:none;transition:opacity .3s}',
            '.bf-split-right.is-active{opacity:1;pointer-events:auto}',
            '.bf-split-header{padding:24px 24px 0;display:flex;flex-direction:column;gap:12px}',
            '.bf-split-header-name{font-size:20px;font-weight:400;color:#000;line-height:1}',
            '.bf-split-header-sub{font-size:16px;font-weight:400;color:#717079;line-height:1.2}',
            '.bf-split-cards{padding:24px;display:flex;flex-direction:column;gap:24px;flex:1}',
            // Accordion Cards
            '.bf-split-card{border:1px solid #e7e5e4;border-radius:8px;transition:border-color .2s}',
            '.bf-split-card.is-open{border-color:#624cd8}',
            '.bf-split-card-header{display:flex;align-items:flex-start;gap:12px;padding:16px 16px 16px 16px;cursor:pointer;width:100%;border:0;background:transparent;text-align:left}',
            '.bf-split-card-num{min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid #e7e5e4;border-radius:4px;font-size:16px;font-weight:500;color:#12111f;flex-shrink:0}',
            '.bf-split-card-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}',
            '.bf-split-card-title{font-size:16px;font-weight:500;color:#12111f;line-height:1.2}',
            '.bf-split-card-desc{font-size:16px;font-weight:400;color:#78716c;line-height:1.2}',
            '.bf-split-card-arrow{width:24px;height:24px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:transform .2s}',
            '.bf-split-card.is-open .bf-split-card-arrow{transform:rotate(180deg)}',
            '.bf-split-card-body{display:none;padding:0 16px 16px}',
            '.bf-split-card.is-open .bf-split-card-body{display:block}',
            // Object list items
            '.bf-obj-item{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:8px;cursor:pointer;transition:background .15s;width:100%;border:0;background:transparent;text-align:left}',
            '.bf-obj-item:hover{background:rgba(0,0,0,.03)}',
            '.bf-obj-item.is-selected{background:#f8f7fe;box-shadow:inset 0 0 0 1px #624cd8}',
            '.bf-obj-info{flex:1;min-width:0}',
            '.bf-obj-name{font-size:16px;font-weight:600;color:#12111f;line-height:1.3}',
            '.bf-obj-desc{font-size:14px;font-weight:400;color:#78716c;line-height:1.4;margin-top:2px}',
            '.bf-obj-meta{display:flex;align-items:center;gap:6px;flex-shrink:0}',
            '.bf-obj-cap{display:flex;align-items:center;gap:4px;font-size:14px;color:#717079;border:1px solid #e7e5e4;border-radius:6px;padding:4px 8px}',
            '.bf-obj-check{display:none;color:#624cd8;flex-shrink:0}',
            '.bf-obj-item.is-selected .bf-obj-check{display:block}',
            // Service list items
            '.bf-svc-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;cursor:pointer;transition:background .15s;width:100%;border:0;background:transparent;text-align:left}',
            '.bf-svc-item:hover{background:rgba(0,0,0,.03)}',
            '.bf-svc-item.is-selected{background:#f8f7fe;box-shadow:inset 0 0 0 1px #624cd8}',
            '.bf-svc-info{flex:1;min-width:0}',
            '.bf-svc-name{font-size:16px;font-weight:600;color:#12111f;line-height:1.3}',
            '.bf-svc-time{font-size:14px;font-weight:400;color:#78716c;line-height:1.4;margin-top:2px}',
            '.bf-svc-badges{display:flex;align-items:center;gap:8px;flex-shrink:0}',
            '.bf-svc-badge{display:flex;align-items:center;gap:4px;font-size:14px;color:#717079;border:1px solid #e7e5e4;border-radius:6px;padding:4px 8px;white-space:nowrap}',
            // Staff chips
            '.bf-staff-chips{display:flex;flex-wrap:wrap;gap:8px}',
            '.bf-staff-chip{display:inline-flex;align-items:center;padding:8px 16px;border:1px solid #e7e5e4;border-radius:999px;font-size:14px;font-weight:400;color:#12111f;cursor:pointer;transition:border-color .15s,background .15s;background:#fff}',
            '.bf-staff-chip:hover{border-color:#a8a29e}',
            '.bf-staff-chip.is-selected{border-color:#624cd8;background:#f8f7fe;font-weight:500}',
            // Calendar (Split-Screen version)
            '.bf-split-cal-header{display:flex;align-items:center;gap:4px;margin-bottom:40px}',
            '.bf-split-cal-title{flex:1;display:flex;gap:4px;font-size:20px;font-weight:400}',
            '.bf-split-cal-title-month{color:#12111f}',
            '.bf-split-cal-title-year{color:#41414c}',
            '.bf-split-cal-nav{background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:4px}',
            '.bf-split-cal-nav:hover{background:rgba(0,0,0,.05)}',
            '.bf-split-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}',
            '.bf-split-cal-weekday{padding:24px 0;font-size:20px;font-weight:400;color:#12111f}',
            '.bf-split-cal-day{padding:24px 0;font-size:20px;font-weight:400;color:#717079;border:none;background:none;cursor:pointer;border-radius:12px;transition:background .15s}',
            '.bf-split-cal-day:hover:not(:disabled){background:rgba(0,0,0,.04)}',
            '.bf-split-cal-day:disabled{cursor:default;opacity:.3}',
            '.bf-split-cal-day.is-other{visibility:hidden}',
            '.bf-split-cal-day.is-selected{background:#f8f7fe;font-weight:600;color:#12111f}',
            '.bf-split-cal-day.is-range{background:rgba(248,247,254,.5)}',
            '.bf-split-cal-day.is-today{box-shadow:inset 0 0 0 2px currentColor;border-radius:12px}',
            // Time slots (Split-Screen version)
            '.bf-split-time{border-top:1px solid #e7e5e4;padding-top:24px;margin-top:auto}',
            '.bf-split-time-title{font-size:18px;font-weight:400;color:#12111f;line-height:1.2;margin-bottom:12px}',
            '.bf-split-time-desc{font-size:16px;font-weight:400;color:#717079;line-height:1.2;margin-bottom:24px}',
            '.bf-split-time-hint{font-size:16px;font-weight:400;color:#a8a29e;line-height:1.4}',
            '.bf-split-slots{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}',
            '.bf-split-slot{display:flex;align-items:center;justify-content:center;gap:4px;height:60px;border:1px solid #e7e5e4;border-radius:8px;font-size:16px;font-weight:400;color:#000;background:#fff;cursor:pointer;transition:border-color .15s,background .15s}',
            '.bf-split-slot:hover:not(:disabled){background:rgba(0,0,0,.03)}',
            '.bf-split-slot:disabled{opacity:.5;cursor:default}',
            '.bf-split-slot.is-selected{border-color:#624cd8;background:#f8f7fe;font-weight:500}',
            '.bf-split-slot-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}',
            '.bf-split-slot-dot.is-available{background:#16a34a}',
            '.bf-split-slot-dot.is-unavailable{background:#d6d3d1}',
            // Footer
            '.bf-split-footer{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:18px 24px;border-top:1px solid #e7e5e4;border-radius:0 0 12px 12px;background:#fff}',
            '.bf-split-btn-back{display:inline-flex;align-items:center;justify-content:center;padding:12px;border:1px solid #d6d3d1;border-radius:8px;background:#fff;color:#12111f;font-size:16px;font-weight:400;cursor:pointer;text-decoration:none;line-height:1.2}',
            '.bf-split-btn-back:hover{background:#fafaf9}',
            '.bf-split-btn-next{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-width:46px;min-height:34px;padding:8px 12px;border:none;border-radius:8px;background:#7660f1;color:#f8f7fe;font-size:16px;font-weight:500;cursor:pointer;text-decoration:none;line-height:1.2}',
            '.bf-split-btn-next:hover{background:#624cd8}',
            // Legacy overrides
            '.bf-day:hover:not(:disabled){background:rgba(0,0,0,.06)}',
            '.bf-day:disabled{cursor:default}',
            '.bf-slot:hover:not(:disabled){background:rgba(0,0,0,.05)}',
            '.bf-cal-nav:hover{background:rgba(0,0,0,.05)}',
            '.bf-addon-header input{margin:0}',
            '.bf-variant-radios label{display:block;padding:.125rem 0;font-size:.85rem;cursor:pointer}',
            '.bf-variant-radios input{margin-right:.375rem}',
            '.bf-guest-block:first-child{border-top:none;padding-top:0}',
            '[data-bf-status="available"]{color:#16a34a}',
            '[data-bf-status="unavailable"]{color:#dc2626}',
            '[data-bf-status="checking"]{opacity:.6}',
            // Responsive: stack on mobile
            '@media(max-width:768px){.bf-split{flex-direction:column}.bf-split-left{border-right:none;border-bottom:1px solid #e7e5e4}.bf-split-slots{grid-template-columns:repeat(3,1fr)}}',
        ].join('');
        document.head.appendChild(s);
    };

    // --- SVG Icons ---
    const SVG_ARROW = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
    const SVG_CHECK = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 10 8 14 16 6"/></svg>';
    const SVG_PEOPLE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    const SVG_CLOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    const SVG_CHEVRON_LEFT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    const SVG_CHEVRON_RIGHT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

    // --- Accordion Card Logic ---
    const setCardOpenState = (card, isOpen) => {
        if (!card) return;
        card.classList.toggle('is-open', !!isOpen);
        const header = card.querySelector('.bf-split-card-header');
        const panel = card.querySelector('.bf-split-card-body');
        if (header) header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (panel) panel.hidden = !isOpen;
    };

    const expandCard = (cardName) => {
        const card = root?.querySelector(`[data-bf-card="${cardName}"]`);
        setCardOpenState(card, true);
    };

    const toggleCard = (cardName) => {
        const card = root?.querySelector(`[data-bf-card="${cardName}"]`);
        if (!card) return;
        setCardOpenState(card, !card.classList.contains('is-open'));
    };

    const updateCardSummary = (cardName, titleText, descText) => {
        const card = root?.querySelector(`[data-bf-card="${cardName}"]`);
        if (!card) return;
        const titleEl = card.querySelector('.bf-split-card-title');
        const descEl = card.querySelector('.bf-split-card-desc');
        if (titleEl && titleText) titleEl.textContent = titleText;
        if (descEl) descEl.textContent = descText || '';
    };

    const activateRightSide = () => {
        const right = root?.querySelector('.bf-split-right');
        if (right) right.classList.add('is-active');
    };

    const deactivateRightSide = () => {
        const right = root?.querySelector('.bf-split-right');
        if (right) right.classList.remove('is-active');
    };

    // --- DOM-Helpers ---
    const $ = s => root?.querySelector(s);
    const $$ = s => root?.querySelectorAll(s) || [];
    const getStepEntries = () => Array.from($$('[data-bf-step]'))
        .map(el => ({ id: String(el.dataset.bfStep || ''), el }))
        .filter(x => x.id && x.id !== 'success')
        .sort((a, b) => Number(a.id) - Number(b.id));

    const ensureProgress = () => {
        if ($('[data-bf-step-progress]')) return;
        const steps = getStepEntries().filter(x => /^\d+$/.test(x.id));
        if (!steps.length) return;
        const progress = document.createElement('ol');
        progress.className = 'bf-step-progress';
        progress.setAttribute('data-bf-step-progress', 'true');

        steps.forEach(({ id, el }) => {
            const titleEl = el.querySelector('h1,h2,h3,h4,[data-bf-step-title]');
            const item = document.createElement('li');
            item.className = 'bf-step-progress-item';
            item.setAttribute('data-step', id);
            item.setAttribute('data-bf-progress-step', id);
            item.textContent = titleEl?.textContent?.trim() || `Schritt ${id}`;
            progress.appendChild(item);
        });

        root.prepend(progress);
    };

    const setInitError = (message) => {
        let err = $('[data-bf-init-error]');
        if (!err) {
            err = document.createElement('div');
            err.className = 'bf-init-error';
            err.setAttribute('data-bf-init-error', 'true');
            err.setAttribute('role', 'alert');
            err.style.marginBottom = '.75rem';
            err.style.padding = '.6rem .75rem';
            err.style.border = '.0625rem solid #fecaca';
            err.style.background = '#fef2f2';
            err.style.color = '#991b1b';
            err.style.borderRadius = '.375rem';
            root.prepend(err);
        }
        err.textContent = message;
        err.style.display = 'block';
    };

    const clearInitError = () => {
        const err = $('[data-bf-init-error]');
        if (err) err.style.display = 'none';
    };

    const updateProgress = () => {
        const current = Number(state.step);
        $$('[data-bf-progress-step]').forEach(item => {
            const stepNo = Number(item.getAttribute('data-bf-progress-step'));
            item.classList.remove('is-current', 'is-complete');

            if (state.step === 'success') {
                item.classList.add('is-complete');
                return;
            }

            if (!Number.isNaN(current) && stepNo < current) item.classList.add('is-complete');
            if (!Number.isNaN(current) && stepNo === current) item.classList.add('is-current');
        });
    };

    const show = n => {
        const target = String(n);
        const steps = $$('[data-bf-step]');
        if (!steps.length) return;
        const exists = Array.from(steps).some(e => e.dataset.bfStep === target);
        const next = exists ? target : '1';
        state.step = next;
        steps.forEach(e => { e.style.display = e.dataset.bfStep === next ? '' : 'none'; });
        updateProgress();
        if (next === '1') {
            const hasCards = root?.querySelector('[data-bf-card]');
            if (hasCards && !state.sel.object) expandCard('object');
            if (hasCards) renumberSplitCards();
        }
    };

    const isStepEmpty = (stepId) => {
        const stepEl = $(`[data-bf-step="${stepId}"]`);
        if (!stepEl) return false;

        const hasObjects = stepEl.querySelector('[data-bf-dynamic="objects"]') || stepEl.querySelector('[data-bf-field="object"]');
        const hasServices = stepEl.querySelector('[data-bf-dynamic="services"]');
        const hasCalendar = stepEl.querySelector('[data-bf-dynamic="calendar"]');
        const hasAddons = stepEl.querySelector('[data-bf-dynamic="addons"]');
        const hasStaff = stepEl.querySelector('[data-bf-dynamic="staff"]');
        const hasSummary = stepEl.querySelector('[data-bf-dynamic="summary"]');

        const isOnlyStaffOrAddons = (hasStaff || hasAddons) && !hasObjects && !hasServices && !hasCalendar && !hasSummary;
        if (!isOnlyStaffOrAddons) return false;

        let emptyContents = 0;
        let totalContents = 0;

        if (hasStaff) {
            totalContents++;
            const svc = state.sel.service;
            const staff = state.data.staff.filter(s => s.linked_service_ids?.includes(svc?.id));
            if (!staff.length) emptyContents++;
        }

        if (hasAddons) {
            totalContents++;
            const adds = state.data.addons.filter(a => a.linked_service_ids?.includes(state.sel.service?.id));
            if (!adds.length) emptyContents++;
        }

        return totalContents > 0 && emptyContents === totalContents;
    };

    const getNextValidStep = (stepId, direction) => {
        let currentId = String(stepId);
        const visited = new Set();
        while (currentId && !visited.has(currentId)) {
            visited.add(currentId);
            const stepEl = $(`[data-bf-step="${currentId}"]`);
            if (!stepEl) break;

            if (!isStepEmpty(currentId)) {
                return currentId;
            }

            const btn = stepEl.querySelector(`[data-bf-action="${direction}"]`);
            if (btn && btn.dataset.bfGoto) {
                currentId = String(btn.dataset.bfGoto);
            } else {
                break;
            }
        }
        return currentId;
    };

    const field = n => $(`[data-bf-field="${n}"]`);
    const dyn = n => $(`[data-bf-dynamic="${n}"]`);
    const disp = n => $(`[data-bf-display="${n}"]`);
    const tpl = (container, key) => container?.querySelector(`[data-bf-template="${key}"]`);
    const empty = (container, key) => container?.querySelector(`[data-bf-empty="${key}"]`);
    const clearGenerated = (container) => container?.querySelectorAll('[data-bf-generated="true"]').forEach(el => el.remove());
    const showTemplate = (container, key, visible) => {
        const el = tpl(container, key);
        if (el) el.style.display = visible ? '' : 'none';
    };
    const showEmpty = (container, key, visible) => {
        const el = empty(container, key);
        if (el) el.style.display = visible ? '' : 'none';
    };
    const appendGenerated = (container, el) => {
        if (!container || !el) return;
        el.setAttribute('data-bf-generated', 'true');
        container.appendChild(el);
    };
    const isVisibleCard = (card) => {
        if (!card) return false;
        if (card.style.display === 'none') return false;
        return card.getClientRects().length > 0;
    };
    const renumberSplitCards = () => {
        if (!isSplitMode()) return;
        const visibleCards = Array.from($$('[data-bf-card]')).filter(isVisibleCard);
        visibleCards.forEach((card, idx) => {
            const numEl = card.querySelector('.bf-split-card-num');
            if (numEl) numEl.textContent = String(idx + 1);
        });
    };

    const updateGuestCountUI = () => {
        const count = state.sel.guestCount;
        const max = state.sel.object?.capacity || 99;
        const countEl = disp('guest-count');
        const maxEl = disp('guest-max');
        const minus = $('[data-bf-action="gc-minus"]');
        const plus = $('[data-bf-action="gc-plus"]');

        if (countEl) countEl.textContent = String(count);
        if (maxEl) maxEl.textContent = max < 99 ? ` (Max: ${max})` : '';

        const setDisabledState = (el, disabled) => {
            if (!el) return;
            el.setAttribute('aria-disabled', disabled ? 'true' : 'false');
            el.style.pointerEvents = disabled ? 'none' : '';
            el.style.opacity = disabled ? '.5' : '';
        };

        setDisabledState(minus, count <= 1);
        setDisabledState(plus, count >= max);
    };

    // --- UI-Population ---
    const popObjects = () => {
        // Split mode: render clickable object rows
        const dynEl = dyn('objects');
        if (dynEl && isSplitMode()) {
            const objs = state.data.objects;
            clearGenerated(dynEl);
            showTemplate(dynEl, 'object-item', !objs.length);
            showEmpty(dynEl, 'objects', !objs.length);
            objs.forEach(o => {
                const row = document.createElement('button');
                const isSel = state.sel.object?.id === o.id;
                row.type = 'button';
                row.className = `bf-obj-item${isSel ? ' is-selected' : ''}`;
                row.setAttribute('data-obj-id', o.id);
                row.innerHTML = `<div class="bf-obj-info"><div class="bf-obj-name"></div><div class="bf-obj-desc"></div></div><div class="bf-obj-meta"><span class="bf-obj-check">${SVG_CHECK}</span><span class="bf-obj-cap"></span></div>`;
                row.querySelector('.bf-obj-name').textContent = o.name || '';
                const desc = row.querySelector('.bf-obj-desc');
                if (o.description) {
                    desc.textContent = o.description;
                    desc.style.display = '';
                } else {
                    desc.style.display = 'none';
                }
                const cap = row.querySelector('.bf-obj-cap');
                if (o.capacity) {
                    cap.innerHTML = `${SVG_PEOPLE} ${o.capacity}`;
                    cap.style.display = '';
                } else {
                    cap.style.display = 'none';
                }
                row.onclick = () => {
                    state.sel.object = o;
                    state.sel.service = state.sel.startDate = state.sel.endDate = state.sel.time = null;
                    state.sel.staff = undefined;
                    state.slots = [];
                    state.availStatus = null;
                    deactivateRightSide();
                    updateCardSummary('object', o.name, o.address || o.description || '');
                    popObjects();
                    expandCard('service');
                    popServices();
                };
                appendGenerated(dynEl, row);
            });
            renumberSplitCards();
            return;
        }
        // Legacy mode: select dropdown
        const sel = field('object');
        if (!sel) return;
        while (sel.options.length > 1) sel.remove(1);
        state.data.objects.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.id;
            opt.textContent = o.name + (o.capacity ? ` (max. ${o.capacity})` : '');
            sel.appendChild(opt);
        });
    };

    const popServices = () => {
        const c = dyn('services');
        if (!c) return;
        const svcs = state.data.services.filter(s => s.object_id === state.sel.object?.id);
        if (isSplitMode()) {
            clearGenerated(c);
            showTemplate(c, 'service-item', !svcs.length);
            showEmpty(c, 'services', !svcs.length);
            svcs.forEach(s => {
                const row = document.createElement('button');
                const isSel = state.sel.service?.id === s.id;
                const timeStr = s.booking_window_start && s.booking_window_end ? `${s.booking_window_start}-${s.booking_window_end} Uhr` : (s.service_type === 'overnight' ? 'Uebernachtung' : '');
                row.type = 'button';
                row.className = `bf-svc-item${isSel ? ' is-selected' : ''}`;
                row.setAttribute('data-svc-id', s.id);
                row.innerHTML = '<div class="bf-svc-info"><div class="bf-svc-name"></div><div class="bf-svc-time"></div></div><div class="bf-svc-badges"></div>';
                row.querySelector('.bf-svc-name').textContent = s.name || '';
                const timeEl = row.querySelector('.bf-svc-time');
                if (timeStr) {
                    timeEl.textContent = timeStr;
                    timeEl.style.display = '';
                } else {
                    timeEl.style.display = 'none';
                }
                const badges = row.querySelector('.bf-svc-badges');
                if (s.duration_minutes) {
                    const dur = document.createElement('span');
                    dur.className = 'bf-svc-badge';
                    dur.innerHTML = `${SVG_CLOCK} ${s.duration_minutes >= 60 ? (s.duration_minutes / 60) : s.duration_minutes}${s.duration_minutes >= 60 ? '' : ' min'}`;
                    badges.appendChild(dur);
                }
                const price = document.createElement('span');
                price.className = 'bf-svc-badge';
                price.textContent = `EUR${s.price}${s.service_type === 'overnight' ? '/N' : ' p.p'}`;
                badges.appendChild(price);
                row.onclick = () => selService(s.id);
                appendGenerated(c, row);
            });
            renumberSplitCards();
        } else {
            c.innerHTML = svcs.length ? svcs.map(s => `<label class="bf-radio"><input type="radio" name="bf-service" value="${s.id}"${state.sel.service?.id === s.id ? ' checked' : ''}><span><strong>${s.name}</strong> — €${s.price}${s.duration_minutes ? ` · ${s.duration_minutes}min` : ''}${s.service_type === 'overnight' ? '/Nacht' : ''}</span></label>`).join('') : '<p>Keine Services verfügbar.</p>';
            c.querySelectorAll('input[name="bf-service"]').forEach(r => r.onchange = () => selService(r.value));
        }
    };

    const popStaff = () => {
        const c = dyn('staff');
        if (!c) return;
        const svc = state.sel.service;
        const staff = state.data.staff.filter(s => s.linked_service_ids?.includes(svc?.id));
        if (!staff.length) {
            c.style.display = 'none';
            state.sel.staff = null;
            if (isSplitMode()) {
                const staffCard = root?.querySelector('[data-bf-card="staff"]');
                if (staffCard) staffCard.style.display = 'none';
                renumberSplitCards();
            }
            return;
        }
        c.style.display = 'block';
        if (isSplitMode()) {
            const staffCard = root?.querySelector('[data-bf-card="staff"]');
            if (staffCard) staffCard.style.display = '';
            const isAny = state.sel.staff === null || state.sel.staff === undefined;
            clearGenerated(c);
            showTemplate(c, 'staff-item', false);
            showEmpty(c, 'staff', false);
            const chips = document.createElement('div');
            chips.className = 'bf-staff-chips';
            chips.setAttribute('data-bf-generated', 'true');
            const anyBtn = document.createElement('button');
            anyBtn.type = 'button';
            anyBtn.className = `bf-staff-chip${isAny ? ' is-selected' : ''}`;
            anyBtn.setAttribute('data-staff-id', '');
            anyBtn.textContent = 'Naechstverfuegbaren';
            anyBtn.onclick = () => selStaff(null);
            chips.appendChild(anyBtn);
            staff.forEach(s => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `bf-staff-chip${state.sel.staff === s.id ? ' is-selected' : ''}`;
                btn.setAttribute('data-staff-id', s.id);
                btn.textContent = s.name;
                btn.onclick = () => selStaff(s.id);
                chips.appendChild(btn);
            });
            c.appendChild(chips);
            renumberSplitCards();
            return;
        }

        const staffListEl = c.querySelector('[data-bf-dynamic="staff-list"]');
        const hasTemplateStaff = !!c.querySelector('[data-bf-static="staff-heading"]');

        if (hasTemplateStaff && staffListEl) {
            const anyInput = c.querySelector('[data-bf-static="staff-any"] input');
            if (anyInput) anyInput.checked = state.sel.staff === null;
            staffListEl.innerHTML = staff.map(s => `<label class="bf-radio"><input type="radio" name="bf-staff" value="${s.id}"${state.sel.staff === s.id ? ' checked' : ''}><span>${s.name}</span></label>`).join('');
        } else {
            c.innerHTML = `<p><strong>Mitarbeiter</strong></p><label class="bf-radio"><input type="radio" name="bf-staff" value=""${state.sel.staff === null ? ' checked' : ''}><span>Egal</span></label>${staff.map(s => `<label class="bf-radio"><input type="radio" name="bf-staff" value="${s.id}"${state.sel.staff === s.id ? ' checked' : ''}><span>${s.name}</span></label>`).join('')}`;
        }
        c.querySelectorAll('input[name="bf-staff"]').forEach(r => r.onchange = () => selStaff(r.value || null));
    };

    const popCal = () => {
        const c = dyn('calendar');
        if (!c || !state.sel.service || !state.sel.object) {
            if (c) {
                clearGenerated(c);
                showTemplate(c, 'calendar-header', true);
                showTemplate(c, 'calendar-day', true);
                showEmpty(c, 'calendar', false);
            }
            return;
        }
        const { month } = state.cal;
        const y = month.getFullYear(), m = month.getMonth();
        const first = new Date(y, m, 1);
        let start = new Date(first);
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        const days = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
        const blocked = state.cal.avail?.blocked_dates || [];
        const today = fmtDate(new Date());
        const isON = state.sel.service?.service_type === 'overnight';

        if (isSplitMode()) {
            clearGenerated(c);
            showTemplate(c, 'calendar-header', false);
            showTemplate(c, 'calendar-day', false);
            showEmpty(c, 'calendar', false);
            const wrap = document.createElement('div');
            wrap.setAttribute('data-bf-generated', 'true');
            wrap.innerHTML = `<div class="bf-split-cal-header">
                <div class="bf-split-cal-title"><span class="bf-split-cal-title-month">${MONTHS[m]}</span><span class="bf-split-cal-title-year">${y}</span></div>
                <button type="button" class="bf-split-cal-nav" data-nav="-1">${SVG_CHEVRON_LEFT}</button>
                <button type="button" class="bf-split-cal-nav" data-nav="1">${SVG_CHEVRON_RIGHT}</button>
            </div><div class="bf-split-cal-grid">${DAYS.map(d => `<span class="bf-split-cal-weekday">${d}</span>`).join('')}${days.map(d => {
                const ds = fmtDate(d), other = d.getMonth() !== m, ok = bookable(d, state.sel.service, state.sel.object), bk = blocked.includes(ds);
                const isSel = sameDay(d, state.sel.startDate) || sameDay(d, state.sel.endDate);
                const inR = isON && inRange(d, state.sel.startDate, state.sel.endDate);
                const hasSlots = hasAvailableSlots(ds);
                const canClick = !other && ok && !bk && hasSlots;
                let cls = 'bf-split-cal-day';
                if (other) cls += ' is-other';
                if (isSel) cls += ' is-selected';
                if (inR) cls += ' is-range';
                if (ds === today && !other) cls += ' is-today';
                return `<button type="button" class="${cls}"${canClick ? ` data-d="${ds}"` : ''}${!canClick && !other ? ' disabled' : ''}>${d.getDate()}</button>`;
            }).join('')}</div>`;
            c.appendChild(wrap);
        } else {
            c.innerHTML = `<div class="bf-cal"><div class="bf-cal-header"><button type="button" class="bf-cal-nav" data-nav="-1">‹ Zurück</button><span><strong>${MONTHS[m]} ${y}</strong></span><button type="button" class="bf-cal-nav" data-nav="1">Weiter ›</button></div><div class="bf-cal-grid"><div class="bf-cal-weekdays">${DAYS.map(d => `<span class="bf-cal-weekday">${d}</span>`).join('')}</div><div class="bf-cal-days">${days.map(d => {
                const ds = fmtDate(d), other = d.getMonth() !== m, ok = bookable(d, state.sel.service, state.sel.object), bk = blocked.includes(ds);
                const isSel = sameDay(d, state.sel.startDate) || sameDay(d, state.sel.endDate);
                const inR = isON && inRange(d, state.sel.startDate, state.sel.endDate);
                const hasSlots = hasAvailableSlots(ds);
                const canClick = !other && ok && !bk && hasSlots;
                let cls = 'bf-day';
                if (other) cls += ' bf-day-other';
                else if (!canClick) cls += ' bf-day-disabled';
                if (isSel) cls += ' bf-day-selected';
                if (inR) cls += ' bf-day-range';
                if (ds === today && !other) cls += ' bf-day-today';
                return `<button type="button" class="${cls}"${canClick ? ` data-d="${ds}"` : ''}${!canClick ? ' disabled' : ''}>${d.getDate()}</button>`;
            }).join('')}</div></div></div>`;
        }

        c.querySelectorAll('[data-nav]').forEach(b => b.onclick = e => { e.preventDefault(); navMonth(+b.dataset.nav); });
        c.querySelectorAll('[data-d]').forEach(d => d.onclick = () => selDate(d.dataset.d));
    };

    const popSlots = () => {
        const c = dyn('timeslots');
        if (!c) return;

        if (isSplitMode()) {
            const svc = state.sel.service;
            c.style.display = '';
            clearGenerated(c);
            showTemplate(c, 'timeslot-item', true);
            showEmpty(c, 'timeslots', false);
            let html = `<div class="bf-split-time" data-bf-generated="true"><div class="bf-split-time-title">Uhrzeit</div>`;
            if (!svc) {
                html += `<div class="bf-split-time-hint">Ich waehle zuerst Studio und Service aus, um passende Zeitslots zu sehen.</div>`;
            } else if (svc.service_type !== 'hourly') {
                html += `<div class="bf-split-time-hint">Fuer diesen Service ist keine Uhrzeit-Auswahl erforderlich.</div>`;
            } else if (!state.sel.startDate) {
                html += `<div class="bf-split-time-hint">Ich wähle zuerst das Datum aus, um einen passenden Zeitslot angezeigt zu bekommen.</div>`;
            } else if (!state.slots.length) {
                html += `<div class="bf-split-time-desc">Keine freien Termine an diesem Tag.</div>`;
                showEmpty(c, 'timeslots', true);
            } else {
                html += `<div class="bf-split-time-desc">Wähle deine passende Uhrzeit aus.</div>`;
                showTemplate(c, 'timeslot-item', false);
                html += `<div class="bf-split-slots">`;
                html += state.slots.map(s => {
                    const sel = state.sel.time === s.start;
                    const dotCls = s.available ? 'is-available' : 'is-unavailable';
                    return `<button type="button" class="bf-split-slot${sel ? ' is-selected' : ''}" data-time="${s.start}"${!s.available ? ' disabled' : ''}><span class="bf-split-slot-dot ${dotCls}"></span>${s.start}</button>`;
                }).join('');
                html += `</div>`;
            }
            html += `</div>`;
            const wrap = document.createElement('div');
            wrap.setAttribute('data-bf-generated', 'true');
            wrap.innerHTML = html;
            c.appendChild(wrap);
            c.querySelectorAll('[data-time]').forEach(b => { if (!b.disabled) b.onclick = () => selTime(b.dataset.time); });
            return;
        }

        // Legacy mode
        const hasStaticTitle = !!c.querySelector('[data-bf-static="timeslots-title"]');
        const staticEmpty = c.querySelector('[data-bf-static="slots-empty"]');
        let slotsWrap = c.querySelector('[data-bf-dynamic="timeslots-list"]');
        if (!slotsWrap) {
            slotsWrap = document.createElement('div');
            slotsWrap.setAttribute('data-bf-dynamic', 'timeslots-list');
            c.appendChild(slotsWrap);
        }
        if (!state.slots.length) {
            c.style.display = 'none';
            slotsWrap.innerHTML = '';
            if (staticEmpty) staticEmpty.style.display = 'none';
            return;
        }
        const anyAvail = state.slots.some(s => s.available);
        c.style.display = 'block';

        if (staticEmpty) {
            staticEmpty.style.display = anyAvail ? 'none' : 'block';
        }

        let html = '';
        html += state.slots.map(s => {
            const sel = state.sel.time === s.start;
            const cls = `bf-slot${s.available ? '' : ' bf-slot-disabled'}${sel ? ' bf-slot-selected' : ''}`;
            return `<button type="button" class="${cls}" data-time="${s.start}"${!s.available ? ' disabled' : ''}>${s.start}</button>`;
        }).join('');
        slotsWrap.innerHTML = html;
        slotsWrap.querySelectorAll('.bf-slot:not(:disabled)').forEach(b => b.onclick = () => selTime(b.dataset.time));
    };

    const popDateInfo = () => {
        const c = dyn('dateinfo');
        if (!c) return;
        const { service: svc, startDate: sd, endDate: ed, time } = state.sel;
        const staticText = c.querySelector('[data-bf-static="dateinfo-text"]');
        const staticAvail = c.querySelector('[data-bf-static="avail-status"]');

        if (!svc || !sd) {
            if (staticText) staticText.innerHTML = '';
            if (staticAvail) staticAvail.style.display = 'none';
            return;
        }

        const isON = svc.service_type === 'overnight', isH = svc.service_type === 'hourly', n = nights(sd, ed);
        let dateHtml = '';
        if (isON && sd && ed) dateHtml = `<p><strong>${fmtDisplay(sd)} → ${fmtDisplay(ed)}</strong><br>${n} ${n === 1 ? 'Nacht' : 'Nächte'}</p>`;
        else if (isH && sd) dateHtml = `<p><strong>${fmtDisplay(sd)}</strong>${time ? `<br>${time} Uhr (${svc.duration_minutes} Min.)` : ''}</p>`;
        else if (sd) dateHtml = `<p><strong>${fmtDisplay(sd)}</strong><br>Ganztags</p>`;

        if (staticText) staticText.innerHTML = dateHtml;
        if (staticAvail) {
            if (state.availStatus) {
                staticAvail.style.display = 'block';
                staticAvail.querySelectorAll('[data-bf-status]').forEach(el => {
                    el.style.display = el.dataset.bfStatus === state.availStatus ? 'inline' : 'none';
                });
            } else {
                staticAvail.style.display = 'none';
            }
        }
    };

    // --- Gästezahl ändern ---
    const setGuestCount = (n) => {
        const max = state.sel.object?.capacity || 99;
        state.sel.guestCount = Math.min(Math.max(1, n), max);
        // Adjust per-guest arrays for all active addons
        state.sel.addons.forEach(sel => {
            const addon = state.data.addons.find(a => a.id === sel.id);
            if (!sel.guests || addon?.applicability === 'booking') return;
            while (sel.guests.length < state.sel.guestCount) {
                sel.guests.push(buildGuestItems(addon));
            }
            sel.guests.length = state.sel.guestCount; // trim if reduced
        });
        popAddons(); popSummary();
    };

    // Build default items (booking level)
    const buildBookingItems = (addon) => {
        const items = addon?.addon_items || [];
        const result = [];
        items.forEach((ci, idx) => {
            if (ci.applicability === 'booking') {
                result[idx] = buildDefaultItem(ci);
            }
        });
        return result;
    };

    // Build default items (guest level)
    const buildGuestItems = (addon) => {
        const items = addon?.addon_items || [];
        const result = [];
        items.forEach((ci, idx) => {
            if (!ci.applicability || ci.applicability === 'guest') {
                result[idx] = buildDefaultItem(ci);
            }
        });
        return { items: result };
    };

    const buildDefaultItem = (ci) => {
        const base = {};
        if (ci.selection_mode === 'single_choice' && ci.addon_item_variants?.length) {
            base.variant = ci.addon_item_variants[0].name;
        }
        if (ci.selection_mode === 'quantity') {
            base.qty = 1;
            if (ci.addon_item_variants?.length) base.variant = ci.addon_item_variants[0].name;
        }
        return base;
    };

    const popAddons = () => {
        const c = dyn('addons');
        if (!c) return;
        const adds = state.data.addons.filter(a => a.linked_service_ids?.includes(state.sel.service?.id));
        const addonCard = root?.querySelector('[data-bf-card="addon"]');
        if (isSplitMode() && addonCard) addonCard.style.display = adds.length ? '' : 'none';
        const gc = state.sel.guestCount;
        updateGuestCountUI();
        clearGenerated(c);
        showTemplate(c, 'addon-item', false);
        showEmpty(c, 'addons', false);

        let html = '';
        if (!adds.length) {
            showTemplate(c, 'addon-item', true);
            showEmpty(c, 'addons', true);
            bindGuestCount(c);
            renumberSplitCards();
            return;
        }

        html += adds.map(a => {
            const sel = state.sel.addons.find(x => x.id === a.id);
            const isActive = !!sel;
            const items = a.addon_items || [];

            // Simple addon (no content items) - plain checkbox
            if (!items.length) {
                return `<label class="bf-checkbox"><input type="checkbox" name="bf-addon" value="${a.id}"${isActive ? ' checked' : ''}><span>${a.name} (+€${a.price})</span></label>`;
            }

            // Rich addon rendering
            let body = '';
            if (isActive) {
                const renderItemsBlock = (container, indices, itemDefs, guestIdx) => {
                    let html = '';
                    indices.forEach(ii => {
                        const item = itemDefs[ii];
                        const itemSel = container[ii] || {};
                        html += `<div class="bf-addon-item">`;
                        html += `<div class="bf-addon-item-label">${item.name || 'Artikel'}</div>`;

                        if (item.selection_mode === 'single_choice' && item.addon_item_variants?.length) {
                            html += `<select class="bf-variant-select" data-addon="${a.id}" data-guest="${guestIdx}" data-item="${ii}" style="width:100%;margin-top:.25rem">`;
                            item.addon_item_variants.forEach((v, vi) => {
                                const selected = itemSel.variant === v.name ? ' selected' : (vi === 0 && !itemSel.variant ? ' selected' : '');
                                html += `<option value="${v.name}"${selected}>${v.name}</option>`;
                            });
                            html += `</select>`;
                        } else if (item.selection_mode === 'quantity') {
                            const qty = itemSel.qty ?? 1;
                            html += `<div class="bf-qty-row">`;
                            html += `<button class="bf-qty-btn" data-addon="${a.id}" data-guest="${guestIdx}" data-item="${ii}" data-dir="-1" type="button">−</button>`;
                            html += `<span class="bf-qty-val" id="bf-qty-${a.id}-${guestIdx}-${ii}">${qty}</span>`;
                            html += `<button class="bf-qty-btn" data-addon="${a.id}" data-guest="${guestIdx}" data-item="${ii}" data-dir="1" type="button">+</button>`;
                            if (item.addon_item_variants?.length) {
                                html += `<select class="bf-variant-select" data-addon="${a.id}" data-guest="${guestIdx}" data-item="${ii}">`;
                                item.addon_item_variants.forEach(v => {
                                    html += `<option value="${v.name}"${itemSel.variant === v.name ? ' selected' : ''}>${v.name}</option>`;
                                });
                                html += `</select>`;
                            }
                            html += `</div>`;
                        }
                        html += `</div>`;
                    });
                    return html;
                };

                const bookingIndices = items.map((it, idx) => ({ it, idx })).filter(x => x.it.applicability === 'booking').map(x => x.idx);
                const guestIndices = items.map((it, idx) => ({ it, idx })).filter(x => !x.it.applicability || x.it.applicability === 'guest').map(x => x.idx);

                if (bookingIndices.length > 0) {
                    // Per Booking Items
                    body += `<div class="bf-guest-block">`;
                    body += `<div class="bf-guest-label">Für die Buchung</div>`;
                    body += renderItemsBlock(sel.items || [], bookingIndices, items, -1);
                    body += `</div>`;
                }

                if (guestIndices.length > 0) {
                    // Per Guest Items
                    for (let gi = 0; gi < gc; gi++) {
                        const guestSel = sel.guests?.[gi] || { items: [] };
                        body += `<div class="bf-guest-block">`;
                        if (gc > 1) body += `<div class="bf-guest-label">Gast ${gi + 1}</div>`;
                        body += renderItemsBlock(guestSel.items || [], guestIndices, items, gi);
                        body += `</div>`;
                    }
                }
            }

            return `<div class="bf-addon-card${isActive ? ' bf-addon-active' : ''}" data-addon-card="${a.id}">
                <div class="bf-addon-header"><input type="checkbox" name="bf-addon" value="${a.id}"${isActive ? ' checked' : ''}><strong>${a.name}</strong> <span>(+€${a.price})</span></div>
                ${isActive ? `<div class="bf-addon-body">${body}</div>` : ''}
            </div>`;
        }).join('');

        const wrap = document.createElement('div');
        wrap.setAttribute('data-bf-generated', 'true');
        wrap.innerHTML = html;
        c.appendChild(wrap);

        // Bind guest count buttons
        bindGuestCount(c);

        // Bind checkbox toggles
        c.querySelectorAll('input[name="bf-addon"]').forEach(cb => cb.onchange = () => togAddon(cb.value));


        // Bind quantity buttons (per-guest)
        c.querySelectorAll('.bf-qty-btn:not(#bf-gc-minus):not(#bf-gc-plus)').forEach(btn => {
            btn.onclick = () => {
                const sel = state.sel.addons.find(x => x.id === btn.dataset.addon);
                const gi = parseInt(btn.dataset.guest);
                const ii = parseInt(btn.dataset.item);
                // Guest -1 means booking level
                if (gi === -1) {
                    if (!sel.items) sel.items = [];
                    if (!sel.items[ii]) sel.items[ii] = { qty: 1 };
                    sel.items[ii].qty = Math.max(1, (sel.items[ii].qty || 1) + parseInt(btn.dataset.dir));
                    const qEl = document.getElementById(`bf-qty-${btn.dataset.addon}-${gi}-${ii}`);
                    if (qEl) qEl.textContent = sel.items[ii].qty;
                } else {
                    if (!sel?.guests?.[gi]?.items) return;
                    if (!sel.guests[gi].items[ii]) sel.guests[gi].items[ii] = { qty: 1 };
                    sel.guests[gi].items[ii].qty = Math.max(1, (sel.guests[gi].items[ii].qty || 1) + parseInt(btn.dataset.dir));
                    const qEl = document.getElementById(`bf-qty-${btn.dataset.addon}-${gi}-${ii}`);
                    if (qEl) qEl.textContent = sel.guests[gi].items[ii].qty;
                }
                popSummary();
            };
        });

        // Bind variant selects (per-guest)
        c.querySelectorAll('.bf-variant-select').forEach(sel => {
            sel.onchange = () => {
                const addonSel = state.sel.addons.find(x => x.id === sel.dataset.addon);
                const gi = parseInt(sel.dataset.guest);
                const ii = parseInt(sel.dataset.item);
                if (gi === -1) {
                    if (!addonSel.items) addonSel.items = [];
                    if (!addonSel.items[ii]) addonSel.items[ii] = {};
                    addonSel.items[ii].variant = sel.value;
                    popSummary();
                } else if (addonSel?.guests?.[gi]?.items) {
                    if (!addonSel.guests[gi].items[ii]) addonSel.guests[gi].items[ii] = {};
                    addonSel.guests[gi].items[ii].variant = sel.value;
                    popSummary();
                }
            };
        });
        renumberSplitCards();
    };

    const bindGuestCount = (c) => {
        const bindBtn = (btn, delta) => {
            if (!btn) return;
            btn.onclick = (e) => {
                e.preventDefault();
                if (btn.getAttribute('aria-disabled') === 'true') return;
                setGuestCount(state.sel.guestCount + delta);
            };
        };
        bindBtn(c?.querySelector('#bf-gc-minus'), -1);
        bindBtn(c?.querySelector('#bf-gc-plus'), 1);
        bindBtn($('[data-bf-action="gc-minus"]'), -1);
        bindBtn($('[data-bf-action="gc-plus"]'), 1);
        updateGuestCountUI();
    };

    const splitAddress = (address) => {
        const raw = (address || '').trim();
        if (!raw) return { street: '', houseNumber: '' };
        const m = raw.match(/^(.*?)(?:\s+(\d+[a-zA-Z0-9/-]*))$/);
        if (!m) return { street: raw, houseNumber: '' };
        return { street: (m[1] || '').trim(), houseNumber: (m[2] || '').trim() };
    };

    const composeAddress = (street, houseNumber) => {
        const s = (street || '').trim();
        const h = (houseNumber || '').trim();
        return [s, h].filter(Boolean).join(' ').trim();
    };

    const popSummary = () => {
        const c = dyn('summary');
        const step2Scope = root?.querySelector('[data-bf-step="2"]') || root;
        if (!c || !step2Scope) return;
        const td = step2Scope.querySelector('[data-bf-display="total"]');
        const { service: svc, object: obj, startDate: sd, endDate: ed, city, zip, time, staff, guestCount } = state.sel;
        const isON = svc?.service_type === 'overnight', isH = svc?.service_type === 'hourly', n = nights(sd, ed);
        const base = isON ? +svc?.price * n : +svc?.price || 0;
        const stf = staff ? state.data.staff.find(s => s.id === staff) : null;
        let dt = fmtDisplay(sd); if (isON && ed) dt = `${fmtDisplay(sd)} → ${fmtDisplay(ed)} (${n} ${n === 1 ? 'Nacht' : 'Nächte'})`;

        // Build price rows HTML (always needed)
        let priceRowsHtml = `<div class="bf-summary-row"><span>${svc?.name || '-'}</span><span>€${base.toFixed(2)}</span></div>`;
        state.sel.addons.forEach(sel => {
            const a = state.data.addons.find(x => x.id === sel.id);
            if (!a) return;
            const items = a.addon_items || [];
            if (items.length) {
                (sel.items || []).forEach((it, ii) => {
                    if (!it) return;
                    const def = items[ii]; if (!def) return;
                    const detail = it.variant ? ` ${it.variant}` : '';
                    const qty = it.qty || 1;
                    priceRowsHtml += `<div class="bf-summary-row"><span>+ ${def.name}${detail}</span><span>€${(+a.price * qty).toFixed(2)}</span></div>`;
                });
                (sel.guests || []).forEach((guest, gi) => {
                    let guestLabel = guestCount > 1 ? ` (G ${gi + 1})` : '';
                    (guest.items || []).forEach((it, ii) => {
                        if (!it) return;
                        const def = items[ii]; if (!def) return;
                        const detail = it.variant ? ` ${it.variant}` : '';
                        const qty = it.qty || 1;
                        priceRowsHtml += `<div class="bf-summary-row"><span>+ ${def.name}${detail}${guestLabel}</span><span>€${(+a.price * qty).toFixed(2)}</span></div>`;
                    });
                });
            } else {
                const total = +a.price * guestCount;
                priceRowsHtml += `<div class="bf-summary-row"><span>+ ${a.name}${guestCount > 1 ? ` ×${guestCount}` : ''}</span><span>€${total.toFixed(2)}</span></div>`;
            }
        });
        if (+svc?.cleaning_fee) priceRowsHtml += `<div class="bf-summary-row"><span>Reinigung</span><span>€${(+svc.cleaning_fee).toFixed(2)}</span></div>`;
        if (state.voucher.data) priceRowsHtml += `<div class="bf-summary-row"><span>🎫 ${state.voucher.data.name}</span><span>-€${calcDisc().toFixed(2)}</span></div>`;

        const totalStr = `€${calcTotal().toFixed(2)}`;

        const templateBindInputs = step2Scope.querySelectorAll('[data-bf-bind]');
        const summaryRows = step2Scope.querySelectorAll('[data-bf-summary]');
        const priceRowsEl = step2Scope.querySelector('[data-bf-dynamic="price-rows"]');
        const hasTemplateRows = summaryRows.length > 0 && priceRowsEl;
        const addressParts = splitAddress(state.sel.address || '');

        // Bind form inputs
        templateBindInputs.forEach(i => {
            const key = i.dataset.bfBind;
            if (!key) return;
            const value = key === 'street'
                ? addressParts.street
                : key === 'houseNumber'
                    ? addressParts.houseNumber
                    : (state.sel[key] || '');
            if (i.value !== value) i.value = value;
            i.oninput = e => {
                if (key === 'street' || key === 'houseNumber') {
                    const street = step2Scope.querySelector('[data-bf-bind="street"]')?.value || '';
                    const houseNumber = step2Scope.querySelector('[data-bf-bind="houseNumber"]')?.value || '';
                    state.sel.address = composeAddress(street, houseNumber);
                    return;
                }
                state.sel[key] = e.target.value;
            };
        });

        if (hasTemplateRows) {
            const setVal = (key, val) => {
                const el = step2Scope.querySelector(`[data-bf-display="summary-${key}"]`);
                if (el) el.textContent = val || '-';
            };
            const addonNames = state.sel.addons.map(sel => state.data.addons.find(a => a.id === sel.id)?.name).filter(Boolean);
            const discount = calcDisc();
            const tax = calcTotal() * 0.19;
            setVal('object', obj?.name);
            setVal('service', svc?.name);
            setVal('addon', addonNames.length ? addonNames.join(', ') : '-');
            setVal('staff', stf?.name);
            setVal('guests', guestCount);
            setVal('date', dt);
            setVal('time', isH && time ? `${time} (${svc?.duration_minutes}min)` : '');
            setVal('subtotal', `€${calcSub().toFixed(2)}`);
            setVal('discount', discount > 0 ? `-€${discount.toFixed(2)}` : '€0.00');
            setVal('tax', `€${tax.toFixed(2)}`);

            const showRow = (key, visible) => {
                const row = step2Scope.querySelector(`[data-bf-summary="${key}"]`);
                if (row) row.style.display = visible ? '' : 'none';
            };
            showRow('addon', addonNames.length > 0);
            showRow('staff', !!stf);
            showRow('time', isH && !!time);

            priceRowsEl.innerHTML = priceRowsHtml;
            setVal('total', totalStr);
        }

        if (td) td.innerHTML = `<strong>Gesamt: ${totalStr}</strong>`;
    };

    const updVoucher = () => {
        const c = disp('voucher-status');
        if (!c) return;
        const v = state.voucher;
        c.style.display = v.status ? 'block' : 'none';
        c.querySelectorAll('[data-bf-voucher]').forEach(el => {
            const type = el.dataset.bfVoucher;
            if (type === v.status) {
                el.style.display = 'block';
                if (type === 'valid' && v.data?.name) el.textContent = `✅ ${v.data.name}`;
                if (type === 'invalid' && v.error) el.textContent = `❌ ${v.error}`;
            } else {
                el.style.display = 'none';
            }
        });
    };

    // --- Preis-Berechnung ---
    const calcDisc = () => {
        const v = state.voucher.data; if (!v) return 0;
        const sub = calcSub();
        return v.discount_type === 'percentage' ? sub * v.discount_value / 100 : Math.min(+v.discount_value, sub);
    };
    const calcSub = () => {
        const svc = state.sel.service, n = svc?.service_type === 'overnight' ? nights(state.sel.startDate, state.sel.endDate) : 1;
        let t = (svc?.service_type === 'overnight' ? +svc?.price * n : +svc?.price) || 0;
        t += +svc?.cleaning_fee || 0;
        const gc = state.sel.guestCount || 1;
        state.sel.addons.forEach(sel => {
            const a = state.data.addons.find(x => x.id === sel.id);
            if (!a) return;
            const items = a.addon_items || [];
            if (items.length) {
                // Per Booking
                (sel.items || []).forEach((it, ii) => {
                    if (it) t += +a.price * (it.qty || 1);
                });
                // Per Guest
                (sel.guests || []).forEach(guest => {
                    (guest.items || []).forEach((it, ii) => {
                        if (it) t += +a.price * (it.qty || 1);
                    });
                });
            } else {
                // Simple addon
                t += +a.price * gc;
            }
        });
        return t;
    };
    const calcTotal = () => Math.max(0, calcSub() - calcDisc());

    // --- Interaktions-Handler ---
    const isSplitMode = () => !!root?.querySelector('[data-bf-card]');

    const selService = async id => {
        state.sel.service = state.data.services.find(s => s.id === id);
        state.sel.startDate = state.sel.endDate = state.sel.time = null;
        state.sel.staff = undefined;
        state.slots = [];
        state.cal.selectingEnd = false;
        state.availStatus = null;
        popServices(); popStaff();
        if (isSplitMode()) {
            const svc = state.sel.service;
            const timeStr = svc?.booking_window_start && svc?.booking_window_end ? `${svc.booking_window_start}–${svc.booking_window_end} Uhr` : '';
            updateCardSummary('service', svc?.name || 'Service', timeStr);
            const hasStaff = state.data.staff.some(s => s.linked_service_ids?.includes(id));
            if (hasStaff) {
                expandCard('staff');
                popStaff();
            } else {
                expandCard('addon');
                deactivateRightSide();
                await loadAvail();
                activateRightSide();
                popCal(); popSlots();
            }
        } else {
            if (!state.data.staff.some(s => s.linked_service_ids?.includes(id))) { await loadAvail(); popCal(); }
        }
    };

    const selStaff = async id => {
        state.sel.staff = id;
        state.sel.startDate = state.sel.endDate = state.sel.time = null;
        state.slots = [];
        state.availStatus = null;
        popStaff();
        if (isSplitMode()) {
            const stf = id ? state.data.staff.find(s => s.id === id) : null;
            updateCardSummary('staff', 'Mitarbeiter', stf?.name || 'Nächstverfügbaren');
            activateRightSide();
            await loadAvail(); popCal(); popSlots();
        } else {
            await loadAvail(); popCal();
        }
    };

    const navMonth = async d => {
        const c = state.cal.month;
        state.cal.month = new Date(c.getFullYear(), c.getMonth() + d, 1);
        await loadAvail(); popCal();
    };

    const loadAvail = async () => {
        const obj = state.sel.object; if (!obj) return;
        const m = state.cal.month, s = new Date(m.getFullYear(), m.getMonth(), 1), e = new Date(m.getFullYear(), m.getMonth() + 1, 0);
        const d = await rpc('get_availability_for_range', { p_object_id: obj.id, p_start_date: fmtDate(s), p_end_date: fmtDate(e), p_session_id: sessionId });
        if (d) state.cal.avail = d;
    };

    const selDate = async ds => {
        const svc = state.sel.service, isON = svc?.service_type === 'overnight';
        if (isON) {
            if (state.cal.selectingEnd && state.sel.startDate && parseLocal(ds) > parseLocal(state.sel.startDate)) {
                state.sel.endDate = ds; state.cal.selectingEnd = false; await checkAvail();
                if (isSplitMode()) { expandCard('addon'); popAddons(); }
            } else { state.sel.startDate = ds; state.sel.endDate = null; state.cal.selectingEnd = true; }
        } else {
            state.sel.startDate = ds; state.sel.endDate = state.sel.time = null;
            if (svc?.service_type === 'hourly') {
                const bookings = state.cal.avail?.bookings?.filter(b => normDate(b.date) === ds) || [];
                state.slots = genSlots(svc, state.sel.object, bookings);
            } else {
                await checkAvail();
                if (isSplitMode() && svc?.service_type === 'daily') { expandCard('addon'); popAddons(); }
            }
        }
        popCal(); popSlots(); popDateInfo();
    };

    const selTime = async t => {
        state.sel.time = t;
        popSlots();
        await checkAvail();
        popSlots(); popDateInfo();
        if (isSplitMode()) { expandCard('addon'); popAddons(); }
    };

    const checkAvail = async () => {
        const { service: svc, object: obj, startDate: sd, endDate: ed, time } = state.sel;
        if (!svc || !obj || !sd) return;
        state.availStatus = 'checking'; popDateInfo();
        let st, et;
        if (svc.service_type === 'hourly' && time) { st = new Date(`${sd}T${time}`); et = new Date(st.getTime() + (svc.duration_minutes || 60) * 6e4); }
        else if (svc.service_type === 'daily') { st = new Date(`${sd}T${svc.booking_window_start || '09:00'}`); et = new Date(`${sd}T${svc.booking_window_end || '18:00'}`); }
        else if (svc.service_type === 'overnight' && ed) { st = new Date(`${sd}T${svc.checkin_start || '14:00'}`); et = new Date(`${ed}T${svc.checkout_end || '11:00'}`); }
        else { state.availStatus = null; return; }
        const ok = await rpc('check_availability', { p_object_id: obj.id, p_start_time: st.toISOString(), p_end_time: et.toISOString(), p_buffer_before: svc.buffer_before_minutes || 0, p_buffer_after: svc.buffer_after_minutes || 0, p_session_id: sessionId });
        state.availStatus = ok === true ? 'available' : 'unavailable';
        popDateInfo();
    };

    const togAddon = id => {
        const idx = state.sel.addons.findIndex(x => x.id === id);
        if (idx >= 0) {
            state.sel.addons.splice(idx, 1);
        } else {
            const addon = state.data.addons.find(a => a.id === id);
            const items = addon?.addon_items || [];
            if (items.length) {
                const bookingItems = buildBookingItems(addon);
                const guests = [];
                for (let g = 0; g < state.sel.guestCount; g++) {
                    guests.push(buildGuestItems(addon));
                }
                state.sel.addons.push({ id, items: bookingItems, guests });
            } else {
                state.sel.addons.push({ id });
            }
        }
        popAddons(); popSummary();
    };

    const applyVoucher = async () => {
        const code = field('voucher')?.value?.trim();
        if (!code) { state.voucher = { code: '', data: null, status: 'invalid', error: 'Code eingeben' }; updVoucher(); return; }
        state.voucher.code = code; state.voucher.status = 'checking'; updVoucher();
        const r = await rpc('validate_voucher', { p_workspace_id: state.data.workspace_id, p_code: code });
        if (r?.valid) { state.voucher.data = { id: r.id, name: r.name, discount_type: r.discount_type, discount_value: r.discount_value }; state.voucher.status = 'valid'; state.voucher.error = null; }
        else { state.voucher.data = null; state.voucher.status = 'invalid'; state.voucher.error = r?.error || 'Ungültig'; }
        updVoucher(); popSummary();
    };

    // --- Submit ---
    let submitting = false;
    const isPaymentEnabled = () => state.data.payout_status === 'active';

    const submit = async e => {
        e.preventDefault();
        e.stopPropagation();
        if (submitting) return;
        submitting = true;
        const btn = $('[data-bf-action="submit"]');
        const originalBtnText = btn?.value || 'Buchung anfragen';
        if (btn) { btn.value = isPaymentEnabled() ? 'Weiter zur Zahlung...' : 'Sende...'; btn.disabled = true; }

        try {
            const { service: svc, object: obj, startDate: sd, endDate: ed, time, addons, staff, fname, lname, email, phone, address, city, zip } = state.sel;

            if (!fname || !lname || !email || !address || !city || !zip) {
                throw new Error('Bitte füllen Sie alle Pflichtfelder aus.');
            }

            if (!svc || !obj || !sd) throw new Error('Fehlende Daten');

            await checkAvail();
            if (state.availStatus !== 'available') {
                throw new Error('Termin ist leider nicht mehr verfügbar. Bitte wähle einen anderen Zeitpunkt.');
            }

            let st, et;
            if (svc.service_type === 'hourly') {
                if (!time) throw new Error('Uhrzeit fehlt');
                st = new Date(`${sd}T${time}`);
                et = new Date(st.getTime() + (svc.duration_minutes || 60) * 6e4);
            } else if (svc.service_type === 'daily') {
                st = new Date(`${sd}T${svc.booking_window_start || '09:00'}`);
                et = new Date(`${sd}T${svc.booking_window_end || '18:00'}`);
            } else {
                if (!ed) throw new Error('Enddatum fehlt');
                st = new Date(`${sd}T${svc.checkin_start || '14:00'}`);
                et = new Date(`${ed}T${svc.checkout_end || '11:00'}`);
            }

            // Build structured addon_selections JSONB for mixed applicability
            const addonSelections = state.sel.addons.map(sel => {
                const addon = state.data.addons.find(a => a.id === sel.id);
                if (!addon) return null;
                const itemsDef = addon.addon_items || [];

                const result = {
                    addon_id: sel.id,
                    addon_name: addon.name
                };

                // Booking Level Items
                if (sel.items && sel.items.some(Boolean)) {
                    result.items = sel.items.map((it, ii) => {
                        if (!it) return null;
                        const def = itemsDef[ii];
                        return { name: def?.name || '', variant: it.variant || null, qty: it.qty || 1 };
                    }).filter(Boolean);
                }

                // Guest Level Items
                if (sel.guests && sel.guests.length) {
                    const guestsWithItems = sel.guests.map((guest, gi) => {
                        const guestItems = (guest.items || []).map((it, ii) => {
                            if (!it) return null;
                            const def = itemsDef[ii];
                            return { name: def?.name || '', variant: it.variant || null, qty: it.qty || 1 };
                        }).filter(Boolean);

                        return guestItems.length ? { guest: gi + 1, items: guestItems } : null;
                    }).filter(Boolean);

                    if (guestsWithItems.length) {
                        result.guests = guestsWithItems;
                    }
                }

                return result;
            }).filter(Boolean);

            // Stripe-Flow
            if (isPaymentEnabled()) {
                const baseUrl = window.location.href.split('?')[0];
                const checkoutRes = await fetch(`${API}/functions/v1/checkout-create`, {
                    method: 'POST', headers: HDR,
                    body: JSON.stringify({
                        site_id: siteId,
                        object_id: obj.id,
                        service_id: svc.id,
                        start_time: st.toISOString(),
                        end_time: et.toISOString(),
                        customer_name: `${fname} ${lname}`,
                        customer_email: email,
                        customer_phone: phone || undefined,
                        customer_address: address,
                        customer_city: city,
                        customer_zip: zip,
                        addon_ids: state.sel.addons.length > 0 ? state.sel.addons.map(a => a.id) : undefined,
                        staff_id: staff || undefined,
                        voucher_code: state.voucher.data ? state.voucher.code : undefined,
                        session_id: sessionId,
                        guest_count: state.sel.guestCount,
                        addon_selections: addonSelections.length ? addonSelections : undefined,
                        success_url: baseUrl + '?booking=success&bf_sid=' + sessionId,
                        cancel_url: baseUrl + '?booking=cancelled',
                    })
                });
                const checkoutData = await checkoutRes.json();
                if (checkoutRes.status === 409) {
                    state.availStatus = 'unavailable';
                    throw new Error('Dieser Termin ist leider nicht mehr verfügbar. Bitte gehe zurück und wähle einen anderen Zeitpunkt.');
                }
                if (checkoutData.error) throw new Error(checkoutData.error);
                if (checkoutData.checkout_url) {
                    track('checkout_started', { total_price: calcTotal(), currency: 'EUR', service_name: svc.name, object_name: obj.name });
                    window.location.href = checkoutData.checkout_url;
                    return;
                }
                throw new Error('Keine Checkout-URL erhalten');
            }


            // Legacy-Flow: Buchung ohne Zahlung
            const r = await rpc('create_booking_request', {
                p_site_id: siteId,
                p_object_id: obj.id,
                p_service_id: svc.id,
                p_start_time: st.toISOString(),
                p_end_time: et.toISOString(),
                p_customer_name: `${fname} ${lname}`,
                p_customer_email: email,
                p_customer_phone: phone,
                p_customer_address: address,
                p_customer_city: city,
                p_customer_zip: zip,
                p_customer_notes: '',
                p_addon_ids: state.sel.addons.map(a => a.id),
                p_staff_id: staff,
                p_guest_count: state.sel.guestCount,
                p_addon_selections: addonSelections.length ? addonSelections : null
            });
            if (r?.success) {
                track('booking_completed', { total_price: calcTotal(), currency: 'EUR', service_name: svc.name, object_name: obj.name });
                show('success');
            } else {
                throw new Error(r?.error || 'Buchung fehlgeschlagen');
            }
        } catch (err) {
            console.error(err);
            const msg = err.message || 'Buchung fehlgeschlagen';
            const errEl = root.querySelector('[data-bf-error], .w-form-fail');
            if (errEl) {
                const errTextTarget = errEl.matches('.w-form-fail') ? errEl.querySelector('div') || errEl : errEl;
                errTextTarget.textContent = msg;
                errEl.style.display = 'block';
            } else alert(msg);
            if (btn) { btn.value = originalBtnText; btn.disabled = false; }
            submitting = false;
        }
    };

    // --- Event-Binding ---
    const bind = () => {
        // Split-Screen: free accordion toggle
        $$('.bf-split-card-header').forEach(h => {
            const card = h.closest('[data-bf-card]');
            const name = card?.dataset?.bfCard;
            const panel = card?.querySelector('.bf-split-card-body');
            if (h.tagName !== 'BUTTON') {
                h.setAttribute('role', 'button');
                h.setAttribute('tabindex', '0');
            }
            if (name && panel) {
                const panelId = panel.id || `bf-panel-${name}`;
                panel.id = panelId;
                h.setAttribute('aria-controls', panelId);
                h.setAttribute('aria-expanded', card.classList.contains('is-open') ? 'true' : 'false');
                panel.hidden = !card.classList.contains('is-open');
            }
            const toggle = () => {
                if (!name) return;
                toggleCard(name);
                if (name === 'object') popObjects();
                if (name === 'service') popServices();
                if (name === 'staff') popStaff();
                if (name === 'addon') popAddons();
            };
            h.addEventListener('click', () => {
                toggle();
            });
            h.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });

        // Next/Back navigation
        $$('[data-bf-action="next"],[data-bf-action="back"]').forEach(b => b.onclick = e => {
            e.preventDefault();
            const action = b.dataset.bfAction;

            if (action === 'next') {
                const isSplit = !!root?.querySelector('[data-bf-card]');
                if (isSplit && state.step === 1 || state.step === '1') {
                    if (!state.sel.object) return alert('Bitte Objekt wählen.');
                    if (!state.sel.service) return alert('Bitte Service wählen.');
                    if (!state.sel.startDate) return alert('Bitte Datum wählen.');
                    if (state.sel.service?.service_type === 'hourly' && !state.sel.time) return alert('Bitte Uhrzeit wählen.');
                    if (state.sel.service?.service_type === 'overnight' && !state.sel.endDate) return alert('Bitte Abreisedatum wählen.');
                    track('widget_start', { object_name: state.sel.object?.name });
                    track('step_3', { service_name: state.sel.service.name, service_type: state.sel.service.service_type });
                    track('step_4', { date: state.sel.startDate });
                } else {
                    const currentStepEl = $(`[data-bf-step="${state.step}"]`);
                    if (currentStepEl) {
                        if (currentStepEl.querySelector('[data-bf-field="object"]')) {
                            const oid = field('object')?.value;
                            if (!oid) return alert('Objekt wählen.');
                            state.sel.object = state.data.objects.find(o => o.id === oid);
                            track('widget_start', { object_name: state.sel.object?.name });
                        }
                        if (currentStepEl.querySelector('[data-bf-dynamic="services"]')) {
                            if (!state.sel.service) return alert('Service wählen.');
                            track('step_3', { service_name: state.sel.service.name, service_type: state.sel.service.service_type });
                        }
                        if (currentStepEl.querySelector('[data-bf-dynamic="calendar"]')) {
                            if (!state.sel.startDate) return alert('Datum wählen.');
                            if (state.sel.service?.service_type === 'hourly' && !state.sel.time) return alert('Uhrzeit wählen.');
                            if (state.sel.service?.service_type === 'overnight' && !state.sel.endDate) return alert('Abreisedatum wählen.');
                            if (state.availStatus !== 'available') return alert('Termin nicht verfügbar.');
                            track('step_4', { date: state.sel.startDate });
                        }
                    }
                }
            }

            const to = getNextValidStep(b.dataset.bfGoto, action);
            show(to);

            const stepEl = $(`[data-bf-step="${to}"]`);
            if (stepEl) {
                if (stepEl.querySelector('[data-bf-dynamic="services"]')) { popServices(); }
                if (stepEl.querySelector('[data-bf-dynamic="staff"]')) { popStaff(); }
                if (stepEl.querySelector('[data-bf-dynamic="calendar"]')) { loadAvail().then(popCal); popSlots(); popDateInfo(); }
                if (stepEl.querySelector('[data-bf-dynamic="addons"]')) { popAddons(); }
                if (stepEl.querySelector('[data-bf-dynamic="summary"]')) { popSummary(); }
            }
        });
        // Legacy: select-based object (for non-split layouts)
        field('object')?.addEventListener('change', e => {
            state.sel.object = state.data.objects.find(o => o.id === e.target.value);
            state.sel.service = state.sel.startDate = state.sel.endDate = state.sel.time = null;
            state.slots = [];
        });
        $('[data-bf-action="apply-voucher"]')?.addEventListener('click', e => { e.preventDefault(); applyVoucher(); });
        const form = $('form');
        const submitBtn = $('[data-bf-action="submit"]');
        if (form) form.addEventListener('submit', submit);
        if (submitBtn) submitBtn.addEventListener('click', submit);
    };

    // --- Init ---
    const stopInitDiscovery = () => {
        if (initRetryTimer) {
            clearTimeout(initRetryTimer);
            initRetryTimer = null;
        }
        if (initObserver) {
            initObserver.disconnect();
            initObserver = null;
        }
    };

    const initCore = async () => {
        css();
        if (!isSplitMode()) ensureProgress();
        show(1);
        clearInitError();

        // Stripe-Rueckkehr: URL-Parameter pruefen (Zero-Storage)
        const params = new URLSearchParams(location.search);
        const returnStatus = params.get('booking');
        const returnSid = params.get('bf_sid');
        if (returnStatus) {
            const sid = returnSid || sessionId;
            if (returnStatus === 'success') {
                trackWithSid(sid, 'booking_completed', { source: 'stripe_return' });
                trackWithSid(sid, 'payment_completed', { source: 'stripe_return' });
                show('success');
                history.replaceState(null, '', location.pathname);
                return; // Fertig - Success-Screen zeigen, kein Widget-Load noetig
            } else if (returnStatus === 'cancelled') {
                trackWithSid(sid, 'checkout_cancelled', {});
                history.replaceState(null, '', location.pathname);
                // Weiter mit normalem Widget-Init (User kann es nochmal versuchen)
            }
        }

        const d = await rpc('get_widget_data', { p_site_id: siteId });
        if (!d || d.error) {
            setInitError('Buchungsdaten konnten nicht geladen werden. Bitte Seite neu laden oder spaeter erneut versuchen.');
            return;
        }
        state.data = d;
        const workspaceNameEl = disp('workspace-name');
        if (workspaceNameEl && state.data?.workspace_name) workspaceNameEl.textContent = state.data.workspace_name;

        // Fetch deeply nested addon items via separate RPC
        if (state.data.addons?.length) {
            const addonIds = state.data.addons.map(a => a.id);
            const itemsRes = await rpc('get_addon_items', { p_addon_ids: addonIds });
            if (itemsRes && Array.isArray(itemsRes)) {
                itemsRes.forEach(r => {
                    const addon = state.data.addons.find(a => a.id === r.addon_id);
                    if (addon) addon.addon_items = r.items;
                });
            }
        }
        popObjects();
        renumberSplitCards();
        if (!hasBoundHandlers) {
            bind();
            hasBoundHandlers = true;
        }
        show(1);
        track('widget_view');
        initialized = true;
    };

    const tryInit = async () => {
        if (initialized || initInFlight) return initialized;
        const candidate = document.querySelector('[data-bf-root="true"]');
        if (!candidate) return false;
        root = candidate;
        initInFlight = true;
        try {
            await initCore();
            stopInitDiscovery();
            return true;
        } finally {
            initInFlight = false;
        }
    };

    const startInitDiscovery = () => {
        const MAX_ATTEMPTS = 24;
        const RETRY_MS = 250;
        let attempts = 0;

        const scheduleRetry = () => {
            if (initialized) return;
            initRetryTimer = setTimeout(async () => {
                const ok = await tryInit();
                if (ok) return;
                attempts++;
                if (attempts >= MAX_ATTEMPTS) {
                    stopInitDiscovery();
                    console.warn('[BookFast embed] Root element [data-bf-root="true"] not found. Initialization aborted.');
                    return;
                }
                scheduleRetry();
            }, RETRY_MS);
        };

        if (typeof MutationObserver !== 'undefined') {
            initObserver = new MutationObserver(() => { void tryInit(); });
            initObserver.observe(document.documentElement, { childList: true, subtree: true });
        }

        void tryInit();
        scheduleRetry();
    };

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', startInitDiscovery, { once: true })
        : startInitDiscovery();
})();
