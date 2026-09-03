import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'How It Works',
  description: 'Learn how to start with the right funding need, match with a funding agent, and move forward with a clear path to capital.',
  path: '/how-it-works',
});

const steps = [
  {
    number: '01',
    title: 'Tell us what you need',
    text: 'Start with the funding ask, business basics, and what kind of capital path you are actually considering. One intake is enough to establish the right starting lane.',
  },
  {
    number: '02',
    title: 'Review your funding path',
    text: 'We narrow the field based on your business, use case, and urgency so you are not pitching into the wrong channel or chasing the wrong lender.',
  },
  {
    number: '03',
    title: 'Work with a funding agent',
    text: 'Your advisor provides context, acts as a guide through the process, and helps you interpret what is realistic before you burn time on the wrong deal.',
  },
  {
    number: '04',
    title: 'Compare options',
    text: 'From working capital to acquisition financing to more specialized structures, each option is evaluated on fit, cost, and operating reality.',
  },
  {
    number: '05',
    title: 'Move forward',
    text: 'If the deal makes sense, the next step is a concise application or booking conversation. Approval remains case-by-case and not guaranteed.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-yellow px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6">Capital flow</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">How the capital network works.</h1>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-relaxed md:text-xl">
            We do not hand you a generic bank script. We align your business with the path, the advisor, and the documentation required to move with clarity.
          </p>
        </div>
      </section>

      <section className="section-shell py-12 md:py-14">
        <div className="grid gap-4 lg:grid-cols-5">
          {steps.map((step) => (
            <div key={step.number} className="process-step">
              <div className="mb-4 text-3xl font-black tracking-tighter text-neo-blue">{step.number}</div>
              <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter">{step.title}</h2>
              <p className="text-base font-medium leading-relaxed text-neo-black/80">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neo-black px-4 py-12 text-neo-white md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="panel-block bg-neo-cream text-neo-black">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter">What to expect</h2>
            <ul className="space-y-4 text-base font-bold leading-relaxed">
              <li>• Documents typically include recent financial statements, tax returns, business information, and a clear funding need.</li>
              <li>• The funding agent helps you understand which providers or structures make sense based on business profile and timing.</li>
              <li>• Clients are responsible for accurate information, business context, and making the decision to proceed with any capital option.</li>
              <li>• The process is designed to be efficient, but approvals are not guaranteed and depend on underwriting and final provider review.</li>
            </ul>
          </div>

          <div className="panel-block bg-neo-black text-neo-white border-neo-white">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-neo-yellow">After submission</h2>
            <ol className="space-y-4 text-base font-bold leading-relaxed text-neo-white/85">
              <li>1. Intake and review to confirm the funding lane and request fit.</li>
              <li>2. An advisor or team member outlines the next practical step and any missing information.</li>
              <li>3. The decision-making process moves forward with the provider or channel most aligned to the business.</li>
              <li>4. If it is not a fit, the advisor helps identify what should change next instead of forcing a weak deal.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="flex flex-col gap-5 rounded-none border-4 border-neo-black bg-neo-cream p-6 shadow-brutal md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-neo-blue">Ready to move</div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tighter">Start with the deal, not the guesswork.</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/apply" className="btn-brutal-primary">Apply for Funding</Link>
            <Link href="/directory" className="btn-brutal">Find an Advisor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
