'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neo-black text-neo-white">
        <main className="flex min-h-screen items-center justify-center px-6 py-16">
          <div className="w-full max-w-4xl border-4 border-neo-white bg-neo-black p-8 shadow-brutal-white md:p-12">
            <span className="inline-block border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-neo-black">
              Application error
            </span>
            <h1 className="mt-6 text-4xl font-black uppercase tracking-tighter md:text-6xl">
              The app hit a hard stop.
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-neo-cream">
              The interface could not recover normally. Try again or return to the public homepage.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" onClick={reset} className="btn-brutal-primary">
                Try again
              </button>
              <a href="/" className="btn-brutal-dark">
                Go home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
