import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getPartnerIndustryPage } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { buildPartnerLeadFormUrl } from '@/lib/distribution';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string; industrySlug: string[] } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Industry Page Not Found', robots: { index: false, follow: false } };
  const page = getPartnerIndustryPage(params.industrySlug?.join('/') || '');
  if (!page) return { title: 'Industry Page Not Found', robots: { index: false, follow: false } };

  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `${page.title} funding guidance for ${broker.fullName}.`, path: `/industries/${params.industrySlug?.join('/') || ''}`, pageTitle: page.title,
  });
}

export default async function PartnerIndustryDetailPage({ params }: { params: { slug: string; industrySlug: string[] } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const industrySlug = params.industrySlug?.join('/') || '';
  const page = getPartnerIndustryPage(industrySlug);
  if (!page) notFound();

  const applyUrl = buildPartnerLeadFormUrl(broker, { source: `partner_industry_${page.slug}` });

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Industries" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Industries', href: `/${broker.slug}/industries` }, { label: page.title }]} />

        <div className="mb-8 border-4 border-neo-black bg-neo-pink p-6 shadow-brutal">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">{page.title}</div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">Capital for {page.title}</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{page.description}</p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <a href={applyUrl} className="btn-brutal-primary">Apply for Capital</a>
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Common capital pressures</h2>
              <ul className="mt-4 space-y-3 text-base font-medium leading-relaxed">
                {page.capitalPressures.map((item) => (<li key={item} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 bg-neo-blue"></span><span>{item}</span></li>))}
              </ul>
            </div>

            <div className="border-4 border-neo-black bg-neo-white p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">What businesses fund</h2>
              <p className="mt-4 text-base font-medium leading-relaxed">{page.summary}</p>
            </div>

            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Relevant funding paths</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.relevantFundingSlugs.map((slug) => (
                  <Link key={slug} href={`/${broker.slug}/funding/${slug}`} className="border-2 border-neo-black bg-neo-yellow px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">{slug.replace(/-/g, ' ')}</Link>
                ))}
              </div>
            </div>

            <div className="border-4 border-neo-black bg-neo-white p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">FAQ</h2>
              <div className="mt-4 space-y-5">
                {page.faq.map((item) => (
                  <div key={item.question}>
                    <div className="font-black uppercase tracking-[0.14em] text-neo-blue text-xs">{item.question}</div>
                    <p className="mt-2 text-base font-medium leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border-4 border-neo-black bg-neo-black p-6 text-neo-white shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter text-neo-yellow">How your funding agent helps</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-neo-white/80">This page is designed to help match financing to the business model, timing constraints, and objective behind the capital request.</p>
            </div>
            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter">Tools</h2>
              <div className="mt-4 space-y-3">
                {page.relatedToolSlugs.length ? page.relatedToolSlugs.map((slug) => (
                  <Link key={slug} href={`/${broker.slug}/tools/${slug}`} className="block border-b-2 border-neo-black pb-2 text-sm font-bold uppercase tracking-[0.14em] hover:text-neo-blue">{slug.replace(/-/g, ' ')}</Link>
                )) : <p className="text-sm font-medium">Relevant financing tools will appear here when assigned to this partner.</p>}
              </div>
            </div>
            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter">Apply or book</h2>
              <div className="mt-4 space-y-3">
                <a href={applyUrl} className="btn-brutal-primary block w-full">Apply now</a>
                {broker.bookingUrl && <a href={broker.bookingUrl} className="btn-brutal block w-full">Book a call</a>}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
