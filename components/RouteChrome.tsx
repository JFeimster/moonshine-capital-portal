'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { isPartnerRoute } from '@/lib/routes';

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  if (isPartnerRoute(pathname)) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
