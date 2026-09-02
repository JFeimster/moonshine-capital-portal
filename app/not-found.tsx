import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-neo-blue px-6 py-16 text-neo-black md:px-12">
      <div className="mx-auto max-w-5xl border-4 border-neo-black bg-neo-cream p-8 shadow-brutal md:p-12">
        <span className="inline-block border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-[0.2em]">
          404
        </span>
        <h1 className="mt-6 text-5xl font-black uppercase tracking-tighter md:text-7xl">
          Wrong turn.
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium">
          That route does not exist here. Pick a working path and keep moving.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/" className="btn-brutal-primary">
            Home
          </Link>
          <Link href="/directory" className="btn-brutal">
            Partner directory
          </Link>
          <Link href="/apply" className="btn-brutal">
            Apply for funding
          </Link>
        </div>
      </div>
    </section>
  );
}
