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
      { _id: '1', fullName: 'Broker One', slug: 'broker-one', isActive: true, approvalStatus: 'approved' },
      { _id: '2', fullName: 'Broker Two', slug: 'broker-two', isActive: true, approvalStatus: 'approved' },
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers as any);

    const result = await getBrokers();

    expect(wix.fetchWixBrokers).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('should return an empty array if no brokers are returned', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

    const result = await getBrokers();

    expect(wix.fetchWixBrokers).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should fallback to mock data when fetchWixBrokers throws', async () => {
    vi.mocked(wix.fetchWixBrokers).mockRejectedValue(new Error('Fetch failed'));

    const mockBrokers = await import('../lib/mock-brokers').then(m => m.mockBrokers);
    const expected = mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);

    const result = await getBrokers();
    expect(result).toEqual(expected);
  });
});
