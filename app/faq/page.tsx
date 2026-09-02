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
            <div key={item.question} className="panel-block">
              <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-neo-blue">{String(index + 1).padStart(2, '0')}</div>
              <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter">{item.question}</h2>
              <p className="text-lg font-medium leading-relaxed text-neo-black/80">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
