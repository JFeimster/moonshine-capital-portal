import Link from 'next/link';
import { BrokerApprovalQueue } from '@/components/admin/BrokerApprovalQueue';
import { BrokerStatusToggle } from '@/components/admin/BrokerStatusToggle';

export const metadata = {
  title: 'Admin | Moonshine Capital Portal',
  description: 'Internal control plane for broker review, publishing, and system operations.',
};

const adminLinks = [
  { href: '/admin/brokers', label: 'Brokers', tone: 'bg-neo-green' },
  { href: '/admin/applications', label: 'Applications', tone: 'bg-neo-yellow' },
  { href: '/admin/tools', label: 'Tools', tone: 'bg-neo-blue' },
  { href: '/admin/resources', label: 'Resources', tone: 'bg-neo-pink' },
  { href: '/admin/tracking', label: 'Tracking', tone: 'bg-neo-green' },
];

const placeholderLinks = [
  { href: '/admin/submissions', label: 'Submissions', note: 'legacy placeholder' },
  { href: '/admin/logs', label: 'Logs', note: 'legacy placeholder' },
  { href: '/admin/settings', label: 'Settings', note: 'legacy placeholder' },
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
            Review, route, inspect, and keep the machine from becoming chaos.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80 md:text-lg">
            Internal control surface for broker utility coverage, intake routes, registry quality, resource coverage, and tracking visibility.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`border-2 border-neo-black px-4 py-4 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${link.tone}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide text-neo-black/60">
            {placeholderLinks.map((link) => (
              <span key={link.href} className="border-2 border-dashed border-neo-black px-3 py-2">
                {link.label} · {link.note}
              </span>
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
