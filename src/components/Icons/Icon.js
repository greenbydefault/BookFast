export const createIcon = (iconName, classes = '') => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // Add base class and any extra classes
    // We assume there will be a base .icon class style in CSS
    svg.setAttribute('class', `icon icon-${iconName} ${classes}`);
    svg.setAttribute('width', '24'); // Default size, can be overridden by CSS
    svg.setAttribute('height', '24');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#icon-${iconName}`);
    // Modern browsers support href directly for use, but xlink:href is safer for older ones if needed.
    // Actually, standard HTML5 svg uses href.
    use.setAttribute('href', `#icon-${iconName}`);

    svg.appendChild(use);
    return svg;
};

// Also export a string version if needed for innerHTML injection
export const getIconString = (iconName, classes = '') => {
    return `<svg class="icon icon-${iconName} ${classes}" width="24" height="24"><use href="#icon-${iconName}"></use></svg>`;
};
