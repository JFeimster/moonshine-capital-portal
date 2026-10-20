import Link from 'next/link';
import { getPublicProductFamilies } from '@/lib/funding-registry';

export async function HeroSection() {
  const families = (await getPublicProductFamilies()).slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden border-b-4 border-neo-black bg-neo-black px-4 py-9 text-neo-white md:px-6 md:py-11 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-0 h-32 w-32 border-4 border-neo-white bg-neo-pink md:h-40 md:w-40" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 border-4 border-neo-black bg-neo-yellow md:h-32 md:w-32" />
      <div className="section-shell relative z-10">
        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:gap-9">
          <div className="min-w-0">
            <span className="eyebrow mb-3 bg-neo-yellow text-neo-black">Business funding, with a human next step</span>
            <h1 className="max-w-[18ch] text-[clamp(2.65rem,4.5vw,4.4rem)] font-black uppercase leading-[.94] tracking-[-0.05em]">
              Find your funding path.
              <span className="mt-2 block text-neo-yellow">Talk to a real advisor.</span>
            </h1>
            <p className="mt-4 max-w-2xl border-l-4 border-neo-blue pl-4 text-base font-medium leading-relaxed text-neo-cream md:text-lg">
              Start with the business need, review broad funding categories, and connect with an advisor when you are ready. Providers determine availability, terms, and approval.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/apply/quote" className="btn-brutal-primary px-5 py-3 text-xs sm:text-sm">Start Funding Intake</Link>
              <Link href="/funding" className="btn-brutal px-5 py-3 text-xs sm:text-sm">Explore Funding</Link>
              <Link href="/directory" className="inline-flex px-2 py-3 text-xs font-black uppercase tracking-[0.12em] text-neo-white underline decoration-neo-green decoration-2 underline-offset-4 hover:text-neo-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-neo-blue">Find an Advisor</Link>
            </div>
          </div>

          <aside className="panel-block bg-neo-cream text-neo-black" aria-label="Funding categories to explore">
            <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-neo-black pb-3">
              <h2 className="text-sm font-black uppercase tracking-[0.12em]">Start with the capital need</h2>
              <Link href="/funding" className="text-[10px] font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-2">All options →</Link>
            </div>
            <div className="divide-y-2 divide-neo-black/15">
              {families.map((family, index) => (
                <Link key={family.id} href={`/funding/${family.slug}`} className="group flex items-start gap-3 py-3 first:pt-1 last:pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neo-blue">
                  <span className="text-xl font-black tracking-tight text-neo-blue">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black uppercase tracking-[0.06em] group-hover:text-neo-blue">{family.publicName || family.name}</span>
                    <span className="mt-1 block text-xs font-medium leading-relaxed text-neo-black/70 line-clamp-2">{family.commonUseCases.slice(0, 2).join(' · ') || family.summary}</span>
                  </span>
                  <span aria-hidden="true" className="mt-1 font-black">→</span>
                </Link>
              ))}
              {families.length === 0 && <p className="py-2 text-sm font-medium">Review funding options or start an intake to discuss your request.</p>}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 border-t-2 border-neo-black pt-3 text-[10px] font-black uppercase tracking-[0.12em]">
              <Link href="/resources" className="underline decoration-neo-pink decoration-2 underline-offset-2 hover:text-neo-blue">Prepare your documents</Link>
              <Link href="/how-it-works" className="underline decoration-neo-green decoration-2 underline-offset-2 hover:text-neo-blue">How the process works</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
