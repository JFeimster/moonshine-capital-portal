import { describe, expect, it } from 'vitest';
import {
  generatePartnerId,
  generatePartnerSlug,
  generateReferralCode,
  normalizeEmail
} from '../lib/intake-normalizers';

describe('canonical partner identity', () => {
  it('normalizes email merge keys', () => {
    expect(normalizeEmail('  Partner@Example.COM ')).toBe('partner@example.com');
  });

  it('is idempotent across repeated submissions', () => {
    const email = 'partner@example.com';
    expect(generatePartnerId(email)).toBe(generatePartnerId(email));
    expect(generateReferralCode(email)).toBe(generateReferralCode(email));
    expect(generatePartnerSlug('Jane Partner', email)).toBe(generatePartnerSlug('Jane Partner', email));
  });

  it('preserves identity despite email casing and whitespace differences', () => {
    expect(generatePartnerId(' Partner@Example.com ')).toBe(generatePartnerId('partner@example.com'));
    expect(generateReferralCode(' Partner@Example.com ')).toBe(generateReferralCode('partner@example.com'));
  });

  it('prevents common same-name slug collisions', () => {
    const first = generatePartnerSlug('Alex Smith', 'alex.one@example.com');
    const second = generatePartnerSlug('Alex Smith', 'alex.two@example.com');
    expect(first).not.toBe(second);
    expect(first.startsWith('alex-smith-')).toBe(true);
    expect(second.startsWith('alex-smith-')).toBe(true);
  });

  it('generates separate partner and referral identifiers', () => {
    const partnerId = generatePartnerId('partner@example.com');
    const referralCode = generateReferralCode('partner@example.com');
    expect(partnerId.startsWith('prt_')).toBe(true);
    expect(referralCode.startsWith('MC')).toBe(true);
    expect(partnerId).not.toContain(referralCode);
  });
});
