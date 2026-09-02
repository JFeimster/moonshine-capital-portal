import { TallyFormEmbed } from '@/components/TallyFormEmbed';

export function TallyEmbedSection() {
  return (
    <section className="max-w-4xl mx-auto w-full">
      <TallyFormEmbed
        formId="rjM6do"
        title="Create Your Funding Agent Record"
        description="Step 1 is intentionally short: create your Funding Agent identity first. After that, enrich the public profile separately so signup friction stays low and profile publishing remains controlled."
        badgeText="Step 1 — Join"
        badgeColor="yellow"
      />
    </section>
  );
}
