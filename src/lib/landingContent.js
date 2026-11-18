/**
 * Landing content hydration.
 *
 * The postbuild prerender marks `#landing-content` with `data-prerendered="<path>"`.
 * On the first client render the router calls `prepareLandingContentHydration`
 * with the path it is about to render. When both paths match, pages that write
 * their markup through `setLandingContent` keep the prerendered DOM and only
 * bind their listeners, so the browser does not throw away the HTML it just
 * painted. A path mismatch (for example `/produkt/` rewritten to `/`) falls back
 * to a normal render.
 */

let hydrateNext = false;

export const PRERENDERED_ATTR = 'data-prerendered';

export const prepareLandingContentHydration = (
  content = document.getElementById('landing-content'),
  path = '',
) => {
  const prerenderedPath = content?.getAttribute(PRERENDERED_ATTR);
  hydrateNext = Boolean(prerenderedPath)
    && prerenderedPath === path
    && (content?.childElementCount ?? 0) > 0;
  content?.removeAttribute(PRERENDERED_ATTR);
};

export const finishLandingContentHydration = () => {
  hydrateNext = false;
};

/**
 * Write page markup into the landing content element.
 * Returns false when the prerendered DOM was kept instead.
 */
export const setLandingContent = (content, html) => {
  if (hydrateNext) {
    hydrateNext = false;
    return false;
  }
  content.innerHTML = html;
  return true;
};
