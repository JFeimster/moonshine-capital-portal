import Link from 'next/link';

export const metadata = {
  title: 'Admin Applications Dashboard | Moonshine Capital Portal',
  description: 'Placeholder dashboard for application intake visibility.',
};

const mockApplications = [
  {
    id: 'app_001',
    applicant: 'Acme Corp',
    formSource: '/apply/fast',
    status: 'Pending Review',
    nextAction: 'Qualify lead',
    routingStatus: 'Routed to Tally',
    date: '2026-04-26',
  },
  {
    id: 'app_002',
    applicant: 'Stark Industries',
    formSource: '/apply/quote',
    status: 'Quote Sent',
    nextAction: 'Awaiting reply',
    routingStatus: 'CRM Synced',
    date: '2026-04-25',
  },
  {
    id: 'app_003',
    applicant: 'Wayne Enterprises',
    formSource: '/apply',
    status: 'Approved',
    nextAction: 'Onboard broker',
    routingStatus: 'n8n Workflow Complete',
    date: '2026-04-24',
  },
];

export default function AdminApplicationsDashboard() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide">Applications</span>
            <span className="border-2 border-dashed border-neo-black bg-neo-cream px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-black/60">Mock Data / Placeholder</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Intake Dashboard</h1>
          <p className="mt-3 max-w-4xl text-base font-medium leading-relaxed text-neo-black/80">
            This is a placeholder dashboard surface for future real intake data. It will provide visibility into recent applications, their source, status, and routing progress. Currently, no CRM or Notion writes are wired.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase border-b-4 border-neo-black pb-2 inline-block">Recent Applications</h2>

          <div className="grid gap-6">
            {mockApplications.map((app) => (
              <div key={app.id} className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-neo-black pb-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase">{app.applicant}</h3>
                    <p className="text-sm font-bold text-neo-black/70 mt-1">ID: {app.id} • {app.date}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                     <span className="border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-wide">
                        {app.status}
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 border-2 border-neo-black bg-neo-cream">
                    <p className="text-xs font-black uppercase tracking-wide text-neo-black/70 mb-1">Form Source</p>
                    <p className="font-bold">{app.formSource}</p>
                  </div>
                  <div className="p-3 border-2 border-neo-black bg-neo-cream">
                    <p className="text-xs font-black uppercase tracking-wide text-neo-black/70 mb-1">Applicant Status</p>
                    <p className="font-bold">{app.status}</p>
                  </div>
                  <div className="p-3 border-2 border-neo-black bg-neo-cream">
                    <p className="text-xs font-black uppercase tracking-wide text-neo-black/70 mb-1">Next Action</p>
                    <p className="font-bold">{app.nextAction}</p>
                  </div>
                  <div className="p-3 border-2 border-neo-black bg-neo-cream">
                    <p className="text-xs font-black uppercase tracking-wide text-neo-black/70 mb-1">Routing Status</p>
                    <p className="font-bold">{app.routingStatus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 border-4 border-dashed border-neo-black bg-neo-cream p-6 text-center">
            <p className="font-bold uppercase tracking-wide text-neo-black/60">
              Future integrations (Notion, HubSpot, Tally, n8n) will populate this view.
            </p>
        </section>

      </div>
    </main>
  );
}
