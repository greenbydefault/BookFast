/**
 * Compare Table Component
 *
 * @param {Object} config
 * @param {string[]} config.columns - Column headers (e.g. ['Feature', 'BookFast', 'Konkurrent'])
 * @param {Array<{feature: string, values: (boolean|string)[]}>} config.rows
 * @param {boolean} [config.wide]
 * @param {string} [config.caption] - Visually hidden table caption for assistive tech
 * @returns {string} HTML
 */
import { iconImg } from '../../lib/landingAssets.js';
import { escapeHtml } from '../../lib/sanitize.js';

export const createCompareTable = ({ columns, rows, wide = false, caption = '' }) => {
  const headerHTML = columns.map((c) => `<th scope="col">${escapeHtml(c)}</th>`).join('');

  const rowsHTML = rows.map((row) => {
    const cells = row.values.map((v) => {
      if (v === true) return `<td><span class="landing-compare-check">${iconImg('check.svg')}</span></td>`;
      if (v === false) return `<td><span class="landing-compare-cross">-</span></td>`;
      return `<td>${escapeHtml(String(v))}</td>`;
    }).join('');
    return `<tr><th scope="row" class="landing-compare-row-header">${escapeHtml(row.feature)}</th>${cells}</tr>`;
  }).join('');

  const wrapClass = wide
    ? 'landing-compare-table-wrap landing-compare-table-wrap--wide'
    : 'landing-compare-table-wrap';

  return `
    <div class="${wrapClass}">
      <div class="landing-compare-table-scroll">
        <table class="landing-compare-table">
          ${caption ? `<caption class="landing-compare-caption">${escapeHtml(caption)}</caption>` : ''}
          <thead><tr>${headerHTML}</tr></thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
    </div>`;
};
