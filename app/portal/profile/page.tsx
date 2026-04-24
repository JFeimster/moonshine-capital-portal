import Link from 'next/link';

export const metadata = {
  title: 'Portal Profile | Moonshine Capital Portal',
  description: 'Broker-facing profile management and completion layer.',
};

const profileChecklist = [
  'Add positioning statement that does not sound like generic broker mush',
  'Assign at least 3 useful tools or resources',
  'Set primary CTA and website destination',
  'Review public profile before sharing it',
];

export default function PortalProfilePage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/portal" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to portal
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-green px-3 py-1 text-xs font-black uppercase tracking-wide">Profile</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Build a profile worth sharing.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This page should help brokers polish positioning, control CTA behavior, assign resources, and preview what the public actually sees.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase tracking-tight">Public profile preview</h2>
            <div className="mt-5 border-4 border-dashed border-neo-black p-6">
              <p className="text-sm font-black uppercase tracking-wide text-neo-black/65">Preview block</p>
              <p className="mt-3 text-base font-medium leading-relaxed text-neo-black/80">
                Replace this with a live preview component once broker profile + assigned resources + tool registry are all wired together.
              </p>
            </div>
          </article>

          <article className="border-4 border-neo-black bg-neo-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase tracking-tight">Completion checklist</h2>
            <ul className="mt-5 space-y-3">
              {profileChecklist.map((item) => (
                <li key={item} className="border-2 border-neo-black bg-neo-yellow px-4 py-3 text-sm font-bold uppercase tracking-wide">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
