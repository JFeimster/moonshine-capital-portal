import { ParsedTallySubmission, asString } from '@/lib/tally-webhook';

const NOTION_VERSION = '2022-06-28';
const NOTION_API_BASE = 'https://api.notion.com/v1';

export type FundingLeadResult = {
  success: boolean;
  status: number;
  result?: 'created' | 'updated' | 'duplicate_replayed';
  notionId?: string;
  externalLeadId?: string;
  error?: string;
  retryable?: boolean;
};

type FundingLeadInput = {
  externalLeadId: string;
  eventId: string;
  formId: string;
  submissionId: string;
  stage: 'funding_intake' | 'funding_application';
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  requestedAmount?: number;
  requestedAmountRange?: string;
  averageMonthlyRevenue?: number;
  timeInBusiness?: string;
  businessBankAccount?: 'Yes' | 'No' | 'Unknown';
  accountType?: 'business' | 'personal' | 'mixed' | 'unknown';
  partnerId: string;
  campaignId: string;
  sourceUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  originalRequestedRange: string;
  notes: string;
};

function config() {
  const token = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_FUNDING_LEADS_DB_ID;
  if (!token || !databaseId) {
    throw Object.assign(new Error('Funding Leads persistence is not configured'), {
      status: 503,
      retryable: false
    });
  }
  return { token, databaseId };
}

async function notionRequest(path: string, init: RequestInit = {}) {
  const { token } = config();
  const response = await fetch(`${NOTION_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(body?.message || `Notion Funding Leads request failed with ${response.status}`), {
      status: response.status,
      retryable: response.status === 429 || response.status >= 500
    });
  }
  return body;
}

function compactProperties(value: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}

const title = (value: string) => ({ title: [{ type: 'text', text: { content: value.slice(0, 2000) } }] });
const text = (value?: string) => value ? { rich_text: [{ type: 'text', text: { content: value.slice(0, 2000) } }] } : undefined;
const email = (value?: string) => value ? { email: value.toLowerCase() } : undefined;
const phone = (value?: string) => value ? { phone_number: value } : undefined;
const url = (value?: string) => value && /^https?:\/\//i.test(value) ? { url: value } : undefined;
const number = (value?: number) => Number.isFinite(value) ? { number: value } : undefined;
const select = (value?: string) => value ? { select: { name: value } } : undefined;
const status = (value?: string) => value ? { status: { name: value } } : undefined;
const checkbox = (value: boolean) => ({ checkbox: value });

function propText(prop: any): string {
  if (!prop) return '';
  if (prop.type === 'title') return (prop.title || []).map((item: any) => item.plain_text || item.text?.content || '').join('');
  if (prop.type === 'rich_text') return (prop.rich_text || []).map((item: any) => item.plain_text || item.text?.content || '').join('');
  if (prop.type === 'email') return prop.email || '';
  return '';
}

function parseMagnitude(value: string): number | undefined {
  const normalized = value.replace(/[$,\s]/g, '').toLowerCase();
  const match = normalized.match(/(-?\d+(?:\.\d+)?)([km])?/);
  if (!match) return undefined;
  const base = Number(match[1]);
  if (!Number.isFinite(base)) return undefined;
  const multiplier = match[2] === 'm' ? 1_000_000 : match[2] === 'k' ? 1_000 : 1;
  return base * multiplier;
}

export function parseMoneyValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const raw = asString(value);
  if (!raw) return undefined;

  const tokens = raw.match(/\$?\s*\d[\d,]*(?:\.\d+)?\s*[kKmM]?/g) || [];
  const values = tokens
    .map((token) => parseMagnitude(token))
    .filter((item): item is number => item !== undefined);
  if (!values.length) return undefined;
  if (values.length === 1) return values[0];
  return Math.round((values[0] + values[1]) / 2);
}

export function requestedAmountBand(amount?: number): string {
  if (!Number.isFinite(amount)) return 'Unknown';
  if ((amount as number) < 10_000) return 'Under $10K';
  if ((amount as number) <= 25_000) return '$10K–$25K';
  if ((amount as number) <= 50_000) return '$25K–$50K';
  if ((amount as number) <= 100_000) return '$50K–$100K';
  if ((amount as number) <= 250_000) return '$100K–$250K';
  if ((amount as number) <= 500_000) return '$250K–$500K';
  return '$500K+';
}

export function timeInBusinessBand(value: unknown): string {
  const raw = asString(value).toLowerCase();
  if (!raw) return 'Unknown';
  if (/pre[-\s]?revenue|not started|startup/.test(raw)) return 'Pre-revenue';

  const numberMatch = raw.match(/(\d+(?:\.\d+)?)/);
  const quantity = numberMatch ? Number(numberMatch[1]) : NaN;
  if (Number.isFinite(quantity)) {
    const months = /year|yr/.test(raw) ? quantity * 12 : quantity;
    if (months < 3) return 'Under 3 months';
    if (months < 6) return '3–6 months';
    if (months < 12) return '6–12 months';
    if (months < 24) return '1–2 years';
    return '2+ years';
  }

  if (/2\+|over 2|more than 2/.test(raw)) return '2+ years';
  return 'Unknown';
}

export function bankAccountClassification(value: unknown) {
  const raw = asString(value).toLowerCase();
  const hasBusiness = /business|company|llc|corp/.test(raw);
  const hasPersonal = /personal|individual|my name/.test(raw);

  if (hasBusiness && hasPersonal) return { businessBankAccount: 'Yes' as const, accountType: 'mixed' as const };
  if (hasBusiness) return { businessBankAccount: 'Yes' as const, accountType: 'business' as const };
  if (hasPersonal) return { businessBankAccount: 'No' as const, accountType: 'personal' as const };
  return { businessBankAccount: 'Unknown' as const, accountType: 'unknown' as const };
}

export function externalLeadIdForSubmission(submission: ParsedTallySubmission): string {
  const sessionId = asString(submission.hidden.session_id);
  return sessionId
    ? `tally-session:${sessionId}`
    : `tally:${submission.formId}:${submission.submissionId}`;
}

function cleanEmail(value: unknown): string {
  return asString(value).trim().toLowerCase();
}

function safeUrl(value: unknown): string {
  const candidate = asString(value);
  return /^https?:\/\//i.test(candidate) ? candidate : '';
}

function normalizeFundingLead(submission: ParsedTallySubmission): FundingLeadInput {
  const firstName = asString(submission.fields.firstName);
  const lastName = asString(submission.fields.lastName);
  const contactName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const businessName = asString(submission.fields.businessName);
  const emailValue = cleanEmail(submission.fields.email);
  const phoneValue = asString(submission.fields.phoneNumber);

  if (!emailValue) throw Object.assign(new Error('Funding lead email is required'), { status: 400, retryable: false });
  if (!contactName) throw Object.assign(new Error('Funding lead contact name is required'), { status: 400, retryable: false });

  const requestedRaw = submission.kind === 'funding_application'
    ? submission.fields.requestedAmountRangeRaw
    : submission.fields.requestedAmount;
  const requestedAmount = parseMoneyValue(requestedRaw);
  const requestedRange = requestedAmountBand(requestedAmount);
  const averageMonthlyRevenue = parseMoneyValue(submission.fields.averageMonthlyRevenue);
  const bank = bankAccountClassification(submission.fields.bankAccountOwnership);
  const originalRequestedRange = submission.kind === 'funding_application' ? asString(requestedRaw) : '';

  const notes = [
    submission.kind === 'funding_intake' ? 'Canonical Step 1 funding intake.' : 'Canonical Step 2/full funding application.',
    originalRequestedRange ? `Applicant-selected funding range: ${originalRequestedRange}.` : '',
    submission.kind === 'funding_application'
      ? 'DOB and residential address fields are intentionally excluded from the Funding Leads projection.'
      : ''
  ].filter(Boolean).join(' ');

  return {
    externalLeadId: externalLeadIdForSubmission(submission),
    eventId: submission.eventId,
    formId: submission.formId,
    submissionId: submission.submissionId,
    stage: submission.kind as 'funding_intake' | 'funding_application',
    businessName,
    contactName,
    email: emailValue,
    phone: phoneValue,
    requestedAmount,
    requestedAmountRange: requestedRange,
    averageMonthlyRevenue,
    timeInBusiness: submission.kind === 'funding_intake'
      ? timeInBusinessBand(submission.fields.timeInBusiness)
      : undefined,
    businessBankAccount: submission.kind === 'funding_intake' ? bank.businessBankAccount : undefined,
    accountType: submission.kind === 'funding_intake' ? bank.accountType : undefined,
    partnerId: asString(submission.hidden.partner_id),
    campaignId: asString(submission.hidden.campaign || submission.hidden.utm_campaign),
    sourceUrl: safeUrl(submission.hidden.originPage),
    utmSource: asString(submission.hidden.utm_source),
    utmMedium: asString(submission.hidden.utm_medium),
    utmCampaign: asString(submission.hidden.utm_campaign),
    utmContent: asString(submission.hidden.utm_content),
    utmTerm: asString(submission.hidden.utm_term),
    originalRequestedRange,
    notes
  };
}

function intakeChannel(input: FundingLeadInput): string {
  if (input.partnerId) return 'Partner';
  return 'Website';
}

function nextAction(input: FundingLeadInput): string {
  return input.stage === 'funding_intake'
    ? 'Review core funding request and determine whether the full application or another next step is appropriate.'
    : 'Review full application, reconcile it to any prior funding intake, and request any missing underwriting information.';
}

function safeAuditEnvelope(input: FundingLeadInput) {
  return JSON.stringify({
    source: 'tally',
    form_id: input.formId,
    submission_id: input.submissionId,
    webhook_event_id: input.eventId,
    stage: input.stage,
    external_lead_id: input.externalLeadId
  });
}

function buildProperties(input: FundingLeadInput, existing = false) {
  const displayName = input.businessName || input.contactName || input.email;
  return compactProperties({
    Name: existing ? undefined : title(`${displayName} — Tally Funding Lead`),
    'External Lead ID': existing ? undefined : text(input.externalLeadId),
    'Webhook Event ID': text(input.eventId),
    Company: text(input.businessName),
    'Contact Name': text(input.contactName),
    Email: email(input.email),
    Phone: phone(input.phone),
    'Requested Amount': number(input.requestedAmount),
    'Requested Amount Range': select(input.requestedAmountRange),
    'Monthly Revenue': number(input.averageMonthlyRevenue),
    'Average Monthly Revenue': number(input.averageMonthlyRevenue),
    'Time in Business': select(input.timeInBusiness),
    'Business Bank Account': select(input.businessBankAccount),
    'Account Type': select(input.accountType),
    'Lead Status': status('New'),
    'Review Status': status('Received'),
    'Lead Priority': select('Warm'),
    'Funding Readiness Tier': select('Manual Review'),
    'Manual Review Recommended': checkbox(true),
    'Lead Type': select('Business Funding'),
    Source: select('Tally'),
    'Lead Source Asset': select('Tally'),
    'Intake Channel': select(intakeChannel(input)),
    'Submission Method': select('Form'),
    'Sync Status': select('Synced'),
    'Partner ID': text(input.partnerId),
    'Campaign ID': text(input.campaignId),
    'Source URL': url(input.sourceUrl),
    'UTM Source': text(input.utmSource),
    'UTM Medium': text(input.utmMedium),
    'UTM Campaign': text(input.utmCampaign),
    'UTM Content': text(input.utmContent),
    'UTM Term': text(input.utmTerm),
    'Next Action': text(nextAction(input)),
    Notes: text(input.notes),
    'API Payload': text(safeAuditEnvelope(input))
  });
}

async function findByExternalLeadId(externalLeadId: string) {
  const { databaseId } = config();
  const body = await notionRequest(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      page_size: 1,
      filter: {
        property: 'External Lead ID',
        rich_text: { equals: externalLeadId }
      }
    })
  });
  return body.results?.[0] || null;
}

function assertIdentityCompatible(existing: any, input: FundingLeadInput) {
  if (!existing?.properties) return;
  const existingEmail = propText(existing.properties.Email).toLowerCase();
  const existingCompany = propText(existing.properties.Company).toLowerCase();
  if (existingEmail && existingEmail !== input.email.toLowerCase()) {
    throw Object.assign(new Error('External lead ID is associated with a different email identity'), { status: 409, retryable: false });
  }
  if (existingCompany && input.businessName && existingCompany !== input.businessName.toLowerCase()) {
    throw Object.assign(new Error('External lead ID is associated with a different business identity'), { status: 409, retryable: false });
  }
}

function isReplay(existing: any, input: FundingLeadInput) {
  return propText(existing?.properties?.['Webhook Event ID']) === input.eventId;
}

export async function upsertFundingLead(submission: ParsedTallySubmission): Promise<FundingLeadResult> {
  try {
    const input = normalizeFundingLead(submission);
    const { databaseId } = config();
    const existing = await findByExternalLeadId(input.externalLeadId);
    assertIdentityCompatible(existing, input);

    if (existing && isReplay(existing, input)) {
      return {
        success: true,
        status: 200,
        result: 'duplicate_replayed',
        notionId: existing.id,
        externalLeadId: input.externalLeadId
      };
    }

    if (existing) {
      const page = await notionRequest(`/pages/${existing.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties: buildProperties(input, true) })
      });
      return {
        success: true,
        status: 200,
        result: 'updated',
        notionId: page.id,
        externalLeadId: input.externalLeadId
      };
    }

    const page = await notionRequest('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: buildProperties(input)
      })
    });
    return {
      success: true,
      status: 201,
      result: 'created',
      notionId: page.id,
      externalLeadId: input.externalLeadId
    };
  } catch (error: any) {
    return {
      success: false,
      status: Number(error?.status) || 500,
      error: error?.message || 'Funding Leads persistence failed',
      retryable: Boolean(error?.retryable)
    };
  }
}
