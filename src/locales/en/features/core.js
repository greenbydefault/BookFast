/**
 * Core EN feature index. Large records live in smaller files.
 */
import { coreBookingCommerceEn } from './core-booking-commerce.js';
import { coreResourcesEn } from './core-resources.js';

export const coreEn = {
  ...coreBookingCommerceEn,
  ...coreResourcesEn,
};
