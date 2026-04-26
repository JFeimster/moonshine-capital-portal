import Link from 'next/link';

export const metadata = {
  title: 'Portal Resources | Moonshine Capital Portal',
  description: 'Broker-facing resource library for scripts, guides, and operating assets.',
};

const resourceBlocks = [
  {
    title: 'Scripts and swipes',
    copy: 'Cold outreach, follow-up copy, funding explainer scripts, and objection handling assets.',
  },
  {
    title: 'Downloads and docs',
    copy: 'Playbooks, checklists, profile-builder guidance, and tool install instructions.',
  },
  {
    title: 'Training and replays',
    copy: 'Onboarding walkthroughs, tactical videos, and the stuff people actually need when they are stuck.',
  },
];

export default function PortalResourcesPage() {
  return (
    <main className="min-h-screen bg-neo-cream px-6 py-10 text-neo-black md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/portal" className="inline-flex border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Back to portal
        </Link>

        <section className="border-4 border-neo-black bg-neo-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          <span className="border-2 border-neo-black bg-neo-pink px-3 py-1 text-xs font-black uppercase tracking-wide">Resources</span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Resource library, not digital clutter.</h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-neo-black/80">
            This should become the broker-facing vault for scripts, downloads, training replays, and operating assets. A real enablement layer. Not random crumbs in old chats.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {resourceBlocks.map((block) => (
            <article key={block.title} className="border-4 border-neo-black bg-neo-white p-5 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight">{block.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neo-black/75">{block.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
