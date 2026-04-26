import Link from 'next/link';
import { getToolsByKind, groupRegistryItemsBy } from '@/lib/embed-registry';
import { ToolGrid } from '@/components/portal/ToolGrid';

export const metadata = {
  title: 'Portal Resources | Moonshine Capital Portal',
  description: 'Broker-facing resource library for scripts, guides, and operating assets.',
};

export default async function PortalResourcesPage() {
  const resources = await getToolsByKind('resource');
  const groupedResources = groupRegistryItemsBy(resources, 'funnelStage');

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/portal" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to portal
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-wide">Resources</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Resource library, not digital clutter.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            Scripts, playbooks, qualification docs, and operating assets brokers can actually use.
          </p>
        </section>

        {Object.entries(groupedResources).map(([stage, stageResources]) => (
          <ToolGrid key={stage} title={stage} tools={stageResources} emptyTitle="No resources loaded" emptyMessage="Add scripts, playbooks, and enablement assets to the registry so this stops being a pretty empty shelf." />
        ))}
      </div>
    </main>
  );
}
