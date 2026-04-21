import { NextRequest, NextResponse } from 'next/server';
import { getBrokerBySlug } from '@/lib/brokers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const brokerSlug = searchParams.get('broker');
  const type = searchParams.get('type') || 'apply';
  const source = searchParams.get('source') || 'unknown';

  if (!brokerSlug) {
    return NextResponse.redirect(new URL('/directory', request.url));
  }

  const broker = await getBrokerBySlug(brokerSlug);

  if (!broker) {
    return NextResponse.redirect(new URL('/directory', request.url));
  }

  // Determine destination URL
  let destinationUrl = '/directory'; // Default fallback

  if (type === 'website' && broker.websiteUrl) {
    destinationUrl = broker.websiteUrl;
  } else {
    // Default to primary CTA
    destinationUrl = broker.primaryCta?.url || broker.primaryCtaLink || broker.websiteUrl || '#';
  }

  // Log event (MVP)
  console.log('[Tracking Event]', {
    event: 'cta_click',
    broker: brokerSlug,
    type,
    source,
    destinationUrl,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') || 'unknown',
    referrer: request.headers.get('referer') || 'unknown',
  });

  if (destinationUrl === '#') {
    return NextResponse.redirect(new URL(`/directory/${brokerSlug}`, request.url));
  }

  return NextResponse.redirect(destinationUrl);
}
