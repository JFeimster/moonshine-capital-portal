import Link from 'next/link';

const footerGroups = [
  {
    title: 'Capital',
    links: [
      { href: '/directory', label: 'Find an Advisor' },
      { href: '/apply', label: 'Apply for Funding' },
      { href: '/how-it-works', label: 'How It Works' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: '/funding-types', label: 'Funding' },
      { href: '/industries', label: 'Industries' },
      { href: '/directory', label: 'Advisors' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/disclosures', label: 'Disclosures' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-4 border-neo-yellow bg-neo-black text-neo-white">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 md:grid-cols-2 md:px-6 lg:grid-cols-[1.25fr_repeat(4,1fr)] lg:gap-6 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-3 font-black uppercase tracking-tighter text-2xl text-neo-yellow">
            <span className="flex h-9 w-9 items-center justify-center border-2 border-neo-yellow bg-neo-black text-xs">DF</span>
            Distilled Funding
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-neo-cream/80">
            Capital without the runaround. We connect founders with real funding paths and the people who know how to move them.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-neo-green">{group.title}</h3>
            <ul className="space-y-2 text-sm font-semibold text-neo-cream/85">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-neo-yellow">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neo-white/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-xs font-bold uppercase tracking-[0.14em] text-neo-cream/60 md:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Distilled Funding</span>
          <span>Capital Network</span>
        </div>
      </div>
    </footer>
  );
}
