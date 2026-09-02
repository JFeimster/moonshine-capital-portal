export default function DirectoryLoading() {
  return (
    <div className="min-h-screen bg-neo-white text-neo-black" role="status" aria-live="polite">
      <section className="border-b-4 border-neo-green bg-neo-black px-6 py-16 text-neo-white md:px-12">
        <div className="mx-auto max-w-7xl">
          <span className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-neo-black">
            Loading directory
          </span>
          <h1 className="mt-6 text-5xl font-black uppercase tracking-tighter md:text-7xl">
            Finding the right operators.
          </h1>
          <p className="mt-4 max-w-2xl text-xl font-medium text-neo-cream/90">
            Loading approved partner profiles and discovery filters.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-2 md:px-12 lg:grid-cols-3" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="animate-pulse border-4 border-neo-black bg-neo-cream p-6 shadow-brutal">
            <div className="h-6 w-2/3 border-2 border-neo-black bg-neo-yellow" />
            <div className="mt-4 h-4 w-1/2 bg-neo-black/20" />
            <div className="mt-6 h-20 border-2 border-neo-black bg-neo-white" />
            <div className="mt-6 h-10 w-40 border-2 border-neo-black bg-neo-green" />
          </div>
        ))}
      </section>
    </div>
  );
}
