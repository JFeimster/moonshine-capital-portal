import type { MetadataRoute } from 'next';
import { getBrokers } from '@/lib/brokers';
import { getRegistryDestination, getToolsByKind } from '@/lib/embed-registry';
import { listPartnerCampaigns, listPartnerFundingPages, listPartnerIndustryPages, listPartnerResourcePages } from '@/lib/partner-site';
import { getPublicProductFamilies } from '@/lib/funding-registry';
import { getCanonicalPartnerUrl, getCanonicalUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function buildSitemapUrls(): Promise<MetadataRoute.Sitemap> {
  const [brokers, fundingFamilies] = await Promise.all([getBrokers(), getPublicProductFamilies()]);
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
    '/funding',
    '/tools',
    '/resources',
    '/how-it-works',
    '/onboarding',
    '/industries',
    '/terms',
    '/privacy',
  ];

  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({ url: getCanonicalUrl(path) })),
    ...brokers.flatMap((broker) => ({
      broker,
      funding: listPartnerFundingPages(),
      industries: listPartnerIndustryPages(),
      campaigns: listPartnerCampaigns(),
    })).flatMap(({ broker, funding, industries: partnerIndustries, campaigns }) => [
      { url: getCanonicalPartnerUrl(broker.slug) },
      { url: getCanonicalUrl(`/${broker.slug}/about`) },
      { url: getCanonicalUrl(`/${broker.slug}/contact`) },
      { url: getCanonicalUrl(`/${broker.slug}/funding`) },
      ...funding.map((page) => ({ url: getCanonicalUrl(`/${broker.slug}/funding/${page.slug}`) })),
      { url: getCanonicalUrl(`/${broker.slug}/industries`) },
      ...partnerIndustries.map((page) => ({ url: getCanonicalUrl(`/${broker.slug}/industries/${page.slug}`) })),
      { url: getCanonicalUrl(`/${broker.slug}/resources`) },
      { url: getCanonicalUrl(`/${broker.slug}/campaign`) },
      ...campaigns.map((campaign) => ({ url: getCanonicalUrl(`/${broker.slug}/campaign/${campaign.slug}`) })),
    ]),
    ...listPartnerIndustryPages().map((industry) => ({ url: getCanonicalUrl(`/industries/${industry.slug}`) })),
    ...fundingFamilies.map((family) => ({ url: getCanonicalUrl(`/funding/${family.slug}`) })),
    ...(await listPartnerResourcePages()).map((resource) => ({ url: getCanonicalUrl(`/resources/${resource.slug}`) })),
  ];

  const resources = (await listPartnerResourcePages()).filter((resource) => 'sections' in resource || (resource.status === 'active' && resource.accessLevel === 'public' && getRegistryDestination(resource) !== '#'));
  const tools = (await getToolsByKind('tool')).filter((tool) => tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#');
  for (const broker of brokers) {
    urls.push(...resources.map((resource) => ({ url: getCanonicalUrl(`/${broker.slug}/resources/${resource.slug}`) })));
    urls.push({ url: getCanonicalUrl(`/${broker.slug}/tools`) });
    urls.push(...tools.map((tool) => ({ url: getCanonicalUrl(`/${broker.slug}/tools/${tool.slug}`) })));
  }
  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapUrls();
}
