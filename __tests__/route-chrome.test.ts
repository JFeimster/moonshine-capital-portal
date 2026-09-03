import { describe, expect, it } from 'vitest';
import { isPartnerRoute } from '../lib/routes';

describe('route-aware site chrome', () => {
  it('uses partner chrome for partner routes', () => {
    expect(isPartnerRoute('/darwin-hanneman')).toBe(true);
    expect(isPartnerRoute('/darwin-hanneman/funding/working-capital')).toBe(true);
  });

  it('keeps global chrome for reserved portal routes', () => {
    for (const route of ['/', '/directory', '/how-it-works', '/funding-types', '/industries', '/faq', '/about', '/contact', '/apply', '/admin', '/portal', '/access', '/out', '/go', '/api']) {
      expect(isPartnerRoute(route)).toBe(false);
    }
  });
});