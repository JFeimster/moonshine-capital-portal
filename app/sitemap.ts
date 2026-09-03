import type { MetadataRoute } from 'next';
import { getBrokers } from '@/lib/brokers';
import { getCanonicalPartnerUrl, getCanonicalUrl } from '@/lib/site-config';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brokers = await getBrokers();
  const staticPaths = [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/directory',
    '/brokers',
    '/apply',
    '/apply/fast',
    '/apply/quote',
    '/onboarding',
    '/industries',
    '/funding-types',
    '/terms',
    '/privacy',
  ];

  const industries = new Set<string>();
  const fundingTypes = new Set<string>();
  brokers.forEach((broker) => {
    broker.industries?.forEach((value) => industries.add(slugify(value)));
    const types = broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties || [];
    types.forEach((value) => fundingTypes.add(slugify(value)));
  });

  return [
    ...staticPaths.map((path) => ({ url: getCanonicalUrl(path) })),
    ...brokers.map((broker) => ({ url: getCanonicalPartnerUrl(broker.slug) })),
    ...Array.from(industries).map((slug) => ({ url: getCanonicalUrl(`/industries/${slug}`) })),
    ...Array.from(fundingTypes).map((slug) => ({ url: getCanonicalUrl(`/funding-types/${slug}`) })),
  ];
}
