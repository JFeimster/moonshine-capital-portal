import { TallyEmbedSection } from '@/components/TallyEmbedSection';

export default function OnboardingPage() {
  return (
    <div className="bg-neo-white min-h-screen py-24 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
          Join the Directory
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto">
          Distilled Funding is for operators who move money. If you have the capital and the speed, apply below to get listed.
        </p>
      </div>

      <TallyEmbedSection />

      <div className="max-w-4xl mx-auto mt-24">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-neo-black pb-2 inline-block">
          How it works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neo-cream p-6 border-2 border-neo-black shadow-brutal">
            <div className="text-neo-blue font-black text-4xl mb-4">01</div>
            <h4 className="font-bold text-lg uppercase mb-2">Submit Profile</h4>
            <p className="text-sm font-medium">Fill out the intake form with your agency details and funding specialties.</p>
          </div>
          <div className="bg-neo-cream p-6 border-2 border-neo-black shadow-brutal">
            <div className="text-neo-pink font-black text-4xl mb-4">02</div>
            <h4 className="font-bold text-lg uppercase mb-2">Review</h4>
            <p className="text-sm font-medium">We manually review applications to ensure only vetted operators are listed.</p>
          </div>
          <div className="bg-neo-cream p-6 border-2 border-neo-black shadow-brutal">
            <div className="text-neo-green font-black text-4xl mb-4">03</div>
            <h4 className="font-bold text-lg uppercase mb-2">Go Live</h4>
            <p className="text-sm font-medium">Once approved, your profile is published and visible to businesses seeking capital.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
