import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBrokers, getBrokerBySlug, getFeaturedBrokers } from './brokers';
import * as wix from './wix';
import { BrokerProfile } from './types';

// Mock the wix module
vi.mock('./wix', () => ({
  fetchWixBrokers: vi.fn(),
  fetchWixBrokerBySlug: vi.fn(),
}));

describe('brokers data fetching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockBroker = (overrides?: Partial<BrokerProfile>): BrokerProfile => ({
    id: 'test-id',
    fullName: 'Test User',
    slug: 'test-user',
    agencyName: 'Test Agency',
    city: 'Test City',
    state: 'TS',
    shortBio: 'Test bio',
    publicEmail: 'test@example.com',
    whyChooseYou: 'Test reason',
    industries: [],
    fundingTypes: [],
    urgencyCategory: 'standard',
    approvalStatus: 'approved',
    isActive: true,
    ...overrides,
  });

  const mockBrokers: BrokerProfile[] = [
    createMockBroker({
      id: '1',
      fullName: 'Alice Smith',
      slug: 'alice-smith',
      agencyName: 'Alpha Funding',
      city: 'New York',
      state: 'NY',
      fundingSpecialties: ['SBA Loans', 'Equipment Financing'],
      featuredBroker: true,
    }),
    createMockBroker({
      id: '2',
      fullName: 'Bob Jones',
      slug: 'bob-jones',
      agencyName: 'Beta Capital',
      city: 'Austin',
      state: 'TX',
      fundingSpecialties: ['Bridge Loans'],
      featuredBroker: false,
    }),
    createMockBroker({
      id: '3',
      fullName: 'Charlie Davis',
      slug: 'charlie-davis',
      agencyName: 'Gamma Finance',
      city: 'Chicago',
      state: 'IL',
      fundingSpecialties: ['Real Estate', 'SBA Loans'],
      featuredFlag: true,
    }),
  ];

  describe('getBrokers', () => {
    it('should return all brokers from fetchWixBrokers', async () => {
      vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers);

      const brokers = await getBrokers();

      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
      expect(brokers).toEqual(mockBrokers);
    });

    it('should return an empty array if fetchWixBrokers returns an empty array', async () => {
      vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

      const brokers = await getBrokers();

      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
      expect(brokers).toEqual([]);
    });

    it('should throw an error if fetchWixBrokers fails', async () => {
      const error = new Error('Wix API Error');
      vi.mocked(wix.fetchWixBrokers).mockRejectedValue(error);

      await expect(getBrokers()).rejects.toThrow('Wix API Error');
      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBrokerBySlug', () => {
    it('should return a single broker for a matching slug', async () => {
      const targetBroker = mockBrokers[0];
      vi.mocked(wix.fetchWixBrokerBySlug).mockResolvedValue(targetBroker);

      const broker = await getBrokerBySlug('alice-smith');

      expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledWith('alice-smith');
      expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledTimes(1);
      expect(broker).toEqual(targetBroker);
    });

    it('should return null if no broker is found for the slug', async () => {
      vi.mocked(wix.fetchWixBrokerBySlug).mockResolvedValue(null);

      const broker = await getBrokerBySlug('non-existent');

      expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledWith('non-existent');
      expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledTimes(1);
      expect(broker).toBeNull();
    });

    it('should throw an error if fetchWixBrokerBySlug fails', async () => {
      const error = new Error('Wix API Error');
      vi.mocked(wix.fetchWixBrokerBySlug).mockRejectedValue(error);

      await expect(getBrokerBySlug('alice-smith')).rejects.toThrow('Wix API Error');
      expect(wix.fetchWixBrokerBySlug).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFeaturedBrokers', () => {
    it('should return only brokers with featuredFlag or featuredBroker set to true', async () => {
      vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers);

      const featuredBrokers = await getFeaturedBrokers();

      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
      expect(featuredBrokers).toHaveLength(2);
      expect(featuredBrokers).toEqual(expect.arrayContaining([mockBrokers[0], mockBrokers[2]]));
      // Ensure the non-featured broker is not in the list
      expect(featuredBrokers).not.toContainEqual(mockBrokers[1]);
    });

    it('should return an empty array if no brokers are featured', async () => {
      const unfeaturedBrokers = [mockBrokers[1]];
      vi.mocked(wix.fetchWixBrokers).mockResolvedValue(unfeaturedBrokers);

      const featuredBrokers = await getFeaturedBrokers();

      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
      expect(featuredBrokers).toEqual([]);
    });

    it('should return an empty array if fetchWixBrokers returns an empty array', async () => {
      vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

      const featuredBrokers = await getFeaturedBrokers();

      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
      expect(featuredBrokers).toEqual([]);
    });

    it('should throw an error if fetchWixBrokers fails', async () => {
      const error = new Error('Wix API Error');
      vi.mocked(wix.fetchWixBrokers).mockRejectedValue(error);

      await expect(getFeaturedBrokers()).rejects.toThrow('Wix API Error');
      expect(wix.fetchWixBrokers).toHaveBeenCalledTimes(1);
    });
  });
});
