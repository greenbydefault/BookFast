/**
 * Feature Demo Module Registry.
 * Maps feature slugs → { create, init } pairs.
 * `create()` returns an HTML string for the demo card.
 * `init(container)` wires event listeners after DOM insert.
 */
import { createStaffPreviewCard, initStaffPreviewCard } from './StaffPreviewCard.js';
import { createObjectPreviewCard, initObjectPreviewCard } from './ObjectPreviewCard.js';
import { createServicePreviewCard, initServicePreviewCard } from './ServicePreviewCard.js';

export const featureDemoModules = {
  mitarbeiter: { create: createStaffPreviewCard, init: initStaffPreviewCard },
  objekte: { create: createObjectPreviewCard, init: initObjectPreviewCard },
  services: { create: createServicePreviewCard, init: initServicePreviewCard },
};

/** @param {string} slug @returns {{ create: Function, init: Function } | undefined} */
export const getDemoModule = (slug) => featureDemoModules[slug];
