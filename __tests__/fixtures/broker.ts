import type { BrokerProfile } from '../../lib/types';

export function createBroker(overrides: Partial<BrokerProfile> = {}): BrokerProfile {
  return {
    id: 'broker-1',
    fullName: 'Test Broker',
    agencyName: 'Test Funding Co',
    slug: 'test-broker',
    shortBio: 'Test broker profile.',
    city: 'Baltimore',
    state: 'MD',
    publicEmail: 'broker@example.com',
    whyChooseYou: 'Reliable funding guidance.',
    industries: [],
    fundingTypes: [],
    urgencyCategory: 'standard',
    approvalStatus: 'approved',
    isActive: true,
    ...overrides,
  };
}
