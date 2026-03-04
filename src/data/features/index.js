/**
 * Feature Pages Configuration
 * Aggregates all feature categories.
 */
import { core } from './core.js';
import { platform } from './platform.js';
import { management } from './management.js';
import { special } from './special.js';

export const featurePages = {
  ...core,
  ...platform,
  ...management,
  ...special,
};
