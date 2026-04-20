import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { fetchWixBrokers } from './wix';
import { BrokerProfile } from './types';

const originalEnv = process.env;

describe('fetchWixBrokers fallback', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should filter mock data to return only approved and active brokers', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    vi.doMock('./mock-brokers', () => {
      const mockBrokers: Partial<BrokerProfile>[] = [
        {
          id: '1',
          approvalStatus: 'approved',
          isActive: true,
          fullName: 'Approved Active',
        },
        {
          id: '2',
          approvalStatus: 'pending',
          isActive: true,
          fullName: 'Pending Active',
        },
        {
          id: '3',
          approvalStatus: 'approved',
          isActive: false,
          fullName: 'Approved Inactive',
        },
        {
          id: '4',
          approvalStatus: 'rejected',
          isActive: false,
          fullName: 'Rejected Inactive',
        },
        {
          id: '5',
          approvalStatus: 'approved',
          isActive: true,
          fullName: 'Another Approved Active',
        }
      ];

      return { mockBrokers };
    });

    const { fetchWixBrokers } = await import('./wix');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const brokers = await fetchWixBrokers();

    expect(brokers).toHaveLength(2);
    expect(brokers.map(b => b.id)).toEqual(['1', '5']);
    expect(brokers.every(b => b.approvalStatus === 'approved' && b.isActive)).toBe(true);

    warnSpy.mockRestore();
  });

  it('should return empty array if no matching brokers exist', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    vi.doMock('./mock-brokers', () => {
      const mockBrokers: Partial<BrokerProfile>[] = [
        {
          id: '1',
          approvalStatus: 'pending',
          isActive: true,
          fullName: 'Pending Active',
        },
        {
          id: '2',
          approvalStatus: 'approved',
          isActive: false,
          fullName: 'Approved Inactive',
        }
      ];

      return { mockBrokers };
    });

    const { fetchWixBrokers } = await import('./wix');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const brokers = await fetchWixBrokers();

    expect(brokers).toHaveLength(0);
    expect(brokers).toEqual([]);

    warnSpy.mockRestore();
  });

  it('should return empty array if input is empty', async () => {
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    vi.doMock('./mock-brokers', () => {
      const mockBrokers: Partial<BrokerProfile>[] = [];
      return { mockBrokers };
    });

    const { fetchWixBrokers } = await import('./wix');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const brokers = await fetchWixBrokers();

    expect(brokers).toHaveLength(0);
    expect(brokers).toEqual([]);

    warnSpy.mockRestore();
  });
});