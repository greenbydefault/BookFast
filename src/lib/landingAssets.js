const ICON_IMG_STYLE = 'width:1.2em; height:1.2em; vertical-align:-0.15em;';
const SVG_PREFIX = '../svg/';
const SVG_ASSET_MAP = import.meta.glob('../svg/**/*.svg', { eager: true, import: 'default' });

export const iconUrl = (fileName) => new URL(`../svg/ICON/${fileName}`, import.meta.url).href;

const normalizeSvgPath = (path = '') => {
  const trimmed = String(path || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/src/svg/')) return `${SVG_PREFIX}${trimmed.slice('/src/svg/'.length)}`;
  if (trimmed.startsWith('src/svg/')) return `${SVG_PREFIX}${trimmed.slice('src/svg/'.length)}`;
  if (trimmed.startsWith('/svg/')) return `${SVG_PREFIX}${trimmed.slice('/svg/'.length)}`;
  if (trimmed.startsWith('svg/')) return `${SVG_PREFIX}${trimmed.slice('svg/'.length)}`;
  if (trimmed.startsWith(SVG_PREFIX)) return trimmed;
  if (trimmed.startsWith('/')) return `${SVG_PREFIX}${trimmed.slice(1)}`;
  return `${SVG_PREFIX}${trimmed}`;
};

export const svgAssetUrl = (relativePath) => {
  const normalized = normalizeSvgPath(relativePath);
  if (!normalized) return '';
  if (SVG_ASSET_MAP[normalized]) return SVG_ASSET_MAP[normalized];
  return new URL(normalized, import.meta.url).href;
};

const escapeAttr = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

export const iconImg = (fileName, alt = '', options = {}) => {
  const decorative = options.decorative ?? (String(alt || '').trim() === '');
  const safeAlt = decorative ? '' : escapeAttr(alt);
  const ariaHidden = decorative ? ' aria-hidden="true"' : '';
  return `<img src="${iconUrl(fileName)}" alt="${safeAlt}" style="${ICON_IMG_STYLE}"${ariaHidden} />`;
};

export const resolveSvgAssetUrl = (path) => {
  if (typeof path !== 'string') return '';

  const trimmed = path.trim();
  if (!trimmed) return '';

  // Guard against accidental serialized values from dynamic sources.
  if (trimmed === 'undefined' || trimmed === 'null') return '';

  if (/^(https?:|data:|blob:|file:)/.test(trimmed)) return trimmed;

  if (trimmed.startsWith('/src/svg/')) return svgAssetUrl(trimmed);
  if (trimmed.startsWith('src/svg/')) return svgAssetUrl(trimmed);
  if (trimmed.startsWith('/svg/')) return svgAssetUrl(trimmed);
  if (trimmed.startsWith('svg/')) return svgAssetUrl(trimmed);

  // If we get a relative SVG path (e.g. "illustrations/foo.svg"), resolve via assets helper.
  if (trimmed.endsWith('.svg') && !trimmed.startsWith('/')) {
    return svgAssetUrl(trimmed);
  }

  return trimmed;
};
