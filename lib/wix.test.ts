import { fetchWixBrokers } from './wix';
import { BrokerProfile } from './types';

// Mock the mockBrokers data so we can control what's tested
jest.mock('./mock-brokers', () => {
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

describe('fetchWixBrokers fallback', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // clears the cache
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv; // restore original env
  });

  it('should filter mock data to return only approved and active brokers', async () => {
    // Ensure credentials are missing to trigger fallback
    delete process.env.WIX_API_URL;
    delete process.env.WIX_API_KEY;

    // Suppress console.warn for the test, but do not assert on it
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const brokers = await fetchWixBrokers();

    // Check results
    expect(brokers).toHaveLength(2);
    expect(brokers.map(b => b.id)).toEqual(['1', '5']);
    expect(brokers.every(b => b.approvalStatus === 'approved' && b.isActive)).toBe(true);

    warnSpy.mockRestore();
  });
});
