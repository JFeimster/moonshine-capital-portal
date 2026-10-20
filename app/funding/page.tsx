import type { Metadata } from 'next';
import Link from 'next/link';
import { FundingFamilyCard } from '@/components/FundingFamilyCard';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { ToolGrid } from '@/components/portal/ToolGrid';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { getFundingHubPage, getFundingTools, getPublicProductFamilies } from '@/lib/funding-registry';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFundingHubPage();
  return constructMetadata({
    title: page?.seo.title || 'Business Funding Options | Distilled Funding',
    description: page?.seo.description || 'Explore business funding categories, preparation guides, and next steps.',
    path: page?.seo.canonical || '/funding',
  });
}

export default async function FundingPage() {
  const [page, productFamilies] = await Promise.all([getFundingHubPage(), getPublicProductFamilies()]);
  const tools = await getFundingTools(page?.dataRefs?.featuredToolIds);
  const title = page?.hero.headline || 'Explore funding options by business need.';
  const description = page?.hero.subheadline || 'Review common uses, preparation points, and qualification guides before choosing a next step.';
  const disclaimer = page?.compliance?.disclaimer || 'Funding availability, terms, and eligibility vary by provider and applicant profile. Registry guide values are informational; no approval or funding outcome is guaranteed.';
  const origin = SITE_CONFIG.canonicalOrigin;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${origin}/funding`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: productFamilies.map((family, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: family.publicName || family.name,
        url: `${origin}/funding/${family.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-9 text-neo-white md:px-6 md:py-11 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Funding' }]} />
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <span className="eyebrow mb-3 bg-neo-yellow text-neo-black">Funding options</span>
              <h1 className="max-w-4xl text-[clamp(2.4rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">{title}</h1>
              <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link>
              <Link href="/directory" className="btn-brutal bg-neo-white text-neo-black">Browse Advisors</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-9 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-4 border-neo-black pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Choose by use case</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight md:text-3xl">Business funding categories</h2>
          </div>
          <span className="text-xs font-bold text-neo-black/65">Category information is educational.</span>
        </div>
        {productFamilies.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productFamilies.map((family) => <FundingFamilyCard key={family.id} family={family} />)}
          </div>
        ) : (
          <div className="border-4 border-neo-black bg-neo-cream p-8 shadow-brutal">
            <h2 className="text-2xl font-black uppercase">Funding categories are being updated</h2>
            <p className="mt-2 font-medium">You can still start an intake or browse advisor profiles.</p>
          </div>
        )}
      </section>

      <section className="border-y-4 border-neo-black bg-neo-cream">
        <div className="section-shell grid gap-8 py-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-11">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Before you apply</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">Prepare the business context</h2>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed">A clear use of funds, recent business financial information, existing obligations, and relevant purchase or project details can help make the first conversation more useful.</p>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            <Link href="/resources/funding-readiness" className="border-2 border-neo-black bg-neo-white px-4 py-3 text-sm font-black uppercase shadow-[2px_2px_0_0_#111] hover:bg-neo-yellow">Funding readiness guide</Link>
            <Link href="/resources/document-checklist" className="border-2 border-neo-black bg-neo-white px-4 py-3 text-sm font-black uppercase shadow-[2px_2px_0_0_#111] hover:bg-neo-yellow">Document checklist</Link>
            <Link href="/resources/offer-comparison" className="border-2 border-neo-black bg-neo-white px-4 py-3 text-sm font-black uppercase shadow-[2px_2px_0_0_#111] hover:bg-neo-yellow">Compare offers</Link>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="section-shell py-9 md:py-12">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Registered tools</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight md:text-3xl">Public tools and resources</h2>
          </div>
          <ToolGrid tools={tools} useTrackedPrimaryActions showDetails={false} />
          <Link href="/tools" className="mt-5 inline-flex text-sm font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">Browse all public tools →</Link>
        </section>
      )}

      <section className="section-shell pb-10">
        <div className="border-t-2 border-neo-black/20 pt-5 text-xs leading-relaxed text-neo-black/65">
          <strong className="font-black uppercase">Funding information:</strong> {disclaimer}
        </div>
      </section>
    </main>
  );
}
