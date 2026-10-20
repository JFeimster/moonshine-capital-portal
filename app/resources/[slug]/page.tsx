import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { getPartnerIndustryPage, getPartnerResource, getPartnerResourceSummary } from '@/lib/partner-site';
import type { PartnerIndustryPage, PartnerResourcePage } from '@/lib/partner-site';
import { getProductFamilyBySlug } from '@/lib/funding-registry';
import type { FundingProductFamily } from '@/lib/funding-registry';
import { getRegistryTrackedHref, type ToolRegistryItem } from '@/lib/embed-registry';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const revalidate = 3600;

type PageProps = { params: { slug: string } };
type ResourceEntry = PartnerResourcePage | ToolRegistryItem;
const isRegistryResource = (resource: ResourceEntry): resource is ToolRegistryItem => 'kind' in resource;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resource = await getPartnerResource(params.slug);
  if (!resource) return constructMetadata({ title: 'Resource Not Found', noindex: true });
  const description = 'sections' in resource ? getPartnerResourceSummary(resource) : resource.description;
  return constructMetadata({
    title: `${resource.title} | Distilled Funding Resources`,
    description,
    path: `/resources/${params.slug}`,
  });
}

export default async function PublicResourceDetailPage({ params }: PageProps) {
  const resource = await getPartnerResource(params.slug);
  if (!resource) notFound();

  const description = 'sections' in resource ? getPartnerResourceSummary(resource) : resource.description;

  if (isRegistryResource(resource)) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: resource.title,
      description: resource.description,
      url: `${SITE_CONFIG.canonicalOrigin}/resources/${resource.slug}`,
    };
    return (
      <main className="min-h-screen bg-neo-white text-neo-black">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
          <div className="section-shell">
            <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: resource.title }]} />
            <p className="eyebrow mb-3 bg-neo-yellow text-neo-black">{resource.category}</p>
            <h1 className="max-w-4xl text-[clamp(2.4rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">{resource.title}</h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">{resource.description}</p>
            <a href={getRegistryTrackedHref(resource)} className="btn-brutal-primary mt-6">{resource.ctaLabel}</a>
          </div>
        </section>
      </main>
    );
  }

  const relatedFamilies = (await Promise.all(resource.relatedFundingSlugs.map((slug) => getProductFamilyBySlug(slug))))
    .filter((family): family is FundingProductFamily => family !== null);
  const relatedIndustries = resource.relatedIndustrySlugs.map((slug) => getPartnerIndustryPage(slug))
    .filter((industry): industry is PartnerIndustryPage => industry !== null);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.description,
    mainEntityOfPage: `${SITE_CONFIG.canonicalOrigin}/resources/${resource.slug}`,
  };

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: resource.title }]} />
          <p className="eyebrow mb-3 bg-neo-green text-neo-black">{resource.resourceType}</p>
          <h1 className="max-w-4xl text-[clamp(2.4rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">{resource.title}</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">{description}</p>
        </div>
      </section>

      <section className="section-shell grid gap-5 py-8 md:grid-cols-2 md:py-10">
        {resource.sections.map((section) => (
          <article key={section.heading} className="border-[3px] border-neo-black bg-neo-cream p-5 shadow-brutal md:p-6">
            <h2 className="text-xl font-black uppercase tracking-tight">{section.heading}</h2>
            {section.body && <p className="mt-3 text-sm font-medium leading-relaxed">{section.body}</p>}
            {section.items && <ul className="mt-3 space-y-2 text-sm font-medium leading-relaxed">{section.items.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-neo-blue" />{item}</li>)}</ul>}
          </article>
        ))}
      </section>

      {(relatedFamilies.length > 0 || relatedIndustries.length > 0) && (
        <section className="border-y-4 border-neo-black bg-neo-white">
          <div className="section-shell grid gap-6 py-7 md:grid-cols-2">
            {relatedFamilies.length > 0 && <div><h2 className="text-sm font-black uppercase tracking-[0.14em]">Related funding options</h2><div className="mt-3 flex flex-wrap gap-2">{relatedFamilies.map((family) => <Link key={family.id} href={`/funding/${family.slug}`} className="border-2 border-neo-black bg-neo-yellow px-3 py-2 text-sm font-bold hover:bg-neo-green">{family.publicName || family.name}</Link>)}</div></div>}
            {relatedIndustries.length > 0 && <div><h2 className="text-sm font-black uppercase tracking-[0.14em]">Related industries</h2><div className="mt-3 flex flex-wrap gap-2">{relatedIndustries.map((industry) => <Link key={industry.slug} href={`/industries/${industry.slug}`} className="border-2 border-neo-black bg-neo-cream px-3 py-2 text-sm font-bold hover:bg-neo-yellow">{industry.title}</Link>)}</div></div>}
          </div>
        </section>
      )}

      <section className="section-shell flex flex-wrap gap-3 py-8">
        <Link href="/apply/quote" className="btn-brutal-primary">{resource.ctaLabel || 'Start Funding Intake'}</Link>
        <Link href="/directory" className="btn-brutal">Browse Advisors</Link>
      </section>
    </main>
  );
}
