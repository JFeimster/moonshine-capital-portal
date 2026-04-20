import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Moonshine Capital',
  description: 'Terms of Service and disclaimers for Moonshine Capital Directory.',
};

export default function TermsPage() {
  return (
    <div className="bg-neo-white min-h-screen text-neo-black py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-neo-cream border-4 border-neo-black p-8 md:p-12 shadow-brutal">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 border-b-4 border-neo-black pb-4">
          Terms of Service
        </h1>

        <div className="space-y-6 font-medium text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Moonshine Capital Directory ("the Directory"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">2. No Guarantees</h2>
            <p>
              The Directory serves solely as an informational resource connecting businesses with independent third-party funding partners and brokers. Moonshine Capital does not underwrite, guarantee, or provide any funding directly. Any agreements or transactions entered into with listed partners are solely between you and the respective partner. We make no guarantees regarding approval rates, funding amounts, or terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">3. Third-Party Links & Affiliates</h2>
            <p>
              This website contains links to third-party websites and brokers. Some of these links may be affiliate links, meaning Moonshine Capital may receive a commission or referral fee if you successfully secure funding or services through them. However, we are not responsible for the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">4. User Responsibilities</h2>
            <p>
              You are responsible for conducting your own due diligence before entering into any financial agreements. You agree not to use the Directory for any unlawful purpose or to submit false information during the intake process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the Directory following any changes indicates your acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
