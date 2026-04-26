import Link from 'next/link';
import { getFeaturedRegistryItems, getToolsByAccessLevel, getToolsForAudience, groupRegistryItemsBy } from '@/lib/embed-registry';
import { ToolGrid } from '@/components/portal/ToolGrid';

export const metadata = {
  title: 'Portal Tools | Moonshine Capital Portal',
  description: 'Curated broker tool library inside the portal.',
};

function uniqueValues(values: string[][]) {
  return Array.from(new Set(values.flat().filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export default async function PortalToolsPage() {
  const tools = await getToolsByAccessLevel('portal');
  const featured = await getFeaturedRegistryItems(3);
  const brokerTools = await getToolsForAudience('brokers');
  const groupedTools = groupRegistryItemsBy(tools, 'category');
  const categories = Object.keys(groupedTools).sort((a, b) => a.localeCompare(b));
  const audiences = uniqueValues(tools.map((tool) => tool.audience));
  const verticals = uniqueValues(tools.map((tool) => tool.verticals));

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/portal" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to portal
        </Link>
        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide">Portal tools</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Useful beats pretty.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            Actual broker tools. Qualification widgets. Calculators. Embedded utilities. No decorative dashboard theater.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="card-brutal bg-neo-white">
            <p className="text-xs font-black uppercase">Categories</p>
            <h2 className="mt-2 text-3xl font-black uppercase">{categories.length}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <a key={category} href={`#category-${category}`} className="border-2 border-neo-black bg-neo-yellow px-2 py-1 text-xs font-black uppercase">
                  {category}
                </a>
              ))}
            </div>
          </div>
          <div className="card-brutal bg-neo-white">
            <p className="text-xs font-black uppercase">Audiences</p>
            <h2 className="mt-2 text-3xl font-black uppercase">{audiences.length}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {audiences.slice(0, 12).map((audience) => (
                <span key={audience} className="border-2 border-neo-black bg-neo-white px-2 py-1 text-xs font-black uppercase">
                  {audience}
                </span>
              ))}
            </div>
          </div>
          <div className="card-brutal bg-neo-white">
            <p className="text-xs font-black uppercase">Verticals</p>
            <h2 className="mt-2 text-3xl font-black uppercase">{verticals.length}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {verticals.slice(0, 12).map((vertical) => (
                <span key={vertical} className="border-2 border-neo-black bg-neo-pink px-2 py-1 text-xs font-black uppercase">
                  {vertical}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ToolGrid title="Featured tools" tools={featured} />
        <ToolGrid title="Broker ops" tools={brokerTools.slice(0, 6)} />

        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Tool categories</h2>
            <p className="mt-2 max-w-2xl font-medium text-neo-black/70">Scan the registry by operating lane instead of digging through one giant card pile like a raccoon in a fintech dumpster.</p>
          </div>
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category} id={`category-${category}`} className="scroll-mt-10">
              <ToolGrid title={category} tools={categoryTools} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
