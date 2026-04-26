import { BrokerProfile } from './types';
import { fetchWixBrokers, fetchWixBrokerBySlug, WixBrokerResponse } from './wix';
import { isEligibleForPublicDisplay } from './status-gating';
import { mockBrokers } from './mock-brokers';

export function normalizeBroker(wixBroker: WixBrokerResponse): BrokerProfile {
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
    verticals: wixBroker.verticals || wixBroker.industries || [],
    fundingTypes: wixBroker.fundingTypes || wixBroker.fundingSpecialties || [],
    urgencyCategory: wixBroker.urgencyCategory || 'standard',
    serviceArea: wixBroker.serviceArea || [],
    speedToContact: wixBroker.speedToContact,
    minimumDealSize: wixBroker.minimumDealSize,
    maximumDealSize: wixBroker.maximumDealSize,
    primaryCtaType: wixBroker.primaryCtaType || 'apply',
    proofPoints: wixBroker.proofPoints || [],
    bestFitClients: wixBroker.bestFitClients,

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

    profileImage: wixBroker.profileImage,
    approvalStatus: wixBroker.approvalStatus,
    brokerStatus: wixBroker.brokerStatus || 'active',
    isActive: wixBroker.isActive !== undefined ? wixBroker.isActive : true,
    phoneNumber: wixBroker.phoneNumber,
  };
}

export async function getBrokers(): Promise<BrokerProfile[]> {
  try {
    const rawBrokers = await fetchWixBrokers();
    const brokers = rawBrokers.map(normalizeBroker);
    return brokers.filter(isEligibleForPublicDisplay);
  } catch (error) {
    console.warn('Wix fetch failed, falling back to mockBrokers:', error);
    return mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
  }
}

export async function getBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  try {
    const rawBroker = await fetchWixBrokerBySlug(slug);
    if (!rawBroker) {
        return null;
    }
    const broker = normalizeBroker(rawBroker);
    if (!isEligibleForPublicDisplay(broker)) {
      return null;
    }
    return broker;
  } catch (error) {
    console.warn(`Wix fetch failed for slug ${slug}, falling back to mockBrokers:`, error);
    const broker = mockBrokers.find(b => b.slug === slug && b.approvalStatus === 'approved' && b.isActive);
    return broker || null;
  }
}

export async function getFeaturedBrokers(): Promise<BrokerProfile[]> {
  const brokers = await getBrokers();
  return brokers.filter(b => b.featuredFlag ?? b.featuredBroker);
}
