import { getBrokerBySlug, getBrokers } from '@/lib/brokers';
import { getFeaturedRegistryItems, getToolsForBroker } from '@/lib/embed-registry';
import { ProfileHero } from '@/components/ProfileHero';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/CTASection';
import { BrokerUtilitySection } from '@/components/BrokerUtilitySection';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);

  if (!broker) {
    return {
      title: 'Partner Not Found | Moonshine Capital',
      description: 'The requested funding partner could not be found.'
    };
  }

  const title = `${broker.fullName} | ${broker.agencyName} | Moonshine Capital`;
  const description = broker.shortBio || `Learn more about ${broker.fullName} at ${broker.agencyName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    }
  };
}

export async function generateStaticParams() {
  const brokers = await getBrokers();
  return brokers.map((broker) => ({ slug: broker.slug }));
}

export default async function BrokerProfilePage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);

  if (!broker) notFound();

  const specialties = broker.fundingTypes || broker.fundingSpecialties || [];
  const industries = broker.industries || [];
  const brokerTools = await getToolsForBroker(broker.slug);
  const fallbackTools = brokerTools.length === 0 ? await getFeaturedRegistryItems(3) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: broker.fullName,
    jobTitle: 'Funding Partner',
    worksFor: { '@type': 'Organization', name: broker.agencyName },
    description: broker.shortBio,
    url: `https://moonshinecapital.com/directory/${broker.slug}`,
  };

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <Link href="/directory" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-neo-blue transition-colors mb-8">
          <span className="text-xl leading-none">&larr;</span> Back to Directory
        </Link>

        <ProfileHero broker={broker} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <SectionHeading title="Partner Overview" color="blue" />
              <div className="bg-neo-cream p-8 border-4 border-neo-black shadow-brutal text-lg font-medium leading-relaxed">
                {broker.whyChooseYou}
              </div>
            </section>

            <section>
              <SectionHeading title="Snapshot" color="yellow" />
              <p className="text-xl font-bold border-l-4 border-neo-black pl-6">{broker.shortBio}</p>
            </section>

            <BrokerUtilitySection
              brokerName={broker.fullName}
              tools={brokerTools.length > 0 ? brokerTools : fallbackTools}
              isFallback={brokerTools.length === 0}
            />
          </div>

          <div className="space-y-12">
            <div className="bg-neo-black text-neo-white p-8 border-4 border-neo-green shadow-brutal">
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-6 text-neo-green">Funding Types</h3>
              <ul className="space-y-3">
                {specialties.map((spec) => (
                  <li key={spec} className="flex items-center gap-3 font-bold text-lg"><span className="w-3 h-3 bg-neo-green inline-block"></span>{spec}</li>
                ))}
              </ul>

              {industries.length > 0 && (
                <>
                  <h3 className="font-black text-2xl uppercase tracking-tighter mt-8 mb-6 text-neo-pink">Industries</h3>
                  <ul className="space-y-3">
                    {industries.map((ind) => (
                      <li key={ind} className="flex items-center gap-3 font-bold text-lg"><span className="w-3 h-3 bg-neo-pink inline-block"></span>{ind}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="bg-neo-cream p-8 border-4 border-neo-black shadow-brutal">
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-6">Contact</h3>
              <div className="space-y-4 font-bold">
                {broker.publicEmail && <div><div className="text-sm uppercase text-neo-black/60 mb-1">Email</div><a href={`mailto:${broker.publicEmail}`} className="text-neo-blue hover:underline break-all">{broker.publicEmail}</a></div>}
                {broker.phoneNumber && <div><div className="text-sm uppercase text-neo-black/60 mb-1">Phone</div><a href={`tel:${broker.phoneNumber}`} className="hover:underline">{broker.phoneNumber}</a></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
}
