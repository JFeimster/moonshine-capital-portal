import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { resolveAuthorizedReturnTo } from '@/lib/permissions';
import { constructMetadata } from '@/lib/seo';
import { AccessForm } from './AccessForm';

export const metadata = constructMetadata({
  title: 'Access',
  description: 'Internal access gateway.',
  path: '/access',
  noindex: true,
});

export default async function AccessPage({
  searchParams,
}: {
  searchParams: { returnTo?: string };
}) {
  const session = await getSession();

  if (session) {
    redirect(resolveAuthorizedReturnTo(session.role, searchParams.returnTo));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neo-cream p-6">
      <div className="w-full max-w-md border-4 border-neo-black bg-neo-white p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
        <div className="mb-6">
          <span className="border-2 border-neo-black bg-neo-black px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-white">Secure Access</span>
          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-neo-black">Enter Access Code</h1>
        </div>
        <AccessForm returnTo={searchParams.returnTo} />
      </div>
    </main>
  );
}
