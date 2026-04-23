import Link from 'next/link';
import { CTASection } from '@/components/CTASection';
import { SectionHeading } from '@/components/SectionHeading';
import { getBrokers } from '@/lib/brokers';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default async function IndustriesPage() {
  const brokers = await getBrokers();
  const industryCounts = new Map<string, number>();

  brokers.forEach((broker) => {
    broker.industries?.forEach((industry) => {
      industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);
    });
  });

  const industries = Array.from(industryCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, slug: slugify(name), count }));

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="bg-neo-black text-neo-white py-16 px-6 md:px-12 border-b-4 border-neo-green">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Industries</h1>
          <p className="text-xl md:text-2xl font-medium text-neo-cream/90 max-w-3xl">
            Browse broker coverage by market segment so founders can jump straight to partners who already understand the operating reality.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6 md:px-12">
        <SectionHeading title="Industry Coverage" subtitle="Discovery" color="green" />
        {industries.length === 0 ? (
          <div className="bg-neo-cream border-4 border-neo-black p-10 shadow-brutal font-bold text-lg">
            No industry segments are available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="bg-neo-cream border-4 border-neo-black p-6 shadow-brutal hover:-translate-y-1 transition-transform"
              >
                <p className="text-2xl font-black uppercase tracking-tight">{industry.name}</p>
                <p className="mt-3 font-bold text-sm uppercase text-neo-blue">{industry.count} partner{industry.count === 1 ? '' : 's'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CTASection />
    </div>
  );
}
