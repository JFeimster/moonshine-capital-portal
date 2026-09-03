import { getBrokers } from '@/lib/brokers';
import { permanentRedirect } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  const brokers = await getBrokers();
  return brokers.map((broker) => ({ slug: broker.slug }));
}

export default function LegacyBrokerProfilePage({ params }: { params: { slug: string } }) {
  permanentRedirect(`/${encodeURIComponent(params.slug)}`);
}
