import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { hasAccess } from '@/lib/permissions';
import { SignOutButton } from '@/components/SignOutButton';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || !hasAccess(session.role, '/admin')) {
    redirect('/access?returnTo=/admin');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-neo-black bg-neo-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-xl font-black uppercase tracking-tight text-neo-black">
            MCP Admin
          </span>
          <SignOutButton />
        </div>
      </header>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
