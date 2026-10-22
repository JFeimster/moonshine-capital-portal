/** Server-only bridge to the canonical partner CRM. The Tally signature is checked by the caller. */
const CANONICAL_INGEST_URL = 'https://loaowmappekunngjknnx.supabase.co/functions/v1/partner-crm-ingest';

export type PartnerApplicationInput = {
  source: string;
  submission_id: string;
  email: string;
  name?: string;
  agency_name?: string;
  applicant_type?: string;
  form_id?: string;
  answers?: Record<string, unknown>;
};

export async function sendPartnerApplication(input: PartnerApplicationInput): Promise<{
  configured: boolean;
  delivered: boolean;
  duplicate?: boolean;
}> {
  const endpoint = process.env.PARTNER_CRM_INGEST_URL;
  const secret = process.env.PARTNER_CRM_INGEST_TOKEN;
  // Before activation, preserve the existing Notion intake. Once explicitly
  // required, a missing secret must not silently acknowledge a submission.
  if (!endpoint && !secret) {
    if (process.env.PARTNER_CRM_REQUIRED === 'true') {
      throw new Error('partner_crm_not_configured');
    }
    return { configured: false, delivered: false };
  }
  if (!endpoint || !secret || endpoint !== CANONICAL_INGEST_URL) {
    throw new Error('partner_crm_configuration_incomplete');
  }
  if (!input.source || !input.submission_id || !input.email) {
    throw new Error('partner_crm_submission_identity_required');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
    body: JSON.stringify(input),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`partner_crm_ingest_http_${response.status}`);
  const receipt: unknown = await response.json();
  if (!receipt || typeof receipt !== 'object' || !('ok' in receipt) || receipt.ok !== true ||
      !('application_id' in receipt) || typeof receipt.application_id !== 'string') {
    throw new Error('partner_crm_invalid_receipt');
  }
  return { configured: true, delivered: true, duplicate: 'duplicate' in receipt && receipt.duplicate === true };
}
