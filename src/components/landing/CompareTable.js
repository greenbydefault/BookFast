/**
 * Compare Table Component
 *
 * @param {Object} config
 * @param {string[]} config.columns - Column headers (e.g. ['Feature', 'BookFast', 'Konkurrent'])
 * @param {Array<{feature: string, values: (boolean|string)[]}>} config.rows
 * @returns {string} HTML
 */
export const createCompareTable = ({ columns, rows }) => {
  const headerHTML = columns.map(c => `<th>${c}</th>`).join('');

  const rowsHTML = rows.map(row => {
    const cells = row.values.map(v => {
      if (v === true) return `<td><span class="landing-compare-check"><img src="/src/svg/ICON/check.svg" alt="" style="width:1.2em; height:1.2em; vertical-align:-0.15em;" /></span></td>`;
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
