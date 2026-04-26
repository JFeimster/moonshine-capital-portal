import Link from 'next/link';
import { getToolsByAccessLevel } from '@/lib/embed-registry';
import { ToolGrid } from '@/components/portal/ToolGrid';

export const metadata = {
  title: 'Portal | Moonshine Capital Portal',
  description: 'Operator-first partner portal for tools, resources, profile actions, and tracked momentum.',
};

const portalLinks = [
  { href: '/portal/tools', label: 'Tools' },
  { href: '/portal/resources', label: 'Resources' },
  { href: '/portal/profile', label: 'Profile' },
  { href: '/portal/tracking', label: 'Tracking' },
];

const quickStats = [
  { label: 'Profile completion', value: '62%', tone: 'bg-neo-yellow' },
  { label: 'Tracked clicks', value: '18', tone: 'bg-neo-green' },
  { label: 'Assigned tools', value: '3', tone: 'bg-neo-pink' },
];

export default async function PortalPage() {
  const tools = await getToolsByAccessLevel('portal');

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)] md:p-8">
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="border-2 border-neo-black bg-neo-black px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-white">
              Funding Agent OS
            </span>
            <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-black">
              Portal Home
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Your operator hub. Less fluff. More useful tools, actions, and signal.
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80 md:text-lg">
            This is the internal layer where brokers should grab assets, manage profile visibility,
            access curated tools, and see what to do next. Not a dead brochure. Not a dusty file dump.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {portalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-2 border-neo-black bg-neo-green px-4 py-3 text-sm font-black uppercase tracking-wide text-neo-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickStats.map((stat) => (
            <article key={stat.label} className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <span className={`inline-block border-2 border-neo-black px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-black ${stat.tone}`}>
                {stat.label}
              </span>
              <p className="mt-4 text-4xl font-black uppercase tracking-tight">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Featured portal tools</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-neo-black/75">
              Curated utility layer. These should eventually become the stuff brokers actually use in conversations,
              follow-up, and content flow.
            </p>
          </div>

          <ToolGrid tools={tools} emptyMessage="No portal tools are active yet. Load the embed registry with real calculators, widgets, and GPT utilities next." />
        </section>
      </div>
    </main>
  );
}
