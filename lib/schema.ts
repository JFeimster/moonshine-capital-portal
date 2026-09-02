import { getCanonicalPartnerUrl } from './site-config';

export function generateItemListSchema(items: Array<{ slug: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getCanonicalPartnerUrl(item.slug),
    })),
  };
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
