import { describe, it, expect, vi } from 'vitest';
import { getFeaturedBrokers } from '../lib/brokers';
import * as wix from '../lib/wix';

vi.mock('../lib/wix', () => ({
  fetchWixBrokers: vi.fn(),
}));

describe('getFeaturedBrokers', () => {
  it('should return only featured brokers', async () => {
    const mockBrokers = [
      { _id: '1', fullName: 'Broker One', featuredFlag: true, isActive: true, approvalStatus: 'approved' },
      { _id: '2', fullName: 'Broker Two', featuredBroker: true, isActive: true, approvalStatus: 'approved' },
      { _id: '3', fullName: 'Broker Three', isActive: true, approvalStatus: 'approved' },
      { id: '4', fullName: 'Broker Four', featuredFlag: false, featuredBroker: false, isActive: true, approvalStatus: 'approved' },
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers as any);

    const result = await getFeaturedBrokers();

    expect(result).toHaveLength(2);
    expect(result.map(b => b.id)).toEqual(['1', '2']);
  });

  it('should return an empty array if there are no featured brokers', async () => {
    const mockBrokers = [
      { _id: '1', fullName: 'Broker One', isActive: true },
      { _id: '2', fullName: 'Broker Two', isActive: true },
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers as any);

    const result = await getFeaturedBrokers();

    expect(result).toEqual([]);
  });

  it('should handle edge case of an empty broker array', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

    const result = await getFeaturedBrokers();

    expect(result).toEqual([]);
  });

  it('should fallback to mock data when fetchWixBrokers throws', async () => {
    vi.mocked(wix.fetchWixBrokers).mockRejectedValue(new Error('Fetch failed'));

    const mockBrokers = await import('../lib/mock-brokers').then(m => m.mockBrokers);
    const expected = mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive && (b.featuredFlag || b.featuredBroker));

    const result = await getFeaturedBrokers();
    expect(result).toEqual(expected);
  });
});
