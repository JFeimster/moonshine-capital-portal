export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface CTANode {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  trackingId?: string; // For analytics hooks
}

export interface BrokerProfile {
  id: string;
  fullName: string;
  agencyName: string;
  slug: string;
  shortBio: string;
  city: string;
  state: string;
  websiteUrl?: string;
  publicEmail: string;
  whyChooseYou: string;

  // Expanded Data Model
  industries: string[];
  verticals?: string[];
  fundingTypes: string[];
  urgencyCategory: 'fast' | 'standard' | 'complex' | string;
  serviceArea?: string[];
  speedToContact?: string;
  minimumDealSize?: number;
  maximumDealSize?: number;
  primaryCtaType?: string;
  proofPoints?: string[];
  bestFitClients?: string;

  // Legacy / Fallback properties
  fundingSpecialties?: string[];
  primaryCtaLink?: string;
  ctaLabel?: string;
  featuredBroker?: boolean;

  // New CTA Strategy
  primaryCta?: CTANode;
  secondaryCta?: CTANode;
  ctaLabelVariants?: string[];

  profileImage?: string;
  approvalStatus: ApprovalStatus;
  brokerStatus?: 'active' | 'hidden' | 'recruiting';
  isActive: boolean;
  phoneNumber?: string;
  featuredFlag?: boolean;
}
