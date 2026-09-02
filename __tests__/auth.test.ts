import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signSession, verifySession, timingSafeEqual, SessionPayload } from '../lib/auth';

describe('Auth session logic', () => {
  const secret = 'test-secret-12345678901234567890';
  const payload: SessionPayload = { role: 'admin', exp: Date.now() + 10000 };

  it('signs and verifies a valid session', async () => {
    const token = await signSession(payload, secret);
    expect(token).toBeDefined();

    const verified = await verifySession(token, secret);
    expect(verified).not.toBeNull();
    expect(verified?.role).toBe('admin');
    expect(verified?.exp).toBe(payload.exp);
  });

  it('fails verification with wrong secret', async () => {
    const token = await signSession(payload, secret);
    const verified = await verifySession(token, 'wrong-secret');
    expect(verified).toBeNull();
  });

  it('fails verification with tampered payload', async () => {
    const token = await signSession(payload, secret);
    const parts = token.split('.');

    // Create tampered token with different role
    const tamperedPayload = Buffer.from(JSON.stringify({ role: 'portal', exp: payload.exp })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const verified = await verifySession(tamperedToken, secret);
    expect(verified).toBeNull();
  });

  it('fails verification with expired token', async () => {
    const expiredPayload: SessionPayload = { role: 'admin', exp: Date.now() - 10000 };
    const token = await signSession(expiredPayload, secret);
    const verified = await verifySession(token, secret);
    expect(verified).toBeNull();
  });

  it('fails verification with malformed token', async () => {
    expect(await verifySession('not.a.token', secret)).toBeNull();
  });

  it('rejects payloads with invalid roles', async () => {
    // We bypass TS for this test to ensure runtime validation works
    const invalidPayload = { role: 'superadmin', exp: Date.now() + 10000 } as any;
    const token = await signSession(invalidPayload, secret);
    const verified = await verifySession(token, secret);
    expect(verified).toBeNull();
  });
});

describe('timingSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqual('password', 'password')).toBe(true);
  });

  it('returns false for different strings of same length', () => {
    expect(timingSafeEqual('password', 'passw0rd')).toBe(false);
  });

  it('returns false for strings of different lengths', () => {
    expect(timingSafeEqual('password', 'pass')).toBe(false);
  });
});
