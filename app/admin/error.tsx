'use client';

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[60vh] bg-neo-black px-6 py-16 text-neo-white md:px-10">
      <div className="mx-auto max-w-5xl border-4 border-neo-white bg-neo-black p-8 shadow-brutal-white md:p-12">
        <span className="inline-block border-2 border-neo-black bg-neo-red px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-neo-black">
          Admin recovery
        </span>
        <h1 className="mt-6 text-4xl font-black uppercase tracking-tighter md:text-6xl">
          The admin view failed to load.
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-neo-cream">
          No diagnostic details are shown here. Retry the protected view or return to the admin start.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn-brutal-primary">
            Retry admin
          </button>
          <a href="/admin" className="btn-brutal-dark">
            Admin home
          </a>
        </div>
      </div>
    </section>
  );
}
