export type InternalStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
export type CanonicalProfileStatus = 'draft' | 'published' | 'hidden' | 'archived';
export type CanonicalApprovalStatus = 'approved' | 'needs_review' | 'suspended' | 'rejected';

export interface InternalCRMFields {
  status: InternalStatus;
  internalNotes?: string;
  applicationDate: string;
  tallySubmissionId: string;
}

export interface PublicWixFields {
  featuredFlag: boolean;
  brokerStatus: 'active' | 'hidden' | 'recruiting';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
}

export interface CanonicalBrokerProfile {
  fullName: string;
  email: string;
  agencyName: string;
  city: string;
  state: string;
  websiteUrl?: string;
  phoneNumber?: string;
  shortBio?: string;
  whyChooseYou?: string;
  industries: string[];
  fundingTypes: string[];
  urgencyCategory: string;
  profileImage?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;

  partnerId?: string;
  referralCode?: string;
  slug?: string;
  displayName?: string;
  title?: string;
  profileStatus?: CanonicalProfileStatus;
  approvalStatus?: CanonicalApprovalStatus;
  partnerType?: string;
  reviewReason?: string;
  specialties?: string[];
  markets?: string[];
  logoUrl?: string;
  bookingUrl?: string;
  disclosures?: string[];
  sourceForm?: string;
  tallyFormId?: string;
  latestTallySubmissionId?: string;
  initialSubmissionAt?: string;
  latestSubmissionAt?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  notionPageId?: string;
}

export interface FullyNormalizedBroker extends CanonicalBrokerProfile {
  slug: string;
  internal: InternalCRMFields;
  publicWix: PublicWixFields;
}
