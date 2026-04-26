import Link from 'next/link';
import { getFeaturedRegistryItems, getToolsByAccessLevel, getToolsForAudience, groupRegistryItemsBy } from '@/lib/embed-registry';
import { ToolGrid } from '@/components/portal/ToolGrid';

export const metadata = {
  title: 'Portal Tools | Moonshine Capital Portal',
  description: 'Curated broker tool library inside the portal.',
};

export default async function PortalToolsPage() {
  const tools = await getToolsByAccessLevel('portal');
  const featured = await getFeaturedRegistryItems(3);
  const brokerTools = await getToolsForAudience('brokers');
  const groupedTools = groupRegistryItemsBy(tools, 'category');

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

        <ToolGrid title="Featured tools" tools={featured} />
        <ToolGrid title="Broker ops" tools={brokerTools.slice(0, 6)} />

        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Tool categories</h2>
            <p className="mt-2 max-w-2xl font-medium text-neo-black/70">Scan the registry by operating lane instead of digging through one giant card pile like a raccoon in a fintech dumpster.</p>
          </div>
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <ToolGrid key={category} title={category} tools={categoryTools} />
          ))}
        </section>
      </div>
    </main>
  );
}
