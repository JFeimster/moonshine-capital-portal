import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'About',
  description: 'Learn how Distilled Funding connects founders with real funding advisors and practical capital paths.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-blue px-6 py-16 text-neo-black md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6 bg-neo-yellow">About the network</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Built for founders who need a real path to capital.</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">
            Distilled Funding is a capital network built to cut through noise, make the route clear, and connect businesses with funding agents who understand operating reality.
          </p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="panel-block">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-neo-blue">01</div>
            <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter">No theater</h2>
            <p className="text-base font-medium leading-relaxed">We do not waste time with generic startup language or finance filler. We focus on the actual business need and the realistic funding path.</p>
          </div>
          <div className="panel-block">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-neo-pink">02</div>
            <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter">Direct access</h2>
            <p className="text-base font-medium leading-relaxed">The network connects operators with funding agents, people who can read a deal, explain the lane, and help keep the process moving.</p>
          </div>
          <div className="panel-block">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-neo-green">03</div>
            <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter">Clear next steps</h2>
            <p className="text-base font-medium leading-relaxed">The point is not to chase endless options. It is to find the right option, with the right partner, and move without confusion.</p>
          </div>
        </div>
      </section>

      <section className="bg-neo-black px-6 py-16 text-neo-white md:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-black uppercase tracking-tighter md:text-5xl">The goal is practical financing clarity.</h2>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-neo-white/80">
            Whether the business needs working capital, acquisition financing, equipment support, or a strategic capital conversation, the network is designed to surface the right path without making the founder perform a second job as a banker.
          </p>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="flex flex-col gap-6 rounded-none border-4 border-neo-black bg-neo-cream p-8 shadow-brutal md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neo-blue">Start here</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tighter">Find the right funding lane.</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/directory" className="btn-brutal-primary">Find an Advisor</Link>
            <Link href="/apply" className="btn-brutal">Apply for Funding</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
