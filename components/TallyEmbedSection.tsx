export function TallyEmbedSection() {
  return (
    <section className="max-w-4xl mx-auto w-full">
      <div className="bg-neo-cream border-4 border-neo-black p-8 md:p-12 shadow-brutal text-neo-black relative">
        <div className="absolute -top-6 -left-6 bg-neo-yellow border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
          Application Flow
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 mt-4">Partner Intake</h2>
        <p className="font-medium text-lg mb-8 border-l-4 border-neo-pink pl-4">
          Submit your details below. We review all profiles for accuracy and operator experience before publishing to the directory.
        </p>

        {/* Tally Embed Placeholder */}
        <div className="w-full bg-neo-white border-2 border-dashed border-neo-black/50 p-12 text-center rounded-sm">
          <p className="font-bold text-neo-black/60 uppercase tracking-widest mb-4">Tally Form Embed Area</p>
          <div className="inline-block bg-neo-black text-neo-white px-4 py-2 font-mono text-sm">
            &lt;iframe src="https://tally.so/embed/..." /&gt;
          </div>
          <p className="mt-4 text-sm font-medium text-neo-black/60">
            (Swap this container with the actual Tally script/iframe later)
          </p>
        </div>
      </div>
    </section>
  );
}
