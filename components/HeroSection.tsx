import Link from 'next/link';
import fundingRegistry from '@/data/funding/funding-product-families.registry.json';
import industryRegistry from '@/data/partner-site/industry-pages.registry.json';
import resourceRegistry from '@/data/partner-site/resource-pages.registry.json';

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b-4 border-neo-black bg-neo-black py-10 text-neo-white md:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-0 h-36 w-36 border-4 border-neo-white bg-neo-pink md:h-44 md:w-44" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 border-4 border-neo-black bg-neo-yellow md:h-36 md:w-36" />
      <div className="section-shell relative z-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-10">
          <div className="min-w-0">
            <span className="eyebrow mb-4">Capital command desk</span>
            <h1 className="max-w-[19ch] text-[clamp(2.65rem,4.25vw,4.5rem)] font-black uppercase leading-[.98] tracking-[-0.04em]">
              Find the right funding path.
              <span className="mt-2 block text-neo-yellow">Work with a real advisor.</span>
            </h1>
            <p className="mt-5 max-w-xl border-l-4 border-neo-blue pl-4 text-base font-medium leading-relaxed text-neo-cream md:text-lg">
              Start with your capital need. Explore funding options, prepare your business, and connect with someone who can help you navigate the process.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/apply" className="btn-brutal-primary px-5 py-3 text-xs sm:text-sm">Apply for Funding</Link>
              <Link href="/directory" className="btn-brutal px-5 py-3 text-xs sm:text-sm">Explore Directory</Link>
            </div>
            <Link href="/how-it-works" className="mt-4 inline-flex text-xs font-black uppercase tracking-wider text-neo-white underline decoration-neo-green decoration-2 underline-offset-4 hover:text-neo-yellow">See how it works →</Link>
          </div>
          <aside className="panel-block relative z-10 mt-1 bg-neo-cream text-neo-black lg:mt-10" aria-label="Funding platform overview">
            <div className="mb-4 flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.14em]"><span>Your next move</span><span className="bg-neo-green px-2 py-1">3 steps</span></div>
            <ol className="space-y-3">
              <li className="flex items-baseline gap-3"><strong className="text-2xl">01</strong><span className="text-xs font-black uppercase tracking-[0.1em]">Tell us what you need</span></li>
              <li className="flex items-baseline gap-3"><strong className="text-2xl">02</strong><span className="text-xs font-black uppercase tracking-[0.1em]">Explore suitable capital paths</span></li>
              <li className="flex items-baseline gap-3"><strong className="text-2xl">03</strong><span className="text-xs font-black uppercase tracking-[0.1em]">Take the next step</span></li>
            </ol>
            <div className="mt-5 grid grid-cols-3 border-t-2 border-neo-black pt-4 text-center">
              <div><div className="text-xl font-black">{fundingRegistry.entries.length}</div><div className="text-[10px] font-bold uppercase">Funding paths</div></div>
              <div className="border-x-2 border-neo-black"><div className="text-xl font-black">{industryRegistry.entries.length}</div><div className="text-[10px] font-bold uppercase">Industries</div></div>
              <div><div className="text-xl font-black">{resourceRegistry.entries.length}</div><div className="text-[10px] font-bold uppercase">Resources</div></div>
            </div>
            <p className="mt-3 text-[11px] font-medium text-neo-black/70">Catalog counts, not real-time funding activity.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
