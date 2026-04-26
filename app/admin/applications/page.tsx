import Link from 'next/link';

const applicationRoutes = [
  {
    route: '/apply',
    label: 'Applications Hub',
    audience: 'General applicants who need routing help',
    purpose: 'Primary public application hub for guided funding path selection.',
    tally: 'Primary intake form / routing shell',
    registry: 'apply-hub',
    nextStep: 'Route into Tally, assign source, normalize intake state.',
  },
  {
    route: '/apply/fast',
    label: 'Fast Track',
    audience: 'Urgent applicants optimizing for speed',
    purpose: 'Quickest funding path for speed-first applicants who need fast routing.',
    tally: 'Fast-lane intake form',
    registry: 'fast-track-application',
    nextStep: 'Prioritize speed lane, normalize source, handoff to intake workflow.',
  },
  {
    route: '/apply/quote',
    label: 'Quote Request',
    audience: 'Applicants who need a quote before full intake',
    purpose: 'Lightweight quote-first path for lower-friction lead capture.',
    tally: 'Quote-first lead form',
    registry: 'quote-request',
    nextStep: 'Collect estimate request, qualify, then route to full application if viable.',
  },
];

export const metadata = {
  title: 'Admin Applications | Moonshine Capital Portal',
  description: 'Read-only intake route map for public funding application flows.',
};

export default function AdminApplicationsPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide">Applications</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Public intake route map.</h1>
          <p className="mt-3 max-w-4xl text-base font-medium leading-relaxed text-neo-black/80">
            Read-only control surface for public application routes, intake intent, registry linkage, and future CRM/n8n handoff. This is the operator map for how applicants enter the system before persistence and automation take over.
          </p>
        </section>

        <section className="space-y-4">
          {applicationRoutes.map((item) => (
            <div key={item.route} className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide">{item.route}</p>
                  <h2 className="mt-1 text-3xl font-black uppercase">{item.label}</h2>
                  <p className="mt-2 max-w-3xl font-medium text-neo-black/75">{item.purpose}</p>
                </div>
                <Link href={item.route} className="border-2 border-neo-black bg-neo-black px-4 py-2 text-xs font-black uppercase tracking-wide text-neo-white">
                  Open route
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="border-2 border-neo-black p-4">
                  <p className="text-xs font-black uppercase">Audience</p>
                  <p className="mt-2 font-bold">{item.audience}</p>
                </div>
                <div className="border-2 border-neo-black p-4">
                  <p className="text-xs font-black uppercase">Tally</p>
                  <p className="mt-2 font-bold">{item.tally}</p>
                </div>
                <div className="border-2 border-neo-black p-4">
                  <p className="text-xs font-black uppercase">Registry</p>
                  <p className="mt-2 font-bold">{item.registry}</p>
                </div>
                <div className="border-2 border-neo-black p-4">
                  <p className="text-xs font-black uppercase">Next handoff</p>
                  <p className="mt-2 font-bold">{item.nextStep}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/tracking" className="card-brutal bg-neo-white no-underline">
            <p className="text-xs font-black uppercase">Tracking</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Event Visibility</h2>
            <p className="mt-2 font-medium text-neo-black/70">Inspect click tracking, webhook sink behavior, and event handoff.</p>
          </Link>
          <div className="card-brutal bg-neo-white">
            <p className="text-xs font-black uppercase">Pipeline</p>
            <h2 className="mt-2 text-2xl font-black uppercase">CRM / n8n Next</h2>
            <p className="mt-2 font-medium text-neo-black/70">This page documents intake paths now so CRM writes and automations have a sane map later.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
