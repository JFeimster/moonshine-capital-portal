import { BrokerProfile } from './types';
import { mockBrokers } from './mock-brokers';
import { sanitizeUrl } from './utils';

// Define expected Wix response structure
interface WixBrokerResponse {
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
  fundingTypes?: string[];
  urgencyCategory?: string;
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
  // Raw Wix CTA fields if any, we'll map them
}

const WIX_API_URL = process.env.WIX_API_URL || '';
const WIX_API_KEY = process.env.WIX_API_KEY || '';

// Normalization function to ensure Wix data matches our frontend types
function normalizeBroker(wixBroker: WixBrokerResponse): BrokerProfile {
  return {
    id: wixBroker._id,
    fullName: wixBroker.fullName,
    agencyName: wixBroker.agencyName,
    slug: wixBroker.slug,
    shortBio: wixBroker.shortBio,
    city: wixBroker.city,
    state: wixBroker.state,
    websiteUrl: wixBroker.websiteUrl ? sanitizeUrl(wixBroker.websiteUrl) : undefined,
    publicEmail: wixBroker.publicEmail,
    whyChooseYou: wixBroker.whyChooseYou,

    industries: wixBroker.industries || [],
    fundingTypes: wixBroker.fundingTypes || wixBroker.fundingSpecialties || [],
    urgencyCategory: wixBroker.urgencyCategory || 'standard',

    fundingSpecialties: wixBroker.fundingSpecialties || [],
    primaryCtaLink: wixBroker.primaryCtaLink ? sanitizeUrl(wixBroker.primaryCtaLink) : undefined,
    ctaLabel: wixBroker.ctaLabel,
    featuredBroker: wixBroker.featuredBroker,
    featuredFlag: wixBroker.featuredFlag || wixBroker.featuredBroker,

    primaryCta: {
      label: wixBroker.ctaLabel || 'Apply Now',
      url: wixBroker.primaryCtaLink ? sanitizeUrl(wixBroker.primaryCtaLink) : '#',
      variant: 'primary',
      trackingId: `broker_cta_${wixBroker._id}`
    },

    profileImage: wixBroker.profileImage ? sanitizeUrl(wixBroker.profileImage) : undefined,
    approvalStatus: wixBroker.approvalStatus,
    brokerStatus: wixBroker.brokerStatus || 'active',
    isActive: wixBroker.isActive !== undefined ? wixBroker.isActive : true,
    phoneNumber: wixBroker.phoneNumber,
  };
}

export async function fetchWixBrokers(): Promise<BrokerProfile[]> {
  // If no API credentials, fallback to mock data
  if (!WIX_API_URL || !WIX_API_KEY) {
    console.warn('WIX_API_URL or WIX_API_KEY not found. Falling back to mock data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
  }

  try {
    const res = await fetch(`${WIX_API_URL}/brokerProfiles?status=approved&active=true`, {
      headers: {
        'Authorization': `Bearer ${WIX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // ISR for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Wix: ${res.statusText}`);
    }

    const data: WixBrokerResponse[] = await res.json();
    return data.map(normalizeBroker);
  } catch (error) {
    console.error('Error fetching Wix brokers:', error);
    // Fallback to mock data if fetch fails
    return mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
  }
}

export async function fetchWixBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  // If no API credentials, fallback to mock data
  if (!WIX_API_URL || !WIX_API_KEY) {
    console.warn('WIX_API_URL or WIX_API_KEY not found. Falling back to mock data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    const broker = mockBrokers.find(b => b.slug === slug && b.approvalStatus === 'approved' && b.isActive);
    return broker || null;
  }

  try {
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
      return normalizeBroker(data[0]);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Wix broker with slug ${slug}:`, error);
    const broker = mockBrokers.find(b => b.slug === slug && b.approvalStatus === 'approved' && b.isActive);
    return broker || null;
  }
}
