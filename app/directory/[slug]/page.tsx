import { getBrokerBySlug, getBrokers } from '@/lib/brokers';
import { ProfileHero } from '@/components/ProfileHero';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/CTASection';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate at most every hour

export async function generateStaticParams() {
  const brokers = await getBrokers();
  return brokers.map((broker) => ({
    slug: broker.slug,
  }));
}

export default async function BrokerProfilePage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);

  if (!broker) {
    notFound();
  }

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <Link href="/directory" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-neo-blue transition-colors mb-8">
          <span className="text-xl leading-none">&larr;</span> Back to Directory
        </Link>

        <ProfileHero broker={broker} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <SectionHeading title="About" color="blue" />
              <div className="bg-neo-cream p-8 border-4 border-neo-black shadow-brutal text-lg font-medium leading-relaxed">
                {broker.whyChooseYou}
              </div>
            </section>

            <section>
              <SectionHeading title="Short Bio" color="yellow" />
              <p className="text-xl font-bold border-l-4 border-neo-black pl-6">
                {broker.shortBio}
              </p>
            </section>
          </div>

          <div className="space-y-12">
            <div className="bg-neo-black text-neo-white p-8 border-4 border-neo-green shadow-brutal">
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-6 text-neo-green">Specialties</h3>
              <ul className="space-y-3">
                {broker.fundingSpecialties.map(spec => (
                  <li key={spec} className="flex items-center gap-3 font-bold text-lg">
                    <span className="w-3 h-3 bg-neo-white inline-block"></span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neo-cream p-8 border-4 border-neo-black shadow-brutal">
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-6">Contact</h3>
              <div className="space-y-4 font-bold">
                {broker.publicEmail && (
                  <div>
                    <div className="text-sm uppercase text-neo-black/60 mb-1">Email</div>
                    <a href={`mailto:${broker.publicEmail}`} className="text-neo-blue hover:underline break-all">
                      {broker.publicEmail}
                    </a>
                  </div>
                )}
                {broker.phoneNumber && (
                  <div>
                    <div className="text-sm uppercase text-neo-black/60 mb-1">Phone</div>
                    <a href={`tel:${broker.phoneNumber}`} className="hover:underline">
                      {broker.phoneNumber}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
}
