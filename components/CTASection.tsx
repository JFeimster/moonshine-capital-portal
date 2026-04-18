import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-neo-blue py-24 px-6 md:px-12 border-y-8 border-neo-black text-neo-black relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-neo-yellow border-8 border-neo-black rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-neo-pink border-8 border-neo-black rounded-none transform rotate-12 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 bg-neo-white border-4 border-neo-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
          Stop waiting on banks.
        </h2>
        <p className="text-xl md:text-2xl font-black mb-12">
          Connect with an operator who understands your business and gets deals funded.
        </p>
        <Link href="/directory" className="btn-brutal bg-neo-black text-neo-white text-xl px-12 py-6 border-4 border-neo-black shadow-[6px_6px_0px_0px_rgba(244,244,240,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
          Find a Partner Now
        </Link>
      </div>
    </section>
  );
}
