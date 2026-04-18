import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-neo-blue py-24 px-6 md:px-12 border-y-4 border-neo-black text-neo-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
          Stop waiting on banks.
        </h2>
        <p className="text-xl md:text-2xl font-bold mb-12">
          Connect with an operator who understands your business and gets deals funded.
        </p>
        <Link href="/directory" className="btn-brutal bg-neo-black text-neo-white text-xl px-12 py-6 border-neo-white shadow-brutal-white hover:bg-neo-black hover:text-neo-white">
          Find a Partner Now
        </Link>
      </div>
    </section>
  );
}
