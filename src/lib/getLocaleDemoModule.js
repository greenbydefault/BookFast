/**
 * Locale-aware demo module content loader.
 * Returns EN content when available and falls back to DE.
 */
import { featureDemoModules } from '../data/featureDemoModules/index.js';

const enFeatureDemoModules = {};

const isPlainObject = (value) => (
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value)
);

const deepMerge = (baseValue, overrideValue) => {
  if (overrideValue === undefined) return baseValue;
  if (Array.isArray(baseValue) || Array.isArray(overrideValue)) {
    return overrideValue;
  }
  if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
    const merged = { ...baseValue };
    Object.keys(overrideValue).forEach((key) => {
      merged[key] = deepMerge(baseValue?.[key], overrideValue[key]);
    });
    return merged;
  }
  return overrideValue;
};

export const registerEnFeatureDemoModules = (modules) => {
  Object.assign(enFeatureDemoModules, modules);
};

export const getFeatureDemoModuleContent = (slug, locale = 'de') => {
  const base = featureDemoModules[slug];
  if (!base) return null;
  if (locale !== 'en') return base;
  return deepMerge(base, enFeatureDemoModules[slug]);
};

export const getAllFeatureDemoModules = (locale = 'de') => {
  if (locale !== 'en') return featureDemoModules;

  return Object.keys(featureDemoModules).reduce((acc, key) => {
    acc[key] = deepMerge(featureDemoModules[key], enFeatureDemoModules[key]);
    return acc;
  }, {});
};
