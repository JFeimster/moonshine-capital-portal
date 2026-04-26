import Link from 'next/link';
import type { ToolRegistryItem } from '@/lib/embed-registry';

interface ToolCardProps {
  tool: ToolRegistryItem;
}

function getRegistryDetailHref(tool: ToolRegistryItem) {
  return tool.kind === 'resource' ? `/portal/resources/${tool.slug}` : `/portal/tools/${tool.slug}`;
}

export function ToolCard({ tool }: ToolCardProps) {
  const detailHref = getRegistryDetailHref(tool);

  return (
    <article className="card-brutal flex h-full flex-col gap-4 bg-neo-white text-neo-black">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {tool.category}
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">{tool.title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-neo-black/75">{tool.description}</p>
        </div>
        <span className="border border-neo-black bg-neo-pink px-2 py-1 text-xs font-black uppercase text-neo-black">
          {tool.resourceType}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
        <span className="border border-neo-black bg-neo-blue px-2 py-1 text-neo-white">{tool.accessLevel}</span>
        <span className="border border-neo-black bg-neo-green px-2 py-1 text-neo-black">{tool.renderType}</span>
        {tool.featured && <span className="border border-neo-black bg-neo-yellow px-2 py-1 text-neo-black">featured</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {tool.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="border border-neo-black bg-neo-white px-2 py-1 text-xs font-black uppercase text-neo-black">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <Link href={detailHref} className="btn-brutal-primary text-sm">
          View Details
        </Link>
        <span className="text-right text-xs font-bold uppercase text-neo-black/60">
          {tool.audience.slice(0, 2).join(' • ')}
        </span>
      </div>
    </article>
  );
}
