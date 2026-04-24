import Link from 'next/link';

export const metadata = {
  title: 'Admin Settings | Moonshine Capital Portal',
  description: 'System settings and environment checklist for operations.',
};

const settingsBlocks = [
  {
    title: 'Form IDs',
    copy: 'Track Tally form IDs and route ownership here so intake changes stop breaking silently.',
  },
  {
    title: 'Webhook and API settings',
    copy: 'Document n8n webhooks, Notion adapter credentials, and any downstream publish targets.',
  },
  {
    title: 'Ops checklist',
    copy: 'Keep a visible checklist for env vars, auth setup, registry freshness, and broken link review.',
  },
];

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide">Settings</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">System settings and sanity checks.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This page should centralize forms, webhook targets, environment notes, and basic ops checks so you are not reconstructing the stack from memory every week.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {settingsBlocks.map((block) => (
            <article key={block.title} className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight">{block.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{block.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
