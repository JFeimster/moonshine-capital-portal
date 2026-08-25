import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBrokers } from '../lib/brokers';
import * as wix from '../lib/wix';
import * as notion from '../lib/notion';

vi.mock('../lib/wix', () => ({
  fetchWixBrokers: vi.fn(),
  fetchWixBrokerBySlug: vi.fn(),
}));

vi.mock('../lib/notion', () => ({
  getPartnerBySlug: vi.fn(),
  listPublishedPartners: vi.fn(),
}));

describe('getBrokers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notion.listPublishedPartners).mockResolvedValue([]);
  });

  it('should return a list of brokers on happy path', async () => {
    const mockBrokers = [
      { id: '1', fullName: 'Broker One', slug: 'broker-one', isActive: true, approvalStatus: 'approved' },
      { id: '2', fullName: 'Broker Two', slug: 'broker-two', isActive: true, approvalStatus: 'approved' },
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers as any);

    const result = await getBrokers();

    expect(wix.fetchWixBrokers).toHaveBeenCalled();
    expect(notion.listPublishedPartners).toHaveBeenCalled();
    expect(result).toEqual(mockBrokers);
  });

  it('includes a durable Notion-only published partner in directory results', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);
    vi.mocked(notion.listPublishedPartners).mockResolvedValue([{
      notionPageId: 'notion-1', partnerId: 'prt_1', fullName: 'Durable Agent', agencyName: 'Durable Co',
      slug: 'durable-agent', email: 'durable@example.com', shortBio: 'Funding Agent.',
      approvalStatus: 'approved', profileStatus: 'published', industries: [], fundingTypes: [], urgencyCategory: 'fast'
    }] as any);

    const result = await getBrokers();

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('durable-agent');
    expect(result[0].urgencyCategory).toBe('fast');
  });

  it('prefers durable canonical data when Wix has the same slug', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([
      { id: 'wix-1', fullName: 'Old Name', slug: 'same-agent', isActive: true, approvalStatus: 'approved' }
    ] as any);
    vi.mocked(notion.listPublishedPartners).mockResolvedValue([{
      notionPageId: 'notion-1', partnerId: 'prt_1', fullName: 'Canonical Name', agencyName: 'Canonical Co',
      slug: 'same-agent', email: 'canonical@example.com', shortBio: 'Funding Agent.',
      approvalStatus: 'approved', profileStatus: 'published', industries: [], fundingTypes: []
    }] as any);

    const result = await getBrokers();

    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('Canonical Name');
    expect(result[0].id).toBe('prt_1');
  });

  it('should return an empty array if no brokers are returned', async () => {
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue([]);

    const result = await getBrokers();

    expect(result).toEqual([]);
  });

  it('falls back to Wix when durable listing is unavailable', async () => {
    const mockBrokers = [
      { id: '1', fullName: 'Broker One', slug: 'broker-one', isActive: true, approvalStatus: 'approved' }
    ];
    vi.mocked(wix.fetchWixBrokers).mockResolvedValue(mockBrokers as any);
    vi.mocked(notion.listPublishedPartners).mockRejectedValue(new Error('Notion unavailable'));

    const result = await getBrokers();
    expect(result).toEqual(mockBrokers);
  });

  it('should propagate errors from fetchWixBrokers', async () => {
    vi.mocked(wix.fetchWixBrokers).mockRejectedValue(new Error('Fetch failed'));

    await expect(getBrokers()).rejects.toThrow('Fetch failed');
  });
});
