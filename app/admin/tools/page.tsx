import Link from 'next/link';
import { getAllRegistryItems, getRegistryStats } from '@/lib/embed-registry';

export const metadata = {
  title: 'Admin Tools | Moonshine Capital Portal',
  description: 'Registry control panel for tools and embeds.',
};

export default async function AdminToolsPage() {
  const items = await getAllRegistryItems();
  const stats = await getRegistryStats();

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
          <h1 className="text-3xl font-black uppercase">Registry inventory</h1>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b-2 border-neo-black"><th>Title</th><th>Status</th><th>Kind</th><th>Access</th><th>Brokers</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-neo-black/20">
                    <td className="py-3 font-bold">{item.title}</td>
                    <td>{item.status}</td>
                    <td>{item.kind}</td>
                    <td>{item.accessLevel}</td>
                    <td>{item.brokerAssignments.length}</td>
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