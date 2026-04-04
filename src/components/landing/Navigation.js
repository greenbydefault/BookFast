/**
 * Landing Navigation Component
 * Sticky top nav with direct links.
 */
import { getIconString } from '../Icons/Icon.js';
import { openWaitlistModal } from './WaitlistModal.js';
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
import { NAV_EN } from '../../locales/en/navigation.js';

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

export const syncLandingNavigationChrome = (root = document) => {
  const { locale, hrefDe, hrefEn, homeHref } = getCurrentLandingChromeState();

  root.querySelectorAll('.landing-nav').forEach((nav) => {
    const logo = nav.querySelector('.landing-nav-logo');
    if (logo) {
      logo.setAttribute('href', homeHref);
    }

    const deLink = nav.querySelector('.landing-lang-link[lang="de"]');
    const enLink = nav.querySelector('.landing-lang-link[lang="en"]');

    if (deLink) {
      deLink.setAttribute('href', hrefDe);
      deLink.classList.toggle('is-active', locale === 'de');
    }

    if (enLink) {
      enLink.setAttribute('href', hrefEn);
      enLink.classList.toggle('is-active', locale === 'en');
    }
  });
};

/**
 * Render the navigation into a container element
 */
export const renderNavigation = (container, options = {}) => {
  const isLoggedIn = options.isLoggedIn || false;
  const { locale, hrefDe, hrefEn, homeHref } = getCurrentLandingChromeState();
  const nav = document.createElement('nav');
  nav.className = 'landing-nav';

  const navLabel = (key, fallback) => locale === 'en' ? (NAV_EN[key] || fallback) : fallback;
  const linksHTML = NAV_ITEMS.map(item => {
    const label = navLabel(item.labelKey, item.label);
    if (item.labelKey === 'features') {
      return `
        <div class="landing-nav-mega-wrap">
          <a href="${localizeNavHref(item.href, locale)}" class="landing-nav-link landing-nav-mega-trigger" data-mega="features" data-landing-link title="${label}">
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

  const mobileProdukt = localizeNavHref('/produkt', locale);
  const mobileFeatures = localizeNavHref('/features', locale);
  const mobilePreise = localizeNavHref('/preise', locale);
  const mobileProduktLabel = locale === 'en' ? NAV_EN.mobileProdukt : 'Produkt';
  const mobileFeaturesLabel = locale === 'en' ? NAV_EN.mobileFeatures : 'Features';
  const mobilePreiseLabel = locale === 'en' ? NAV_EN.mobilePreise : 'Preise';
  const dashboardLabel = locale === 'en' ? NAV_EN.dashboard : 'Zum Dashboard';
  const waitlistLabel = locale === 'en' ? NAV_EN.waitlist : 'Zur Warteliste anmelden';

  nav.innerHTML = `
    <div class="landing-nav-inner">
      <a href="${homeHref}" class="landing-nav-logo" data-landing-link title="BookFast Startseite">BookFast</a>
      <div class="landing-nav-links">${linksHTML}</div>
      <div class="landing-nav-actions">
        <div class="landing-lang-switch" role="navigation" aria-label="Sprache / Language">
          <a href="${hrefDe}" class="landing-lang-link ${locale === 'de' ? 'is-active' : ''}" data-landing-link lang="de">DE</a>
          <span class="landing-lang-sep" aria-hidden="true">|</span>
          <a href="${hrefEn}" class="landing-lang-link ${locale === 'en' ? 'is-active' : ''}" data-landing-link lang="en">EN</a>
        </div>
        ${isLoggedIn
          ? `<a href="/dashboard/bookings" class="landing-btn landing-btn-ghost landing-btn-sm" title="${dashboardLabel}"><span class="landing-btn__icon">${getIconString('arrow-right', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${dashboardLabel}</span></a>`
          : `<a href="#" class="landing-btn landing-btn-primary landing-btn-sm nav-join-waitlist" data-landing-waitlist title="${waitlistLabel}"><span class="landing-btn__icon">${getIconString('mails', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${waitlistLabel}</span></a>`}
      </div>
      <button class="landing-nav-mobile-toggle" aria-label="Menü" title="Menü öffnen oder schließen">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
    <div class="landing-nav-mobile-menu" id="mobile-menu">
      <ul class="landing-nav-mobile-links" aria-label="Mobile Navigation">
        <li><a href="${mobileProdukt}" data-landing-link title="${mobileProduktLabel}">${mobileProduktLabel}</a></li>
        <li><a href="${mobileFeatures}" data-landing-link title="${mobileFeaturesLabel}">${mobileFeaturesLabel}</a></li>
        <li><a href="${mobilePreise}" data-landing-link title="${mobilePreiseLabel}">${mobilePreiseLabel}</a></li>
      </ul>
      <div style="padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        ${isLoggedIn
          ? `<a href="/dashboard/bookings" class="landing-btn landing-btn-secondary" style="text-align:center;" title="${dashboardLabel}"><span class="landing-btn__icon">${getIconString('arrow-right', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${dashboardLabel}</span></a>`
          : `<a href="#" class="landing-btn landing-btn-primary landing-btn-sm nav-join-waitlist" style="text-align:center;" data-landing-waitlist title="${waitlistLabel}"><span class="landing-btn__icon">${getIconString('mails', 'landing-btn-icon-svg')}</span><span class="landing-btn__text">${waitlistLabel}</span></a>`}
      </div>
    </div>
  `;

  container.appendChild(nav);

  const closeMegaMenus = () => {
    nav.querySelectorAll('.landing-nav-mega-menu').forEach(menu => menu.classList.remove('open'));
    nav.querySelectorAll('.landing-nav-mega-wrap').forEach(wrap => wrap.classList.remove('mega-open'));
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
      megaMenu.classList.add('open');
      wrap.classList.add('mega-open');
    };
    const close = () => {
      megaMenu.classList.remove('open');
      wrap.classList.remove('mega-open');
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

    trigger.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', scheduleClose);
    megaMenu.addEventListener('mouseenter', () => {
      cancelClose();
      open();
    });
    megaMenu.addEventListener('mouseleave', scheduleClose);
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeMegaMenus();
    }
  });

  nav.querySelectorAll('.landing-mega-item[data-landing-link]').forEach((link) => {
    link.addEventListener('click', () => {
      closeMegaMenus();
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
