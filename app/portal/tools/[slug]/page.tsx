import { getToolBySlug, getToolsByKind } from '@/lib/embed-registry';
import { RegistryDetailPage } from '@/components/portal/RegistryDetailPage';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  const tools = await getToolsByKind('tool');
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function PortalToolDetailPage({ params }: { params: { slug: string } }) {
  const item = await getToolBySlug(params.slug);

  if (!item || item.kind !== 'tool') notFound();

  return <RegistryDetailPage item={item} backHref="/portal/tools" backLabel="Back to tools" />;
}
