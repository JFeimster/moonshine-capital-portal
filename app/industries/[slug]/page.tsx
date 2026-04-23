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

  brokers.forEach((broker) => broker.industries?.forEach((industry) => slugs.add(slugify(industry))));

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function IndustrySlugPage({ params }: { params: { slug: string } }) {
  const brokers = await getBrokers();
  const matchingBrokers = brokers.filter((broker) => broker.industries?.some((industry) => slugify(industry) === params.slug));

  if (matchingBrokers.length === 0) {
    notFound();
  }

  const displayName = matchingBrokers.flatMap((broker) => broker.industries || []).find((industry) => slugify(industry) === params.slug) || params.slug;

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="max-w-7xl mx-auto py-8 px-6 md:px-12">
        <Link href="/industries" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-neo-blue transition-colors mb-8">
          <span className="text-xl leading-none">&larr;</span> Back to Industries
        </Link>

        <section className="mb-16">
          <SectionHeading title={displayName} subtitle="Industry" color="blue" />
          <p className="text-xl font-medium max-w-3xl border-l-4 border-neo-black pl-6">
            Browse brokers with relevant experience and funding specialties for {displayName} operators.
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
