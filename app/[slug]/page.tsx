import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBrokerBySlug, getBrokers } from '@/lib/brokers';
import { getFeaturedRegistryItems, getToolsForBroker } from '@/lib/embed-registry';
import { BrokerUtilitySection } from '@/components/BrokerUtilitySection';
import { buildPartnerLeadFormUrl, buildTrackedOutUrl, AttributionContext } from '@/lib/distribution';
import { constructPartnerMetadata } from '@/lib/seo';
import { generatePartnerSchema } from '@/lib/schema';

export const revalidate = 3600;

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
  });
}

export async function generateStaticParams() {
  const brokers = await getBrokers();
  return brokers.map((broker) => ({ slug: broker.slug }));
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
  const specialties = (broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties) || [];
  const industries = broker.industries || [];
  const markets = broker.markets || [];
  const applyUrl = buildTrackedOutUrl(broker, 'apply', context);
  const leadFormUrl = buildPartnerLeadFormUrl(broker, context);
  const bookingUrl = broker.bookingUrl ? buildTrackedOutUrl(broker, 'booking', context) : null;
  const websiteUrl = broker.websiteUrl ? buildTrackedOutUrl(broker, 'website', context) : null;
  const brokerTools = await getToolsForBroker(broker.slug);
  const tools = brokerTools.length ? brokerTools : await getFeaturedRegistryItems(3);
  const disclosures = broker.disclosures?.length
    ? broker.disclosures
    : ['Funding approval, terms, and availability depend on provider underwriting and applicant qualifications.'];

  const jsonLd = generatePartnerSchema({
    slug: broker.slug,
    name,
    companyName: company,
    jobTitle: role,
    areaServed: markets.length ? markets : location || 'United States',
    type: 'FinancialService',
  });

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b-4 border-neo-black bg-neo-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="font-black uppercase tracking-tight">Distilled Funding <span className="text-neo-blue">/ Capital Desk</span></div>
          <div className="text-xs font-black uppercase tracking-[0.2em]">Partner-attributed funding access</div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-10 items-start">
          <div>
            <div className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 font-black uppercase text-xs tracking-widest mb-6">Business Funding</div>
            <h1 className="font-black uppercase tracking-tighter text-5xl md:text-7xl leading-[0.92] max-w-4xl">
              Capital for the business you are actually building.
            </h1>
            <p className="mt-7 text-xl md:text-2xl font-bold max-w-3xl leading-snug">
              Tell us what you need. We route the opportunity through the funding process and help you identify a practical next step without making you chase twenty different forms.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={applyUrl} className="inline-flex items-center justify-center bg-neo-black text-neo-white border-4 border-neo-black px-7 py-4 font-black uppercase tracking-wide shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                {broker.ctaLabel || broker.primaryCta?.label || 'Request Funding Review'}
              </a>
              {bookingUrl && <a href={bookingUrl} className="inline-flex items-center justify-center bg-neo-white border-4 border-neo-black px-7 py-4 font-black uppercase tracking-wide shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Book a Call</a>}
            </div>
            <p className="mt-4 text-sm font-bold text-neo-black/65">No funding guarantee. No need to enter a referral code; attribution is already attached to this page.</p>
          </div>

          <aside className="border-4 border-neo-black bg-neo-black text-neo-white shadow-brutal p-7 md:p-8">
            <div className="flex gap-5 items-center">
              {broker.profileImage ? (
                <img src={broker.profileImage} alt={name} className="w-20 h-20 object-cover border-4 border-neo-green" />
              ) : (
                <div className="w-20 h-20 border-4 border-neo-green flex items-center justify-center font-black text-3xl text-neo-green">{name.charAt(0)}</div>
              )}
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
              {websiteUrl && <a className="block hover:underline" href={websiteUrl}>Partner website ↗</a>}
            </div>
          </aside>
        </div>
      </section>

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
            <a href={leadFormUrl} className="mt-7 inline-flex bg-neo-blue text-white border-4 border-neo-black px-6 py-4 font-black uppercase shadow-brutal">Open Secure Funding Intake ↗</a>
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
    </main>
  );
}
