import { CanonicalBrokerProfile } from '@/lib/field-mapping';
import {
  generatePartnerId,
  generatePartnerSlug,
  generateReferralCode,
  normalizeArray,
  normalizeEmail,
  normalizeState,
  normalizeUrl
} from '@/lib/intake-normalizers';
import { upsertPartner } from '@/lib/notion';
import { validateApplicationPayload, validateProfilePayload } from '@/lib/validation';

const CANONICAL_SOURCE_FORM = 'funding_agent_application';
const DEFAULT_FUNDING_AGENT_BIO = 'Moonshine Capital Funding Agent.';
const AWAITING_REVIEW_REASON = 'Awaiting profile completion and explicit approval';

export type IntakeServiceResult = {
  status: number;
  body: Record<string, unknown>;
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

export async function processFundingAgentJoin(rawPayload: any): Promise<IntakeServiceResult> {
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
    // Public Join submissions only create/reconcile identity. They cannot grant
    // approval or publication authority. Existing operator-controlled states are
    // preserved by the Notion adapter's non-blank merge rules.
    approvalStatus: 'needs_review',
    profileStatus: 'draft',
    reviewReason,
    sourceForm: CANONICAL_SOURCE_FORM,
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

export async function processFundingAgentProfile(rawPayload: any): Promise<IntakeServiceResult> {
  const validation = validateProfilePayload(rawPayload);
  if (!validation.isValid) {
    return { status: 400, body: { success: false, errors: validation.errors } };
  }

  const now = new Date().toISOString();
  const canonicalData = compact<Partial<CanonicalBrokerProfile>>({
    partnerId: rawPayload?.partnerId,
    email: rawPayload?.email ? normalizeEmail(rawPayload.email) : undefined,
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
    latestTallySubmissionId: rawPayload?.tallySubmissionId || rawPayload?.submissionId,
    latestSubmissionAt: now,
    updatedAt: now
  });

  // Profile submissions enrich an existing canonical partner only. They do not
  // create an orphan record and they never independently change lifecycle state.
  const notionResponse = await upsertPartner(canonicalData, { allowCreate: false });
  if (!notionResponse.success) {
    const kind = notionResponse.errorDetails?.kind;
    const status = kind === 'conflict' ? 409 : kind === 'not_found' ? 404 : 503;
    return {
      status,
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
