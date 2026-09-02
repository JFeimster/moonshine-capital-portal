import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b-4 border-neo-black bg-neo-black px-6 pb-16 pt-12 text-neo-white md:px-8 md:pt-16 lg:px-12 lg:pb-20">
      <div className="absolute -right-16 top-0 h-56 w-56 border-4 border-neo-white bg-neo-pink opacity-90 shadow-brutal" />
      <div className="absolute bottom-0 left-0 h-40 w-40 border-4 border-neo-black bg-neo-yellow shadow-brutal" />

      <div className="section-shell relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="eyebrow mb-6 bg-neo-yellow text-neo-black">Capital command desk</span>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl lg:text-8xl">
              Find the right funding path.
              <span className="mt-4 block text-neo-yellow">Work with a real advisor.</span>
            </h1>
            <p className="mt-6 max-w-2xl border-l-4 border-neo-blue bg-neo-black/40 pl-5 text-lg font-medium leading-relaxed text-neo-cream md:text-xl">
              Start with the deal. Then find the money. Distilled Funding helps founders identify the right capital path and connect with a funding agent who knows the lane.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/apply" className="btn-brutal-primary text-sm md:text-base">Apply for Funding</Link>
              <Link href="/directory" className="btn-brutal text-sm md:text-base">Find a Funding Agent</Link>
              <Link href="/how-it-works" className="btn-brutal bg-neo-black text-neo-white text-sm md:text-base">See How It Works</Link>
            </div>
          </div>

          <div className="panel-block bg-neo-cream text-neo-black">
            <div className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-neo-black/70">Network signal</div>
            <div className="space-y-5">
              <div>
                <div className="text-4xl font-black tracking-tighter">01</div>
                <div className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-neo-black/70">Tell us what you need</div>
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter">02</div>
                <div className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-neo-black/70">Match to a path</div>
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter">03</div>
                <div className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-neo-black/70">Move with a funding agent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
