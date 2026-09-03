import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getPartnerTool } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { buildPartnerLeadFormUrl } from '@/lib/distribution';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string; toolSlug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Tool Page Not Found', robots: { index: false, follow: false } };
  const tool = await getPartnerTool(params.toolSlug);
  if (!tool) return { title: 'Tool Page Not Found', robots: { index: false, follow: false } };

  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `${tool.title} for ${broker.fullName}.`, path: `/tools/${params.toolSlug}`, pageTitle: tool.title,
  });
}

export default async function PartnerToolDetailPage({ params }: { params: { slug: string; toolSlug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const tool = await getPartnerTool(params.toolSlug);
  if (!tool) notFound();

  const applyUrl = buildPartnerLeadFormUrl(broker, { source: `partner_tool_${tool.slug}` });

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Tools" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Tools', href: `/${broker.slug}/tools` }, { label: tool.title }]} />

        <div className="border-4 border-neo-black bg-neo-green p-6 shadow-brutal">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">{tool.category}</div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">{tool.title}</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{tool.description}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={applyUrl} className="btn-brutal-primary">Apply for Funding</a>
          {tool.ctaHref ? <a href={tool.ctaHref} className="btn-brutal">Open Tool</a> : <Link href={`/${broker.slug}/tools`} className="btn-brutal">Back to Tools</Link>}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Why this matters</h2>
            <p className="mt-4 text-base font-medium leading-relaxed">This tool helps assess the business need, funding fit, or operational readiness for a practical next step in the funding process.</p>
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
