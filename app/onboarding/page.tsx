import Link from 'next/link';
import { TallyEmbedSection } from '@/components/TallyEmbedSection';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Funding Agent Onboarding',
  description: 'Create your Funding Agent record first, then build the public-facing profile separately.',
  path: '/onboarding',
});

export default function OnboardingPage() {
  return (
    <div className="bg-neo-white min-h-screen py-24 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-block bg-neo-yellow border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 -rotate-1">Funding Agent OS</div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Join Moonshine Capital</h1>
        <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto">Create the agent identity first. Build the public profile second. Approval and publication stay controlled separately.</p>
      </div>
      <TallyEmbedSection />
      <div className="max-w-4xl mx-auto mt-10 flex justify-center">
        <Link href="/onboarding/profile" className="font-black uppercase underline decoration-4 decoration-neo-blue underline-offset-4 hover:text-neo-blue transition-colors">Already joined? Continue to profile builder →</Link>
      </div>
      <div className="max-w-4xl mx-auto mt-24">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-neo-black pb-2 inline-block">The Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neo-cream p-6 border-2 border-neo-black shadow-brutal"><div className="text-neo-blue font-black text-4xl mb-4">01</div><h4 className="font-bold text-lg uppercase mb-2">Create Agent Record</h4><p className="text-sm font-medium">Name, email, phone, referral context, agreement. Enough to create the canonical Funding Agent identity without a giant signup form.</p></div>
          <div className="bg-neo-cream p-6 border-2 border-neo-black shadow-brutal"><div className="text-neo-pink font-black text-4xl mb-4">02</div><h4 className="font-bold text-lg uppercase mb-2">Build Your Profile</h4><p className="text-sm font-medium">Add positioning, photo, specialties, service area and CTAs to enrich the same agent record.</p></div>
          <div className="bg-neo-cream p-6 border-2 border-neo-black shadow-brutal"><div className="text-neo-green font-black text-4xl mb-4">03</div><h4 className="font-bold text-lg uppercase mb-2">Review & Publish</h4><p className="text-sm font-medium">Profile enrichment does not bypass review. Public visibility still requires the canonical approval and publication gates.</p></div>
        </div>
      </div>
    </div>
  );
}
