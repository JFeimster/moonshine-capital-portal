import Link from 'next/link';

export const metadata = {
  title: 'Apply for Funding | Distilled Funding',
  description: 'Choose the best application path for your business funding needs. Get a personalized quote or apply fast for any reason.',
};

export default function ApplyHubPage() {
  return (
    <div className="bg-neo-white min-h-screen py-24 px-6 md:px-12 text-neo-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Get Funded
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto border-l-4 border-neo-orange pl-6">
            We move money fast. Choose the application path below that best fits your immediate timeline and capital needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Path 1: Personalized Quote */}
          <div className="bg-neo-cream border-4 border-neo-black p-8 shadow-brutal flex flex-col relative h-full">
            <div className="absolute -top-6 -right-6 bg-neo-yellow border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3">
              Most Popular
            </div>

            <div className="flex-grow">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                Personalized Quote
              </h2>
              <div className="bg-neo-black text-neo-white inline-block px-3 py-1 text-sm font-bold uppercase mb-6">
                No Hard Credit Check
              </div>

              <p className="font-medium text-lg mb-6">
                Best for founders who want to see their options before committing. Get matched with the right funding products based on your specific business metrics.
              </p>

              <ul className="space-y-3 font-bold mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>
                  Soft pull only — won&apos;t hurt your score
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>
                  See multiple tailored options
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>
                  Connect with specialized operators
                </li>
              </ul>
            </div>

            <Link
              href="/apply/quote"
              className="mt-auto block w-full bg-neo-black text-neo-white text-center py-4 text-xl font-black uppercase tracking-wider border-2 border-transparent hover:bg-neo-yellow hover:text-neo-black hover:border-neo-black transition-colors shadow-brutal"
            >
              Get My Quote
            </Link>
          </div>

          {/* Path 2: Funding for ANY Reason */}
          <div className="bg-neo-cream border-4 border-neo-black p-8 shadow-brutal flex flex-col relative h-full">
            <div className="absolute -top-6 -left-6 bg-neo-pink border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 text-neo-white">
              Fastest Path
            </div>

            <div className="flex-grow">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 mt-2">
                Speed Application
              </h2>
              <div className="bg-neo-black text-neo-white inline-block px-3 py-1 text-sm font-bold uppercase mb-6">
                Funding For Any Reason
              </div>

              <p className="font-medium text-lg mb-6">
                Best for businesses that need capital immediately and have straightforward financials. Skip the back-and-forth and get underwritten fast.
              </p>

              <ul className="space-y-3 font-bold mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-neo-green border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>
                  Fastest time to funding
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-neo-pink border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>
                  Use capital for any business need
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-neo-blue border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block flex-shrink-0"></span>
                  Direct underwriting path
                </li>
              </ul>
            </div>

            <Link
              href="/apply/fast"
              className="mt-auto block w-full bg-neo-black text-neo-white text-center py-4 text-xl font-black uppercase tracking-wider border-2 border-transparent hover:bg-neo-pink hover:text-neo-white hover:border-neo-black transition-colors shadow-brutal"
            >
              Apply Fast
            </Link>
          </div>
        </div>

        <div className="mt-24 text-center max-w-2xl mx-auto">
           <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 border-b-4 border-neo-black pb-2 inline-block">
             Not sure yet?
           </h3>
           <p className="font-medium text-lg mb-6">
             Browse our directory of vetted operators and reach out to them directly.
           </p>
           <Link
             href="/directory"
             className="inline-block bg-neo-white text-neo-black font-bold border-2 border-neo-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
           >
             Browse Directory
           </Link>
        </div>
      </div>
    </div>
  );
}
