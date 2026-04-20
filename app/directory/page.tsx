import { getBrokers } from '@/lib/brokers';
import { DirectoryClient } from '@/components/DirectoryClient';
import { CTASection } from '@/components/CTASection';

export const revalidate = 3600; // ISR for 1 hour

export default async function DirectoryPage() {
  const brokers = await getBrokers();

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="bg-neo-black text-neo-white py-16 px-6 md:px-12 border-b-4 border-neo-green">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Partner Directory</h1>
          <p className="text-xl md:text-2xl font-medium text-neo-cream/90 max-w-2xl">
            Find the right capital partner for your next move.
          </p>
        </div>
      </div>

      <DirectoryClient initialBrokers={brokers} />

      <CTASection />
    </div>
  );
}
