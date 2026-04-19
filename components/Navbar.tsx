import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b-2 border-neo-black bg-neo-cream text-neo-black py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="font-black text-2xl tracking-tighter uppercase">
        Distilled Funding
      </Link>
      <div className="flex gap-6 items-center font-bold text-sm">
        <Link href="/directory" className="hover:text-neo-blue transition-colors uppercase tracking-wide">
          Directory
        </Link>
        <Link href="/onboarding" className="hover:text-neo-pink transition-colors uppercase tracking-wide">
          Become a Partner
        </Link>
      </div>
    </nav>
  );
}
