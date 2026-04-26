import { getToolBySlug, getToolsByKind } from '@/lib/embed-registry';
import { RegistryDetailPage } from '@/components/portal/RegistryDetailPage';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  const resources = await getToolsByKind('resource');
  return resources.map((resource) => ({ slug: resource.slug }));
}

export default async function PortalResourceDetailPage({ params }: { params: { slug: string } }) {
  const item = await getToolBySlug(params.slug);

  if (!item || item.kind !== 'resource') notFound();

  const relatedItems = (await getToolsByKind('resource'))
    .filter((resource) => resource.slug !== item.slug && resource.category === item.category)
    .slice(0, 3);

  return <RegistryDetailPage item={item} backHref="/portal/resources" backLabel="Back to resources" relatedItems={relatedItems} />;
}
