export function Footer() {
  return (
    <footer className="bg-neo-black text-neo-white py-12 px-6 md:px-12 border-t-4 border-neo-yellow">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <h2 className="font-black text-3xl uppercase tracking-tighter mb-4 text-neo-yellow">
            Distilled Funding
          </h2>
          <p className="max-w-sm text-neo-cream/80 font-medium">
            The marketplace for operators who move money. No fluff. No slow banks.
          </p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-neo-blue uppercase tracking-wide mb-2">Platform</h3>
            <a href="/directory" className="hover:text-neo-yellow transition-colors font-semibold">Directory</a>
            <a href="/onboarding" className="hover:text-neo-yellow transition-colors font-semibold">Apply</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-neo-pink uppercase tracking-wide mb-2">Legal</h3>
            <a href="#" className="hover:text-neo-yellow transition-colors font-semibold">Terms</a>
            <a href="#" className="hover:text-neo-yellow transition-colors font-semibold">Privacy</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neo-white/20 text-sm font-semibold text-neo-cream/60">
        &copy; {new Date().getFullYear()} Distilled Funding. All rights reserved.
      </div>
    </footer>
  );
}
