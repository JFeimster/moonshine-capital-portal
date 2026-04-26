import { mockBrokers } from './mock-brokers';

export interface WixBrokerResponse {
  _id: string;
  fullName: string;
  agencyName: string;
  slug: string;
  shortBio: string;
  city: string;
  state: string;
  websiteUrl?: string;
  publicEmail: string;
  whyChooseYou: string;
  industries?: string[];
  verticals?: string[];
  fundingTypes?: string[];
  urgencyCategory?: string;
  serviceArea?: string[];
  speedToContact?: string;
  minimumDealSize?: number;
  maximumDealSize?: number;
  primaryCtaType?: string;
  proofPoints?: string[];
  bestFitClients?: string;
  fundingSpecialties?: string[];
  primaryCtaLink?: string;
  ctaLabel?: string;
  featuredBroker?: boolean;
  featuredFlag?: boolean;
  profileImage?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  brokerStatus?: 'active' | 'hidden' | 'recruiting';
  isActive: boolean;
  phoneNumber?: string;
}

const WIX_API_URL = process.env.WIX_API_URL || '';
const WIX_API_KEY = process.env.WIX_API_KEY || '';

export async function fetchWixBrokers(): Promise<WixBrokerResponse[]> {
  if (!WIX_API_URL || !WIX_API_KEY) {
    throw new Error('WIX_API_URL or WIX_API_KEY not found');
  }

  const res = await fetch(`${WIX_API_URL}/brokerProfiles?status=approved&active=true`, {
    headers: {
      'Authorization': `Bearer ${WIX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Wix: ${res.statusText}`);
  }

  const data: WixBrokerResponse[] = await res.json();
  return data;
}

export async function fetchWixBrokerBySlug(slug: string): Promise<WixBrokerResponse | null> {
  if (!WIX_API_URL || !WIX_API_KEY) {
    throw new Error('WIX_API_URL or WIX_API_KEY not found');
  }

  const encodedSlug = encodeURIComponent(slug);
  const res = await fetch(`${WIX_API_URL}/brokerProfiles?slug=${encodedSlug}&status=approved&active=true`, {
    headers: {
      'Authorization': `Bearer ${WIX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Wix: ${res.statusText}`);
  }

  const data: WixBrokerResponse[] = await res.json();
  if (data.length > 0) {
    return data[0];
  }
  return null;
}
