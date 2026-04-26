import { NextRequest, NextResponse } from 'next/server';
import { validateApplicationPayload } from '@/lib/validation';
import { generateSlug, normalizeUrl, normalizeState } from '@/lib/intake-normalizers';
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

    const validationResult = validateApplicationPayload(rawPayload);
    if (!validationResult.isValid) {
      return NextResponse.json({ success: false, errors: validationResult.errors }, { status: 400 });
    }

    // Map fields from Tally to canonical schema
    const canonicalData: Partial<CanonicalBrokerProfile> = {
      fullName: rawPayload.fullName,
      email: rawPayload.email,
      agencyName: rawPayload.agencyName,
      state: normalizeState(rawPayload.state),
      websiteUrl: normalizeUrl(rawPayload.websiteUrl),
      phoneNumber: rawPayload.phoneNumber,
    };

    const derivedData = {
      slug: generateSlug(rawPayload.fullName)
    };

    const combinedData = {
      ...canonicalData,
      ...derivedData,
    };

    // Attempt to create CRM record
    const notionResponse = await upsertNotionCRMRecord(combinedData, 'pending');

    if (!notionResponse.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to ingest into CRM', details: notionResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application ingested successfully',
      canonicalShape: combinedData,
      notionId: notionResponse.notionId
    });
  } catch (error: any) {
    console.error('Error processing application webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
