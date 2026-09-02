import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  resolveFundingFamilyBySlug,
  getPublicProductFamilies,
  getPublicFundingPages,
  getToolRegistry,
} from '@/lib/funding-registry';

export const revalidate = 3600;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const publicPages = getPublicFundingPages();
  const publicFamilies = getPublicProductFamilies();

  // Exclude structured-growth-loans and any non-public family
  const slugs = new Set<string>();

  publicPages.forEach((p) => {
    if (p.slug && p.slug !== 'funding' && p.slug !== 'structured-growth-loans') {
      slugs.add(p.slug);
    }
  });

  publicFamilies.forEach((f) => {
    if (f.slug && f.slug !== 'structured-growth-loans') {
      slugs.add(f.slug);
    }
    if (f.id && f.id !== 'structured-growth-loans') {
      slugs.add(f.id);
    }
  });

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = resolveFundingFamilyBySlug(params.slug);
  if (!resolved) return {};

  const { page, family } = resolved;
  const title = page.seo?.title || `${family.publicName || family.name} | Moonshine Capital`;
  const description = page.seo?.description || family.summary;

  return {
    title,
    description,
    alternates: {
      canonical: page.seo?.canonical || family.route || `/funding/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      images: page.seo?.ogImage ? [{ url: page.seo.ogImage }] : [],
    },
  };
}

export default function FundingFamilyPage({ params }: Props) {
  // Reject internal-only / deprecated families explicitly
  if (params.slug === 'structured-growth-loans') {
    notFound();
  }

  const resolved = resolveFundingFamilyBySlug(params.slug);
  if (!resolved) {
    notFound();
  }

  const { page, family, products, providers, relatedFamilies } = resolved;
  const toolRegistry = getToolRegistry();
  const tools = toolRegistry.tools || toolRegistry.entries || [];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black">
      {/* Hero */}
      <section className="relative border-b-4 border-amber-400 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2">
            <Link
              href="/funding"
              className="font-mono text-xs uppercase text-amber-400 hover:underline"
            >
              &larr; All Funding Lanes
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="font-mono text-xs uppercase text-zinc-400">
              {family.publicName || family.name}
            </span>
          </div>

          <span className="mt-6 inline-block border-2 border-amber-400 bg-amber-400/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-amber-400">
            {page.hero?.eyebrow || family.category}
          </span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
            {page.hero?.headline || family.publicName || family.name}
          </h1>
          <p className="mt-4 max-w-3xl font-sans text-lg text-zinc-300">
            {page.hero?.subheadline || family.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {family.primaryCta?.href && (
              <a
                href={family.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border-2 border-amber-400 bg-amber-400 px-6 py-3 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                {family.primaryCta.label || 'Get Started'}
              </a>
            )}
            {page.hero?.primaryCta?.href && page.hero.primaryCta.href !== family.primaryCta?.href && (
              <a
                href={page.hero.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border-2 border-white bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                {page.hero.primaryCta.label}
              </a>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Qualification Signals Card */}
        <section className="border-2 border-amber-400 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-2xl font-black uppercase text-amber-400">
            Qualification Basics &amp; Speed
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-mono text-sm">
            <div className="border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-xs uppercase text-zinc-500">Min Credit Score</div>
              <div className="mt-1 text-2xl font-black text-white">
                {family.qualificationSignals.minCreditScoreGuide != null
                  ? `${family.qualificationSignals.minCreditScoreGuide}+`
                  : 'N/A'}
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-xs uppercase text-zinc-500">Min Monthly Revenue</div>
              <div className="mt-1 text-2xl font-black text-white">
                {family.qualificationSignals.minMonthlyRevenueGuide != null
                  ? `$${family.qualificationSignals.minMonthlyRevenueGuide.toLocaleString()}`
                  : 'N/A'}
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-xs uppercase text-zinc-500">Time in Business</div>
              <div className="mt-1 text-2xl font-black text-white">
                {family.qualificationSignals.minTimeInBusinessMonthsGuide != null
                  ? `${family.qualificationSignals.minTimeInBusinessMonthsGuide} mos+`
                  : '0 mos'}
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-xs uppercase text-zinc-500">Typical Speed</div>
              <div className="mt-1 text-2xl font-black text-amber-400">
                {family.speedProfile?.typicalTimeToFunding || 'Varies'}
              </div>
            </div>
          </div>

          {family.commonUseCases && family.commonUseCases.length > 0 && (
            <div className="mt-6 border-t border-zinc-800 pt-4">
              <span className="font-mono text-xs uppercase text-zinc-400 font-bold">
                Common Use Cases:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {family.commonUseCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-300"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Products Grid */}
        <section>
          <div className="border-b-2 border-zinc-800 pb-4">
            <h2 className="text-2xl font-black uppercase text-amber-400 sm:text-3xl">
              Available Products ({products.length})
            </h2>
            <p className="mt-1 font-sans text-zinc-400">
              Specific funding structures and programs matching this lane.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col justify-between border-2 border-zinc-700 bg-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>{product.providerName}</span>
                    <span className="border border-zinc-700 bg-black px-2 py-0.5 text-amber-400">
                      {product.fundingType}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold uppercase text-white">
                    {product.name}
                  </h3>

                  <div className="mt-4 border-t border-zinc-800 pt-3 font-mono text-xs text-zinc-300 space-y-1">
                    <div>
                      Amount:{' '}
                      <span className="text-white font-bold">
                        {product.minAmount != null ? `$${product.minAmount.toLocaleString()}` : '$0'} -{' '}
                        {product.maxAmount != null ? `$${product.maxAmount.toLocaleString()}` : 'Custom'}
                      </span>
                    </div>
                    {product.termLength && <div>Term: {product.termLength}</div>}
                    {product.timeToFunding && (
                      <div>Speed: <span className="text-amber-400">{product.timeToFunding}</span></div>
                    )}
                  </div>
                </div>

                {family.primaryCta?.href && (
                  <div className="mt-6 border-t border-zinc-800 pt-4">
                    <a
                      href={family.primaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center border-2 border-amber-400 bg-amber-400 px-4 py-2 font-mono text-xs font-bold uppercase text-black transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                    >
                      {product.cta?.label || 'Check Eligibility'} &rarr;
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Providers */}
        {providers.length > 0 && (
          <section>
            <div className="border-b-2 border-zinc-800 pb-4">
              <h2 className="text-2xl font-black uppercase text-amber-400 sm:text-3xl">
                Partner Providers ({providers.length})
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="border-2 border-zinc-800 bg-zinc-900 p-4"
                >
                  <h3 className="font-bold text-white text-sm uppercase">
                    {provider.name}
                  </h3>
                  {provider.typicalBorrowerProfile && (
                    <p className="mt-2 text-zinc-400 font-sans line-clamp-2">
                      {provider.typicalBorrowerProfile}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Lanes */}
        {relatedFamilies.length > 0 && (
          <section>
            <div className="border-b-2 border-zinc-800 pb-4">
              <h2 className="text-2xl font-black uppercase text-amber-400 sm:text-3xl">
                Compare Related Funding Lanes
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFamilies.map((relFam) => (
                <Link
                  key={relFam.id}
                  href={relFam.route || `/funding/${relFam.slug}`}
                  className="block border-2 border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-amber-400"
                >
                  <h3 className="font-bold text-white uppercase text-sm">
                    {relFam.publicName || relFam.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2 font-sans">
                    {relFam.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Compliance Disclaimer */}
        <footer className="border-t-2 border-zinc-800 pt-8 text-xs font-mono text-zinc-500">
          <p className="uppercase font-bold text-zinc-400">Compliance &amp; Terms Disclaimer</p>
          <p className="mt-2 leading-relaxed">{page.compliance.disclaimer}</p>
        </footer>
      </main>
    </div>
  );
}
