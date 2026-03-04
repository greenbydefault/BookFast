const ICON_IMG_STYLE = 'width:1.2em; height:1.2em; vertical-align:-0.15em;';

export const iconUrl = (fileName) => new URL(`../svg/ICON/${fileName}`, import.meta.url).href;

export const svgAssetUrl = (relativePath) => new URL(`../svg/${relativePath}`, import.meta.url).href;

export const iconImg = (fileName, alt = '') => `<img src="${iconUrl(fileName)}" alt="${alt}" style="${ICON_IMG_STYLE}" />`;
