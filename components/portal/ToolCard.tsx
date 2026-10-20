import Link from 'next/link';
import { getRegistryDestination, getRegistryTrackedHref, type ToolRegistryItem } from '@/lib/embed-registry';

interface ToolCardProps {
  tool: ToolRegistryItem;
  useTrackedPrimaryAction?: boolean;
  showDetails?: boolean;
}

function getRegistryDetailHref(tool: ToolRegistryItem) {
  return tool.kind === 'resource' ? `/portal/resources/${tool.slug}` : `/portal/tools/${tool.slug}`;
}

export function ToolCard({ tool, useTrackedPrimaryAction = false, showDetails = true }: ToolCardProps) {
  const detailHref = getRegistryDetailHref(tool);
  const hasDestination = getRegistryDestination(tool) !== '#';
  const primaryHref = useTrackedPrimaryAction && hasDestination ? getRegistryTrackedHref(tool) : detailHref;
  const primaryLabel = useTrackedPrimaryAction && hasDestination ? tool.ctaLabel : 'View Details';

  return (
    <article className="card-brutal flex h-full flex-col gap-4 bg-neo-white text-neo-black">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {tool.category}
          </span>
          <span className="border border-neo-black bg-neo-pink px-2 py-1 text-[10px] font-black uppercase text-neo-black">
            {tool.resourceType}
          </span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight">{tool.title}</h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-neo-black/75">{tool.description}</p>
      </div>

      {tool.useCases.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Ways to use this resource">
          {tool.useCases.slice(0, 2).map((useCase) => (
            <li key={useCase} className="border border-neo-black/40 bg-neo-cream px-2 py-1 text-xs font-semibold">
              {useCase}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Link href={primaryHref} className="btn-brutal-primary text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue">
            {primaryLabel}
          </Link>
          {useTrackedPrimaryAction && hasDestination && showDetails && (
            <Link href={detailHref} className="text-xs font-black uppercase tracking-wide text-neo-black underline decoration-2 underline-offset-4">
              Details
            </Link>
          )}
      </div>
    </article>
  );
}
