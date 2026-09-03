import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { listPartnerIndustryPages } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';
import { createBreadcrumbSchema, createItemListSchema, getPartnerCanonicalUrl, serializeJsonLd } from '@/lib/partner-schema';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Industry Hub Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `Explore industries served by ${broker.displayName || broker.fullName}.`, path: '/industries', pageTitle: 'Industries', image: broker.profileImage,
  });
}

export default async function PartnerIndustryHubPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const industries = listPartnerIndustryPages();
  const featuredIndustries = industries.slice(0, 10);
  const name = broker.displayName || broker.fullName;
  const jsonLd = [
    createBreadcrumbSchema(broker.slug, name, [{ label: 'Industries', path: 'industries' }]),
    createItemListSchema(industries.map((industry) => ({ name: industry.title, url: getPartnerCanonicalUrl(broker.slug, `industries/${industry.slug}`) }))),
  ];

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      {jsonLd.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />)}
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Industries" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Industries' }]} />
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-block border-2 border-neo-black bg-neo-pink px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Capital for this industry</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">Industries</h1>
          </div>
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>

        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-neo-blue">Featured industries</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {featuredIndustries.map((industry) => (
            <Link key={industry.slug} href={`/${broker.slug}/industries/${industry.slug}`} className="group border-4 border-neo-black bg-neo-cream p-6 shadow-brutal transition-transform hover:-translate-y-1">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neo-blue">Industry</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">{industry.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{industry.summary}</p>
              <div className="mt-5 inline-flex border-b-2 border-neo-black pb-1 text-xs font-black uppercase tracking-[0.18em] group-hover:text-neo-blue">View capital options</div>
            </Link>
          ))}
        </div>
        <div className="mt-12 border-t-4 border-neo-black pt-6">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-neo-blue">All industries <span className="text-neo-black/60">[{industries.length}]</span></h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <Link key={industry.slug} href={`/${broker.slug}/industries/${industry.slug}`} className="flex items-center gap-3 border-2 border-neo-black bg-neo-white px-3 py-3 text-sm font-black uppercase hover:bg-neo-pink">
                <span className="text-neo-blue">{String(index + 1).padStart(2, '0')}</span>{industry.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
