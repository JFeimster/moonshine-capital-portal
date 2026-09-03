import Link from 'next/link';
import fundingRegistry from '@/data/funding/funding-product-families.registry.json';
import industryRegistry from '@/data/partner-site/industry-pages.registry.json';
import resourceRegistry from '@/data/partner-site/resource-pages.registry.json';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b-4 border-neo-black bg-neo-black px-4 pb-12 pt-9 text-neo-white md:px-6 md:pb-14 md:pt-12 lg:px-8">
      <div className="absolute -right-16 top-0 h-56 w-56 border-4 border-neo-white bg-neo-pink opacity-90 shadow-brutal" />
      <div className="absolute bottom-0 left-0 h-40 w-40 border-4 border-neo-black bg-neo-yellow shadow-brutal" />

      <div className="section-shell relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <span className="eyebrow mb-4 bg-neo-yellow text-neo-black">Capital command desk</span>
            <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.88] tracking-tighter md:text-6xl lg:text-[clamp(3.75rem,6vw,6.75rem)]">
              Find the right funding path.
              <span className="mt-4 block text-neo-yellow">Work with a real advisor.</span>
            </h1>
            <p className="mt-5 max-w-2xl border-l-4 border-neo-blue bg-neo-black/40 pl-4 text-base font-medium leading-relaxed text-neo-cream md:text-lg">
              Start with the deal. Then find the money. Distilled Funding helps founders identify the right capital path and connect with a funding agent who knows the lane.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-brutal-primary text-sm md:text-base">Apply for Funding</Link>
              <Link href="/directory" className="btn-brutal text-sm md:text-base">Find a Funding Agent</Link>
              <Link href="/how-it-works" className="btn-brutal bg-neo-black text-neo-white text-sm md:text-base">See How It Works</Link>
            </div>
          </div>

          <div className="panel-block bg-neo-cream text-neo-black">
            <div className="mb-4 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-neo-black/70"><span>Network signal</span><span className="bg-neo-green px-2 py-1 text-neo-black">Live index</span></div>
            <div className="space-y-3">
              <div>
                <div className="flex items-baseline gap-3"><div className="text-3xl font-black tracking-tighter">01</div><div className="text-xs font-black uppercase tracking-[0.18em] text-neo-black/70">Tell us what you need</div></div>
              </div>
              <div>
                <div className="flex items-baseline gap-3"><div className="text-3xl font-black tracking-tighter">02</div><div className="text-xs font-black uppercase tracking-[0.18em] text-neo-black/70">Match to a capital path</div></div>
              </div>
              <div>
                <div className="flex items-baseline gap-3"><div className="text-3xl font-black tracking-tighter">03</div><div className="text-xs font-black uppercase tracking-[0.18em] text-neo-black/70">Move with a funding agent</div></div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 border-t-2 border-neo-black pt-4 text-center">
              <div><div className="text-xl font-black">{fundingRegistry.entries.length}</div><div className="text-[9px] font-black uppercase tracking-[0.14em]">Funding paths</div></div>
              <div className="border-x-2 border-neo-black"><div className="text-xl font-black">{industryRegistry.entries.length}</div><div className="text-[9px] font-black uppercase tracking-[0.14em]">Industries</div></div>
              <div><div className="text-xl font-black">{resourceRegistry.entries.length}</div><div className="text-[9px] font-black uppercase tracking-[0.14em]">Resources</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
