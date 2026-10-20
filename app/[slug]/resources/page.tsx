import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getResourcesForBroker } from '@/lib/embed-registry';
import { getPartnerResourceSummary, listStructuredPartnerResources } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';
import { createBreadcrumbSchema, createItemListSchema, getPartnerCanonicalUrl, serializeJsonLd } from '@/lib/partner-schema';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Resources Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `Funding resources and educational support with ${broker.displayName || broker.fullName}.`, path: '/resources', pageTitle: 'Resources', image: broker.profileImage,
  });
}

export default async function PartnerResourcesPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const assignedResources = await getResourcesForBroker(broker.slug);
  const sharedResourceSlugs = ['funding-readiness', 'document-checklist', 'cash-flow-preparation', 'offer-comparison'];
  const sharedResources = assignedResources.length ? [] : sharedResourceSlugs
    .map((slug) => listStructuredPartnerResources().find((resource) => resource.slug === slug))
    .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource));
  const resources = assignedResources.length ? assignedResources : sharedResources;
  const name = broker.displayName || broker.fullName;
  const jsonLd = [
    createBreadcrumbSchema(broker.slug, name, [{ label: 'Resources', path: 'resources' }]),
    createItemListSchema(resources.map((resource) => ({ name: resource.title, url: getPartnerCanonicalUrl(broker.slug, `resources/${resource.slug}`) }))),
  ];

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      {jsonLd.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />)}
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Resources" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Resources' }]} />
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{assignedResources.length ? 'Advisor resources' : 'Shared preparation library'}</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Resources</h1>
          </div>
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>

        {resources.length > 0 ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <Link key={resource.slug} href={`/${broker.slug}/resources/${resource.slug}`} className="group border-4 border-neo-black bg-neo-cream p-6 shadow-brutal transition-transform hover:-translate-y-1">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neo-blue">{resource.resourceType}</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">{resource.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-neo-black/75">{'sections' in resource ? getPartnerResourceSummary(resource) : resource.description}</p>
              <div className="mt-5 inline-flex border-b-2 border-neo-black pb-1 text-xs font-black uppercase tracking-[0.18em] group-hover:text-neo-blue">Read resource</div>
            </Link>
          ))}
        </div> : <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal"><h2 className="text-2xl font-black uppercase">No resources are available yet</h2><p className="mt-2 max-w-2xl text-sm font-medium">Browse the public preparation library for funding and document checklists.</p><Link href="/resources" className="mt-4 inline-flex text-sm font-black uppercase underline">Open the resource library →</Link></div>}
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
