import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicBreadcrumbs } from '@/components/PublicBreadcrumbs';
import { ToolGrid } from '@/components/portal/ToolGrid';
import { getActiveTools, getRegistryDestination } from '@/lib/embed-registry';
import { constructMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const revalidate = 3600;

export const metadata: Metadata = constructMetadata({
  title: 'Business Funding Tools | Distilled Funding',
  description: 'Browse public tools listed in the funding utility registry.',
  path: '/tools',
});

export default async function PublicToolsPage() {
  const tools = (await getActiveTools()).filter(
    (tool) => tool.kind === 'tool' && tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#',
  );
  const origin = SITE_CONFIG.canonicalOrigin;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Public funding tools',
    url: `${origin}/tools`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: `${origin}/go/${tool.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-neo-white text-neo-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell">
          <PublicBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tools' }]} />
          <span className="eyebrow mb-3 bg-neo-yellow text-neo-black">Public tools</span>
          <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">Tools for the next funding decision</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-cream md:text-lg">Each listing comes from the public tool registry. Open a tool to review its assumptions and intended use.</p>
        </div>
      </section>

      <section className="section-shell py-8 md:py-10">
        {tools.length ? (
          <ToolGrid tools={tools} useTrackedPrimaryActions showDetails={false} />
        ) : (
          <div className="border-4 border-neo-black bg-neo-cream p-7 shadow-brutal">
            <h2 className="text-2xl font-black uppercase">No public tools are currently listed</h2>
            <p className="mt-2 font-medium">You can use the preparation guides or compare funding categories while the public tool list is updated.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/resources" className="btn-brutal">Browse preparation guides</Link>
              <Link href="/funding" className="btn-brutal-primary">Explore funding options</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
