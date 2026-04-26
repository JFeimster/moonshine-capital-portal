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

const samplePayload = {
  event: 'registry_click',
  slug: 'apply-hub',
  itemId: 'apply-hub',
  kind: 'tool',
  category: 'applications',
  resourceType: 'application-route',
  destination: '/apply',
  timestamp: '2026-04-26T10:42:00.000Z',
  referrer: 'https://moonshine-capital-portal.vercel.app/directory/darwin-hanneman',
  userAgent: 'Mozilla/5.0',
};

const nextSteps = [
  {
    title: 'Vercel Runtime Logs',
    description: 'Baseline visibility. Every registry click still lands here even if no downstream sink is configured.',
  },
  {
    title: 'n8n Webhook Sink',
    description: 'Set REGISTRY_CLICK_WEBHOOK_URL and forward events into n8n for enrichment, routing, alerts, and cheap automation.',
  },
  {
    title: 'Notion Event Table',
    description: 'Store normalized click events in Notion for operator review, AI summaries, and dead-simple weekly audits.',
  },
  {
    title: 'Database Later',
    description: 'Use real storage only after event volume justifies reporting, retention, and trend analysis.',
  },
];

const trackingStates = [
  'Console logging active',
  'Webhook sink optional via REGISTRY_CLICK_WEBHOOK_URL',
  'Webhook POST timeout protected (1500ms)',
  'Fail-open redirect behavior preserved',
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
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Registry click tracking is live and webhook-ready.</h1>
          <p className="mt-3 max-w-4xl text-base font-medium leading-relaxed text-neo-black/75">
            Registry assets emit structured click events through <code>/go/[slug]</code>. Every click logs to Vercel runtime by default. When <code>REGISTRY_CLICK_WEBHOOK_URL</code> is configured, events also POST to a downstream sink with timeout protection and fail-open redirect behavior.
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
            <h2 className="mt-2 text-2xl font-black uppercase">Webhook Ready</h2>
            <p className="mt-2 font-medium text-neo-black/70">Console-first, optional sink, timeout-protected, fail-open.</p>
          </div>
        </section>

        <section className="card-brutal bg-neo-white">
          <h2 className="text-3xl font-black uppercase">Tracking behavior</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {trackingStates.map((state) => (
              <div key={state} className="border-2 border-neo-black px-4 py-3 text-sm font-black uppercase">
                {state}
              </div>
            ))}
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
          <pre className="mt-6 overflow-x-auto border-2 border-neo-black bg-neo-black p-4 text-sm text-neo-green">{JSON.stringify(samplePayload, null, 2)}</pre>
        </section>

        <section className="card-brutal bg-neo-white">
          <h2 className="text-3xl font-black uppercase">Recommended handoff</h2>
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
