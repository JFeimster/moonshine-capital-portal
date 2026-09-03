import { permanentRedirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function LegacyBrokerProfilePage({ params }: { params: { slug: string } }) {
  permanentRedirect(`/${encodeURIComponent(params.slug)}`);
}
