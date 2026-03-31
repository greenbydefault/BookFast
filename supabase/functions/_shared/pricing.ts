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
  pricing_type?: string | null;
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
  addon_selections?: PricingAddonSelection[] | null;
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

export interface PricingSelectionItem {
  qty?: number | string | null;
}

export interface PricingSelectionGuest {
  items?: PricingSelectionItem[] | null;
}

export interface PricingAddonSelection {
  addon_id?: string | null;
  items?: PricingSelectionItem[] | null;
  guests?: PricingSelectionGuest[] | null;
}

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeGuests(guestCount?: number): number {
  return Number.isInteger(guestCount) && Number(guestCount) > 0 ? Number(guestCount) : 1;
}

function normalizeServicePriceType(priceType: unknown): 'per_total' | 'per_person' | 'per_unit' {
  if (priceType === 'per_total' || priceType === 'per_person') return priceType;
  return 'per_unit';
}

function normalizeAddonScope(addon: PricingAddon): 'per_booking' | 'per_guest' {
  if (addon.scope === 'per_guest' || addon.scope === 'per_booking') {
    return addon.scope;
  }

  switch (addon.pricing_type) {
    case 'per_person':
    case 'per_guest':
    case 'per_ticket':
      return 'per_guest';
    default:
      return 'per_booking';
  }
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
  const priceType = normalizeServicePriceType(service.price_type);

  if (priceType !== 'per_total') {
    if (service.service_type === 'overnight' && nights !== null) {
      servicePrice *= nights;
    }
    if (priceType === 'per_person') {
      servicePrice *= guests;
    }
  }

  return servicePrice;
}

export function countAddonUnits(selection?: PricingAddonSelection | null): number {
  if (!selection) return 0;

  const bookingUnits = (selection.items || []).reduce((sum, item) => {
    const qty = toNumber(item?.qty);
    return sum + (qty > 0 ? qty : 1);
  }, 0);

  const guestUnits = (selection.guests || []).reduce((sum, guest) => {
    return sum + (guest?.items || []).reduce((guestSum, item) => {
      const qty = toNumber(item?.qty);
      return guestSum + (qty > 0 ? qty : 1);
    }, 0);
  }, 0);

  return bookingUnits + guestUnits;
}

export function calculateAddonQuantity(
  addon: PricingAddon,
  guests: number,
  selection?: PricingAddonSelection | null,
): number {
  const selectedUnits = countAddonUnits(selection);
  if (selectedUnits > 0) return selectedUnits;
  return normalizeAddonScope(addon) === 'per_guest' ? guests : 1;
}

function calculateAddonsPrice(
  addons: PricingAddon[] | undefined,
  guests: number,
  addonSelections?: PricingAddonSelection[] | null,
): number {
  if (!addons?.length) return 0;
  const selectionMap = new Map((addonSelections || [])
    .filter((selection): selection is PricingAddonSelection & { addon_id: string } => Boolean(selection?.addon_id))
    .map((selection) => [selection.addon_id as string, selection]));

  return addons.reduce((sum, addon) => {
    const unit = toNumber(addon.price);
    const quantity = calculateAddonQuantity(addon, guests, selectionMap.get(addon.id));
    return sum + (unit * quantity);
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
  const addonsPrice = calculateAddonsPrice(ctx.addons, guests, ctx.addon_selections);
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
