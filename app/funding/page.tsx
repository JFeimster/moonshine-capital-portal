import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getFundingPagesRegistry,
  getPublicProductFamilies,
  getProductsRegistry,
  getProvidersRegistry,
  getToolRegistry,
  FundingPage,
  ProductFamily,
} from '@/lib/funding-registry';

export const revalidate = 3600;

export async function generateMetadata() {
  const pagesData = getFundingPagesRegistry();
  const hubPage = pagesData.pages.find((p) => p.id === 'funding' && p.visibility === 'public');
  if (!hubPage) return {};

  return {
    title: hubPage.seo?.title || 'Business Funding Options | Moonshine Capital',
    description: hubPage.seo?.description || 'Explore working capital, business lines of credit, startup funding, equipment financing, real estate capital, and marketplace seller funding options.',
    alternates: {
      canonical: hubPage.seo?.canonical || '/funding',
    },
    openGraph: {
      title: hubPage.seo?.ogTitle || hubPage.seo?.title,
      description: hubPage.seo?.ogDescription || hubPage.seo?.description,
      images: hubPage.seo?.ogImage ? [{ url: hubPage.seo.ogImage }] : [],
    },
  };
}

export default function FundingHubPage() {
  const pagesData = getFundingPagesRegistry();
  const hubPage = pagesData.pages.find((p) => p.id === 'funding' && p.visibility === 'public');
  if (!hubPage) {
    notFound();
  }

  const publicFamilies = getPublicProductFamilies();
  const productsRegistry = getProductsRegistry();
  const providersRegistry = getProvidersRegistry();
  const toolRegistry = getToolRegistry();
  const tools = toolRegistry.tools || toolRegistry.entries || [];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black">
      {/* Hero Section */}
      <section className="relative border-b-4 border-amber-400 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <span className="inline-block border-2 border-amber-400 bg-amber-400/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-amber-400">
            {hubPage.hero.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
            {hubPage.hero.headline}
          </h1>
          <p className="mt-4 max-w-3xl font-sans text-lg text-zinc-300">
            {hubPage.hero.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {hubPage.hero.primaryCta?.href && (
              <a
                href={hubPage.hero.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border-2 border-amber-400 bg-amber-400 px-6 py-3 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                {hubPage.hero.primaryCta.label}
              </a>
            )}
            {hubPage.hero.secondaryCta?.href && (
              <a
                href={hubPage.hero.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border-2 border-white bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                {hubPage.hero.secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Sections */}
        {hubPage.sections.map((section) => {
          if (section.type === 'product-family-grid') {
            return (
              <section key={section.id} className="mb-16">
                <div className="border-b-2 border-zinc-800 pb-4">
                  <h2 className="text-2xl font-black uppercase text-amber-400 sm:text-3xl">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="mt-1 font-sans text-zinc-400">{section.description}</p>
                  )}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {publicFamilies.map((family) => {
                    const productCount = productsRegistry.familyCounts[family.id] || 0;
                    const pageSlug = family.slug || family.id;

                    return (
                      <div
                        key={family.id}
                        className="flex flex-col justify-between border-2 border-zinc-700 bg-zinc-900 p-6 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] transition-all hover:border-amber-400"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs uppercase text-amber-400">
                              {family.category}
                            </span>
                            <span className="border border-zinc-700 bg-black px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                              {productCount} {productCount === 1 ? 'Product' : 'Products'}
                            </span>
                          </div>
                          <h3 className="mt-3 text-xl font-bold uppercase text-white">
                            {family.publicName || family.name}
                          </h3>
                          <p className="mt-2 text-sm text-zinc-300 line-clamp-3">
                            {family.summary}
                          </p>

                          {family.qualificationSignals && (
                            <div className="mt-4 border-t border-zinc-800 pt-3 font-mono text-xs text-zinc-400 space-y-1">
                              {family.qualificationSignals.minCreditScoreGuide != null && (
                                <div>Min Credit: {family.qualificationSignals.minCreditScoreGuide}+</div>
                              )}
                              {family.qualificationSignals.minMonthlyRevenueGuide != null && (
                                <div>Min Rev: ${family.qualificationSignals.minMonthlyRevenueGuide.toLocaleString()}/mo</div>
                              )}
                              {family.qualificationSignals.minTimeInBusinessMonthsGuide != null && (
                                <div>TIB: {family.qualificationSignals.minTimeInBusinessMonthsGuide} mos+</div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-6 border-t border-zinc-800 pt-4">
                          <Link
                            href={family.route || `/funding/${pageSlug}`}
                            className="inline-flex w-full items-center justify-center border-2 border-amber-400 bg-amber-400/10 px-4 py-2 font-mono text-xs font-bold uppercase text-amber-400 transition-colors hover:bg-amber-400 hover:text-black"
                          >
                            Explore {family.publicName || family.name} &rarr;
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          if (section.type === 'qualification-band-table') {
            return (
              <section key={section.id} className="mb-16 border-2 border-zinc-800 bg-zinc-950 p-6 sm:p-8">
                <h2 className="text-2xl font-black uppercase text-amber-400">
                  {section.title}
                </h2>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left font-mono text-sm text-zinc-300">
                    <thead className="border-b-2 border-amber-400 bg-zinc-900 text-xs uppercase text-amber-400">
                      <tr>
                        <th className="px-4 py-3">Funding Lane</th>
                        <th className="px-4 py-3">Min Credit Score</th>
                        <th className="px-4 py-3">Min Monthly Rev</th>
                        <th className="px-4 py-3">Time in Biz</th>
                        <th className="px-4 py-3">Speed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {publicFamilies.map((fam) => (
                        <tr key={fam.id} className="hover:bg-zinc-900/50">
                          <td className="px-4 py-3 font-bold text-white">
                            {fam.publicName || fam.name}
                          </td>
                          <td className="px-4 py-3">
                            {fam.qualificationSignals.minCreditScoreGuide ?? 'None'}
                          </td>
                          <td className="px-4 py-3">
                            {fam.qualificationSignals.minMonthlyRevenueGuide
                              ? `$${fam.qualificationSignals.minMonthlyRevenueGuide.toLocaleString()}`
                              : 'None'}
                          </td>
                          <td className="px-4 py-3">
                            {fam.qualificationSignals.minTimeInBusinessMonthsGuide
                              ? `${fam.qualificationSignals.minTimeInBusinessMonthsGuide} mos`
                              : '0 mos'}
                          </td>
                          <td className="px-4 py-3 text-amber-400">
                            {fam.speedProfile?.typicalTimeToFunding || 'Varies'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          }

          if (section.type === 'tool-grid') {
            return (
              <section key={section.id} className="mb-16">
                <div className="border-b-2 border-zinc-800 pb-4">
                  <h2 className="text-2xl font-black uppercase text-amber-400">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.slice(0, 6).map((tool, idx) => (
                    <div
                      key={tool.id || tool.slug || idx}
                      className="border-2 border-zinc-800 bg-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                    >
                      <h3 className="font-bold text-white uppercase text-base">
                        {tool.title || tool.name}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                        {tool.description || tool.problem}
                      </p>
                      {tool.ctaHref && (
                        <a
                          href={tool.ctaHref}
                          className="mt-4 inline-block font-mono text-xs font-bold uppercase text-amber-400 hover:underline"
                        >
                          {tool.ctaLabel || 'Launch Tool'} &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === 'form-embed') {
            return (
              <section key={section.id} className="mb-12 border-2 border-amber-400 bg-amber-400/10 p-8 text-center">
                <h2 className="text-2xl font-black uppercase text-amber-400">
                  {section.title}
                </h2>
                <p className="mt-2 text-zinc-300 max-w-xl mx-auto">
                  Find out which capital lane fits your profile in under 2 minutes.
                </p>
                <div className="mt-6">
                  <a
                    href={`https://tally.so/r/${section.formId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center border-2 border-amber-400 bg-amber-400 px-8 py-4 font-mono text-base font-black uppercase text-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1"
                  >
                    Start Prequalification
                  </a>
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* Compliance Disclaimer */}
        <footer className="mt-16 border-t-2 border-zinc-800 pt-8 text-xs font-mono text-zinc-500">
          <p className="uppercase font-bold text-zinc-400">Compliance &amp; Terms Disclaimer</p>
          <p className="mt-2 leading-relaxed">{hubPage.compliance.disclaimer}</p>
        </footer>
      </main>
    </div>
  );
}
