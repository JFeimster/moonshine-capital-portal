export const APPROVAL_STATUSES = ['approved', 'needs_review', 'suspended', 'rejected'] as const;
export const PROFILE_STATUSES = ['draft', 'published', 'hidden', 'archived'] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export const PARTNER_FIELD_GROUPS = {
  identity: ['partnerId', 'referralCode', 'slug'] as const,
  mergeKeys: ['email', 'latestTallySubmissionId'] as const,
  lifecycle: ['approvalStatus', 'profileStatus', 'reviewReason'] as const,
  publicProfile: [
    'fullName',
    'displayName',
    'agencyName',
    'title',
    'city',
    'state',
    'websiteUrl',
    'phoneNumber',
    'shortBio',
    'whyChooseYou',
    'industries',
    'fundingTypes',
    'specialties',
    'markets',
    'profileImage',
    'logoUrl',
    'bookingUrl',
    'primaryCtaLabel',
    'primaryCtaLink',
    'disclosures',
  ] as const,
  traceability: [
    'sourceForm',
    'tallyFormId',
    'latestTallySubmissionId',
    'initialSubmissionAt',
    'latestSubmissionAt',
    'updatedAt',
    'notionPageId',
  ] as const,
  serverAssigned: ['partnerType'] as const,
} as const;

export const NOTION_PARTNER_PROPERTIES = {
  fullName: 'Name',
  email: 'Email',
  agencyName: 'Company',
  phoneNumber: 'Phone',
  partnerId: 'Partner ID',
  referralCode: 'Referral Code',
  slug: 'Slug',
  partnerType: 'Partner Type',
  approvalStatus: 'Approval Status',
  profileStatus: 'Profile Status',
  reviewReason: 'Review Reason',
  sourceForm: 'Source Form',
  tallyFormId: 'Tally Form ID',
  latestTallySubmissionId: 'Latest Tally Submission ID',
  initialSubmissionAt: 'Initial Submission At',
  latestSubmissionAt: 'Latest Submission At',
  updatedAt: 'Updated At',
  displayName: 'Display Name',
  city: 'City',
  state: 'State',
  websiteUrl: 'Website URL',
  shortBio: 'Bio',
  whyChooseYou: 'Why Choose You',
  urgencyCategory: 'Urgency Category',
  profileImage: 'Photo URL',
  logoUrl: 'Logo URL',
  specialties: 'Specialties',
  industries: 'Industries',
  fundingTypes: 'Funding Types',
  markets: 'Markets',
  bookingUrl: 'Booking URL',
  primaryCtaLabel: 'Primary CTA Label',
  primaryCtaLink: 'Primary CTA URL',
  disclosures: 'Disclosures',
} as const;

export const FUNDING_AGENT_SOURCE_FORMS = {
  join: 'funding_agent_join',
  profile: 'funding_agent_profile',
} as const;

export function isApprovalStatus(value: unknown): value is ApprovalStatus {
  return typeof value === 'string' && APPROVAL_STATUSES.includes(value as ApprovalStatus);
}

export function isProfileStatus(value: unknown): value is ProfileStatus {
  return typeof value === 'string' && PROFILE_STATUSES.includes(value as ProfileStatus);
}
