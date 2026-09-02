import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBrokerBySlug } from '@/lib/brokers';
import { buildTrackedOutUrl } from '@/lib/distribution';
import { constructMetadata } from '@/lib/seo';

const campaignCopy: Record<string, { eyebrow: string; headline: string; summary: string; useCases: string[] }> = {
  hvac: {
    eyebrow: 'HVAC financing',
    headline: 'Capital for the service business that keeps jobs moving.',
    summary: 'Support working capital and growth financing for HVAC operations, equipment, staffing, and job-site execution.',
    useCases: ['Working capital', 'Fleet and equipment', 'Seasonal cash flow']
  },
  'business-acquisition': {
    eyebrow: 'Business acquisition',
    headline: 'Use capital to buy the right operating asset.',
    summary: 'Match acquisition financing with a disciplined process for evaluating purchase price, leverage, and ongoing operational fit.',
    useCases: ['Acquisition financing', 'Buy-and-build', 'Operational transition']
  },
  'working-capital': {
    eyebrow: 'Working capital',
    headline: 'Keep the business moving without the financing drag.',
    summary: 'Address payroll, inventory, cash cycles, and operational pressure without forcing a weak or misaligned capital structure.',
    useCases: ['Payroll support', 'Inventory', 'Cash flow coverage']
  },
};

export async function generateMetadata({ params }: { params: { slug: string; campaign: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  const campaign = campaignCopy[params.campaign] || { eyebrow: 'Funding campaign', headline: 'Capital route', summary: 'A focused path to funding support.', useCases: ['Funding review', 'Advisor guidance'] };
  if (!broker) {
    return constructMetadata({
      title: campaign.headline,
      description: campaign.summary,
      path: '/directory',
      noindex: true,
    });
  }

  return constructMetadata({
    title: `${broker.fullName} | ${campaign.eyebrow}`,
    description: `${campaign.summary}`,
    path: `/${broker.slug}/campaign/${params.campaign}`,
  });
}

export default async function CampaignPage({ params }: { params: { slug: string; campaign: string } }) {
  const broker = await getBrokerBySlug(params.slug);
  if (!broker) notFound();

  const campaign = campaignCopy[params.campaign] || {
    eyebrow: 'Funding campaign',
    headline: 'A focused path to the right capital conversation.',
    summary: 'Use this route to start a capital conversation with a funding advisor and identify the most practical next step.',
    useCases: ['Initial funding review', 'Advisor fit', 'Capital path guidance'],
  };

  const applyUrl = buildTrackedOutUrl(broker, 'apply', { source: 'partner_campaign_page', campaign: params.campaign });
  const bookingUrl = broker.bookingUrl ? buildTrackedOutUrl(broker, 'booking', { source: 'partner_campaign_page', campaign: params.campaign }) : null;

  return (
    <main className="bg-neo-white text-neo-black">
      <section className="border-b-4 border-neo-black bg-neo-yellow px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link href={`/${broker.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-neo-black hover:text-neo-blue">
            ← Back to {broker.fullName}
          </Link>
          <span className="eyebrow mb-6 bg-neo-white">{campaign.eyebrow}</span>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-6xl">{campaign.headline}</h1>
          <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed md:text-2xl">{campaign.summary}</p>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel-block">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter">Relevant use cases</h2>
            <div className="flex flex-wrap gap-3">
              {campaign.useCases.map((item) => (
                <span key={item} className="border-2 border-neo-black bg-neo-green px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">{item}</span>
              ))}
            </div>
          </div>

          <div className="panel-block bg-neo-black text-neo-white border-neo-white">
            <h2 className="mb-5 text-3xl font-black uppercase tracking-tighter text-neo-yellow">Move forward</h2>
            <div className="space-y-4">
              <a href={applyUrl} className="btn-brutal-primary block w-full bg-neo-yellow text-neo-black">Apply for Funding</a>
              {bookingUrl && <a href={bookingUrl} className="btn-brutal block w-full bg-neo-white text-neo-black">Book with {broker.fullName}</a>}
              <Link href={`/${broker.slug}/apply`} className="btn-brutal-dark block w-full">Review Intake</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
