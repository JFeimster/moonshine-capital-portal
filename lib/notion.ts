import { CanonicalBrokerProfile } from './field-mapping';
import { normalizeEmail } from './intake-normalizers';

const NOTION_VERSION = '2022-06-28';
const NOTION_API_BASE = 'https://api.notion.com/v1';

type NotionErrorKind = 'configuration' | 'not_found' | 'transient' | 'validation' | 'conflict' | 'unknown';

export interface NotionAdapterError {
  kind: NotionErrorKind;
  message: string;
  status?: number;
  retryable: boolean;
}

export interface PersistedPartner extends Partial<CanonicalBrokerProfile> {
  notionPageId: string;
  createdTime?: string;
}

export interface NotionAdapterResponse {
  success: boolean;
  notionId?: string;
  partner?: PersistedPartner;
  created?: boolean;
  matchedBy?: 'partner_id' | 'submission_id' | 'email';
  error?: string;
  errorDetails?: NotionAdapterError;
}

export interface UpsertPartnerOptions {
  allowCreate?: boolean;
}

function config() {
  const token = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_BROKER_DATABASE_ID;
  if (!token || !databaseId) {
    throw Object.assign(new Error('Notion persistence is not configured'), {
      notionKind: 'configuration' as NotionErrorKind,
      retryable: false
    });
  }
  return { token, databaseId };
}

function typedError(message: string, kind: NotionErrorKind, retryable = false) {
  return Object.assign(new Error(message), { notionKind: kind, retryable });
}

function asError(error: any): NotionAdapterError {
  const status = Number(error?.status || 0) || undefined;
  const kind: NotionErrorKind = error?.notionKind ||
    (status === 404 ? 'not_found' : status === 409 ? 'conflict' : status === 400 ? 'validation' : status && status >= 500 ? 'transient' : 'unknown');
  return {
    kind,
    message: error?.message || 'Unknown Notion persistence error',
    status,
    retryable: error?.retryable ?? kind === 'transient'
  };
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
    const error: any = new Error(body?.message || `Notion API request failed with ${response.status}`);
    error.status = response.status;
    error.notionKind = response.status === 409 ? 'conflict' : response.status === 400 ? 'validation' : response.status === 404 ? 'not_found' : response.status >= 500 ? 'transient' : 'unknown';
    error.retryable = response.status === 429 || response.status >= 500;
    throw error;
  }
  return body;
}

const text = (value?: string) => value ? { rich_text: [{ type: 'text', text: { content: value } }] } : undefined;
const title = (value?: string) => value ? { title: [{ type: 'text', text: { content: value } }] } : undefined;
const email = (value?: string) => value ? { email: value } : undefined;
const phone = (value?: string) => value ? { phone_number: value } : undefined;
const url = (value?: string) => value ? { url: value } : undefined;
const select = (value?: string) => value ? { select: { name: value } } : undefined;
const date = (value?: string) => value ? { date: { start: value } } : undefined;
const joined = (value?: string[]) => value?.length ? text(value.join(', ')) : undefined;

function compactProperties(value: Record<string, any>) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}

function toNotionProperties(partner: Partial<CanonicalBrokerProfile>, creating = false) {
  const partnerType = partner.partnerType === 'funding_agent' ? 'Funding Agent' : partner.partnerType;
  return compactProperties({
    Name: creating ? title(partner.fullName || partner.displayName || partner.email || 'Partner') : (partner.fullName ? title(partner.fullName) : undefined),
    Email: email(partner.email),
    Company: text(partner.agencyName),
    Phone: phone(partner.phoneNumber),
    'Partner ID': text(partner.partnerId),
    'Referral Code': text(partner.referralCode),
    Slug: text(partner.slug),
    'Partner Type': select(partnerType),
    'Approval Status': select(partner.approvalStatus),
    'Profile Status': select(partner.profileStatus),
    'Review Reason': text(partner.reviewReason),
    'Source Form': text(partner.sourceForm),
    'Tally Form ID': text(partner.tallyFormId),
    'Latest Tally Submission ID': text(partner.latestTallySubmissionId),
    'Tally Submission ID': text(partner.latestTallySubmissionId),
    'Initial Submission At': date(partner.initialSubmissionAt || partner.createdAt),
    'Latest Submission At': date(partner.latestSubmissionAt),
    'Updated At': date(partner.updatedAt),
    'Application Date': creating ? date(partner.initialSubmissionAt || partner.createdAt) : undefined,
    'Referral Source': partner.sourceForm ? select('Tally Form') : undefined,
    'Display Name': text(partner.displayName),
    City: text(partner.city),
    State: text(partner.state),
    'Website URL': url(partner.websiteUrl),
    Website: url(partner.websiteUrl),
    Bio: text(partner.shortBio),
    'Why Choose You': text(partner.whyChooseYou),
    'Urgency Category': text(partner.urgencyCategory),
    'Photo URL': url(partner.profileImage),
    'Logo URL': url(partner.logoUrl),
    Specialties: joined(partner.specialties),
    Industries: joined(partner.industries),
    'Funding Types': joined(partner.fundingTypes),
    Markets: joined(partner.markets),
    'Booking URL': url(partner.bookingUrl),
    'Primary CTA Label': text(partner.primaryCtaLabel),
    'Primary CTA URL': url(partner.primaryCtaLink),
    Disclosures: joined(partner.disclosures)
  });
}

function propText(prop: any): string {
  if (!prop) return '';
  if (prop.type === 'title') return (prop.title || []).map((x: any) => x.plain_text || x.text?.content || '').join('');
  if (prop.type === 'rich_text') return (prop.rich_text || []).map((x: any) => x.plain_text || x.text?.content || '').join('');
  if (prop.type === 'email') return prop.email || '';
  if (prop.type === 'phone_number') return prop.phone_number || '';
  if (prop.type === 'url') return prop.url || '';
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'date') return prop.date?.start || '';
  return '';
}

function splitList(value: string): string[] {
  return value ? value.split(',').map(item => item.trim()).filter(Boolean) : [];
}

function fromNotionPage(page: any): PersistedPartner {
  const p = page.properties || {};
  const partnerType = propText(p['Partner Type']) === 'Funding Agent' ? 'funding_agent' : propText(p['Partner Type']);
  return {
    notionPageId: page.id,
    createdTime: page.created_time,
    fullName: propText(p.Name),
    displayName: propText(p['Display Name']) || propText(p.Name),
    email: normalizeEmail(propText(p.Email)),
    agencyName: propText(p.Company),
    phoneNumber: propText(p.Phone),
    partnerId: propText(p['Partner ID']),
    referralCode: propText(p['Referral Code']),
    slug: propText(p.Slug),
    partnerType,
    approvalStatus: propText(p['Approval Status']) as any,
    profileStatus: propText(p['Profile Status']) as any,
    reviewReason: propText(p['Review Reason']),
    sourceForm: propText(p['Source Form']),
    tallyFormId: propText(p['Tally Form ID']),
    latestTallySubmissionId: propText(p['Latest Tally Submission ID']) || propText(p['Tally Submission ID']),
    initialSubmissionAt: propText(p['Initial Submission At']) || propText(p['Application Date']),
    latestSubmissionAt: propText(p['Latest Submission At']),
    updatedAt: propText(p['Updated At']),
    city: propText(p.City),
    state: propText(p.State),
    websiteUrl: propText(p['Website URL']) || propText(p.Website),
    shortBio: propText(p.Bio),
    whyChooseYou: propText(p['Why Choose You']),
    urgencyCategory: propText(p['Urgency Category']) || 'standard',
    profileImage: propText(p['Photo URL']),
    logoUrl: propText(p['Logo URL']),
    specialties: splitList(propText(p.Specialties)),
    industries: splitList(propText(p.Industries)),
    fundingTypes: splitList(propText(p['Funding Types'])),
    markets: splitList(propText(p.Markets)),
    bookingUrl: propText(p['Booking URL']),
    primaryCtaLabel: propText(p['Primary CTA Label']),
    primaryCtaLink: propText(p['Primary CTA URL']),
    disclosures: splitList(propText(p.Disclosures))
  };
}

async function queryMatches(property: string, condition: Record<string, any>, pageSize = 10): Promise<PersistedPartner[]> {
  const { databaseId } = config();
  const body = await notionRequest(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({ page_size: pageSize, filter: { property, ...condition } })
  });
  return (body.results || []).map(fromNotionPage);
}

function deterministicWinner(partners: PersistedPartner[]) {
  return [...partners].sort((a, b) => {
    const timeCompare = (a.createdTime || '').localeCompare(b.createdTime || '');
    return timeCompare || a.notionPageId.localeCompare(b.notionPageId);
  })[0];
}

async function archiveDuplicate(partner: PersistedPartner, winnerId: string) {
  await notionRequest(`/pages/${partner.notionPageId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: compactProperties({
        'Approval Status': select('needs_review'),
        'Profile Status': select('archived'),
        'Review Reason': text(`Duplicate canonical record reconciled; canonical page ${winnerId}`)
      })
    })
  });
}

async function reconcileSameIdentity(matches: PersistedPartner[]): Promise<PersistedPartner> {
  const identitySet = new Set(matches.map(item => item.partnerId).filter(Boolean));
  if (identitySet.size > 1) {
    throw typedError('Multiple records resolve to different canonical partner IDs', 'conflict');
  }
  const winner = deterministicWinner(matches);
  await Promise.all(matches.filter(item => item.notionPageId !== winner.notionPageId).map(item => archiveDuplicate(item, winner.notionPageId)));
  return winner;
}

async function queryOne(property: string, condition: Record<string, any>, reconcileIfSameIdentity = false): Promise<PersistedPartner | null> {
  const matches = await queryMatches(property, condition);
  if (matches.length > 1) {
    if (reconcileIfSameIdentity) return reconcileSameIdentity(matches);
    throw typedError(`Duplicate canonical records matched ${property}`, 'conflict');
  }
  return matches[0] || null;
}

export async function getPartnerByPartnerId(partnerId: string) {
  return partnerId ? queryOne('Partner ID', { rich_text: { equals: partnerId } }, true) : null;
}

export async function getPartnerByNormalizedEmail(value: string) {
  const normalized = normalizeEmail(value);
  const matches = normalized ? await queryMatches('Email', { email: { equals: normalized } }) : [];
  if (matches.length > 1) return reconcileSameIdentity(matches);
  return matches[0] || null;
}

export async function getPartnerBySlug(slug: string) {
  return slug ? queryOne('Slug', { rich_text: { equals: slug } }, true) : null;
}

export async function getPartnerBySubmissionId(submissionId: string) {
  return submissionId ? queryOne('Latest Tally Submission ID', { rich_text: { equals: submissionId } }, true) : null;
}

export async function listPublishedPartners(): Promise<PersistedPartner[]> {
  const { databaseId } = config();
  const body = await notionRequest(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      page_size: 100,
      filter: {
        and: [
          { property: 'Approval Status', select: { equals: 'approved' } },
          { property: 'Profile Status', select: { equals: 'published' } }
        ]
      }
    })
  });
  return (body.results || []).map(fromNotionPage);
}

export async function createPartner(partner: Partial<CanonicalBrokerProfile>): Promise<PersistedPartner> {
  const { databaseId } = config();
  const page = await notionRequest('/pages', {
    method: 'POST',
    body: JSON.stringify({ parent: { database_id: databaseId }, properties: toNotionProperties(partner, true) })
  });
  return fromNotionPage(page);
}

export async function updatePartner(notionPageId: string, partner: Partial<CanonicalBrokerProfile>): Promise<PersistedPartner> {
  const page = await notionRequest(`/pages/${notionPageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties: toNotionProperties(partner, false) })
  });
  return fromNotionPage(page);
}

function nonBlankMerge(existing: PersistedPartner, incoming: Partial<CanonicalBrokerProfile>) {
  const merged: Record<string, any> = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    merged[key] = value;
  }

  merged.partnerId = existing.partnerId || incoming.partnerId;
  merged.referralCode = existing.referralCode || incoming.referralCode;
  merged.slug = existing.slug || incoming.slug;
  merged.initialSubmissionAt = existing.initialSubmissionAt || incoming.initialSubmissionAt || incoming.createdAt;

  if (existing.approvalStatus && existing.approvalStatus !== 'needs_review') {
    merged.approvalStatus = existing.approvalStatus;
  }
  if (existing.profileStatus && existing.profileStatus !== 'draft') {
    merged.profileStatus = existing.profileStatus;
  }

  return merged as Partial<CanonicalBrokerProfile>;
}

async function reconcileCreation(partner: Partial<CanonicalBrokerProfile>, created: PersistedPartner) {
  const matches = partner.partnerId
    ? await queryMatches('Partner ID', { rich_text: { equals: partner.partnerId } })
    : partner.email
      ? await queryMatches('Email', { email: { equals: normalizeEmail(partner.email) } })
      : [created];

  if (matches.length <= 1) return created;
  return reconcileSameIdentity(matches);
}

async function assertSecondaryKeysCompatible(existing: PersistedPartner, partner: Partial<CanonicalBrokerProfile>) {
  if (partner.email) {
    const byEmail = await getPartnerByNormalizedEmail(partner.email);
    if (byEmail && byEmail.notionPageId !== existing.notionPageId) {
      throw typedError('Supplied email resolves to a different canonical partner', 'conflict');
    }
  }
  if (partner.latestTallySubmissionId) {
    const bySubmission = await getPartnerBySubmissionId(partner.latestTallySubmissionId);
    if (bySubmission && bySubmission.notionPageId !== existing.notionPageId) {
      throw typedError('Supplied submission ID resolves to a different canonical partner', 'conflict');
    }
  }
}

export async function upsertPartner(partner: Partial<CanonicalBrokerProfile>, options: UpsertPartnerOptions = {}): Promise<NotionAdapterResponse> {
  try {
    let existing: PersistedPartner | null = null;
    let matchedBy: NotionAdapterResponse['matchedBy'];

    if (partner.partnerId) {
      existing = await getPartnerByPartnerId(partner.partnerId);
      if (existing) matchedBy = 'partner_id';
    }
    if (!existing && partner.latestTallySubmissionId) {
      existing = await getPartnerBySubmissionId(partner.latestTallySubmissionId);
      if (existing) matchedBy = 'submission_id';
    }
    if (!existing && partner.email) {
      existing = await getPartnerByNormalizedEmail(partner.email);
      if (existing) matchedBy = 'email';
    }

    if (existing) {
      if (partner.partnerId && existing.partnerId && partner.partnerId !== existing.partnerId) {
        throw typedError('Canonical partner_id conflicts with the matched existing record', 'conflict');
      }
      await assertSecondaryKeysCompatible(existing, partner);
      const merged = nonBlankMerge(existing, partner);
      const updated = await updatePartner(existing.notionPageId, merged);
      return { success: true, notionId: updated.notionPageId, partner: updated, created: false, matchedBy };
    }

    if (options.allowCreate === false) {
      throw typedError('No existing canonical partner matched the enrichment payload', 'not_found');
    }

    const created = await createPartner(partner);
    const canonical = await reconcileCreation(partner, created);
    return {
      success: true,
      notionId: canonical.notionPageId,
      partner: canonical,
      created: canonical.notionPageId === created.notionPageId
    };
  } catch (error: any) {
    const details = asError(error);
    return { success: false, error: details.message, errorDetails: details };
  }
}

export async function upsertNotionCRMRecord(partner: Partial<CanonicalBrokerProfile>): Promise<NotionAdapterResponse> {
  return upsertPartner(partner);
}
