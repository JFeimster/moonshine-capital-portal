import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBrokerBySlug } from '@/lib/brokers';
import { buildTrackedOutUrl } from '@/lib/distribution';
import { constructMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) {
    return constructMetadata({
      title: 'Book a Call',
      description: 'Book a capital conversation with a funding advisor.',
      path: '/directory',
      noindex: true,
    });
  }

  return constructMetadata({
    title: `${broker.fullName} | Book a Call`,
    description: `Book a funding consultation with ${broker.fullName}.`,
    path: `/${broker.slug}/book`,
  });
}

export default async function PartnerBookPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const bookingUrl = broker.bookingUrl ? buildTrackedOutUrl(broker, 'booking', { source: 'partner_booking_page' }) : null;

  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-pink px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6 bg-neo-yellow">Advisor consultation</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Book with {broker.fullName}.</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">
            Use this page to understand the purpose of the call and move forward with the funding conversation in a structured way.
          </p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="panel-block">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">What the call covers</h2>
            <ul className="space-y-4 text-lg font-medium leading-relaxed">
              <li>• Business context and the capital need you are trying to solve.</li>
              <li>• Relevant funding paths and what will likely matter most in review.</li>
              <li>• Whether the intake should move into a deeper application or a narrower lane.</li>
            </ul>
          </div>

          <div className="panel-block bg-neo-black text-neo-white border-neo-white">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-neo-yellow">Next step</h2>
            {bookingUrl ? (
              <>
                <a href={bookingUrl} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Book a Call</a>
                <Link href={`/${broker.slug}/apply`} className="btn-brutal mt-4 block w-full bg-neo-white text-neo-black">Apply Instead</Link>
              </>
            ) : (
              <>
                <p className="mb-4 text-base font-medium leading-relaxed text-neo-white/80">No booking link is currently configured for this advisor, so the best next step is to start the funding intake.</p>
                <Link href={`/${broker.slug}/apply`} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Start the Application</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
