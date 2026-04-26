import Link from 'next/link';
import { BrokerStatusToggle } from '@/components/admin/BrokerStatusToggle';
import { getBrokers } from '@/lib/brokers';
import { getToolsForBroker } from '@/lib/embed-registry';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Brokers | Moonshine Capital Portal',
  description: 'Broker management layer for status, quality, and visibility controls.',
};

interface BrokerCoverageRow {
  name: string;
  slug: string;
  assignedTools: number;
  featuredAssignments: number;
  fallback: boolean;
}

async function getBrokerCoverageRows(): Promise<{ rows: BrokerCoverageRow[]; loadFailed: boolean }> {
  try {
    const brokers = await getBrokers();

    const rows = await Promise.all(
      brokers.map(async (broker) => {
        const assignedTools = await getToolsForBroker(broker.slug);
        const featuredAssignments = assignedTools.filter((tool) =>
          tool.brokerAssignments.some((assignment) => assignment.brokerSlug === broker.slug && assignment.featured),
        ).length;

        return {
          name: broker.fullName,
          slug: broker.slug,
          assignedTools: assignedTools.length,
          featuredAssignments,
          fallback: assignedTools.length === 0,
        };
      }),
    );

    return { rows, loadFailed: false };
  } catch (error) {
    console.warn('[admin-brokers-load-failed]', error);
    return { rows: [], loadFailed: true };
  }
}

export default async function AdminBrokersPage() {
  const { rows: brokerRows, loadFailed } = await getBrokerCoverageRows();

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-green px-3 py-1 text-xs font-black uppercase tracking-wide">Brokers</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Broker utility coverage and profile state.</h1>
          <p className="mt-3 max-w-4xl text-base font-medium leading-relaxed text-neo-black/80">
            Read-only broker coverage surface for profile visibility, assigned tools, featured utility depth, and fallback exposure. This is the operator view for broker utility quality before CRUD or sync workflows exist.
          </p>
        </section>

        {loadFailed && (
          <section className="border-4 border-neo-black bg-neo-yellow p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase">Broker data unavailable</h2>
            <p className="mt-2 font-bold text-neo-black/80">
              The admin broker coverage page loaded, but broker source data could not be fetched. Check Wix/API environment variables or upstream availability.
            </p>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="overflow-hidden border-4 border-neo-black bg-neo-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
            <div className="grid grid-cols-5 border-b-4 border-neo-black bg-neo-black px-5 py-4 text-xs font-black uppercase tracking-wide text-neo-white">
              <span>Name</span>
              <span>Slug</span>
              <span>Assigned</span>
              <span>Featured</span>
              <span>Profile</span>
            </div>
            {brokerRows.length > 0 ? (
              brokerRows.map((row) => (
                <div key={row.slug} className="grid grid-cols-5 items-center border-b-2 border-neo-black px-5 py-4 text-sm font-bold uppercase tracking-wide last:border-b-0">
                  <span>{row.name}</span>
                  <span>{row.slug}</span>
                  <span>{row.assignedTools}</span>
                  <span>{row.featuredAssignments}</span>
                  <Link href={`/directory/${row.slug}`} className="underline">
                    {row.fallback ? 'Fallback' : 'Live'}
                  </Link>
                </div>
              ))
            ) : (
              <div className="border-b-2 border-neo-black px-5 py-6 text-sm font-bold uppercase tracking-wide last:border-b-0">
                No broker rows available. The page is guarded so deployment does not fail when upstream broker data is unavailable.
              </div>
            )}
          </div>

          <BrokerStatusToggle currentStatus="approved" />
        </section>
      </div>
    </main>
  );
}
