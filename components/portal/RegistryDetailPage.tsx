import Link from 'next/link';
import { getRegistryDestination, getRegistryTrackedHref, type ToolRegistryItem } from '@/lib/embed-registry';
import { ToolGrid } from '@/components/portal/ToolGrid';

interface RegistryDetailPageProps {
  item: ToolRegistryItem;
  backHref: string;
  backLabel: string;
  relatedItems?: ToolRegistryItem[];
}

function isExternalHref(href: string) {
  return href.startsWith('http');
}

export function RegistryDetailPage({ item, backHref, backLabel, relatedItems = [] }: RegistryDetailPageProps) {
  const destination = getRegistryDestination(item);
  const trackedHref = getRegistryTrackedHref(item);
  const hasAssignments = item.brokerAssignments.length > 0;

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link href={backHref} className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          {backLabel}
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
            <span className="border border-neo-black bg-neo-yellow px-2 py-1">{item.kind}</span>
            <span className="border border-neo-black bg-neo-pink px-2 py-1">{item.resourceType}</span>
            <span className="border border-neo-black bg-neo-green px-2 py-1">{item.renderType}</span>
            <span className="border border-neo-black bg-neo-white px-2 py-1">{item.accessLevel}</span>
            {item.featured && <span className="border border-neo-black bg-neo-blue px-2 py-1 text-neo-white">featured</span>}
          </div>
          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight md:text-6xl">{item.title}</h1>
          <p className="mt-4 max-w-3xl text-lg font-medium leading-relaxed text-neo-black/75">{item.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="border border-neo-black bg-neo-white px-2 py-1 text-xs font-black uppercase">{tag}</span>
            ))}
          </div>
          <a href={trackedHref} target={isExternalHref(destination) ? '_blank' : undefined} rel={isExternalHref(destination) ? 'noopener noreferrer' : undefined} className="btn-brutal-primary mt-8 inline-flex">
            {item.ctaLabel}
          </a>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="card-brutal bg-neo-white"><p className="text-xs font-black uppercase">Audience</p><p className="mt-2 font-bold">{item.audience.join(', ') || 'General'}</p></div>
          <div className="card-brutal bg-neo-white"><p className="text-xs font-black uppercase">Verticals</p><p className="mt-2 font-bold">{item.verticals.join(', ') || 'General'}</p></div>
          <div className="card-brutal bg-neo-white"><p className="text-xs font-black uppercase">Use cases</p><p className="mt-2 font-bold">{item.useCases.join(', ') || 'General'}</p></div>
        </section>

        <section className="card-brutal bg-neo-white">
          <h2 className="text-2xl font-black uppercase">Assignment visibility</h2>
          {hasAssignments ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {item.brokerAssignments.map((assignment) => (
                <div key={assignment.brokerSlug} className="border-2 border-neo-black p-4">
                  <p className="font-black uppercase">{assignment.brokerSlug}</p>
                  <p className="mt-1 text-sm font-bold text-neo-black/70">{assignment.featured ? 'Featured assignment' : 'Standard assignment'}</p>
                  {assignment.note && <p className="mt-2 text-sm font-medium">{assignment.note}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 font-medium text-neo-black/75">No broker-specific assignments yet. This item is available through general registry visibility.</p>
          )}
        </section>

        {item.embedUrl && (
          <section className="card-brutal bg-neo-white">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-black uppercase">Embeddable surface</h2>
              <a href={item.embedUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase underline">Open embed source</a>
            </div>
            <div className="mt-4 aspect-video overflow-hidden border-4 border-neo-black bg-neo-black">
              <iframe src={item.embedUrl} title={item.title} className="h-full w-full" loading="lazy" />
            </div>
          </section>
        )}

        {relatedItems.length > 0 && <ToolGrid title="Related registry items" tools={relatedItems} />}
      </div>
    </main>
  );
}
