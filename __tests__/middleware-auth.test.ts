import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import {
  SESSION_COOKIE_NAME,
  signSession,
} from '../lib/session-token';

const secret = 'test-secret-12345678901234567890';

function requestFor(pathname: string, token?: string) {
  const headers = new Headers();
  if (token) {
    headers.set('cookie', `${SESSION_COOKIE_NAME}=${token}`);
  }

  return new NextRequest(`https://example.com${pathname}`, { headers });
}

describe('protected route middleware', () => {
  beforeEach(() => {
    process.env.AUTH_SESSION_SECRET = secret;
    process.env.ADMIN_ACCESS_PASSWORD = 'admin-code';
  });

  afterEach(() => {
    delete process.env.AUTH_SESSION_SECRET;
    delete process.env.ADMIN_ACCESS_PASSWORD;
  });

  it('redirects unauthenticated admin requests to access', async () => {
    const response = await middleware(requestFor('/admin/settings'));
    const location = response.headers.get('location');

    expect(location).toBe(
      'https://example.com/access?returnTo=%2Fadmin%2Fsettings'
    );
  });

  it('allows an admin session to access admin routes', async () => {
    const token = await signSession(
      { role: 'admin', exp: Date.now() + 60_000 },
      secret
    );
    const response = await middleware(requestFor('/admin/settings', token));

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('blocks a portal session from admin routes', async () => {
    const token = await signSession(
      { role: 'portal', exp: Date.now() + 60_000 },
      secret
    );
    const response = await middleware(requestFor('/admin', token));

    expect(response.headers.get('location')).toBe(
      'https://example.com/access?returnTo=%2Fadmin'
    );
  });

  it('allows a portal session to access portal routes', async () => {
    const token = await signSession(
      { role: 'portal', exp: Date.now() + 60_000 },
      secret
    );
    const response = await middleware(requestFor('/portal/tools', token));

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('rejects an expired session on every protected request', async () => {
    const token = await signSession(
      { role: 'admin', exp: Date.now() - 1_000 },
      secret
    );
    const response = await middleware(requestFor('/admin', token));

    expect(response.headers.get('location')).toBe(
      'https://example.com/access?returnTo=%2Fadmin'
    );
  });

  it('fails closed when required configuration is missing', async () => {
    delete process.env.ADMIN_ACCESS_PASSWORD;
    const token = await signSession(
      { role: 'admin', exp: Date.now() + 60_000 },
      secret
    );
    const response = await middleware(requestFor('/admin', token));

    expect(response.headers.get('location')).toBe(
      'https://example.com/access?returnTo=%2Fadmin'
    );
  });
});
