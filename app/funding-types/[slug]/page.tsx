import { permanentRedirect } from 'next/navigation';
import { getProductFamilyBySlug } from '@/lib/funding-registry';

export default async function FundingTypeCompatibilityPage({ params }: { params: { slug: string } }) {
  const family = await getProductFamilyBySlug(params.slug);
  permanentRedirect(family ? `/funding/${family.slug}` : '/funding');
}
