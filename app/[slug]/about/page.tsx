import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { listPartnerIndustryPages } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'About Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `About ${broker.fullName} and their funding advisory work.`, path: '/about', pageTitle: 'About',
  });
}

export default async function PartnerAboutPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const industries = listPartnerIndustryPages().slice(0, 6);

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="About" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'About' }]} />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="border-4 border-neo-black bg-neo-yellow p-6 shadow-brutal">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">Advisor hero</div>
              <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">About {broker.displayName || broker.fullName}</h1>
              <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{broker.shortBio || 'This advisor helps businesses identify realistic capital options and follow a disciplined path toward funding.'}</p>
            </div>

            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Background & positioning</h2>
              <p className="mt-4 text-base font-medium leading-relaxed">{broker.whyChooseYou || 'The funding advisor focuses on practical capital guidance, structured intake, and a clear path to the most relevant funding solution.'}</p>
            </div>

            <div className="border-4 border-neo-black bg-neo-white p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Who I help</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(broker.industries || []).slice(0, 8).map((industry) => (
                  <span key={industry} className="border-2 border-neo-black bg-neo-green px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">{industry}</span>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border-4 border-neo-black bg-neo-black p-6 text-neo-white shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter text-neo-yellow">Contact</h2>
              <div className="mt-4 space-y-2 text-sm font-bold">
                {broker.publicEmail && <a href={`mailto:${broker.publicEmail}`} className="block hover:text-neo-yellow">{broker.publicEmail}</a>}
                {broker.phoneNumber && <a href={`tel:${broker.phoneNumber}`} className="block hover:text-neo-yellow">{broker.phoneNumber}</a>}
                {broker.websiteUrl && <a href={broker.websiteUrl} className="block hover:text-neo-yellow">Website</a>}
              </div>
            </div>

            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter">Industries</h2>
              <div className="mt-4 space-y-3">
                {industries.map((industry) => (
                  <Link key={industry.slug} href={`/${broker.slug}/industries/${industry.slug}`} className="block border-b-2 border-neo-black pb-2 text-sm font-bold uppercase tracking-[0.14em] hover:text-neo-blue">{industry.title}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} />
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
