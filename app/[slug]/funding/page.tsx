import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { listPartnerFundingPages } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Funding Hub Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `Explore funding options for ${broker.fullName} and the Distilled Funding network.`, path: '/funding', pageTitle: 'Funding',
  });
}

export default async function PartnerFundingHubPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const fundingPages = listPartnerFundingPages();
  const featuredFunding = fundingPages.slice(0, 8);

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Funding" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Funding' }]} />
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">What type of capital are you looking for?</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Funding</h1>
          </div>
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>

        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-neo-blue">Featured capital paths</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredFunding.map((page) => (
            <Link key={page.slug} href={`/${broker.slug}/funding/${page.slug}`} className="group border-4 border-neo-black bg-neo-cream p-6 shadow-brutal transition-transform hover:-translate-y-1">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neo-blue">Funding option</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">{page.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{page.summary}</p>
              <div className="mt-5 inline-flex border-b-2 border-neo-black pb-1 text-xs font-black uppercase tracking-[0.18em] group-hover:text-neo-blue">Learn more</div>
            </Link>
          ))}
        </div>
        <div className="mt-12 border-t-4 border-neo-black pt-6">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-neo-blue">All funding options <span className="text-neo-black/60">[{fundingPages.length}]</span></h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {fundingPages.map((page, index) => (
              <Link key={page.slug} href={`/${broker.slug}/funding/${page.slug}`} className="flex items-center gap-3 border-2 border-neo-black bg-neo-white px-3 py-3 text-sm font-black uppercase hover:bg-neo-yellow">
                <span className="text-neo-blue">{String(index + 1).padStart(2, '0')}</span>{page.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
