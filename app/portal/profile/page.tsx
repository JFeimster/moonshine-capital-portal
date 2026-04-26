import Link from 'next/link';
import { ToolGrid } from '@/components/portal/ToolGrid';
import {
  getFeaturedRegistryItems,
  getFeaturedResources,
  getResourcesForBroker,
  getToolsForBroker,
} from '@/lib/embed-registry';
import { resolvePortalBrokerContext } from '@/lib/portal-broker-context';

export const metadata = {
  title: 'Portal Profile | Moonshine Capital Portal',
  description: 'Broker-facing profile management and completion layer.',
};

const profileChecklist = [
  'Add positioning statement that does not sound like generic broker mush',
  'Assign at least 3 useful tools or resources',
  'Set primary CTA and website destination',
  'Review public profile before sharing it',
];

export default async function PortalProfilePage() {
  const brokerContext = await resolvePortalBrokerContext();
  const brokerSlug = brokerContext.slug;

  const assignedTools = await getToolsForBroker(brokerSlug);
  const fallbackTools = assignedTools.length > 0 ? [] : await getFeaturedRegistryItems(3);
  const recommendedTools = assignedTools.length > 0 ? assignedTools : fallbackTools;
  const recommendationMode = assignedTools.length > 0 ? 'Broker-assigned stack' : 'Fallback featured stack';

  const assignedResources = await getResourcesForBroker(brokerSlug);
  const fallbackResources = assignedResources.length > 0 ? [] : await getFeaturedResources(3);
  const recommendedResources = assignedResources.length > 0 ? assignedResources : fallbackResources;
  const resourceRecommendationMode = assignedResources.length > 0 ? 'Broker-assigned resource stack' : 'Fallback featured resource stack';

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/portal" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to portal
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-green px-3 py-1 text-xs font-black uppercase tracking-wide">Profile</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Build a profile worth sharing.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This page helps brokers polish positioning, inspect assigned utility, and preview what the public actually sees. Auth-aware profile context comes later; for now this uses a resolver-driven broker context path.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase tracking-tight">Public profile preview</h2>
            <div className="mt-5 border-4 border-dashed border-neo-black p-6">
              <p className="text-sm font-black uppercase tracking-wide text-neo-black/65">Preview block</p>
              <p className="mt-3 text-base font-medium leading-relaxed text-neo-black/80">
                Current broker context: <strong>{brokerSlug}</strong>. Context source: <strong>{brokerContext.source}</strong>. Replace the resolver fallback with authenticated broker profile context once portal auth is wired.
              </p>
              {brokerContext.isFallback && (
                <p className="mt-3 inline-block border-2 border-neo-black bg-neo-yellow px-3 py-2 text-xs font-black uppercase tracking-wide">
                  {brokerContext.label}
                </p>
              )}
              <Link href={`/directory/${brokerSlug}`} className="mt-4 inline-flex border-2 border-neo-black bg-neo-black px-4 py-2 text-xs font-black uppercase tracking-wide text-neo-white">
                Open public profile
              </Link>
            </div>
          </article>

          <article className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase tracking-tight">Completion checklist</h2>
            <ul className="mt-5 space-y-3">
              {profileChecklist.map((item) => (
                <li key={item} className="border-2 border-neo-black bg-neo-yellow px-4 py-3 text-sm font-bold uppercase tracking-wide">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide">{recommendationMode}</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Recommended broker tools</h2>
              <p className="mt-2 max-w-3xl font-medium text-neo-black/70">
                These tools should be the first utility stack a broker sees when managing their profile. Primary actions now use tracked redirect paths so broker profile utility clicks are measurable.
              </p>
            </div>
            <Link href="/portal/tools" className="border-2 border-neo-black bg-neo-green px-4 py-2 text-xs font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              Browse all tools
            </Link>
          </div>
          <div className="mt-6">
            <ToolGrid title="Profile utility stack" tools={recommendedTools.slice(0, 6)} useTrackedPrimaryActions />
          </div>
        </section>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide">{resourceRecommendationMode}</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Recommended broker resources</h2>
              <p className="mt-2 max-w-3xl font-medium text-neo-black/70">
                Scripts, guides, handoff assets, and enablement resources should sit next to the tool stack so brokers can act without hunting through another digital junk drawer. Primary resource actions are routed through tracked redirects.
              </p>
            </div>
            <Link href="/portal/resources" className="border-2 border-neo-black bg-neo-yellow px-4 py-2 text-xs font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              Browse resources
            </Link>
          </div>
          <div className="mt-6">
            <ToolGrid
              title="Profile resource stack"
              tools={recommendedResources.slice(0, 6)}
              emptyTitle="No broker resources assigned yet"
              emptyCopy="Assign scripts, guides, handoff assets, or playbooks in the registry so this profile becomes useful instead of ornamental fintech wallpaper."
              useTrackedPrimaryActions
            />
          </div>
        </section>
      </div>
    </main>
  );
}
