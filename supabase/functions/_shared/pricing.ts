export interface PricingService {
  price: number | string | null;
  price_type: 'per_total' | 'per_person' | string;
  service_type: 'overnight' | string;
  cleaning_fee?: number | string | null;
  deposit_enabled?: boolean;
  deposit_percent?: number | null;
}

export interface PricingAddon {
  id: string;
  name?: string;
  price: number | string | null;
  scope?: 'per_booking' | 'per_guest';
}

export interface PricingVoucher {
  id: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

export interface PricingContext {
  service: PricingService;
  start_time: string;
  end_time: string;
  guest_count?: number;
  addons?: PricingAddon[];
  voucher?: PricingVoucher;
}

export interface PricingResult {
  servicePrice: number;
  cleaningFee: number;
  addonsPrice: number;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  depositAmount: number | null;
  amountToCharge: number;
  nights: number | null;
  guests: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeGuests(guestCount?: number): number {
  return Number.isInteger(guestCount) && Number(guestCount) > 0 ? Number(guestCount) : 1;
}

function calculateNights(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs)) return 1;
  return Math.max(1, Math.ceil(diffMs / DAY_MS));
}

function calculateServicePrice(
  service: PricingService,
  nights: number | null,
  guests: number,
): number {
  let servicePrice = toNumber(service.price);

  if (service.price_type !== 'per_total') {
    if (service.service_type === 'overnight' && nights !== null) {
      servicePrice *= nights;
    }
    if (service.price_type === 'per_person') {
      servicePrice *= guests;
    }
  }

  return servicePrice;
}

function calculateAddonsPrice(addons: PricingAddon[] | undefined, guests: number): number {
  if (!addons?.length) return 0;
  return addons.reduce((sum, addon) => {
    const unit = toNumber(addon.price);
    const multiplier = addon.scope === 'per_guest' ? guests : 1;
    return sum + (unit * multiplier);
  }, 0);
}

function calculateDiscountAmount(
  voucher: PricingVoucher | undefined,
  subtotal: number,
): number {
  if (!voucher) return 0;
  if (voucher.discount_type === 'percentage') {
    return subtotal * (voucher.discount_value / 100);
  }
  return Math.min(voucher.discount_value, subtotal);
}

export function calculatePricing(ctx: PricingContext): PricingResult {
  const guests = normalizeGuests(ctx.guest_count);
  const nights = ctx.service.service_type === 'overnight'
    ? calculateNights(ctx.start_time, ctx.end_time)
    : null;

  const servicePrice = calculateServicePrice(ctx.service, nights, guests);
  const cleaningFee = toNumber(ctx.service.cleaning_fee);
  const addonsPrice = calculateAddonsPrice(ctx.addons, guests);
  const subtotal = servicePrice + cleaningFee + addonsPrice;
  const discountAmount = calculateDiscountAmount(ctx.voucher, subtotal);
  const totalPrice = Math.max(0, subtotal - discountAmount);

  let depositAmount: number | null = null;
  if (ctx.service.deposit_enabled && toNumber(ctx.service.deposit_percent) > 0) {
    depositAmount = Math.round(totalPrice * (toNumber(ctx.service.deposit_percent) / 100));
  }

  return {
    servicePrice,
    cleaningFee,
    addonsPrice,
    subtotal,
    discountAmount,
    totalPrice,
    depositAmount,
    amountToCharge: depositAmount ?? totalPrice,
    nights,
    guests,
  };
}
