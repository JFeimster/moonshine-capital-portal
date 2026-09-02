import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Apply for Funding',
  description: 'Start with a short funding intake, then complete the broader application when a full underwriting path is appropriate.',
  path: '/apply',
});

export default function ApplyHubPage() {
  return (
    <div className="bg-neo-white min-h-screen py-24 px-6 md:px-12 text-neo-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Get Funded
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto border-l-4 border-neo-orange pl-6">
            Start light. Go deeper only when it makes sense. Use the funding intake first, then move into the broader application when the review calls for it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-neo-cream border-4 border-neo-black p-8 shadow-brutal flex flex-col relative h-full">
            <div className="absolute -top-6 -right-6 bg-neo-yellow border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3">Start Here</div>
            <div className="flex-grow">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Funding Intake</h2>
              <div className="bg-neo-black text-neo-white inline-block px-3 py-1 text-sm font-bold uppercase mb-6">Step 1</div>
              <p className="font-medium text-lg mb-6">Best for founders who want a useful first review without dumping a full underwriting packet into the first interaction.</p>
              <ul className="space-y-3 font-bold mb-8">
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Funding amount + core business metrics</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Attribution and referral-ready intake</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Review first; deeper application only if needed</li>
              </ul>
            </div>
            <Link href="/apply/quote" className="mt-auto block w-full bg-neo-black text-neo-white text-center py-4 text-xl font-black uppercase tracking-wider border-2 border-transparent hover:bg-neo-yellow hover:text-neo-black hover:border-neo-black transition-colors shadow-brutal">Start Funding Review</Link>
          </div>

          <div className="bg-neo-cream border-4 border-neo-black p-8 shadow-brutal flex flex-col relative h-full">
            <div className="absolute -top-6 -left-6 bg-neo-pink border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 text-neo-white">Full Application</div>
            <div className="flex-grow">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 mt-2">Funding for Any Reason</h2>
              <div className="bg-neo-black text-neo-white inline-block px-3 py-1 text-sm font-bold uppercase mb-6">Step 2 / Direct Path</div>
              <p className="font-medium text-lg mb-6">Use the broader application when you are ready for a more complete funding request or have already been directed here after the initial review.</p>
              <ul className="space-y-3 font-bold mb-8">
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Broader funding request path</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Wider funding amount range</li>
                <li className="flex items-center gap-3"><span className="w-5 h-5 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>Keep this path available for direct campaigns and referrals</li>
              </ul>
            </div>
            <Link href="/apply/fast" className="mt-auto block w-full bg-neo-black text-neo-white text-center py-4 text-xl font-black uppercase tracking-wider border-2 border-transparent hover:bg-neo-pink hover:text-neo-white hover:border-neo-black transition-colors shadow-brutal">Complete Full Application</Link>
          </div>
        </div>

        <div className="mt-24 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 border-b-4 border-neo-black pb-2 inline-block">Not sure yet?</h3>
          <p className="font-medium text-lg mb-6">Browse our directory of vetted operators and reach out to them directly.</p>
          <Link href="/directory" className="inline-block bg-neo-white text-neo-black font-bold border-2 border-neo-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">Browse Directory</Link>
        </div>
      </div>
    </div>
  );
}
