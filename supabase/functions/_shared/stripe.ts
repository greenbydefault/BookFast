import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY not set');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

// BookFast verdient über Abos, nicht pro Buchung. Die Landing verspricht 0 % Provision.
export const PLATFORM_FEE_PERCENT = 0;

// Calculate platform fee in cents
export function calculatePlatformFee(amountCents: number): number {
  return Math.round(amountCents * PLATFORM_FEE_PERCENT);
}
