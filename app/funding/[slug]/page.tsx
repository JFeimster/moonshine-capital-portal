import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { ToolGrid } from '@/components/portal/ToolGrid';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import {
  getFundingPageForFamily,
  getFundingTools,
  getProductFamilyBySlug,
  getPublicProductFamilies,
} from '@/lib/funding-registry';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const families = await getPublicProductFamilies();
  return families.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const family = await getProductFamilyBySlug(params.slug);
  if (!family) return constructMetadata({ title: 'Funding Option Not Found', noindex: true });
  const page = await getFundingPageForFamily(params.slug);
  return constructMetadata({
    title: page?.seo?.title || `${family.publicName || family.name} | Distilled Funding`,
    description: page?.seo?.description || family.summary,
    path: family.route || `/funding/${family.slug}`,
  });
}

export default async function FundingLanePage({ params }: PageProps) {
  const family = await getProductFamilyBySlug(params.slug);
  if (!family) notFound();

  const page = await getFundingPageForFamily(params.slug);
  const toolIds = page?.dataRefs?.featuredToolIds?.length ? page.dataRefs.featuredToolIds : family.relatedToolIds;
  const tools = toolIds.length ? await getFundingTools(toolIds) : [];
  const name = family.publicName || family.name;
  const title = page?.hero?.headline || name;
  const description = page?.hero?.subheadline || family.summary;
  const primaryCta = page?.hero?.primaryCta || family.primaryCta;
  const secondaryCta = page?.hero?.secondaryCta;
  const disclaimer = page?.compliance?.disclaimer || 'Funding availability, terms, and eligibility vary by provider, applicant profile, documentation, and underwriting review. No approval or funding outcome is guaranteed.';
  const origin = SITE_CONFIG.canonicalOrigin;
  const canonical = `${origin}/funding/${family.slug}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonical,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Funding', item: `${origin}/funding` },
        { '@type': 'ListItem', position: 3, name, item: canonical },
      ],
    },
  ];
  const guideNotes = [
    family.qualificationSignals?.minCreditScoreGuide !== undefined
      ? `Credit score guide: ${family.qualificationSignals.minCreditScoreGuide}+`
      : null,
    family.qualificationSignals?.minMonthlyRevenueGuide !== undefined
      ? `Monthly revenue guide: $${family.qualificationSignals.minMonthlyRevenueGuide.toLocaleString()}`
      : null,
    family.qualificationSignals?.minTimeInBusinessMonthsGuide !== undefined
      ? `Time in business guide: ${family.qualificationSignals.minTimeInBusinessMonthsGuide} months`
      : null,
    family.qualificationSignals?.creditTier?.length
      ? `Credit profiles listed: ${family.qualificationSignals.creditTier.join(', ')}`
      : null,
  ].filter(Boolean) as string[];
  const preparationNotes = Array.from(new Set(family.requiredDocuments || []));
  const cautions = Array.from(new Set([...(family.avoidWhen || []), ...(family.fastDisqualifiers || [])]));

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      {schema.map((item, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Funding', href: '/funding' }, { label: name }]} />
          <p className="eyebrow mb-3 bg-neo-yellow text-neo-black">{page?.hero?.eyebrow || 'Funding category'}</p>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-[clamp(2.4rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">{name}</h1>
              <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {primaryCta?.href && <a href={primaryCta.href} target="_blank" rel="noopener noreferrer" className="btn-brutal-primary">{primaryCta.label}</a>}
              {secondaryCta?.href && <a href={secondaryCta.href} target="_blank" rel="noopener noreferrer" className="btn-brutal bg-neo-white text-neo-black">{secondaryCta.label}</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-5 py-8 md:grid-cols-2 md:py-10">
        <article className="border-[3px] border-neo-black bg-neo-cream p-5 shadow-brutal md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Potential fit</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Who may consider this</h2>
          {family.bestFitBorrower.length ? (
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed">
              {family.bestFitBorrower.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-neo-green" />{item}</li>)}
            </ul>
          ) : <p className="mt-3 text-sm">Fit depends on the business, use of funds, repayment plan, and provider review.</p>}
          {family.commonUseCases.length > 0 && (
            <div className="mt-5 border-t-2 border-neo-black/15 pt-4">
              <h3 className="text-xs font-black uppercase tracking-[0.14em]">Common uses</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {family.commonUseCases.map((item) => <li key={item} className="border border-neo-black/40 bg-neo-white px-2.5 py-1.5 text-xs font-semibold">{item}</li>)}
              </ul>
            </div>
          )}
        </article>

        <article className="border-[3px] border-neo-black bg-neo-white p-5 shadow-brutal md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Qualification context</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">What providers may review</h2>
          {guideNotes.length ? (
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed">
              {guideNotes.map((item) => <li key={item} className="border-b border-neo-black/15 pb-2">{item}</li>)}
            </ul>
          ) : <p className="mt-3 text-sm font-medium">Specific requirements are not listed for this category. They vary by provider and applicant profile.</p>}
          <p className="mt-3 text-xs font-semibold text-neo-black/65">Registry guide values are informational and are not approval criteria.</p>
        </article>

        {preparationNotes.length > 0 && (
          <article className="border-[3px] border-neo-black bg-neo-green p-5 shadow-brutal md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em]">Preparation</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Documents to have ready</h2>
            <ul className="mt-4 space-y-2 text-sm font-semibold leading-relaxed">
              {preparationNotes.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 border border-neo-black" />{item}</li>)}
            </ul>
          </article>
        )}

        {cautions.length > 0 && (
          <article className="border-[3px] border-neo-black bg-neo-pink p-5 shadow-brutal md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em]">Tradeoffs and restrictions</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Check these points first</h2>
            <ul className="mt-4 space-y-2 text-sm font-semibold leading-relaxed">
              {cautions.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-neo-black" />{item}</li>)}
            </ul>
          </article>
        )}
      </section>

      <section className="border-y-4 border-neo-black bg-neo-cream">
        <div className="section-shell flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Next step</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">Discuss the request with an advisor</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium">A category can help frame the conversation. A provider determines whether a specific product and terms are available.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link>
            <Link href="/directory" className="btn-brutal">Browse Advisors</Link>
          </div>
        </div>
      </section>

      {tools.length > 0 ? (
        <section className="section-shell py-8 md:py-10">
          <h2 className="mb-5 text-2xl font-black uppercase tracking-tight">Related tools and resources</h2>
          <ToolGrid tools={tools} useTrackedPrimaryActions showDetails={false} />
        </section>
      ) : (
        <section className="section-shell py-8 md:py-10">
          <Link href="/tools" className="inline-flex border-2 border-neo-black bg-neo-yellow px-4 py-3 text-sm font-black uppercase shadow-[3px_3px_0_0_#111] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Browse public tools and resources →</Link>
        </section>
      )}

      <section className="section-shell pb-8 md:pb-10">
        <div className="border-t-2 border-neo-black/20 pt-5 text-xs leading-relaxed text-neo-black/65">
          <strong className="font-black uppercase">Funding information:</strong> {disclaimer}
        </div>
      </section>
    </main>
  );
}
