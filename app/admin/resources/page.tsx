import Link from 'next/link';
import { getToolsByKind } from '@/lib/embed-registry';

export const metadata = {
  title: 'Admin Resources | Moonshine Capital Portal',
  description: 'Resource inventory and enablement coverage.',
};

export default async function AdminResourcesPage() {
  const resources = await getToolsByKind('resource');

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">Back to admin</Link>
        <section className="card-brutal bg-neo-white">
          <h1 className="text-3xl font-black uppercase">Resource coverage</h1>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {resources.map((item) => (
              <article key={item.id} className="border-2 border-neo-black p-4">
                <h2 className="text-xl font-black uppercase">{item.title}</h2>
                <p className="mt-2 text-sm">{item.description}</p>
                <p className="mt-3 text-xs font-black uppercase text-neo-black/60">{item.category} • {item.funnelStage || 'general'}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}