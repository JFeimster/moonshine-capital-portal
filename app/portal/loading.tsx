export default function PortalLoading() {
  return (
    <section className="min-h-[60vh] bg-neo-cream px-6 py-16 text-neo-black md:px-10" role="status" aria-live="polite">
      <div className="mx-auto max-w-5xl border-4 border-neo-black bg-neo-white p-8 shadow-brutal md:p-12">
        <span className="inline-block border-2 border-neo-black bg-neo-blue px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          Secure workspace
        </span>
        <h1 className="mt-6 text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Loading your workspace.
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium">
          Preparing the protected portal view.
        </p>
        <div className="mt-10 space-y-4" aria-hidden="true">
          <div className="h-16 animate-pulse border-2 border-neo-black bg-neo-yellow" />
          <div className="h-16 animate-pulse border-2 border-neo-black bg-neo-green" />
          <div className="h-16 animate-pulse border-2 border-neo-black bg-neo-pink" />
        </div>
      </div>
    </section>
  );
}
