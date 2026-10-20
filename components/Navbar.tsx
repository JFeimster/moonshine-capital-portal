import Link from 'next/link';

const primaryLinks = [
  { href: '/directory', label: 'Directory' },
  { href: '/funding-types', label: 'Funding' },
  { href: '/industries', label: 'Industries' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-neo-black bg-neo-cream text-neo-black">
      <div className="section-shell flex min-h-[68px] items-center justify-between gap-3 py-2">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 font-black uppercase leading-none tracking-tight" aria-label="Distilled Funding home">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-neo-black bg-neo-yellow text-xs shadow-brutal">DF</span>
          <span className="whitespace-nowrap text-base sm:text-lg lg:text-xl">Distilled Funding</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 xl:flex">
          {primaryLinks.map((item) => <Link key={item.href} href={item.href} className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.09em] transition-colors hover:text-neo-blue focus-visible:outline focus-visible:outline-2">{item.label}</Link>)}
        </nav>
        <div className="ml-auto hidden shrink-0 sm:block xl:ml-0">
          <Link href="/apply" className="btn-brutal-primary whitespace-nowrap px-4 py-2.5 text-[11px] tracking-[0.08em]">Apply for Funding</Link>
        </div>
        <details className="group relative xl:hidden">
          <summary className="cursor-pointer list-none border-2 border-neo-black bg-neo-white px-3 py-2 text-xs font-black uppercase shadow-brutal">Menu <span aria-hidden="true">☰</span></summary>
          <nav aria-label="Mobile navigation" className="absolute right-0 top-full z-50 mt-3 w-[min(82vw,300px)] border-[3px] border-neo-black bg-neo-white p-3 shadow-brutal">
            <div className="flex flex-col gap-1">
              {primaryLinks.map((item) => <Link key={item.href} href={item.href} className="border-b border-neo-black/15 px-3 py-3 text-sm font-black uppercase hover:bg-neo-yellow">{item.label}</Link>)}
              <Link href="/faq" className="px-3 py-3 text-sm font-black uppercase hover:bg-neo-yellow">FAQ</Link>
              <Link href="/apply" className="btn-brutal-primary mt-2 text-xs">Apply for Funding</Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
