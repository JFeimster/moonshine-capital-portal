import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Apply for Funding',
  description: 'Choose a short funding intake or continue to a fuller funding request when you are ready.',
  path: '/apply',
});

export default function ApplyHubPage() {
  return (
    <div className="bg-neo-white min-h-screen py-10 px-4 md:px-8 text-neo-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-9">
          <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-black uppercase leading-[.96] tracking-[-0.04em] mb-4">
            Apply for Funding
          </h1>
          <p className="text-base md:text-lg font-medium max-w-3xl mx-auto border-l-4 border-neo-orange pl-5 text-left">
            Choose a short funding intake to start a review, or continue to the full application when you are ready to provide more detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-neo-cream border-4 border-neo-black p-6 shadow-brutal flex flex-col relative h-full">
            <div className="absolute -top-6 -right-6 bg-neo-yellow border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3">Start Here</div>
            <div className="flex-grow">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Funding Intake</h2>
              <div className="bg-neo-black text-neo-white inline-block px-3 py-1 text-sm font-bold uppercase mb-6">Step 1</div>
              <p className="font-medium text-base mb-5">Start with the business basics, the amount requested, use of funds, and timing. Add more detail as the request is reviewed.</p>
              <ul className="space-y-3 font-bold mb-8">
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Funding amount + core business metrics</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Attribution and referral-ready intake</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Review first; deeper application only if needed</li>
              </ul>
            </div>
            <Link href="/apply/quote" className="mt-auto block w-full bg-neo-black text-neo-white text-center py-4 text-xl font-black uppercase tracking-wider border-2 border-transparent hover:bg-neo-yellow hover:text-neo-black hover:border-neo-black transition-colors shadow-brutal">Start Funding Review</Link>
          </div>

          <div className="bg-neo-cream border-4 border-neo-black p-6 shadow-brutal flex flex-col relative h-full">
            <div className="absolute -top-6 -left-6 bg-neo-pink border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 text-neo-white">Full Application</div>
            <div className="flex-grow">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 mt-2">Full Funding Application</h2>
              <div className="bg-neo-black text-neo-white inline-block px-3 py-1 text-sm font-bold uppercase mb-6">Step 2 / Direct Path</div>
              <p className="font-medium text-base mb-5">Use this route when a campaign, advisor, or prior conversation directed you to provide a fuller funding request.</p>
              <ul className="space-y-3 font-bold mb-8">
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Broader funding request path</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Wider funding amount range</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Keep this path available for direct campaigns and referrals</li>
              </ul>
            </div>
            <Link href="/apply/fast" className="mt-auto block w-full bg-neo-black text-neo-white text-center py-4 text-xl font-black uppercase tracking-wider border-2 border-transparent hover:bg-neo-pink hover:text-neo-white hover:border-neo-black transition-colors shadow-brutal">Complete Full Application</Link>
          </div>
        </div>

        <div className="mt-10 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 border-b-4 border-neo-black pb-2 inline-block">Not sure yet?</h3>
          <p className="font-medium text-lg mb-6">Review public advisor profiles and the contact options each advisor provides.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/directory" className="inline-block bg-neo-white text-neo-black font-bold border-2 border-neo-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">Browse Directory</Link>
            <Link href="/resources" className="inline-block bg-neo-cream text-neo-black font-bold border-2 border-neo-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-yellow transition-colors uppercase">Prepare Documents</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
