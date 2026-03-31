/**
 * Feature Demo Module Registry.
 * Maps feature slugs → { create, init } pairs.
 * `create()` returns an HTML string for the demo card.
 * `init(container)` wires event listeners after DOM insert.
 */
import { createStaffPreviewCard, initStaffPreviewCard } from './StaffPreviewCard.js';
import { createObjectPreviewCard, initObjectPreviewCard } from './ObjectPreviewCard.js';
import { createServicePreviewCard, initServicePreviewCard } from './ServicePreviewCard.js';
import { createIntegrationStatusPreviewCard, initIntegrationStatusPreviewCard } from './IntegrationStatusPreviewCard.js';
import { createWorkspacesPreviewCard, initWorkspacesPreviewCard } from './WorkspacesPreviewCard.js';
import { createAnalyticsPreviewCard, initAnalyticsPreviewCard } from './AnalyticsPreviewCard.js';

export const featureDemoModules = {
  mitarbeiter: { create: createStaffPreviewCard, init: initStaffPreviewCard },
  objekte: { create: createObjectPreviewCard, init: initObjectPreviewCard },
  services: { create: createServicePreviewCard, init: initServicePreviewCard },
  integration: { create: createIntegrationStatusPreviewCard, init: initIntegrationStatusPreviewCard },
  workspaces: { create: createWorkspacesPreviewCard, init: initWorkspacesPreviewCard },
  analytics: { create: createAnalyticsPreviewCard, init: initAnalyticsPreviewCard },
};

/** @param {string} slug @returns {{ create: Function, init: Function } | undefined} */
export const getDemoModule = (slug) => featureDemoModules[slug];
