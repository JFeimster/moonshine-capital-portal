import { NextResponse } from 'next/server';
import { getRegistryDestination, getToolBySlug } from '@/lib/embed-registry';
import { trackRegistryClick } from '@/lib/registry-click-tracking';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const item = await getToolBySlug(params.slug);

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const destination = getRegistryDestination(item);

  if (!destination || destination === '#') {
    return NextResponse.json({ error: 'Missing destination' }, { status: 404 });
  }

  trackRegistryClick({ item, destination, request });

  const redirectUrl = new URL(destination, request.url);

  return NextResponse.redirect(redirectUrl);
}
