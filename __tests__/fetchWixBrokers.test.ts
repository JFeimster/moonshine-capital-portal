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

  it('should return raw brokers from fetch when env vars are present', async () => {
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
    expect(result[0]._id).toBe('1');
    expect(result[0].fullName).toBe('Wix Broker');

  });

  it('should throw an error when WIX_API_URL or WIX_API_KEY are missing', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    const { fetchWixBrokers } = await import('../lib/wix');
    await expect(fetchWixBrokers()).rejects.toThrow('WIX_API_URL or WIX_API_KEY not found');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw when fetch fails (network error)', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    const { fetchWixBrokers } = await import('../lib/wix');
    await expect(fetchWixBrokers()).rejects.toThrow('Network error');
  });

  it('should throw when response is not ok', async () => {
    process.env.WIX_API_URL = 'https://api.wix.test';
    process.env.WIX_API_KEY = 'test-key';

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    } as Response);

    const { fetchWixBrokers } = await import('../lib/wix');
    await expect(fetchWixBrokers()).rejects.toThrow('Failed to fetch from Wix: Internal Server Error');
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
