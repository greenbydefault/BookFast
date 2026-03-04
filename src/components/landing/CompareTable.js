/**
 * Compare Table Component
 *
 * @param {Object} config
 * @param {string[]} config.columns - Column headers (e.g. ['Feature', 'BookFast', 'Konkurrent'])
 * @param {Array<{feature: string, values: (boolean|string)[]}>} config.rows
 * @returns {string} HTML
 */
import { iconImg } from '../../lib/landingAssets.js';

export const createCompareTable = ({ columns, rows }) => {
  const headerHTML = columns.map(c => `<th>${c}</th>`).join('');

  const rowsHTML = rows.map(row => {
    const cells = row.values.map(v => {
      if (v === true) return `<td><span class="landing-compare-check">${iconImg('check.svg')}</span></td>`;
      if (v === false) return `<td><span class="landing-compare-cross">—</span></td>`;
      return `<td>${v}</td>`;
    }).join('');
    return `<tr><td style="font-weight:500;">${row.feature}</td>${cells}</tr>`;
  }).join('');

  return `
    <div style="overflow-x: auto;">
      <table class="landing-compare-table">
        <thead><tr>${headerHTML}</tr></thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    </div>`;
};
