/**
 * Core feature index. Large feature records live in smaller files.
 */
import { coreBookingCommerce } from './core-booking-commerce.js';
import { coreResources } from './core-resources.js';

export const core = {
  ...coreBookingCommerce,
  ...coreResources,
};
