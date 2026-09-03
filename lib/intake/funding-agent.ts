import { CanonicalBrokerProfile } from '@/lib/field-mapping';
import { FUNDING_AGENT_SOURCE_FORMS } from '@/lib/partner-contract';
import {
  generatePartnerId,
  generatePartnerSlug,
  generateReferralCode,
  normalizeArray,
  normalizeEmail,
  normalizeState,
  normalizeUrl
} from '@/lib/intake-normalizers';
import { getPartnerByNormalizedEmail, upsertPartner } from '@/lib/notion';
import { validateApplicationPayload, validateProfilePayload } from '@/lib/validation';

const DEFAULT_FUNDING_AGENT_BIO = 'Moonshine Capital Funding Agent.';
const AWAITING_REVIEW_REASON = 'Awaiting profile completion and explicit approval';

export type IntakeServiceResult = {
  status: number;
  body: Record<string, unknown>;
};

export type FundingAgentJoinOptions = {
  /**
   * Raw public Join submissions may create a new canonical identity, but they may
   * not mutate an identity that already exists. A Tally signature authenticates
   * Tally delivery, not ownership of the submitted email address.
   */
  publicCreateOnly?: boolean;
};

export type FundingAgentProfileOptions = {
  /**
   * Public Tally enrichment is only allowed while the canonical record is still
   * in its pre-review state. Trusted/internal callers may edit an existing record
   * through the compatibility endpoint after authenticating with the shared secret.
   */
  publicDraftOnly?: boolean;
};

function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, field]) => {
      if (field === undefined || field === null || field === '') return false;
      if (Array.isArray(field) && field.length === 0) return false;
      return true;
    })
  ) as Partial<T>;
}

export function isPublicProfileEnrichmentAllowed(approvalStatus?: string, profileStatus?: string): boolean {
  return approvalStatus === 'needs_review' && profileStatus === 'draft';
}

export async function processFundingAgentJoin(
  rawPayload: any,
  options: FundingAgentJoinOptions = {}
): Promise<IntakeServiceResult> {
  const validation = validateApplicationPayload(rawPayload);
  const email = normalizeEmail(rawPayload?.email);
  const now = new Date().toISOString();

  if (!email) {
    return {
      status: 400,
      body: {
        success: false,
        approvalStatus: 'needs_review',
        profileStatus: 'draft',
        reviewReason: validation.errors.join('; ') || 'Missing email'
      }
    };
  }

  if (options.publicCreateOnly) {
    const existing = await getPartnerByNormalizedEmail(email);
    if (existing) {
      return {
        status: 202,
        body: {
          success: true,
          accepted: false,
          existingIdentity: true,
          message: 'Funding Agent identity already exists; public Join cannot modify an existing partner'
        }
      };
    }
  }

  const fullName = typeof rawPayload?.fullName === 'string' ? rawPayload.fullName.trim() : '';
  const agencyName = typeof rawPayload?.agencyName === 'string' && rawPayload.agencyName.trim()
    ? rawPayload.agencyName.trim()
    : fullName;
  const partnerId = rawPayload?.partnerId || generatePartnerId(email);
  const referralCode = rawPayload?.referralCode || generateReferralCode(email);
  const slug = rawPayload?.slug || generatePartnerSlug(fullName || 'partner', email);
  const shortBio = typeof rawPayload?.shortBio === 'string' && rawPayload.shortBio.trim()
    ? rawPayload.shortBio.trim()
    : DEFAULT_FUNDING_AGENT_BIO;

  const reviewReason = [
    ...validation.errors,
    AWAITING_REVIEW_REASON
  ].filter(Boolean).join('; ');

  const canonicalData: Partial<CanonicalBrokerProfile> = {
    fullName,
    displayName: rawPayload?.displayName || fullName,
    email,
    agencyName,
    city: rawPayload?.city,
    state: normalizeState(rawPayload?.state),
    websiteUrl: normalizeUrl(rawPayload?.websiteUrl),
    phoneNumber: rawPayload?.phoneNumber,
    shortBio,
    whyChooseYou: rawPayload?.whyChooseYou,
    profileImage: normalizeUrl(rawPayload?.profileImage || rawPayload?.photoUrl),
    logoUrl: normalizeUrl(rawPayload?.logoUrl),
    bookingUrl: normalizeUrl(rawPayload?.bookingUrl),
    primaryCtaLabel: rawPayload?.primaryCtaLabel,
    primaryCtaLink: normalizeUrl(rawPayload?.primaryCtaLink),
    partnerId,
    referralCode,
    slug,
    partnerType: 'funding_agent',
    approvalStatus: 'needs_review',
    profileStatus: 'draft',
    reviewReason,
    sourceForm: FUNDING_AGENT_SOURCE_FORMS.join,
    tallyFormId: rawPayload?.tallyFormId || rawPayload?.formId,
    latestTallySubmissionId: rawPayload?.tallySubmissionId || rawPayload?.submissionId,
    initialSubmissionAt: rawPayload?.initialSubmissionAt || rawPayload?.createdAt || now,
    latestSubmissionAt: now,
    createdAt: rawPayload?.createdAt || now,
    updatedAt: now
  };

  const notionResponse = await upsertPartner(canonicalData);
  if (!notionResponse.success) {
    const isConflict = notionResponse.errorDetails?.kind === 'conflict';
    return {
      status: isConflict ? 409 : 503,
      body: {
        success: false,
        error: isConflict ? 'Canonical identity conflict requires review' : 'Failed to persist partner',
        approvalStatus: 'needs_review',
        profileStatus: 'draft',
        reviewReason: notionResponse.error,
        retryable: notionResponse.errorDetails?.retryable || false
      }
    };
  }

  const approvalStatus = notionResponse.partner?.approvalStatus || 'needs_review';
  const profileStatus = notionResponse.partner?.profileStatus || 'draft';
  const publicationEligible = approvalStatus === 'approved' && profileStatus === 'published';

  return {
    status: publicationEligible ? 200 : 202,
    body: {
      success: true,
      message: publicationEligible
        ? 'Existing Funding Agent identity reconciled without changing its lifecycle state'
        : 'Funding Agent identity persisted for profile completion and explicit review',
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
    }
  };
}

export async function processFundingAgentProfile(
  rawPayload: any,
  options: FundingAgentProfileOptions = {}
): Promise<IntakeServiceResult> {
  const validation = validateProfilePayload(rawPayload);
  if (!validation.isValid) {
    return { status: 400, body: { success: false, errors: validation.errors } };
  }

  const normalizedEmail = rawPayload?.email ? normalizeEmail(rawPayload.email) : '';

  if (options.publicDraftOnly) {
    if (!normalizedEmail) {
      return { status: 400, body: { success: false, error: 'Profile email is required' } };
    }

    const existing = await getPartnerByNormalizedEmail(normalizedEmail);
    if (!existing) {
      return {
        status: 404,
        body: { success: false, error: 'No canonical partner matched this profile enrichment submission' }
      };
    }

    if (!isPublicProfileEnrichmentAllowed(existing.approvalStatus, existing.profileStatus)) {
      return {
        status: 403,
        body: {
          success: false,
          error: 'This Funding Agent profile can no longer be edited through the public profile form'
        }
      };
    }
  }

  const now = new Date().toISOString();
  const canonicalData = compact<Partial<CanonicalBrokerProfile>>({
    partnerId: options.publicDraftOnly ? undefined : rawPayload?.partnerId,
    email: normalizedEmail || undefined,
    displayName: rawPayload?.displayName,
    fullName: rawPayload?.fullName,
    agencyName: rawPayload?.agencyName,
    title: rawPayload?.title,
    phoneNumber: rawPayload?.phoneNumber,
    shortBio: rawPayload?.shortBio,
    whyChooseYou: rawPayload?.whyChooseYou,
    city: rawPayload?.city,
    state: rawPayload?.state ? normalizeState(rawPayload.state) : undefined,
    websiteUrl: normalizeUrl(rawPayload?.websiteUrl),
    industries: normalizeArray(rawPayload?.industries),
    fundingTypes: normalizeArray(rawPayload?.fundingTypes),
    specialties: normalizeArray(rawPayload?.specialties),
    markets: normalizeArray(rawPayload?.markets),
    urgencyCategory: rawPayload?.urgencyCategory,
    profileImage: normalizeUrl(rawPayload?.profileImage || rawPayload?.photoUrl),
    logoUrl: normalizeUrl(rawPayload?.logoUrl),
    bookingUrl: normalizeUrl(rawPayload?.bookingUrl),
    primaryCtaLabel: rawPayload?.primaryCtaLabel,
    primaryCtaLink: normalizeUrl(rawPayload?.primaryCtaLink),
    disclosures: normalizeArray(rawPayload?.disclosures),
    sourceForm: FUNDING_AGENT_SOURCE_FORMS.profile,
    tallyFormId: rawPayload?.tallyFormId || rawPayload?.formId,
    latestTallySubmissionId: rawPayload?.tallySubmissionId || rawPayload?.submissionId,
    latestSubmissionAt: now,
    updatedAt: now
  });

  const notionResponse = await upsertPartner(canonicalData, { allowCreate: false });
  if (!notionResponse.success) {
    const kind = notionResponse.errorDetails?.kind;
    const responseStatus = kind === 'conflict' ? 409 : kind === 'not_found' ? 404 : 503;
    return {
      status: responseStatus,
      body: {
        success: false,
        error: kind === 'conflict'
          ? 'Canonical identity conflict requires review'
          : kind === 'not_found'
            ? 'No canonical partner matched this profile enrichment submission'
            : 'Failed to persist profile enrichment',
        details: notionResponse.error,
        retryable: notionResponse.errorDetails?.retryable || false
      }
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Canonical partner profile enriched successfully',
      notionId: notionResponse.notionId,
      partnerId: notionResponse.partner?.partnerId,
      referralCode: notionResponse.partner?.referralCode,
      slug: notionResponse.partner?.slug,
      approvalStatus: notionResponse.partner?.approvalStatus,
      profileStatus: notionResponse.partner?.profileStatus,
      publicationEligible: notionResponse.partner?.approvalStatus === 'approved' && notionResponse.partner?.profileStatus === 'published',
      created: notionResponse.created,
      matchedBy: notionResponse.matchedBy
    }
  };
}
