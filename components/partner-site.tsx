import Link from 'next/link';
import type { BrokerProfile } from '@/lib/types';

// Kept as a compatibility component for existing partner routes; no duplicate identity bar.
export function PartnerIdentityStrip({ broker: _broker }: { broker: BrokerProfile }) {
  return null;
}

export function PartnerSiteHeader({ broker, active }: { broker: BrokerProfile; active?: string }) {
  const navItems = [
    { label: 'Home', href: '/' + broker.slug },
    { label: 'Funding', href: '/funding' },
    { label: 'Tools', href: '/' + broker.slug + '/tools' },
    { label: 'Resources', href: '/' + broker.slug + '/resources' },
    { label: 'About', href: '/' + broker.slug + '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-neo-black bg-neo-white text-neo-black">
      <div className="section-shell flex min-h-[70px] items-center justify-between gap-3 py-2">
        <Link href={'/' + broker.slug} className="min-w-0 shrink-0 leading-tight">
          <span className="block text-base font-black uppercase tracking-tight md:text-lg">{broker.displayName || broker.fullName}</span>
          <span className="block truncate text-[11px] font-bold text-neo-black/60">{broker.companyName || broker.agencyName || 'Funding Advisor'}</span>
        </Link>
        <nav aria-label="Advisor site navigation" className="hidden items-center gap-4 lg:flex">
          {navItems.map(item => <Link key={item.href} href={item.href} aria-current={active === item.label ? 'page' : undefined} className={'whitespace-nowrap text-[11px] font-black uppercase tracking-[0.07em] transition-colors hover:text-neo-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue ' + (active === item.label ? 'border-b-4 border-neo-yellow' : '')}>{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <Link href={'/' + broker.slug + '/apply'} className="btn-brutal-primary px-3 py-2 text-xs tracking-normal sm:px-4">Apply</Link>
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none border-2 border-neo-black bg-neo-cream px-3 py-2 text-xs font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue">Menu ☰</summary>
            <nav aria-label="Advisor mobile navigation" className="absolute right-0 top-full z-50 mt-2 w-56 border-[3px] border-neo-black bg-neo-white p-2 shadow-brutal">
              {navItems.map(item => <Link key={item.href} href={item.href} aria-current={active === item.label ? 'page' : undefined} className={'block border-b border-neo-black/15 px-3 py-3 text-xs font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-neo-blue ' + (active === item.label ? 'bg-neo-yellow' : '')}>{item.label}</Link>)}
              <Link href={'/' + broker.slug + '/contact'} aria-current={active === 'Contact' ? 'page' : undefined} className={'block px-3 py-3 text-xs font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-neo-blue ' + (active === 'Contact' ? 'bg-neo-yellow' : '')}>Contact</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function PartnerSiteFooter({ broker }: { broker: BrokerProfile }) {
  return (
    <footer className="border-t-4 border-neo-black bg-neo-black text-neo-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 md:px-12">
        <div>
          <div className="text-lg font-black uppercase tracking-tight">{broker.displayName || broker.fullName}</div>
          {broker.companyName && <div className="mt-2 text-sm text-neo-white/70">{broker.companyName}</div>}
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neo-green">Explore</h3>
          <div className="mt-3 space-y-2 text-sm font-bold">
            <Link href={`/${broker.slug}/funding`} className="block hover:text-neo-yellow">Funding</Link>
            <Link href={`/${broker.slug}/industries`} className="block hover:text-neo-yellow">Industries</Link>
            <Link href={`/${broker.slug}/campaign`} className="block hover:text-neo-yellow">Solutions</Link>
            <Link href={`/${broker.slug}/resources`} className="block hover:text-neo-yellow">Resources</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neo-green">Connect</h3>
          <div className="mt-3 space-y-2 text-sm font-bold">
            {broker.publicEmail && <a href={`mailto:${broker.publicEmail}`} className="block hover:text-neo-yellow">Email</a>}
            {broker.phoneNumber && <a href={`tel:${broker.phoneNumber}`} className="block hover:text-neo-yellow">Phone</a>}
            <Link href={`/${broker.slug}/contact`} className="block hover:text-neo-yellow">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PartnerBreadcrumbs({ broker, items }: { broker: BrokerProfile; items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-neo-black/70">
      <Link href={`/${broker.slug}`} className="hover:text-neo-blue">Home</Link>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? <Link href={item.href} className="hover:text-neo-blue">{item.label}</Link> : <span>{item.label}</span>}
        </div>
      ))}
    </nav>
  );
}

export function PartnerCTACluster({ broker, primaryLabel = 'Apply for Funding', secondaryLabel = 'Book with Me' }: { broker: BrokerProfile; primaryLabel?: string; secondaryLabel?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`/${broker.slug}/apply`} className="btn-brutal-primary">{primaryLabel}</Link>
      {broker.bookingUrl && <Link href={`/${broker.slug}/book`} className="btn-brutal">{secondaryLabel}</Link>}
    </div>
  );
}
