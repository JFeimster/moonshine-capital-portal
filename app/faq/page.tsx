import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'FAQ',
  description: 'Common questions about funding intake, advisor matching, and how Distilled Funding helps founders move through capital decisions.',
  path: '/faq',
});

const faqs = [
  {
    question: 'What is the first step?',
    answer: 'Start with the funding intake. It captures the basics so we can identify the right funding lane and whether a funding advisor should be involved.',
  },
  {
    question: 'Does Distilled Funding lend money directly?',
    answer: 'No. Distilled Funding helps connect businesses with advisors and funding pathways. Final approval and terms depend on the provider, underwriting, and the specifics of the business.',
  },
  {
    question: 'Do I need to work with a funding agent?',
    answer: 'Not always, but it is often helpful when the situation is more nuanced or when you want an operator to help interpret commercial fit before moving forward.',
  },
  {
    question: 'What if my business is not a perfect fit?',
    answer: 'That is part of the reason for the intake. It helps screen for realistic fit and identify the nearby path, rather than pushing a weak or mismatched capital conversation.',
  },
  {
    question: 'Can I browse advisors without applying?',
    answer: 'Yes. The directory is meant to help founders understand the network, compare advisor fit, and decide whether to reach out, book a call, or start a funding request.',
  },
];

export default function FAQPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-green px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6 bg-neo-yellow">FAQ</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Questions before you move.</h1>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <details key={item.question} className="border-4 border-neo-black bg-neo-cream p-5 shadow-brutal open:bg-neo-yellow md:p-6">
              <summary className="flex cursor-pointer list-none items-start gap-4 text-lg font-black uppercase tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue md:text-xl">
                <span className="shrink-0 text-sm text-neo-blue">{String(index + 1).padStart(2, '0')}</span>
                <span className="flex-1">{item.question}</span>
                <span aria-hidden="true" className="text-2xl leading-none">+</span>
              </summary>
              <p className="ml-9 mt-4 max-w-4xl text-base font-medium leading-relaxed text-neo-black/80">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
