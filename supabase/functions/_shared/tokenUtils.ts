/**
 * Token utilities for Magic Customer Portal
 * Generates cryptographically secure tokens and SHA-256 hashes
 */

/**
 * Generate a 32-byte (256-bit) cryptographically random token
 * Returns hex-encoded string (64 characters)
 */
export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a 5-digit numeric PIN for portal access verification
 * Returns string like "38274"
 */
export function generatePin(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const num = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  const pin = (num % 90000) + 10000; // Range 10000–99999
  return pin.toString();
}

/**
 * Hash a token using SHA-256
 * Returns hex-encoded hash string
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Booking detail select query — same relations as dashboard BookingDetailPage
 * Used by portal-verify to return full booking data
 */
export const PORTAL_BOOKING_SELECT = `
  id, workspace_id, object_id, service_id,
  start_time, end_time, status, created_at, updated_at,
  customer_name, customer_email, customer_phone, customer_notes,
  service_price, addons_price, discount_amount, total_price,
  amount_deposit, amount_refunded,
  payment_status, invoice_number, booking_number,
  objects(name),
  services(name, service_type, price),
  booking_addons(addon_id, quantity, price_per_unit, total_price, addons(name)),
  booking_staff(staff_id, staff(name)),
  vouchers(code, name, discount_type, discount_value)
`;

/**
 * Workspace fields safe for public portal display (no Stripe keys etc.)
 */
export const PORTAL_WORKSPACE_SELECT = `
  id, name,
  company_name, company_address, company_zip, company_city, company_country,
  tax_id, vat_id, tax_rate,
  bank_name, iban, bic,
  website, email, phone,
  managing_directors, register_court, register_number,
  payout_status
`;
