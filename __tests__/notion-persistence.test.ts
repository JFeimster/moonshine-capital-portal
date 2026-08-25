import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { upsertPartner } from '../lib/notion';

const page = (overrides: Record<string, any> = {}) => ({
  id: overrides.id || 'page-1',
  properties: {
    Name: { type: 'title', title: [{ plain_text: overrides.name || 'Test Agent' }] },
    Email: { type: 'email', email: overrides.email || 'test@example.com' },
    Company: { type: 'rich_text', rich_text: [{ plain_text: 'Test Co' }] },
    'Partner ID': { type: 'rich_text', rich_text: [{ plain_text: overrides.partnerId || 'prt_abc' }] },
    'Referral Code': { type: 'rich_text', rich_text: [{ plain_text: overrides.referralCode || 'MCABC' }] },
    Slug: { type: 'rich_text', rich_text: [{ plain_text: overrides.slug || 'test-agent-abc' }] },
    'Partner Type': { type: 'select', select: { name: 'Funding Agent' } },
    'Approval Status': { type: 'select', select: { name: overrides.approvalStatus || 'approved' } },
    'Profile Status': { type: 'select', select: { name: overrides.profileStatus || 'published' } },
    'Latest Tally Submission ID': { type: 'rich_text', rich_text: [{ plain_text: overrides.submissionId || 'sub-1' }] },
    'Display Name': { type: 'rich_text', rich_text: [{ plain_text: overrides.displayName || 'Test Agent' }] }
  }
});

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('durable Notion partner persistence', () => {
  beforeEach(() => {
    process.env.NOTION_API_KEY = 'test-token';
    process.env.NOTION_BROKER_DATABASE_ID = 'db-test';
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates a new valid partner with immutable identity fields', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse(page()) as any);

    const result = await upsertPartner({
      fullName: 'Test Agent', email: 'test@example.com', agencyName: 'Test Co',
      partnerId: 'prt_abc', referralCode: 'MCABC', slug: 'test-agent-abc',
      partnerType: 'funding_agent', approvalStatus: 'approved', profileStatus: 'published'
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(true);
    expect(result.partner?.partnerId).toBe('prt_abc');
    expect(result.partner?.referralCode).toBe('MCABC');
    expect(result.partner?.slug).toBe('test-agent-abc');
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('matches repeated submissions by partner_id and preserves canonical identity', async () => {
    const existing = page();
    vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [existing] }) as any)
      .mockResolvedValueOnce(jsonResponse(page({ displayName: 'Enriched Agent' })) as any);

    const result = await upsertPartner({
      partnerId: 'prt_abc', email: 'TEST@example.com', referralCode: 'DIFFERENT', slug: 'different-slug',
      displayName: 'Enriched Agent', latestTallySubmissionId: 'sub-2'
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(false);
    expect(result.matchedBy).toBe('partner_id');
    expect(result.partner?.partnerId).toBe('prt_abc');
    expect(result.partner?.referralCode).toBe('MCABC');
    expect(result.partner?.slug).toBe('test-agent-abc');
  });

  it('returns a conflict when the matched canonical identity disagrees', async () => {
    vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse({ results: [page({ partnerId: 'prt_existing' })] }) as any);

    const result = await upsertPartner({ partnerId: 'prt_incoming', email: 'test@example.com' });
    expect(result.success).toBe(false);
    expect(result.errorDetails?.kind).toBe('conflict');
    expect(result.errorDetails?.retryable).toBe(false);
  });

  it('classifies transient Notion failures as retryable', async () => {
    vi.spyOn(globalThis, 'fetch' as any).mockResolvedValueOnce(jsonResponse({ message: 'temporary outage' }, 503) as any);
    const result = await upsertPartner({ partnerId: 'prt_abc', email: 'test@example.com' });
    expect(result.success).toBe(false);
    expect(result.errorDetails?.kind).toBe('transient');
    expect(result.errorDetails?.retryable).toBe(true);
  });
});
