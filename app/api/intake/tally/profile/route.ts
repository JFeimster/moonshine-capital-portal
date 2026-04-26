import { NextRequest, NextResponse } from 'next/server';
import { validateProfilePayload } from '@/lib/validation';
import { normalizeUrl, normalizeArray } from '@/lib/intake-normalizers';
import { upsertNotionCRMRecord } from '@/lib/notion';
import { CanonicalBrokerProfile } from '@/lib/field-mapping';
import { validateWebhookAuth } from '@/lib/webhook-auth';

export async function POST(req: NextRequest) {
  try {
    // Enforce webhook authorization
    if (!validateWebhookAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    // CONTRACT: This endpoint strictly accepts pre-normalized JSON payloads (e.g., from n8n)
    // that conform to the CanonicalBrokerProfile schema.
    // It DOES NOT parse raw Tally webhooks. The Tally -> Canonical mapping MUST occur in n8n.
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
    // NOTE: We deliberately DO NOT publish to Wix CMS here.
    // Wix publishing must happen as an explicit downstream step (e.g., after approval)
    // to maintain Notion as the operational source of truth.
    const notionResponse = await upsertNotionCRMRecord(canonicalData, 'in_review');

    if (!notionResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process downstream updates',
          notionDetails: notionResponse.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile builder data ingested successfully',
      canonicalShape: canonicalData,
      notionId: notionResponse.notionId
    });
  } catch (error: any) {
    console.error('Error processing profile webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
