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

  // Canonical partner identity additions. Optional during migration/intake.
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

export interface FullyNormalizedBroker extends CanonicalBrokerProfile {
  slug: string;
  internal: InternalCRMFields;
  publicWix: PublicWixFields;
}
