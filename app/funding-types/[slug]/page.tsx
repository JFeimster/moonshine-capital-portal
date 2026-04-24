import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BrokerCard } from '@/components/BrokerCard';
import { CTASection } from '@/components/CTASection';
import { SectionHeading } from '@/components/SectionHeading';
import { getBrokers } from '@/lib/brokers';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function generateStaticParams() {
  const brokers = await getBrokers();
  const slugs = new Set<string>();

  brokers.forEach((broker) => {
    const types = broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties || [];
    types.forEach((fundingType) => slugs.add(slugify(fundingType)));
  });

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function FundingTypeSlugPage({ params }: { params: { slug: string } }) {
  const brokers = await getBrokers();
  const matchingBrokers = brokers.filter((broker) => {
    const types = broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties || [];
    return types.some((fundingType) => slugify(fundingType) === params.slug);
  });

  if (matchingBrokers.length === 0) {
    notFound();
  }

  const displayName = matchingBrokers
    .flatMap((broker) => (broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties || []))
    .find((fundingType) => slugify(fundingType) === params.slug) || params.slug;

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="max-w-7xl mx-auto py-8 px-6 md:px-12">
        <Link href="/funding-types" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-neo-blue transition-colors mb-8">
          <span className="text-xl leading-none">&larr;</span> Back to Funding Types
        </Link>

        <section className="mb-16">
          <SectionHeading title={displayName} subtitle="Funding Type" color="orange" />
          <p className="text-xl font-medium max-w-3xl border-l-4 border-neo-black pl-6">
            Explore brokers whose public specialties align with {displayName} and related capital needs.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {matchingBrokers.map((broker) => (
            <BrokerCard key={broker.id} broker={broker} />
          ))}
        </div>
      </div>

      <CTASection />
    </div>
  );
}
