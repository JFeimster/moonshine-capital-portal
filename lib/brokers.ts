import { BrokerProfile } from './types';
import { fetchWixBrokers, fetchWixBrokerBySlug } from './wix';
import { isEligibleForPublicDisplay } from './status-gating';
import { getPartnerBySlug, listPublishedPartners } from './notion';

function persistedToBroker(partner: any): BrokerProfile {
  return {
    id: partner.partnerId || partner.notionPageId,
    partnerId: partner.partnerId,
    referralCode: partner.referralCode,
    fullName: partner.fullName || partner.displayName || 'Funding Agent',
    displayName: partner.displayName || partner.fullName || 'Funding Agent',
    agencyName: partner.agencyName || '',
    companyName: partner.agencyName || '',
    title: partner.title || 'Funding Advisor',
    slug: partner.slug || '',
    shortBio: partner.shortBio || '',
    city: partner.city || '',
    state: partner.state || '',
    markets: partner.markets || [],
    websiteUrl: partner.websiteUrl,
    bookingUrl: partner.bookingUrl,
    logoUrl: partner.logoUrl,
    publicEmail: partner.email || '',
    whyChooseYou: partner.whyChooseYou || '',
    disclosures: partner.disclosures || [],
    industries: partner.industries || [],
    fundingTypes: partner.fundingTypes || [],
    urgencyCategory: partner.urgencyCategory || 'standard',
    fundingSpecialties: partner.specialties || [],
    primaryCtaLink: partner.primaryCtaLink,
    ctaLabel: partner.primaryCtaLabel,
    primaryCta: partner.primaryCtaLink ? { label: partner.primaryCtaLabel || 'Apply for Funding', url: partner.primaryCtaLink } : undefined,
    profileImage: partner.profileImage,
    approvalStatus: 'approved',
    profileStatus: partner.profileStatus || 'published',
    brokerStatus: 'active',
    isActive: true,
    phoneNumber: partner.phoneNumber,
    featuredFlag: false
  };
}

async function getWixCompatibilityBrokers(): Promise<BrokerProfile[]> {
  const wixBrokers = await fetchWixBrokers();
  return wixBrokers.filter(isEligibleForPublicDisplay);
}

export async function getBrokers(): Promise<BrokerProfile[]> {
  try {
    const durable = (await listPublishedPartners())
      .filter(partner => Boolean(partner.slug))
      .map(persistedToBroker);

    if (durable.length > 0) return durable;
  } catch (error) {
    console.warn('Durable partner directory lookup unavailable; using Wix compatibility source.', error);
  }

  return getWixCompatibilityBrokers();
}

export async function getBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  try {
    const partner = await getPartnerBySlug(slug);
    if (partner) {
      if (partner.approvalStatus !== 'approved' || partner.profileStatus !== 'published') return null;
      return persistedToBroker(partner);
    }
  } catch (error) {
    console.warn('Durable partner lookup unavailable; falling back to Wix directory source.', error);
  }

  const broker = await fetchWixBrokerBySlug(slug);
  if (broker && !isEligibleForPublicDisplay(broker)) return null;
  return broker;
}

export async function getFeaturedBrokers(): Promise<BrokerProfile[]> {
  const brokers = await getBrokers();
  return brokers.filter(b => b.featuredFlag ?? b.featuredBroker);
}
