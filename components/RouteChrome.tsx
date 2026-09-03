'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { isPartnerRoute } from '@/lib/routes';

export function RouteChrome() {
  const pathname = usePathname() || '/';

  if (isPartnerRoute(pathname)) return null;

  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}