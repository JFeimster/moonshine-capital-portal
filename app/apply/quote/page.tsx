import { TallyFormEmbed } from '@/components/TallyFormEmbed';
import Link from 'next/link';

export const metadata = {
  title: 'Personalized Funding Quote | Distilled Funding',
  description: 'Get a personalized funding quote with no hard credit check. See your best options before committing.',
};

export default function QuoteApplyPage() {
  return (
    <div className="bg-neo-white min-h-screen py-16 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 font-bold hover:text-neo-blue transition-colors mb-8"
        >
          <span className="text-xl">←</span> Back to all application paths
        </Link>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Personalized Quote
        </h1>
        <p className="text-xl font-medium max-w-2xl border-l-4 border-neo-blue pl-4 mb-12">
          See what you qualify for before making a commitment. This path uses a soft pull only and won&apos;t affect your credit score.
        </p>

        <TallyFormEmbed
          formId="mDEJB5"
          title="Get Your Options"
          description="Provide your business details below to see tailored funding options."
          badgeText="Quote"
          badgeColor="blue"
        />
      </div>
    </div>
  );
}
