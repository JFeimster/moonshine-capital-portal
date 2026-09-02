import { TallyFormEmbed } from '@/components/TallyFormEmbed';
import { constructMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata = constructMetadata({
  title: 'Personalized Funding Quote',
  description: 'Start with a short business funding intake so we can review your needs and identify the most appropriate next step.',
  path: '/apply/quote',
});

export default function QuoteApplyPage() {
  return (
    <div className="bg-neo-white min-h-screen py-16 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/apply" className="inline-flex items-center gap-2 font-bold hover:text-neo-blue transition-colors mb-8"><span className="text-xl">←</span> Back to all application paths</Link>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Personalized Funding Intake</h1>
        <p className="text-xl font-medium max-w-2xl border-l-4 border-neo-blue pl-4 mb-12">Start here. Give us the core business and funding details we need to review your situation and determine the most useful next step. Submitting this intake does not guarantee approval or funding.</p>
        <TallyFormEmbed formId="dWvEqN" title="Start Your Funding Review" description="Share your funding need, business metrics, and contact details. If a fuller application is appropriate, we can move you into that next step without making this first interaction heavier than it needs to be." badgeText="Step 1" badgeColor="blue" />
      </div>
    </div>
  );
}
