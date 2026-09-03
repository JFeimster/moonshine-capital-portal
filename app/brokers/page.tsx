import Link from 'next/link';
import { CTASection } from '@/components/CTASection';
import { getBrokers } from '@/lib/brokers';
import { constructMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Funding Agents',
  description: 'Browse the Distilled Funding network of operating-focused funding agents and capital advisors.',
  path: '/brokers',
});

export default async function BrokersPage() {
  const brokers = await getBrokers();

  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-orange px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6 bg-neo-yellow">Funding agents</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">The advisory network behind the funding decision.</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">
            These advisors help founders understand the lane, qualify the deal, and connect the right opportunity to the right capital path.
          </p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {brokers.slice(0, 9).map((broker) => (
            <div key={broker.slug} className="card-brutal flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-blue">Advisor</div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tighter">{broker.fullName}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center border-2 border-neo-black bg-neo-yellow text-lg font-black">{broker.fullName.charAt(0)}</div>
              </div>

              <p className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-neo-black/70">{broker.agencyName || broker.companyName || 'Funding Advisor'}</p>
              <p className="mb-6 flex-grow text-base font-medium leading-relaxed text-neo-black/80">{broker.shortBio || 'Funding advisor focused on helping founders match the right capital path to the right business reality.'}</p>

              <div className="mt-auto flex flex-wrap gap-2">
                {(broker.fundingTypes || broker.fundingSpecialties || []).slice(0, 3).map((label) => (
                  <span key={label} className="border-2 border-neo-black bg-neo-green px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em]">{label}</span>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link href={`/${broker.slug}`} className="btn-brutal flex-1">View Profile</Link>
                <Link href={`/${broker.slug}`} className="btn-brutal-primary flex-1">Start Funding</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
}
