'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[60vh] bg-neo-pink px-6 py-16 text-neo-black md:px-12">
      <div className="mx-auto max-w-4xl border-4 border-neo-black bg-neo-cream p-8 shadow-brutal md:p-12">
        <span className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          Public page error
        </span>
        <h1 className="mt-6 text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Something hit a wall.
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium">
          This page did not load cleanly. Retry the request or head back to the main site.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn-brutal-primary">
            Retry
          </button>
          <a href="/" className="btn-brutal">
            Back home
          </a>
        </div>
      </div>
    </section>
  );
}
