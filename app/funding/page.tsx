import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getFundingHubPage,
  getPublicProductFamilies,
  getFundingTools,
} from '@/lib/funding-registry';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFundingHubPage();
  if (!page) {
    return {
      title: 'Business Funding Options | Moonshine Capital',
      description: 'Compare funding lanes, qualification basics, tools, and next steps.',
    };
  }

  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: {
      title: page.seo.ogTitle || page.seo.title,
      description: page.seo.ogDescription || page.seo.description,
    },
  };
}

export default async function FundingPage() {
  const page = await getFundingHubPage();
  const productFamilies = await getPublicProductFamilies();
  const tools = await getFundingTools(page?.dataRefs?.featuredToolIds);

  const hero = page?.hero || {
    eyebrow: 'Moonshine Capital Funding Paths',
    headline: 'Find the capital lane that fits your needs.',
    subheadline: 'Compare funding options by speed, credit profile, revenue, and documentation burden.',
    primaryCta: {
      label: 'Get a Funding Quote',
      href: 'https://tally.so/r/mDEJB5',
    },
    secondaryCta: {
      label: 'Funding for Any Reason',
      href: 'https://tally.so/r/w4R2Ad',
    },
  };

  const disclaimer =
    page?.compliance?.disclaimer ||
    'Funding availability, terms, speed, and eligibility vary by provider, applicant profile, documentation, and underwriting review. No approval or funding outcome is guaranteed.';

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 md:px-8 max-w-7xl mx-auto">
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

      {/* Product Families Grid Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8 border-b-4 border-white pb-4">
          <h2 className="text-3xl font-black uppercase">Funding Lanes</h2>
          <span className="text-yellow-400 font-bold">{productFamilies.length} Lanes Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productFamilies.map((family) => (
            <div
              key={family.id}
              className="border-2 border-white bg-neutral-900 p-6 flex flex-col justify-between hover:border-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase bg-neutral-800 px-2 py-1 text-neutral-300 border border-neutral-700">
                    {family.category}
                  </span>
                  {family.speedProfile && (
                    <span className="text-xs font-bold text-yellow-400">
                      ⚡ {family.speedProfile}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black mb-3">{family.publicName || family.name}</h3>
                <p className="text-neutral-400 text-sm mb-6 line-clamp-3">{family.summary}</p>

                {/* Qualification Signals */}
                <div className="bg-black p-4 border border-neutral-800 mb-6 space-y-2 text-xs">
                  <div className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider mb-1">
                    Qualification Signals
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Min Credit:</span>
                    <span className="font-bold">
                      {family.qualificationSignals?.minCreditScoreGuide
                        ? `${family.qualificationSignals.minCreditScoreGuide}+`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Min Monthly Rev:</span>
                    <span className="font-bold">
                      {family.qualificationSignals?.minMonthlyRevenueGuide
                        ? `$${family.qualificationSignals.minMonthlyRevenueGuide.toLocaleString()}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Time in Business:</span>
                    <span className="font-bold">
                      {family.qualificationSignals?.minTimeInBusinessMonthsGuide !== undefined
                        ? `${family.qualificationSignals.minTimeInBusinessMonthsGuide} mos`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/funding/${family.slug}`}
                className="block text-center bg-white text-black font-black py-3 uppercase tracking-wider hover:bg-yellow-400 transition-colors border border-black"
              >
                Explore Lane →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools Section */}
      {tools.length > 0 && (
        <section className="mb-16">
          <div className="border-b-4 border-white pb-4 mb-8">
            <h2 className="text-3xl font-black uppercase">Funding Tools & Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <div
                key={tool.id || tool.slug || idx}
                className="border-2 border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between"
              >
                <div>
                  {tool.brand && (
                    <span className="text-[10px] font-bold uppercase bg-yellow-400 text-black px-2 py-0.5 mb-2 inline-block">
                      {tool.brand}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">{tool.name || tool.slug}</h3>
                  <p className="text-neutral-400 text-xs mb-4">{tool.problem || tool.persona}</p>
                </div>
                {tool.ctaHref && (
                  <a
                    href={tool.ctaHref as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-yellow-400 hover:underline uppercase tracking-wider mt-auto"
                  >
                    {(tool.ctaLabel as string) || 'Access Tool'} →
                  </a>
                )}
              </div>
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
