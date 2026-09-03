export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface CTANode {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  trackingId?: string;
  registrySlug?: string;
}

export interface BrokerProfile {
  id: string;
  partnerId?: string;
  referralCode?: string;
  fullName: string;
  displayName?: string;
  agencyName: string;
  companyName?: string;
  title?: string;
  slug: string;
  shortBio: string;
  city: string;
  state: string;
  markets?: string[];
  websiteUrl?: string;
  bookingUrl?: string;
  logoUrl?: string;
  publicEmail: string;
  whyChooseYou: string;
  disclosures?: string[];

  industries: string[];
  fundingTypes: string[];
  urgencyCategory: 'fast' | 'standard' | 'complex' | string;

  fundingSpecialties?: string[];
  primaryCtaLink?: string;
  ctaLabel?: string;
  featuredBroker?: boolean;

  primaryCta?: CTANode;
  secondaryCta?: CTANode;
  ctaLabelVariants?: string[];

  profileImage?: string;
  approvalStatus: ApprovalStatus;
  profileStatus?: 'draft' | 'published' | 'archived' | string;
  brokerStatus?: 'active' | 'hidden' | 'recruiting';
  isActive: boolean;
  phoneNumber?: string;
  featuredFlag?: boolean;
}
