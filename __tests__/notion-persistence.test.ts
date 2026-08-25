import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { upsertPartner } from '../lib/notion';

const page = (overrides: Record<string, any> = {}) => ({
  id: overrides.id || 'page-1',
  created_time: overrides.createdTime || '2026-08-25T10:00:00.000Z',
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
    'Display Name': { type: 'rich_text', rich_text: [{ plain_text: overrides.displayName || 'Test Agent' }] },
    'Why Choose You': { type: 'rich_text', rich_text: [{ plain_text: overrides.whyChooseYou || '' }] }
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
    const createdPage = page();
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any) // partner_id lookup
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any) // email lookup
      .mockResolvedValueOnce(jsonResponse(createdPage) as any) // create page
      .mockResolvedValueOnce(jsonResponse({ results: [createdPage] }) as any); // post-create reconciliation

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
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [existing] }) as any)
      .mockResolvedValueOnce(jsonResponse(page({ displayName: 'Enriched Agent', whyChooseYou: 'Trusted operator.' })) as any);

    const result = await upsertPartner({
      partnerId: 'prt_abc', email: 'TEST@example.com', referralCode: 'DIFFERENT', slug: 'different-slug',
      displayName: 'Enriched Agent', whyChooseYou: 'Trusted operator.', latestTallySubmissionId: 'sub-2'
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(false);
    expect(result.matchedBy).toBe('partner_id');
    expect(result.partner?.partnerId).toBe('prt_abc');
    expect(result.partner?.referralCode).toBe('MCABC');
    expect(result.partner?.slug).toBe('test-agent-abc');

    const updateBody = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body));
    expect(updateBody.properties['Why Choose You'].rich_text[0].text.content).toBe('Trusted operator.');
  });

  it('preserves operator-imposed suspended and hidden states on a clean resubmission', async () => {
    const existing = page({ approvalStatus: 'suspended', profileStatus: 'hidden' });
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [existing] }) as any)
      .mockResolvedValueOnce(jsonResponse(existing) as any);

    const result = await upsertPartner({
      partnerId: 'prt_abc', email: 'test@example.com',
      approvalStatus: 'approved', profileStatus: 'published', displayName: 'Updated Name'
    });

    expect(result.success).toBe(true);
    const updateBody = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body));
    expect(updateBody.properties['Approval Status'].select.name).toBe('suspended');
    expect(updateBody.properties['Profile Status'].select.name).toBe('hidden');
  });

  it('returns a conflict when email resolves to a different canonical identity', async () => {
    vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any) // incoming partner_id not found
      .mockResolvedValueOnce(jsonResponse({ results: [page({ partnerId: 'prt_existing' })] }) as any); // email match

    const result = await upsertPartner({ partnerId: 'prt_incoming', email: 'test@example.com' });
    expect(result.success).toBe(false);
    expect(result.errorDetails?.kind).toBe('conflict');
    expect(result.errorDetails?.retryable).toBe(false);
  });

  it('reconciles duplicate pages created by concurrent first-time deliveries', async () => {
    const winner = page({ id: 'page-1', createdTime: '2026-08-25T10:00:00.000Z' });
    const concurrentCreated = page({ id: 'page-2', createdTime: '2026-08-25T10:00:01.000Z' });
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any)
      .mockResolvedValueOnce(jsonResponse(concurrentCreated) as any)
      .mockResolvedValueOnce(jsonResponse({ results: [winner, concurrentCreated] }) as any)
      .mockResolvedValueOnce(jsonResponse({}) as any); // archive duplicate

    const result = await upsertPartner({
      partnerId: 'prt_abc', email: 'test@example.com', referralCode: 'MCABC', slug: 'test-agent-abc'
    });

    expect(result.success).toBe(true);
    expect(result.notionId).toBe('page-1');
    expect(result.created).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(5);
    const archiveBody = JSON.parse(String((fetchMock.mock.calls[4][1] as RequestInit).body));
    expect(archiveBody.properties['Profile Status'].select.name).toBe('archived');
  });

  it('does not create an orphan when enrichment has no canonical match', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as any)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as any);

    const result = await upsertPartner({ partnerId: 'prt_missing' }, { allowCreate: false });
    expect(result.success).toBe(false);
    expect(result.errorDetails?.kind).toBe('not_found');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('classifies transient Notion failures as retryable', async () => {
    vi.spyOn(globalThis, 'fetch' as any).mockResolvedValueOnce(jsonResponse({ message: 'temporary outage' }, 503) as any);
    const result = await upsertPartner({ partnerId: 'prt_abc', email: 'test@example.com' });
    expect(result.success).toBe(false);
    expect(result.errorDetails?.kind).toBe('transient');
    expect(result.errorDetails?.retryable).toBe(true);
  });
});
