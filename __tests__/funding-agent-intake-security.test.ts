import { beforeEach, describe, expect, it, vi } from 'vitest';

const notionMocks = vi.hoisted(() => ({
  getPartnerByNormalizedEmail: vi.fn(),
  getPartnerBySubmissionId: vi.fn(),
  upsertPartner: vi.fn()
}));

vi.mock('../lib/notion', () => notionMocks);

import {
  processFundingAgentJoin,
  processFundingAgentProfile
} from '../lib/intake/funding-agent';

describe('public Funding Agent intake security boundaries', () => {
  beforeEach(() => {
    notionMocks.getPartnerByNormalizedEmail.mockReset();
    notionMocks.getPartnerBySubmissionId.mockReset();
    notionMocks.upsertPartner.mockReset();
  });

  it('reconciles a repeat Join against an existing canonical Funding Agent', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue({
      partnerId: 'prt_existing',
      email: 'agent@example.com',
      approvalStatus: 'approved',
      profileStatus: 'published'
    });

    notionMocks.upsertPartner.mockResolvedValue({
      success: true,
      notionId: 'notion-existing',
      created: false,
      matchedBy: 'email',
      partner: { approvalStatus: 'approved', profileStatus: 'published', partnerId: 'prt_existing' }
    });
    const reconciled = await processFundingAgentJoin({
      fullName: 'Attacker Supplied Name',
      email: 'agent@example.com',
      phoneNumber: '555-0000'
    }, { publicCreateOnly: true });

    expect(reconciled.status).toBe(200);
    expect(reconciled.body).toMatchObject({
      success: true,
      matchedBy: 'email',
      approvalStatus: 'approved'
    });
    expect(notionMocks.upsertPartner).toHaveBeenCalledTimes(1);
  });

  it('requires affirmative consent on the canonical Join form', async () => {
    const result = await processFundingAgentJoin({
      fullName: 'No Consent',
      email: 'no-consent@example.com',
      formId: 'rjM6do'
    });
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ success: false });
    expect(notionMocks.upsertPartner).not.toHaveBeenCalled();
  });

  it('keeps a suspended canonical identity out of automatic enrollment', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue({
      partnerId: 'prt_paused',
      email: 'paused@example.com',
      approvalStatus: 'suspended',
      profileStatus: 'hidden'
    });
    notionMocks.upsertPartner.mockResolvedValue({
      success: true,
      notionId: 'notion-paused',
      created: false,
      matchedBy: 'email',
      partner: { approvalStatus: 'suspended', profileStatus: 'hidden', partnerId: 'prt_paused' }
    });
    const result = await processFundingAgentJoin({
      fullName: 'Paused Partner', email: 'paused@example.com'
    }, { publicCreateOnly: true });
    expect(result.body).toMatchObject({ approvalStatus: 'suspended' });
  });

  it('returns an enrolled draft for a new consented Join', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue(null);
    notionMocks.upsertPartner.mockResolvedValue({
      success: true,
      notionId: 'notion-new',
      created: true,
      partner: { approvalStatus: 'approved', profileStatus: 'draft', consentToContact: true }
    });
    const result = await processFundingAgentJoin({
      fullName: 'Jane Agent', email: 'jane@example.com', formId: 'rjM6do',
      consentToContact: true, submissionId: 'sub-join'
    }, { publicCreateOnly: true });
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      success: true,
      approvalStatus: 'approved',
      profileStatus: 'draft',
      publicationEligible: false
    });
    expect(notionMocks.upsertPartner).toHaveBeenCalledTimes(1);
  });

  it('keeps repeated public delivery idempotent and maps affirmative consent', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue(null);
    notionMocks.getPartnerBySubmissionId.mockResolvedValue(null);
    notionMocks.upsertPartner.mockResolvedValue({
      success: true,
      notionId: 'notion-new',
      created: true,
      partner: { approvalStatus: 'approved', profileStatus: 'draft', consentToContact: true }
    });
    const submission = {
      fullName: 'Jane Agent', email: 'jane@example.com', submissionId: 'sub-join',
      consentToContact: true, createdAt: '2026-10-22T15:17:56.000Z'
    };

    await processFundingAgentJoin(submission, { publicCreateOnly: true });
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValueOnce({ email: 'jane@example.com' });
    const duplicate = await processFundingAgentJoin(submission, { publicCreateOnly: true });

    expect(notionMocks.upsertPartner).toHaveBeenCalledTimes(2);
    expect(notionMocks.upsertPartner.mock.calls[0]?.[0]).toMatchObject({
      consentToContact: true,
      approvalStatus: 'approved',
      profileStatus: 'draft',
      latestSubmissionAt: '2026-10-22T15:17:56.000Z'
    });
    expect(duplicate.body).toMatchObject({ success: true, approvalStatus: 'approved' });
  });

  it('returns a conflict when the canonical merge layer detects a different identity', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue(null);
    notionMocks.upsertPartner.mockResolvedValue({
      success: false,
      error: 'A different canonical partner already owns this submission ID',
      errorDetails: { kind: 'conflict', retryable: false }
    });

    const result = await processFundingAgentJoin({
      fullName: 'Different Email', email: 'different@example.com', submissionId: 'sub-seen'
    }, { publicCreateOnly: true });

    expect(result.status).toBe(409);
    expect(result.body).toMatchObject({ success: false });
    expect(notionMocks.upsertPartner).toHaveBeenCalledTimes(1);
  });

  it('blocks public Profile enrichment once a partner leaves needs_review + draft', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue({
      partnerId: 'prt_existing',
      email: 'agent@example.com',
      approvalStatus: 'approved',
      profileStatus: 'published'
    });

    const result = await processFundingAgentProfile({
      email: 'agent@example.com',
      displayName: 'Malicious Replacement',
      primaryCtaLink: 'https://attacker.example'
    }, { publicDraftOnly: true });

    expect(result.status).toBe(403);
    expect(result.body).toMatchObject({ success: false });
    expect(notionMocks.upsertPartner).not.toHaveBeenCalled();
  });

  it('allows public Profile enrichment only during the pre-review draft stage', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue({
      partnerId: 'prt_pending',
      email: 'pending@example.com',
      approvalStatus: 'needs_review',
      profileStatus: 'draft'
    });
    notionMocks.upsertPartner.mockResolvedValue({
      success: true,
      notionId: 'notion_1',
      created: false,
      matchedBy: 'email',
      partner: {
        partnerId: 'prt_pending',
        email: 'pending@example.com',
        approvalStatus: 'needs_review',
        profileStatus: 'draft',
        referralCode: 'MC123',
        slug: 'pending-agent'
      }
    });

    const result = await processFundingAgentProfile({
      email: 'pending@example.com',
      displayName: 'Pending Agent',
      primaryCtaLink: 'https://example.com/apply'
    }, { publicDraftOnly: true });

    expect(result.status).toBe(200);
    expect(notionMocks.upsertPartner).toHaveBeenCalledTimes(1);
    expect(notionMocks.upsertPartner.mock.calls[0]?.[0]).not.toHaveProperty('partnerId');
    expect(notionMocks.upsertPartner.mock.calls[0]?.[1]).toEqual({ allowCreate: false });
  });
});
