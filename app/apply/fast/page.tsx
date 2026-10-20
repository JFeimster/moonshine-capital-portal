import { TallyFormEmbed } from '@/components/TallyFormEmbed';
import { constructMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata = constructMetadata({
  title: 'Funding Application for Any Reason',
  description: 'Complete the broader business funding application when you are ready to share a more complete request.',
  path: '/apply/fast',
});

export default function FastApplyPage() {
  return (
    <div className="bg-neo-white min-h-screen py-16 px-6 md:px-12 text-neo-black">
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/apply" className="inline-flex items-center gap-2 font-bold hover:text-neo-pink transition-colors mb-8"><span className="text-xl">←</span> Back to all application paths</Link>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Funding for Any Reason</h1>
        <p className="text-lg font-medium max-w-2xl border-l-4 border-neo-pink pl-4 mb-8">Use this broader application if you are ready to provide more detail about the business and funding request. A submission does not guarantee approval or funding.</p>
        <TallyFormEmbed formId="w4R2Ad" title="Funding For Any Reason" description="Share the details of your request for review. Availability and terms depend on provider and applicant review." badgeText="Funding Application" badgeColor="pink" />
      </div>
    </div>
  );
}
