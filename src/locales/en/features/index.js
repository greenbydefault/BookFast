/**
 * EN feature page translations – aggregated index.
 * Auto-registers with getLocaleContent on import.
 */
import { registerEnFeaturePages } from '../../../lib/getLocaleContent.js';
import { coreEn } from './core.js';
import { specialEn } from './special.js';
import { managementEn } from './management.js';
import { platformEn } from './platform.js';

export const featurePagesEn = {
  ...coreEn,
  ...specialEn,
  ...managementEn,
  ...platformEn,
};

registerEnFeaturePages(featurePagesEn);
