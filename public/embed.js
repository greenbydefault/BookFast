(function () {
    const script = document.currentScript;
    const siteId = script?.getAttribute('data-site-id');
    if (!siteId) return;

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

    // --- Minimales Layout-CSS (nur dynamisch generierte Elemente) ---
    const css = () => {
        if (document.getElementById('bf-css')) return;
        const s = document.createElement('style'); s.id = 'bf-css';
        s.textContent = [
            // Calendar
            '.bf-cal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem}',
            '.bf-cal-header button{background:none;border:none;cursor:pointer;padding:.4rem .8rem;font:inherit;border-radius:6px}',
            '.bf-cal-header button:hover{background:rgba(0,0,0,.05)}',
            '.bf-cal-grid{user-select:none}',
            '.bf-cal-weekdays,.bf-cal-days{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}',
            '.bf-cal-weekdays span{padding:.4rem;font-size:.8rem;font-weight:600;opacity:.6}',
            '.bf-day{min-width:40px;min-height:40px;padding:0;border:none;border-radius:50%;background:none;cursor:pointer;font:inherit;display:flex;align-items:center;justify-content:center;transition:background .15s,opacity .15s}',
            '.bf-day:hover:not(:disabled){background:rgba(0,0,0,.06)}',
            '.bf-day:disabled{cursor:default}',
            '.bf-day-other{visibility:hidden}',
            '.bf-day-disabled{opacity:.25;cursor:default}',
            '.bf-day-selected{font-weight:700;background:rgba(0,0,0,.1);border-radius:50%}',
            '.bf-day-range{background:rgba(0,0,0,.04)}',
            '.bf-day-today{outline:2px solid currentColor;outline-offset:-2px}',
            // Timeslots
            '.bf-slot{display:inline-flex;align-items:center;justify-content:center;min-width:64px;padding:.5rem .75rem;border:1px solid #d1d5db;border-radius:6px;background:none;cursor:pointer;font:inherit;margin:0 6px 6px 0;transition:background .15s,opacity .15s}',
            '.bf-slot:hover:not(:disabled){background:rgba(0,0,0,.05)}',
            '.bf-slot-disabled{opacity:.3;cursor:default;text-decoration:line-through}',
            '.bf-slot-selected{font-weight:700;border-color:currentColor;background:rgba(0,0,0,.06)}',
            '.bf-slots-empty{opacity:.6;font-size:.9rem}',
            // Radio / Checkbox (dynamic service & staff lists)
            '.bf-radio,.bf-checkbox{display:block;cursor:pointer;padding:.5rem 0}',
            // Addon cards
            '.bf-addon-card{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;background:#fafafa}',
            '.bf-addon-card.active{border-color:#2563eb;background:#eff6ff}',
            '.bf-addon-header{display:flex;align-items:center;gap:8px;cursor:pointer}',
            '.bf-addon-header input{margin:0}',
            '.bf-addon-body{margin-top:8px;padding-left:24px}',
            '.bf-addon-item{margin-bottom:6px}',
            '.bf-addon-item-label{font-size:.85rem;font-weight:500;margin-bottom:4px}',
            '.bf-variant-radios label{display:block;padding:2px 0;font-size:.85rem;cursor:pointer}',
            '.bf-variant-radios input{margin-right:6px}',
            '.bf-variant-select{padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;font-size:.85rem}',
            // Quantity controls
            '.bf-qty-row{display:flex;align-items:center;gap:6px;margin-top:4px}',
            '.bf-qty-btn{width:28px;height:28px;border:1px solid #d1d5db;border-radius:4px;background:#fff;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}',
            '.bf-qty-btn:hover{background:#f3f4f6}',
            '.bf-qty-val{min-width:24px;text-align:center;font-size:.9rem}',
            // Guest count
            '.bf-guest-count{margin-bottom:12px}',
            '.bf-guest-block{padding:10px 0;border-top:1px solid #e5e7eb}',
            '.bf-guest-block:first-child{border-top:none;padding-top:0}',
            '.bf-guest-label{font-weight:600;font-size:.9rem;margin-bottom:6px;color:#1e40af}',
            // Summary layout
            '.bf-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:2rem}',
            '@media(max-width:768px){.bf-grid-2{grid-template-columns:1fr}}',
            '.bf-form-group{margin-bottom:1rem}',
            '.bf-form-label{display:block;font-size:.9rem;font-weight:500;margin-bottom:.4rem}',
            '.bf-input{width:100%;padding:.6rem;border:1px solid #d1d5db;border-radius:6px;font-size:1rem;box-sizing:border-box}',
            '.bf-row-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}',
            // Date info & availability
            '.bf-dateinfo{margin:.75rem 0}',
            '.bf-avail-status[data-status="available"]{color:#16a34a}',
            '.bf-avail-status[data-status="unavailable"]{color:#dc2626}',
            '.bf-avail-status[data-status="checking"]{opacity:.6}',
        ].join('');
        document.head.appendChild(s);
    };

    // --- DOM-Helpers ---
    const $ = s => root?.querySelector(s);
    const $$ = s => root?.querySelectorAll(s) || [];
    const show = n => { state.step = n; $$('[data-bf-step]').forEach(e => e.style.display = e.dataset.bfStep === String(n) ? 'block' : 'none'); };

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

    // --- UI-Population ---
    const popObjects = () => {
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
        c.innerHTML = svcs.length ? svcs.map(s => `<label class="bf-radio"><input type="radio" name="bf-service" value="${s.id}"${state.sel.service?.id === s.id ? ' checked' : ''}><span><strong>${s.name}</strong> — €${s.price}${s.duration_minutes ? ` · ${s.duration_minutes}min` : ''}${s.service_type === 'overnight' ? '/Nacht' : ''}</span></label>`).join('') : '<p>Keine Services verfügbar.</p>';
        c.querySelectorAll('input[name="bf-service"]').forEach(r => r.onchange = () => selService(r.value));
    };

    const popStaff = () => {
        const c = dyn('staff');
        if (!c) return;
        const svc = state.sel.service;
        const staff = state.data.staff.filter(s => s.linked_service_ids?.includes(svc?.id));
        if (!staff.length) { c.style.display = 'none'; state.sel.staff = null; return; }
        c.style.display = 'block';
        c.innerHTML = `<p><strong>Mitarbeiter</strong></p><label class="bf-radio"><input type="radio" name="bf-staff" value=""${state.sel.staff === null ? ' checked' : ''}><span>Egal</span></label>${staff.map(s => `<label class="bf-radio"><input type="radio" name="bf-staff" value="${s.id}"${state.sel.staff === s.id ? ' checked' : ''}><span>${s.name}</span></label>`).join('')}`;
        c.querySelectorAll('input[name="bf-staff"]').forEach(r => r.onchange = () => selStaff(r.value || null));
    };

    const popCal = () => {
        const c = dyn('calendar');
        if (!c || !state.sel.service || !state.sel.object) { if (c) c.innerHTML = '<p>Bitte Service wählen.</p>'; return; }
        const { month } = state.cal;
        const y = month.getFullYear(), m = month.getMonth();
        const first = new Date(y, m, 1);
        let start = new Date(first);
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        const days = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
        const blocked = state.cal.avail?.blocked_dates || [];
        const today = fmtDate(new Date());
        const isON = state.sel.service?.service_type === 'overnight';

        c.innerHTML = `<div class="bf-cal"><div class="bf-cal-header"><button type="button" data-nav="-1">‹ Zurück</button><span><strong>${MONTHS[m]} ${y}</strong></span><button type="button" data-nav="1">Weiter ›</button></div><div class="bf-cal-grid"><div class="bf-cal-weekdays">${DAYS.map(d => `<span>${d}</span>`).join('')}</div><div class="bf-cal-days">${days.map(d => {
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

        c.querySelectorAll('[data-nav]').forEach(b => b.onclick = e => { e.preventDefault(); navMonth(+b.dataset.nav); });
        c.querySelectorAll('[data-d]').forEach(d => d.onclick = () => selDate(d.dataset.d));
    };

    const popSlots = () => {
        const c = dyn('timeslots');
        if (!c) return;
        if (!state.slots.length) { c.style.display = 'none'; c.innerHTML = ''; return; }
        const anyAvail = state.slots.some(s => s.available);
        c.style.display = 'block';
        c.innerHTML = `<p><strong>Uhrzeit wählen</strong></p>${!anyAvail ? '<p class="bf-slots-empty">Keine freien Termine an diesem Tag.</p>' : ''}${state.slots.map(s => {
            const sel = state.sel.time === s.start;
            const cls = `bf-slot${s.available ? '' : ' bf-slot-disabled'}${sel ? ' bf-slot-selected' : ''}`;
            return `<button type="button" class="${cls}" data-time="${s.start}"${!s.available ? ' disabled' : ''}>${s.start}</button>`;
        }).join('')}`;
        c.querySelectorAll('.bf-slot:not(:disabled)').forEach(b => b.onclick = () => selTime(b.dataset.time));
    };

    const popDateInfo = () => {
        const c = dyn('dateinfo');
        if (!c) return;
        const { service: svc, startDate: sd, endDate: ed, time } = state.sel;
        if (!svc || !sd) { c.innerHTML = ''; return; }
        const isON = svc.service_type === 'overnight', isH = svc.service_type === 'hourly', n = nights(sd, ed);
        let h = '<div class="bf-dateinfo">';
        if (isON && sd && ed) h += `<p><strong>${fmtDisplay(sd)} → ${fmtDisplay(ed)}</strong><br>${n} ${n === 1 ? 'Nacht' : 'Nächte'}</p>`;
        else if (isH && sd) { h += `<p><strong>${fmtDisplay(sd)}</strong>${time ? `<br>${time} Uhr (${svc.duration_minutes} Min.)` : ''}</p>`; }
        else if (sd) h += `<p><strong>${fmtDisplay(sd)}</strong><br>Ganztags</p>`;
        h += '</div>';
        if (state.availStatus) {
            const t = { checking: '⏳ Prüfe Verfügbarkeit...', available: '✅ Verfügbar', unavailable: '❌ Nicht verfügbar' }[state.availStatus];
            h += `<p class="bf-avail-status" data-status="${state.availStatus}"><strong>${t}</strong></p>`;
        }
        c.innerHTML = h;
    };

    // --- Gästezahl ändern ---
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

        // Guest count selector
        const max = state.sel.object?.capacity || 99;
        const gc = state.sel.guestCount;
        let html = `<div class="bf-guest-count">
            <p><strong>Anzahl Gäste</strong>${max < 99 ? ` <small>(Max: ${max})</small>` : ''}</p>
            <div class="bf-qty-row" style="margin-bottom:16px">
                <button class="bf-qty-btn" id="bf-gc-minus" type="button" ${gc <= 1 ? 'disabled' : ''}>−</button>
                <span class="bf-qty-val" id="bf-gc-val">${gc}</span>
                <button class="bf-qty-btn" id="bf-gc-plus" type="button" ${gc >= max ? 'disabled' : ''}>+</button>
            </div>
        </div>`;

        if (!adds.length) { html += '<p>Keine Extras.</p>'; c.innerHTML = html; bindGuestCount(c); return; }

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
                            html += `<select class="bf-variant-select" data-addon="${a.id}" data-guest="${guestIdx}" data-item="${ii}" style="width:100%;margin-top:4px">`;
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

            return `<div class="bf-addon-card${isActive ? ' active' : ''}" data-addon-card="${a.id}">
                <div class="bf-addon-header"><input type="checkbox" name="bf-addon" value="${a.id}"${isActive ? ' checked' : ''}><strong>${a.name}</strong> <span>(+€${a.price})</span></div>
                ${isActive ? `<div class="bf-addon-body">${body}</div>` : ''}
            </div>`;
        }).join('');

        c.innerHTML = html;

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
    };

    const bindGuestCount = (c) => {
        c.querySelector('#bf-gc-minus')?.addEventListener('click', () => setGuestCount(state.sel.guestCount - 1));
        c.querySelector('#bf-gc-plus')?.addEventListener('click', () => setGuestCount(state.sel.guestCount + 1));
    };

    const popSummary = () => {
        const c = dyn('summary'), td = disp('total');
        if (!c) return;
        const { service: svc, object: obj, startDate: sd, endDate: ed, fname, lname, email, phone, address, city, zip, time, staff, guestCount } = state.sel;
        const isON = svc?.service_type === 'overnight', isH = svc?.service_type === 'hourly', n = nights(sd, ed);
        const base = isON ? +svc?.price * n : +svc?.price || 0;
        const stf = staff ? state.data.staff.find(s => s.id === staff) : null;
        let dt = fmtDisplay(sd); if (isON && ed) dt = `${fmtDisplay(sd)} → ${fmtDisplay(ed)} (${n} ${n === 1 ? 'Nacht' : 'Nächte'})`;

        // Left Column: User Data Form
        let formParams = `
            <div class="bf-form-group">
                <label class="bf-form-label">Vorname *</label>
                <input type="text" class="bf-input" data-bind="fname" value="${fname || ''}" placeholder="Max">
            </div>
            <div class="bf-form-group">
                <label class="bf-form-label">Nachname *</label>
                <input type="text" class="bf-input" data-bind="lname" value="${lname || ''}" placeholder="Mustermann">
            </div>
            <div class="bf-form-group">
                <label class="bf-form-label">E-Mail Adresse *</label>
                <input type="email" class="bf-input" data-bind="email" value="${email || ''}" placeholder="max@beispiel.de">
            </div>
            <div class="bf-form-group">
                <label class="bf-form-label">Telefonnummer</label>
                <input type="tel" class="bf-input" data-bind="phone" value="${phone || ''}" placeholder="+49 123 456789">
            </div>
            <div class="bf-form-group">
                <label class="bf-form-label">Adresse *</label>
                <input type="text" class="bf-input" data-bind="address" value="${address || ''}" placeholder="Musterstraße 1">
            </div>
            <div class="bf-row-2">
                <div class="bf-form-group">
                    <label class="bf-form-label">PLZ *</label>
                    <input type="text" class="bf-input" data-bind="zip" value="${zip || ''}" placeholder="12345">
                </div>
                <div class="bf-form-group">
                    <label class="bf-form-label">Stadt *</label>
                    <input type="text" class="bf-input" data-bind="city" value="${city || ''}" placeholder="Berlin">
                </div>
            </div>
        `;

        // Right Column: Summary
        let rows = `<tr><td>Objekt</td><td>${obj?.name || '-'}</td></tr>`;
        rows += `<tr><td>Service</td><td>${svc?.name || '-'}</td></tr>`;
        if (stf) rows += `<tr><td>Mitarbeiter</td><td>${stf.name}</td></tr>`;
        rows += `<tr><td>Anzahl Gäste</td><td>${guestCount}</td></tr>`;
        rows += `<tr><td>Datum</td><td>${dt}</td></tr>`;
        if (isH && time) rows += `<tr><td>Uhrzeit</td><td>${time} (${svc?.duration_minutes}min)</td></tr>`;
        let prices = `<tr><td>${svc?.name}</td><td>€${base.toFixed(2)}</td></tr>`;

        // Addon logic (abbreviated)
        state.sel.addons.forEach(sel => {
            const a = state.data.addons.find(x => x.id === sel.id);
            if (!a) return;
            const items = a.addon_items || [];
            if (items.length) {
                // Per Booking
                (sel.items || []).forEach((it, ii) => {
                    if (!it) return;
                    const def = items[ii]; if (!def) return;
                    const detail = it.variant ? ` ${it.variant}` : '';
                    const qty = it.qty || 1;
                    prices += `<tr><td>+ ${def.name}${detail}</td><td>€${(+a.price * qty).toFixed(2)}</td></tr>`;
                });
                // Per Guest
                (sel.guests || []).forEach((guest, gi) => {
                    let guestLabel = guestCount > 1 ? ` (G ${gi + 1})` : '';
                    (guest.items || []).forEach((it, ii) => {
                        if (!it) return;
                        const def = items[ii]; if (!def) return;
                        const detail = it.variant ? ` ${it.variant}` : '';
                        const qty = it.qty || 1;
                        prices += `<tr><td>+ ${def.name}${detail}${guestLabel}</td><td>€${(+a.price * qty).toFixed(2)}</td></tr>`;
                    });
                });
            } else {
                const total = +a.price * guestCount;
                prices += `<tr><td>+ ${a.name}${guestCount > 1 ? ` ×${guestCount}` : ''}</td><td>€${total.toFixed(2)}</td></tr>`;
            }
        });

        if (+svc?.cleaning_fee) prices += `<tr><td>Reinigung</td><td>€${(+svc.cleaning_fee).toFixed(2)}</td></tr>`;
        if (state.voucher.data) prices += `<tr><td>🎫 ${state.voucher.data.name}</td><td>-€${calcDisc().toFixed(2)}</td></tr>`;
        prices += `<tr class="bf-total"><td><strong>Gesamt</strong></td><td><strong>€${calcTotal().toFixed(2)}</strong></td></tr>`;

        c.innerHTML = `
            <div class="bf-grid-2">
                <div class="bf-form-column">
                    <h3 style="margin-top:0">Ihre Daten</h3>
                    ${formParams}
                </div>
                <div class="bf-summary-column">
                    <h3 style="margin-top:0">Zusammenfassung</h3>
                    <table class="bf-summary"><tbody>${rows}</tbody></table>
                    <hr>
                    <table class="bf-prices"><tbody>${prices}</tbody></table>
                </div>
            </div>
        `;

        if (td) td.innerHTML = `<strong>Gesamt: €${calcTotal().toFixed(2)}</strong>`;

        // Bind inputs
        c.querySelectorAll('input[data-bind]').forEach(i => {
            i.oninput = e => { state.sel[i.dataset.bind] = e.target.value; };
        });
    };

    const updVoucher = () => {
        const c = disp('voucher-status');
        if (!c) return;
        const v = state.voucher;
        c.innerHTML = v.status === 'valid' ? `<p data-voucher="valid">✅ ${v.data?.name}</p>` : v.status === 'invalid' ? `<p data-voucher="invalid">❌ ${v.error}</p>` : v.status === 'checking' ? '<p data-voucher="checking">⏳</p>' : '';
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
    const selService = async id => {
        state.sel.service = state.data.services.find(s => s.id === id);
        state.sel.startDate = state.sel.endDate = state.sel.time = null;
        state.sel.staff = undefined;
        state.slots = [];
        state.cal.selectingEnd = false;
        state.availStatus = null;
        popServices(); popStaff();
        if (!state.data.staff.some(s => s.linked_service_ids?.includes(id))) { await loadAvail(); popCal(); }
    };

    const selStaff = async id => {
        state.sel.staff = id;
        state.sel.startDate = state.sel.endDate = state.sel.time = null;
        state.slots = [];
        state.availStatus = null;
        popStaff(); await loadAvail(); popCal();
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
            } else { state.sel.startDate = ds; state.sel.endDate = null; state.cal.selectingEnd = true; }
        } else {
            state.sel.startDate = ds; state.sel.endDate = state.sel.time = null;
            if (svc?.service_type === 'hourly') {
                const bookings = state.cal.avail?.bookings?.filter(b => normDate(b.date) === ds) || [];
                state.slots = genSlots(svc, state.sel.object, bookings);
            } else {
                await checkAvail();
            }
        }
        popCal(); popSlots(); popDateInfo();
    };

    const selTime = async t => {
        state.sel.time = t;
        popSlots();
        await checkAvail();
        popSlots(); popDateInfo();
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
            const errEl = root.querySelector('[data-bf-error]');
            if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
            else alert(msg);
            if (btn) { btn.value = originalBtnText; btn.disabled = false; }
            submitting = false;
        }
    };

    // --- Event-Binding ---
    const bind = () => {
        $$('[data-bf-action="next"],[data-bf-action="back"]').forEach(b => b.onclick = e => {
            e.preventDefault();
            const action = b.dataset.bfAction;

            if (action === 'next') {
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
    const init = async () => {
        root = document.querySelector('[data-bf-root="true"]');
        if (!root) return;
        css();

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
        if (!d || d.error) return;
        state.data = d;

        fetch(`${API}/rest/v1/rpc/ping_site`, {
            method: 'POST', keepalive: true, headers: HDR,
            body: JSON.stringify({ site_id: siteId, p_domain: location.hostname })
        }).catch(() => {});

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
        bind();
        show(1);
        track('widget_view');
    };

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
