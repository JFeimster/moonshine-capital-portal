import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getPartnerFundingPage } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { buildPartnerLeadFormUrl } from '@/lib/distribution';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string; fundingSlug: string[] } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Funding Option Not Found', robots: { index: false, follow: false } };
  const fundingSlug = params.fundingSlug?.join('/') || '';
  const page = getPartnerFundingPage(fundingSlug);
  if (!page) return { title: 'Funding Option Not Found', robots: { index: false, follow: false } };

  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `${page.title} funding details for ${broker.fullName}.`,
  });
}

export default async function PartnerFundingDetailPage({ params }: { params: { slug: string; fundingSlug: string[] } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const fundingSlug = params.fundingSlug?.join('/') || '';
  const page = getPartnerFundingPage(fundingSlug);
  if (!page) notFound();

  const applyUrl = buildPartnerLeadFormUrl(broker, { source: `partner_funding_${page.slug}` });

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Funding" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Funding', href: `/${broker.slug}/funding` }, { label: page.title }]} />

        <div className="mb-8 border-4 border-neo-black bg-neo-yellow p-6 shadow-brutal">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">{page.title}</div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">{page.title}</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{page.description}</p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <a href={applyUrl} className="btn-brutal-primary">Apply for Funding</a>
          <Link href={`/${broker.slug}/funding`} className="btn-brutal">Back to Funding</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">What this capital can help with</h2>
              <ul className="mt-4 space-y-3 text-base font-medium leading-relaxed">
                {page.useCases.map((item) => (<li key={item} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 bg-neo-blue"></span><span>{item}</span></li>))}
              </ul>
            </div>

            <div className="border-4 border-neo-black bg-neo-white p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Who it may fit</h2>
              <ul className="mt-4 space-y-3 text-base font-medium leading-relaxed">{page.whoItMayFit.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 bg-neo-blue" />{item}</li>)}</ul>
            </div>

            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">What to prepare</h2>
              <ul className="mt-4 space-y-2 text-base font-medium leading-relaxed">
                {page.whatToPrepare.map((item) => <li key={item}>• {item}</li>)}
              </ul>
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
              <p className="mt-4 text-sm font-medium leading-relaxed text-neo-white/80">Your advisor helps match the right product lane to the business profile, keeps the process efficient, and routes the request through the most practical path for the file.</p>
            </div>
            <div className="border-4 border-neo-black bg-neo-pink p-6 shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter">Related funding</h2>
              <div className="mt-4 space-y-3">
                {page.relatedFundingSlugs.slice(0, 3).map((slug) => (
                  <Link key={slug} href={`/${broker.slug}/funding/${slug}`} className="block border-b-2 border-neo-black pb-2 text-sm font-bold uppercase tracking-[0.14em] hover:text-neo-blue">{slug.replace(/-/g, ' ')}</Link>
                ))}
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
