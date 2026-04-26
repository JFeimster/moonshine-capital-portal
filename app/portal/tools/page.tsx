import Link from 'next/link';
import { getFeaturedRegistryItems, getToolsByAccessLevel, getToolsForAudience } from '@/lib/embed-registry';
import { ToolGrid } from '@/components/portal/ToolGrid';

export const metadata = {
  title: 'Portal Tools | Moonshine Capital Portal',
  description: 'Curated broker tool library inside the portal.',
};

export default async function PortalToolsPage() {
  const tools = await getToolsByAccessLevel('portal');
  const featured = await getFeaturedRegistryItems(3);
  const brokerTools = await getToolsForAudience('brokers');

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
        <ToolGrid title="All active tools" tools={tools} emptyTitle="No portal tools active" emptyMessage="Load real Vercel apps, calculators, and GPT assets into the embed registry so this page earns its existence." />
      </div>
    </main>
  );
}
