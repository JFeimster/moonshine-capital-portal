import { BrokerProfile, type ApprovalStatus, type ProfileStatus } from './types';
import { mockBrokers } from './mock-brokers';
import { darwinProfileImage } from './profile-images';

// Optional downstream compatibility shape. Wix never defines canonical lifecycle state.
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
  profileImage?: unknown;
  approvalStatus: ApprovalStatus | 'pending';
  profileStatus?: ProfileStatus;
  brokerStatus?: 'active' | 'hidden' | 'recruiting';
  isActive: boolean;
  phoneNumber?: string;
}

const WIX_API_URL = process.env.WIX_API_URL || '';
const WIX_API_KEY = process.env.WIX_API_KEY || '';

function isBrowserSafeImageUrl(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    (value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://') || value.startsWith('data:image/')) &&
    !value.startsWith('wix:image://')
  );
}

function normalizeProfileImage(profileImage: unknown, slug: string) {
  if (slug === 'darwin-hanneman') return darwinProfileImage;
  if (isBrowserSafeImageUrl(profileImage)) return profileImage;
  return undefined;
}

function normalizeApprovalStatus(value: WixBrokerResponse['approvalStatus']): ApprovalStatus {
  return value === 'pending' ? 'needs_review' : value;
}

function normalizeBroker(wixBroker: WixBrokerResponse): BrokerProfile {
  return {
    id: wixBroker._id,
    fullName: wixBroker.fullName,
    agencyName: wixBroker.agencyName,
    slug: wixBroker.slug,
    shortBio: wixBroker.shortBio,
    city: wixBroker.city,
    state: wixBroker.state,
    websiteUrl: wixBroker.websiteUrl,
    publicEmail: wixBroker.publicEmail,
    whyChooseYou: wixBroker.whyChooseYou,
    industries: wixBroker.industries || [],
    fundingTypes: wixBroker.fundingTypes || wixBroker.fundingSpecialties || [],
    urgencyCategory: wixBroker.urgencyCategory || 'standard',
    fundingSpecialties: wixBroker.fundingSpecialties || [],
    primaryCtaLink: wixBroker.primaryCtaLink,
    ctaLabel: wixBroker.ctaLabel,
    featuredBroker: wixBroker.featuredBroker,
    featuredFlag: wixBroker.featuredFlag || wixBroker.featuredBroker,
    primaryCta: {
      label: wixBroker.ctaLabel || 'Apply Now',
      url: wixBroker.primaryCtaLink || '#',
      variant: 'primary',
      trackingId: `broker_cta_${wixBroker._id}`
    },
    profileImage: normalizeProfileImage(wixBroker.profileImage, wixBroker.slug),
    approvalStatus: normalizeApprovalStatus(wixBroker.approvalStatus),
    profileStatus: wixBroker.profileStatus,
    brokerStatus: wixBroker.brokerStatus || 'active',
    isActive: wixBroker.isActive !== undefined ? wixBroker.isActive : true,
    phoneNumber: wixBroker.phoneNumber,
  };
}

export async function fetchWixBrokers(): Promise<BrokerProfile[]> {
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
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error(`Failed to fetch from Wix: ${res.statusText}`);
    const data: WixBrokerResponse[] = await res.json();
    return data.map(normalizeBroker);
  } catch (error) {
    console.error('Error fetching Wix brokers:', error);
    return mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
  }
}

export async function fetchWixBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  if (!WIX_API_URL || !WIX_API_KEY) {
    console.warn('WIX_API_URL or WIX_API_KEY not found. Falling back to mock data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBrokers.find(b => b.slug === slug && b.approvalStatus === 'approved' && b.isActive) || null;
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
    if (!res.ok) throw new Error(`Failed to fetch from Wix: ${res.statusText}`);
    const data: WixBrokerResponse[] = await res.json();
    return data.length > 0 ? normalizeBroker(data[0]) : null;
  } catch (error) {
    console.error(`Error fetching Wix broker with slug ${slug}:`, error);
    return mockBrokers.find(b => b.slug === slug && b.approvalStatus === 'approved' && b.isActive) || null;
  }
}
