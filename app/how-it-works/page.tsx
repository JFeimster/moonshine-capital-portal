import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'How Funding Intake Works',
  description: 'Learn how to prepare a business funding request, review possible paths, and connect with an advisor.',
  path: '/how-it-works',
});

const steps = [
  {
    number: '01',
    title: 'Describe the need',
    text: 'Share the amount, purpose, timing, and core business details in the funding intake. Start with the information you have.',
  },
  {
    number: '02',
    title: 'Prepare the context',
    text: 'Review the relevant funding category and gather documents or project details that may help explain the request.',
  },
  {
    number: '03',
    title: 'Discuss next steps',
    text: 'Use the advisor profile or contact options to continue the conversation. A provider determines eligibility, terms, and any approval.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-yellow px-4 py-9 md:px-6 md:py-11 lg:px-8">
        <div className="section-shell">
          <span className="eyebrow mb-4">How it works</span>
          <h1 className="max-w-4xl text-[clamp(2.5rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em]">Move from a business need to a clear next step.</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed md:text-lg">Use the directory, funding guides, and application paths to prepare for a conversation about business capital.</p>
        </div>
      </section>

      <section className="section-shell grid gap-4 py-8 md:grid-cols-3 md:py-10">
        {steps.map((step) => (
          <article key={step.number} className="process-step">
            <div className="mb-3 text-3xl font-black tracking-tighter text-neo-blue">{step.number}</div>
            <h2 className="mb-2 text-xl font-black uppercase tracking-tight">{step.title}</h2>
            <p className="text-sm font-medium leading-relaxed text-neo-black/80">{step.text}</p>
          </article>
        ))}
      </section>

      <section className="border-y-4 border-neo-black bg-neo-black px-4 py-8 text-neo-white md:px-6 md:py-10 lg:px-8">
        <div className="section-shell grid gap-5 md:grid-cols-2">
          <div className="panel-block bg-neo-cream text-neo-black">
            <h2 className="text-xl font-black uppercase tracking-tight">Useful information to prepare</h2>
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed">
              <li>• The intended use and amount of funds.</li>
              <li>• Recent business financial information and existing obligations.</li>
              <li>• Project, purchase, or equipment details when relevant.</li>
              <li>• Questions about repayment, costs, and timing.</li>
            </ul>
            <Link href="/resources/document-checklist" className="mt-4 inline-flex text-xs font-black uppercase underline decoration-neo-blue decoration-2 underline-offset-4">Open document checklist →</Link>
          </div>
          <div className="panel-block border-neo-white bg-neo-black text-neo-white">
            <h2 className="text-xl font-black uppercase tracking-tight text-neo-yellow">What to expect</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-neo-white/85">An intake or advisor conversation is a starting point for review. It is not a credit decision or offer. Providers set requirements and decide whether to extend financing based on their review.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/funding" className="btn-brutal bg-neo-white text-neo-black">Funding options</Link>
              <Link href="/faq" className="btn-brutal bg-neo-black text-neo-white">Read FAQ</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8">
        <div className="flex flex-col gap-4 border-4 border-neo-black bg-neo-cream p-5 shadow-brutal md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neo-blue">Choose a next step</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">Start an intake or browse advisors.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/apply/quote" className="btn-brutal-primary">Start Funding Intake</Link>
            <Link href="/directory" className="btn-brutal">Directory</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
