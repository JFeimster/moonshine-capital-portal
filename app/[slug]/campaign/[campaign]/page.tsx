import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBrokerBySlug } from '@/lib/brokers';
import { getPartnerCampaign, listPartnerCampaigns } from '@/lib/partner-site';
import { PartnerBreadcrumbs, PartnerCTACluster, PartnerIdentityStrip, PartnerSiteFooter, PartnerSiteHeader } from '@/components/partner-site';
import { constructPartnerMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  return listPartnerCampaigns().map((campaign) => ({ campaign: campaign.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string; campaign: string } }): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug);
  const campaign = getPartnerCampaign(params.campaign);
  if (!broker || !campaign) return { title: 'Solution Not Found', robots: { index: false, follow: false } };
  return constructPartnerMetadata({ slug: broker.slug, partnerName: broker.displayName || broker.fullName, companyName: broker.companyName || broker.agencyName, description: `${campaign.eyebrow} for ${broker.fullName}.` });
}

export default async function PartnerSolutionDetailPage({ params }: { params: { slug: string; campaign: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  const campaign = getPartnerCampaign(params.campaign);
  if (!broker || !campaign) notFound();

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <PartnerIdentityStrip broker={broker} />
      <PartnerSiteHeader broker={broker} active="Solutions" />
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <PartnerBreadcrumbs broker={broker} items={[{ label: 'Solutions', href: `/${broker.slug}/campaign` }, { label: campaign.eyebrow }]} />
        <div className="border-4 border-neo-black bg-neo-yellow p-6 shadow-brutal">
          <div className="text-xs font-black uppercase tracking-[0.2em]">{campaign.eyebrow}</div>
          <h1 className="mt-3 max-w-4xl text-4xl font-black uppercase tracking-tighter md:text-6xl">{campaign.headline}</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed">{campaign.summary}</p>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.7fr]">
          <div className="border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
            <h2 className="text-2xl font-black uppercase tracking-tighter">What this solution can support</h2>
            <ul className="mt-4 space-y-3 font-medium">{campaign.useCases.map((useCase) => <li key={useCase} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 bg-neo-blue" />{useCase}</li>)}</ul>
          </div>
          <aside className="border-4 border-neo-black bg-neo-black p-6 text-neo-white shadow-brutal">
            <h2 className="text-xl font-black uppercase text-neo-green">Take the next step</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-neo-white/80">Your funding advisor can help map the use case to the right capital path.</p>
            <div className="mt-6"><PartnerCTACluster broker={broker} primaryLabel={campaign.primaryCtaLabel} secondaryLabel={`Book with ${broker.displayName || broker.fullName}`} /></div>
          </aside>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">{campaign.fundingSlugs.map((slug) => <Link key={slug} href={`/${broker.slug}/funding/${slug}`} className="border-2 border-neo-black bg-neo-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] hover:bg-neo-green">{slug.replace(/-/g, ' ')}</Link>)}</div>
      </section>
      <PartnerSiteFooter broker={broker} />
    </main>
  );
}
