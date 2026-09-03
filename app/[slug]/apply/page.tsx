import { notFound } from 'next/navigation';
import { getBrokerBySlug } from '@/lib/brokers';
import { buildPartnerLeadFormUrl, buildTrackedOutUrl } from '@/lib/distribution';
import { constructMetadata } from '@/lib/seo';
import { getPartnerDisplaySpecialties } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';

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
    noindex: true,
  });
}

export default async function PartnerApplyPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const applyUrl = buildTrackedOutUrl(broker, 'apply', { source: 'partner_apply_page' });
  const leadFormUrl = buildPartnerLeadFormUrl(broker, { source: 'partner_apply_page' });

  const name = broker.displayName || broker.fullName;
  const firstName = name.trim().split(/\s+/)[0];
  const specialties = getPartnerDisplaySpecialties(broker);

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Apply" />
      <section className="border-b-4 border-neo-black bg-neo-blue px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <PartnerBreadcrumbs broker={broker} items={[{ label: 'Apply for Funding' }]} />
          <span className="eyebrow mb-6 bg-neo-yellow">Start your funding request</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Apply for funding with {name}</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">Start with the business fundamentals, funding amount, use of funds, and timing. Your request stays attributed to {name} while moving through the Distilled Funding capital network.</p>
        </div>
      </section>
      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="panel-block">
              <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">What you&apos;ll need</h2>
              <ul className="space-y-3 text-lg font-bold leading-relaxed">
                <li>Business information</li><li>Funding amount</li><li>Use of funds</li><li>Revenue / operating history</li><li>Timeline</li>
              </ul>
            </div>
            <div className="panel-block">
              <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">What happens next</h2>
              <ol className="space-y-4 text-lg font-bold leading-relaxed">
                <li><span className="text-neo-blue">01</span> Submit business fundamentals</li>
                <li><span className="text-neo-blue">02</span> Partner attribution remains attached</li>
                <li><span className="text-neo-blue">03</span> Funding team reviews possible capital paths</li>
                <li><span className="text-neo-blue">04</span> You receive the next practical step</li>
              </ol>
            </div>
          </div>
          <div className="panel-block border-neo-white bg-neo-black text-neo-white">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-neo-yellow">Choose your path</h2>
            <div className="space-y-4">
              <a href={leadFormUrl} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Start Funding Intake</a>
              <a href={applyUrl} className="btn-brutal-dark block w-full">Continue to Application</a>
              {broker.bookingUrl && <a href={`/${broker.slug}/book`} className="btn-brutal block w-full bg-neo-white text-neo-black">Talk to {firstName} First</a>}
            </div>
            {specialties.length > 0 && <p className="mt-5 text-sm font-medium leading-relaxed text-neo-white/75">Your request can include context about {specialties.slice(0, 2).join(' and ').toLowerCase()}.</p>}
            <p className="mt-5 text-sm font-medium leading-relaxed text-neo-white/75">Approvals, terms, and availability are case-by-case and depend on provider underwriting and applicant qualifications.</p>
          </div>
        </div>
      </section>
      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
