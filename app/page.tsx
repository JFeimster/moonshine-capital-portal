import Link from 'next/link';
import type { PartnerResourcePage } from '@/lib/partner-site';
import { HeroSection } from '@/components/HeroSection';
import { BrokerCard } from '@/components/BrokerCard';
import { CTASection } from '@/components/CTASection';
import { getFeaturedBrokers } from '@/lib/brokers';
import { getPartnerResourceSummary, listStructuredPartnerResources } from '@/lib/partner-site';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredBrokers = await getFeaturedBrokers();
  const resourcesBySlug = new Map<string, PartnerResourcePage>(listStructuredPartnerResources().map((resource) => [resource.slug, resource]));
  const preparationResources = ['funding-readiness', 'document-checklist', 'cash-flow-preparation', 'offer-comparison']
    .map((slug) => resourcesBySlug.get(slug))
    .filter((resource): resource is PartnerResourcePage => resource !== undefined);

  return (
    <main>
      <HeroSection />

      <section className="section-shell py-9 md:py-11">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-4 border-neo-black pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Preparation library</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight md:text-3xl">Get ready for the funding conversation</h2>
          </div>
          <Link href="/resources" className="text-xs font-black uppercase underline decoration-neo-pink decoration-2 underline-offset-4">All resources →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {preparationResources.map((resource) => (
            <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group flex h-full flex-col border-[3px] border-neo-black bg-neo-cream p-4 shadow-brutal transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-neo-blue">{resource.resourceType}</span>
              <h3 className="mt-2 text-lg font-black uppercase leading-tight">{resource.title}</h3>
              <p className="mt-2 flex-1 line-clamp-3 text-sm font-medium leading-relaxed text-neo-black/75">{getPartnerResourceSummary(resource)}</p>
              <span className="mt-4 text-xs font-black uppercase underline decoration-neo-green decoration-2 underline-offset-4 group-hover:text-neo-blue">Open guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y-4 border-neo-black bg-neo-cream">
        <div className="section-shell py-9 md:py-11">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-4 border-neo-black pb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Advisor profiles</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-tight md:text-3xl">Featured advisors</h2>
            </div>
            <Link href="/directory" className="text-xs font-black uppercase underline decoration-neo-green decoration-2 underline-offset-4">Browse directory →</Link>
          </div>

          {featuredBrokers.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredBrokers.slice(0, 3).map((broker) => <BrokerCard key={broker.id} broker={broker} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4 border-2 border-neo-black bg-neo-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">No advisor profiles are currently marked as featured. Browse the public directory to see available profiles.</p>
              <Link href="/directory" className="btn-brutal-primary shrink-0">Browse Advisors</Link>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </main>
  );
}
