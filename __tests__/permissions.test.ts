import { describe, it, expect } from 'vitest';
import { hasAccess } from '../lib/permissions';

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

  it('denies access to unknown routes implicitly handled by permissions gate', () => {
    // If we call hasAccess on something not starting with /admin or /portal, it returns false
    expect(hasAccess('admin', '/something-else')).toBe(false);
  });
});
