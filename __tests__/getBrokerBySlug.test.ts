import { describe, it, expect, vi } from 'vitest';
import { getBrokerBySlug } from '../lib/brokers';
import * as wix from '../lib/wix';

vi.mock('../lib/wix', () => ({
  fetchWixBrokers: vi.fn(),
  fetchWixBrokerBySlug: vi.fn(),
}));

describe('getBrokerBySlug', () => {
  it('should return a broker when a matching slug is found', async () => {
    const mockBroker = { id: '1', fullName: 'Broker One', slug: 'broker-one', isActive: true };
    vi.mocked(wix.fetchWixBrokerBySlug).mockResolvedValue(mockBroker as any);

    const result = await getBrokerBySlug('broker-one');

    expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledWith('broker-one');
    expect(result).toEqual(mockBroker);
  });

  it('should return null when no matching broker is found', async () => {
    vi.mocked(wix.fetchWixBrokerBySlug).mockResolvedValue(null);

    const result = await getBrokerBySlug('non-existent-broker');

    expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledWith('non-existent-broker');
    expect(result).toBeNull();
  });

  it('should handle edge case of empty slug string', async () => {
    vi.mocked(wix.fetchWixBrokerBySlug).mockResolvedValue(null);

    const result = await getBrokerBySlug('');

    expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });

  it('should propagate errors from fetchWixBrokerBySlug', async () => {
    vi.mocked(wix.fetchWixBrokerBySlug).mockRejectedValue(new Error('Fetch failed'));

    await expect(getBrokerBySlug('broker-one')).rejects.toThrow('Fetch failed');
  });
});
