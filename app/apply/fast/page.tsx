import { TallyFormEmbed } from '@/components/TallyFormEmbed';
import Link from 'next/link';

export const metadata = {
  title: 'Apply Fast - Funding for Any Reason | Distilled Funding',
  description: 'Apply quickly for business funding for any reason. Skip the fluff and get directly to the capital you need.',
};

export default function FastApplyPage() {
  return (
    <div className="bg-neo-white min-h-screen py-16 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 font-bold hover:text-neo-pink transition-colors mb-8"
        >
          <span className="text-xl">←</span> Back to all application paths
        </Link>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          Speed Application
        </h1>
        <p className="text-xl font-medium max-w-2xl border-l-4 border-neo-pink pl-4 mb-12">
          Get underwritten quickly. This path is for founders who know they need capital and want to skip the line.
        </p>

        <TallyFormEmbed
          formId="w4R2Ad"
          title="Funding For Any Reason"
          description="Complete the application below. We move fast."
          badgeText="Apply Fast"
          badgeColor="pink"
        />
      </div>
    </div>
  );
}
