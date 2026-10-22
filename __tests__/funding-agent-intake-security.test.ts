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

  it('does not let public Join mutate an existing canonical Funding Agent', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue({
      partnerId: 'prt_existing',
      email: 'agent@example.com',
      approvalStatus: 'approved',
      profileStatus: 'published'
    });

    const result = await processFundingAgentJoin({
      fullName: 'Attacker Supplied Name',
      email: 'agent@example.com',
      phoneNumber: '555-0000'
    }, { publicCreateOnly: true });

    expect(result.status).toBe(202);
    expect(result.body).toMatchObject({
      success: true,
      accepted: false,
      existingIdentity: true
    });
    expect(notionMocks.upsertPartner).not.toHaveBeenCalled();
  });

  it('keeps repeated public delivery of a submission create-only and maps affirmative consent', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue(null);
    notionMocks.getPartnerBySubmissionId.mockResolvedValue(null);
    notionMocks.upsertPartner.mockResolvedValue({
      success: true,
      notionId: 'notion-new',
      created: true,
      partner: { approvalStatus: 'needs_review', profileStatus: 'draft', consentToContact: true }
    });
    const submission = {
      fullName: 'Jane Agent', email: 'jane@example.com', submissionId: 'sub-join',
      consentToContact: true, createdAt: '2026-10-22T15:17:56.000Z'
    };

    await processFundingAgentJoin(submission, { publicCreateOnly: true });
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValueOnce({ email: 'jane@example.com' });
    const duplicate = await processFundingAgentJoin(submission, { publicCreateOnly: true });

    expect(notionMocks.upsertPartner).toHaveBeenCalledTimes(1);
    expect(notionMocks.upsertPartner.mock.calls[0]?.[0]).toMatchObject({
      consentToContact: true,
      approvalStatus: 'needs_review',
      profileStatus: 'draft',
      latestSubmissionAt: '2026-10-22T15:17:56.000Z'
    });
    expect(duplicate.body).toMatchObject({ accepted: false, existingIdentity: true });
  });

  it('uses submission ID to reject a duplicate even if its supplied email differs', async () => {
    notionMocks.getPartnerByNormalizedEmail.mockResolvedValue(null);
    notionMocks.getPartnerBySubmissionId.mockResolvedValue({ email: 'existing@example.com' });

    const result = await processFundingAgentJoin({
      fullName: 'Different Email', email: 'different@example.com', submissionId: 'sub-seen'
    }, { publicCreateOnly: true });

    expect(result.body).toMatchObject({ accepted: false, existingIdentity: true });
    expect(notionMocks.upsertPartner).not.toHaveBeenCalled();
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
