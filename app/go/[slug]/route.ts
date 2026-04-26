import { NextResponse } from 'next/server';
import { getRegistryDestination, getToolBySlug } from '@/lib/embed-registry';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const item = await getToolBySlug(params.slug);

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const destination = getRegistryDestination(item);

  if (!destination || destination === '#') {
    return NextResponse.json({ error: 'Missing destination' }, { status: 404 });
  }

  return NextResponse.redirect(new URL(destination, 'http://localhost:3000'));
}
