import { describe, expect, it } from 'vitest';
import { appendAttribution, buildPartnerLeadFormUrl, buildPublicFundingUrl, buildTrackedOutUrl } from '../lib/distribution';

const partner = {
  slug: 'jane-smith',
  partnerId: 'partner_123',
  referralCode: 'REF123'
};

describe('partner distribution contract', () => {
  it('generates one stable public referral URL', () => {
    expect(buildPublicFundingUrl(partner)).toBe('https://capital.distilledfunding.com/jane-smith?ref=REF123');
  });

  it('pre-attributes the canonical Tally funding intake', () => {
    const url = new URL(buildPartnerLeadFormUrl(partner, { campaign: 'summer', utm_source: 'linkedin' }));
    expect(url.origin + url.pathname).toBe('https://tally.so/r/dWvEqN');
    expect(url.searchParams.get('partner_id')).toBe('partner_123');
    expect(url.searchParams.get('referral_code')).toBe('REF123');
    expect(url.searchParams.get('referral_partner')).toBe('REF123');
    expect(url.searchParams.get('campaign')).toBe('summer');
    expect(url.searchParams.get('utm_source')).toBe('linkedin');
  });

  it('builds tracked CTA routing without changing identity', () => {
    const url = new URL(buildTrackedOutUrl(partner, 'apply', { source: 'qr', utm_campaign: 'business_card' }));
    expect(url.pathname).toBe('/out');
    expect(url.searchParams.get('broker')).toBe('jane-smith');
    expect(url.searchParams.get('partner_id')).toBe('partner_123');
    expect(url.searchParams.get('referral_code')).toBe('REF123');
    expect(url.searchParams.get('source')).toBe('qr');
    expect(url.searchParams.get('utm_campaign')).toBe('business_card');
  });

  it('preserves campaign context on outbound destinations', () => {
    const url = new URL(appendAttribution('https://example.com/apply?existing=1', {
      partner_id: 'partner_123',
      referral_code: 'REF123',
      source: 'partner_funding_page',
      campaign: 'q3'
    }));
    expect(url.searchParams.get('existing')).toBe('1');
    expect(url.searchParams.get('partner_id')).toBe('partner_123');
    expect(url.searchParams.get('referral_code')).toBe('REF123');
    expect(url.searchParams.get('campaign')).toBe('q3');
  });
});
