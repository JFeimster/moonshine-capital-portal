import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the mock-brokers to control the data for our tests
vi.mock('../lib/mock-brokers', () => ({
  mockBrokers: [
    {
      id: '1',
      slug: 'valid-approved-active',
      approvalStatus: 'approved',
      isActive: true,
      fullName: 'Valid Broker',
    },
    {
      id: '2',
      slug: 'valid-pending-active',
      approvalStatus: 'pending',
      isActive: true,
      fullName: 'Pending Broker',
    },
    {
      id: '3',
      slug: 'valid-approved-inactive',
      approvalStatus: 'approved',
      isActive: false,
      fullName: 'Inactive Broker',
    },
    {
      id: '4',
      slug: 'valid-rejected-inactive',
      approvalStatus: 'rejected',
      isActive: false,
      fullName: 'Rejected Inactive Broker',
    }
  ]
}));

describe('fetchWixBrokerBySlug', () => {
  beforeEach(() => {
    // Ensure API keys are not set so it falls back to mockBrokers
    vi.stubEnv('WIX_API_URL', '');
    vi.stubEnv('WIX_API_KEY', '');
    vi.resetModules(); // Ensure a fresh import of wix.ts uses the stubbed environment variables
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return the broker when slug matches, is approved, and is active', async () => {
    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const broker = await fetchWixBrokerBySlug('valid-approved-active');
    expect(broker).not.toBeNull();
    expect(broker?.id).toBe('1');
    expect(broker?.slug).toBe('valid-approved-active');
  });

  it('should return null when slug does not exist', async () => {
    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const broker = await fetchWixBrokerBySlug('non-existent-slug');
    expect(broker).toBeNull();
  });

  it('should return null when slug matches but broker is not approved (pending)', async () => {
    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const broker = await fetchWixBrokerBySlug('valid-pending-active');
    expect(broker).toBeNull();
  });

  it('should return null when slug matches but broker is inactive', async () => {
    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const broker = await fetchWixBrokerBySlug('valid-approved-inactive');
    expect(broker).toBeNull();
  });

  it('should return null when slug matches but broker is rejected and inactive', async () => {
    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const broker = await fetchWixBrokerBySlug('valid-rejected-inactive');
    expect(broker).toBeNull();
  });
});
