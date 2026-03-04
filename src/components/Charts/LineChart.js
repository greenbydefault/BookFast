/**
 * LineChart Component - Reusable SVG Line Chart
 * Used for analytics visualizations across all Insights tabs
 */

/**
 * Generate smooth bezier curve path through points
 * @param {Array} points - Array of {x, y} coordinates
 * @returns {string} SVG path d attribute
 */
const generateSmoothPath = (points) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        // Control points for smooth curve
        const cpX = (current.x + next.x) / 2;

        path += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
};

/**
 * Generate area path (closed path for gradient fill)
 * @param {Array} points - Array of {x, y} coordinates
 * @param {number} baseY - Y coordinate of the baseline
 * @returns {string} SVG path d attribute
 */
const generateAreaPath = (points, baseY) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${baseY}`;
    path += ` L ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const cpX = (current.x + next.x) / 2;
        path += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }

    path += ` L ${points[points.length - 1].x} ${baseY}`;
    path += ' Z';

    return path;
};

/**
 * Calculate nice Y axis bounds from data
 * @param {Array} values - Array of numeric values
 * @param {number} step - Preferred step size (default: 5)
 * @returns {Object} { minY, maxY }
 */
const calculateNiceYBounds = (values, step = 5) => {
    if (!values || values.length === 0) return { minY: 0, maxY: 100 };

    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;

    // Add 10% padding
    const paddedMin = dataMin - range * 0.1;
    const paddedMax = dataMax + range * 0.1;

    // Round to nice step values
    const minY = Math.max(0, Math.floor(paddedMin / step) * step);
    const maxY = Math.ceil(paddedMax / step) * step;

    // Ensure we have at least some range
    if (maxY - minY < step) {
        return { minY: Math.max(0, minY - step), maxY: maxY + step };
    }

    return { minY, maxY };
};

/**
 * Render a line chart into a container
 * @param {Object} options
 * @param {Array} options.data - Array of { label: string, value: number }
 * @param {string} options.unit - Unit suffix (e.g. '%', '€')
 * @param {number} options.minY - Minimum Y axis value (optional, auto-calculated if not provided)
 * @param {number} options.maxY - Maximum Y axis value (optional, auto-calculated if not provided)
 * @param {string} options.containerId - DOM container ID
 * @param {number} options.height - Chart height in pixels (default: 220)
 * @param {boolean} options.autoScale - Auto-calculate Y axis bounds (default: true)
 * @param {boolean} options.showGrid - Show vertical grid lines (default: true)
 * @param {boolean} options.showGradient - Show gradient fill under line (default: true)
 */
export const renderLineChart = (options) => {
    const {
        data,
        unit = '',
        containerId,
        height = 220,
        autoScale = true,
        showGrid = true,
        showGradient = true
    } = options;

    const container = document.getElementById(containerId);
    if (!container || !data || data.length === 0) return;

    // Calculate Y bounds
    let { minY, maxY } = options;
    if (autoScale || minY === undefined || maxY === undefined) {
        const values = data.map(d => d.value);
        const bounds = calculateNiceYBounds(values);
        minY = minY ?? bounds.minY;
        maxY = maxY ?? bounds.maxY;
    }

    const padding = { top: 20, right: 20, bottom: 30, left: 45 };
    const width = container.offsetWidth || 400;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate Y axis steps
    const yRange = maxY - minY || 1;
    const ySteps = 4; // 4 steps = 5 lines
    const yStepValue = yRange / ySteps;

    // Calculate point positions
    const points = data.map((d, i) => ({
        x: padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth,
        y: padding.top + chartHeight - ((d.value - minY) / yRange) * chartHeight,
        label: d.label,
        value: d.value
    }));

    // Generate Y axis labels
    const yLabels = [];
    for (let i = 0; i <= ySteps; i++) {
        const value = minY + (i * yStepValue);
        const y = padding.top + chartHeight - (i / ySteps) * chartHeight;
        yLabels.push({ value: Math.round(value), y });
    }

    // Calculate X axis positions for vertical grid
    const xGridLines = [];
    const labelInterval = Math.ceil(data.length / 6);
    data.forEach((d, i) => {
        const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
        const showLabel = i % labelInterval === 0 || i === data.length - 1;
        xGridLines.push({ x, label: d.label, showLabel });
    });

    // Base Y for area fill
    const baseY = padding.top + chartHeight;

    // Unique gradient ID
    const gradientId = `areaGradient-${containerId}`;

    // Build SVG
    const svg = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
      <!-- Gradient Definition -->
      ${showGradient ? `
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-majorelle-blue-50)"/>
          <stop offset="100%" stop-color="#fff"/>
        </linearGradient>
      </defs>
      ` : ''}
      
      <!-- Horizontal Grid Lines & Y Axis Labels -->
      ${yLabels.map(l => `
        <line 
          x1="${padding.left}" 
          y1="${l.y}" 
          x2="${width - padding.right}" 
          y2="${l.y}" 
          stroke="var(--color-stone-200)" 
          stroke-width="1"
        />
        <text 
          x="${padding.left - 8}" 
          y="${l.y + 4}" 
          text-anchor="end" 
          fill="var(--color-stone-400)" 
          font-size="11"
        >${l.value}${unit}</text>
      `).join('')}
      
      <!-- Vertical Grid Lines -->
      ${showGrid ? xGridLines.map(g => `
        <line 
          x1="${g.x}" 
          y1="${padding.top}" 
          x2="${g.x}" 
          y2="${padding.top + chartHeight}" 
          stroke="var(--color-stone-100)" 
          stroke-width="1"
          stroke-dasharray="4,4"
        />
      `).join('') : ''}
      
      <!-- X Axis Labels -->
      ${xGridLines.filter(g => g.showLabel).map(g => `
        <text 
          x="${g.x}" 
          y="${height - 8}" 
          text-anchor="middle" 
          fill="var(--color-stone-400)" 
          font-size="11"
        >${g.label}</text>
      `).join('')}
      
      <!-- Area Fill (Gradient) -->
      ${showGradient ? `
      <path 
        d="${generateAreaPath(points, baseY)}" 
        fill="url(#${gradientId})"
      />
      ` : ''}
      
      <!-- Line Path -->
      <path 
        d="${generateSmoothPath(points)}" 
        fill="none" 
        stroke="var(--color-majorelle-blue-600)" 
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Data Points (hover targets, initially transparent) -->
      ${points.map(p => `
        <circle 
          cx="${p.x}" 
          cy="${p.y}" 
          r="5" 
          fill="var(--color-majorelle-blue-600)"
          class="chart-point"
          data-value="${p.value}${unit}"
          data-label="${p.label}"
          style="opacity: 0; transition: opacity 0.15s ease;"
        />
      `).join('')}
    </svg>
  `;

    container.innerHTML = svg;

    // Add hover tooltip behavior
    container.querySelectorAll('.chart-point').forEach(point => {
        point.style.cursor = 'pointer';

        point.addEventListener('mouseenter', (e) => {
            e.target.style.opacity = '1';
            e.target.setAttribute('r', '6');
            showTooltip(container, e.target);
        });

        point.addEventListener('mouseleave', (e) => {
            e.target.style.opacity = '0';
            e.target.setAttribute('r', '5');
            hideTooltip(container);
        });
    });
};

/**
 * Show tooltip near a point
 */
const showTooltip = (container, point) => {
    hideTooltip(container);

    const value = point.dataset.value;
    const label = point.dataset.label;
    const cx = parseFloat(point.getAttribute('cx'));
    const cy = parseFloat(point.getAttribute('cy'));

    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.innerHTML = `<strong>${value}</strong><br><span>${label}</span>`;
    tooltip.style.cssText = `
    position: absolute;
    left: ${cx}px;
    top: ${cy - 45}px;
    transform: translateX(-50%);
    background: var(--color-vulcan-900);
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    text-align: center;
    pointer-events: none;
    z-index: 10;
    white-space: nowrap;
  `;

    container.style.position = 'relative';
    container.appendChild(tooltip);
};

/**
 * Hide tooltip
 */
const hideTooltip = (container) => {
    const existing = container.querySelector('.chart-tooltip');
    if (existing) existing.remove();
};

/**
 * Update chart with new data (for time period changes)
 * @param {string} containerId 
 * @param {Object} options - Same options as renderLineChart
 */
export const updateLineChart = (containerId, options) => {
    renderLineChart({ ...options, containerId });
};
