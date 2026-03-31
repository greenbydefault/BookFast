import { describe, expect, it } from 'vitest';
import { calculateAddonQuantity, calculatePricing } from '../../supabase/functions/_shared/pricing.ts';

describe('calculatePricing', () => {
  it('calculates overnight per_person pricing with guest multiplier', () => {
    const result = calculatePricing({
      service: {
        price: 100,
        price_type: 'per_person',
        service_type: 'overnight',
        cleaning_fee: 20,
      },
      start_time: '2026-03-20T10:00:00.000Z',
      end_time: '2026-03-22T10:00:00.000Z',
      guest_count: 2,
    });

    expect(result.nights).toBe(2);
    expect(result.servicePrice).toBe(400);
    expect(result.cleaningFee).toBe(20);
    expect(result.totalPrice).toBe(420);
  });

  it('supports per_guest addons and percentage voucher discount', () => {
    const result = calculatePricing({
      service: {
        price: 200,
        price_type: 'per_total',
        service_type: 'hourly',
        cleaning_fee: 20,
      },
      start_time: '2026-03-20T10:00:00.000Z',
      end_time: '2026-03-20T12:00:00.000Z',
      guest_count: 3,
      addons: [
        { id: 'a1', price: 10 },
        { id: 'a2', price: 5, pricing_type: 'per_person' },
      ],
      voucher: {
        id: 'v1',
        discount_type: 'percentage',
        discount_value: 10,
      },
    });

    expect(result.subtotal).toBe(245);
    expect(result.discountAmount).toBe(24.5);
    expect(result.totalPrice).toBe(220.5);
  });

  it('uses addon selections quantities before guest-based pricing fallbacks', () => {
    const result = calculatePricing({
      service: {
        price: 100,
        price_type: 'per_total',
        service_type: 'daily',
        cleaning_fee: 10,
      },
      start_time: '2026-03-20T10:00:00.000Z',
      end_time: '2026-03-20T18:00:00.000Z',
      guest_count: 3,
      addons: [
        { id: 'a1', price: 15, pricing_type: 'per_booking' },
        { id: 'a2', price: 5, pricing_type: 'per_person' },
      ],
      addon_selections: [
        {
          addon_id: 'a1',
          items: [{ qty: 2 }],
          guests: [
            { items: [{ qty: 1 }] },
            { items: [{ qty: 3 }] },
          ],
        },
      ],
    });

    expect(result.addonsPrice).toBe(105);
    expect(result.subtotal).toBe(215);
    expect(result.totalPrice).toBe(215);
  });

  it('falls back to per_booking addons when pricing_type is not guest-based', () => {
    const result = calculatePricing({
      service: {
        price: 80,
        service_type: 'hourly',
      },
      start_time: '2026-03-20T10:00:00.000Z',
      end_time: '2026-03-20T11:00:00.000Z',
      guest_count: 4,
      addons: [
        { id: 'a1', price: 12, pricing_type: 'per_booking' },
        { id: 'a2', price: 7, pricing_type: 'flat' },
      ],
    });

    expect(result.addonsPrice).toBe(19);
    expect(result.totalPrice).toBe(99);
  });

  it('derives booking_addons quantity from structured selections', () => {
    const quantity = calculateAddonQuantity(
      { id: 'a1', price: 15, pricing_type: 'per_booking' },
      4,
      {
        addon_id: 'a1',
        items: [{ qty: 2 }, { qty: 0 }],
        guests: [
          { items: [{ qty: 3 }] },
          { items: [{ qty: null }, {}] },
        ],
      },
    );

    expect(quantity).toBe(8);
  });

  it('returns deposit amount and amountToCharge when enabled', () => {
    const result = calculatePricing({
      service: {
        price: 200,
        price_type: 'per_total',
        service_type: 'hourly',
        deposit_enabled: true,
        deposit_percent: 30,
      },
      start_time: '2026-03-20T10:00:00.000Z',
      end_time: '2026-03-20T11:00:00.000Z',
    });

    expect(result.totalPrice).toBe(200);
    expect(result.depositAmount).toBe(60);
    expect(result.amountToCharge).toBe(60);
  });
});
