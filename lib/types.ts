export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

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
  fundingSpecialties: string[];
  primaryCtaLink: string;
  profileImage?: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  ctaLabel?: string;
  phoneNumber?: string;
  featuredBroker?: boolean;
}
