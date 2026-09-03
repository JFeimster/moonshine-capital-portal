import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBrokerBySlug } from '@/lib/brokers';
import { getFeaturedRegistryItems, getRegistryDestination, getToolsForBroker } from '@/lib/embed-registry';
import { BrokerUtilitySection } from '@/components/BrokerUtilitySection';
import { AttributionContext, buildTrackedOutUrl } from '@/lib/distribution';
import { buildBrokerCtaHref } from '@/lib/broker-cta-routing';
import { constructPartnerMetadata } from '@/lib/seo';
import { createPartnerIdentitySchema, serializeJsonLd } from '@/lib/partner-schema';
import { getPartnerDisplaySpecialties, getPartnerSupportLine, getPrioritizedPartnerFunding, getPrioritizedPartnerIndustries, listPartnerCampaigns, listPartnerFundingPages, listPartnerIndustryPages, listPartnerResourcePages } from '@/lib/partner-site';
import { PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function contextFromSearch(searchParams: Record<string, string | string[] | undefined>): AttributionContext {
  const value = (key: string) => {
    const item = searchParams[key];
    return Array.isArray(item) ? item[0] : item;
  };
  return {
    source: value('source') || 'partner_funding_page',
    campaign: value('campaign'),
    utm_source: value('utm_source'),
    utm_medium: value('utm_medium'),
    utm_campaign: value('utm_campaign')
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Funding Page Not Found', robots: { index: false, follow: false } };
  const name = broker.displayName || broker.fullName;
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: name,
    companyName: broker.companyName || broker.agencyName,
    description: broker.shortBio,
    image: broker.profileImage,
  });
}

export default async function PublicFundingPage({
  params,
  searchParams = {}
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const context = contextFromSearch(searchParams);
  const name = broker.displayName || broker.fullName || 'Funding Advisor';
  const company = broker.companyName || broker.agencyName;
  const role = broker.title || 'Funding Advisor';
  const location = [broker.city, broker.state].filter(Boolean).join(', ');
  const specialties = getPartnerDisplaySpecialties(broker);
  const industries = broker.industries || [];
  const markets = broker.markets || [];
  const applyUrl = `/${broker.slug}/apply`;
  const bookingUrl = broker.bookingUrl ? `/${broker.slug}/book` : null;
  const websiteFallback = broker.websiteUrl ? buildTrackedOutUrl(broker, 'website', context) : null;
  const websiteUrl = websiteFallback ? buildBrokerCtaHref(broker, 'website', 'partner_funding_page', websiteFallback) : null;
  const brokerTools = await getToolsForBroker(broker.slug);
  const tools = (brokerTools.length ? brokerTools : await getFeaturedRegistryItems(3)).filter((tool) => tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#');
  const fundingPages = getPrioritizedPartnerFunding(listPartnerFundingPages(), broker);
  const industryPages = getPrioritizedPartnerIndustries(listPartnerIndustryPages(), broker);
  const campaigns = listPartnerCampaigns();
  const resources = (await listPartnerResourcePages()).filter((resource) => 'sections' in resource);
  const disclosures = broker.disclosures?.length
    ? broker.disclosures
    : ['Funding approval, terms, and availability depend on provider underwriting and applicant qualifications.'];

  const jsonLd = createPartnerIdentitySchema(broker, broker.shortBio || broker.whyChooseYou);

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Home" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-10 items-start">
          <div>
            <div className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 font-black uppercase text-xs tracking-widest mb-6">Business Funding</div>
            <h1 className="font-black uppercase tracking-tighter text-5xl md:text-7xl leading-[0.92] max-w-4xl">Capital for the business you are actually building.</h1>
            {getPartnerSupportLine(broker) && <p className="mt-7 text-xl md:text-2xl font-bold max-w-3xl leading-snug">{getPartnerSupportLine(broker)}</p>}
            <p className="mt-4 text-lg font-bold max-w-3xl leading-snug">Tell us what you need. We route the opportunity through the funding process and help you identify a practical next step without making you chase twenty different forms.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={applyUrl} className="inline-flex items-center justify-center bg-neo-black text-neo-white border-4 border-neo-black px-7 py-4 font-black uppercase tracking-wide shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Apply for Funding</a>
              {bookingUrl && <Link href={bookingUrl} className="inline-flex items-center justify-center bg-neo-white border-4 border-neo-black px-7 py-4 font-black uppercase tracking-wide shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Book a Call</Link>}
            </div>
            <p className="mt-4 text-sm font-bold text-neo-black/65">No funding guarantee. No need to enter a referral code; attribution is already attached to this page.</p>
          </div>

          <aside className="border-4 border-neo-black bg-neo-black text-neo-white shadow-brutal p-7 md:p-8">
            <div className="flex gap-5 items-center">
              {broker.profileImage ? <img src={broker.profileImage} alt={name} className="w-20 h-20 object-cover border-4 border-neo-green" /> : <div className="w-20 h-20 border-4 border-neo-green flex items-center justify-center font-black text-3xl text-neo-green">{name.charAt(0)}</div>}
              <div>
                <div className="text-neo-green text-xs font-black uppercase tracking-[0.18em]">Your Funding Contact</div>
                <h2 className="font-black text-2xl leading-tight mt-1">{name}</h2>
                <p className="font-bold text-neo-white/75">{role}{company ? ` · ${company}` : ''}</p>
                {location && <p className="text-sm text-neo-white/60 mt-1">{location}</p>}
              </div>
            </div>
            {(broker.shortBio || broker.whyChooseYou) && <p className="mt-6 font-medium leading-relaxed text-neo-white/85">{broker.shortBio || broker.whyChooseYou}</p>}
            <div className="mt-6 space-y-2 text-sm font-bold">
              {broker.publicEmail && <a className="block text-neo-green hover:underline" href={`mailto:${broker.publicEmail}`}>{broker.publicEmail}</a>}
              {broker.phoneNumber && <a className="block hover:underline" href={`tel:${broker.phoneNumber}`}>{broker.phoneNumber}</a>}
              {bookingUrl && <Link className="block text-neo-green hover:underline" href={bookingUrl}>Book with {name}</Link>}
              <Link className="block hover:underline" href={`/${broker.slug}/about`}>About {name}</Link>
              <Link className="block hover:underline" href={`/${broker.slug}/contact`}>Contact {name}</Link>
              {websiteUrl && <a className="block hover:underline" href={websiteUrl}>Partner website ↗</a>}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y-4 border-neo-black bg-neo-black text-neo-white">
        <div className="mx-auto grid max-w-7xl gap-2 px-6 py-5 sm:grid-cols-3 md:px-12 lg:grid-cols-6">
          {[['Funding', `/${broker.slug}/funding`], ['Industries', `/${broker.slug}/industries`], ['Solutions', `/${broker.slug}/campaign`], ['Tools', `/${broker.slug}/tools`], ['Resources', `/${broker.slug}/resources`], ['About', `/${broker.slug}/about`]].map(([label, href]) => <Link key={href} href={href} className="border-2 border-neo-white/40 px-3 py-3 text-xs font-black uppercase tracking-[0.16em] hover:bg-neo-yellow hover:text-neo-black">{label}</Link>)}
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap gap-5 px-6 pb-5 text-xs font-black uppercase tracking-[0.16em] text-neo-green md:px-12"><span>{fundingPages.length} Funding Paths</span><span>{industryPages.length} Industries</span><span>{resources.length} Resources</span></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-12">
        <div className="mb-6 flex items-end justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.2em] text-neo-blue">Capital paths</div><h2 className="mt-2 text-3xl font-black uppercase tracking-tighter md:text-4xl">Choose your lane</h2></div><Link href={`/${broker.slug}/funding`} className="text-xs font-black uppercase tracking-[0.16em] hover:text-neo-blue">View all funding options →</Link></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{fundingPages.slice(0, 6).map((page) => <Link key={page.slug} href={`/${broker.slug}/funding/${page.slug}`} className="border-4 border-neo-black bg-neo-cream p-5 shadow-brutal hover:-translate-y-1"><h3 className="text-xl font-black uppercase tracking-tighter">{page.title}</h3><p className="mt-2 text-sm font-medium">{page.summary}</p></Link>)}</div>
      </section>

      <section className="border-y-4 border-neo-black bg-neo-pink"><div className="mx-auto max-w-7xl px-6 py-14 md:px-12"><div className="mb-6 flex items-end justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.2em]">Industry capital</div><h2 className="mt-2 text-3xl font-black uppercase tracking-tighter md:text-4xl">Built for the field</h2></div><Link href={`/${broker.slug}/industries`} className="text-xs font-black uppercase tracking-[0.16em] hover:text-neo-blue">Explore all industries →</Link></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{industryPages.slice(0, 8).map((industry) => <Link key={industry.slug} href={`/${broker.slug}/industries/${industry.slug}`} className="border-2 border-neo-black bg-neo-white px-4 py-4 text-sm font-black uppercase hover:bg-neo-yellow">{industry.title}</Link>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-12"><div className="mb-6 flex items-end justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.2em] text-neo-blue">Solutions</div><h2 className="mt-2 text-3xl font-black uppercase tracking-tighter md:text-4xl">Capital for the actual job</h2></div><Link href={`/${broker.slug}/campaign`} className="text-xs font-black uppercase tracking-[0.16em] hover:text-neo-blue">Explore solutions →</Link></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{campaigns.slice(0, 6).map((campaign) => <Link key={campaign.slug} href={`/${broker.slug}/campaign/${campaign.slug}`} className="border-4 border-neo-black bg-neo-yellow p-5 shadow-brutal hover:-translate-y-1"><div className="text-xs font-black uppercase tracking-[0.16em]">{campaign.eyebrow}</div><h3 className="mt-3 text-xl font-black uppercase tracking-tighter">{campaign.headline}</h3></Link>)}</div></section>

      <section className="border-y-4 border-neo-black bg-neo-cream"><div className="mx-auto max-w-7xl px-6 py-14 md:px-12"><div className="mb-6 flex items-end justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.2em] text-neo-blue">Funding resources</div><h2 className="mt-2 text-3xl font-black uppercase tracking-tighter md:text-4xl">Get funding-ready</h2></div><Link href={`/${broker.slug}/resources`} className="text-xs font-black uppercase tracking-[0.16em] hover:text-neo-blue">View resource library →</Link></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{resources.slice(0, 6).map((resource) => <Link key={resource.slug} href={`/${broker.slug}/resources/${resource.slug}`} className="border-2 border-neo-black bg-neo-white p-4 font-black uppercase hover:bg-neo-green"><div className="text-[10px] tracking-[0.16em] text-neo-blue">{resource.resourceType}</div><div className="mt-2">{resource.title}</div></Link>)}</div></div></section>

      {(specialties.length > 0 || industries.length > 0 || markets.length > 0) && (
        <section className="border-y-4 border-neo-black bg-neo-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid md:grid-cols-3 gap-8">
            {specialties.length > 0 && <div><h2 className="font-black uppercase text-xl mb-4">Funding Areas</h2><div className="flex flex-wrap gap-2">{specialties.map(item => <span key={item} className="border-2 border-neo-black bg-neo-green px-3 py-2 font-bold text-sm">{item}</span>)}</div></div>}
            {industries.length > 0 && <div><h2 className="font-black uppercase text-xl mb-4">Industries</h2><div className="flex flex-wrap gap-2">{industries.map(item => <span key={item} className="border-2 border-neo-black bg-neo-pink px-3 py-2 font-bold text-sm">{item}</span>)}</div></div>}
            {markets.length > 0 && <div><h2 className="font-black uppercase text-xl mb-4">Markets</h2><div className="flex flex-wrap gap-2">{markets.map(item => <span key={item} className="border-2 border-neo-black bg-neo-yellow px-3 py-2 font-bold text-sm">{item}</span>)}</div></div>}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neo-blue">One intake. Clear next step.</div>
            <h2 className="font-black uppercase tracking-tighter text-4xl md:text-5xl mt-3">Start the funding conversation.</h2>
            <p className="mt-5 text-lg font-bold max-w-xl">The intake captures the business fundamentals needed for an initial funding review and keeps this partner attached automatically.</p>
            <Link href={applyUrl} className="mt-7 inline-flex bg-neo-blue text-white border-4 border-neo-black px-6 py-4 font-black uppercase shadow-brutal">Open Secure Funding Intake</Link>
          </div>
          <div className="border-4 border-neo-black bg-neo-cream p-7 shadow-brutal">
            <h3 className="font-black uppercase text-2xl">What happens next</h3>
            <ol className="mt-5 space-y-4 font-bold">
              <li><span className="text-neo-blue">01.</span> Submit the business and funding request.</li>
              <li><span className="text-neo-blue">02.</span> The request enters the canonical funding lead flow with partner attribution intact.</li>
              <li><span className="text-neo-blue">03.</span> The funding team reviews fit, documents, and available routes.</li>
              <li><span className="text-neo-blue">04.</span> You receive the next practical step based on the actual file.</li>
            </ol>
          </div>
        </div>
      </section>

      {tools.length > 0 && <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16"><BrokerUtilitySection brokerName={name} tools={tools} isFallback={brokerTools.length === 0} /></section>}

      <section className="bg-neo-black text-neo-white border-t-4 border-neo-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <h2 className="font-black uppercase text-lg text-neo-green">Funding disclosure</h2>
          <ul className="mt-3 space-y-2 text-sm text-neo-white/75 font-medium">{disclosures.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
      <section className="border-t-4 border-neo-black bg-neo-blue text-neo-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12"><div><div className="text-xs font-black uppercase tracking-[0.2em] text-neo-green">Ready to move?</div><h2 className="mt-2 text-3xl font-black uppercase tracking-tighter">Ready to find the right capital path?</h2></div><PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${name}`} /></div></section>
      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
