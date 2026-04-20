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

        <iframe
          data-tally-src="https://tally.so/embed/mOe658?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
          loading="lazy"
          width="100%"
          height="500"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Join the Directory">
        </iframe>
        <script async src="https://tally.so/widgets/embed.js"></script>
      </div>
    </section>
  );
}
