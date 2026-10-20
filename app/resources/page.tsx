import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { getPartnerResourceSummary, listStructuredPartnerResources } from '@/lib/partner-site';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const revalidate = 3600;

export const metadata: Metadata = constructMetadata({
  title: 'Funding Preparation Guides and Checklists | Distilled Funding',
  description: 'Use practical funding guides, application checklists, and offer comparison resources to prepare for an advisor conversation.',
  path: '/resources',
});

export default function PublicResourcesPage() {
  const resources = listStructuredPartnerResources();
  const origin = SITE_CONFIG.canonicalOrigin;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Funding preparation resources',
    url: `${origin}/resources`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: resources.map((resource, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: resource.title,
        url: `${origin}/resources/${resource.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
          <span className="eyebrow mb-3 bg-neo-green text-neo-black">Preparation library</span>
          <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">Get ready for a funding conversation</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">Browse checklists and guides about documents, cash flow, credit preparation, and comparing funding offers.</p>
        </div>
      </section>

      <section className="section-shell py-8 md:py-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group flex h-full flex-col border-[3px] border-neo-black bg-neo-cream p-5 shadow-brutal transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue">
              <span className="text-xs font-black uppercase tracking-[0.15em] text-neo-blue">{resource.resourceType}</span>
              <h2 className="mt-2 text-xl font-black uppercase tracking-tight">{resource.title}</h2>
              <p className="mt-3 flex-1 line-clamp-3 text-sm font-medium leading-relaxed text-neo-black/75">{getPartnerResourceSummary(resource)}</p>
              <span className="mt-5 inline-flex border-b-2 border-neo-black pb-1 text-xs font-black uppercase tracking-[0.12em] group-hover:text-neo-blue">Open resource →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
