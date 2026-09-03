import { HeroSection } from '@/components/HeroSection';
import { BrokerCard } from '@/components/BrokerCard';
import { CTASection } from '@/components/CTASection';
import { SectionHeading } from '@/components/SectionHeading';
import { getFeaturedBrokers } from '@/lib/brokers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredBrokers = await getFeaturedBrokers();

  return (
    <div>
      <HeroSection />

      <section className="py-14 px-4 md:px-6 lg:px-8 bg-neo-white text-neo-black">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Why this directory exists
            </h2>
            <p className="text-lg font-medium border-l-4 border-neo-orange pl-4 mb-5">
              Founders lose weeks pitching to banks that will never say yes. We created Distilled Funding to connect you directly with capital allocators who understand business and underwrite fast.
            </p>
            <ul className="space-y-3 font-bold text-base">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block"></span>
                Vetted operators only
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block"></span>
                No institutional theater
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block"></span>
                Direct access to decision makers
              </li>
            </ul>
          </div>
          <div className="w-full bg-neo-black p-6 shadow-brutal border-4 border-neo-black transform md:rotate-2">
            <div className="text-neo-yellow font-black text-2xl uppercase tracking-widest text-center">
              Cut the Line
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Featured Partners" subtitle="Top Movers" color="pink" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBrokers.map(broker => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
