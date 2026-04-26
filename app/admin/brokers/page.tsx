import Link from 'next/link';
import { BrokerStatusToggle } from '@/components/admin/BrokerStatusToggle';

export const metadata = {
  title: 'Admin Brokers | Moonshine Capital Portal',
  description: 'Broker management layer for status, quality, and visibility controls.',
};

const brokerRows = [
  { name: 'Darwin Hanneman', slug: 'darwin-hanneman', status: 'approved' },
  { name: 'Sample Broker', slug: 'sample-broker', status: 'in_review' },
  { name: 'Pending Broker', slug: 'pending-broker', status: 'pending' },
];

export default function AdminBrokersPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-green px-3 py-1 text-xs font-black uppercase tracking-wide">Brokers</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Manage broker state and profile quality.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This should become the working control panel for approval, public visibility, profile quality, resource assignment, and downstream publishing rules.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden border-4 border-neo-black bg-neo-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
            <div className="grid grid-cols-3 border-b-4 border-neo-black bg-neo-black px-5 py-4 text-xs font-black uppercase tracking-wide text-neo-white">
              <span>Name</span>
              <span>Slug</span>
              <span>Status</span>
            </div>
            {brokerRows.map((row) => (
              <div key={row.slug} className="grid grid-cols-3 border-b-2 border-neo-black px-5 py-4 text-sm font-bold uppercase tracking-wide last:border-b-0">
                <span>{row.name}</span>
                <span>{row.slug}</span>
                <span>{row.status}</span>
              </div>
            ))}
          </div>

          <BrokerStatusToggle currentStatus="approved" />
        </section>
      </div>
    </main>
  );
}
