/**
 * Sites Page - Objekte/Sites Dashboard View
 */
import { supabase } from '../../lib/supabaseClient.js';
import { getState, setState } from '../../lib/store.js';
import { fetchEntities, createEntity } from '../../lib/dataLayer.js';
import { createButton } from '../../components/Button/Button.js';

/**
 * Fetch sites using dataLayer
 */
export const fetchSites = async () => {
  const result = await fetchEntities('sites');
  setState({ sites: result.items });
  renderSitesList();
};

/**
 * Handle adding a new site
 */
const handleAddSite = async () => {
  const name = prompt('Enter Site Name:');
  const domain = prompt('Enter Domain (e.g. example.com):');

  if (name) {
    try {
      const newSite = await createEntity('sites', { name, domain });
      const currentSites = getState().sites;
      setState({ sites: [...currentSites, newSite] });
      renderSitesList();
    } catch (error) {
      alert(error.message);
    }
  }
};

/**
 * Check connection status
 */
const checkConnection = async (workspaceId) => {
  const state = getState();
  if (state.currentWorkspace && state.currentWorkspace.id === workspaceId) {
    await fetchSites();
    const site = state.sites[0];
    if (site && site.is_active) {
      alert('Connection successful! Site is active.');
    } else {
      alert('Connection not yet detected. Please ensure you have added the script to your site and refreshed that page.');
    }
  }
};

/**
 * View site details/analytics
 */
const viewSiteDetails = async (siteId) => {
  const detailsEl = document.getElementById(`details-${siteId}`);
  if (!detailsEl) return;

  if (detailsEl.style.display === 'block') {
    detailsEl.style.display = 'none';
    return;
  }

  detailsEl.style.display = 'block';

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(20);

  const listEl = detailsEl.querySelector('.events-list');

  if (error) {
    listEl.innerHTML = `<span style="color: red;">Error loading events</span>`;
    return;
  }

  if (!events || events.length === 0) {
    listEl.innerHTML = `No events tracked yet.`;
    return;
  }

  listEl.innerHTML = events.map(e => `
    <div style="display: flex; justify-content: space-between; padding: 0.2rem 0; border-bottom: 1px solid #222;">
      <span>${e.event_type}</span>
      <span style="font-size: 0.75rem; color: #666;">${new Date(e.created_at).toLocaleTimeString()}</span>
    </div>
  `).join('');
};

/**
 * Render the sites list
 */
const renderSitesList = () => {
  const container = document.getElementById('sites-grid');
  if (!container) return;

  const state = getState();
  container.innerHTML = '';

  if (state.sites.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No sites yet. Create one to get started.</p>`;
    return;
  }

  state.sites.forEach(site => {
    const card = document.createElement('div');
    card.style.background = 'var(--bg-card)';
    card.style.padding = '1.5rem';
    card.style.borderRadius = '8px';
    card.style.border = '1px solid rgba(255,255,255,0.05)';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <h3 style="margin: 0;">${site.name}</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.8rem; background: ${site.is_active ? '#10b98120' : '#333'}; color: ${site.is_active ? '#10b981' : '#888'}; padding: 0.2rem 0.6rem; border-radius: 12px;">
            ${site.is_active ? 'Active' : 'Pending'}
          </span>
          ${!site.is_active ? `<button class="check-connection-btn" data-workspace-id="${site.workspace_id}" style="background: none; border: 1px solid #444; color: var(--text-muted); cursor: pointer; border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.7rem;">Check Connection</button>` : ''}
        </div>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">${site.domain || 'No domain verified'}</p>
      
      <div style="background: #111; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; border: 1px solid #333;">
        <p style="color: #888; font-size: 0.8rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Booking Widget Installation</p>
        <div style="display: flex; gap: 0.5rem;">
          <code style="flex: 1; background: #000; padding: 0.5rem; border-radius: 4px; color: #a5f3fc; font-size: 0.8em; overflow-x: auto; white-space: nowrap; font-family: monospace;">
            &lt;script src="${window.location.origin}/embed.js" data-site-id="${site.id}"&gt;&lt;/script&gt;
          </code>
          <button class="copy-btn" data-code="<script src='${window.location.origin}/embed.js' data-site-id='${site.id}'></script>" style="background: #333; border: 1px solid #444; color: white; padding: 0 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Copy</button>
        </div>
        <p style="color: #666; font-size: 0.8rem; margin-top: 0.5rem;">Copy and paste this code into your website's &lt;body&gt; to enable the Booking Widget.</p>
      </div>

      <div class="actions">
        <button class="view-details-btn btn" data-site-id="${site.id}" style="width: 100%; font-size: 0.9rem;">View Analytics</button>
      </div>
      
      <div id="details-${site.id}" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #fff;">Recent Events</h4>
        <div class="events-list" style="max-height: 150px; overflow-y: auto; font-size: 0.8rem; color: #aaa;">Loading...</div>
      </div>
    `;
    container.appendChild(card);
  });
};

/**
 * Main render function for sites page
 */
export const renderSitesPage = () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb"><a href="#">Home</a> / Objekte</div>
      <h1 class="page-title">My Sites</h1>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
      <div id="add-site-btn"></div>
    </div>
    <div id="sites-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
    </div>
  `;

  // Add site button
  const addSiteBtn = createButton('+ Add Site', handleAddSite, 'btn-primary');
  document.querySelector('#add-site-btn').appendChild(addSiteBtn);

  // Event delegation
  mainContent.addEventListener('click', (e) => {
    const checkBtn = e.target.closest('.check-connection-btn');
    if (checkBtn) {
      checkConnection(checkBtn.dataset.workspaceId);
      return;
    }

    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      navigator.clipboard.writeText(copyBtn.dataset.code);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      return;
    }

    const viewBtn = e.target.closest('.view-details-btn');
    if (viewBtn) {
      viewSiteDetails(viewBtn.dataset.siteId);
      return;
    }
  });

  // Load sites
  fetchSites();
};
