import { describe, expect, it } from 'vitest';
import { buildBrokerCtaHref } from '../lib/broker-cta-routing';
import type { BrokerProfile } from '../lib/types';

const broker = {
  id: 'broker-1',
  fullName: 'Test Broker',
  agencyName: 'Test Agency',
  slug: 'test-broker',
  shortBio: '',
  city: 'Baltimore',
  state: 'MD',
  publicEmail: 'test@example.com',
  whyChooseYou: '',
  industries: [],
  fundingTypes: [],
  urgencyCategory: 'standard',
  approvalStatus: 'approved',
  isActive: true,
} as BrokerProfile;

describe('broker CTA routing', () => {
  it('prefers a stable registry slug when configured', () => {
    const withRegistry = {
      ...broker,
      primaryCta: {
        label: 'Apply',
        url: 'https://example.com/apply',
        registrySlug: 'broker-application',
      },
    } as BrokerProfile;

    expect(buildBrokerCtaHref(withRegistry, 'apply', 'directory')).toBe('/go/broker-application');
  });

  it('preserves an attributed /out fallback when no registry slug exists', () => {
    expect(
      buildBrokerCtaHref(
        broker,
        'apply',
        'partner_funding_page',
        '/out?broker=test-broker&type=apply&source=partner_funding_page&utm_campaign=test',
      ),
    ).toBe('/out?broker=test-broker&type=apply&source=partner_funding_page&utm_campaign=test');
  });

  it('builds the compatibility /out route when no explicit fallback is supplied', () => {
    expect(buildBrokerCtaHref(broker, 'apply', 'directory')).toBe(
      '/out?broker=test-broker&type=apply&source=directory',
    );
  });
});
