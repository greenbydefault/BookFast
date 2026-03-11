/**
 * Landing Navigation Component
 * Sticky top nav with mega menus for Features.
 */
import { getIconString } from '../Icons/Icon.js';
import { openWaitlistModal } from './WaitlistModal.js';
import { featurePages } from '../../data/features/index.js';
import {
  FEATURE_ICON_MAP,
  MEGA_FEATURE_CATEGORIES,
  MEGA_PRODUCT_ITEMS,
  NAV_ITEMS,
  DISABLED_FEATURE_SLUGS,
} from './navConfig.js';

/** Truncate text to max 7 words for mega menu descriptions */
function truncateTo7Words(str) {
  if (!str || typeof str !== 'string') return '';
  const words = str.trim().split(/\s+/).slice(0, 7);
  return words.join(' ');
}

function buildMegaProductHTML() {
  const items = MEGA_PRODUCT_ITEMS.map(item => `
    <a href="${item.href}" class="landing-mega-item" data-landing-link title="${item.label}">
      <span class="landing-mega-item-icon">${getIconString(item.icon)}</span>
      <div class="landing-mega-item-content">
        <span class="landing-mega-item-title">${item.label}</span>
        <span class="landing-mega-item-desc">${item.description}</span>
      </div>
    </a>
  `).join('');
  return `
    <div class="landing-mega-column">
      <div class="landing-mega-column-title">Produkt</div>
      <div class="landing-mega-column-items">${items}</div>
    </div>
  `;
}

function buildMegaFeaturesHTML() {
  return MEGA_FEATURE_CATEGORIES.map(cat => {
    const items = cat.slugs
      .map(slug => {
        const page = featurePages[slug];
        if (!page) return '';
        const iconName = FEATURE_ICON_MAP[slug] || 'target';
        const desc = truncateTo7Words(page.meta?.description || page.hero?.subheadline || '');
        const disabled = DISABLED_FEATURE_SLUGS.has(slug);
        const tag = disabled ? 'span' : 'a';
        const href = disabled ? '' : ` href="/features/${slug}"`;
        const cls = `landing-mega-item${disabled ? ' landing-mega-item--disabled' : ''}`;
        const dataLink = disabled ? '' : ' data-landing-link';
        const title = disabled ? '' : ` title="${page.meta.title}"`;
        return `
          <${tag}${href} class="${cls}"${dataLink}${title}>
            <span class="landing-mega-item-icon">${getIconString(iconName)}</span>
            <div class="landing-mega-item-content">
              <span class="landing-mega-item-title">${page.meta.title}</span>
              <span class="landing-mega-item-desc">${desc}</span>
            </div>
          </${tag}>
        `;
      })
      .filter(Boolean)
      .join('');
    return `
      <div class="landing-mega-column">
        <div class="landing-mega-column-title">${cat.label}</div>
        <div class="landing-mega-column-items">${items}</div>
      </div>
    `;
  }).join('');
}

/**
 * Render the navigation into a container element
 */
export const renderNavigation = (container, options = {}) => {
  const isLoggedIn = options.isLoggedIn || false;
  const nav = document.createElement('nav');
  nav.className = 'landing-nav';

  const linksHTML = NAV_ITEMS.map(item => {
    if (item.mega) {
      const megaContent = item.mega === 'features' ? buildMegaFeaturesHTML()
        : buildMegaProductHTML();
      return `
        <div class="landing-nav-mega-wrap">
          <a href="${item.href || '#'}" class="landing-nav-link landing-nav-mega-trigger" data-mega="${item.mega}" data-landing-link title="${item.label}">
            ${item.label} <span class="landing-nav-caret">${getIconString('arrow-down', 'landing-nav-caret-icon')}</span>
          </a>
          <div class="landing-nav-mega-menu" id="mega-${item.mega}">
            <div class="landing-mega-grid">${megaContent}</div>
          </div>
        </div>
      `;
    }
    if (item.children && !item.mega) {
      const childrenHTML = item.children.map(child =>
        `<a href="${child.href}" class="landing-nav-dropdown-item" data-landing-link title="${child.label}">${child.label}</a>`
      ).join('');
      return `
        <div class="landing-nav-dropdown">
          <a href="#" class="landing-nav-link">${item.label} <span class="landing-nav-caret">${getIconString('arrow-down', 'landing-nav-caret-icon')}</span></a>
          <div class="landing-nav-dropdown-menu">${childrenHTML}</div>
        </div>`;
    }
    return `<a href="${item.href}" class="landing-nav-link" data-landing-link title="${item.label}">${item.label}</a>`;
  }).join('');

  nav.innerHTML = `
    <div class="landing-nav-inner">
      <a href="/" class="landing-nav-logo" data-landing-link title="BookFast Startseite">BookFast</a>
      <div class="landing-nav-links">${linksHTML}</div>
      <div class="landing-nav-actions">
        ${isLoggedIn
          ? `<a href="/dashboard/bookings" class="landing-btn landing-btn-ghost landing-btn-sm" title="Zum Dashboard wechseln"><span class="landing-btn__icon">${getIconString('arrow-right', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">Zum Dashboard</span></a>`
          : `<a href="#" class="landing-btn landing-btn-primary landing-btn-sm nav-join-waitlist" data-landing-waitlist title="Zur BookFast Warteliste anmelden"><span class="landing-btn__icon">${getIconString('mails', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">Zur Warteliste anmelden</span></a>`}
      </div>
      <button class="landing-nav-mobile-toggle" aria-label="Menü" title="Menü öffnen oder schließen">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
    <div class="landing-nav-mobile-menu" id="mobile-menu">
      <a href="/produkt" data-landing-link title="Produkt">Produkt</a>
      <a href="/features" data-landing-link title="Features">Features</a>
      <a href="/preise" data-landing-link title="Preise">Preise</a>
      <div style="padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        ${isLoggedIn
          ? `<a href="/dashboard/bookings" class="landing-btn landing-btn-secondary" style="text-align:center;" title="Zum Dashboard wechseln"><span class="landing-btn__icon">${getIconString('arrow-right', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">Zum Dashboard</span></a>`
          : `<a href="#" class="landing-btn landing-btn-primary landing-btn-sm nav-join-waitlist" style="text-align:center;" data-landing-waitlist title="Zur BookFast Warteliste anmelden"><span class="landing-btn__icon">${getIconString('mails', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">Zur Warteliste anmelden</span></a>`}
      </div>
    </div>
  `;

  container.appendChild(nav);

  // Mega menu: hover with delay to avoid closing when moving slowly from trigger to menu
  const CLOSE_DELAY_MS = 150;
  nav.querySelectorAll('.landing-nav-mega-trigger').forEach(trigger => {
    const megaId = trigger.getAttribute('data-mega');
    const megaMenu = nav.querySelector(`#mega-${megaId}`);
    const wrap = trigger.closest('.landing-nav-mega-wrap');
    if (!megaMenu || !wrap) return;

    let closeTimeout = null;
    const open = () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = null;
      nav.querySelectorAll('.landing-nav-mega-menu').forEach(m => m.classList.remove('open'));
      nav.querySelectorAll('.landing-nav-mega-wrap').forEach(w => w.classList.remove('mega-open'));
      megaMenu.classList.add('open');
      wrap.classList.add('mega-open');
    };
    const close = () => {
      megaMenu.classList.remove('open');
      wrap.classList.remove('mega-open');
    };
    const scheduleClose = () => {
      closeTimeout = setTimeout(() => { closeTimeout = null; close(); }, CLOSE_DELAY_MS);
    };
    const cancelClose = () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = null;
    };

    trigger.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', () => scheduleClose());
    megaMenu.addEventListener('mouseenter', () => { cancelClose(); open(); });
    megaMenu.addEventListener('mouseleave', () => scheduleClose());
  });

  // Close mega on click outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      nav.querySelectorAll('.landing-nav-mega-menu').forEach(m => m.classList.remove('open'));
      nav.querySelectorAll('.landing-nav-mega-wrap').forEach(w => w.classList.remove('mega-open'));
    }
  });

  // Close on link click (navigation)
  nav.querySelectorAll('.landing-mega-item[data-landing-link]').forEach(link => {
    link.addEventListener('click', () => {
      nav.querySelectorAll('.landing-nav-mega-menu').forEach(m => m.classList.remove('open'));
      nav.querySelectorAll('.landing-nav-mega-wrap').forEach(w => w.classList.remove('mega-open'));
    });
  });

  // Mobile toggle
  nav.querySelector('.landing-nav-mobile-toggle').addEventListener('click', () => {
    nav.querySelector('#mobile-menu').classList.toggle('open');
  });

  nav.querySelectorAll('#mobile-menu a[data-landing-link]').forEach(link => {
    link.addEventListener('click', () => {
      nav.querySelector('#mobile-menu').classList.remove('open');
    });
  });

  // Waitlist button: open modal, prevent default
  nav.querySelectorAll('.nav-join-waitlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      nav.querySelector('#mobile-menu')?.classList.remove('open');
      openWaitlistModal();
    });
  });
};
