import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { buildTrackedOutUrl } from '@/lib/distribution';
import { getPartnerContactActions } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) return { title: 'Contact Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({
    slug: broker.slug,
    partnerName: broker.displayName || broker.fullName,
    companyName: broker.companyName || broker.agencyName,
    description: `Contact ${broker.fullName} for funding questions and next steps.`, path: '/contact', pageTitle: 'Contact',
  });
}

export default async function PartnerContactPage({ params }: { params: { slug: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const name = broker.displayName || broker.fullName;
  const contactActions = getPartnerContactActions(broker);

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="About" />

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Contact' }]} />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="border-4 border-neo-black bg-neo-yellow p-6 shadow-brutal">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-neo-black/70">Contact your funding agent</div>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-6xl">Contact {name}</h1>
            <p className="mt-4 max-w-2xl text-lg font-bold leading-relaxed">Reach out to discuss the business, the funding need, and the next practical move.</p>
          </div>

          <div className="border-4 border-neo-black bg-neo-black p-6 text-neo-white shadow-brutal">
              <h2 className="text-xl font-black uppercase tracking-tighter text-neo-yellow">Contact options</h2>
            <div className="mt-4 space-y-3 text-sm font-bold">
                <a href={`/${broker.slug}/apply`} className="block text-neo-green hover:text-neo-yellow">Apply for funding</a>
                {contactActions.filter((action) => action.kind !== 'booking').map((action) => <a key={action.kind} href={action.kind === 'website' ? buildTrackedOutUrl(broker, action.kind, { source: 'partner_contact_page' }) : action.href} className="block text-neo-white hover:text-neo-yellow">{action.kind[0].toUpperCase() + action.kind.slice(1)}</a>)}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <PartnerCTACluster broker={broker} primaryLabel="Apply for Funding" secondaryLabel={`Book with ${name}`} />
        </div>
      </section>

      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
