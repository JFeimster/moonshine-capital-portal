import Link from 'next/link';
import { TallyFormEmbed } from '@/components/TallyFormEmbed';

export const metadata = {
  title: 'Launch Your Agency | Moonshine Capital',
  description: 'Capture the operating plan, goals and activity commitments for your Funding Agent or agency launch.',
};

export default function FundingAgentLaunchPage() {
  return (
    <div className="bg-neo-white min-h-screen py-20 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/onboarding/profile"
          className="inline-flex items-center gap-2 font-bold hover:text-neo-pink transition-colors mb-8"
        >
          <span className="text-xl">←</span> Back to profile builder
        </Link>

        <div className="mb-12">
          <div className="inline-block bg-neo-orange border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 -rotate-1">
            Step 3 — Operating Plan
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Turn The Agent Record Into A Plan
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl border-l-4 border-neo-orange pl-6">
            Set your path, goals, time commitment and activity plan. This step enriches internal operating context only; it has no authority to approve or publish a profile.
          </p>
        </div>

        <TallyFormEmbed
          formId="A7edqy"
          title="Launch Your Agency"
          description="Lock in the operating plan you are willing to execute: goals, capacity, business-owner conversations and first-30-day priorities."
          badgeText="Launch Plan"
          badgeColor="orange"
        />
      </div>
    </div>
  );
}
