import type { ApprovalStatus, ProfileStatus } from './partner-contract';

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
  profileStatus?: ProfileStatus;
  approvalStatus?: ApprovalStatus;
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
