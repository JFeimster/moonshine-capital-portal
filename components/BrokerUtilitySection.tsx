import { ToolGrid } from '@/components/portal/ToolGrid';
import type { ToolRegistryItem } from '@/lib/embed-registry';

interface BrokerUtilitySectionProps {
  brokerName: string;
  tools: ToolRegistryItem[];
  isFallback?: boolean;
}

export function BrokerUtilitySection({ brokerName, tools, isFallback = false }: BrokerUtilitySectionProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          Broker utility layer
        </div>
        <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">Tools that make this profile useful</h2>
        <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/75">
          {isFallback
            ? `${brokerName} does not have assigned tools yet, so this profile is showing the default featured tool stack.`
            : `${brokerName}'s assigned tools and resources are wired from the shared embed registry.`}
        </p>
      </div>
      <ToolGrid title={isFallback ? 'Featured default tools' : `${brokerName}'s tool stack`} tools={tools} />
    </section>
  );
}
