import { NextRequest, NextResponse } from 'next/server';
import { validateApplicationPayload } from '@/lib/validation';
import {
  generatePartnerId,
  generatePartnerSlug,
  generateReferralCode,
  normalizeEmail,
  normalizeUrl,
  normalizeState
} from '@/lib/intake-normalizers';
import { upsertPartner } from '@/lib/notion';
import { CanonicalBrokerProfile } from '@/lib/field-mapping';
import { validateWebhookAuth } from '@/lib/webhook-auth';

const CANONICAL_SOURCE_FORM = 'funding_agent_application';
const DEFAULT_FUNDING_AGENT_BIO = 'Moonshine Capital Funding Agent.';

export async function POST(req: NextRequest) {
  try {
    if (!validateWebhookAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    // This endpoint is dedicated to the canonical Funding Agent intake. It accepts
    // pre-normalized JSON (for example from Tally/n8n) rather than a raw Tally webhook.
    const rawPayload = await req.json();
    const validation = validateApplicationPayload(rawPayload);
    const email = normalizeEmail(rawPayload.email);
    const now = new Date().toISOString();

    // Without any email there is no safe deterministic fallback identity or merge key.
    if (!email) {
      return NextResponse.json({
        success: false,
        approvalStatus: 'needs_review',
        profileStatus: 'draft',
        reviewReason: validation.errors.join('; ') || 'Missing email'
      }, { status: 400 });
    }

    const partnerId = rawPayload.partnerId || generatePartnerId(email);
    const referralCode = rawPayload.referralCode || generateReferralCode(email);
    const slug = rawPayload.slug || generatePartnerSlug(rawPayload.fullName || 'partner', email);
    const shortBio = typeof rawPayload.shortBio === 'string' && rawPayload.shortBio.trim()
      ? rawPayload.shortBio.trim()
      : DEFAULT_FUNDING_AGENT_BIO;

    // The existing public model requires identity, a usable bio, and at least one
    // contact/CTA path. The normalized application email is a valid contact path;
    // the neutral system bio avoids fabricating applicant-specific claims.
    const publicationReady = Boolean(
      rawPayload.fullName?.trim?.() &&
      rawPayload.agencyName?.trim?.() &&
      slug &&
      shortBio &&
      (email || rawPayload.phoneNumber || rawPayload.websiteUrl || rawPayload.primaryCtaLink)
    );
    const clean = validation.isValid && publicationReady;
    const reviewReason = clean
      ? undefined
      : [...validation.errors, ...(publicationReady ? [] : ['Public profile requirements are incomplete'])].join('; ');

    const canonicalData: Partial<CanonicalBrokerProfile> = {
      fullName: rawPayload.fullName,
      displayName: rawPayload.displayName || rawPayload.fullName,
      email,
      agencyName: rawPayload.agencyName,
      city: rawPayload.city,
      state: normalizeState(rawPayload.state),
      websiteUrl: normalizeUrl(rawPayload.websiteUrl),
      phoneNumber: rawPayload.phoneNumber,
      shortBio,
      whyChooseYou: rawPayload.whyChooseYou,
      profileImage: normalizeUrl(rawPayload.profileImage || rawPayload.photoUrl),
      logoUrl: normalizeUrl(rawPayload.logoUrl),
      bookingUrl: normalizeUrl(rawPayload.bookingUrl),
      primaryCtaLabel: rawPayload.primaryCtaLabel,
      primaryCtaLink: normalizeUrl(rawPayload.primaryCtaLink),
      partnerId,
      referralCode,
      slug,
      partnerType: 'funding_agent',
      approvalStatus: clean ? 'approved' : 'needs_review',
      profileStatus: clean ? 'published' : 'draft',
      reviewReason,
      sourceForm: CANONICAL_SOURCE_FORM,
      tallyFormId: rawPayload.tallyFormId || rawPayload.formId,
      latestTallySubmissionId: rawPayload.tallySubmissionId || rawPayload.submissionId,
      initialSubmissionAt: rawPayload.initialSubmissionAt || rawPayload.createdAt || now,
      latestSubmissionAt: now,
      createdAt: rawPayload.createdAt || now,
      updatedAt: now,
      publishedAt: clean ? (rawPayload.publishedAt || now) : undefined
    };

    const notionResponse = await upsertPartner(canonicalData);
    if (!notionResponse.success) {
      const isConflict = notionResponse.errorDetails?.kind === 'conflict';
      return NextResponse.json({
        success: false,
        error: isConflict ? 'Canonical identity conflict requires review' : 'Failed to persist partner',
        approvalStatus: 'needs_review',
        profileStatus: 'draft',
        reviewReason: notionResponse.error,
        retryable: notionResponse.errorDetails?.retryable || false
      }, { status: isConflict ? 409 : 503 });
    }

    const approvalStatus = notionResponse.partner?.approvalStatus || (clean ? 'approved' : 'needs_review');
    const profileStatus = notionResponse.partner?.profileStatus || (clean ? 'published' : 'draft');
    const publicationEligible = approvalStatus === 'approved' && profileStatus === 'published';

    return NextResponse.json({
      success: true,
      message: publicationEligible
        ? 'Funding Agent persisted, approved, and published'
        : 'Funding Agent persisted with durable lifecycle controls',
      partnerType: notionResponse.partner?.partnerType || 'funding_agent',
      approvalStatus,
      profileStatus,
      publicationEligible,
      notionId: notionResponse.notionId,
      partnerId: notionResponse.partner?.partnerId || partnerId,
      referralCode: notionResponse.partner?.referralCode || referralCode,
      slug: notionResponse.partner?.slug || slug,
      created: notionResponse.created,
      matchedBy: notionResponse.matchedBy
    }, { status: clean ? 200 : 202 });
  } catch (error: any) {
    console.error('Error processing application webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
