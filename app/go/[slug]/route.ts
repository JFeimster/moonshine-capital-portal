import { NextResponse } from 'next/server';
import { getRegistryDestination, getToolBySlug } from '@/lib/embed-registry';
import { trackRegistryClick } from '@/lib/registry-click-tracking';
import { resolveSafeRedirect } from '@/lib/redirect-safety';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const item = await getToolBySlug(params.slug);

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const destination = getRegistryDestination(item);

  if (!destination || destination === '#') {
    return NextResponse.json({ error: 'Missing destination' }, { status: 404 });
  }

  const redirectUrl = resolveSafeRedirect(destination, request.url);
  if (!redirectUrl) {
    return NextResponse.json({ error: 'Invalid destination' }, { status: 400 });
  }

  await trackRegistryClick({ item, destination: redirectUrl.toString(), request });

  return NextResponse.redirect(redirectUrl);
}
