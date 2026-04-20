import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getFeaturedBrokers } from './brokers';
import * as wix from './wix';
import { BrokerProfile } from './types';

describe('getFeaturedBrokers', () => {
  let fetchWixBrokersSpy: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    fetchWixBrokersSpy = vi.spyOn(wix, 'fetchWixBrokers');
  });

  it('should return only brokers where featuredBroker is true', async () => {
    const mockBrokers = [
      { id: '1', fullName: 'Broker 1', featuredBroker: true } as BrokerProfile,
      { id: '2', fullName: 'Broker 2', featuredBroker: false } as BrokerProfile,
      { id: '3', fullName: 'Broker 3' } as BrokerProfile,
    ];

    fetchWixBrokersSpy.mockResolvedValue(mockBrokers);

    const featured = await getFeaturedBrokers();
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe('1');
  });

  it('should return empty array if no brokers are featured', async () => {
    const mockBrokers = [
      { id: '1', fullName: 'Broker 1' } as BrokerProfile,
      { id: '2', fullName: 'Broker 2', featuredBroker: false } as BrokerProfile,
    ];

    fetchWixBrokersSpy.mockResolvedValue(mockBrokers);

    const featured = await getFeaturedBrokers();
    expect(featured).toHaveLength(0);
  });
});
