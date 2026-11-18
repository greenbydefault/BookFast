/**
 * Landing Navigation Component
 * Sticky top nav with direct links.
 */
import { getIconString } from '../Icons/Icon.js';
import { getAllFeaturePages } from '../../lib/getLocaleContent.js';
import {
  DISABLED_FEATURE_SLUGS,
  FEATURE_GROUPS,
  FEATURE_ICON_MAP,
  NAV_ITEMS,
} from './navConfig.js';
import { getLocaleFromPath, normalizeLandingPath } from '../../lib/landingLocale.js';
import { getLocaleSwitchTarget } from '../../lib/landingLocaleRoutes.js';
import { deFeatureSlugToEn } from '../../lib/featureSlugLocale.js';
import { getUiChrome } from '../../locales/uiChrome.js';

const localizeNavHref = (deHref, locale) =>
  locale === 'en' ? getLocaleSwitchTarget(deHref, 'en') : deHref;

const truncateTo7Words = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim().split(/\s+/).slice(0, 7).join(' ');
};

const getFeaturePathForLocale = (slug, locale) => {
  const enSlug = deFeatureSlugToEn(slug);
  if (locale === 'en' && enSlug) return `/en/features/${enSlug}`;
  return `/features/${slug}`;
};

const abortNavListeners = (nav) => {
  nav._landingNavAbort?.abort();
  nav._landingNavAbort = null;
};

const buildMegaFeaturesHTML = (locale) => {
  const pages = getAllFeaturePages(locale);

  return FEATURE_GROUPS.map((group) => {
    const heading = locale === 'en' ? (group.labelEn || group.label) : group.label;
    const items = group.slugs
      .map((slug) => {
        const page = pages[slug];
        if (!page?.meta?.title) return '';

        const iconName = FEATURE_ICON_MAP[slug] || 'target';
        const desc = truncateTo7Words(page.meta.description || page.hero?.subheadline || '');
        const disabled = DISABLED_FEATURE_SLUGS.has(slug);
        const tag = disabled ? 'span' : 'a';
        const href = disabled ? '' : ` href="${getFeaturePathForLocale(slug, locale)}"`;
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
        <div class="landing-mega-column-title">${heading}</div>
        <div class="landing-mega-column-items">${items}</div>
      </div>
    `;
  }).join('');
};

const getCurrentLandingChromeState = () => {
  const path = normalizeLandingPath(
    window.location.pathname === '/index.html' ? '/' : window.location.pathname,
  );
  const locale = getLocaleFromPath(path);
  return {
    locale,
    hrefDe: getLocaleSwitchTarget(path, 'de'),
    hrefEn: getLocaleSwitchTarget(path, 'en'),
    homeHref: locale === 'en' ? '/en' : '/',
  };
};

const patchLangLinks = (nav, { locale, hrefDe, hrefEn, homeHref, chrome }) => {
  const logo = nav.querySelector('.landing-nav-logo');
  if (logo) {
    logo.setAttribute('href', homeHref);
    logo.setAttribute('title', chrome.nav.logoTitle);
  }

  const deLink = nav.querySelector('.landing-lang-link[lang="de"]');
  const enLink = nav.querySelector('.landing-lang-link[lang="en"]');

  if (deLink) {
    deLink.setAttribute('href', hrefDe);
    deLink.classList.toggle('is-active', locale === 'de');
    if (locale === 'de') deLink.setAttribute('aria-current', 'true');
    else deLink.removeAttribute('aria-current');
  }

  if (enLink) {
    enLink.setAttribute('href', hrefEn);
    enLink.classList.toggle('is-active', locale === 'en');
    if (locale === 'en') enLink.setAttribute('aria-current', 'true');
    else enLink.removeAttribute('aria-current');
  }
};

const bindNavigationInteractions = (nav) => {
  abortNavListeners(nav);
  const ac = new AbortController();
  nav._landingNavAbort = ac;
  const { signal } = ac;

  const setMegaOpen = (wrap, megaMenu, open) => {
    megaMenu.classList.toggle('open', open);
    wrap.classList.toggle('mega-open', open);
    const trigger = wrap.querySelector('.landing-nav-mega-trigger');
    trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const closeMegaMenus = () => {
    nav.querySelectorAll('.landing-nav-mega-menu').forEach((menu) => menu.classList.remove('open'));
    nav.querySelectorAll('.landing-nav-mega-wrap').forEach((wrap) => wrap.classList.remove('mega-open'));
    nav.querySelectorAll('.landing-nav-mega-trigger').forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const CLOSE_DELAY_MS = 150;
  nav.querySelectorAll('.landing-nav-mega-trigger').forEach((trigger) => {
    const megaId = trigger.getAttribute('data-mega');
    const megaMenu = nav.querySelector(`#mega-${megaId}`);
    const wrap = trigger.closest('.landing-nav-mega-wrap');
    if (!megaMenu || !wrap) return;

    let closeTimeout = null;
    const open = () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = null;
      closeMegaMenus();
      setMegaOpen(wrap, megaMenu, true);
    };
    const close = () => {
      setMegaOpen(wrap, megaMenu, false);
    };
    const scheduleClose = () => {
      closeTimeout = setTimeout(() => {
        closeTimeout = null;
        close();
      }, CLOSE_DELAY_MS);
    };
    const cancelClose = () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = null;
    };

    trigger.addEventListener('mouseenter', open, { signal });
    wrap.addEventListener('mouseleave', scheduleClose, { signal });
    megaMenu.addEventListener('mouseenter', () => {
      cancelClose();
      open();
    }, { signal });
    megaMenu.addEventListener('mouseleave', scheduleClose, { signal });
  });

  document.addEventListener('click', (e) => {
    if (!nav.isConnected) {
      ac.abort();
      return;
    }
    if (!nav.contains(e.target)) closeMegaMenus();
  }, { signal });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMegaMenus();
  }, { signal });

  nav.querySelectorAll('.landing-mega-item[data-landing-link]').forEach((link) => {
    link.addEventListener('click', () => {
      closeMegaMenus();
    }, { signal });
  });

  const mobileToggle = nav.querySelector('.landing-nav-mobile-toggle');
  const mobileMenu = nav.querySelector('#mobile-menu');
  mobileToggle?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }, { signal });

  nav.querySelectorAll('#mobile-menu a[data-landing-link]').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }, { signal });
  });
};

export const syncLandingNavigationChrome = (root = document, { isLoggedIn } = {}) => {
  const state = getCurrentLandingChromeState();
  const chrome = getUiChrome(state.locale);

  root.querySelectorAll('.landing-skip-link').forEach((skip) => {
    skip.textContent = chrome.skipLink;
  });

  root.querySelectorAll('.landing-nav').forEach((nav) => {
    const currentLocale = nav.dataset.locale || 'de';
    const loggedIn = isLoggedIn ?? nav.dataset.loggedIn === 'true';

    if (currentLocale !== state.locale) {
      abortNavListeners(nav);
      const container = document.createElement('div');
      renderNavigation(container, { isLoggedIn: loggedIn });
      const next = container.firstElementChild;
      if (next) nav.replaceWith(next);
      return;
    }

    patchLangLinks(nav, { ...state, chrome });
  });
};

/**
 * Render the navigation into a container element
 */
export const renderNavigation = (container, options = {}) => {
  const isLoggedIn = options.isLoggedIn || false;
  const { locale, hrefDe, hrefEn, homeHref } = getCurrentLandingChromeState();
  const chrome = getUiChrome(locale);
  const nav = document.createElement('header');
  nav.className = 'landing-nav';
  nav.dataset.locale = locale;
  nav.dataset.loggedIn = isLoggedIn ? 'true' : 'false';

  const navLabel = (key, fallback) => chrome.nav[key] || fallback;
  const linksHTML = NAV_ITEMS.map((item) => {
    const label = navLabel(item.labelKey, item.label);
    if (item.labelKey === 'features') {
      return `
        <div class="landing-nav-mega-wrap">
          <a href="${localizeNavHref(item.href, locale)}" class="landing-nav-link landing-nav-mega-trigger" data-mega="features" data-landing-link title="${label}" aria-haspopup="true" aria-expanded="false" aria-controls="mega-features">
            ${label} <span class="landing-nav-caret">${getIconString('arrow-down', 'landing-nav-caret-icon')}</span>
          </a>
          <div class="landing-nav-mega-menu" id="mega-features">
            <div class="landing-mega-grid">${buildMegaFeaturesHTML(locale)}</div>
          </div>
        </div>
      `;
    }
    return `<a href="${localizeNavHref(item.href, locale)}" class="landing-nav-link" data-landing-link title="${label}">${label}</a>`;
  }).join('');

  const mobileLinksHTML = NAV_ITEMS.map((item) => {
    const label = navLabel(item.labelKey, item.label);
    const href = localizeNavHref(item.href, locale);
    return `<li><a href="${href}" data-landing-link title="${label}">${label}</a></li>`;
  }).join('');
  const dashboardLabel = chrome.nav.dashboard;
  const waitlistLabel = chrome.nav.waitlist;

  nav.innerHTML = `
    <div class="landing-nav-inner">
      <a href="${homeHref}" class="landing-nav-logo" data-landing-link title="${chrome.nav.logoTitle}">BookFast</a>
      <nav class="landing-nav-links" aria-label="${chrome.nav.mainNavLabel}">${linksHTML}</nav>
      <div class="landing-nav-actions">
        <div class="landing-lang-switch" role="group" aria-label="${chrome.nav.langSwitchLabel}">
          <a href="${hrefDe}" class="landing-lang-link ${locale === 'de' ? 'is-active' : ''}" data-landing-link lang="de"${locale === 'de' ? ' aria-current="true"' : ''}>DE</a>
          <span class="landing-lang-sep" aria-hidden="true">|</span>
          <a href="${hrefEn}" class="landing-lang-link ${locale === 'en' ? 'is-active' : ''}" data-landing-link lang="en"${locale === 'en' ? ' aria-current="true"' : ''}>EN</a>
        </div>
        ${isLoggedIn
          ? `<a href="/dashboard/bookings" class="landing-btn landing-btn-ghost landing-btn-sm" title="${dashboardLabel}"><span class="landing-btn__icon">${getIconString('arrow-right', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${dashboardLabel}</span></a>`
          : `<a href="#" class="landing-btn landing-btn-primary landing-btn-sm nav-join-waitlist" data-landing-waitlist title="${waitlistLabel}"><span class="landing-btn__icon">${getIconString('mails', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${waitlistLabel}</span></a>`}
      </div>
      <button type="button" class="landing-nav-mobile-toggle" aria-label="${chrome.nav.menuLabel}" title="${chrome.nav.menuTitle}" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
    <div class="landing-nav-mobile-menu" id="mobile-menu">
      <ul class="landing-nav-mobile-links" aria-label="${chrome.nav.mobileNavLabel}">
        ${mobileLinksHTML}
      </ul>
      <div style="padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        ${isLoggedIn
          ? `<a href="/dashboard/bookings" class="landing-btn landing-btn-secondary" style="text-align:center;" title="${dashboardLabel}"><span class="landing-btn__icon">${getIconString('arrow-right', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${dashboardLabel}</span></a>`
          : `<a href="#" class="landing-btn landing-btn-primary landing-btn-sm nav-join-waitlist" style="text-align:center;" data-landing-waitlist title="${waitlistLabel}"><span class="landing-btn__icon">${getIconString('mails', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${waitlistLabel}</span></a>`}
      </div>
    </div>
  `;

  container.appendChild(nav);
  bindNavigationInteractions(nav);
};
