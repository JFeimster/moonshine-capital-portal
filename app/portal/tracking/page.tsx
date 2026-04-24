import Link from 'next/link';

export const metadata = {
  title: 'Portal Tracking | Moonshine Capital Portal',
  description: 'Broker-facing tracked click and CTA visibility layer.',
};

const rows = [
  { source: 'directory', type: 'apply', clicks: 11 },
  { source: 'profile', type: 'website', clicks: 4 },
  { source: 'profile', type: 'apply', clicks: 3 },
];

export default function PortalTrackingPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/portal" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to portal
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-black px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-white">Tracking</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">See what gets clicked.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This page should eventually pull from the tracked redirect layer so brokers can see which CTA paths actually get attention.
          </p>
        </section>

        <section className="overflow-hidden border-4 border-neo-black bg-neo-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
          <div className="grid grid-cols-3 border-b-4 border-neo-black bg-neo-black px-5 py-4 text-xs font-black uppercase tracking-wide text-neo-white">
            <span>Source</span>
            <span>CTA Type</span>
            <span>Clicks</span>
          </div>
          {rows.map((row) => (
            <div key={`${row.source}-${row.type}`} className="grid grid-cols-3 border-b-2 border-neo-black px-5 py-4 text-sm font-bold uppercase tracking-wide last:border-b-0">
              <span>{row.source}</span>
              <span>{row.type}</span>
              <span>{row.clicks}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
