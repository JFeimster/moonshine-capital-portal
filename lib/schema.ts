import { createItemListSchema, createPartnerIdentitySchema } from './partner-schema';
import type { BrokerProfile } from './types';
import { getCanonicalPartnerUrl } from './site-config';

export function generateItemListSchema(items: Array<{ slug: string }>): {
  '@context': string;
  '@type': string;
  numberOfItems: number;
  itemListElement: Array<{ '@type': string; position: number; name: string; url: string }>;
} {
  return createItemListSchema(items.map((item) => ({ name: item.slug, url: getCanonicalPartnerUrl(item.slug) }))) as ReturnType<typeof generateItemListSchema>;
}

export function generatePartnerSchema({
  slug,
  name,
  companyName,
  description,
  jobTitle = 'Funding Partner',
  areaServed,
  type = 'Person',
}: {
  slug: string;
  name: string;
  companyName?: string | null;
  description?: string | null;
  jobTitle?: string;
  areaServed?: string | string[];
  type?: 'Person' | 'FinancialService';
}) {
  const broker: BrokerProfile = {
    id: slug, fullName: name, displayName: name, agencyName: companyName || '', companyName: companyName || undefined,
    title: jobTitle, slug, shortBio: description || '', city: '', state: '', publicEmail: '', whyChooseYou: '',
    industries: [], fundingTypes: [], urgencyCategory: 'standard', approvalStatus: 'approved', profileStatus: 'published', isActive: true,
  };

  if (type === 'Person') return createPartnerIdentitySchema(broker, description);

  const canonical = getCanonicalPartnerUrl(slug);

  if (type === 'FinancialService') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: companyName || `${name} Funding Desk`,
      employee: { '@type': 'Person', name, jobTitle },
      ...(areaServed ? { areaServed } : {}),
      url: canonical,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    ...(companyName ? { worksFor: { '@type': 'Organization', name: companyName } } : {}),
    ...(description ? { description } : {}),
    url: canonical,
  };
}
