import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockBrokers } from '../lib/mock-brokers';

const originalEnv = process.env;

describe('fetchWixBrokerBySlug', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    global.fetch = vi.fn();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return normalized broker from fetch when env vars are present', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    const mockWixData = [
      {
        _id: '1',
        fullName: 'Wix Broker',
        agencyName: 'Wix Agency',
        slug: 'wix-broker',
        shortBio: 'Bio',
        city: 'City',
        state: 'State',
        publicEmail: 'wix@example.com',
        whyChooseYou: 'Why',
        approvalStatus: 'approved',
        isActive: true,
      }
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockWixData,
    } as Response);

    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const result = await fetchWixBrokerBySlug('wix-broker');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.wix.test/brokerProfiles?slug=wix-broker&status=approved&active=true',
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        }
      })
    );
    expect(result).not.toBeNull();
    expect(result?.id).toBe('1');
    expect(result?.fullName).toBe('Wix Broker');
  });

  it('should return null if API returns empty array', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const result = await fetchWixBrokerBySlug('non-existent');

    expect(result).toBeNull();
  });

  it('should return mock data when WIX_API_URL or WIX_API_KEY are missing', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    // Use a known slug from mock data for testing
    const validMockSlug = mockBrokers.find(b => b.approvalStatus === 'approved' && b.isActive)?.slug || 'test-slug';

    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const result = await fetchWixBrokerBySlug(validMockSlug);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WIX_API_URL or WIX_API_KEY not found'));

    const expectedMockData = mockBrokers.find(b => b.slug === validMockSlug && b.approvalStatus === 'approved' && b.isActive) || null;
    expect(result).toEqual(expectedMockData);
  });

  it('should fallback to mock data when fetch fails (network error)', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    // Use a known slug from mock data for testing
    const validMockSlug = mockBrokers.find(b => b.approvalStatus === 'approved' && b.isActive)?.slug || 'test-slug';

    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const result = await fetchWixBrokerBySlug(validMockSlug);

    expect(global.fetch).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching Wix broker with slug'), expect.any(Error));

    const expectedMockData = mockBrokers.find(b => b.slug === validMockSlug && b.approvalStatus === 'approved' && b.isActive) || null;
    expect(result).toEqual(expectedMockData);
  });

  it('should fallback to mock data when response is not ok', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    } as Response);

    // Use a known slug from mock data for testing
    const validMockSlug = mockBrokers.find(b => b.approvalStatus === 'approved' && b.isActive)?.slug || 'test-slug';

    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const result = await fetchWixBrokerBySlug(validMockSlug);

    expect(global.fetch).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    const expectedMockData = mockBrokers.find(b => b.slug === validMockSlug && b.approvalStatus === 'approved' && b.isActive) || null;
    expect(result).toEqual(expectedMockData);
  });

  it('should return null when falling back to mock data and slug is not found', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    const { fetchWixBrokerBySlug } = await import('../lib/wix');
    const result = await fetchWixBrokerBySlug('definitely-not-a-real-slug-12345');

    expect(result).toBeNull();
  });
});
