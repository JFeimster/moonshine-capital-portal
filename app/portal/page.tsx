import Link from 'next/link';
import { getRegistryTrackedHref, getToolsByAccessLevel, getToolsForBroker } from '@/lib/embed-registry';
import { resolvePortalBrokerContext } from '@/lib/portal-broker-context';
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
  const brokerContext = await resolvePortalBrokerContext();
  const tools = await getToolsByAccessLevel('portal');
  const assignedTools = await getToolsForBroker(brokerContext.slug);
  const primaryAssignedTool = assignedTools[0];

  const brokerQuickActions = [
    {
      href: `/directory/${brokerContext.slug}`,
      label: 'View public profile',
      description: 'Inspect the shareable broker page applicants and partners will actually see.',
      tone: 'bg-neo-yellow',
    },
    {
      href: primaryAssignedTool ? getRegistryTrackedHref(primaryAssignedTool) : '/portal/tools',
      label: primaryAssignedTool ? `Open ${primaryAssignedTool.title}` : 'Open assigned tools',
      description: primaryAssignedTool
        ? 'Launch the top assigned broker tool through the tracked redirect path.'
        : 'Review the broker utility stack and assign tools before sending traffic.',
      tone: 'bg-neo-green',
    },
    {
      href: '/apply',
      label: 'Open application hub',
      description: 'Send prospects into the public money path without digging through links.',
      tone: 'bg-neo-pink',
    },
  ];

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

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-neo-black/65">Broker context: {brokerContext.slug}</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Quick actions</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-neo-black/75">
                Top broker moves without the dashboard theater. Open the profile, launch the assigned tool, or send a prospect into the application path.
              </p>
            </div>
            {brokerContext.isFallback && (
              <span className="inline-flex border-2 border-neo-black bg-neo-yellow px-3 py-2 text-xs font-black uppercase tracking-wide">
                {brokerContext.label}
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {brokerQuickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block border-4 border-neo-black bg-neo-white p-5 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <span className={`inline-block border-2 border-neo-black px-3 py-1 text-xs font-black uppercase tracking-wide ${action.tone}`}>
                  Action
                </span>
                <h3 className="mt-4 text-xl font-black uppercase tracking-tight">{action.label}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-neo-black/75">{action.description}</p>
              </Link>
            ))}
          </div>
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
