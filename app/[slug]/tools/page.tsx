import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { listPartnerToolPages } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Tools Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `Tools and resources for ${broker.fullName}.`,
  });
}

export default async function PartnerToolsPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const tools = await listPartnerToolPages();

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Tools" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Tools' }]} />
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-block border-2 border-neo-black bg-neo-green px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Partner tools</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Tools</h1>
          </div>
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/${broker.slug}/tools/${tool.slug}`} className="group border-4 border-neo-black bg-neo-cream p-6 shadow-brutal transition-transform hover:-translate-y-1">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neo-blue">{tool.category}</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">{tool.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{tool.description}</p>
              <div className="mt-5 inline-flex border-b-2 border-neo-black pb-1 text-xs font-black uppercase tracking-[0.18em] group-hover:text-neo-blue">View tool</div>
            </Link>
          ))}
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
