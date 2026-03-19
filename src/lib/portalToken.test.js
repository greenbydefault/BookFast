import { describe, it, expect, vi } from 'vitest';
import { createPortalToken } from '../../supabase/functions/_shared/portalToken.ts';

function mockAdminClient({ revokeError = null, insertError = null } = {}) {
  const updateReturn = { eq: vi.fn().mockReturnThis(), error: revokeError };
  const fromMock = vi.fn().mockImplementation((table) => {
    if (table === 'booking_access_tokens') {
      return {
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(updateReturn),
        }),
        insert: vi.fn().mockResolvedValue({ error: insertError }),
      };
    }
    return {};
  });
  return { from: fromMock };
}

describe('createPortalToken', () => {
  it('returns plainToken, pinCode, portalPath and expiresAt', async () => {
    const client = mockAdminClient();
    const result = await createPortalToken({
      bookingId: 'b1',
      workspaceId: 'w1',
      endTime: '2026-06-01T00:00:00.000Z',
      startTime: '2026-05-30T00:00:00.000Z',
      adminClient: client,
    });

    expect(result).toHaveProperty('plainToken');
    expect(result).toHaveProperty('pinCode');
    expect(result).toHaveProperty('portalPath');
    expect(result).toHaveProperty('expiresAt');
    expect(typeof result.plainToken).toBe('string');
    expect(result.plainToken.length).toBe(64);
    expect(result.pinCode).toMatch(/^\d{5}$/);
    expect(result.portalPath).toBe(`/b/${result.plainToken}`);
  });

  it('calculates expiresAt as endTime + 60 days', async () => {
    const client = mockAdminClient();
    const result = await createPortalToken({
      bookingId: 'b1',
      workspaceId: 'w1',
      endTime: '2026-06-01T00:00:00.000Z',
      startTime: '2026-05-30T00:00:00.000Z',
      adminClient: client,
    });

    const expected = new Date('2026-06-01T00:00:00.000Z');
    expected.setDate(expected.getDate() + 60);
    expect(result.expiresAt).toBe(expected.toISOString());
  });

  it('falls back to startTime when endTime is null', async () => {
    const client = mockAdminClient();
    const result = await createPortalToken({
      bookingId: 'b1',
      workspaceId: 'w1',
      endTime: null,
      startTime: '2026-05-30T00:00:00.000Z',
      adminClient: client,
    });

    const expected = new Date('2026-05-30T00:00:00.000Z');
    expected.setDate(expected.getDate() + 60);
    expect(result.expiresAt).toBe(expected.toISOString());
  });

  it('throws when insert fails', async () => {
    const client = mockAdminClient({ insertError: { message: 'DB down' } });
    await expect(
      createPortalToken({
        bookingId: 'b1',
        workspaceId: 'w1',
        endTime: '2026-06-01T00:00:00.000Z',
        startTime: '2026-05-30T00:00:00.000Z',
        adminClient: client,
      })
    ).rejects.toThrow('Failed to create portal token: DB down');
  });
});
