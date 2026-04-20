import { getBrokers } from '@/lib/brokers';
import { DirectoryClient } from '@/components/DirectoryClient';
import { CTASection } from '@/components/CTASection';

import { Metadata } from 'next';

export const revalidate = 3600; // ISR for 1 hour

export const metadata: Metadata = {
  title: 'Partner Directory | Moonshine Capital',
  description: 'Find the right capital partner for your next move. Browse our directory of verified funding partners.',
  openGraph: {
    title: 'Partner Directory | Moonshine Capital',
    description: 'Find the right capital partner for your next move. Browse our directory of verified funding partners.',
    type: 'website',
  },
};

export default async function DirectoryPage() {
  const brokers = await getBrokers();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": brokers.map((broker, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://moonshinecapital.com/directory/${broker.slug}`
    }))
  };

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-neo-black text-neo-white py-16 px-6 md:px-12 border-b-4 border-neo-green">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Partner Directory</h1>
          <p className="text-xl md:text-2xl font-medium text-neo-cream/90 max-w-2xl">
            Find the right capital partner for your next move.
          </p>
        </div>
      </div>

      {brokers.length === 0 ? (
        <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="bg-neo-cream border-4 border-neo-black p-12 text-center shadow-brutal">
            <h3 className="text-3xl font-black uppercase mb-4">No Partners Available</h3>
            <p className="font-medium text-lg">We are currently onboarding new capital partners. Please check back later.</p>
          </div>
        </div>
      ) : (
        <DirectoryClient initialBrokers={brokers} />
      )}

      <CTASection />
    </div>
  );
}
