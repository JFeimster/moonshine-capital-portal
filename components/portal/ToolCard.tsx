import type { ToolRegistryItem } from '@/lib/embed-registry';

interface ToolCardProps {
  tool: ToolRegistryItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="card-brutal flex h-full flex-col gap-4 bg-neo-white text-neo-black">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {tool.category}
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">{tool.title}</h3>
        </div>
        <span className="border border-neo-black bg-neo-pink px-2 py-1 text-xs font-black uppercase text-neo-black">
          {tool.type}
        </span>
      </div>

      <p className="text-sm font-bold uppercase text-neo-blue">
        Access: {tool.accessLevel}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        {(tool.tags ?? []).slice(0, 4).map((tag) => (
          <span key={tag} className="border border-neo-black bg-neo-green px-2 py-1 text-xs font-black uppercase text-neo-black">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        {tool.url ? (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal-primary text-sm"
          >
            Open Tool
          </a>
        ) : (
          <div className="border-2 border-dashed border-neo-black px-4 py-3 text-sm font-bold uppercase">
            URL pending
          </div>
        )}
        {tool.embedUrl && (
          <span className="border border-neo-black bg-neo-black px-3 py-2 text-xs font-black uppercase text-neo-white">
            Embeddable
          </span>
        )}
      </div>
    </article>
  );
}
