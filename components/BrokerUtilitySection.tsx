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
          {isFallback ? 'Shared public tools & resources' : 'Advisor tools & resources'}
        </div>
        <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-4xl">Tools for your next move</h2>
        <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/75">
          {isFallback
            ? 'These shared resources are available from the public registry and are not assigned specifically to this advisor.'
            : `These resources are assigned to ${brokerName}.`}
        </p>
      </div>
      <ToolGrid title={isFallback ? 'Shared public tools' : 'Assigned tools'} tools={tools} useTrackedPrimaryActions showDetails={false} />
    </section>
  );
}
