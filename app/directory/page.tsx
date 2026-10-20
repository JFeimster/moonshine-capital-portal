import { getBrokers } from '@/lib/brokers';
import { DirectoryClient } from '@/components/DirectoryClient';
import { CTASection } from '@/components/CTASection';
import { constructMetadata } from '@/lib/seo';
import { generateItemListSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Funding Advisor Directory',
  description: 'Browse public funding advisor profiles by company, state, industry, and funding specialty.',
  path: '/directory',
});

export default async function DirectoryPage() {
  const brokers = await getBrokers();
  const jsonLd = generateItemListSchema(brokers);

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-neo-black px-4 py-8 text-neo-white border-b-4 border-neo-green md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow mb-3 bg-neo-yellow text-neo-black">Advisor directory</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3">Find a Funding Advisor</h1>
          <p className="text-base md:text-lg font-medium text-neo-cream/90 max-w-3xl">
            Search public advisor profiles by name or company, then narrow the list by location, industry, and stated funding specialties.
          </p>
        </div>
      </div>

      {brokers.length === 0 ? (
        <div className="py-14 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-neo-cream border-4 border-neo-black p-8 text-center shadow-brutal">
            <h3 className="text-3xl font-black uppercase mb-4">No Public Advisor Profiles</h3>
            <p className="font-medium text-lg">There are no public profiles to browse right now. You can still review funding options or submit a funding intake.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><a href="/funding" className="btn-brutal">Explore Funding</a><a href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</a></div>
          </div>
        </div>
      ) : (
        <DirectoryClient initialBrokers={brokers} />
      )}

      <CTASection />
    </div>
  );
}
