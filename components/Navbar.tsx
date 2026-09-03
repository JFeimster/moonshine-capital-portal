import Link from 'next/link';

const primaryLinks = [
  { href: '/directory', label: 'Find an Advisor' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/funding-types', label: 'Funding' },
  { href: '/industries', label: 'Industries' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-neo-black bg-neo-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 md:px-6 md:py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-black uppercase tracking-tighter text-lg md:text-2xl text-neo-black">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-neo-black bg-neo-yellow text-xs shadow-brutal">DF</span>
          <span>Distilled Funding</span>
        </Link>

        <nav className="hidden items-center gap-5 text-xs font-black uppercase tracking-[0.18em] text-neo-black md:flex">
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-neo-blue">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/apply" className="btn-brutal-primary text-xs md:text-sm">Apply for Funding</Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="list-none cursor-pointer select-none rounded-none border-2 border-neo-black bg-neo-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-neo-black shadow-brutal">
            Menu
          </summary>
          <div className="absolute right-0 top-full mt-3 w-72 border-4 border-neo-black bg-neo-white p-4 shadow-brutal">
            <div className="flex flex-col gap-3 text-sm font-black uppercase tracking-[0.12em]">
              {primaryLinks.map((item) => (
                <Link key={item.href} href={item.href} className="border-b border-neo-black/20 pb-2 text-neo-black">
                  {item.label}
                </Link>
              ))}
              <Link href="/apply" className="btn-brutal-primary mt-2 w-full">Apply</Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
