import Link from 'next/link';
import { getAllRegistryItems, getRegistryCoverage, getRegistryStats } from '@/lib/embed-registry';

export const metadata = {
  title: 'Admin Tools | Moonshine Capital Portal',
  description: 'Registry control panel for tools and embeds.',
};

export default async function AdminToolsPage() {
  const items = await getAllRegistryItems();
  const stats = await getRegistryStats();
  const coverage = getRegistryCoverage(items);
  const weakItems = coverage.filter((row) => row.coverageScore < 90 || !row.hasDestination || !row.hasBrokerAssignments);

  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">Back to admin</Link>
        <section className="grid gap-4 md:grid-cols-5">
          {Object.entries(stats).slice(0,5).map(([key, value]) => (
            <div key={key} className="card-brutal bg-neo-white">
              <p className="text-xs font-black uppercase">{key}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="card-brutal bg-neo-white">
          <h1 className="text-3xl font-black uppercase">Coverage alerts</h1>
          <p className="mt-2 font-medium text-neo-black/70">Items here are usable but need operator attention before the registry becomes truly grown-up. Tiny clown shoes, meet data hygiene.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {weakItems.map(({ item, missingFields, coverageScore, hasDestination, hasBrokerAssignments }) => (
              <div key={item.id} className="border-2 border-neo-black p-4">
                <p className="font-black uppercase">{item.title}</p>
                <p className="mt-1 text-sm font-bold">Score: {coverageScore}</p>
                <p className="mt-1 text-xs font-black uppercase text-neo-black/60">{item.kind} • {item.resourceType}</p>
                <p className="mt-2 text-sm font-medium">{!hasDestination && 'Missing destination. '}{!hasBrokerAssignments && 'No broker assignments. '}{missingFields.length > 0 && `Missing: ${missingFields.join(', ')}`}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-brutal bg-neo-white">
          <h1 className="text-3xl font-black uppercase">Registry inventory</h1>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b-2 border-neo-black"><th>Title</th><th>Status</th><th>Kind</th><th>Type</th><th>Destination</th><th>Brokers</th><th>Score</th></tr></thead>
              <tbody>
                {coverage.map(({ item, destination, coverageScore }) => (
                  <tr key={item.id} className="border-b border-neo-black/20">
                    <td className="py-3 font-bold">{item.title}</td>
                    <td>{item.status}</td>
                    <td>{item.kind}</td>
                    <td>{item.resourceType}</td>
                    <td className="max-w-xs truncate">{destination}</td>
                    <td>{item.brokerAssignments.length}</td>
                    <td>{coverageScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}