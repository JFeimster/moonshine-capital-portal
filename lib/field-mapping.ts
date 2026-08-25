export type InternalStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
export type CanonicalProfileStatus =
  | 'application_received'
  | 'pending_review'
  | 'profile_incomplete'
  | 'ready_to_publish'
  | 'published'
  | 'suspended'
  | 'archived';

export type CanonicalApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

// Maps exactly to NOTION_BROKER_CRM_SCHEMA.md
export interface InternalCRMFields {
  status: InternalStatus;
  internalNotes?: string;
  applicationDate: string;
  tallySubmissionId: string;
}

// Maps exactly to WIX_BROKERPROFILE_SCHEMA.md
export interface PublicWixFields {
  featuredFlag: boolean;
  brokerStatus: 'active' | 'hidden' | 'recruiting';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
}

// Derived/public identity fields documented in FIELD_MAPPING_CONTRACT.md
export interface DerivedFields {
  slug: string;
  partnerId?: string;
  referralCode?: string;
  primaryCtaLink?: string;
}

// Canonical public partner identity. Existing fields remain intact for backward compatibility.
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

  // Batch 2 canonical identity additions. Optional until downstream stores are migrated.
  partnerId?: string;
  referralCode?: string;
  slug?: string;
  displayName?: string;
  title?: string;
  profileStatus?: CanonicalProfileStatus;
  approvalStatus?: CanonicalApprovalStatus;
  partnerType?: string;
  specialties?: string[];
  markets?: string[];
  logoUrl?: string;
  bookingUrl?: string;
  disclosures?: string[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface FullyNormalizedBroker extends CanonicalBrokerProfile, DerivedFields {
  internal: InternalCRMFields;
  publicWix: PublicWixFields;
}
