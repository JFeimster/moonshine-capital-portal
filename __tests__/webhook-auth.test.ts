import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateWebhookAuth } from '../lib/webhook-auth';
import { NextRequest } from 'next/server';

describe('validateWebhookAuth', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules(); // clears the cache
    process.env = { ...ORIGINAL_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV; // restore original env
  });

  it('should return false if TALLY_WEBHOOK_SECRET is not set', () => {
    delete process.env.TALLY_WEBHOOK_SECRET;
    const req = new NextRequest('http://localhost', {
      headers: new Headers({ 'Authorization': 'Bearer my-secret' })
    });
    expect(validateWebhookAuth(req)).toBe(false);
  });

  it('should return false if no auth header is provided', () => {
    process.env.TALLY_WEBHOOK_SECRET = 'my-secret';
    const req = new NextRequest('http://localhost', {
      headers: new Headers()
    });
    expect(validateWebhookAuth(req)).toBe(false);
  });

  it('should return true for valid Authorization header with Bearer token', () => {
    process.env.TALLY_WEBHOOK_SECRET = 'my-secret';
    const req = new NextRequest('http://localhost', {
      headers: new Headers({ 'Authorization': 'Bearer my-secret' })
    });
    expect(validateWebhookAuth(req)).toBe(true);
  });

  it('should return true for valid x-webhook-secret header', () => {
    process.env.TALLY_WEBHOOK_SECRET = 'my-secret';
    const req = new NextRequest('http://localhost', {
      headers: new Headers({ 'x-webhook-secret': 'my-secret' })
    });
    expect(validateWebhookAuth(req)).toBe(true);
  });

  it('should return false for invalid secret', () => {
    process.env.TALLY_WEBHOOK_SECRET = 'my-secret';
    const req = new NextRequest('http://localhost', {
      headers: new Headers({ 'Authorization': 'Bearer wrong-secret' })
    });
    expect(validateWebhookAuth(req)).toBe(false);
  });
});
