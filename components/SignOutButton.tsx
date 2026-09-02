'use client';

import { useTransition } from 'react';
import { signOut } from '@/app/access/actions';

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-wide text-neo-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:bg-neo-pink/50 disabled:shadow-none"
    >
      {isPending ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
