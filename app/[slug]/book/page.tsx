import { notFound } from 'next/navigation';
import { getBrokerBySlug } from '@/lib/brokers';
import { buildTrackedOutUrl } from '@/lib/distribution';
import { getPartnerContactActions, getPartnerDisplaySpecialties } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) {
    return constructMetadata({
      title: 'Book a Call',
      description: 'Book a capital conversation with a funding advisor.',
      path: '/book',
      noindex: true,
    });
  }

  return constructMetadata({
    title: `${broker.fullName} | Book a Call`,
    description: `Book a funding consultation with ${broker.fullName}.`,
    path: `/${broker.slug}/book`,
    noindex: true,
  });
}

export default async function PartnerBookPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const bookingUrl = broker.bookingUrl ? buildTrackedOutUrl(broker, 'booking', { source: 'partner_booking_page' }) : null;
  const name = broker.displayName || broker.fullName;
  const firstName = name.trim().split(/\s+/)[0];
  const specialties = getPartnerDisplaySpecialties(broker);
  const contactActions = getPartnerContactActions(broker).filter((action) => action.kind !== 'booking');

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Book" />
      <section className="border-b-4 border-neo-black bg-neo-pink px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <PartnerBreadcrumbs broker={broker} items={[{ label: 'Book a Call' }]} />
          <span className="eyebrow mb-6 bg-neo-yellow">Funding consultation</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Talk capital with {name}</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">Talk through {specialties.length ? `${specialties.slice(0, 2).join(', ').toLowerCase()}, ` : ''}your funding need, timing, and available paths with {firstName}.</p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="panel-block">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">What the call covers</h2>
            <ul className="space-y-4 text-lg font-medium leading-relaxed">
              <li>Business context</li><li>Capital need</li><li>Timing</li><li>Likely documentation</li><li>Relevant funding paths</li><li>Best next step</li>
            </ul>
          </div>

          <div className="panel-block bg-neo-black text-neo-white border-neo-white">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-neo-yellow">Next step</h2>
            {bookingUrl ? (
              <>
                <a href={bookingUrl} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Book with {firstName}</a>
                <a href={`/${broker.slug}/apply`} className="btn-brutal mt-4 block w-full bg-neo-white text-neo-black">Start the Funding Request</a>
              </>
            ) : (
              <>
                <p className="mb-4 text-base font-medium leading-relaxed text-neo-white/80">No booking link is currently configured for this advisor. Start the funding request to move forward.</p>
                <a href={`/${broker.slug}/apply`} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Start the Funding Request</a>
              </>
            )}
            {contactActions.length > 0 && <div className="mt-6 border-t-2 border-neo-white/30 pt-5 text-sm font-bold">{contactActions.map((action) => <a key={action.kind} href={action.kind === 'website' ? buildTrackedOutUrl(broker, action.kind, { source: 'partner_booking_page' }) : action.href} className="mr-4 inline-block text-neo-white hover:text-neo-yellow">{action.kind[0].toUpperCase() + action.kind.slice(1)}</a>)}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
