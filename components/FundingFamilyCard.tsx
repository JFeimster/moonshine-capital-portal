import Link from 'next/link';
import type { FundingProductFamily } from '@/lib/funding-registry';

interface FundingFamilyCardProps {
  family: FundingProductFamily;
  compact?: boolean;
}

export function FundingFamilyCard({ family, compact = false }: FundingFamilyCardProps) {
  const qualification = family.qualificationSignals;
  const guideNotes = [
    qualification.minCreditScoreGuide ? `Credit guide: ${qualification.minCreditScoreGuide}+` : null,
    qualification.minMonthlyRevenueGuide ? `Revenue guide: $${qualification.minMonthlyRevenueGuide.toLocaleString()}/mo` : null,
    qualification.minTimeInBusinessMonthsGuide !== undefined
      ? `${qualification.minTimeInBusinessMonthsGuide} months in business guide`
      : null,
  ].filter(Boolean);

  return (
    <article className="flex h-full flex-col border-[3px] border-neo-black bg-neo-white shadow-brutal">
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="border-2 border-neo-black bg-neo-blue px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-neo-white">
            {family.category.replace(/[-_]/g, ' ')} funding
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-neo-black/60">Capital path</span>
        </div>
        <h2 className="text-2xl font-black uppercase leading-tight tracking-tight">
          {family.publicName || family.name}
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{family.summary}</p>

        {family.commonUseCases.length > 0 && (
          <div className="mt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-neo-blue">Common uses</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {family.commonUseCases.slice(0, compact ? 1 : 2).map((useCase) => (
                <li key={useCase} className="border border-neo-black/40 bg-neo-cream px-2 py-1 text-xs font-semibold">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        )}

        {family.bestFitBorrower.length > 0 && (
          <p className="mt-4 border-l-2 border-neo-green pl-3 text-xs font-semibold leading-relaxed">
            <span className="font-black uppercase">Often considered for: </span>{family.bestFitBorrower[0]}
          </p>
        )}

        {!compact && (
          <div className="mt-4 grid gap-3 border-t border-neo-black/15 pt-4 sm:grid-cols-2">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.12em] text-neo-blue">Qualification guides</h3>
              <p className="mt-1 text-xs font-medium leading-relaxed">
                {guideNotes.length ? guideNotes.join(' · ') : 'Provider requirements depend on the business and request.'}
              </p>
              <p className="mt-1 text-[10px] font-medium text-neo-black/60">Guide values are not approval criteria.</p>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.12em] text-neo-blue">Prepare</h3>
              <p className="mt-1 text-xs font-medium leading-relaxed">
                {family.requiredDocuments.slice(0, 2).join(' · ') || 'The advisor or provider may request documents based on the file.'}
              </p>
            </div>
          </div>
        )}

        {!compact && family.avoidWhen.length > 0 && (
          <p className="mt-3 border-l-2 border-neo-pink pl-3 text-xs font-medium leading-relaxed">
            <span className="font-black uppercase">Check carefully when: </span>{family.avoidWhen[0]}
          </p>
        )}

        <Link
          href={`/funding/${family.slug}`}
          className="btn-brutal-primary mt-auto w-full justify-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue"
        >
          Explore this funding type
        </Link>
      </div>
    </article>
  );
}
