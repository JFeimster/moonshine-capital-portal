import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProductFamilyBySlug,
  getPublicProductFamilies,
  getFundingPageForFamily,
  getProductsByFamily,
  getProvidersByFamily,
  getRelatedFamilies,
  getFundingTools,
} from '@/lib/funding-registry';

export const revalidate = 3600;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const families = await getPublicProductFamilies();
  return families.map((family) => ({
    slug: family.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const family = await getProductFamilyBySlug(params.slug);
  if (!family) return {};

  const page = await getFundingPageForFamily(params.slug);

  return {
    title: page?.seo?.title || `${family.publicName || family.name} | Moonshine Capital`,
    description: page?.seo?.description || family.summary,
    openGraph: {
      title: page?.seo?.ogTitle || family.publicName || family.name,
      description: page?.seo?.ogDescription || family.summary,
    },
  };
}

export default async function FundingLanePage({ params }: PageProps) {
  const family = await getProductFamilyBySlug(params.slug);
  if (!family) {
    notFound();
  }

  const page = await getFundingPageForFamily(params.slug);
  const products = await getProductsByFamily(params.slug);
  const providers = await getProvidersByFamily(params.slug);
  const relatedFamilies = await getRelatedFamilies(params.slug);
  const tools = await getFundingTools(
    page?.dataRefs?.featuredToolIds || family.relatedToolIds
  );

  const hero = {
    eyebrow: page?.hero?.eyebrow || 'Moonshine Capital Funding Paths',
    headline: page?.hero?.headline || family.publicName || family.name,
    subheadline: page?.hero?.subheadline || family.summary,
    primaryCta: page?.hero?.primaryCta || family.primaryCta || {
      label: 'Get a Funding Quote',
      href: 'https://tally.so/r/mDEJB5',
    },
    secondaryCta: page?.hero?.secondaryCta || {
      label: 'Funding for Any Reason',
      href: 'https://tally.so/r/w4R2Ad',
    },
  };

  const disclaimer =
    page?.compliance?.disclaimer ||
    'Funding availability, terms, speed, and eligibility vary by provider, applicant profile, documentation, and underwriting review. No approval or funding outcome is guaranteed.';

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 md:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <Link
          href="/funding"
          className="text-xs font-bold text-yellow-400 uppercase tracking-wider hover:underline"
        >
          {'← All Funding Lanes'}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="border-4 border-white bg-neutral-900 p-8 md:p-12 mb-12 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-bold text-xs uppercase tracking-wider mb-4 border-2 border-black">
          {hero.eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase">
          {hero.headline}
        </h1>
        <p className="text-xl text-neutral-300 max-w-3xl mb-8 leading-relaxed">
          {hero.subheadline}
        </p>

        <div className="flex flex-wrap gap-4">
          {hero.primaryCta?.href && (
            <a
              href={hero.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-black font-black px-8 py-4 uppercase tracking-wider border-2 border-black hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              {hero.primaryCta.label}
            </a>
          )}
          {hero.secondaryCta?.href && (
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-800 text-white font-bold px-8 py-4 uppercase tracking-wider border-2 border-white hover:bg-neutral-700 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              {hero.secondaryCta.label}
            </a>
          )}
        </div>
      </section>

      {/* Qualification Signals & Best Fit */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Qualification Matrix */}
        <div className="border-2 border-white bg-neutral-900 p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-neutral-700 pb-3">
            Qualification Signals
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-neutral-400 font-bold uppercase text-xs">Min Credit Score</span>
              <span className="font-bold text-yellow-400">
                {family.qualificationSignals?.minCreditScoreGuide
                  ? `${family.qualificationSignals.minCreditScoreGuide}+`
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-neutral-400 font-bold uppercase text-xs">Min Monthly Revenue</span>
              <span className="font-bold text-yellow-400">
                {family.qualificationSignals?.minMonthlyRevenueGuide
                  ? `$${family.qualificationSignals.minMonthlyRevenueGuide.toLocaleString()}`
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-neutral-400 font-bold uppercase text-xs">Time in Business</span>
              <span className="font-bold text-yellow-400">
                {family.qualificationSignals?.minTimeInBusinessMonthsGuide !== undefined
                  ? `${family.qualificationSignals.minTimeInBusinessMonthsGuide} months`
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-neutral-400 font-bold uppercase text-xs">Speed to Funding</span>
              <span className="font-bold text-yellow-400">{family.speedProfile || 'Varies'}</span>
            </div>
          </div>

          {family.requiredDocuments && family.requiredDocuments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-bold uppercase text-neutral-400 mb-2">Required Documents</h3>
              <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1">
                {family.requiredDocuments.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fit Profiles */}
        <div className="border-2 border-white bg-neutral-900 p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-neutral-700 pb-3">
              Best Fit & Cautions
            </h2>

            {family.bestFitBorrower && family.bestFitBorrower.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase text-green-400 mb-2">Best Fit Borrower</h3>
                <ul className="space-y-2 text-xs text-neutral-200">
                  {family.bestFitBorrower.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-400 mr-2 font-bold font-mono">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {family.avoidWhen && family.avoidWhen.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-red-400 mb-2">Avoid When</h3>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {family.avoidWhen.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-400 mr-2 font-bold font-mono">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {family.fastDisqualifiers && family.fastDisqualifiers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-bold uppercase text-neutral-400 mb-2">Fast Disqualifiers</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {family.fastDisqualifiers.join(', ')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Available Products Grid */}
      {products.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b-4 border-white pb-4">
            <h2 className="text-3xl font-black uppercase">Available Products</h2>
            <span className="text-yellow-400 font-bold">{products.length} Products</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border-2 border-white bg-neutral-900 p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase bg-neutral-800 px-2 py-1 text-neutral-300">
                      {product.fundingType}
                    </span>
                    <span className="text-xs font-bold text-yellow-400">{product.timeToFunding}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-xs font-semibold text-neutral-400 mb-4">
                    Provider: {product.providerName}
                  </p>

                  <div className="bg-black p-3 border border-neutral-800 space-y-1.5 text-xs mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Amount Range:</span>
                      <span className="font-bold">
                        ${product.minAmount.toLocaleString()} - ${product.maxAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Rate / Cost:</span>
                      <span className="font-bold">{product.rateCostRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Term:</span>
                      <span className="font-bold">{product.termLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Min Credit / Rev:</span>
                      <span className="font-bold">
                        {product.minCreditScore || 'Any'} / ${product.minMonthlyRevenue?.toLocaleString() || 0}/mo
                      </span>
                    </div>
                  </div>
                </div>

                {hero.primaryCta?.href && (
                  <a
                    href={hero.primaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-yellow-400 text-black font-black py-2.5 text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors border border-black"
                  >
                    {`${product.cta?.label || hero.primaryCta.label} →`}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Providers */}
      {providers.length > 0 && (
        <section className="mb-16">
          <div className="border-b-4 border-white pb-4 mb-8">
            <h2 className="text-3xl font-black uppercase">Participating Providers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="border border-neutral-700 bg-neutral-900 p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg mb-2">{provider.name}</h3>
                  <p className="text-neutral-400 text-xs mb-3 line-clamp-2">
                    {provider.typicalBorrowerProfile}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {provider.financingProducts.slice(0, 3).map((prod, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 border border-neutral-700"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Funding Lanes */}
      {relatedFamilies.length > 0 && (
        <section className="mb-16">
          <div className="border-b-4 border-white pb-4 mb-8">
            <h2 className="text-3xl font-black uppercase">Other Funding Lanes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedFamilies.map((relFamily) => (
              <Link
                key={relFamily.id}
                href={`/funding/${relFamily.slug}`}
                className="border-2 border-neutral-700 bg-neutral-900 p-4 hover:border-yellow-400 transition-colors block"
              >
                <h3 className="font-bold text-lg mb-1">{relFamily.publicName || relFamily.name}</h3>
                <p className="text-neutral-400 text-xs line-clamp-2 mb-3">{relFamily.summary}</p>
                <span className="text-xs text-yellow-400 font-bold uppercase">{'Explore Lane →'}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Compliance Disclaimer */}
      <footer className="border-t-2 border-neutral-800 pt-8 mt-16 text-neutral-500 text-xs leading-relaxed">
        <p className="font-bold text-neutral-400 uppercase mb-2">Compliance Notice</p>
        <p>{disclaimer}</p>
      </footer>
    </main>
  );
}
