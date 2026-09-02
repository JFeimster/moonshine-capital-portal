import { NextResponse } from 'next/server';
import { upsertFundingLead } from '@/lib/funding-leads';
import { processFundingAgentJoin, processFundingAgentProfile } from '@/lib/intake/funding-agent';
import {
  TallyWebhookPayload,
  asString,
  asStringList,
  firstUrl,
  parseTallySubmission,
  verifyTallyWebhookSignature
} from '@/lib/tally-webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function signatureHeader(request: Request) {
  return request.headers.get('tally-signature') || request.headers.get('x-tally-signature');
}

function agentJoinPayload(submission: ReturnType<typeof parseTallySubmission>) {
  return {
    fullName: asString(submission.fields.fullName),
    email: asString(submission.fields.email),
    phoneNumber: asString(submission.fields.phoneNumber),
    formId: submission.formId,
    submissionId: submission.submissionId,
    tallyFormId: submission.formId,
    tallySubmissionId: submission.submissionId,
    createdAt: submission.createdAt
  };
}

function agentProfilePayload(submission: ReturnType<typeof parseTallySubmission>) {
  return {
    // A hidden partner_id is useful for attribution, but it is not proof that the
    // public respondent owns an existing profile. Raw public enrichment therefore
    // resolves by email and is additionally constrained to needs_review + draft.
    email: asString(submission.fields.email),
    displayName: asString(submission.fields.displayName),
    agencyName: asString(submission.fields.agencyName),
    city: asString(submission.fields.city),
    state: asString(submission.fields.state),
    shortBio: asString(submission.fields.shortBio),
    whyChooseYou: asString(submission.fields.whyChooseYou),
    profileImage: firstUrl(submission.fields.profileImage) || undefined,
    websiteUrl: asString(submission.fields.websiteUrl),
    bookingUrl: asString(submission.fields.bookingUrl),
    fundingTypes: asStringList(submission.fields.fundingTypes),
    industries: asStringList(submission.fields.industries),
    markets: asStringList(submission.fields.markets),
    primaryCtaLabel: asString(submission.fields.primaryCtaLabel),
    primaryCtaLink: asString(submission.fields.primaryCtaLink),
    formId: submission.formId,
    submissionId: submission.submissionId,
    tallyFormId: submission.formId,
    tallySubmissionId: submission.submissionId,
    createdAt: submission.createdAt
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json({ success: false, error: 'Expected application/json' }, { status: 415 });
  }

  const rawBody = await request.text();
  if (!verifyTallyWebhookSignature(rawBody, signatureHeader(request))) {
    return NextResponse.json({ success: false, error: 'Invalid Tally webhook signature' }, { status: 401 });
  }

  let payload: TallyWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as TallyWebhookPayload;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (payload.eventType && payload.eventType !== 'FORM_RESPONSE') {
    return NextResponse.json({
      success: true,
      accepted: false,
      ignored: true,
      reason: 'Unsupported Tally event type'
    }, { status: 202 });
  }

  let submission: ReturnType<typeof parseTallySubmission>;
  try {
    submission = parseTallySubmission(payload);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message === 'Unsupported or missing Tally formId'
        ? 'Unsupported or missing Tally form'
        : 'Invalid Tally submission payload'
    }, { status: 400 });
  }

  try {
    if (submission.kind === 'funding_agent_join') {
      const result = await processFundingAgentJoin(agentJoinPayload(submission), { publicCreateOnly: true });
      return NextResponse.json({
        ...result.body,
        source: 'tally_webhook',
        formId: submission.formId,
        submissionId: submission.submissionId
      }, { status: result.status });
    }

    if (submission.kind === 'funding_agent_profile') {
      const result = await processFundingAgentProfile(agentProfilePayload(submission), { publicDraftOnly: true });
      return NextResponse.json({
        ...result.body,
        source: 'tally_webhook',
        formId: submission.formId,
        submissionId: submission.submissionId
      }, { status: result.status });
    }

    const result = await upsertFundingLead(submission);
    if (!result.success) {
      console.error('Direct Tally funding lead persistence failed', {
        formId: submission.formId,
        submissionId: submission.submissionId,
        status: result.status,
        error: result.error
      });
      return NextResponse.json({
        success: false,
        error: result.status === 409
          ? 'Funding lead identity conflict requires review'
          : result.status === 400
            ? 'Funding lead submission is incomplete'
            : 'Funding lead persistence failed',
        retryable: result.retryable || false
      }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      source: 'tally_webhook',
      formId: submission.formId,
      submissionId: submission.submissionId,
      externalLeadId: result.externalLeadId,
      persistence: result.result
    }, { status: result.status });
  } catch (error: any) {
    console.error('Direct Tally webhook processing failed', {
      formId: submission.formId,
      submissionId: submission.submissionId,
      message: error?.message || 'Unknown error'
    });
    return NextResponse.json({ success: false, error: 'Tally webhook processing failed' }, { status: 500 });
  }
}
