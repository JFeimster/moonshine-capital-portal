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
import { upsertNotionCRMRecord } from '@/lib/notion';
import { CanonicalBrokerProfile } from '@/lib/field-mapping';
import { validateWebhookAuth } from '@/lib/webhook-auth';

export async function POST(req: NextRequest) {
  try {
    if (!validateWebhookAuth(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    // Accepts pre-normalized JSON (for example from n8n), not a raw Tally webhook.
    const rawPayload = await req.json();
    const validationResult = validateApplicationPayload(rawPayload);
    if (!validationResult.isValid) {
      return NextResponse.json({ success: false, errors: validationResult.errors }, { status: 400 });
    }

    const email = normalizeEmail(rawPayload.email);
    const now = new Date().toISOString();

    // Deterministic fallback identity makes retries converge on the same partner.
    // Supplied canonical identity is preserved when present.
    const partnerId = rawPayload.partnerId || generatePartnerId(email);
    const referralCode = rawPayload.referralCode || generateReferralCode(email);
    const slug = rawPayload.slug || generatePartnerSlug(rawPayload.fullName, email);

    const canonicalData: Partial<CanonicalBrokerProfile> = {
      fullName: rawPayload.fullName,
      displayName: rawPayload.displayName || rawPayload.fullName,
      email,
      agencyName: rawPayload.agencyName,
      state: normalizeState(rawPayload.state),
      websiteUrl: normalizeUrl(rawPayload.websiteUrl),
      phoneNumber: rawPayload.phoneNumber,
      partnerId,
      referralCode,
      slug,
      partnerType: rawPayload.partnerType || 'funding_partner',
      profileStatus: 'pending_review',
      approvalStatus: 'pending',
      createdAt: rawPayload.createdAt || now,
      updatedAt: now
    };

    const notionResponse = await upsertNotionCRMRecord(canonicalData, 'pending');
    if (!notionResponse.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to ingest into CRM', details: notionResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application ingested and draft partner identity provisioned',
      canonicalShape: canonicalData,
      notionId: notionResponse.notionId,
      publicationEligible: false
    });
  } catch (error: any) {
    console.error('Error processing application webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
