import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getFeaturedRegistryItems, getRegistryDestination, getToolsForBroker } from '@/lib/embed-registry';
import { BrokerUtilitySection } from '@/components/BrokerUtilitySection';
import { PartnerSiteFooter, PartnerSiteHeader, PartnerCTACluster } from '@/components/partner-site';
import { getPartnerDisplaySpecialties, getPrioritizedPartnerFunding, getPrioritizedPartnerIndustries, listPartnerFundingPages, listPartnerIndustryPages } from '@/lib/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';
import { createPartnerIdentitySchema, serializeJsonLd } from '@/lib/partner-schema';
import { buildTrackedOutUrl } from '@/lib/distribution';
import { buildBrokerCtaHref } from '@/lib/broker-cta-routing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Funding Page Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: broker.shortBio,
    image: broker.profileImage,
  });
}

export default async function PublicFundingPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();
  const name = broker.displayName || broker.fullName || 'Funding Advisor';
  const company = broker.companyName || broker.agencyName;
  const location = [broker.city, broker.state].filter(Boolean).join(', ');
  const specialties = getPartnerDisplaySpecialties(broker);
  const industries = broker.industries || [];
  const funding = getPrioritizedPartnerFunding(listPartnerFundingPages(), broker, 3)
    .filter(page => specialties.length === 0 || specialties.some(item => page.title.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(page.title.toLowerCase())));
  const matchedIndustries = getPrioritizedPartnerIndustries(listPartnerIndustryPages(), broker, 3)
    .filter(page => industries.some(item => page.title.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(page.title.toLowerCase())));
  const assignedTools = await getToolsForBroker(broker.slug);
  const allTools = assignedTools.length ? assignedTools : await getFeaturedRegistryItems(3);
  const tools = allTools.filter(tool => tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#').slice(0, 4);
  const context = { source: 'partner_profile' };
  const websiteFallback = broker.websiteUrl ? buildTrackedOutUrl(broker, 'website', context) : null;
  const websiteHref = websiteFallback ? buildBrokerCtaHref(broker, 'website', 'partner_profile', websiteFallback) : null;
  const jsonLd = createPartnerIdentitySchema(broker, broker.shortBio || broker.whyChooseYou);
  const disclosures = broker.disclosures?.length ? broker.disclosures : ['Financing approval, terms, and availability depend on provider underwriting and applicant qualifications.'];

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PartnerSiteHeader broker={broker} active="Home" />
      <section className="border-b-4 border-neo-black bg-neo-black text-neo-white">
        <div className="section-shell grid items-center gap-7 py-8 md:py-10 lg:grid-cols-[minmax(230px,.8fr)_minmax(0,1.2fr)] lg:gap-12">
          <div className="relative mx-auto w-full max-w-[340px] lg:mx-0">
            {broker.profileImage ? (
              <img src={broker.profileImage} alt={'Portrait of ' + name} className="aspect-[4/5] w-full border-4 border-neo-green bg-neo-cream object-cover shadow-[8px_8px_0_0_#facc15]" />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center border-4 border-neo-green bg-neo-cream text-[6rem] font-black text-neo-black shadow-[8px_8px_0_0_#facc15]">{name.charAt(0)}</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.13em] text-neo-green">{broker.title || 'Funding Advisor'} {location && <span className="text-neo-white/65"> · {location}</span>}</p>
            <h1 className="max-w-3xl break-words text-[clamp(2.5rem,4vw,4.3rem)] font-black uppercase leading-[.98] tracking-tight">{name}</h1>
            {company && <p className="mt-2 text-base font-bold text-neo-yellow md:text-xl">{company}</p>}
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-neo-white/90 md:text-lg">{broker.shortBio || broker.whyChooseYou || 'Explore funding options, helpful tools, and direct contact with your funding advisor.'}</p>
            {specialties.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{specialties.slice(0, 4).map(item => <span key={item} className="border border-neo-green/70 px-2.5 py-1 text-xs font-bold">{item}</span>)}</div>}
            <div className="mt-6"><PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel="Book a Call" /></div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              {broker.publicEmail && <a href={'mailto:' + broker.publicEmail} className="text-neo-green underline underline-offset-4">{broker.publicEmail}</a>}
              <Link href={'/' + broker.slug + '/contact'} className="underline underline-offset-4">Contact advisor</Link>
              {websiteHref && <a href={websiteHref} className="underline underline-offset-4">Company website ↗</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-10 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-neo-blue">Your next move</p><h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">Funding resources that do something</h2></div><Link href={'/' + broker.slug + '/resources'} className="text-xs font-black uppercase underline underline-offset-4">Explore resources →</Link></div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href={'/' + broker.slug + '/apply'} className="border-[3px] border-neo-black bg-neo-yellow p-5 shadow-brutal transition-transform hover:-translate-y-1"><p className="text-xs font-black uppercase">01 · Get started</p><h3 className="mt-3 text-xl font-black uppercase">Start a funding review</h3><p className="mt-2 text-sm font-medium">Provide the essentials for an initial capital conversation.</p><span className="mt-5 inline-block text-sm font-black underline">Start application →</span></Link>
          <Link href={'/' + broker.slug + '/tools'} className="border-[3px] border-neo-black bg-neo-green p-5 shadow-brutal transition-transform hover:-translate-y-1"><p className="text-xs font-black uppercase">02 · Use the tools</p><h3 className="mt-3 text-xl font-black uppercase">Explore funding tools</h3><p className="mt-2 text-sm font-medium">Calculators, checklists, and resources for planning your next move.</p><span className="mt-5 inline-block text-sm font-black underline">Open tools →</span></Link>
          <Link href={'/' + broker.slug + '/contact'} className="border-[3px] border-neo-black bg-neo-pink p-5 shadow-brutal transition-transform hover:-translate-y-1"><p className="text-xs font-black uppercase">03 · Connect</p><h3 className="mt-3 text-xl font-black uppercase">Talk through your options</h3><p className="mt-2 text-sm font-medium">Reach this advisor with a specific question or funding need.</p><span className="mt-5 inline-block text-sm font-black underline">Get in touch →</span></Link>
        </div>
      </section>

      {tools.length > 0 && <section className="section-shell pb-12"><BrokerUtilitySection brokerName={name} tools={tools} isFallback={assignedTools.length === 0} /></section>}

      {(funding.length > 0 || matchedIndustries.length > 0) && <section className="border-y-4 border-neo-black bg-neo-cream"><div className="section-shell py-10">
        <h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">Areas of focus</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {funding.length > 0 && <div><h3 className="mb-3 text-sm font-black uppercase">Relevant funding options</h3><div className="flex flex-wrap gap-2">{funding.map(item => <Link key={item.slug} href={'/funding-types/' + item.slug} className="border-2 border-neo-black bg-neo-white px-3 py-2 text-sm font-bold hover:bg-neo-yellow">{item.title} ↗</Link>)}</div></div>}
          {matchedIndustries.length > 0 && <div><h3 className="mb-3 text-sm font-black uppercase">Industries</h3><div className="flex flex-wrap gap-2">{matchedIndustries.map(item => <Link key={item.slug} href={'/industries/' + item.slug} className="border-2 border-neo-black bg-neo-white px-3 py-2 text-sm font-bold hover:bg-neo-yellow">{item.title} ↗</Link>)}</div></div>}
        </div>
      </div></section>}

      {(broker.whyChooseYou || industries.length > 0) && <section className="section-shell py-10 md:py-12"><h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">About working with {name}</h2>{broker.whyChooseYou && <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed">{broker.whyChooseYou}</p>}{industries.length > 0 && <p className="mt-4 text-sm font-bold">Industry focus: {industries.slice(0, 6).join(' · ')}</p>}</section>}

      <section className="border-t-4 border-neo-black bg-neo-blue text-neo-white"><div className="section-shell flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-neo-green">Ready to move?</p><h2 className="mt-2 text-2xl font-black uppercase md:text-3xl">Have a funding need? Start here.</h2></div><PartnerCTACluster broker={broker} /></div></section>
      <section className="bg-neo-black px-4 py-5 text-neo-white/70"><div className="section-shell text-xs"><strong className="text-neo-green">Funding disclosure:</strong> {disclosures.join(' ')}</div></section>
      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
