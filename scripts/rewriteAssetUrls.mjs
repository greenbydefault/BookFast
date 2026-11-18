import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const svgToDataUri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, ' ')}`;

/**
 * The prerender runs the landing modules through the Vite dev server, so asset
 * helpers return `file:///<root>/src/svg/...` or `/src/svg/...` URLs. Neither
 * exists in the deployed site. This maps them to the built assets:
 *   1. hashed file from the Vite manifest
 *   2. copy from `public/` that ended up in `dist/`
 *   3. inline data URI from the source file (what Vite does for small assets)
 *
 * @param {string} html
 * @param {{ projectRoot: string, distDir: string, manifest?: Record<string, { file: string }> }} options
 */
export const rewritePrerenderAssetUrls = (html, { projectRoot, distDir, manifest = {} }) => {
  const resolveAsset = (relPath) => {
    const decoded = decodeURIComponent(relPath);
    const hashed = manifest[decoded]?.file;
    if (hashed) return `/${hashed}`;
    if (existsSync(path.join(distDir, decoded))) return `/${decoded}`;
    const sourcePath = path.join(projectRoot, decoded);
    if (existsSync(sourcePath)) return svgToDataUri(readFileSync(sourcePath, 'utf8'));
    return null;
  };

  const rootUrl = `file://${projectRoot}`;
  const fileUrlPattern = new RegExp(`${escapeRegExp(rootUrl)}/(src/svg/[^"'\\s)<>]+?\\.svg)`, 'g');
  const devUrlPattern = /(?<=["'(])\/(src\/svg\/[^"'\s)<>]+?\.svg)(?=["')])/g;

  const replacer = (match, relPath) => resolveAsset(relPath) ?? match;
  return html.replace(fileUrlPattern, replacer).replace(devUrlPattern, replacer);
};
