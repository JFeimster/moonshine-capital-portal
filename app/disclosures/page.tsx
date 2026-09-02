import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Disclosures',
  description: 'Important disclosures and operating context for Distilled Funding, partner referrals, and funding-related interactions.',
  path: '/disclosures',
});

const disclosures = [
  'This site is a discovery and referral platform. It does not originate, underwrite, or guarantee funding for any business.',
  'Funding approvals, product availability, pricing, and terms are determined by the provider or financial partner after review of the applicant and the financing request.',
  'Any referral or introduction made through this network may result in compensation or business relationships with the participating partner or advisor, subject to applicable compliance rules.',
  'Business owners remain responsible for conducting due diligence, reviewing documents, and making informed decisions before entering into any financing arrangement.',
  'This platform may be updated over time to reflect market conditions, partner availability, and operating changes within capital workflows.',
];

export default function DisclosuresPage() {
  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-yellow px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow mb-6 bg-neo-white">Disclosures</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">Important disclosures.</h1>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="panel-block">
          <ul className="space-y-5 text-lg font-medium leading-relaxed">
            {disclosures.map((item) => (
              <li key={item} className="border-b border-neo-black/20 pb-4 last:border-b-0 last:pb-0">• {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
