'use client';

export default function PortalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[60vh] bg-neo-cream px-6 py-16 text-neo-black md:px-10">
      <div className="mx-auto max-w-5xl border-4 border-neo-black bg-neo-white p-8 shadow-brutal md:p-12">
        <span className="inline-block border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          Portal interrupted
        </span>
        <h1 className="mt-6 text-4xl font-black uppercase tracking-tighter md:text-6xl">
          The workspace did not finish loading.
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium">
          Retry the protected view. If the problem continues, return to the portal start and try again.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn-brutal-primary">
            Retry workspace
          </button>
          <a href="/portal" className="btn-brutal">
            Portal home
          </a>
        </div>
      </div>
    </section>
  );
}
