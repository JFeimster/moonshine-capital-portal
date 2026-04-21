export type InternalStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

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

// Derived fields documented in FIELD_MAPPING_CONTRACT.md
export interface DerivedFields {
  slug: string;
  primaryCtaLink?: string;
}

// Canonical fields from FIELD_MAPPING_CONTRACT.md
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
  urgencyCategory: string; // 'fast', 'standard', 'complex'
  profileImage?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
}

export interface FullyNormalizedBroker extends CanonicalBrokerProfile, DerivedFields {
  internal: InternalCRMFields;
  publicWix: PublicWixFields;
}
