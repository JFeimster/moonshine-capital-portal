import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-neo-blue py-14 px-4 md:px-6 lg:px-8 border-y-8 border-neo-black text-neo-black relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-neo-yellow border-8 border-neo-black rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-neo-pink border-8 border-neo-black rounded-none transform rotate-12 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 bg-neo-white border-4 border-neo-black p-7 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">
          Start with the business need.
        </h2>
        <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed mb-6">
          Review funding options, prepare the request, and connect with an advisor. Providers determine eligibility, terms, and approval.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apply/quote" className="btn-brutal bg-neo-black text-neo-white text-base px-6 py-3 border-4 border-neo-black shadow-[6px_6px_0px_0px_rgba(244,244,240,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
            Start Funding Intake
          </Link>
          <Link href="/funding" className="btn-brutal bg-neo-white text-neo-black text-base px-6 py-3 border-4 border-neo-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
            Explore Funding Options
          </Link>
        </div>
      </div>
    </section>
  );
}
