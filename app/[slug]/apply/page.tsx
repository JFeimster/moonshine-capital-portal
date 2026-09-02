import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBrokerBySlug } from '@/lib/brokers';
import { buildPartnerLeadFormUrl, buildTrackedOutUrl } from '@/lib/distribution';
import { constructMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) {
    return constructMetadata({
      title: 'Partner Application',
      description: 'Apply for funding through the Distilled Funding network.',
      path: '/apply',
      noindex: true,
    });
  }

  return constructMetadata({
    title: `${broker.fullName} | Apply`,
    description: `Apply for funding through ${broker.fullName} and the Distilled Funding network.`,
    path: `/${broker.slug}/apply`,
  });
}

export default async function PartnerApplyPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const applyUrl = buildTrackedOutUrl(broker, 'apply', { source: 'partner_apply_page' });
  const leadFormUrl = buildPartnerLeadFormUrl(broker, { source: 'partner_apply_page' });

  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-blue px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link href={`/${broker.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-neo-black hover:text-neo-blue">
            ← Back to {broker.fullName}
          </Link>
          <span className="eyebrow mb-6 bg-neo-yellow">Partner application</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Apply for funding with {broker.fullName}.</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">
            Start with the business fundamentals, funding need, and timeline. The intake is built to keep attribution attached and move the conversation toward the right capital path.
          </p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="panel-block">
              <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">What to expect</h2>
              <ol className="space-y-4 text-lg font-bold leading-relaxed">
                <li>1. Share your business details, funding need, and the deal you want to support.</li>
                <li>2. The intake preserves the referral and partner attribution tied to this advisor.</li>
                <li>3. A funding agent or review team will assess fit and the next step without creating needless friction.</li>
              </ol>
            </div>

            <div className="panel-block">
              <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">Typical info requested</h2>
              <ul className="space-y-3 text-base font-medium leading-relaxed">
                <li>• Business name, contact details, and ownership basics</li>
                <li>• Funding amount and use case</li>
                <li>• Revenue or operating metrics relevant to the request</li>
                <li>• Time sensitivity and the reason the capital is needed</li>
              </ul>
            </div>
          </div>

          <div className="panel-block bg-neo-black text-neo-white border-neo-white">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-neo-yellow">Start the review</h2>
            <div className="space-y-4">
              <a href={leadFormUrl} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Open Funding Intake</a>
              <a href={applyUrl} className="btn-brutal-dark block w-full">Continue to Application</a>
              {broker.bookingUrl && (
                <a href={buildTrackedOutUrl(broker, 'booking', { source: 'partner_apply_page' })} className="btn-brutal block w-full bg-neo-white text-neo-black">Book a Call</a>
              )}
            </div>
            <p className="mt-5 text-sm font-medium leading-relaxed text-neo-white/75">
              Approvals are case-by-case and not guaranteed. The goal is to qualify the path and keep the next move practical.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
