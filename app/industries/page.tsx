import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { listPartnerIndustryPages } from '@/lib/partner-site';
import { getPublicProductFamilies } from '@/lib/funding-registry';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const revalidate = 3600;

export const metadata: Metadata = constructMetadata({
  title: 'Funding by Industry | Distilled Funding',
  description: 'Explore industry-specific capital pressures, related funding categories, and practical preparation resources.',
  path: '/industries',
});

export default async function IndustriesPage() {
  const industries = listPartnerIndustryPages().sort((a, b) => a.title.localeCompare(b.title));
  const families = await getPublicProductFamilies();
  const familyBySlug = new Map(families.map((family) => [family.slug, family]));
  const origin = SITE_CONFIG.canonicalOrigin;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Funding by industry',
    url: `${origin}/industries`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: industries.map((industry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: industry.title,
        url: `${origin}/industries/${industry.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries' }]} />
          <span className="eyebrow mb-3 bg-neo-green text-neo-black">Industry guides</span>
          <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">Capital depends on how your business runs</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">Review common operating pressures and the funding categories that may be relevant to your industry.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link>
            <Link href="/directory" className="btn-brutal bg-neo-white text-neo-black">Browse Advisors</Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 md:py-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry) => {
            const relatedFamilies = industry.relevantFundingSlugs
              .map((slug) => familyBySlug.get(slug))
              .filter((family) => family !== undefined);

            return (
              <article key={industry.slug} className="flex h-full flex-col border-[3px] border-neo-black bg-neo-cream p-5 shadow-brutal">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-neo-blue">Industry guide</p>
                <h2 className="mt-2 text-xl font-black uppercase tracking-tight">{industry.title}</h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{industry.summary}</p>
                {industry.capitalPressures.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.12em]">Common pressures</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {industry.capitalPressures.slice(0, 2).map((pressure) => <li key={pressure} className="border border-neo-black/40 bg-neo-white px-2 py-1 text-xs font-semibold">{pressure}</li>)}
                    </ul>
                  </div>
                )}
                {relatedFamilies.length > 0 && <p className="mt-4 text-xs font-medium"><span className="font-black uppercase">Funding paths: </span>{relatedFamilies.map((family) => family.publicName || family.name).join(' · ')}</p>}
                <Link href={`/industries/${industry.slug}`} className="btn-brutal-primary mt-auto w-full justify-center text-center">View industry guide</Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t-4 border-neo-black bg-neo-yellow">
        <div className="section-shell flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase">Need help framing the request?</h2>
            <p className="mt-1 max-w-2xl text-sm font-medium">Review the funding categories, use the preparation guides, or talk with an advisor.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/funding" className="btn-brutal">Funding options</Link>
            <Link href="/resources" className="btn-brutal">Preparation guides</Link>
            <Link href="/directory" className="btn-brutal-primary">Find an Advisor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
