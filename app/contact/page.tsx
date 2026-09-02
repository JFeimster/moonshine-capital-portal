import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Contact',
  description: 'Contact Distilled Funding about partner discovery, funding intake, and capital questions.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-pink px-6 py-16 text-neo-black md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6 bg-neo-yellow">Contact</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Talk to the capital desk.</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">
            Use the intake to start the funding conversation or reach out directly if you want to understand the right path before applying.
          </p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel-block">
            <h2 className="mb-6 text-3xl font-black uppercase tracking-tighter">Reach the right team</h2>
            <div className="space-y-5 text-base font-medium leading-relaxed">
              <p>Start with the funding intake if you want the fastest path to review. If you have a specific question or are not sure which funding lane fits, contact the network and we will point you toward the right option.</p>
              <p>We can help with capital fit questions, funding agent connections, and initial route qualification before a formal application begins.</p>
            </div>
          </div>

          <div className="panel-block bg-neo-black text-neo-white border-neo-white">
            <h2 className="mb-6 text-3xl font-black uppercase tracking-tighter text-neo-yellow">Start Now</h2>
            <div className="space-y-4 text-sm font-bold uppercase tracking-[0.12em]">
              <Link href="/apply" className="block border-b border-neo-white/20 pb-3 text-neo-white hover:text-neo-green">Apply for Funding</Link>
              <Link href="/directory" className="block border-b border-neo-white/20 pb-3 text-neo-white hover:text-neo-green">Find an Advisor</Link>
              <Link href="/faq" className="block text-neo-white hover:text-neo-green">Read the FAQ</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
