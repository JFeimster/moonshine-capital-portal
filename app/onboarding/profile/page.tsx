import Link from 'next/link';
import { TallyFormEmbed } from '@/components/TallyFormEmbed';

export const metadata = {
  title: 'Build Your Funding Agent Profile | Moonshine Capital',
  description: 'Enrich your existing Funding Agent record with public profile details, specialties, service area and conversion links.',
};

export default function FundingAgentProfileOnboardingPage() {
  return (
    <div className="bg-neo-black min-h-screen py-20 px-6 md:px-12 text-neo-white">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 font-bold text-neo-yellow hover:text-neo-white transition-colors mb-8"
        >
          <span className="text-xl">←</span> Back to Funding Agent signup
        </Link>

        <div className="mb-12">
          <div className="inline-block bg-neo-pink text-neo-white border-2 border-neo-white px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] mb-8 rotate-1">
            Step 2 — Profile
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Build A Profile Worth Sharing
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl border-l-4 border-neo-green pl-6">
            Use the same email from Step 1. This enriches the existing Funding Agent record; it does not independently approve or publish the profile.
          </p>
        </div>

        <TallyFormEmbed
          formId="9qjWEE"
          title="Build Your Funding Agent Profile"
          description="Add the details clients actually need: positioning, photo, specialties, service area, target clients and the CTA you want the profile to drive."
          badgeText="Profile Enrichment"
          badgeColor="green"
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neo-blue text-neo-black border-4 border-neo-white p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-2xl font-black uppercase mb-3">What happens next?</h2>
            <p className="font-bold">
              The profile data is attached to your canonical record and remains subject to the existing review and public-publish controls.
            </p>
          </div>
          <div className="bg-neo-yellow text-neo-black border-4 border-neo-white p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-2xl font-black uppercase mb-3">Build the operating plan</h2>
            <p className="font-bold mb-4">
              After the profile, the optional launch-plan step captures goals, activity and operating commitments.
            </p>
            <Link href="/onboarding/launch" className="font-black uppercase underline decoration-4 underline-offset-4">
              Launch Your Agency →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
