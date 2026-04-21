import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockBrokers } from '../lib/mock-brokers';

const originalEnv = process.env;

describe('fetchWixBrokers', () => {
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

  it('should return normalized brokers from fetch when env vars are present', async () => {
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

    const { fetchWixBrokers } = await import('../lib/wix');
    const result = await fetchWixBrokers();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.wix.test/brokerProfiles?status=approved&active=true',
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        }
      })
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].fullName).toBe('Wix Broker');
    expect(result[0].primaryCta.label).toBe('Apply Now');
  });

  it('should return mock data when WIX_API_URL or WIX_API_KEY are missing', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    const { fetchWixBrokers } = await import('../lib/wix');
    const result = await fetchWixBrokers();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WIX_API_URL or WIX_API_KEY not found'));

    const expectedMockData = mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
    expect(result).toEqual(expectedMockData);
  });

  it('should fallback to mock data when fetch fails (network error)', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    const { fetchWixBrokers } = await import('../lib/wix');
    const result = await fetchWixBrokers();

    expect(global.fetch).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching Wix brokers'), expect.any(Error));

    const expectedMockData = mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
    expect(result).toEqual(expectedMockData);
  });

  it('should fallback to mock data when response is not ok', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    } as Response);

    const { fetchWixBrokers } = await import('../lib/wix');
    const result = await fetchWixBrokers();

    expect(global.fetch).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    const expectedMockData = mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
    expect(result).toEqual(expectedMockData);
  });

  it('should return an empty array if fetch returns empty array', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const { fetchWixBrokers } = await import('../lib/wix');
    const result = await fetchWixBrokers();

    expect(result).toEqual([]);
  });
});
