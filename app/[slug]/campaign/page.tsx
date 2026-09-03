import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { listPartnerCampaigns } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';
import { createBreadcrumbSchema, createItemListSchema, getPartnerCanonicalUrl, serializeJsonLd } from '@/lib/partner-schema';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Solutions Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({ slug: broker.slug, partnerName: broker.displayName || broker.fullName, companyName: broker.companyName || broker.agencyName, description: `Capital solutions with ${broker.displayName || broker.fullName}.`, path: '/campaign', pageTitle: 'Solutions', image: broker.profileImage });
}

export default async function PartnerSolutionsPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();
  const campaigns = listPartnerCampaigns();
  const name = broker.displayName || broker.fullName;
  const jsonLd = [
    createBreadcrumbSchema(broker.slug, name, [{ label: 'Solutions', path: 'campaign' }]),
    createItemListSchema(campaigns.map((campaign) => ({ name: campaign.headline, url: getPartnerCanonicalUrl(broker.slug, `campaign/${campaign.slug}`) }))),
  ];

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      {jsonLd.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />)}
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Solutions" />
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Solutions' }]} />
        <div className="mb-10 flex flex-col gap-6 border-b-4 border-neo-black pb-8 md:flex-row md:items-end md:justify-between">
          <div><div className="mb-3 inline-block border-2 border-neo-black bg-neo-green px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Capital command desk</div><h1 className="max-w-3xl text-4xl font-black uppercase tracking-tighter md:text-6xl">Capital solutions built around the problem you&apos;re actually solving.</h1></div>
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign, index) => <Link key={campaign.slug} href={`/${broker.slug}/campaign/${campaign.slug}`} className="group border-4 border-neo-black bg-neo-cream p-6 shadow-brutal hover:-translate-y-1">
            <div className="flex justify-between text-xs font-black uppercase tracking-[0.18em] text-neo-blue"><span>{campaign.eyebrow}</span><span>{String(index + 1).padStart(2, '0')}</span></div>
            <h2 className="mt-5 text-2xl font-black uppercase tracking-tighter">{campaign.headline}</h2><p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{campaign.summary}</p>
            <div className="mt-5 inline-flex border-b-2 border-neo-black pb-1 text-xs font-black uppercase tracking-[0.18em] group-hover:text-neo-blue">Explore solution</div>
          </Link>)}
        </div>
      </section>
      <PartnerSiteFooter broker={broker} />
    </main>
  );
}