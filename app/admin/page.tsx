import Link from 'next/link';
import { BrokerApprovalQueue } from '@/components/admin/BrokerApprovalQueue';
import { BrokerStatusToggle } from '@/components/admin/BrokerStatusToggle';

export const metadata = {
  title: 'Admin | Moonshine Capital Portal',
  description: 'Internal control plane for broker review, publishing, and system operations.',
};

const adminLinks = [
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/brokers', label: 'Brokers' },
  { href: '/admin/logs', label: 'Logs' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)] md:p-8">
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="border-2 border-neo-black bg-neo-black px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-white">Admin</span>
            <span className="border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-black">Control plane</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Review, approve, log, and keep the machine from becoming chaos.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80 md:text-lg">
            Internal control surface for broker submissions, profile quality, publish state, resource assignment, and operational visibility.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="border-2 border-neo-black bg-neo-green px-4 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <BrokerApprovalQueue />
          <BrokerStatusToggle currentStatus="in_review" />
        </section>
      </div>
    </main>
  );
}
