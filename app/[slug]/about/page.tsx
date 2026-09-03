import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getPartnerDisplaySpecialties, getPartnerSupportLine, listPartnerIndustryPages } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';
import { createBreadcrumbSchema, serializeJsonLd } from '@/lib/partner-schema';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'About Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `About ${broker.displayName || broker.fullName} and their funding advisory work.`, path: '/about', pageTitle: 'About', image: broker.profileImage,
  });
}

export default async function PartnerAboutPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const name = broker.displayName || broker.fullName;
  const specialties = getPartnerDisplaySpecialties(broker);
  const industries = broker.industries || [];
  const location = [broker.city, broker.state].filter(Boolean).join(', ');
  const biography = broker.shortBio || broker.whyChooseYou || `${name} helps business owners navigate funding options through the Distilled Funding capital network.`;
  const howIHelp = getPartnerSupportLine(broker) || `${name} helps business owners navigate funding options through the Distilled Funding capital network.`;
  const breadcrumb = createBreadcrumbSchema(broker.slug, name, [{ label: 'About', path: 'about' }]);

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="About" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'About' }]} />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="border-4 border-neo-black bg-neo-yellow p-6 shadow-brutal">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">Funding advisor</div>
              <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">{name}</h1>
              <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{biography}</p>
            </div>

            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-2xl font-black uppercase tracking-tighter">How I help</h2>
              <p className="mt-4 text-base font-medium leading-relaxed">{howIHelp}</p>
            </div>

            {(specialties.length > 0 || industries.length > 0) && <div className="border-4 border-neo-black bg-neo-white p-6 shadow-brutal">
              {specialties.length > 0 && <><h2 className="text-2xl font-black uppercase tracking-tighter">Focus areas</h2><div className="mt-4 flex flex-wrap gap-2">
                {specialties.map((specialty) => <span key={specialty} className="border-2 border-neo-black bg-neo-green px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">{specialty}</span>)}
              </div></>}
              {industries.length > 0 && <><h2 className="mt-6 text-2xl font-black uppercase tracking-tighter">Industries</h2><div className="mt-4 flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <span key={industry} className="border-2 border-neo-black bg-neo-green px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">{industry}</span>
                ))}
              </div></>}
            </div>}
          </div>

          <aside className="space-y-6">
            <div className="border-4 border-neo-black bg-neo-black p-6 text-neo-white shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter text-neo-yellow">Contact</h2>
              <div className="mt-4 space-y-2 text-sm font-bold">
                {broker.publicEmail && <a href={`mailto:${broker.publicEmail}`} className="block hover:text-neo-yellow">{broker.publicEmail}</a>}
                {broker.phoneNumber && <a href={`tel:${broker.phoneNumber}`} className="block hover:text-neo-yellow">{broker.phoneNumber}</a>}
                {broker.websiteUrl && <a href={broker.websiteUrl} className="block hover:text-neo-yellow">Website</a>}
                {broker.bookingUrl && <Link href={`/${broker.slug}/book`} className="block hover:text-neo-yellow">Book a call</Link>}
                {location && <p className="pt-2 text-neo-white/70">{location}</p>}
              </div>
            </div>

            <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter">Industries</h2>
              <div className="mt-4 space-y-3">
                {listPartnerIndustryPages().slice(0, 6).map((industry) => (
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
