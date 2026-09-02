import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFeaturedBrokers } from '../lib/brokers';
import * as wix from '../lib/wix';
import * as notion from '../lib/notion';
import { createBroker } from './fixtures/broker';

vi.mock('../lib/wix', () => ({
  fetchWixBrokers: vi.fn(),
  fetchWixBrokerBySlug: vi.fn(),
}));

vi.mock('../lib/notion', () => ({
  getPartnerBySlug: vi.fn(),
  listPublishedPartners: vi.fn(),
}));

describe('getFeaturedBrokers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notion.listPublishedPartners).mockResolvedValue([]);
  });

  it('should return only featured brokers', async () => {
    const mockBrokers = [
      createBroker({ id: '1', slug: 'broker-one', fullName: 'Broker One', featuredFlag: true }),
      createBroker({ id: '2', slug: 'broker-two', fullName: 'Broker Two', featuredBroker: true }),
      createBroker({ id: '3', slug: 'broker-three', fullName: 'Broker Three' }),
      createBroker({ id: '4', slug: 'broker-four', fullName: 'Broker Four', featuredFlag: false, featuredBroker: false }),
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers);

    const result = await getFeaturedBrokers();

    expect(result).toHaveLength(2);
    expect(result.map(b => b.id)).toEqual(['1', '2']);
  });

  it('should return an empty array if there are no featured brokers', async () => {
    const mockBrokers = [
      createBroker({ id: '1', slug: 'broker-one', fullName: 'Broker One' }),
      createBroker({ id: '2', slug: 'broker-two', fullName: 'Broker Two' }),
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers);

    const result = await getFeaturedBrokers();

    expect(result).toEqual([]);
  });

  it('should handle edge case of an empty broker array', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

    const result = await getFeaturedBrokers();

    expect(result).toEqual([]);
  });

  it('should propagate errors from fetchWixBrokers', async () => {
    vi.mocked(wix.fetchWixBrokers).mockRejectedValue(new Error('Fetch failed'));

    await expect(getFeaturedBrokers()).rejects.toThrow('Fetch failed');
  });
});
