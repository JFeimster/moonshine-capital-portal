import Link from 'next/link';
import { BrokerApprovalQueue } from '@/components/admin/BrokerApprovalQueue';

export const metadata = {
  title: 'Admin Submissions | Moonshine Capital Portal',
  description: 'Submission review queue for broker intake and profile-builder flows.',
};

export default function AdminSubmissionsPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/admin" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to admin
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-wide">Submissions</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Review incoming broker data.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This queue should become the place where application intake and profile-builder submissions get merged, reviewed, approved, or kicked back for fixes.
          </p>
        </section>

        <BrokerApprovalQueue />
      </div>
    </main>
  );
}
