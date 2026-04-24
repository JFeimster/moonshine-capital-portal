import Link from 'next/link';
import { CTASection } from '@/components/CTASection';
import { SectionHeading } from '@/components/SectionHeading';
import { getBrokers } from '@/lib/brokers';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default async function FundingTypesPage() {
  const brokers = await getBrokers();
  const fundingTypeCounts = new Map<string, number>();

  brokers.forEach((broker) => {
    const types = broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties || [];
    types.forEach((fundingType) => {
      fundingTypeCounts.set(fundingType, (fundingTypeCounts.get(fundingType) || 0) + 1);
    });
  });

  const fundingTypes = Array.from(fundingTypeCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, slug: slugify(name), count }));

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="bg-neo-black text-neo-white py-16 px-6 md:px-12 border-b-4 border-neo-pink">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Funding Types</h1>
          <p className="text-xl md:text-2xl font-medium text-neo-cream/90 max-w-3xl">
            Explore the directory by funding specialty so operators can narrow the field before they waste time talking to the wrong partner.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6 md:px-12">
        <SectionHeading title="Funding Specialty Coverage" subtitle="Taxonomy" color="pink" />
        {fundingTypes.length === 0 ? (
          <div className="bg-neo-cream border-4 border-neo-black p-10 shadow-brutal font-bold text-lg">
            No funding types are available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundingTypes.map((fundingType) => (
              <Link
                key={fundingType.slug}
                href={`/funding-types/${fundingType.slug}`}
                className="bg-neo-cream border-4 border-neo-black p-6 shadow-brutal hover:-translate-y-1 transition-transform"
              >
                <p className="text-2xl font-black uppercase tracking-tight">{fundingType.name}</p>
                <p className="mt-3 font-bold text-sm uppercase text-neo-pink">{fundingType.count} partner{fundingType.count === 1 ? '' : 's'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CTASection />
    </div>
  );
}
