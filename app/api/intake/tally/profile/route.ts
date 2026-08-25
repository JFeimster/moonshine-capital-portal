import { NextRequest, NextResponse } from 'next/server';
import { validateProfilePayload } from '@/lib/validation';
import { normalizeUrl, normalizeArray, normalizeEmail, normalizeState } from '@/lib/intake-normalizers';
import { upsertPartner } from '@/lib/notion';
import { CanonicalBrokerProfile } from '@/lib/field-mapping';
import { validateWebhookAuth } from '@/lib/webhook-auth';

function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, field]) => {
      if (field === undefined || field === null || field === '') return false;
      if (Array.isArray(field) && field.length === 0) return false;
      return true;
    })
  ) as Partial<T>;
}

export async function POST(req: NextRequest) {
  try {
    if (!validateWebhookAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const rawPayload = await req.json();
    const validation = validateProfilePayload(rawPayload);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 });
    }

    const canonicalData = compact<Partial<CanonicalBrokerProfile>>({
      partnerId: rawPayload.partnerId,
      email: rawPayload.email ? normalizeEmail(rawPayload.email) : undefined,
      displayName: rawPayload.displayName,
      fullName: rawPayload.fullName,
      agencyName: rawPayload.agencyName,
      title: rawPayload.title,
      phoneNumber: rawPayload.phoneNumber,
      shortBio: rawPayload.shortBio,
      whyChooseYou: rawPayload.whyChooseYou,
      city: rawPayload.city,
      state: rawPayload.state ? normalizeState(rawPayload.state) : undefined,
      websiteUrl: normalizeUrl(rawPayload.websiteUrl),
      industries: normalizeArray(rawPayload.industries),
      fundingTypes: normalizeArray(rawPayload.fundingTypes),
      specialties: normalizeArray(rawPayload.specialties),
      markets: normalizeArray(rawPayload.markets),
      urgencyCategory: rawPayload.urgencyCategory,
      profileImage: normalizeUrl(rawPayload.profileImage || rawPayload.photoUrl),
      logoUrl: normalizeUrl(rawPayload.logoUrl),
      bookingUrl: normalizeUrl(rawPayload.bookingUrl),
      primaryCtaLabel: rawPayload.primaryCtaLabel,
      primaryCtaLink: normalizeUrl(rawPayload.primaryCtaLink),
      disclosures: normalizeArray(rawPayload.disclosures),
      latestTallySubmissionId: rawPayload.tallySubmissionId || rawPayload.submissionId,
      latestSubmissionAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Profile-builder submissions may enrich an existing canonical partner only.
    // They never create an orphan record and never independently change lifecycle state.
    const notionResponse = await upsertPartner(canonicalData, { allowCreate: false });
    if (!notionResponse.success) {
      const kind = notionResponse.errorDetails?.kind;
      const status = kind === 'conflict' ? 409 : kind === 'not_found' ? 404 : 503;
      return NextResponse.json({
        success: false,
        error: kind === 'conflict'
          ? 'Canonical identity conflict requires review'
          : kind === 'not_found'
            ? 'No canonical partner matched this profile enrichment submission'
            : 'Failed to persist profile enrichment',
        details: notionResponse.error,
        retryable: notionResponse.errorDetails?.retryable || false
      }, { status });
    }

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('Error processing profile webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
