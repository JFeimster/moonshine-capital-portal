import { describe, it, expect, vi } from 'vitest';
import { getBrokers } from '../lib/brokers';
import * as wix from '../lib/wix';

vi.mock('../lib/wix', () => ({
  fetchWixBrokers: vi.fn(),
  fetchWixBrokerBySlug: vi.fn(),
}));

describe('getBrokers', () => {
  it('should return a list of brokers on happy path', async () => {
    const mockBrokers = [
      { id: '1', fullName: 'Broker One', slug: 'broker-one', isActive: true, approvalStatus: 'approved' },
      { id: '2', fullName: 'Broker Two', slug: 'broker-two', isActive: true, approvalStatus: 'approved' },
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers as any);

    const result = await getBrokers();

    expect(wix.fetchWixBrokers).toHaveBeenCalled();
    expect(result).toEqual(mockBrokers);
  });

  it('should return an empty array if no brokers are returned', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

    const result = await getBrokers();

    expect(wix.fetchWixBrokers).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate errors from fetchWixBrokers', async () => {
    vi.mocked(wix.fetchWixBrokers).mockRejectedValue(new Error('Fetch failed'));

    await expect(getBrokers()).rejects.toThrow('Fetch failed');
  });
});
