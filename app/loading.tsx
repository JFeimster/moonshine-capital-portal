export default function Loading() {
  return (
    <section className="min-h-[60vh] bg-neo-cream px-6 py-16 text-neo-black md:px-12" role="status" aria-live="polite">
      <div className="mx-auto max-w-5xl border-4 border-neo-black bg-neo-white p-8 shadow-brutal md:p-12">
        <span className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          Loading
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Getting the next move ready.
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium">
          Pulling the page together. This should only take a moment.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-24 animate-pulse border-2 border-neo-black bg-neo-cream" />
          ))}
        </div>
      </div>
    </section>
  );
}
