import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FundingFamilyCard } from '@/components/FundingFamilyCard';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { ToolGrid } from '@/components/portal/ToolGrid';
import { getRegistryDestination, getToolBySlug } from '@/lib/embed-registry';
import { getPublicProductFamilies } from '@/lib/funding-registry';
import { getPartnerIndustryPage, getPartnerResourceSummary, listPartnerIndustryPages, listStructuredPartnerResources } from '@/lib/partner-site';
import type { PartnerResourcePage } from '@/lib/partner-site';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const revalidate = 3600;

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const industry = getPartnerIndustryPage(params.slug);
  if (!industry) return constructMetadata({ title: 'Industry Not Found', noindex: true });
  return constructMetadata({
    title: `${industry.title} Funding Guide | Distilled Funding`,
    description: industry.description,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryGuidePage({ params }: PageProps) {
  const industry = getPartnerIndustryPage(params.slug);
  if (!industry) notFound();

  const [families, tools] = await Promise.all([
    getPublicProductFamilies(),
    Promise.all(industry.relatedToolSlugs.map((slug) => getToolBySlug(slug))),
  ]);
  const familyBySlug = new Map(families.map((family) => [family.slug, family]));
  const relatedFamilies = industry.relevantFundingSlugs.map((slug) => familyBySlug.get(slug)).filter((family) => family !== undefined);
  const resourceBySlug = new Map<string, PartnerResourcePage>(listStructuredPartnerResources().map((resource) => [resource.slug, resource]));
  const resources = industry.relatedResourceSlugs.map((slug) => resourceBySlug.get(slug)).filter((resource) => resource !== undefined);
  const publicTools = tools.filter((tool): tool is NonNullable<typeof tool> => Boolean(tool && tool.status === 'active' && tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#'));
  const familySlugs = new Set(relatedFamilies.map((family) => family.slug));
  const relatedIndustries = listPartnerIndustryPages()
    .filter((item) => item.slug !== industry.slug && item.relevantFundingSlugs.some((slug) => familySlugs.has(slug)))
    .slice(0, 3);
  const allFamilyDocuments = Array.from(new Set(relatedFamilies.flatMap((family) => family.requiredDocuments || [])));
  const readinessResource = resourceBySlug.get('funding-readiness');
  const checklistItems = allFamilyDocuments.length
    ? allFamilyDocuments
    : readinessResource?.sections.flatMap((section) => section.items || []).slice(0, 5) || [];
  const origin = SITE_CONFIG.canonicalOrigin;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${industry.title} funding guide`,
    description: industry.description,
    url: `${origin}/industries/${industry.slug}`,
    about: { '@type': 'Thing', name: industry.title },
  };

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: industry.title }]} />
          <p className="eyebrow mb-3 bg-neo-green text-neo-black">Industry funding guide</p>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-[clamp(2.4rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">{industry.title}</h1>
              <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">{industry.summary}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link>
              <Link href="/directory" className="btn-brutal bg-neo-white text-neo-black">Browse Advisors</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-5 py-8 md:grid-cols-2 md:py-10">
        <article className="border-[3px] border-neo-black bg-neo-yellow p-5 shadow-brutal md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em]">Operating context</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Capital pressures to plan around</h2>
          <ul className="mt-4 space-y-2 text-sm font-semibold leading-relaxed">
            {industry.capitalPressures.map((pressure) => <li key={pressure} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 border border-neo-black" />{pressure}</li>)}
          </ul>
        </article>
        <article className="border-[3px] border-neo-black bg-neo-cream p-5 shadow-brutal md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-neo-blue">Prepare the request</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">A practical checklist</h2>
          {checklistItems.length ? (
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed">
              {checklistItems.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-neo-green" />{item}</li>)}
            </ul>
          ) : <p className="mt-3 text-sm">Start with your use of funds, expected timing, recent business activity, and existing obligations.</p>}
          <Link href="/resources/document-checklist" className="mt-4 inline-flex text-xs font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">Open document checklist →</Link>
        </article>
      </section>

      <section className="section-shell pb-8 md:pb-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-4 border-neo-black pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neo-blue">Use-case categories</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight md:text-3xl">Funding options that may be relevant</h2>
          </div>
          <Link href="/funding" className="text-xs font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">See all funding types →</Link>
        </div>
        {relatedFamilies.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{relatedFamilies.map((family) => <FundingFamilyCard key={family.id} family={family} compact />)}</div>
        ) : (
          <p className="border-2 border-neo-black bg-neo-cream p-5 text-sm font-medium">The listed industry paths are not part of the current public funding-category catalog. Browse the catalog or start an intake to discuss the request.</p>
        )}
      </section>

      {resources.length > 0 && (
        <section className="border-y-4 border-neo-black bg-neo-cream">
          <div className="section-shell py-8 md:py-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.14em] text-neo-blue">Practical reading</p><h2 className="mt-1 text-2xl font-black uppercase tracking-tight">Guides for the next step</h2></div>
              <Link href="/resources" className="text-xs font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">All resources →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => <Link key={resource.slug} href={`/resources/${resource.slug}`} className="border-2 border-neo-black bg-neo-white p-4 shadow-[3px_3px_0_0_#111] hover:bg-neo-yellow"><span className="text-[10px] font-black uppercase tracking-[0.14em] text-neo-blue">{resource.resourceType}</span><h3 className="mt-2 text-lg font-black uppercase">{resource.title}</h3><p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed">{getPartnerResourceSummary(resource)}</p></Link>)}
            </div>
          </div>
        </section>
      )}

      {publicTools.length > 0 && (
        <section className="section-shell py-8 md:py-10">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-neo-blue">Registry tools</p><h2 className="mt-1 text-2xl font-black uppercase tracking-tight">Related public tools</h2></div><Link href="/tools" className="text-xs font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">All tools →</Link></div>
          <ToolGrid tools={publicTools} useTrackedPrimaryActions showDetails={false} />
        </section>
      )}

      {industry.faq.length > 0 && (
        <section className="section-shell pb-8 md:pb-10">
          <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">Industry funding questions</h2>
          <div className="space-y-3">
            {industry.faq.map((item) => <details key={item.question} className="border-2 border-neo-black bg-neo-white p-4"><summary className="cursor-pointer text-sm font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-neo-blue">{item.question}</summary><p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{item.answer}</p></details>)}
          </div>
        </section>
      )}

      {relatedIndustries.length > 0 && (
        <section className="border-t-4 border-neo-black bg-neo-blue text-neo-white">
          <div className="section-shell py-7"><h2 className="text-xl font-black uppercase tracking-tight">Related industry guides</h2><div className="mt-4 flex flex-wrap gap-2">{relatedIndustries.map((related) => <Link key={related.slug} href={`/industries/${related.slug}`} className="border-2 border-neo-white bg-neo-black px-3 py-2 text-xs font-black uppercase hover:bg-neo-yellow hover:text-neo-black">{related.title}</Link>)}</div></div>
        </section>
      )}

      <section className="border-t-4 border-neo-black bg-neo-black text-neo-white">
        <div className="section-shell flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[0.14em] text-neo-green">Talk through the business need</p><h2 className="mt-1 text-2xl font-black uppercase">Connect with a real advisor</h2></div>
          <div className="flex flex-wrap gap-3"><Link href="/directory" className="btn-brutal">Browse Advisors</Link><Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link></div>
        </div>
      </section>
    </main>
  );
}
