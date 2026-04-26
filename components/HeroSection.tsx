import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-neo-black text-neo-white border-b-4 border-neo-blue pt-24 pb-32 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neo-pink -translate-y-1/2 translate-x-1/2 border-4 border-neo-white shadow-brutal pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
          Find a funding <br/>
          partner that <br/>
          <span className="text-neo-yellow">actually moves.</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-2xl mb-12 text-neo-cream/90 border-l-4 border-neo-blue pl-6">
          No fluff. No slow banks. Just operators who know how to move money. Built for founders who do not have time for institutional theater.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/directory" className="btn-brutal-primary text-lg px-8 py-4">
            Browse Directory
          </Link>
          <Link href={process.env.NEXT_PUBLIC_MATCH_URL || "/onboarding"} className="btn-brutal-primary bg-neo-yellow text-neo-black border-neo-black text-lg px-8 py-4">
            Get Matched
          </Link>
          <Link href="/onboarding" className="btn-brutal text-lg px-8 py-4">
            Become a Partner
          </Link>
        </div>
      </div>
    </section>
  );
}
