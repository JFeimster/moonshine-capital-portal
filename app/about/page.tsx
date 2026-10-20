import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'About Distilled Funding',
  description: 'Learn how to use the funding category guides, preparation resources, and public advisor directory.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-blue px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <div className="section-shell">
          <span className="eyebrow mb-4 bg-neo-yellow">About this portal</span>
          <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">A clearer place to start a funding conversation.</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed md:text-lg">
            Distilled Funding organizes broad business funding categories, preparation resources, and public advisor profiles so owners can review the next steps for a capital request.
          </p>
        </div>
      </section>

      <section className="section-shell grid gap-4 py-8 md:grid-cols-3 md:py-10">
        <article className="panel-block">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">01 · Explore</p>
          <h2 className="mt-3 text-xl font-black uppercase tracking-tight">Review funding categories</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed">Compare common uses, preparation points, and qualification guides. Category information does not promise a product or approval.</p>
          <Link href="/funding" className="mt-4 inline-flex text-xs font-black uppercase underline decoration-neo-yellow decoration-2 underline-offset-4">Browse funding →</Link>
        </article>
        <article className="panel-block">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-pink">02 · Prepare</p>
          <h2 className="mt-3 text-xl font-black uppercase tracking-tight">Gather useful details</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed">Use checklists and guides to organize the use of funds, business information, existing obligations, and relevant documents.</p>
          <Link href="/resources" className="mt-4 inline-flex text-xs font-black uppercase underline decoration-neo-green decoration-2 underline-offset-4">Open resources →</Link>
        </article>
        <article className="panel-block">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-green">03 · Connect</p>
          <h2 className="mt-3 text-xl font-black uppercase tracking-tight">Browse advisor profiles</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed">Review the information and contact options shown on each public profile. You can also begin with the general funding intake.</p>
          <Link href="/directory" className="mt-4 inline-flex text-xs font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">Open directory →</Link>
        </article>
      </section>

      <section className="border-y-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-green">Decision boundary</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">Providers make funding decisions.</h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-neo-white/80">Eligibility, approval, funding availability, and terms depend on the provider, the applicant, documentation, and review. The portal provides general information and intake paths.</p>
          </div>
          <Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link>
        </div>
      </section>
    </main>
  );
}
