import { generateToken, hashToken, generatePin } from './tokenUtils.ts';

const EXPIRY_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface CreatePortalTokenParams {
  bookingId: string;
  workspaceId: string;
  endTime: string | null;
  startTime: string;
  adminClient: any;
}

export interface PortalTokenResult {
  plainToken: string;
  pinCode: string;
  portalPath: string;
  expiresAt: string;
}

export async function createPortalToken(params: CreatePortalTokenParams): Promise<PortalTokenResult> {
  const { bookingId, workspaceId, endTime, startTime, adminClient } = params;

  await adminClient
    .from('booking_access_tokens')
    .update({ is_revoked: true })
    .eq('booking_id', bookingId)
    .eq('is_revoked', false);

  const plainToken = generateToken();
  const tokenHash = await hashToken(plainToken);
  const pinCode = generatePin();

  const bookingDate = new Date(endTime || startTime);
  const expiresAt = new Date(bookingDate.getTime() + EXPIRY_DAYS * DAY_MS);

  const { error } = await adminClient
    .from('booking_access_tokens')
    .insert({
      booking_id: bookingId,
      workspace_id: workspaceId,
      token_hash: tokenHash,
      pin_code: pinCode,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new Error(`Failed to create portal token: ${error.message}`);
  }

  return {
    plainToken,
    pinCode,
    portalPath: `/b/${plainToken}`,
    expiresAt: expiresAt.toISOString(),
  };
}
