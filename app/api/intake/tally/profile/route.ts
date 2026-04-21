import { NextRequest, NextResponse } from 'next/server';
import { validateProfilePayload } from '@/lib/validation';
import { normalizeUrl, normalizeArray } from '@/lib/intake-normalizers';
import { upsertNotionCRMRecord } from '@/lib/notion';
import { publishBrokerToWix } from '@/lib/publish-broker';
import { CanonicalBrokerProfile } from '@/lib/field-mapping';

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.json();

    const validationResult = validateProfilePayload(rawPayload);
    if (!validationResult.isValid) {
      return NextResponse.json({ success: false, errors: validationResult.errors }, { status: 400 });
    }

    // Map fields from Tally Profile Builder to canonical schema
    const canonicalData: Partial<CanonicalBrokerProfile> = {
      email: rawPayload.email,
      shortBio: rawPayload.shortBio,
      whyChooseYou: rawPayload.whyChooseYou,
      city: rawPayload.city,
      industries: normalizeArray(rawPayload.industries),
      fundingTypes: normalizeArray(rawPayload.fundingTypes),
      urgencyCategory: rawPayload.urgencyCategory || 'standard',
      profileImage: normalizeUrl(rawPayload.profileImage),
      primaryCtaLabel: rawPayload.primaryCtaLabel,
      primaryCtaLink: normalizeUrl(rawPayload.primaryCtaLink),
    };

    // Update CRM record (mark under review or similar)
    const notionResponse = await upsertNotionCRMRecord(canonicalData, 'in_review');

    // Assuming we want to publish or update Wix with the new profile data
    // Even if it's pending, we might create a disabled Wix record
    const wixResponse = await publishBrokerToWix(canonicalData);

    if (!notionResponse.success || !wixResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process downstream updates',
          notionDetails: notionResponse.error,
          wixDetails: wixResponse.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile builder data ingested successfully',
      canonicalShape: canonicalData,
      notionId: notionResponse.notionId,
      wixId: wixResponse.wixId
    });
  } catch (error: any) {
    console.error('Error processing profile webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
