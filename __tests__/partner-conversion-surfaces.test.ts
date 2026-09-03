import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildPartnerLeadFormUrl, buildTrackedOutUrl } from '../lib/distribution';
import { getPartnerContactActions } from '../lib/partner-site';
import { constructMetadata } from '../lib/seo';
import { buildSitemapUrls } from '../app/sitemap';

const root = process.cwd();
const read = (path: string) => readFileSync(`${root}/${path}`, 'utf8');
const broker = {
  slug: 'darwin-hanneman',
  partnerId: 'partner_123',
  referralCode: 'REF123',
  fullName: 'Darwin Hanneman',
  publicEmail: 'darwin@example.com',
  bookingUrl: 'https://booking.example.com/darwin',
  industries: [],
  fundingTypes: [],
};

describe('partner conversion surfaces', () => {
  it('routes header and directory Apply CTAs to the partner Apply page', () => {
    expect(read('components/partner-site.tsx')).toContain('href={`/${broker.slug}/apply`}');
    expect(read('components/BrokerCard.tsx')).toContain('href={`/${broker.slug}/apply`}');
  });

  it('routes Book CTAs internally when booking exists', () => {
    expect(read('components/partner-site.tsx')).toContain('href={`/${broker.slug}/book`}');
    expect(read('app/[slug]/page.tsx')).toContain('const bookingUrl = broker.bookingUrl ? `/${broker.slug}/book` : null;');
  });

  it('preserves attribution on Apply and Book external handoffs', () => {
    const intake = new URL(buildPartnerLeadFormUrl(broker, { source: 'partner_apply_page' }));
    const booking = new URL(buildTrackedOutUrl(broker, 'booking', { source: 'partner_booking_page' }), 'https://capital.distilledfunding.com');
    expect(intake.searchParams.get('partner_id')).toBe('partner_123');
    expect(intake.searchParams.get('referral_code')).toBe('REF123');
    expect(booking.searchParams.get('broker')).toBe('darwin-hanneman');
    expect(booking.searchParams.get('partner_id')).toBe('partner_123');
    expect(booking.searchParams.get('source')).toBe('partner_booking_page');
  });

  it('uses the Apply fallback and omits empty contact actions', () => {
    expect(read('app/[slug]/book/page.tsx')).toContain('href={`/${broker.slug}/apply`}');
    expect(getPartnerContactActions({ bookingUrl: '', publicEmail: '', phoneNumber: '', websiteUrl: '' })).toEqual([]);
  });

  it('keeps only valid public contact actions', () => {
    expect(getPartnerContactActions({ bookingUrl: '', publicEmail: 'agent@example.com', phoneNumber: '', websiteUrl: '' })).toEqual([
      { kind: 'email', href: 'mailto:agent@example.com' },
    ]);
  });

  it('marks Apply and Book metadata noindex and excludes them from sitemap', async () => {
    expect(constructMetadata({ path: '/darwin-hanneman/apply', noindex: true }).robots).toEqual({ index: false, follow: true });
    expect(constructMetadata({ path: '/darwin-hanneman/book', noindex: true }).robots).toEqual({ index: false, follow: true });
    const urls = (await buildSitemapUrls()).map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith(`/${broker.slug}/apply`) || url.endsWith(`/${broker.slug}/book`))).toBe(false);
    expect(read('app/[slug]/apply/page.tsx')).toContain('noindex: true');
    expect(read('app/[slug]/book/page.tsx')).toContain('noindex: true');
  });
});
