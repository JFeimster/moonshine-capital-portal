import Link from 'next/link';

export const metadata = {
  title: 'Apply for Business Funding | Moonshine Capital',
  description: 'Choose the right Moonshine Capital funding application path: get a personalized quote or move quickly with the fast application.',
};

const faqs = [
  {
    question: 'Which application should I choose?',
    answer: 'Choose Personalized Quote if you want to compare options first. Choose Apply Fast if you already know you need capital quickly and are ready to move through underwriting.',
  },
  {
    question: 'Will this hurt my credit?',
    answer: 'The quote path is positioned for soft-pull review. Any later hard-credit requirements should be disclosed before you authorize them.',
  },
  {
    question: 'What happens after I submit?',
    answer: 'Your information is reviewed, routed to the best-fit funding path, and followed up on with next steps, missing items, or a funding conversation.',
  },
];

export default function ApplyHubPage() {
  return (
    <div className="min-h-screen bg-neo-white px-6 py-20 text-neo-black md:px-12">
      <div className="mx-auto max-w-6xl space-y-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-block border-2 border-neo-black bg-neo-yellow px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              Business funding intake
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
              Pick the funding path that matches your situation.
            </h1>
            <p className="mt-6 max-w-3xl border-l-4 border-neo-orange pl-6 text-xl font-medium leading-relaxed md:text-2xl">
              Need options first? Start with a quote. Already ready to move? Use the fast application. Either way, do not wander into the capital maze wearing a blindfold and optimism as body armor.
            </p>
          </div>

          <div className="border-4 border-neo-black bg-neo-cream p-8 shadow-brutal">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Before you apply</h2>
            <ul className="mt-6 space-y-4 text-lg font-bold">
              <li>Have basic business details ready.</li>
              <li>Know your estimated monthly revenue.</li>
              <li>Be honest about timeline, credit, and bank activity.</li>
              <li>Use the quote path if you are not sure what fits.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="mb-8 max-w-3xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Choose your application path</h2>
            <p className="mt-3 text-lg font-medium text-neo-black/75">
              Same destination: a better funding conversation. Different paths depending on urgency and certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="relative flex h-full flex-col border-4 border-neo-black bg-neo-cream p-8 shadow-brutal">
              <div className="absolute -right-6 -top-6 rotate-3 border-2 border-neo-black bg-neo-yellow px-4 py-2 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                Best first step
              </div>

              <div className="flex-grow">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Personalized Quote</h3>
                <div className="mb-6 mt-4 inline-block bg-neo-black px-3 py-1 text-sm font-bold uppercase text-neo-white">
                  Compare options first
                </div>
                <p className="mb-6 text-lg font-medium">
                  Best if you want guidance before committing. This path helps you see possible funding fits based on your business profile.
                </p>
                <ul className="mb-8 space-y-3 font-bold">
                  <li>Soft-pull positioned quote path</li>
                  <li>Better for uncertain funding fit</li>
                  <li>Useful if you want a cleaner recommendation</li>
                </ul>
              </div>

              <Link href="/apply/quote" className="mt-auto block border-2 border-transparent bg-neo-black py-4 text-center text-xl font-black uppercase tracking-wider text-neo-white shadow-brutal transition-colors hover:border-neo-black hover:bg-neo-yellow hover:text-neo-black">
                Get a Personalized Quote
              </Link>
            </div>

            <div className="relative flex h-full flex-col border-4 border-neo-black bg-neo-cream p-8 shadow-brutal">
              <div className="absolute -left-6 -top-6 -rotate-3 border-2 border-neo-black bg-neo-pink px-4 py-2 font-black uppercase text-neo-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                Fastest path
              </div>

              <div className="flex-grow">
                <h3 className="mt-2 text-3xl font-black uppercase tracking-tighter">Fast Application</h3>
                <div className="mb-6 mt-4 inline-block bg-neo-black px-3 py-1 text-sm font-bold uppercase text-neo-white">
                  Funding for any business reason
                </div>
                <p className="mb-6 text-lg font-medium">
                  Best if your need is urgent and you are ready to submit details now. This is the direct route for speed and underwriting momentum.
                </p>
                <ul className="mb-8 space-y-3 font-bold">
                  <li>Fastest application flow</li>
                  <li>Clearer path for urgent capital needs</li>
                  <li>Better when you already know you want to proceed</li>
                </ul>
              </div>

              <Link href="/apply/fast" className="mt-auto block border-2 border-transparent bg-neo-black py-4 text-center text-xl font-black uppercase tracking-wider text-neo-white shadow-brutal transition-colors hover:border-neo-black hover:bg-neo-pink hover:text-neo-white">
                Apply Fast
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {['Submit the right form', 'We review and route', 'You get next steps'].map((step, index) => (
            <div key={step} className="border-4 border-neo-black bg-neo-white p-6 shadow-brutal">
              <div className="mb-4 inline-block bg-neo-black px-3 py-1 text-sm font-black uppercase text-neo-white">Step {index + 1}</div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{step}</h3>
              <p className="mt-3 font-medium text-neo-black/75">
                {index === 0 && 'Choose the path that best matches your urgency and certainty.'}
                {index === 1 && 'Your profile is reviewed for fit, route, and missing information.'}
                {index === 2 && 'You receive the next action: more info, a funding conversation, or a better-fit path.'}
              </p>
            </div>
          ))}
        </section>

        <section className="border-4 border-neo-black bg-neo-cream p-8 shadow-brutal">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Common questions</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-2 border-neo-black bg-neo-white p-5">
                <h3 className="text-xl font-black uppercase tracking-tight">{faq.question}</h3>
                <p className="mt-3 font-medium text-neo-black/75">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <h3 className="mb-4 inline-block border-b-4 border-neo-black pb-2 text-2xl font-black uppercase tracking-tighter">
            Want a human first?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-lg font-medium">
            Browse the partner directory and connect with an operator directly before applying.
          </p>
          <Link href="/directory" className="inline-block border-2 border-neo-black bg-neo-white px-8 py-3 font-bold uppercase text-neo-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            Browse Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
