import Link from 'next/link';
import type { BrokerProfile } from '@/lib/types';

export function PartnerIdentityStrip({ broker }: { broker: BrokerProfile }) {
  const name = broker.displayName || broker.fullName || 'Funding Advisor';
  const company = broker.companyName || broker.agencyName || '';
  const location = [broker.city, broker.state].filter(Boolean).join(', ');

  return (
    <div className="border-b-4 border-neo-black bg-neo-cream">
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-neo-blue">Funding Advisor</p>
            <div className="mt-1 text-xl font-black uppercase tracking-tight">{name}</div>
            {company && <div className="text-sm font-bold text-neo-black/70">{company}</div>}
          </div>
          {location && <div className="text-sm font-bold uppercase tracking-[0.14em]">{location}</div>}
        </div>
      </div>
    </div>
  );
}

export function PartnerSiteHeader({ broker, active }: { broker: BrokerProfile; active?: string }) {
  const navItems = [
    { label: 'Home', href: `/${broker.slug}` },
    { label: 'Funding', href: `/${broker.slug}/funding` },
    { label: 'Industries', href: `/${broker.slug}/industries` },
    { label: 'Solutions', href: `/${broker.slug}/campaign` },
    { label: 'Tools', href: `/${broker.slug}/tools` },
    { label: 'Resources', href: `/${broker.slug}/resources` },
    { label: 'About', href: `/${broker.slug}/about` },
  ];

  return (
    <header className="border-b-4 border-neo-black bg-neo-white/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="flex items-center justify-between gap-3 py-3 md:py-4">
          <Link href={`/${broker.slug}`} className="min-w-0">
            <div className="text-base font-black uppercase tracking-tight md:text-xl">{broker.displayName || broker.fullName}</div>
            {broker.companyName && <div className="text-[10px] font-black uppercase tracking-[0.18em] text-neo-black/65">{broker.companyName}</div>}
          </Link>
          <nav className="hidden flex-wrap items-center justify-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${active === item.label ? 'bg-neo-yellow border border-neo-black' : 'hover:text-neo-blue'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={`/${broker.slug}/apply`} className="btn-brutal-primary hidden sm:inline-flex text-xs px-4 py-2">Apply</Link>
            {broker.bookingUrl && (
              <Link href={`/${broker.slug}/book`} className="btn-brutal hidden sm:inline-flex text-xs px-4 py-2">Book</Link>
            )}
          </div>
        </div>
        <nav aria-label="Partner site navigation" className="flex gap-1 overflow-x-auto border-t-2 border-neo-black/15 py-2 lg:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`shrink-0 whitespace-nowrap px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${active === item.label ? 'border-2 border-neo-black bg-neo-yellow' : 'border-2 border-transparent hover:border-neo-black'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
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
