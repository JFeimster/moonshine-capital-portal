import Link from 'next/link';
import { CTASection } from '@/components/CTASection';
import { SectionHeading } from '@/components/SectionHeading';
import { getBrokers } from '@/lib/brokers';
import { constructMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Funding Types',
  description: 'Explore funding partners by funding specialty and capital need.',
  path: '/funding-types',
});

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
      <div className="bg-neo-black text-neo-white py-12 px-4 md:px-6 lg:px-8 border-b-4 border-neo-pink">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-3">Funding Types</h1>
          <p className="text-lg md:text-xl font-medium text-neo-cream/90 max-w-3xl">Explore the directory by funding specialty so operators can narrow the field before they waste time talking to the wrong partner.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-14 px-4 md:px-6 lg:px-8">
        <SectionHeading title="Funding Specialty Coverage" subtitle="Taxonomy" color="pink" />
        {fundingTypes.length === 0 ? (
          <div className="bg-neo-cream border-4 border-neo-black p-10 shadow-brutal font-bold text-lg">No funding types are available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundingTypes.map((fundingType) => (
              <Link key={fundingType.slug} href={`/funding-types/${fundingType.slug}`} className="bg-neo-cream border-4 border-neo-black p-4 shadow-brutal hover:-translate-y-1 transition-transform">
                <p className="text-xl font-black uppercase tracking-tight">{fundingType.name}</p>
                <p className="mt-2 font-bold text-xs uppercase text-neo-pink">{fundingType.count} partner{fundingType.count === 1 ? '' : 's'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CTASection />
    </div>
  );
}
