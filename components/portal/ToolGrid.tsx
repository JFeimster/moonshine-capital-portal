import type { ToolRegistryItem } from '@/lib/embed-registry';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: ToolRegistryItem[];
  title?: string;
  emptyTitle?: string;
  emptyCopy?: string;
  emptyMessage?: string;
}

export function ToolGrid({
  tools,
  title,
  emptyTitle = 'No tools loaded yet',
  emptyCopy,
  emptyMessage,
}: ToolGridProps) {
  const resolvedEmptyCopy =
    emptyMessage || emptyCopy || 'Add tools to the registry so this page becomes useful instead of decorative.';

  if (tools.length === 0) {
    return (
      <div className="border-4 border-dashed border-neo-black bg-neo-white p-8 text-neo-black shadow-brutal">
        <h3 className="mb-3 text-2xl font-black uppercase">{emptyTitle}</h3>
        <p className="text-lg font-medium">{resolvedEmptyCopy}</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
          <span className="text-sm font-black uppercase text-neo-black/60">{tools.length} loaded</span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
