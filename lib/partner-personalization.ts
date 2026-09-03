import type { BrokerProfile } from './types';

export interface PartnerContactAction {
  kind: 'booking' | 'email' | 'phone' | 'website';
  href: string;
}

type PartnerPage = { slug: string; title: string };

function normalizeMatchValue(value: string) {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
}

function matchScore(value: string, page: PartnerPage) {
  const normalizedValue = normalizeMatchValue(value);
  if (!normalizedValue) return 0;
  const pageValues = [page.slug.replace(/-/g, ' '), page.title].map(normalizeMatchValue);
  if (pageValues.some((pageValue) => pageValue === normalizedValue)) return 100;
  if (pageValues.some((pageValue) => pageValue.includes(normalizedValue) || normalizedValue.includes(pageValue))) return 75;

  const valueTokens = normalizedValue.split(' ').filter((token) => token.length >= 4);
  if (pageValues.some((pageValue) => {
    const pageTokens = new Set(pageValue.split(' '));
    return valueTokens.length > 1 && valueTokens.every((token) => pageTokens.has(token) || pageTokens.has(`${token}s`) || token.endsWith('s') && pageTokens.has(token.slice(0, -1)));
  })) return 50;
  return pageValues.some((pageValue) => {
    const pageTokens = new Set(pageValue.split(' '));
    return valueTokens.length === 1 && valueTokens.some((token) => pageTokens.has(token) || pageTokens.has(`${token}s`) || token.endsWith('s') && pageTokens.has(token.slice(0, -1)));
  }) ? 10 : 0;
}

function prioritizePartnerPages<T extends PartnerPage>(pages: T[], values: string[], limit: number) {
  const prioritized = pages
    .map((page, index) => ({ page, index, score: Math.max(...values.map((value) => matchScore(value, page)), 0) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((entry) => entry.page);
  return Array.from(new Map([...prioritized, ...pages].map((page) => [page.slug, page])).values()).slice(0, limit);
}

export function getPrioritizedPartnerFunding<T extends PartnerPage>(pages: T[], broker: Pick<BrokerProfile, 'fundingTypes' | 'fundingSpecialties'>, limit = 6) {
  return prioritizePartnerPages(pages, getPartnerDisplaySpecialties(broker), limit);
}

export function getPrioritizedPartnerIndustries<T extends PartnerPage>(pages: T[], broker: Pick<BrokerProfile, 'industries'>, limit = 8) {
  return prioritizePartnerPages(pages, broker.industries || [], limit);
}

export function getPartnerDisplaySpecialties(broker: Pick<BrokerProfile, 'fundingTypes' | 'fundingSpecialties'>) {
  return Array.from(new Set([...(broker.fundingTypes || []), ...(broker.fundingSpecialties || [])].map((value) => value.trim()).filter(Boolean)));
}

export function getPartnerSupportLine(broker: Pick<BrokerProfile, 'displayName' | 'fullName' | 'fundingTypes' | 'fundingSpecialties' | 'industries'>) {
  const name = broker.displayName || broker.fullName || 'This funding advisor';
  const specialties = getPartnerDisplaySpecialties(broker).slice(0, 3);
  const industries = (broker.industries || []).map((value) => value.trim()).filter(Boolean).slice(0, 3);
  if (specialties.length && industries.length) return `${name} specializes in ${specialties.join(', ')} for ${industries.join(', ')} businesses.`;
  if (specialties.length) return `${name} specializes in ${specialties.join(', ')}.`;
  if (industries.length) return `${name} helps businesses in ${industries.join(', ')} navigate practical funding options.`;
  return null;
}

export function getPartnerContactActions(broker: Pick<BrokerProfile, 'bookingUrl' | 'publicEmail' | 'phoneNumber' | 'websiteUrl'>): PartnerContactAction[] {
  return [
    broker.bookingUrl && { kind: 'booking' as const, href: broker.bookingUrl },
    broker.publicEmail && { kind: 'email' as const, href: `mailto:${broker.publicEmail}` },
    broker.phoneNumber && { kind: 'phone' as const, href: `tel:${broker.phoneNumber}` },
    broker.websiteUrl && { kind: 'website' as const, href: broker.websiteUrl },
  ].filter((action): action is PartnerContactAction => Boolean(action));
}
