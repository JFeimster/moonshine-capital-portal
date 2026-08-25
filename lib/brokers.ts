import { BrokerProfile } from './types';
import { fetchWixBrokers, fetchWixBrokerBySlug } from './wix';
import { isEligibleForPublicDisplay } from './status-gating';
import { getPartnerBySlug, listPublishedPartners } from './notion';

function persistedToBroker(partner: any): BrokerProfile {
  return {
    id: partner.partnerId || partner.notionPageId,
    fullName: partner.fullName || partner.displayName || 'Funding Agent',
    agencyName: partner.agencyName || '',
    slug: partner.slug || '',
    shortBio: partner.shortBio || '',
    city: partner.city || '',
    state: partner.state || '',
    websiteUrl: partner.websiteUrl,
    publicEmail: partner.email || '',
    whyChooseYou: partner.whyChooseYou || '',
    industries: partner.industries || [],
    fundingTypes: partner.fundingTypes || [],
    urgencyCategory: partner.urgencyCategory || 'standard',
    fundingSpecialties: partner.specialties || [],
    primaryCtaLink: partner.primaryCtaLink,
    ctaLabel: partner.primaryCtaLabel,
    primaryCta: partner.primaryCtaLink ? { label: partner.primaryCtaLabel || 'Apply for Funding', url: partner.primaryCtaLink } : undefined,
    profileImage: partner.profileImage,
    approvalStatus: 'approved',
    brokerStatus: 'active',
    isActive: true,
    phoneNumber: partner.phoneNumber,
    featuredFlag: false
  };
}

function mergePublicSources(wixBrokers: BrokerProfile[], durableBrokers: BrokerProfile[]) {
  const merged = new Map<string, BrokerProfile>();

  // Preserve mature Wix records as the compatibility baseline.
  for (const broker of wixBrokers.filter(isEligibleForPublicDisplay)) {
    const key = broker.slug || broker.id;
    if (key) merged.set(key, broker);
  }

  // Durable canonical records win on the same slug so an activated Notion partner
  // is immediately discoverable without requiring a second Wix synchronization.
  for (const broker of durableBrokers) {
    const key = broker.slug || broker.id;
    if (key) merged.set(key, broker);
  }

  return Array.from(merged.values());
}

export async function getBrokers(): Promise<BrokerProfile[]> {
  const wixBrokers = await fetchWixBrokers();

  try {
    const durable = (await listPublishedPartners())
      .filter(partner => Boolean(partner.slug))
      .map(persistedToBroker);
    return mergePublicSources(wixBrokers, durable);
  } catch (error) {
    console.warn('Durable partner directory lookup unavailable; using Wix compatibility source.', error);
    return wixBrokers.filter(isEligibleForPublicDisplay);
  }
}

export async function getBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  // Durable partner state is authoritative for Batch 2.5 public partner routes.
  // If Notion is not configured/available, preserve the existing Wix directory path.
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
