import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getPartnerResource } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { buildPartnerLeadFormUrl } from '@/lib/distribution';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string; resourceSlug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Resource Not Found', robots: { index: false, follow: false } };
  const resource = await getPartnerResource(params.resourceSlug);
  if (!resource) return { title: 'Resource Not Found', robots: { index: false, follow: false } };

  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `${resource.title} for ${broker.fullName}.`, path: `/resources/${params.resourceSlug}`, pageTitle: resource.title,
  });
}

export default async function PartnerResourceDetailPage({ params }: { params: { slug: string; resourceSlug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const resource = await getPartnerResource(params.resourceSlug);
  if (!resource) notFound();

  const applyUrl = buildPartnerLeadFormUrl(broker, { source: `partner_resource_${resource.slug}` });

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Resources" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Resources', href: `/${broker.slug}/resources` }, { label: resource.title }]} />

        <div className="border-4 border-neo-black bg-neo-yellow p-6 shadow-brutal">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">{resource.resourceType}</div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">{resource.title}</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{resource.description}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={applyUrl} className="btn-brutal-primary">Apply for Funding</a>
          {'ctaHref' in resource && resource.ctaHref ? <a href={resource.ctaHref} className="btn-brutal">Open resource</a> : <Link href={`/${broker.slug}/resources`} className="btn-brutal">Back to resources</Link>}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {('sections' in resource ? resource.sections : []).map((section) => (
              <div key={section.heading} className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{section.heading}</h2>
                {section.body && <p className="mt-4 text-base font-medium leading-relaxed">{section.body}</p>}
                {section.items && <ul className="mt-4 space-y-3 text-base font-medium leading-relaxed">{section.items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 bg-neo-blue" />{item}</li>)}</ul>}
              </div>
            ))}
            {!('sections' in resource) && <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal"><h2 className="text-2xl font-black uppercase tracking-tighter">Why this matters</h2><p className="mt-4 text-base font-medium leading-relaxed">This resource is designed to reduce confusion and support a stronger funding conversation.</p></div>}
          </div>
          <div className="border-4 border-neo-black bg-neo-black p-6 text-neo-white shadow-brutal">
            <h2 className="text-xl font-black uppercase tracking-tighter text-neo-yellow">Next step</h2>
            <div className="mt-4 space-y-3">
              <a href={applyUrl} className="btn-brutal-primary block w-full">Apply now</a>
              <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
            </div>
          </div>
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
