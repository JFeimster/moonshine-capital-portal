import type { BrokerProfile } from './types';
import { SITE_CONFIG, getCanonicalUrl } from './site-config';

export type SchemaObject = Record<string, unknown>;

export type PartnerBreadcrumbItem = { label: string; path?: string };

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function getPartnerCanonicalUrl(slug: string, path = '') {
  return getCanonicalUrl(`/${encodeURIComponent(slug.trim())}${path ? `/${path.replace(/^\/+/, '')}` : ''}`);
}

export function createPartnerIdentitySchema(broker: BrokerProfile, description?: string | null): SchemaObject {
  const name = broker.displayName || broker.fullName || 'Funding Advisor';
  const companyName = broker.companyName || broker.agencyName;
  const person: SchemaObject = {
    '@type': 'Person',
    '@id': `${getPartnerCanonicalUrl(broker.slug)}#person`,
    name,
    jobTitle: broker.title || 'Funding Advisor',
    url: getPartnerCanonicalUrl(broker.slug),
    ...(description || broker.shortBio ? { description: description || broker.shortBio } : {}),
    ...(broker.profileImage ? { image: broker.profileImage } : {}),
    ...(broker.publicEmail ? { email: broker.publicEmail } : {}),
    ...(broker.phoneNumber ? { telephone: broker.phoneNumber } : {}),
    ...([broker.city, broker.state].some(Boolean) ? {
      address: {
        '@type': 'PostalAddress',
        ...(broker.city ? { addressLocality: broker.city } : {}),
        ...(broker.state ? { addressRegion: broker.state } : {}),
      },
    } : {}),
    ...(companyName ? { worksFor: { '@type': 'Organization', name: companyName } } : {}),
  };
  const network: SchemaObject = {
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.canonicalOrigin}/#organization`,
    name: SITE_CONFIG.publicBrand,
    url: SITE_CONFIG.canonicalOrigin,
  };
  const graph: SchemaObject[] = [
    { '@type': 'ProfilePage', '@id': `${getPartnerCanonicalUrl(broker.slug)}#profile`, url: getPartnerCanonicalUrl(broker.slug), mainEntity: { '@id': person['@id'] }, isPartOf: { '@id': network['@id'] } },
    person,
    network,
  ];
  return { '@context': 'https://schema.org', '@id': getPartnerCanonicalUrl(broker.slug), url: getPartnerCanonicalUrl(broker.slug), '@graph': graph };
}

export function createBreadcrumbSchema(slug: string, partnerName: string, items: PartnerBreadcrumbItem[]): SchemaObject {
  const entries = [{ label: 'Home', path: '' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label === 'Home' ? partnerName : item.label, item: getPartnerCanonicalUrl(slug, item.path) })),
  };
}

export function createFaqSchema(faq: Array<{ question: string; answer: string }>): SchemaObject | null {
  if (!faq.length) return null;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };
}

export function createItemListSchema(items: Array<{ name: string; url: string }>): SchemaObject {
  return { '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: item.url })) };
}

export function createArticleSchema({ title, description, url }: { title: string; description: string; url: string }): SchemaObject {
  return { '@context': 'https://schema.org', '@type': 'Article', headline: title, description, url, publisher: { '@id': `${SITE_CONFIG.canonicalOrigin}/#organization` }, author: { '@id': `${SITE_CONFIG.canonicalOrigin}/#organization` } };
}