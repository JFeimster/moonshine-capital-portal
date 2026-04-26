import Link from 'next/link';

const trackedFields = [
  'slug',
  'itemId',
  'kind',
  'category',
  'resourceType',
  'destination',
  'timestamp',
  'referrer',
  'userAgent',
];

const nextSteps = [
  {
    title: 'Vercel Runtime Logs',
    description: 'Current click events already land here. Cheapest immediate visibility. Good for proving traffic before pretending we need a warehouse.',
  },
  {
    title: 'n8n Webhook Sink',
    description: 'Forward click events into a webhook for enrichment, alerting, routing, and cheap downstream automations.',
  },
  {
    title: 'Notion Event Table',
    description: 'Useful for lightweight operator review, manual QA, and quick click/event audits without real analytics infra yet.',
  },
  {
    title: 'Database / Warehouse Later',
    description: 'Only once volume justifies persistence, reporting, and actual trend analysis instead of founder cosplay with dashboards.',
  },
];

export default function AdminTrackingPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="card-brutal bg-neo-white">
          <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase">Tracking</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Registry click tracking is live.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/75">
            Registry assets now emit structured click events through <code>/go/[slug]</code>. This is read-only infrastructure for now: enough to prove behavior, inspect payloads, and decide where persistence belongs before building fake analytics theater.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/tools" className="card-brutal bg-neo-white no-underline">
            <p className="text-xs font-black uppercase">Coverage</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Registry Tools</h2>
            <p className="mt-2 font-medium text-neo-black/70">Inspect inventory, gaps, and weak tool entries.</p>
          </Link>
          <Link href="/admin/resources" className="card-brutal bg-neo-white no-underline">
            <p className="text-xs font-black uppercase">Enablement</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Registry Resources</h2>
            <p className="mt-2 font-medium text-neo-black/70">Inspect scripts, playbooks, and resource coverage.</p>
          </Link>
          <div className="card-brutal bg-neo-white">
            <p className="text-xs font-black uppercase">Status</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Log Only</h2>
            <p className="mt-2 font-medium text-neo-black/70">Structured server events, no persistence layer yet.</p>
          </div>
        </section>

        <section className="card-brutal bg-neo-white">
          <h2 className="text-3xl font-black uppercase">Tracked event payload</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {trackedFields.map((field) => (
              <div key={field} className="border-2 border-neo-black px-4 py-3 text-sm font-black uppercase">
                {field}
              </div>
            ))}
          </div>
        </section>

        <section className="card-brutal bg-neo-white">
          <h2 className="text-3xl font-black uppercase">Next persistence options</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {nextSteps.map((step) => (
              <div key={step.title} className="border-2 border-neo-black p-4">
                <h3 className="text-xl font-black uppercase">{step.title}</h3>
                <p className="mt-2 font-medium text-neo-black/75">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
