import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { rewritePrerenderAssetUrls } from '../../scripts/rewriteAssetUrls.mjs';

const setup = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'bf-assets-'));
  const dist = path.join(root, 'dist');
  mkdirSync(path.join(dist, 'src/svg/ICON'), { recursive: true });
  mkdirSync(path.join(root, 'src/svg/ICON'), { recursive: true });
  writeFileSync(path.join(dist, 'src/svg/ICON/home.svg'), '<svg/>');
  writeFileSync(path.join(root, 'src/svg/ICON/check.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1"/></svg>');
  return { root, dist };
};

describe('rewritePrerenderAssetUrls', () => {
  it('maps file and dev URLs to hashed manifest files', () => {
    const { root, dist } = setup();
    const manifest = { 'src/svg/illustrations/foo.svg': { file: 'assets/foo-abc123.svg' } };
    const html = [
      `<img src="file://${root}/src/svg/illustrations/foo.svg">`,
      '<img src="/src/svg/illustrations/foo.svg">',
    ].join('');

    const out = rewritePrerenderAssetUrls(html, { projectRoot: root, distDir: dist, manifest });
    expect(out).toBe('<img src="/assets/foo-abc123.svg"><img src="/assets/foo-abc123.svg">');
  });

  it('falls back to the public copy in dist', () => {
    const { root, dist } = setup();
    const out = rewritePrerenderAssetUrls(
      `<img src="file://${root}/src/svg/ICON/home.svg">`,
      { projectRoot: root, distDir: dist },
    );
    expect(out).toBe('<img src="/src/svg/ICON/home.svg">');
  });

  it('inlines small source files that Vite does not emit', () => {
    const { root, dist } = setup();
    const out = rewritePrerenderAssetUrls(
      `<img src="file://${root}/src/svg/ICON/check.svg">`,
      { projectRoot: root, distDir: dist },
    );
    expect(out).toContain('src="data:image/svg+xml,');
    expect(out).not.toContain('file://');
    expect(out).toContain('%3Cpath');
  });

  it('leaves unknown assets untouched', () => {
    const { root, dist } = setup();
    const html = '<img src="/src/svg/ICON/missing.svg">';
    expect(rewritePrerenderAssetUrls(html, { projectRoot: root, distDir: dist })).toBe(html);
  });
});
