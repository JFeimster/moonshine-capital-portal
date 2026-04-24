import Link from 'next/link';

export const metadata = {
  title: 'Admin Logs | Moonshine Capital Portal',
  description: 'Operational log surface for intake, redirects, and publish events.',
};

const logRows = [
  { event: 'cta_click_logged', source: 'directory', status: 'ok' },
  { event: 'broker_profile_submitted', source: 'tally', status: 'ok' },
  { event: 'publish_blocked', source: 'admin', status: 'needs review' },
];

export default function AdminLogsPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-wide">Logs</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Operational event log.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This page should eventually show intake events, redirect tracking, failures, retries, and publish decisions so you can debug the system without reading tea leaves.
          </p>
        </section>

        <section className="overflow-hidden border-4 border-neo-black bg-neo-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
          <div className="grid grid-cols-3 border-b-4 border-neo-black bg-neo-black px-5 py-4 text-xs font-black uppercase tracking-wide text-neo-white">
            <span>Event</span>
            <span>Source</span>
            <span>Status</span>
          </div>
          {logRows.map((row) => (
            <div key={`${row.event}-${row.source}`} className="grid grid-cols-3 border-b-2 border-neo-black px-5 py-4 text-sm font-bold uppercase tracking-wide last:border-b-0">
              <span>{row.event}</span>
              <span>{row.source}</span>
              <span>{row.status}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
