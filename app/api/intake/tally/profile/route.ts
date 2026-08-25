import { NextRequest, NextResponse } from 'next/server';
import { validateProfilePayload } from '@/lib/validation';
import { normalizeUrl, normalizeArray, normalizeEmail } from '@/lib/intake-normalizers';
import { upsertNotionCRMRecord } from '@/lib/notion';
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

    // Contract: accepts pre-normalized JSON, using email as the existing-record merge key.
    const rawPayload = await req.json();
    const validationResult = validateProfilePayload(rawPayload);
    if (!validationResult.isValid) {
      return NextResponse.json({ success: false, errors: validationResult.errors }, { status: 400 });
    }

    // Only nonblank enrichment values are sent downstream. This prevents a partial
    // profile-builder submission from erasing trusted application or operator data.
    const canonicalData = compact<Partial<CanonicalBrokerProfile>>({
      email: normalizeEmail(rawPayload.email),
      displayName: rawPayload.displayName,
      agencyName: rawPayload.agencyName,
      title: rawPayload.title,
      phoneNumber: rawPayload.phoneNumber,
      shortBio: rawPayload.shortBio,
      whyChooseYou: rawPayload.whyChooseYou,
      city: rawPayload.city,
      industries: normalizeArray(rawPayload.industries),
      fundingTypes: normalizeArray(rawPayload.fundingTypes),
      specialties: normalizeArray(rawPayload.specialties),
      markets: normalizeArray(rawPayload.markets),
      urgencyCategory: rawPayload.urgencyCategory || 'standard',
      profileImage: normalizeUrl(rawPayload.profileImage),
      logoUrl: normalizeUrl(rawPayload.logoUrl),
      bookingUrl: normalizeUrl(rawPayload.bookingUrl),
      primaryCtaLabel: rawPayload.primaryCtaLabel,
      primaryCtaLink: normalizeUrl(rawPayload.primaryCtaLink),
      disclosures: normalizeArray(rawPayload.disclosures),
      profileStatus: 'pending_review',
      updatedAt: new Date().toISOString()
    });

    // Do not publish here. Publication remains a separate approval-gated action.
    const notionResponse = await upsertNotionCRMRecord(canonicalData, 'in_review');
    if (!notionResponse.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to process downstream updates', notionDetails: notionResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Existing partner profile enrichment ingested successfully',
      canonicalShape: canonicalData,
      notionId: notionResponse.notionId,
      publicationEligible: false
    });
  } catch (error: any) {
    console.error('Error processing profile webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
