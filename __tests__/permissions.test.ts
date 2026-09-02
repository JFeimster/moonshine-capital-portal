import { describe, expect, it } from 'vitest';
import {
  hasAccess,
  resolveAuthorizedReturnTo,
} from '../lib/permissions';

describe('Permissions', () => {
  it('denies access if no role is provided', () => {
    expect(hasAccess(null, '/admin')).toBe(false);
    expect(hasAccess(undefined, '/portal')).toBe(false);
  });

  it('admin role allows access to /admin and /portal', () => {
    expect(hasAccess('admin', '/admin')).toBe(true);
    expect(hasAccess('admin', '/admin/settings')).toBe(true);
    expect(hasAccess('admin', '/portal')).toBe(true);
    expect(hasAccess('admin', '/portal/tools')).toBe(true);
  });

  it('portal role allows access to /portal but denies /admin', () => {
    expect(hasAccess('portal', '/portal')).toBe(true);
    expect(hasAccess('portal', '/portal/tools')).toBe(true);
    expect(hasAccess('portal', '/admin')).toBe(false);
    expect(hasAccess('portal', '/admin/settings')).toBe(false);
  });

  it('rejects prefix lookalikes and external-style paths', () => {
    expect(hasAccess('admin', '/administrator')).toBe(false);
    expect(hasAccess('admin', '/admin-old')).toBe(false);
    expect(hasAccess('portal', '/portalish')).toBe(false);
    expect(hasAccess('admin', '//example.com/admin')).toBe(false);
  });

  it('preserves valid nested destinations for an authorized role', () => {
    expect(resolveAuthorizedReturnTo('admin', '/admin/settings')).toBe(
      '/admin/settings'
    );
    expect(resolveAuthorizedReturnTo('portal', '/portal/tools')).toBe(
      '/portal/tools'
    );
  });

  it('allows an admin to return to portal routes', () => {
    expect(resolveAuthorizedReturnTo('admin', '/portal/resources')).toBe(
      '/portal/resources'
    );
  });

  it('falls back when a portal user requests an admin destination', () => {
    expect(resolveAuthorizedReturnTo('portal', '/admin')).toBe('/portal');
    expect(resolveAuthorizedReturnTo('portal', '/admin/settings')).toBe(
      '/portal'
    );
  });

  it('falls back for malformed protected-route lookalikes', () => {
    expect(resolveAuthorizedReturnTo('admin', '/administrator')).toBe('/admin');
    expect(resolveAuthorizedReturnTo('portal', '/portalish')).toBe('/portal');
  });
});
