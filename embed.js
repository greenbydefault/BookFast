(function () {
    const currentScript = document.currentScript;
    const siteId = currentScript.getAttribute('data-site-id');

    if (!siteId) {
        console.error('BookFast: No data-site-id found.');
        return;
    }

    const SUPABASE_URL = 'https://yolidffzpvkizdqqcolk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbGlkZmZ6cHZraXpkcXFjb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODU4OTMsImV4cCI6MjA4NTI2MTg5M30._V6ZbzwIZvTKkBTUVNbDLWmcDvBrKOJuKUlT2N5q0Fs';

    // State
    let state = {
        step: 1,
        loading: false,
        data: {
            objects: [],
            services: [],
            addons: [],
            staff: []
        },
        selection: {
            fname: '', lname: '', email: '', phone: '',
            object: null,
            service: null,
            date: null,
            time: null,
            duration: null,
            addons: [] // Array of {id, items: [{name, variant}]}
        }
    };

    // --- API Helpers ---

    const callRpc = async (fn, params = {}) => {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                },
                body: JSON.stringify(params)
            });
            if (!res.ok) throw new Error(await res.text());
            return await res.json();
        } catch (err) {
            console.error(`BookFast RPC Error (${fn}):`, err);
            return null;
        }
    };

    // --- UI Construction ---

    const container = document.createElement('div');
    container.id = 'bookfast-widget-root';
    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: 'open' });

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        :host {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --primary: #2563eb;
            --bg: #1e1e1e;
            --text: #ffffff;
            --input-bg: #2d2d2d;
            --border: #404040;
            --disabled: #555;
        }
        
        * { box-sizing: border-box; }

        .fab {
            position: fixed; bottom: 2rem; right: 2rem;
            background: var(--primary); color: white;
            padding: 1rem 1.5rem; border-radius: 50px;
            cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: 600; transition: transform 0.2s;
            z-index: 9999; border: none; display: flex; align-items: center; gap: 0.5rem;
        }
        .fab:hover { transform: translateY(-2px); }

        .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .modal-overlay.open { opacity: 1; pointer-events: all; }

        .modal {
            background: var(--bg); color: var(--text);
            width: 90%; max-width: 500px; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 2rem;
            position: relative; transform: translateY(20px);
            transition: transform 0.3s ease; max-height: 90vh; overflow-y: auto;
            border: 1px solid var(--border);
        }
        .modal-overlay.open .modal { transform: translateY(0); }

        .close-btn {
            position: absolute; top: 1rem; right: 1rem;
            background: none; border: none; color: #888;
            font-size: 1.5rem; cursor: pointer;
        }

        .step { display: none; }
        .step.active { display: block; animation: fadeIn 0.3s; }

        h2 { margin-top: 0; margin-bottom: 0.5rem; }
        p { color: #aaa; margin-bottom: 1.5rem; line-height: 1.5; font-size: 0.9rem; }

        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: #ccc; }
        input, select, textarea {
            width: 100%; padding: 0.8rem; background: var(--input-bg);
            border: 1px solid var(--border); border-radius: 6px;
            color: white; font-size: 1rem;
        }
        input:focus { outline: 2px solid var(--primary); border-color: transparent; }

        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .card {
            background: var(--input-bg); border: 1px solid var(--border);
            padding: 1rem; border-radius: 8px; cursor: pointer;
            text-align: left; transition: all 0.2s;
        }
        .card:hover { border-color: var(--primary); }
        .card.selected { background: var(--primary); border-color: var(--primary); }
        .card h4 { margin: 0 0 0.3rem 0; font-size: 1rem; }
        .card small { color: #bbb; display: block; font-size: 0.8rem; }
        .card.selected small { color: #eee; }

        .btn {
            background: var(--primary); color: white; border: none;
            padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer;
            width: 100%; font-size: 1rem; margin-top: 1rem;
        }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; background: var(--disabled); }
        .btn-outline { background: transparent; border: 1px solid var(--border); margin-top: 0.5rem; }
        
        .addon-item {
            background: rgba(255,255,255,0.05); padding: 0.8rem;
            border-radius: 6px; margin-bottom: 0.5rem;
            border: 1px solid transparent; cursor: pointer;
        }
        .addon-item.selected { border-color: var(--primary); background: rgba(37, 99, 235, 0.2); }

        .error-msg { color: #ef4444; font-size: 0.8rem; margin-top: 0.5rem; display: none; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    `;
    shadow.appendChild(style);

    // Initial Loading State UI
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = `<span>📅</span> Book Now`;
    shadow.appendChild(fab);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    // We will inject the content dynamically based on state
    shadow.appendChild(overlay);


    // --- Logic & Rendering ---

    const render = () => {
        // Only render the Modal Inner Content
        const modalContent = `
            <div class="modal">
                <button class="close-btn">&times;</button>
                
                <!-- Loading -->
                <div id="step-loading" class="step ${state.loading ? 'active' : ''}">
                    <div style="text-align: center; padding: 2rem;">Loading...</div>
                </div>

                <!-- Step 1: Contact Info -->
                <div id="step-1" class="step ${!state.loading && state.step === 1 ? 'active' : ''}">
                    <h2>Contact Info</h2>
                    <p>Enter your details to proceed.</p>
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" id="fname" value="${state.selection.fname}" placeholder="Max">
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" id="lname" value="${state.selection.lname}" placeholder="Mustermann">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" value="${state.selection.email}" placeholder="max@example.com">
                    </div>
                     <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="phone" value="${state.selection.phone}" placeholder="+123456789">
                    </div>
                    <button class="btn" id="btn-step-1">Next</button>
                </div>

                <!-- Step 2: Select Object -->
                <div id="step-2" class="step ${!state.loading && state.step === 2 ? 'active' : ''}">
                    <h2>Choose Object</h2>
                    <p>Select the room or object you want to book.</p>
                    <div class="grid" id="obj-list">
                        ${state.data.objects.map(obj => `
                            <div class="card ${state.selection.object?.id === obj.id ? 'selected' : ''}" data-id="${obj.id}" onclick="this.getRootNode().host.selectObject('${obj.id}')">
                                <h4>${obj.name}</h4>
                                <small>Cap: ${obj.capacity} • ${obj.description || ''}</small>
                            </div>
                        `).join('')}
                    </div>
                    <p class="error-msg" id="err-step-2">Please select an object.</p>
                    <button class="btn" id="btn-step-2" ${!state.selection.object ? 'disabled' : ''}>Next</button>
                    <button class="btn btn-outline" onclick="this.getRootNode().host.setStep(1)">Back</button>
                </div>

                <!-- Step 3: Select Service -->
                <div id="step-3" class="step ${!state.loading && state.step === 3 ? 'active' : ''}">
                    <h2>Choose Service</h2>
                    <p>What service would you like?</p>
                    <div class="grid">
                        ${state.data.services
                .filter(s => s.object_id === state.selection.object?.id)
                .map(svc => `
                            <div class="card ${state.selection.service?.id === svc.id ? 'selected' : ''}" data-id="${svc.id}" onclick="this.getRootNode().host.selectService('${svc.id}')">
                                <h4>${svc.name}</h4>
                                <small>€${svc.price} • ${svc.type}</small>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${state.selection.service ? `
                        <div style="margin-top: 1.5rem;">
                            <label>Select Date</label>
                            <input type="date" id="date-picker" value="${state.selection.date || ''}" min="${new Date().toISOString().split('T')[0]}" onchange="this.getRootNode().host.selectDate(this.value)">
                        </div>
                        <div style="margin-top: 1rem;">
                            <label>Start Time</label>
                            <input type="time" id="time-picker" value="${state.selection.time || ''}" onchange="this.getRootNode().host.selectTime(this.value)">
                        </div>
                        <div id="avail-msg" style="margin-top:0.5rem; font-size: 0.9rem;"></div>
                    ` : ''}

                    <p class="error-msg" id="err-step-3"></p>
                    <button class="btn" id="btn-step-3" disabled>Next</button>
                    <button class="btn btn-outline" onclick="this.getRootNode().host.setStep(2)">Back</button>
                </div>
                
                 <!-- Step 4: Add-ons -->
                <div id="step-4" class="step ${!state.loading && state.step === 4 ? 'active' : ''}">
                    <h2>Enhance your stay</h2>
                    <p>Select optional add-ons.</p>
                    <div id="addons-list">
                         ${state.data.addons
                .filter(a => a.linked_service_ids.includes(state.selection.service?.id))
                .map(addon => {
                    const isSelected = state.selection.addons.includes(addon.id);
                    return `
                                <div class="addon-item ${isSelected ? 'selected' : ''}" onclick="this.getRootNode().host.toggleAddon('${addon.id}')">
                                    <div style="display:flex; justify-content:space-between;">
                                        <strong>${addon.name}</strong>
                                        <span>+€${addon.price}</span>
                                    </div>
                                    <small style="color:#aaa;">${addon.items.map(i => i.name).join(', ')}</small>
                                </div>
                                `;
                }).join('')}
                    </div>
                     ${state.data.addons.filter(a => a.linked_service_ids.includes(state.selection.service?.id)).length === 0 ? '<p>No add-ons available for this service.</p>' : ''}
    
                    <button class="btn" onclick="this.getRootNode().host.setStep(5)">Next</button>
                    <button class="btn btn-outline" onclick="this.getRootNode().host.setStep(3)">Back</button>
                </div>

                <!-- Step 5: Summary & Submit -->
                <div id="step-5" class="step ${!state.loading && state.step === 5 ? 'active' : ''}">
                    <h2>Summary</h2>
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <p style="margin:0; color: white;"><strong>${state.selection.fname} ${state.selection.lname}</strong></p>
                        <p style="margin:0.2rem 0; font-size: 0.9rem;">${state.selection.email}</p>
                        <hr style="border:0; border-top:1px solid #444; margin: 0.5rem 0;">
                        <p style="margin:0; display:flex; justify-content:space-between;">
                            <span>${state.selection.service?.name}</span>
                            <span>€${state.selection.service?.price}</span>
                        </p>
                        <p style="margin:0; font-size: 0.8rem; color: #aaa;">${state.selection.date} @ ${state.selection.time} (${state.selection.service?.duration || '?'} min)</p>
                        ${state.selection.addons.map(aid => {
                    const a = state.data.addons.find(x => x.id === aid);
                    return `<p style="margin:0.2rem 0; display:flex; justify-content:space-between; font-size:0.9rem;"><span>+ ${a.name}</span><span>€${a.price}</span></p>`;
                }).join('')}
                         <hr style="border:0; border-top:1px solid #444; margin: 0.5rem 0;">
                         <p style="margin:0; display:flex; justify-content:space-between; font-weight:bold; font-size: 1.1rem;">
                            <span>Total</span>
                            <span>€${(Number(state.selection.service?.price || 0) + state.selection.addons.reduce((sum, aid) => sum + Number(state.data.addons.find(x => x.id === aid)?.price || 0), 0)).toFixed(2)}</span>
                        </p>
                    </div>

                    <button class="btn" id="btn-submit">Confirm Booking</button>
                    <button class="btn btn-outline" onclick="this.getRootNode().host.setStep(4)">Back</button>
                </div>

                <!-- Step Success -->
                <div id="step-success" class="step ${state.step === 6 ? 'active' : ''}">
                    <div style="text-align: center; padding: 2rem 0;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                         <h2>Booking Received!</h2>
                        <p>We won't charge you yet. You will receive a confirmation email shortly.</p>
                        <button class="btn close-btn-final">Close</button>
                    </div>
                </div>

            </div>
        `;

        overlay.innerHTML = modalContent;

        // Re-attach standard events
        const closeBtns = overlay.querySelectorAll('.close-btn, .close-btn-final');
        closeBtns.forEach(b => b.onclick = () => overlay.classList.remove('open'));

        if (state.step === 1) {
            overlay.querySelector('#btn-step-1').onclick = () => {
                state.selection.fname = overlay.querySelector('#fname').value;
                state.selection.lname = overlay.querySelector('#lname').value;
                state.selection.email = overlay.querySelector('#email').value;
                state.selection.phone = overlay.querySelector('#phone').value;
                if (!state.selection.fname || !state.selection.email) return alert('Name and Email required');
                setStep(2);
            };
        }

        if (state.step === 2) {
            const btn2 = overlay.querySelector('#btn-step-2');
            if (btn2) {
                btn2.onclick = () => {
                    if (!state.selection.object) return;
                    setStep(3);
                };
            }
        }

        if (state.step === 3) {
            const btn3 = overlay.querySelector('#btn-step-3');
            if (btn3) {
                btn3.onclick = () => {
                    if (!state.selection.service || !state.selection.date || !state.selection.time) return;
                    setStep(4);
                };
            }
        }

        if (state.step === 5) {
            overlay.querySelector('#btn-submit').onclick = submitBooking;
        }
    };

    // --- Actions ---

    const init = async () => {
        state.loading = true;
        render(); // show loading
        const data = await callRpc('get_widget_data', { p_site_id: siteId });
        state.loading = false;
        if (data) state.data = data;
        render();
    };

    // Exposed methods for inline onclicks in render()
    container.setStep = (n) => { state.step = n; render(); };
    container.selectObject = (id) => {
        state.selection.object = state.data.objects.find(o => o.id === id);
        state.selection.service = null; // reset service
        render();
    };
    container.selectService = (id) => {
        state.selection.service = state.data.services.find(s => s.id === id);
        render();
    };
    container.selectDate = async (val) => { state.selection.date = val; checkAvail(); };
    container.selectTime = async (val) => { state.selection.time = val; checkAvail(); };

    container.toggleAddon = (id) => {
        if (state.selection.addons.includes(id)) {
            state.selection.addons = state.selection.addons.filter(x => x !== id);
        } else {
            state.selection.addons.push(id);
        }
        render();
    };

    const checkAvail = async () => {
        const { date, time, service, object } = state.selection;
        const msgEl = shadow.querySelector('#avail-msg');
        const nextBtn = shadow.querySelector('#btn-step-3');

        if (!date || !time || !service) {
            nextBtn.disabled = true;
            return;
        }

        // Calculate End Time based on duration
        const startIso = `${date}T${time}:00`; // simple ISO construction
        const startTime = new Date(startIso);
        const durationMin = service.duration || 60; // default 1h if not set
        const endTime = new Date(startTime.getTime() + durationMin * 60000);

        msgEl.innerHTML = '<span style="color:#aaa">Checking availability...</span>';
        nextBtn.disabled = true;

        const isFree = await callRpc('check_availability', {
            p_object_id: object.id,
            p_start_time: startTime.toISOString(),
            p_end_time: endTime.toISOString()
        });

        if (isFree === true) {
            msgEl.innerHTML = '<span style="color:#10b981">✅ Available</span>';
            nextBtn.disabled = false;
        } else {
            msgEl.innerHTML = '<span style="color:#ef4444">❌ Not available. Try another time.</span>';
            nextBtn.disabled = true;
        }
    };

    const submitBooking = async () => {
        const btn = shadow.querySelector('#btn-submit');
        btn.textContent = 'Processing...';
        btn.disabled = true;

        const { date, time, service, object, addons } = state.selection;
        const startIso = `${date}T${time}:00`;
        const startTime = new Date(startIso);
        const durationMin = service.duration || 60;
        const endTime = new Date(startTime.getTime() + durationMin * 60000);

        const res = await callRpc('create_booking_request', {
            p_site_id: siteId,
            p_object_id: object.id,
            p_service_id: service.id,
            p_start_time: startTime.toISOString(),
            p_end_time: endTime.toISOString(),
            p_customer_name: `${state.selection.fname} ${state.selection.lname}`,
            p_customer_email: state.selection.email,
            p_customer_phone: state.selection.phone,
            p_customer_notes: 'Widget Booking',
            p_addon_ids: addons
        });

        if (res && res.success) {
            setStep(6);
        } else {
            alert('Booking failed: ' + (res?.error || 'Unknown error'));
            setStep(5); // go back
        }
    };

    // Helper to call exposed methods from global scope needs hack or proper event binding
    // Since we put onclick="this.getRootNode().host.setStep(1)" in HTML, we need to attach methods to host.
    // 'container' is the host.

    const setStep = (n) => { state.step = n; render(); }; // local ref

    // Open/Close
    fab.addEventListener('click', () => {
        if (!state.data.objects.length) init(); // Load only on first open
        overlay.classList.add('open');
    });

})();
